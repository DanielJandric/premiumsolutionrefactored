import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import type { Route } from "next";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  FileText,
  MessageCircle,
  ArrowUpRight,
  ClipboardList,
} from "lucide-react";
import { isCollaboratorAuthenticated } from "@/lib/auth/collaborator";
import {
  getQuoteRequestById,
  type QuoteConversationMessage,
  type QuoteConversationStatus,
} from "@/lib/quotes/service";
import { QuoteFinalizeForm } from "@/app/collaborateurs/demandes/_components/QuoteFinalizeForm";
import { CollaboratorShell } from "@/app/collaborateurs/_components/CollaboratorShell";
import { CollaboratorPageHeader } from "@/app/collaborateurs/_components/CollaboratorPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  in_review: "En revue",
  finalized: "Finalisee",
  sent: "Envoyee",
};

const CONVERSATION_STATUS_LABEL: Record<QuoteConversationStatus, string> = {
  in_progress: "En cours",
  completed: "Terminee",
  abandoned: "Abandonnee",
};

const ROLE_LABEL: Record<QuoteConversationMessage["role"], string> = {
  assistant: "Sophie - Assistant",
  user: "Client",
  system: "Systeme",
};

type AssistantSummary = {
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

export default async function QuoteRequestDetailPage({
  params,
}: {
  params?: Promise<{ id?: string | string[] }>;
}) {
  if (!(await isCollaboratorAuthenticated())) {
    redirect("/collaborateurs/login?unauthorized=1");
  }

  const resolvedParams = params ? await params : undefined;
  const rawRequestId = resolvedParams?.id;
  const requestId = Array.isArray(rawRequestId) ? rawRequestId[0] : rawRequestId;

  if (!requestId) {
    notFound();
  }

  const request = await getQuoteRequestById(requestId);
  if (!request) {
    notFound();
  }

  const assistantSummary = extractAssistantSummary(request.collectedData);

  return (
    <CollaboratorShell active="requests">
      <div className="space-y-10">
        <CollaboratorPageHeader
          icon={<ClipboardList className="h-6 w-6" />}
          title={request.clientName ?? "Fiche demande"}
          description="Analysez les informations recueillies par Sophie, complEtez si besoin puis finalisez le devis client."
          breadcrumbs={[
            { label: "Demandes", href: "/collaborateurs/demandes" },
            { label: request.requestNumber ?? `#${request.id.slice(0, 8)}` },
          ]}
          actions={
            <Button asChild size="sm" variant="outline">
              <Link href={"/collaborateurs/demandes" as Route}>Retour aux demandes</Link>
            </Button>
          }
        />

        <div className="grid gap-6 xl:grid-cols-[1.75fr,1.25fr]">
          <div className="space-y-6">
            <Card className="border-border/70 bg-card/95 shadow-lg shadow-primary/10">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-lg">Informations client</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Recue le {format(new Date(request.createdAt), "dd MMMM yyyy - HH:mm", { locale: fr })}
                  </p>
                </div>
                <Badge variant="secondary">{STATUS_LABEL[request.status] ?? request.status}</Badge>
              </CardHeader>
              <CardContent className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
                <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={request.clientEmail ?? "Non renseigne"} />
                <InfoRow icon={<Phone className="h-4 w-4" />} label="Telephone" value={request.clientPhone ?? "Non renseigne"} />
                <InfoRow icon={<Building2 className="h-4 w-4" />} label="Structure" value={request.clientCompany ?? request.clientType ?? "Non renseigne"} />
                <InfoRow icon={<MapPin className="h-4 w-4" />} label="Adresse" value={request.clientAddress ?? "Non renseignee"} />
                <InfoRow icon={<Calendar className="h-4 w-4" />} label="Delai souhaite" value={request.preferredDate ?? "Non renseigne"} />
                <InfoRow icon={<FileText className="h-4 w-4" />} label="Budget" value={request.budgetRange ?? "Non renseigne"} />
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/95 shadow-lg shadow-primary/10">
              <CardHeader>
                <CardTitle className="text-lg">Besoin exprime</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <InfoLine label="Profil" value={request.clientType ?? "Non precise"} />
                <InfoLine label="Prestation" value={request.serviceType ?? "Non precise"} />
                <InfoLine label="Frequence" value={request.serviceFrequency ?? "Non precise"} />
                <InfoLine
                  label="Surface"
                  value={request.surfaceArea ? `${request.surfaceArea} m2` : "Non precise"}
                />
                <InfoLine label="Localisation" value={request.location ?? "Non renseignee"} />
                <div>
                  <p className="font-medium text-foreground">Notes</p>
                  <p className="mt-1 text-muted-foreground">
                    {request.notes ?? "Aucune note supplementaire."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <QuoteFinalizeForm request={request} />
          </div>

          <div className="space-y-6">
            <ConversationCard
              messages={request.conversation ?? []}
              status={request.conversationRecord?.status}
              updatedAt={request.conversationRecord?.updatedAt}
              summary={assistantSummary}
            />

            <Card className="border-border/70 bg-card/95 shadow-primary/10">
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">1.</strong> Verifier les donnees contact et la prestation avant de generer le devis.
                </p>
                <p>
                  <strong className="text-foreground">2.</strong> Utiliser le formulaire pour renseigner les lignes et generer le PDF.
                </p>
                <p>
                  <strong className="text-foreground">3.</strong> Envoyer le devis au client puis mettre a jour le statut.
                </p>
                <Button asChild variant="outline" className="w-full gap-2">
                  <Link href={"/collaborateurs/demandes" as Route}>
                    Revenir a la liste
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CollaboratorShell>
  );
}

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-1 text-primary/80">{icon}</span>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground/80">{label}</p>
        <p className="text-foreground">{value}</p>
      </div>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="font-medium text-foreground">{label} :</span> {value}
    </p>
  );
}

function ConversationCard({
  messages,
  status,
  updatedAt,
  summary,
}: {
  messages: QuoteConversationMessage[];
  status?: QuoteConversationStatus | null;
  updatedAt?: string | null;
  summary?: AssistantSummary | null;
}) {
  const formattedUpdatedAt =
    updatedAt && updatedAt.length > 0
      ? format(new Date(updatedAt), "dd MMMM yyyy - HH:mm", { locale: fr })
      : null;
  const statusLabel = status ? CONVERSATION_STATUS_LABEL[status] ?? status : null;
  const hasMessages = messages.length > 0;
  const summaryRows = summary ? buildSummaryRows(summary) : [];
  const readyState =
    typeof summary?.ready_for_quote === "boolean" ? summary.ready_for_quote : undefined;

  return (
    <Card className="border-border/70 bg-card/95 shadow-lg shadow-primary/10">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary" />
          <CardTitle className="text-lg">Conversation chatbot</CardTitle>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground/80">
          {statusLabel ? <Badge variant="outline">{statusLabel}</Badge> : null}
          {formattedUpdatedAt ? <span>Mise a jour le {formattedUpdatedAt}</span> : null}
        </div>
      </CardHeader>
      <CardContent>
        {summaryRows.length > 0 ? (
          <div className="mb-6 space-y-3 rounded-2xl border border-border/60 bg-background/70 p-4 text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground/70">
                Resume valide par Sophie
              </p>
              {readyState !== undefined ? (
                <Badge
                  variant={readyState ? "secondary" : "outline"}
                  className={readyState ? undefined : "border-destructive/40 text-destructive"}
                >
                  {readyState ? "Pret pour devis" : "Confirmation requise"}
                </Badge>
              ) : null}
            </div>
            <dl className="grid gap-3 sm:grid-cols-2">
              {summaryRows.map((row) => (
                <div key={row.label} className="space-y-1">
                  <dt className="text-[11px] uppercase tracking-wide text-muted-foreground/60">
                    {row.label}
                  </dt>
                  <dd className="text-foreground">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
        {hasMessages ? (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <ConversationMessage key={message.id ?? `message-${index}`} message={message} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Aucun echange enregistre pour cette demande pour le moment.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ConversationMessage({ message }: { message: QuoteConversationMessage }) {
  const isAssistant = message.role === "assistant";
  const isUser = message.role === "user";

  const alignmentClass = isAssistant ? "justify-start" : isUser ? "justify-end" : "justify-center";
  const bubbleClasses = cn(
    "max-w-[90%] whitespace-pre-wrap rounded-2xl border px-4 py-3 text-sm shadow-sm text-foreground",
    isAssistant && "border-primary/40 bg-primary/10",
    isUser && "border-primary/60 bg-primary text-primary-foreground",
    message.role === "system" && "border-border/60 border-dashed bg-background/80 text-muted-foreground",
  );

  return (
    <div className={cn("flex w-full", alignmentClass)}>
      <div className={bubbleClasses}>
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground/80">
          {ROLE_LABEL[message.role] ?? message.role}
        </p>
        <p className="mt-1">{message.content}</p>
      </div>
    </div>
  );
}

function extractAssistantSummary(input?: Record<string, unknown>): AssistantSummary | null {
  if (!input || typeof input !== "object" || input === null) {
    return null;
  }

  const raw = (input as Record<string, unknown>)["assistantSummary"];
  if (!raw || typeof raw !== "object" || raw === null) {
    return null;
  }

  const source = raw as Record<string, unknown>;

  const getString = (key: string) => {
    const value = source[key];
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    }
    return undefined;
  };

  const getNumber = (key: string) => {
    const value = source[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    return undefined;
  };

  return {
    ready_for_quote:
      typeof source["ready_for_quote"] === "boolean" ? (source["ready_for_quote"] as boolean) : undefined,
    client_type: getString("client_type"),
    client_name: getString("client_name"),
    client_email: getString("client_email"),
    client_phone: getString("client_phone"),
    client_company: getString("client_company"),
    client_address: getString("client_address"),
    service_type: getString("service_type"),
    service_frequency: getString("service_frequency"),
    surface_area: getNumber("surface_area") ?? getString("surface_area"),
    location: getString("location"),
    preferred_date: getString("preferred_date"),
    budget_range: getString("budget_range"),
    notes: getString("notes"),
    metadata:
      typeof source["metadata"] === "object" && source["metadata"] !== null
        ? (source["metadata"] as Record<string, unknown>)
        : undefined,
  };
}

function buildSummaryRows(summary: AssistantSummary) {
  const rows: Array<{ label: string; value: string }> = [];

  const push = (label: string, value?: string) => {
    if (!value || value.trim().length === 0) return;
    rows.push({ label, value });
  };

  push("Profil", summary.client_type);
  push("Nom", summary.client_name);
  push("Email", summary.client_email);
  push("Telephone", summary.client_phone);
  push("Structure", summary.client_company);
  push("Adresse", summary.client_address);
  push("Prestation", summary.service_type);
  push("Frequence", summary.service_frequency);
  push("Surface", formatSurface(summary.surface_area));
  push("Localisation", summary.location);
  push("Delai souhaite", summary.preferred_date);
  push("Budget", summary.budget_range);
  push("Notes", summary.notes);

  return rows;
}

function formatSurface(value?: string | number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return `${value} m2`;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length === 0) return undefined;
    const hasAlpha = /[a-zA-Z]/.test(trimmed);
    if (!hasAlpha && /\d/.test(trimmed)) {
      return `${trimmed} m2`;
    }
    return trimmed;
  }
  return undefined;
}
