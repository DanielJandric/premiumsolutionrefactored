import Image from "next/image";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const steps = [
  {
    number: "01",
    title: "Contact & qualification",
    description:
      "Nous échangeons par téléphone, formulaire ou chatbot pour cerner votre besoin (gérance, entreprise ou particulier) et planifier la visite technique si nécessaire.",
    imageSrc: "/images/process-step-1.png",
    imageAlt: "Responsable Premium Solution serrant la main d’une cliente dans un hall d’immeuble.",
  },
  {
    number: "02",
    title: "Devis premium personnalisé",
    description:
      "Sophie, notre assistante virtuelle, collecte les informations utiles. Un devis détaillé est généré puis envoyé avec estimation et validité.",
    imageSrc: "/images/process-step-2.png",
    imageAlt: "Nettoyage précis d’une surface de bureau avec les produits Premium Solution.",
  },
  {
    number: "03",
    title: "Intervention & suivi",
    description:
      "Planification rapide, équipe dédiée et contrôle qualité sur site. Rapport d’intervention et suivi régulier assurés par nos coordinateurs.",
    imageSrc: "/images/process-step-3.png",
    imageAlt: "Équipe Premium Solution préparant le matériel dans un appartement lumineux.",
  },
];

export function Process() {
  return (
    <AnimatedSection>
      <div className="section-inner space-y-14">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-eyebrow text-primary/70">Processus premium</p>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Un parcours client fluide du premier contact à la prestation
          </h2>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-6 hidden w-px bg-gradient-to-b from-primary/40 via-primary/15 to-transparent sm:block" />
          <div className="space-y-10">
            {steps.map((step) => (
              <article
                key={step.number}
                className="relative rounded-3xl border border-border/70 bg-white/85 p-6 shadow-[0_24px_60px_-32px_rgba(31,125,96,0.35)] backdrop-blur-md transition duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_32px_72px_-30px_rgba(31,125,96,0.4)] dark:border-border/40 dark:bg-white/[0.05]"
              >
                <div className="grid gap-6 lg:grid-cols-[0.6fr,1fr]">
                  <div className="space-y-5">
                    <div className="flex items-center gap-4">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-lg font-semibold text-primary shadow-inner shadow-primary/15 dark:border-primary/35 dark:bg-primary/25 dark:text-primary-foreground">
                        {step.number}
                      </span>
                      <h3 className="text-xl font-semibold text-foreground dark:text-foreground/90">{step.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                  <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-white/80 shadow-lg shadow-primary/10 dark:border-border/40 dark:bg-white/[0.04]">
                    <Image
                      src={step.imageSrc}
                      alt={step.imageAlt}
                      width={540}
                      height={360}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(16,24,19,0.45)] via-transparent to-transparent" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
