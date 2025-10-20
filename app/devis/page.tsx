import Image from "next/image";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

export default function DevisPage() {
  return (
    <div className="space-y-20 pb-24">
      <AnimatedSection className="border-b border-border/70 bg-gradient-to-tr from-primary/15 via-background to-secondary/20 py-20">
        <div className="container mx-auto px-4">
          <PageHeader
            eyebrow="Devis intelligent"
            title="Obtenez votre devis Premium Solution en quelques minutes"
            description="Sophie, l’assistante virtuelle, collecte les informations essentielles afin de générer un devis PDF personnalisé. Les données sont ensuite validées par notre équipe pour garantir une estimation précise."
            align="center"
          />
        </div>
      </AnimatedSection>

      <AnimatedSection className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">
              Comment fonctionne la demande de devis ?
            </h3>
            <ol className="space-y-4 text-sm text-muted-foreground">
              <li className="rounded-3xl border border-border/60 bg-card/90 p-5 shadow-lg shadow-primary/5">
                <span className="font-semibold text-primary">
                  1. Lancez le chatbot Sophie
                </span>
                <span className="block">
                  Elle se présente et identifie votre profil : gérance, entreprise ou particulier.
                </span>
              </li>
              <li className="rounded-3xl border border-border/60 bg-card/90 p-5 shadow-lg shadow-primary/5">
                <span className="font-semibold text-primary">
                  2. Répondez aux questions ciblées
                </span>
                <span className="block">
                  Surface, fréquence, localisation, besoins spécifiques… Sophie recueille toutes les
                  données utiles sans vous submerger.
                </span>
              </li>
              <li className="rounded-3xl border border-border/60 bg-card/90 p-5 shadow-lg shadow-primary/5">
                <span className="font-semibold text-primary">
                  3. Recevez un devis PDF premium
                </span>
                <span className="block">
                  Le document est généré automatiquement, stocké sur Supabase et envoyé par email après validation
                  de nos coordinateurs.
                </span>
              </li>
            </ol>
            <div className="rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-6 text-sm text-muted-foreground">
              <p>
                Le chatbot arrivera prochainement sur cette page. En attendant, contactez-nous via le formulaire
                ou par téléphone pour une demande personnalisée.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="relative h-64 overflow-hidden rounded-3xl border border-primary/20 shadow-xl shadow-primary/15">
              <Image
                src="/images/process-step-2.png"
                alt="Main nettoyant une surface avec les produits Premium Solution"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 420px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <p className="absolute bottom-4 left-4 max-w-[260px] text-sm font-medium text-white">
                Sophie s’appuie sur des informations précises pour calculer votre devis.
              </p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-lg shadow-primary/5">
              <h4 className="text-lg font-semibold text-foreground">
                Besoin d’un devis immédiat ?
              </h4>
              <p className="mt-3 text-sm text-muted-foreground">
                Notre équipe peut vous rappeler dans l’heure pendant nos horaires d’ouverture. Mentionnez
                « rappel devis » dans le formulaire de contact ou appelez-nous directement.
              </p>
              <Button asChild size="lg" className="mt-5 w-full">
                <a href="/contact">Planifier un appel</a>
              </Button>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
