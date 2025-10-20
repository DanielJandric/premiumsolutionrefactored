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
    imageAlt:
      "Concierge Premium Solution lustrant le sol d’un hall d’immeuble haut de gamme.",
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
    imageAlt:
      "Équipe Premium Solution entretenant un open space d’entreprise au lever du soleil.",
  },
  {
    category: "Particuliers",
    title: "Nettoyage de fin de bail",
    description:
      "Accompagnement de A à Z pour les déménagements : nettoyage complet avec garantie de résultat et assistance le jour de l’état des lieux.",
    items: [
      "Prise en charge complète du logement",
      "Nettoyage des surfaces, sols, vitres et électroménagers",
      "Option produits écologiques (+10%)",
      "Équipe présente lors de l’état des lieux pour la remise",
    ],
    imageSrc: "/images/service-menage-particuliers.png",
    imageAlt:
      "Intervention Premium Solution chez un particulier avec produits écologiques.",
  },
];

export function ServicesOverview() {
  return (
    <AnimatedSection className="container mx-auto px-4 py-24">
      <div className="space-y-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Services premium
        </p>
        <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
          Une expertise multi-segments pour chaque besoin de propreté
        </h2>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground">
          Premium Solution accompagne les gérances, entreprises et particuliers à
          chaque étape : conciergerie au long cours, nettoyage de fin de bail
          garanti, interventions ponctuelles et entretien extérieur.
        </p>
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {services.map(({ imageSrc, imageAlt, ...service }) => (
          <div key={service.title} className="grid gap-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-primary/20 shadow-xl shadow-primary/10">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 360px"
              />
            </div>
            <ServiceCard {...service} />
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
