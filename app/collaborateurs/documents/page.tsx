import { redirect } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FileText, ArrowUpRight } from "lucide-react";
import { isCollaboratorAuthenticated } from "@/lib/auth/collaborator";
import { listSupabaseDocuments } from "@/lib/supabase/documents";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function formatBytes(bytes: number) {
  if (!bytes) return "0 o";
  const units = ["o", "Ko", "Mo", "Go"];
  let index = 0;
  let value = bytes;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export default async function CollaboratorDocumentsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};

  if (!(await isCollaboratorAuthenticated())) {
    redirect("/collaborateurs/login?unauthorized=1");
  }

  let documents: Awaited<ReturnType<typeof listSupabaseDocuments>> = [];
  let fetchError: string | null = null;

  try {
    documents = await listSupabaseDocuments();
  } catch (error) {
    fetchError =
      error instanceof Error
        ? error.message
        : "Impossible de recuperer la liste des documents.";
  }

  const filter =
    typeof resolvedSearchParams?.type === "string"
      ? resolvedSearchParams.type
      : "";

  const filteredDocuments = documents.filter((doc) => {
    if (!filter) return true;
    return doc.path.startsWith(`${filter}/`);
  });

  const counts = documents.reduce(
    (acc, doc) => {
      if (doc.path.startsWith("devis/")) acc.quotes += 1;
      else if (doc.path.startsWith("factures/")) acc.invoices += 1;
      else acc.other += 1;
      return acc;
    },
    { quotes: 0, invoices: 0, other: 0 },
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
              Archives Supabase
            </p>
            <h1 className="flex items-center gap-3 text-2xl font-semibold text-foreground sm:text-3xl">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </span>
              Documents collaborateurs
            </h1>
            <p className="text-sm text-muted-foreground">
              Telechargez les devis, factures et rapports sauvegardes dans le bucket Supabase.
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link href={"/collaborateurs" as Route}>Retour au tableau de bord</Link>
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="rounded-full border border-border/60 bg-card/80 px-3 py-1 font-medium text-foreground">
            Total : {documents.length}
          </span>
          <span className="rounded-full border border-border/60 bg-card/80 px-3 py-1">
            Devis : {counts.quotes}
          </span>
          <span className="rounded-full border border-border/60 bg-card/80 px-3 py-1">
            Factures : {counts.invoices}
          </span>
          <span className="rounded-full border border-border/60 bg-card/80 px-3 py-1">
            Autres : {counts.other}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {[
            { label: "Tous", value: "" },
            { label: "Devis", value: "devis" },
            { label: "Factures", value: "factures" },
          ].map((option) => {
            const linkHref = option.value
              ? {
                  pathname: "/collaborateurs/documents",
                  query: { type: option.value },
                }
              : { pathname: "/collaborateurs/documents" };

            return (
              <Button
                key={option.value}
                variant={option.value === filter ? "default" : "outline"}
                asChild
                size="sm"
              >
                <Link href={linkHref}>{option.label}</Link>
              </Button>
            );
          })}
        </div>

        <div className="mt-8">
          {fetchError ? (
            <div className="rounded-3xl border border-destructive/40 bg-destructive/10 px-4 py-6 text-sm text-destructive">
              {fetchError}
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="rounded-3xl border border-border/70 bg-card/95 px-6 py-12 text-center text-sm text-muted-foreground">
              Aucun document pour le filtre selectionne.
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredDocuments.map((doc) => (
                <Card
                  key={doc.path}
                  className="border-border/60 bg-card/95 shadow-lg shadow-primary/10"
                >
                  <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        {doc.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{doc.path}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(doc.updatedAt), "dd MMMM yyyy - HH:mm", {
                          locale: fr,
                        })}
                        {" • "}
                        {formatBytes(doc.size)}
                      </p>
                    </div>
                    {doc.signedUrl ? (
                      <Button
                        asChild
                        size="sm"
                        className="gap-2"
                        variant="outline"
                      >
                        <a href={doc.signedUrl} target="_blank" rel="noopener">
                          Telecharger
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        URL indisponible
                      </span>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
