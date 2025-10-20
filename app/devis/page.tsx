import { QuoteChatBot } from "@/app/devis/_components/QuoteChatBot";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function DevisPage() {
  return (
    <div className="space-y-20 pb-24">
      <AnimatedSection className="border-b border-border/70 bg-gradient-to-tr from-primary/15 via-background to-secondary/20 py-14">
        <div className="container mx-auto px-4">
          <PageHeader
            eyebrow="Devis intelligent"
            title="Obtenez votre devis Premium Solution en quelques minutes"
            description="Sophie, notre assistante virtuelle, collecte les informations clefs avant que nos collaborateurs ne finalisent et n&apos;envoient votre devis PDF personnalise."
            align="center"
          />
        </div>
      </AnimatedSection>

      <AnimatedSection className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">Comment fonctionne la demande de devis ?</h3>
            <ol className="space-y-4 text-sm text-muted-foreground">
              <li className="rounded-3xl border border-border/60 bg-card/90 p-5 shadow-lg shadow-primary/5">
                <span className="font-semibold text-primary">1. Discutez avec Sophie</span>
                <span className="block">
                  Elle identifie votre profil (gerance, entreprise ou particulier) et adapte ses questions.
                </span>
              </li>
              <li className="rounded-3xl border border-border/60 bg-card/90 p-5 shadow-lg shadow-primary/5">
                <span className="font-semibold text-primary">2. Fournissez les informations utiles</span>
                <span className="block">
                  Vos reponses (surface, localisation, contraintes) sont enregistrees et transmises automatiquement a Premium Solution.
                </span>
              </li>
              <li className="rounded-3xl border border-border/60 bg-card/90 p-5 shadow-lg shadow-primary/5">
                <span className="font-semibold text-primary">3. Reception du devis PDF</span>
                <span className="block">
                  Un collaborateur finalise le document, genere le PDF et vous l&apos;envoie par email avec un resume des prestations.
                </span>
              </li>
            </ol>
            <div className="rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-6 text-sm text-muted-foreground">
              <p>
                Besoin d&apos;un echange direct ou d&apos;une estimation urgente ? Lancez la conversation ci-dessous ou contactez-nous au +41766074682.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <QuoteChatBot />
            <div className="relative h-64 overflow-hidden rounded-3xl border border-primary/20 shadow-xl shadow-primary/15">
              <Image
                src="/images/process-step-2.png"
                alt="Collaboratrice Premium Solution preparant une intervention de nettoyage"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 420px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <p className="absolute bottom-4 left-4 max-w-[260px] text-sm font-medium text-white">
                Apres validation, un collaborateur verifie vos informations et finalise le devis PDF personnalise.
              </p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-lg shadow-primary/5">
              <h4 className="text-lg font-semibold text-foreground">Besoin d&apos;un devis immediat ?</h4>
              <p className="mt-3 text-sm text-muted-foreground">
                Contactez-nous par telephone ou planifiez un appel pour un rappel prioritaire.
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

