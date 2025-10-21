"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import {
  getQuoteRequestById,
  updateQuoteRequestStatus,
  type QuoteRequestStatus,
  createQuoteFromRequest,
} from "@/lib/quotes/service";
import { renderPdfWithPuppeteer } from "@/lib/pdf/renderWithPuppeteer";
import { uploadDocumentToSupabase } from "@/lib/supabase/documents";
import type { CollaboratorDocumentPayload } from "@/lib/documents/types";

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

  await uploadDocumentToSupabase(storagePath, pdfBuffer, {
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
  };
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
