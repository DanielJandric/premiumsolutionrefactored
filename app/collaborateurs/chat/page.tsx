import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { isCollaboratorAuthenticated } from "@/lib/auth/collaborator";
import { CollaboratorChatPanel } from "@/app/collaborateurs/chat/_components/CollaboratorChatPanel";
import { Button } from "@/components/ui/button";

export default async function CollaboratorChatPage() {
  if (!(await isCollaboratorAuthenticated())) {
    redirect("/collaborateurs/login?unauthorized=1");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
              Générateur de devis & factures
            </p>
            <h1 className="flex items-center gap-3 text-2xl font-semibold text-foreground sm:text-3xl">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                <MessageSquare className="h-5 w-5" />
              </span>
              Assistant interne Premium Solution
            </h1>
            <p className="text-sm text-muted-foreground">
              Collectez les informations utiles, laissez l’assistante générer le JSON final,
              puis sauvegardez-le directement dans Supabase.
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link href={"/collaborateurs"}>Retour au tableau de bord</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[2fr,1fr]">
          <CollaboratorChatPanel />

          <div className="space-y-4 rounded-3xl border border-border/70 bg-card/95 p-6 shadow-lg shadow-primary/10">
            <h2 className="text-lg font-semibold text-foreground">
              Conseils d’utilisation
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                Fournissez les{" "}
                <span className="font-medium text-foreground">
                  coordonnées complètes du client
                </span>{" "}
                (nom, email, téléphone, adresse).
              </li>
              <li>
                Détaillez les prestations : type de service, quantité, taux horaire ou
                forfait, option écologique.
              </li>
              <li>
                L’assistante délivre un résumé + un bloc <code>JSON</code>.
              </li>
              <li>
                Cliquez sur <span className="font-medium text-foreground">“Enregistrer dans Supabase”</span> pour
                stocker le document dans le bucket <code>documents</code>.
              </li>
            </ul>
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-xs text-muted-foreground">
              Les fichiers générés sont accessibles depuis l’onglet{" "}
              <Link href="/collaborateurs/documents" className="font-semibold text-primary">
                Documents Supabase
              </Link>
              . Vous pouvez ensuite les transformer en PDF ou les envoyer au client.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
