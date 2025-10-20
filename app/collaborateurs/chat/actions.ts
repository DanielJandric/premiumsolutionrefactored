"use server";

import {
  CollaboratorDocumentPayload,
  CollaboratorDocumentType,
} from "@/lib/documents/types";
import { uploadDocumentToSupabase } from "@/lib/supabase/documents";
import { renderPdfWithPuppeteer } from "@/lib/pdf/renderWithPuppeteer";

interface SaveDocPayload {
  type: CollaboratorDocumentType;
  data: Record<string, unknown>;
}

function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-")
      .slice(0, 80) || "document"
  );
}

function toStringOrUndefined(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

function toNumberOrUndefined(value: unknown) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}

function normalisePayload(
  input: Record<string, unknown>,
  type: CollaboratorDocumentType,
): CollaboratorDocumentPayload {
  const itemsInput = Array.isArray(input.items) ? input.items : [];
  const items = itemsInput.map((item) => {
    if (typeof item !== "object" || item === null) {
      return {};
    }
    const record = item as Record<string, unknown>;
    return {
      description: toStringOrUndefined(record["description"]),
      quantity: toNumberOrUndefined(record["quantity"]),
      unit: toStringOrUndefined(record["unit"]),
      unit_price: toNumberOrUndefined(record["unit_price"]),
      total: toNumberOrUndefined(record["total"]),
    };
  });

  const clientInput =
    typeof input.client === "object" && input.client !== null
      ? (input.client as Record<string, unknown>)
      : {};

  return {
    type,
    reference: toStringOrUndefined(input.reference),
    service_date: toStringOrUndefined(input.service_date),
    items,
    subtotal: toNumberOrUndefined(input.subtotal),
    vat_rate: toNumberOrUndefined(input.vat_rate),
    vat_amount: toNumberOrUndefined(input.vat_amount),
    total_amount: toNumberOrUndefined(input.total_amount),
    payment_terms: toStringOrUndefined(input.payment_terms),
    notes: toStringOrUndefined(input.notes),
    client: {
      name: toStringOrUndefined(clientInput["name"]),
      email: toStringOrUndefined(clientInput["email"]),
      phone: toStringOrUndefined(clientInput["phone"]),
      company: toStringOrUndefined(clientInput["company"]),
      address: toStringOrUndefined(clientInput["address"]),
    },
  };
}

export async function saveDocumentAction(payload: SaveDocPayload) {
  const timestamp = new Date();
  const reference =
    typeof payload.data.reference === "string" && payload.data.reference.trim()
      ? payload.data.reference.trim()
      : `${payload.type}-${timestamp.getTime()}`;

  const documentData = normalisePayload(payload.data, payload.type);
  if (!documentData.reference) {
    documentData.reference = reference;
  }

  const pdfBuffer = await renderPdfWithPuppeteer(documentData);

  const directory = payload.type === "quote" ? "devis" : "factures";
  const filename = `${slugify(reference)}-${timestamp
    .toISOString()
    .slice(0, 19)
    .replace(/[:T]/g, "")}.pdf`;
  const path = `${directory}/${filename}`;

  await uploadDocumentToSupabase(path, pdfBuffer, {
    contentType: "application/pdf",
  });

  return { path };
}

