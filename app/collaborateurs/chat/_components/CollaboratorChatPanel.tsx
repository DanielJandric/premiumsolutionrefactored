"use client";

import { useMemo, useState, useTransition } from "react";
import { useChat } from "ai/react";
import { MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { saveDocumentAction } from "@/app/collaborateurs/chat/actions";

type StructuredPayload = {
  type?: "quote" | "invoice";
  reference?: string;
  [key: string]: unknown;
};

function extractStructuredPayload(content: string): StructuredPayload | null {
  const match = content.match(/```json\s*([\s\S]*?)```/i);
  if (!match) return null;

  try {
    const parsed = JSON.parse(match[1]);
    if (
      parsed &&
      typeof parsed === "object" &&
      ("type" in parsed || "items" in parsed)
    ) {
      return parsed;
    }
  } catch {
    // ignore parse errors, fallback to null
  }
  return null;
}

export function CollaboratorChatPanel() {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [isSaving, startSaving] = useTransition();

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/collaborateurs/chat",
      maxSteps: 3,
    });

  const handleSave = (messageId: string, payload: StructuredPayload) => {
    if (!payload.type || (payload.type !== "quote" && payload.type !== "invoice")) {
      setFeedback((prev) => ({
        ...prev,
        [messageId]:
          "Impossible de détecter le type de document (attendu: quote ou invoice).",
      }));
      return;
    }

    startSaving(async () => {
      try {
        setPendingId(messageId);
        const docType = payload.type as "quote" | "invoice";
        await saveDocumentAction({
          type: docType,
          data: payload,
        });
        setFeedback((prev) => ({
          ...prev,
          [messageId]: "Document enregistré dans Supabase.",
        }));
      } catch (error) {
        setFeedback((prev) => ({
          ...prev,
          [messageId]:
            error instanceof Error
              ? error.message
              : "Erreur lors de l’enregistrement du document.",
        }));
      } finally {
        setPendingId(null);
      }
    });
  };

  const renderedMessages = useMemo(() => {
    return messages.map((message) => {
      const structured = message.role === "assistant"
        ? extractStructuredPayload(message.content)
        : null;

      return (
        <div
          key={message.id}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[90%] rounded-3xl border px-4 py-3 shadow-sm ${
              message.role === "user"
                ? "border-primary/30 bg-primary text-primary-foreground"
                : "border-border/70 bg-card/95 text-foreground"
            }`}
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide">
              {message.role === "user" ? (
                <>
                  <User className="h-4 w-4" />
                  <span>Collaborateur</span>
                </>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4 text-primary" />
                  <span>Assistant</span>
                </>
              )}
            </div>
            <div className="mt-2 space-y-3 text-sm leading-relaxed">
              {message.content.split("```json")[0]?.split("\n").map((line, idx) => (
                line.trim().length > 0 ? <p key={idx}>{line}</p> : null
              ))}

              {structured ? (
                <Card className="border-primary/40 bg-primary/5 text-left">
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                          Document structuré
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {structured.type === "invoice"
                            ? "Facture prête à être enregistrée"
                            : "Devis prêt à être enregistré"}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isSaving && pendingId === message.id}
                        onClick={() => handleSave(message.id, structured)}
                      >
                        {isSaving && pendingId === message.id
                          ? "Enregistrement..."
                          : "Enregistrer dans Supabase"}
                      </Button>
                    </div>
                    <pre className="max-h-64 overflow-auto rounded-xl bg-background/80 p-3 text-xs text-muted-foreground">
                      {JSON.stringify(structured, null, 2)}
                    </pre>
                    {feedback[message.id] ? (
                      <p className="text-xs text-muted-foreground">
                        {feedback[message.id]}
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </div>
        </div>
      );
    });
  }, [messages, feedback, pendingId, isSaving]);

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex-1 space-y-4 overflow-y-auto rounded-3xl border border-border/70 bg-card/95 p-6 shadow-inner shadow-primary/10">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
            <MessageCircle className="h-10 w-10 text-primary/70" />
            <p>Démarrez la conversation pour préparer un devis ou une facture.</p>
            <p className="max-w-md text-xs">
              Fournissez les informations client (coordonnées, prestation, tarifs). L’assistante générera un
              JSON sauvegardable dans Supabase.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">{renderedMessages}</div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-3xl border border-border/70 bg-card/95 p-5 shadow-lg shadow-primary/10"
      >
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Décrivez la demande client, la prestation effectuée ou les éléments à facturer..."
          rows={4}
          className="resize-none"
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Les réponses finales incluront un JSON à sauvegarder dans Supabase Storage.
          </p>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Génération..." : "Envoyer"}
          </Button>
        </div>
      </form>
    </div>
  );
}

