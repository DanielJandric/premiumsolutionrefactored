import Link from "next/link";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <AnimatedSection>
      <div className="section-inner">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-accent to-secondary/20 p-10 shadow-2xl shadow-primary/20 dark:border-primary/40 dark:from-primary/25 dark:via-secondary/20 dark:to-primary/40 dark:shadow-primary/30">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/images/video4_office_portrait.mp4"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/cta-swiss-romande.png"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-primary/40 to-primary/70" />
          <div className="relative flex flex-col gap-8 text-white lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary">
                {"Passage a l\u2019action"}
              </p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Prets pour un partenariat de confiance avec Premium Solution ?
              </h2>
              <p className="text-base text-white/85">
                {
                  "Lancez le chatbot pour obtenir un devis precis ou contactez directement notre equipe. Nous intervenons dans tout le Valais et la Suisse romande avec la meme exigence de qualite."
                }
              </p>
              <p className="text-sm font-medium text-primary/80">
                {"Besoin d\u2019un echange humain ? Appelez-nous au +41 76 607 46 82."}
              </p>
            </div>
            <div className="flex flex-col gap-3 md:flex-row">
              <Button asChild size="lg" className="min-w-[200px] shadow-lg shadow-primary/30">
                <Link href="/devis">Lancer le chatbot devis</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="min-w-[200px] border border-white/40 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
              >
                <Link href="/contact">Planifier un rendez-vous</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
