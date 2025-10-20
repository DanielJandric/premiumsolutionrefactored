import Link from "next/link";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ClipboardList, ArrowRight } from "lucide-react";
import { isCollaboratorAuthenticated } from "@/lib/auth/collaborator";
import { listQuoteRequests } from "@/lib/quotes/service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  in_review: "En revue",
  finalized: "Finalisé",
  sent: "Envoyé",
};

const STATUS_VARIANT: Record<string, "outline" | "secondary" | "default"> = {
  pending: "outline",
  in_review: "secondary",
  finalized: "default",
  sent: "default",
};

export default async function QuoteRequestsPage() {
  if (!(await isCollaboratorAuthenticated())) {
    redirect("/collaborateurs/login?unauthorized=1");
  }

  const requests = await listQuoteRequests();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background/70 pb-16">
      <header className="border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Demandes de devis</p>
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Suivi des demandes envoyées par le site
            </h1>
            <p className="text-sm text-muted-foreground">
              Consultez les informations collectées par Sophie et assignez-vous les demandes à traiter.
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link href={"/collaborateurs" as Route}>Retour au tableau de bord</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto space-y-8 px-4 py-10">
        {requests.length === 0 ? (
          <Card className="border-border/70 bg-card/95 shadow-sm shadow-primary/5">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Aucune demande pour le moment. Les conversations validées par Sophie apparaîtront ici.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5">
            {requests.map((request) => (
              <Card key={request.id} className="border-border/60 bg-card/95 shadow-sm shadow-primary/5">
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                      <ClipboardList className="h-5 w-5" />
                    </span>
                    <div>
                      <CardTitle className="text-lg">
                        {request.clientName ?? "Client Premium Solution"}
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                          {request.requestNumber ?? `#${request.id.slice(0, 8)}`}
                        </span>
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        Reçu {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true, locale: fr })}
                      </p>
                    </div>
                  </div>
                  <Badge variant={STATUS_VARIANT[request.status] ?? "outline"}>
                    {STATUS_LABEL[request.status] ?? request.status}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground/80">Profil</p>
                      <p className="font-medium text-foreground">
                        {request.clientType ?? "Non précisé"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground/80">Prestation</p>
                      <p className="font-medium text-foreground">
                        {request.serviceType ?? "Non précisé"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground/80">Localisation</p>
                      <p>{request.location ?? "Non communiquée"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground/80">Surface approx.</p>
                      <p>{request.surfaceArea ? `${request.surfaceArea} m²` : "Non communiquée"}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs">
                      <p className="text-muted-foreground/80">Contact</p>
                      <p className="font-medium text-foreground">
                        {request.clientEmail ?? "Email manquant"}
                        {request.clientPhone ? ` · ${request.clientPhone}` : ""}
                      </p>
                    </div>
                    <Button asChild size="sm" className="gap-2">
                      <Link href={`/collaborateurs/demandes/${request.id}` as Route}>
                        Ouvrir la fiche
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
