import { redirect } from "next/navigation";
import { isCollaboratorAuthenticated } from "@/lib/auth/collaborator";
import { CollaboratorLoginForm } from "@/app/collaborateurs/_components/CollaboratorLoginForm";

export default async function CollaboratorLoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const unauthorized = resolvedSearchParams?.unauthorized === "1";

  if (await isCollaboratorAuthenticated()) {
    redirect("/collaborateurs");
  }

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <div className="container flex justify-center py-24">
        <div className="w-full max-w-xl rounded-3xl border border-border/70 bg-card/95 p-10 shadow-xl shadow-primary/10 backdrop-blur">
          <div className="space-y-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary">
              Espace collaborateurs
            </p>
            <h1 className="text-3xl font-semibold text-foreground">
              Acces securise Premium Solution
            </h1>
            <p className="text-sm text-muted-foreground">
              Entrez le mot de passe interne pour acceder au portail (chatbot devis/factures et documents Supabase).
            </p>
            {unauthorized ? (
              <p className="rounded-md border border-amber-400/50 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                Session expiree ou acces non autorise. Merci de vous reconnecter.
              </p>
            ) : null}
          </div>

          <div className="mt-8">
            <CollaboratorLoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
