"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat, type Message } from "ai/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitQuoteRequestAction, type QuoteRequestSubmission } from "@/app/devis/actions";
import { cn } from "@/lib/utils";

const WELCOME_TEXT =
  "Bonjour ! Je suis Sophie, assistante devis Premium Solution. Decrivez-moi votre besoin de nettoyage ou de conciergerie et je m'occupe de preparer le devis pour l'equipe.";
type SubmissionState = "idle" | "submitting" | "submitted" | "error";

type AssistantSummaryPayload = {
  ready_for_quote?: boolean;
  client_type?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  client_company?: string;
  client_address?: string;
  service_type?: string;
  service_frequency?: string;
  surface_area?: string | number;
  location?: string;
  preferred_date?: string;
  budget_range?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
};

export function QuoteChatBot() {
  const sessionRef = useRef<string>(cryptoId());
  const initialAssistantRef = useRef<Message>(createInitialAssistantMessage());
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);
  const [processedSummaryKey, setProcessedSummaryKey] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
    setMessages,
    stop,
    setInput,
  } = useChat({
    api: "/api/chat",
    initialMessages: [initialAssistantRef.current],
  });

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages, submissionState]);

  useEffect(() => {
    if (submissionState === "submitted") return;
    const assistantMessages = [...messages].reverse().filter((msg) => msg.role === "assistant");
    if (assistantMessages.length === 0) return;

    for (const message of assistantMessages) {
      const parsed = extractSummaryJSON(message.content);
      if (!isSummaryMarkedReady(parsed)) continue;

      const key = JSON.stringify(parsed);
      if (processedSummaryKey === key) return;

      setProcessedSummaryKey(key);
      void handleAutomatedSubmission(parsed, messages);
      break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const handleAutomatedSubmission = async (
    summary: AssistantSummaryPayload,
    transcript: Message[],
  ) => {
    if (submissionState === "submitting" || submissionState === "submitted") return;

    setSubmissionState("submitting");
    setSubmissionError(null);

    try {
      const payload = buildQuoteSubmission(summary, transcript, sessionRef.current);
      const result = await submitQuoteRequestAction(payload);

      if (!result.success) {
        setSubmissionState("error");
        setSubmissionError("Impossible d'enregistrer la demande. Merci de verifier les informations saisies.");
        return;
      }

      setSubmittedRequestId(result.id ?? null);
      setSubmissionState("submitted");
      setSubmissionError(null);
      append({
        id: `sophie-confirm-${result.id}`,
        role: "assistant",
        content:
          "Merci pour toutes ces informations. Votre demande est transmise a l'equipe Premium Solution qui vous recontactera tres rapidement par email. Nous restons disponibles si vous avez la moindre question supplementaire.",
      });
    } catch (error) {
      console.error("Erreur enregistrement devis :", error);
      setSubmissionState("error");
      setSubmissionError(
        "Un probleme technique est survenu lors de l'enregistrement. Vous pouvez reessayer ou contacter directement l'equipe au +41766074682.",
      );
    }
  };

  const handleManualSubmit = () => {
    if (!input.trim()) return;
    handleSubmit();
  };

  const resetConversation = () => {
    setSubmissionState("idle");
    setSubmissionError(null);
    setSubmittedRequestId(null);
    setProcessedSummaryKey(null);
    const freshAssistantMessage = createInitialAssistantMessage();
    initialAssistantRef.current = freshAssistantMessage;
    setMessages([freshAssistantMessage]);
    setInput("");
    sessionRef.current = cryptoId();
  };

  const waitingForSummary = useMemo(
    () => submissionState !== "submitted" && submissionState !== "error",
    [submissionState],
  );

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-card/95 p-6 shadow-xl shadow-primary/10">
      <div ref={chatContainerRef} className="flex max-h-[520px] flex-col gap-4 overflow-y-auto pr-1">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
        {submissionState === "submitting" && (
          <div className="self-start rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-xs text-primary">
            J&apos;enregistre votre demande...
          </div>
        )}
        {submissionError && (
          <div className="self-start rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs text-destructive">
            {submissionError}
          </div>
        )}
        {submittedRequestId && submissionState === "submitted" && (
          <div className="self-start rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-xs text-primary">
            Demande enregistree. Reference interne : {submittedRequestId}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Textarea
          value={input}
          onChange={handleInputChange}
          rows={waitingForSummary ? 3 : 2}
          placeholder={
            submissionState === "submitted"
              ? "Ajoutez un complement ou posez une question."
              : "Tapez votre reponse ici."
          }
          className="resize-none"
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleManualSubmit();
            }
          }}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" onClick={handleManualSubmit} disabled={isLoading}>
            {isLoading ? "Envoi..." : "Envoyer"}
          </Button>
          <Button type="button" variant="ghost" onClick={stop} disabled={!isLoading}>
            Stopper la reponse
          </Button>
          <Button type="button" variant="ghost" onClick={resetConversation}>
            Nouvelle conversation
          </Button>
          {submittedRequestId ? (
            <span className="text-xs text-muted-foreground">
              Un collaborateur reprend la suite et vous envoie le devis final par email.
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: Message }) {
  const cleanedContent = sanitizeMessageContent(message.content);
  if (!cleanedContent) {
    return null;
  }
  const isAssistant = message.role === "assistant";
  return (
    <div
      className={cn(
        "flex w-full",
        isAssistant ? "justify-start" : "justify-end",
      )}
    >
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm shadow-sm",
          isAssistant
            ? "border border-border/70 bg-background/80 text-foreground"
            : "border border-primary/40 bg-primary text-primary-foreground",
        )}
      >
        {cleanedContent}
      </div>
    </div>
  );
}

function extractSummaryJSON(content: string): AssistantSummaryPayload | null {
  const match = content.match(/```json([\s\S]*?)```/);
  if (!match) return null;
  try {
    return JSON.parse(match[1].trim()) as AssistantSummaryPayload;
  } catch (error) {
    console.error("JSON final illisible :", error);
    return null;
  }
}

function buildQuoteSubmission(
  summary: AssistantSummaryPayload,
  transcript: Message[],
  sessionId: string,
): QuoteRequestSubmission {
  const surface = typeof summary.surface_area === "number" ? summary.surface_area : Number(summary.surface_area);

  return {
    sessionId,
    clientType: normaliseClientType(summary.client_type),
    clientName: summary.client_name ?? "",
    clientEmail: summary.client_email ?? "",
    clientPhone: summary.client_phone ?? "",
    clientCompany: summary.client_company ?? "",
    clientAddress: summary.client_address ?? "",
    serviceType: summary.service_type ?? "",
    serviceFrequency: summary.service_frequency ?? "",
    surfaceArea: Number.isFinite(surface) ? surface : undefined,
    location: summary.location ?? "",
    preferredDate: summary.preferred_date ?? "",
    budgetRange: summary.budget_range ?? "",
    notes: summary.notes ?? "",
    collectedData: {
      assistantSummary: summary,
      metadata: summary.metadata ?? {},
    },
    conversation: transcript
      .filter(isPersistedMessage)
      .map((item) => ({
        id: item.id,
        role: item.role,
        content: sanitizeMessageContent(item.content),
      })),
  };
}

function normaliseClientType(value?: string) {
  if (!value) return "particulier";
  const lowered = value.toLowerCase();
  if (lowered.includes("ger") || lowered.includes("ppe") || lowered.includes("syndic")) return "gerances";
  if (lowered.includes("entre") || lowered.includes("bureau") || lowered.includes("commerce")) return "entreprise";
  return "particulier";
}

function cryptoId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

function createInitialAssistantMessage(): Message {
  return {
    id: `sophie-welcome-${cryptoId()}`,
    role: "assistant",
    content: WELCOME_TEXT,
  };
}

function isPersistedMessage(
  message: Message,
): message is Message & { role: "assistant" | "user" | "system" } {
  if (message.role !== "assistant" && message.role !== "user" && message.role !== "system") {
    return false;
  }
  return sanitizeMessageContent(message.content).length > 0;
}

function sanitizeMessageContent(content: string) {
  if (!content) return "";

  const withoutFencedJson = content.replace(/```json[\s\S]*?```/gi, "").trim();
  if (withoutFencedJson.length === 0) {
    return "";
  }

  const trimmed = withoutFencedJson.trim();
  if (isLikelyJson(trimmed)) {
    return "";
  }

  return trimmed;
}

function isLikelyJson(value: string) {
  const trimmed = value.trim();
  if (
    trimmed.length === 0 ||
    (!trimmed.startsWith("{") && !trimmed.startsWith("["))
  ) {
    return false;
  }

  try {
    JSON.parse(trimmed);
    return true;
  } catch {
    return false;
  }
}

function isSummaryMarkedReady(
  summary: AssistantSummaryPayload | null,
): summary is AssistantSummaryPayload & { ready_for_quote?: boolean } {
  if (!summary) return false;
  if (typeof summary.ready_for_quote === "boolean") {
    return summary.ready_for_quote;
  }
  const hasEmail =
    typeof summary.client_email === "string" && summary.client_email.trim().length > 0;
  const hasService =
    typeof summary.service_type === "string" && summary.service_type.trim().length > 0;
  return hasEmail && hasService;
}










