import Image from "next/image";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { ServiceCard } from "@/components/shared/ServiceCard";

const services = [
  {
    category: "Gérances & PPE",
    title: "Conciergerie d’immeubles",
    description:
      "Gestion complète des immeubles et PPE : propreté des communs, entretien extérieur, interventions rapides et reporting transparent pour les régies.",
    items: [
      "Nettoyage régulier des parties communes",
      "Gestion des sorties déchets et locaux techniques",
      "Entretien extérieur et nettoyage haute pression",
      "Interventions de fin de bail pour garantir la remise des clés",
    ],
    imageSrc: "/images/service-conciergerie-immeubles.png",
    imageAlt: "Concierge Premium Solution lustrant le sol d’un hall d’immeuble haut de gamme.",
    tone: "emerald" as const,
  },
  {
    category: "Entreprises & Commerces",
    title: "Conciergerie professionnelle",
    description:
      "Nettoyage premium adapté aux bureaux, commerces et espaces recevant du public. Contrats flexibles (1 ou 3 ans) et équipe dédiée.",
    items: [
      "Entretien quotidien ou hebdomadaire des espaces de travail",
      "Gestion des zones sensibles (accueil, sanitaires, vitrerie)",
      "Nettoyage de fin de chantier ou d’événements",
      "Option écologique avec produits respectueux de l’environnement",
    ],
    imageSrc: "/images/service-conciergerie-entreprises.png",
    imageAlt: "Équipe Premium Solution entretenant un open space d’entreprise au lever du soleil.",
    tone: "gold" as const,
  },
  {
    category: "Particuliers",
    title: "Nettoyage de fin de bail",
    description:
      "Accompagnement de A à Z pour les déménagements : nettoyage complet avec garantie de résultat et assistance le jour de l’état des lieux.",
    items: [
      "Prise en charge complète du logement",
      "Nettoyage des surfaces, sols, vitres et électroménagers",
      "Option produits écologiques (+10 %)",
      "Équipe présente lors de l’état des lieux pour la remise",
    ],
    imageSrc: "/images/service-menage-particuliers.png",
    imageAlt: "Intervention Premium Solution chez un particulier avec produits écologiques.",
    tone: "stone" as const,
  },
];

export function ServicesOverview() {
  return (
    <AnimatedSection>
      <div className="section-inner space-y-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-eyebrow text-primary/70">Services premium</p>
          <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
            <span className="text-gradient-animate">Une expertise multi-segments</span>{" "}
            <span className="text-foreground">pour chaque besoin de propreté</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Premium Solution accompagne les gérances, entreprises et particuliers à chaque étape : conciergerie au long
            cours, nettoyage de fin de bail garanti, interventions ponctuelles et entretien extérieur.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {services.map((service) => (
            <article key={service.title} className="group flex flex-col gap-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/70 bg-white/85 shadow-[0_24px_60px_-32px_rgba(31,125,96,0.3)] backdrop-blur-lg transition duration-500 group-hover:-translate-y-1 group-hover:border-primary/35 group-hover:shadow-[0_32px_72px_-30px_rgba(31,125,96,0.36)] dark:border-border/40 dark:bg-white/[0.08]">
                <Image
                  src={service.imageSrc}
                  alt={service.imageAlt}
                  width={480}
                  height={360}
                  className="h-full w-full object-cover saturate-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(16,24,19,0.5)] via-transparent to-transparent" />
              </div>
              <ServiceCard
                category={service.category}
                title={service.title}
                description={service.description}
                items={service.items}
                tone={service.tone}
              />
            </article>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
