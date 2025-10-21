import Link from "next/link";
import { redirect } from "next/navigation";
import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  Files,
  ArrowUpRight,
  TrendingUp,
  Clock,
} from "lucide-react";
import { isCollaboratorAuthenticated } from "@/lib/auth/collaborator";
import { listQuoteRequests } from "@/lib/quotes/service";
import { listSupabaseDocuments } from "@/lib/supabase/documents";
import { CollaboratorShell } from "@/app/collaborateurs/_components/CollaboratorShell";
import { CollaboratorPageHeader } from "@/app/collaborateurs/_components/CollaboratorPageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Route } from "next";
import type { ComponentType } from "react";

export const revalidate = 0;
import { cn } from "@/lib/utils";

const QUICK_ACTIONS: {
  title: string;
  description: string;
  href: Route;
  icon: ComponentType<{ className?: string }>;
}[] = [
  {
    title: "Ouvrir l'assistant",
    description: "Collecter une nouvelle demande et generer un devis ou une facture.",
    href: "/collaborateurs/chat" as Route,
    icon: MessageSquare,
  },
  {
    title: "Suivre les demandes",
    description: "Consulter les fiches recues et finaliser les devis avant envoi.",
    href: "/collaborateurs/demandes" as Route,
    icon: ClipboardList,
  },
  {
    title: "Acceder aux documents",
    description: "Rechercher un devis/facture archive dans Supabase Storage.",
    href: "/collaborateurs/documents" as Route,
    icon: Files,
  },
];

export default async function CollaboratorDashboardPage() {
  if (!(await isCollaboratorAuthenticated())) {
    redirect("/collaborateurs/login?unauthorized=1");
  }

  const [quoteRequests, documents] = await Promise.all([
    listQuoteRequests(),
    listSupabaseDocuments(),
  ]);

  const totalRequests = quoteRequests.length;
  const pendingCount = quoteRequests.filter((req) => req.status === "pending").length;
  const inReviewCount = quoteRequests.filter((req) => req.status === "in_review").length;
  const activeCount = pendingCount + inReviewCount;
  const finalizedCount = quoteRequests.filter((req) => req.status === "finalized" || req.status === "sent").length;
  const requestsThisWeek = quoteRequests.filter(
    (req) => differenceInDays(new Date(), new Date(req.createdAt)) <= 7,
  ).length;

  const documentsCount = documents.length;
  const recentDocuments = documents.slice(0, 5);
  const recentRequests = [...quoteRequests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const kpis = [
    {
      slug: "received",
      label: "Demandes recues",
      value: totalRequests,
      helper:
        requestsThisWeek > 0
          ? `+${requestsThisWeek} cette semaine`
          : "Aucune nouvelle cette semaine",
      icon: TrendingUp,
      href: "/collaborateurs/demandes?status=all" as Route,
      cardClass:
        "bg-gradient-to-br from-emerald-50 via-emerald-100 to-white border-emerald-100 shadow-emerald-100/60",
      iconClass: "border-emerald-300 bg-emerald-100 text-emerald-700",
    },
    {
      slug: "active",
      label: "Demandes a traiter",
      value: activeCount,
      helper: `${pendingCount} en attente / ${inReviewCount} en revue`,
      icon: ClipboardList,
      href: "/collaborateurs/demandes?status=active" as Route,
      cardClass:
        "bg-gradient-to-br from-rose-50 via-rose-100 to-white border-rose-100 shadow-rose-100/60",
      iconClass: "border-rose-200 bg-rose-100 text-rose-700",
    },
    {
      slug: "finalized",
      label: "Demandes finalisees",
      value: finalizedCount,
      helper: `${totalRequests === 0 ? 0 : Math.round((finalizedCount / totalRequests) * 100)}% du total`,
      icon: LayoutDashboard,
      href: "/collaborateurs/demandes?status=finalized" as Route,
      cardClass:
        "bg-gradient-to-br from-sky-50 via-sky-100 to-white border-sky-100 shadow-sky-100/60",
      iconClass: "border-sky-200 bg-sky-100 text-sky-700",
    },
    {
      slug: "documents",
      label: "Documents archives",
      value: documentsCount,
      helper: "Dernieres sauvegardes via Supabase Storage",
      icon: Files,
      href: "/collaborateurs/documents?type=devis" as Route,
      cardClass:
        "bg-gradient-to-br from-emerald-100 via-emerald-200 to-white border-emerald-200 shadow-emerald-200/60",
      iconClass: "border-emerald-300 bg-emerald-200 text-emerald-800",
    },
  ];

  return (
    <CollaboratorShell active="dashboard">
      <div className="space-y-10">
        <CollaboratorPageHeader
          icon={<LayoutDashboard className="h-6 w-6" />}
          title="Tableau de bord"
          description="Vue d&apos;ensemble des demandes recues, des actions en cours et des documents archives."
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Link
                key={kpi.label}
                href={kpi.href}
                prefetch
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/40 rounded-3xl"
              >
                <Card
                  className={cn(
                    "border border-border/60 bg-card/95 shadow-lg transition hover:-translate-y-1 hover:shadow-xl",
                    kpi.cardClass,
                  )}
                >
                  <CardContent className="flex flex-col gap-2 px-6 py-5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground/80">
                        {kpi.label}
                      </p>
                      <span
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-xl border bg-primary/10 text-primary transition group-hover:scale-105",
                          kpi.iconClass,
                        )}
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                    </div>
                    <p className="text-3xl font-semibold text-foreground">{kpi.value}</p>
                    <p className="text-xs text-muted-foreground">{kpi.helper}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.title}
                className="group border-border/70 bg-card/95 shadow-xl shadow-primary/10 transition hover:-translate-y-1 hover:border-primary/40"
              >
                <CardContent className="flex h-full flex-col justify-between gap-6 px-6 py-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="text-lg font-semibold text-foreground">{action.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <Button asChild variant="secondary" className="w-full justify-center gap-2">
                    <Link href={action.href}>
                      Acceder
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.8fr,1.2fr]">
          <Card className="border-border/70 bg-card/95 shadow-lg shadow-primary/10">
            <CardContent className="space-y-4 px-6 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Demandes recentes</h3>
                  <p className="text-sm text-muted-foreground">
                    Suivi des derniers formulaires soumis via l&apos;assistant ou le site.
                  </p>
                </div>
                <Button asChild variant="ghost" className="gap-2 text-primary">
                  <Link href={"/collaborateurs/demandes" as Route}>
                    Voir toutes les demandes
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              {recentRequests.length === 0 ? (
                <p className="rounded-2xl border border-border/60 bg-background/70 px-4 py-6 text-sm text-muted-foreground">
                  Aucune demande n&apos;a encore ete enregistree.
                </p>
              ) : (
                <div className="divide-y divide-border/60">
                  {recentRequests.map((request) => (
                    <div key={request.id} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">
                          {request.clientName ?? "Client Premium Solution"}
                          <span className="ml-2 text-xs text-muted-foreground">
                            {request.requestNumber ?? `#${request.id.slice(0, 8)}`}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Recue {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true, locale: fr })}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 justify-end">
                        <span className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
                          {request.clientType ?? "Profil inconnu"}
                        </span>
                        <Button asChild size="sm" variant="outline" className="gap-2">
                          <Link href={`/collaborateurs/demandes/${request.id}` as Route}>
                            Ouvrir
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/95 shadow-lg shadow-primary/10">
            <CardContent className="space-y-4 px-6 py-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Derniers documents archives
                </p>
              </div>
              {recentDocuments.length === 0 ? (
                <p className="rounded-2xl border border-border/60 bg-background/70 px-4 py-6 text-sm text-muted-foreground">
                  Aucun document n&apos;a encore ete sauvegarde dans Supabase.
                </p>
              ) : (
                <div className="space-y-3">
                  {recentDocuments.map((doc) => (
                    <div
                      key={doc.path}
                      className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-sm"
                    >
                      <p className="font-medium text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(doc.updatedAt), "dd MMM yyyy - HH:mm", { locale: fr })}
                      </p>
                      {doc.signedUrl ? (
                        <Button asChild size="sm" variant="ghost" className="mt-2 gap-2 text-primary">
                          <a href={doc.signedUrl} target="_blank" rel="noopener">
                            Telecharger
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </CollaboratorShell>
  );
}
