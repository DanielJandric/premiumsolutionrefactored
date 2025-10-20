import Image from "next/image";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const steps = [
  {
    number: "01",
    title: "Contact & qualification",
    description:
      "Nous échangeons par téléphone, formulaire ou chatbot pour cerner votre besoin (gérance, entreprise ou particulier) et planifier la visite technique si nécessaire.",
    imageSrc: "/images/process-step-1.png",
    imageAlt:
      "Responsable Premium Solution serrant la main d’une cliente dans un hall d’immeuble.",
  },
  {
    number: "02",
    title: "Devis premium personnalisé",
    description:
      "Sophie, notre assistante virtuelle, collecte les informations utiles. Un devis détaillé est généré puis envoyé avec estimation et validité.",
    imageSrc: "/images/process-step-2.png",
    imageAlt:
      "Nettoyage précis d’une surface de bureau avec les produits Premium Solution.",
  },
  {
    number: "03",
    title: "Intervention & suivi",
    description:
      "Planification rapide, équipe dédiée et contrôle qualité sur site. Rapport d’intervention et suivi régulier assurés par nos coordinateurs.",
    imageSrc: "/images/process-step-3.png",
    imageAlt:
      "Équipe Premium Solution préparant le matériel dans un appartement lumineux.",
  },
];

export function Process() {
  return (
    <AnimatedSection className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Processus premium
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
          Un parcours client fluide du premier contact à la prestation
        </h2>
      </div>

      <div className="mt-16 space-y-10">
        {steps.map((step) => (
          <div
            key={step.number}
            className="grid gap-8 rounded-3xl border border-border/70 bg-card/90 p-6 shadow-xl shadow-secondary/10 md:grid-cols-[auto,1fr]"
          >
            <div className="flex items-start">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-lg font-semibold text-primary shadow-inner shadow-primary/15">
                {step.number}
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.1fr,1fr]">
              <div>
                <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{step.description}</p>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-primary/20">
                <Image
                  src={step.imageSrc}
                  alt={step.imageAlt}
                  width={480}
                  height={320}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
