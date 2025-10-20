"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createQuoteRequest } from "@/lib/quotes/service";

const chatMessageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(["assistant", "user", "system"]),
  content: z.string(),
});

const quoteRequestSchema = z.object({
  sessionId: z.string().optional(),
  clientName: z.string().trim().optional(),
  clientEmail: z.string().trim().email("Adresse email invalide"),
  clientPhone: z.string().trim().optional(),
  clientCompany: z.string().trim().optional(),
  clientAddress: z.string().trim().optional(),
  clientType: z.enum(["gerances", "entreprise", "particulier"]),
  serviceType: z.string().trim().min(1, "Choisissez un service"),
  serviceFrequency: z.string().trim().optional(),
  surfaceArea: z
    .number()
    .min(0)
    .max(100000, "Surface trop élevée")
    .optional()
    .or(
      z
        .string()
        .trim()
        .optional()
        .transform((value) => (value ? Number(value) : undefined))
        .refine((value) => value === undefined || !Number.isNaN(value), "Surface invalide")
        .refine(
          (value) => value === undefined || (typeof value === "number" && value >= 0),
          "Surface invalide",
        ),
    ),
  location: z.string().trim().optional(),
  preferredDate: z.string().trim().optional(),
  budgetRange: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  collectedData: z.record(z.unknown()).optional(),
  conversation: z.array(chatMessageSchema).optional(),
});

export type QuoteRequestSubmission = z.infer<typeof quoteRequestSchema>;

export async function submitQuoteRequestAction(input: QuoteRequestSubmission) {
  const parsed = quoteRequestSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const payload = parsed.data;

  const { id, requestNumber } = await createQuoteRequest({
    sessionId: payload.sessionId,
    clientName: payload.clientName,
    clientEmail: payload.clientEmail,
    clientPhone: payload.clientPhone,
    clientCompany: payload.clientCompany,
    clientAddress: payload.clientAddress,
    clientType: payload.clientType,
    serviceType: payload.serviceType,
    serviceFrequency: payload.serviceFrequency,
    surfaceArea: typeof payload.surfaceArea === "number" ? payload.surfaceArea : undefined,
    location: payload.location,
    preferredDate: payload.preferredDate,
    budgetRange: payload.budgetRange,
    notes: payload.notes,
    collectedData: payload.collectedData,
    conversation: payload.conversation,
  });

  revalidatePath("/collaborateurs/demandes");

  return {
    success: true,
    id,
    requestNumber,
  };
}
