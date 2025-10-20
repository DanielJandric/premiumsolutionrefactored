import Link from "next/link";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MessageSquare, Files, ArrowUpRight, LogOut, ClipboardList } from "lucide-react";
import { isCollaboratorAuthenticated } from "@/lib/auth/collaborator";
import { listSupabaseDocuments } from "@/lib/supabase/documents";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { logoutCollaboratorAction } from "@/app/collaborateurs/actions";

export default async function CollaboratorDashboardPage() {
  if (!(await isCollaboratorAuthenticated())) {
    redirect("/collaborateurs/login?unauthorized=1");
  }

  let recentDocuments: Awaited<ReturnType<typeof listSupabaseDocuments>> = [];
  let documentError: string | null = null;

  try {
    recentDocuments = (await listSupabaseDocuments()).slice(0, 5);
  } catch (error) {
    documentError = error instanceof Error ? error.message : "Impossible de recuperer les documents Supabase.";
  }

  const shortcuts: { title: string; description: string; href: Route; icon: typeof MessageSquare }[] = [
    {
      title: "Chatbot devis & factures",
      description: "Generez des devis et factures instantanes pour les clients Premium Solution.",
      href: "/collaborateurs/chat" as Route,
      icon: MessageSquare,
    },
    {
      title: "Demandes de devis",
      description: "Consultez les demandes recues depuis le site et finalisez les devis avant envoi.",
      href: "/collaborateurs/demandes" as Route,
      icon: ClipboardList,
    },
    {
      title: "Documents Supabase",
      description: "Accedez aux documents archives (devis, factures, rapports) dans le bucket Supabase.",
      href: "/collaborateurs/documents" as Route,
      icon: Files,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/20">
      <header className="border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Portail collaborateurs</p>
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Premium Solution - console interne
            </h1>
            <p className="text-sm text-muted-foreground">
              Generez les devis, suivez les demandes clients et accedez aux documents archives en toute securite.
            </p>
          </div>
          <form action={logoutCollaboratorAction}>
            <Button variant="outline" type="submit" className="gap-2">
              <LogOut className="h-4 w-4" />
              Se deconnecter
            </Button>
          </form>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="grid gap-6 lg:grid-cols-3">
          {shortcuts.map((item) => (
            <Card
              key={item.title}
              className="group relative overflow-hidden border-border/70 bg-card/95 shadow-xl shadow-primary/10 transition hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 opacity-0 transition group-hover:opacity-100" />
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardHeader>
              <CardContent>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-2.5"
                >
                  Ouvrir
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-12 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Derniers documents archives</h2>
              <p className="text-sm text-muted-foreground">
                Acces rapide aux documents stockes dans Supabase Storage.
              </p>
            </div>
            <Button asChild variant="ghost" className="gap-2 text-primary">
              <Link href={"/collaborateurs/documents" as Route}>
                Voir tout
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {documentError ? (
            <div className="rounded-3xl border border-destructive/40 bg-destructive/10 px-4 py-6 text-sm text-destructive">
              {documentError}
            </div>
          ) : recentDocuments.length === 0 ? (
            <div className="rounded-3xl border border-border/60 bg-card/80 px-4 py-6 text-sm text-muted-foreground">
              Aucun document disponible pour le moment. Les fichiers generes via le chatbot ou importes apparaissent ici.
            </div>
          ) : (
            <div className="grid gap-4">
              {recentDocuments.map((doc) => (
                <Card key={doc.path} className="border-border/60 bg-card/90 shadow-sm shadow-primary/5">
                  <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(doc.updatedAt), "dd MMMM yyyy - HH:mm", {
                          locale: fr,
                        })}
                      </p>
                    </div>
                    {doc.signedUrl ? (
                      <Button asChild size="sm" variant="outline">
                        <a href={doc.signedUrl} target="_blank" rel="noopener">
                          Telecharger
                        </a>
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">URL indisponible</span>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
