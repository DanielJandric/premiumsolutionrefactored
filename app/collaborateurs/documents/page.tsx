import { redirect } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FileText, ArrowUpRight, Filter } from "lucide-react";
import { isCollaboratorAuthenticated } from "@/lib/auth/collaborator";
import { listSupabaseDocuments } from "@/lib/supabase/documents";
import { CollaboratorShell } from "@/app/collaborateurs/_components/CollaboratorShell";
import { CollaboratorPageHeader } from "@/app/collaborateurs/_components/CollaboratorPageHeader";
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

  const filters = [
    { label: "Tous", value: "" },
    { label: "Devis", value: "devis" },
    { label: "Factures", value: "factures" },
  ];

  return (
    <CollaboratorShell active="documents">
      <div className="space-y-10">
        <CollaboratorPageHeader
          icon={<FileText className="h-6 w-6" />}
          title="Documents archives"
          description="Retrouvez l&apos;ensemble des devis, factures et rapports generes par l&apos;equipe dans Supabase Storage."
          breadcrumbs={[{ label: "Documents" }]}
          actions={
            <Button asChild size="sm" variant="outline">
              <Link href={"/collaborateurs" as Route}>Retour dashboard</Link>
            </Button>
          }
        />

        <section className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1 font-medium text-foreground">
            Total : {documents.length}
          </span>
          <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1">
            Devis : {counts.quotes}
          </span>
          <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1">
            Factures : {counts.invoices}
          </span>
          <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1">
            Autres : {counts.other}
          </span>
        </section>

        <div className="flex flex-wrap items-center gap-2">
          {filters.map((option) => {
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
                className="gap-2"
              >
                <Link href={linkHref}>
                  <Filter className="h-4 w-4" />
                  {option.label}
                </Link>
              </Button>
            );
          })}
        </div>

        <section>
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
                        {"  "}
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
        </section>
      </div>
    </CollaboratorShell>
  );
}
