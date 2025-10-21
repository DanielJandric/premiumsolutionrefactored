"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import {
  getQuoteRequestById,
  updateQuoteRequestStatus,
  type QuoteRequestStatus,
  createQuoteFromRequest,
  getQuoteById,
} from "@/lib/quotes/service";
import { renderPdfWithPuppeteer } from "@/lib/pdf/renderWithPuppeteer";
import { uploadDocumentToSupabase } from "@/lib/supabase/documents";
import type { CollaboratorDocumentPayload } from "@/lib/documents/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const finalizeSchema = z.object({
  requestId: z.string().uuid(),
  reference: z.string().trim().min(1, "Référence obligatoire"),
  serviceDate: z.string().trim().optional(),
  paymentTerms: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  finalizedBy: z.string().trim().optional(),
  subtotal: z.number().min(0),
  vatRate: z.number().min(0),
  totalAmount: z.number().min(0),
  items: z
    .array(
      z.object({
        description: z.string().min(1),
        quantity: z.number().min(0),
        unit: z.string().optional(),
        unitPrice: z.number().min(0),
      }),
    )
    .min(1, "Ajouter au moins une ligne"),
});

const convertSchema = z.object({
  requestId: z.string().uuid(),
  quoteId: z.string().uuid(),
});

export type ConvertQuoteForm = z.infer<typeof convertSchema>;


export type FinalizeQuoteForm = z.infer<typeof finalizeSchema>;

export async function updateQuoteRequestStatusAction(id: string, status: QuoteRequestStatus) {
  await updateQuoteRequestStatus(id, status);
  revalidatePath("/collaborateurs/demandes");
  revalidatePath(`/collaborateurs/demandes/${id}`);
}

export async function finalizeQuoteAction(input: FinalizeQuoteForm) {
  const parsed = finalizeSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const payload = parsed.data;
  const request = await getQuoteRequestById(payload.requestId);

  if (!request) {
    return {
      success: false,
      errors: { requestId: ["Demande introuvable"] },
    };
  }

  const normalizedReference = ensureReferenceHasYear(payload.reference);
  const normalizedServiceDate = payload.serviceDate ?? new Date().toISOString().slice(0, 10);

  if (!request.clientEmail) {
    return {
      success: false,
      errors: { clientEmail: ["Adresse email manquante"] },
    };
  }

  if (!request.clientType || !request.serviceType) {
    return {
      success: false,
      errors: { serviceType: ["Type de prestation incomplet"] },
    };
  }

  const vatAmount = Number((payload.subtotal * payload.vatRate).toFixed(2));
  const totalAmount = Number(payload.totalAmount.toFixed(2));

  const documentPayload: CollaboratorDocumentPayload = {
    type: "quote",
    reference: normalizedReference,
    service_date: normalizedServiceDate,
    items: payload.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      unit_price: item.unitPrice,
      total: Number((item.quantity * item.unitPrice).toFixed(2)),
    })),
    subtotal: payload.subtotal,
    vat_rate: payload.vatRate,
    vat_amount: vatAmount,
    total_amount: totalAmount,
    payment_terms: payload.paymentTerms,
    notes: payload.notes,
    client: {
      name: request.clientName,
      email: request.clientEmail,
      phone: request.clientPhone,
      company: request.clientCompany,
      address: request.clientAddress,
    },
  };

  const pdfBuffer = await renderPdfWithPuppeteer(documentPayload);
  const safeReference = normalizedReference.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const filename = `${safeReference || "devis"}-${Date.now()}.pdf`;
  const storagePath = `devis/finalises/${filename}`;

  const { signedUrl } = await uploadDocumentToSupabase(storagePath, pdfBuffer, {
    contentType: "application/pdf",
  });

  const quoteRecord = await createQuoteFromRequest({
    requestId: request.id,
    clientName: request.clientName ?? "Client Premium Solution",
    clientEmail: request.clientEmail,
    clientPhone: request.clientPhone,
    clientAddress: request.clientAddress,
    clientCompany: request.clientCompany,
    clientType: request.clientType,
    serviceType: request.serviceType,
    serviceFrequency: request.serviceFrequency,
    surfaceArea: request.surfaceArea,
    location: request.location,
    details: {
      items: documentPayload.items,
      notes: documentPayload.notes,
      payment_terms: documentPayload.payment_terms,
      finalized_by: payload.finalizedBy,
      service_date: normalizedServiceDate,
    },
    subtotal: payload.subtotal,
    taxRate: payload.vatRate,
    taxAmount: vatAmount,
    totalAmount,
    pdfPath: storagePath,
    pdfFilename: filename,
    status: "sent",
    metadata: {
      finalized_by: payload.finalizedBy,
      reference: normalizedReference,
      service_date: normalizedServiceDate,
    },
  });

  await updateQuoteRequestStatus(request.id, "finalized", {
    quoteId: quoteRecord.id as string,
    metadata: {
      finalized_by: payload.finalizedBy,
      reference: normalizedReference,
      service_date: normalizedServiceDate,
    },
  });

  revalidatePath("/collaborateurs/demandes");
  revalidatePath(`/collaborateurs/demandes/${request.id}`);

  return {
    success: true,
    quoteId: quoteRecord.id as string,
    pdfUrl: signedUrl ?? undefined,
    pdfPath: storagePath,
  };
}


export async function convertQuoteToInvoiceAction(input: ConvertQuoteForm) {
  const parsed = convertSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Conversion impossible : donnees invalides.",
    };
  }

  const { requestId, quoteId } = parsed.data;

  try {
    const request = await getQuoteRequestById(requestId);
    if (!request) {
      return { success: false, error: "Demande introuvable." };
    }

    if (request.quoteId && request.quoteId !== quoteId) {
      return {
        success: false,
        error: "Le devis indique ne correspond pas a cette demande.",
      };
    }

    const quote = await getQuoteById(quoteId);
    if (!quote) {
      return { success: false, error: "Devis introuvable." };
    }

    if (quote.requestId && quote.requestId !== request.id) {
      return {
        success: false,
        error: "Ce devis n'est pas lie a la demande selectionnee.",
      };
    }

    const details = (quote.details ?? {}) as Record<string, unknown>;
    const rawItems = Array.isArray(details["items"])
      ? (details["items"] as Array<Record<string, unknown>>)
      : [];

    const invoiceItems = rawItems
      .map((item) => {
        if (!item || typeof item !== "object") {
          return null;
        }
        const record = item as Record<string, unknown>;
        const description =
          typeof record["description"] === "string"
            ? (record["description"] as string)
            : undefined;
        const quantity = toOptionalNumber(record["quantity"]);
        const unit =
          typeof record["unit"] === "string" ? (record["unit"] as string) : undefined;
        const unitPrice = toOptionalNumber(
          record["unit_price"] ?? record["unitPrice"],
        );
        const totalValue = toOptionalNumber(record["total"]);
        const computedTotal =
          totalValue ??
          (typeof quantity === "number" && typeof unitPrice === "number"
            ? Number((quantity * unitPrice).toFixed(2))
            : undefined);

        if (!description) {
          return null;
        }

        return {
          description,
          quantity,
          unit,
          unit_price: unitPrice,
          total: computedTotal,
        };
      })
      .filter(
        (
          item,
        ): item is {
          description: string;
          quantity?: number;
          unit?: string;
          unit_price?: number;
          total?: number;
        } => Boolean(item),
      );

    if (invoiceItems.length === 0) {
      return {
        success: false,
        error: "Impossible de convertir : aucune ligne detectee.",
      };
    }

    const paymentTerms =
      typeof details["payment_terms"] === "string"
        ? (details["payment_terms"] as string)
        : "Paiement a 30 jours net";

    const serviceDate =
      typeof details["service_date"] === "string"
        ? (details["service_date"] as string)
        : new Date().toISOString().slice(0, 10);

    const notes =
      typeof details["notes"] === "string" ? (details["notes"] as string) : undefined;

    const supabase = createSupabaseServerClient();
    const { data: invoiceNumberData, error: invoiceNumberError } =
      await supabase.rpc("generate_invoice_number");

    if (invoiceNumberError) {
      throw invoiceNumberError;
    }

    const invoiceNumber =
      typeof invoiceNumberData === "string" && invoiceNumberData.trim().length > 0
        ? invoiceNumberData
        : `FAC-${new Date().getFullYear()}-${Date.now()}`;

    const referenceSlug = slugifyReference(invoiceNumber);
    const filename = `${referenceSlug}-converted-${Date.now()}.pdf`;
    const storagePath = `factures/converted/${filename}`;

    const clientName =
      quote.clientName ?? request.clientName ?? "Client Premium Solution";
    const clientPhone = quote.clientPhone ?? request.clientPhone ?? undefined;
    const clientAddress = quote.clientAddress ?? request.clientAddress ?? undefined;

    const documentPayload: CollaboratorDocumentPayload = {
      type: "invoice",
      reference: invoiceNumber,
      service_date: serviceDate,
      items: invoiceItems.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        total: item.total,
      })),
      subtotal: quote.subtotal ?? undefined,
      vat_rate: quote.taxRate ?? undefined,
      vat_amount: quote.taxAmount ?? undefined,
      total_amount: quote.totalAmount ?? undefined,
      payment_terms: paymentTerms,
      notes,
      client: {
        name: clientName,
        email: quote.clientEmail,
        phone: clientPhone,
        company: request.clientCompany ?? undefined,
        address: clientAddress,
      },
    };

    const pdfBuffer = await renderPdfWithPuppeteer(documentPayload);
    const { signedUrl } = await uploadDocumentToSupabase(storagePath, pdfBuffer, {
      contentType: "application/pdf",
    });

    const { data: invoiceRow, error: invoiceInsertError } = await supabase
      .from("invoices")
      .insert({
        invoice_number: invoiceNumber,
        quote_id: quote.id,
        client_name: clientName,
        client_email: quote.clientEmail,
        client_phone: clientPhone ?? null,
        client_address: clientAddress ?? null,
        items: invoiceItems,
        subtotal: quote.subtotal ?? 0,
        tax_rate: quote.taxRate ?? 0,
        tax_amount: quote.taxAmount ?? 0,
        total_amount: quote.totalAmount ?? 0,
        pdf_url: storagePath,
        pdf_filename: filename,
        payment_terms: paymentTerms,
        metadata: {
          source_quote_number: quote.quoteNumber,
          request_id: request.id,
        },
      })
      .select("*")
      .single();

    if (invoiceInsertError) {
      throw invoiceInsertError;
    }

    await supabase.from("quotes").update({ status: "accepted" }).eq("id", quote.id);

    revalidatePath("/collaborateurs/documents");
    revalidatePath(`/collaborateurs/demandes/${request.id}`);
    revalidatePath("/collaborateurs/demandes");

    return {
      success: true,
      invoiceId: (invoiceRow?.id as string) ?? undefined,
      invoiceNumber,
      pdfUrl: signedUrl ?? undefined,
    };
  } catch (error) {
    console.error("Erreur conversion facture:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la conversion en facture.",
    };
  }
}


function ensureReferenceHasYear(reference: string) {
  const year = new Date().getFullYear();
  const trimmed = reference?.trim() ?? "";
  if (trimmed.startsWith(`${year}`)) {
    return trimmed;
  }
  const sanitized = trimmed.replace(/^[0-9]{4}[-_/]?/, "");
  return `${year}-${sanitized || "reference"}`;
}


function slugifyReference(reference: string) {
  const slug = reference
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug.length > 0 ? slug : "document";
}

function toOptionalNumber(value: unknown): number | undefined {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Number(numeric) : undefined;
}
