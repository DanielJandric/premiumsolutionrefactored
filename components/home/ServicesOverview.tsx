import Image from "next/image";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { ServiceCard } from "@/components/shared/ServiceCard";

const services = [
  {
    category: "Gerances & PPE",
    title: "Conciergerie d'immeubles",
    description:
      "Gestion complete des immeubles et PPE : proprete des communs, entretien exterieur, interventions rapides et reporting transparent pour les regies.",
    items: [
      "Nettoyage regulier des parties communes",
      "Gestion des sorties d'ordures et locaux techniques",
      "Entretien exterieur et nettoyage haute pression",
      "Interventions de fin de bail pour garantir la remise des cles",
    ],
    imageSrc: "/images/service-conciergerie-immeubles.png",
    imageAlt: "Concierge Premium Solution lustrant le sol d'un hall d'immeuble haut de gamme.",
  },
  {
    category: "Entreprises & Commerces",
    title: "Conciergerie professionnelle",
    description:
      "Nettoyage premium adapte aux bureaux, commerces et espaces recevant du public. Contrats flexibles (1 ou 3 ans) et equipe dediee.",
    items: [
      "Entretien quotidien ou hebdomadaire des espaces de travail",
      "Gestion des zones sensibles (accueil, sanitaires, vitrerie)",
      "Nettoyage de fin de chantier ou d'evenements",
      "Option ecologique avec produits respectueux de l'environnement",
    ],
    imageSrc: "/images/service-conciergerie-entreprises.png",
    imageAlt: "Equipe Premium Solution entretenant un open space d'entreprise au lever du soleil.",
  },
  {
    category: "Particuliers",
    title: "Nettoyage de fin de bail",
    description:
      "Accompagnement de A a Z pour les demenagements : nettoyage complet avec garantie de resultat et assistance le jour de l'etat des lieux.",
    items: [
      "Prise en charge complete du logement",
      "Nettoyage des surfaces, sols, vitres et electromenagers",
      "Option produits ecologiques (+10%)",
      "Equipe presente lors de l'etat des lieux pour la remise",
    ],
    imageSrc: "/images/service-menage-particuliers.png",
    imageAlt: "Intervention Premium Solution chez un particulier avec produits ecologiques.",
  },
];

export function ServicesOverview() {
  return (
    <AnimatedSection>
      <div className="section-inner space-y-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Services premium</p>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            <span className="text-gradient-animate bg-gradient-to-r from-primary via-secondary to-primary">
              Une expertise multi-segments
            </span>{" "}
            <span className="text-foreground">pour chaque besoin de proprete</span>
          </h2>
          <p className="text-base text-muted-foreground">
            {
              "Premium Solution accompagne les gerances, entreprises et particuliers a chaque etape : conciergerie au long cours, nettoyage de fin de bail garanti, interventions ponctuelles et entretien exterieur."
            }
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ imageSrc, imageAlt, ...service }, index) => (
            <div
              key={service.title}
              className="group grid h-full grid-rows-[auto,1fr] gap-5"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-primary/20 shadow-xl shadow-primary/10 dark:border-primary/35 dark:shadow-primary/20 neon-border">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="h-full w-full object-cover ken-burns"
                  sizes="(max-width: 768px) 100vw, 360px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent transition-opacity group-hover:from-black/30" />
              </div>
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
