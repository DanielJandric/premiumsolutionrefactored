import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquare, ArrowUpRight, ClipboardList } from "lucide-react";
import { isCollaboratorAuthenticated } from "@/lib/auth/collaborator";
import { CollaboratorShell } from "@/app/collaborateurs/_components/CollaboratorShell";
import { CollaboratorPageHeader } from "@/app/collaborateurs/_components/CollaboratorPageHeader";
import { CollaboratorChatPanel } from "@/app/collaborateurs/chat/_components/CollaboratorChatPanel";
import { Button } from "@/components/ui/button";
import type { Route } from "next";

export default async function CollaboratorChatPage() {
  if (!(await isCollaboratorAuthenticated())) {
    redirect("/collaborateurs/login?unauthorized=1");
  }

  return (
    <CollaboratorShell active="chat">
      <div className="space-y-10">
        <CollaboratorPageHeader
          icon={<MessageSquare className="h-6 w-6" />}
          title="Assistant devis & factures"
          description="Collectez les informations clients avec Sophie, puis enregistrez automatiquement les demandes et documents."
          breadcrumbs={[{ label: "Assistant" }]}
          actions={
            <>
              <Button asChild size="sm" variant="outline">
                <Link href={"/collaborateurs" as Route}>Retour dashboard</Link>
              </Button>
              <Button asChild size="sm" className="gap-2" variant="secondary">
                <Link href={"/collaborateurs/demandes" as Route}>
                  Voir les demandes
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <CollaboratorChatPanel />

          <aside className="space-y-6 rounded-3xl border border-border/70 bg-card/95 p-6 shadow-lg shadow-primary/10">
            <section className="space-y-3 text-sm">
              <h3 className="text-base font-semibold text-foreground">Boite a outils express</h3>
              <p className="text-muted-foreground">
                Utilisez ces ressources pour garantir un traitement fluide des demandes generees par l&apos;assistant.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="rounded-2xl border border-border/50 bg-background/60 px-4 py-3">
                  <strong className="text-foreground">1.</strong> Collectez les informations clefs (profil, contact, prestation, contraintes).
                </li>
                <li className="rounded-2xl border border-border/50 bg-background/60 px-4 py-3">
                  <strong className="text-foreground">2.</strong> Verifiez le resume propose par Sophie avant validation finale.
                </li>
                <li className="rounded-2xl border border-border/50 bg-background/60 px-4 py-3">
                  <strong className="text-foreground">3.</strong> Sauvegardez la demande pour alimenter le suivi et les documents Supabase.
                </li>
              </ul>
            </section>

            <div className="rounded-3xl border border-primary/30 bg-primary/10 p-5 text-sm text-primary-foreground">
              <p className="font-medium text-primary-foreground/80">
                Astuce collaborateur
              </p>
              <p className="mt-2 text-primary-foreground/70">
                Lorsque le client confirme, laissez l&apos;assistant enregistrer automatiquement la demande puis ouvrez la fiche detaillee pour finaliser le devis.
              </p>
            </div>

            <Button asChild variant="outline" className="w-full gap-2">
              <Link href={"/collaborateurs/demandes" as Route}>
                Acceder au suivi des demandes
                <ClipboardList className="h-4 w-4" />
              </Link>
            </Button>
          </aside>
        </div>
      </div>
    </CollaboratorShell>
  );
}
