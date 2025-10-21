"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createQuoteRequest } from "@/lib/quotes/service";
import { parseSurfaceArea } from "@/lib/utils";

const surfaceAreaSchema = z
  .union([z.number(), z.string().trim()])
  .optional()
  .transform((value, ctx) => {
    if (value === undefined || value === null || value === "") {
      return undefined;
    }

    const numeric = parseSurfaceArea(value);
    if (numeric === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Surface invalide",
      });
      return z.NEVER;
    }

    if (numeric < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 0,
        inclusive: true,
        type: "number",
        message: "Surface invalide",
      });
      return z.NEVER;
    }

    if (numeric > 100000) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: 100000,
        inclusive: true,
        type: "number",
        message: "Surface trop elevee",
      });
      return z.NEVER;
    }

    return numeric;
  });

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
  surfaceArea: surfaceAreaSchema,
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
    surfaceArea: payload.surfaceArea,
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
