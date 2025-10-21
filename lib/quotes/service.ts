"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type QuoteRequestStatus = "pending" | "in_review" | "finalized" | "sent";

export type QuoteConversationMessage = {
  id?: string;
  role: "assistant" | "user" | "system";
  content: string;
};

export interface QuoteConversationRecord {
  id: string;
  sessionId: string;
  messages: QuoteConversationMessage[];
  collectedData?: Record<string, unknown>;
  status: QuoteConversationStatus;
  quoteId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type QuoteConversationStatus = "in_progress" | "completed" | "abandoned";

export interface QuoteRequestInput {
  sessionId?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientCompany?: string;
  clientAddress?: string;
  clientType?: "gerances" | "entreprise" | "particulier";
  serviceType?: string;
  serviceFrequency?: string;
  surfaceArea?: number;
  location?: string;
  preferredDate?: string;
  budgetRange?: string;
  notes?: string;
  collectedData?: Record<string, unknown>;
  conversation?: QuoteConversationMessage[];
}

export interface QuoteRequestRecord extends QuoteRequestInput {
  id: string;
  requestNumber: string | null;
  status: QuoteRequestStatus;
  quoteId: string | null;
  createdAt: string;
  updatedAt: string;
  finalizedAt: string | null;
  metadata?: Record<string, unknown>;
  conversationRecord?: QuoteConversationRecord | null;
}

export interface QuoteRecord {
  id: string;
  quoteNumber: string;
  requestId: string | null;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  clientAddress: string | null;
  clientType: "gerances" | "entreprise" | "particulier";
  serviceType: string;
  serviceFrequency: string | null;
  surfaceArea: number | null;
  location: string | null;
  details: Record<string, unknown> | null;
  subtotal: number | null;
  taxRate: number | null;
  taxAmount: number | null;
  totalAmount: number | null;
  pdfUrl: string | null;
  pdfFilename: string | null;
  status: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

function generateRequestNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const random = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);
  return `REQ-${year}-${random.padEnd(5, "X")}`;
}

export async function createQuoteRequest(input: QuoteRequestInput) {
  const supabase = createSupabaseServerClient();

  const sessionId = input.sessionId ?? cryptoRandomId();

  let requestNumber = generateRequestNumber();
  let attempts = 0;

  while (attempts < 5) {
    const { data: existing } = await supabase
      .from("quote_requests")
      .select("id")
      .eq("request_number", requestNumber)
      .maybeSingle();

    if (!existing) break;
    requestNumber = generateRequestNumber();
    attempts += 1;
  }

  const { data, error } = await supabase
    .from("quote_requests")
    .insert({
      session_id: sessionId,
      request_number: requestNumber,
      client_name: input.clientName ?? null,
      client_email: input.clientEmail ?? null,
      client_phone: input.clientPhone ?? null,
      client_company: input.clientCompany ?? null,
      client_address: input.clientAddress ?? null,
      client_type: input.clientType ?? null,
      service_type: input.serviceType ?? null,
      service_frequency: input.serviceFrequency ?? null,
      surface_area: typeof input.surfaceArea === "number" ? input.surfaceArea : null,
      location: input.location ?? null,
      preferred_date: input.preferredDate ?? null,
      budget_range: input.budgetRange ?? null,
      collected_data: input.collectedData ?? null,
      notes: input.notes ?? null,
      status: "pending",
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  if (input.conversation && input.conversation.length > 0) {
    try {
      await supabase.from("chat_conversations").insert({
        session_id: sessionId,
        messages: input.conversation,
        collected_data: input.collectedData ?? null,
        status: "completed",
        quote_id: data.id ?? null,
      });
    } catch (conversationError) {
      console.error("Erreur lors de l'enregistrement de la conversation :", conversationError);
    }
  }

  return {
    id: data.id as string,
    requestNumber: (data.request_number as string) ?? requestNumber,
  };
}

export async function listQuoteRequests(status?: QuoteRequestStatus) {
  const supabase = createSupabaseServerClient();

  let query = supabase.from("quote_requests").select("*").order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return (data ?? []).map(mapQuoteRequestRow);
}

export async function getQuoteRequestById(id: string) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.from("quote_requests").select("*").eq("id", id).maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const request = mapQuoteRequestRow(data);

  const conversationRow = await fetchConversationRow(supabase, id, request.sessionId);
  if (conversationRow) {
    const conversationRecord = mapConversationRow(conversationRow);
    request.conversation = conversationRecord.messages;
    request.conversationRecord = conversationRecord;
    if (!request.collectedData && conversationRecord.collectedData) {
      request.collectedData = conversationRecord.collectedData;
    }
  }

  return request;
}

export async function updateQuoteRequestStatus(
  id: string,
  status: QuoteRequestStatus,
  extras?: Partial<{
    notes: string | null;
    metadata: Record<string, unknown> | null;
    quoteId: string | null;
  }>,
) {
  const supabase = createSupabaseServerClient();

  const updates: Record<string, unknown> = {
    status,
    notes: extras?.notes ?? undefined,
    metadata: extras?.metadata ?? undefined,
    quote_id: extras?.quoteId ?? undefined,
  };

  if (status === "finalized" || status === "sent") {
    updates["finalized_at"] = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("quote_requests")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapQuoteRequestRow(data);
}


export async function getQuoteById(id: string) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapQuoteRow(data);
}

export interface QuoteFinalizationInput {
  requestId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientAddress?: string;
  clientCompany?: string;
  clientType: "gerances" | "entreprise" | "particulier";
  serviceType: string;
  serviceFrequency?: string;
  surfaceArea?: number;
  location?: string;
  details?: Record<string, unknown>;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  pdfPath?: string;
  pdfFilename?: string;
  status?: "pending" | "sent" | "accepted" | "declined" | "expired";
  metadata?: Record<string, unknown>;
  validUntil?: string;
}

export async function createQuoteFromRequest(input: QuoteFinalizationInput) {
  const supabase = createSupabaseServerClient();

  const { data: generatedNumber, error: quoteNumberError } = await supabase.rpc("generate_quote_number");
  if (quoteNumberError) {
    throw quoteNumberError;
  }

  const quoteNumber =
    typeof generatedNumber === "string" && generatedNumber.trim().length > 0
      ? generatedNumber
      : `DEV-${new Date().getFullYear()}-${Date.now()}`;

  const { data, error } = await supabase
    .from("quotes")
    .insert({
      quote_number: quoteNumber,
      request_id: input.requestId,
      client_name: input.clientName,
      client_email: input.clientEmail,
      client_phone: input.clientPhone ?? null,
      client_address: input.clientAddress ?? null,
      client_type: input.clientType,
      service_type: input.serviceType,
      service_frequency: input.serviceFrequency ?? null,
      surface_area: typeof input.surfaceArea === "number" ? input.surfaceArea : null,
      location: input.location ?? null,
      details: input.details ?? null,
      subtotal: input.subtotal,
      tax_rate: input.taxRate,
      tax_amount: input.taxAmount,
      total_amount: input.totalAmount,
      pdf_url: input.pdfPath ?? null,
      pdf_filename: input.pdfFilename ?? null,
      status: input.status ?? "pending",
      metadata: input.metadata ?? null,
      valid_until: input.validUntil ?? null,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function fetchConversationRow(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  quoteId: string,
  sessionId?: string,
) {
  const byQuote = await supabase
    .from("chat_conversations")
    .select("id, session_id, messages, collected_data, status, quote_id, created_at, updated_at")
    .eq("quote_id", quoteId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (byQuote.error) {
    throw byQuote.error;
  }

  if (byQuote.data) {
    return byQuote.data;
  }

  if (!sessionId) {
    return null;
  }

  const bySession = await supabase
    .from("chat_conversations")
    .select("id, session_id, messages, collected_data, status, quote_id, created_at, updated_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (bySession.error) {
    throw bySession.error;
  }

  return bySession.data ?? null;
}

function mapQuoteRow(row: Record<string, unknown>): QuoteRecord {
  return {
    id: String(row["id"]),
    quoteNumber: (row["quote_number"] as string) ?? "",
    requestId: (row["request_id"] as string) ?? null,
    clientName: (row["client_name"] as string) ?? "Client Premium Solution",
    clientEmail: (row["client_email"] as string) ?? "",
    clientPhone: (row["client_phone"] as string) ?? null,
    clientAddress: (row["client_address"] as string) ?? null,
    clientType: (row["client_type"] as QuoteRequestInput["clientType"]) ?? "particulier",
    serviceType: (row["service_type"] as string) ?? "Prestation",
    serviceFrequency: (row["service_frequency"] as string) ?? null,
    surfaceArea:
      typeof row["surface_area"] === "number" ? (row["surface_area"] as number) : null,
    location: (row["location"] as string) ?? null,
    details:
      row["details"] && typeof row["details"] === "object"
        ? (row["details"] as Record<string, unknown>)
        : null,
    subtotal:
      typeof row["subtotal"] === "number" ? (row["subtotal"] as number) : null,
    taxRate:
      typeof row["tax_rate"] === "number" ? (row["tax_rate"] as number) : null,
    taxAmount:
      typeof row["tax_amount"] === "number" ? (row["tax_amount"] as number) : null,
    totalAmount:
      typeof row["total_amount"] === "number" ? (row["total_amount"] as number) : null,
    pdfUrl: (row["pdf_url"] as string) ?? null,
    pdfFilename: (row["pdf_filename"] as string) ?? null,
    status: (row["status"] as string) ?? "pending",
    metadata:
      row["metadata"] && typeof row["metadata"] === "object"
        ? (row["metadata"] as Record<string, unknown>)
        : null,
    createdAt: String(row["created_at"]),
    updatedAt: String(row["updated_at"]),
  };
}

function mapQuoteRequestRow(row: Record<string, unknown>): QuoteRequestRecord {
  return {
    id: String(row["id"]),
    requestNumber: (row["request_number"] as string) ?? null,
    status: (row["status"] as QuoteRequestStatus) ?? "pending",
    quoteId: (row["quote_id"] as string) ?? null,
    createdAt: String(row["created_at"]),
    updatedAt: String(row["updated_at"]),
    finalizedAt: row["finalized_at"] ? String(row["finalized_at"]) : null,
    sessionId: (row["session_id"] as string) ?? undefined,
    clientName: (row["client_name"] as string) ?? undefined,
    clientEmail: (row["client_email"] as string) ?? undefined,
    clientPhone: (row["client_phone"] as string) ?? undefined,
    clientCompany: (row["client_company"] as string) ?? undefined,
    clientAddress: (row["client_address"] as string) ?? undefined,
    clientType: (row["client_type"] as QuoteRequestInput["clientType"]) ?? undefined,
    serviceType: (row["service_type"] as string) ?? undefined,
    serviceFrequency: (row["service_frequency"] as string) ?? undefined,
    surfaceArea: typeof row["surface_area"] === "number" ? (row["surface_area"] as number) : undefined,
    location: (row["location"] as string) ?? undefined,
    preferredDate: (row["preferred_date"] as string) ?? undefined,
    budgetRange: (row["budget_range"] as string) ?? undefined,
    notes: (row["notes"] as string) ?? undefined,
    collectedData: (row["collected_data"] as Record<string, unknown>) ?? undefined,
    metadata: (row["metadata"] as Record<string, unknown>) ?? undefined,
  };
}

function mapConversationRow(row: Record<string, unknown>): QuoteConversationRecord {
  return {
    id: String(row["id"]),
    sessionId: String(row["session_id"]),
    messages: normalizeConversationMessages(row["messages"]),
    collectedData: (row["collected_data"] as Record<string, unknown>) ?? undefined,
    status: (row["status"] as QuoteConversationStatus) ?? "in_progress",
    quoteId: row["quote_id"] ? String(row["quote_id"]) : null,
    createdAt: String(row["created_at"]),
    updatedAt: String(row["updated_at"]),
  };
}

function normalizeConversationMessages(input: unknown): QuoteConversationMessage[] {
  if (!Array.isArray(input)) {
    return [];
  }

  const messages: QuoteConversationMessage[] = [];

  for (const item of input) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const raw = item as Record<string, unknown>;
    const role = raw["role"];
    const content = raw["content"];

    if (role !== "assistant" && role !== "user" && role !== "system") {
      continue;
    }

    if (typeof content !== "string") {
      continue;
    }

    const trimmed = content.trim();
    if (trimmed.length === 0) {
      continue;
    }

    const identifier = raw["id"];

    messages.push({
      id: typeof identifier === "string" && identifier.trim().length > 0 ? identifier : undefined,
      role,
      content: trimmed,
    });
  }

  return messages;
}

function cryptoRandomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}
