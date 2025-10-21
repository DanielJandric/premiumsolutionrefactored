import Link from "next/link";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ClipboardList, ArrowUpRight } from "lucide-react";
import { isCollaboratorAuthenticated } from "@/lib/auth/collaborator";
import { listQuoteRequests } from "@/lib/quotes/service";
import { CollaboratorShell } from "@/app/collaborateurs/_components/CollaboratorShell";
import { CollaboratorPageHeader } from "@/app/collaborateurs/_components/CollaboratorPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  in_review: "En revue",
  finalized: "Finalisee",
  sent: "Envoyee",
};

const STATUS_VARIANT: Record<string, "outline" | "secondary" | "default"> = {
  pending: "outline",
  in_review: "secondary",
  finalized: "default",
  sent: "default",
};

type StatusFilter = "all" | "active" | "pending" | "in_review" | "finalized" | "sent";

const STATUS_FILTER_LABEL: Record<StatusFilter, string> = {
  all: "Toutes les demandes",
  active: "Demandes à traiter",
  pending: "Demandes en attente",
  in_review: "Demandes en revue",
  finalized: "Demandes finalisées/envoyées",
  sent: "Demandes envoyées",
};

export default async function QuoteRequestsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  if (!(await isCollaboratorAuthenticated())) {
    redirect("/collaborateurs/login?unauthorized=1");
  }

  const requests = await listQuoteRequests();

  const statusCounters = requests.reduce(
    (acc, request) => {
      acc.total += 1;
      acc[request.status] = (acc[request.status] ?? 0) + 1;
      return acc;
    },
    { total: 0 } as Record<string, number>,
  );

  const rawFilter =
    typeof resolvedSearchParams?.status === "string" ? resolvedSearchParams.status.toLowerCase() : undefined;
  const activeFilter: StatusFilter = (["all", "active", "pending", "in_review", "finalized", "sent"] as const).includes(
    rawFilter as StatusFilter,
  )
    ? (rawFilter as StatusFilter)
    : "all";

  const filteredRequests = requests.filter((request) => {
    switch (activeFilter) {
      case "pending":
        return request.status === "pending";
      case "in_review":
        return request.status === "in_review";
      case "active":
        return request.status === "pending" || request.status === "in_review";
      case "finalized":
        return request.status === "finalized" || request.status === "sent";
      case "sent":
        return request.status === "sent";
      case "all":
      default:
        return true;
    }
  });

  return (
    <CollaboratorShell active="requests">
      <div className="space-y-10">
        <CollaboratorPageHeader
          icon={<ClipboardList className="h-6 w-6" />}
          title="Demandes clients"
          description="Visualisez les informations remontees par Sophie, assignez-vous les dossiers et finalisez les devis."
          breadcrumbs={[{ label: "Demandes" }]}
          actions={
            <Button asChild size="sm" variant="outline">
              <Link href={"/collaborateurs" as Route}>Retour dashboard</Link>
            </Button>
          }
        />

        <section className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1 font-medium text-foreground">
            Total : {statusCounters.total}
          </span>
          <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1">
            En attente : {statusCounters.pending ?? 0}
          </span>
          <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1">
            En revue : {statusCounters.in_review ?? 0}
          </span>
          <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1">
            Finalisees : {(statusCounters.finalized ?? 0) + (statusCounters.sent ?? 0)}
          </span>
          <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">
            Filtre actif : {STATUS_FILTER_LABEL[activeFilter]}
          </span>
        </section>

        {filteredRequests.length === 0 ? (
          <Card className="border-border/70 bg-card/95 shadow-sm shadow-primary/5">
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              {requests.length === 0
                ? "Aucune demande n'est disponible pour le moment. Lorsqu'un prospect valide son resume, la fiche apparait ici."
                : "Aucune demande ne correspond au filtre sélectionné."}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="border-border/60 bg-card/95 shadow-md shadow-primary/10">
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                      <ClipboardList className="h-5 w-5" />
                    </span>
                    <div>
                      <CardTitle className="text-lg text-foreground">
                        {request.clientName ?? "Client Premium Solution"}
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                          {request.requestNumber ?? `#${request.id.slice(0, 8)}`}
                        </span>
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        Recue {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true, locale: fr })}
                      </p>
                    </div>
                  </div>
                  <Badge variant={STATUS_VARIANT[request.status] ?? "outline"}>
                    {STATUS_LABEL[request.status] ?? request.status}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <InfoItem label="Profil" value={request.clientType ?? "Non precise"} />
                    <InfoItem label="Prestation" value={request.serviceType ?? "Non precise"} />
                    <InfoItem label="Localisation" value={request.location ?? "Non communiquee"} />
                    <InfoItem
                      label="Surface approx."
                      value={request.surfaceArea ? `${request.surfaceArea} m2` : "Non communiquee"}
                    />
                    <InfoItem label="Email" value={request.clientEmail ?? "Email manquant"} />
                    <InfoItem label="Telephone" value={request.clientPhone ?? "Non communique"} />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-muted-foreground">
                      <p>Notes</p>
                      <p className="font-medium text-foreground">
                        {request.notes ? request.notes.slice(0, 120) : "Aucune note ajoutee"}
                      </p>
                    </div>
                    <Button asChild size="sm" className="gap-2">
                      <Link href={`/collaborateurs/demandes/${request.id}` as Route}>
                        Ouvrir la fiche
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </CollaboratorShell>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground/70">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );
}
