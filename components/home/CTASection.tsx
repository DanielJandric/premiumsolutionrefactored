import Image from "next/image";
import Link from "next/link";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <AnimatedSection className="container mx-auto px-4 pb-14">
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-accent to-secondary/20 p-10 shadow-2xl shadow-primary/20">
        <Image
          src="/images/cta-swiss-romande.png"
          alt="Paysage du Valais représentant la zone d’intervention Premium Solution."
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 960px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-primary/40 to-primary/70" />
        <div className="relative flex flex-col gap-6 text-white lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary">
              Passage à l’action
            </p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Prêts pour un partenariat de confiance avec Premium Solution ?
            </h2>
            <p className="text-base text-white/85">
              Lancez le chatbot pour obtenir un devis précis ou contactez directement
              notre équipe. Nous intervenons dans tout le Valais et la Suisse romande
              avec la même exigence de qualité.
            </p>
            <p className="text-sm font-medium text-primary/80">
              Besoin d’un échange humain ? Appelez-nous au +41 76 639 36 53.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <Button
              asChild
              size="lg"
              className="min-w-[200px] shadow-lg shadow-primary/30"
            >
              <Link href="/devis">Lancer le chatbot devis</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="min-w-[200px] border border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              <Link href="/contact">Planifier un rendez-vous</Link>
            </Button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
