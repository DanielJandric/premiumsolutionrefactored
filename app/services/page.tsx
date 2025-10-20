import Image from "next/image";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";

const services = [
  {
    name: "Conciergerie d’immeubles et PPE",
    description:
      "Entretien complet des parties communes, gestion des espaces extérieurs, interventions techniques légères et reporting pour les régies.",
    imageSrc: "/images/service-conciergerie-immeubles.png",
    imageAlt:
      "Agent Premium Solution lustrant le sol d’un hall d’immeuble haut de gamme.",
  },
  {
    name: "Nettoyage de fin de bail (garantie remise)",
    description:
      "Nettoyage intégral, assistance à l’état des lieux, option produits écologiques et disponibilité 7j/7 pour les urgences.",
    imageSrc: "/images/service-fin-de-bail.png",
    imageAlt:
      "Équipe Premium Solution réalisant un nettoyage de fin de bail dans une cuisine moderne.",
  },
  {
    name: "Conciergerie d’entreprise",
    description:
      "Entretien des bureaux, espaces d’accueil, zones de production légères et gestion des consommables.",
    imageSrc: "/images/service-conciergerie-entreprises.png",
    imageAlt:
      "Équipe Premium Solution entretenant un open space d’entreprise.",
  },
  {
    name: "Nettoyage de fin de chantier",
    description:
      "Interventions spécialisées pour livrer chantiers, showrooms ou bureaux rénovés avec un rendu impeccable.",
    imageSrc: "/images/service-fin-de-chantier.png",
    imageAlt:
      "Techniciens Premium Solution finalisant un nettoyage de fin de chantier.",
  },
  {
    name: "Facility services",
    description:
      "Services complémentaires : gestion des stocks, petites réparations, coordination fournisseurs et intendance quotidienne.",
    imageSrc: "/images/service-facility.png",
    imageAlt:
      "Responsable facility Premium Solution inspectant une réserve de matériel via tablette.",
  },
  {
    name: "Nettoyage régulier particuliers",
    description:
      "Ménage hebdomadaire ou bimensuel, préparation après événements, services saisonniers et entretien extérieur léger.",
    imageSrc: "/images/service-menage-particuliers.png",
    imageAlt:
      "Intervenante Premium Solution échangeant avec une cliente dans son salon.",
  },
  {
    name: "Nettoyage et entretien extérieurs",
    description:
      "Espaces verts, désherbage, balayage parkings, haute pression et préparations saisonnières.",
    imageSrc: "/images/service-entretien-exterieurs.png",
    imageAlt:
      "Équipe Premium Solution entretenant les extérieurs avec vue sur les montagnes suisses.",
  },
  {
    name: "Nettoyage sur cordes",
    description:
      "Équipes spécialisées pour accès difficiles, façades vitrées, toitures et structures élevées.",
    imageSrc: "/images/service-rope-access.png",
    imageAlt:
      "Techniciens Premium Solution suspendus en rappel pour nettoyer une façade vitrée.",
  },
];

const avantages = [
  "Process qualité strict avec checklists dédiées à chaque type d’intervention.",
  "Équipe stable et formée : 30 collaborateurs Premium Solution basés en Valais.",
  "Option écologique disponible sur l’ensemble du catalogue de services.",
  "Technologies modernes : chatbot pour la qualification, devis et factures PDF automatisés, archivage Supabase.",
];

export default function ServicesPage() {
  return (
    <div className="space-y-20 pb-24">
      <AnimatedSection className="border-b border-border/70 bg-gradient-to-br from-background via-primary/10 to-accent/20 py-20">
        <div className="container mx-auto px-4">
          <PageHeader
            eyebrow="Catalogue de services"
            title="Des prestations premium pour chaque besoin de propreté"
            description="Premium Solution accompagne gérances, entreprises et particuliers avec des prestations sur mesure. Découvrez l’ensemble de notre offre et sélectionnez les services adaptés à vos sites."
            align="center"
          />
        </div>
      </AnimatedSection>

      <AnimatedSection className="container mx-auto px-4">
        <div className="grid gap-6 lg:grid-cols-2">
          {services.map(({ imageSrc, imageAlt, ...service }, index) => (
            <div
              key={service.name}
              className="group flex flex-col gap-4 rounded-3xl border border-border/70 bg-card/90 p-6 shadow-lg shadow-primary/5 transition hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="relative h-44 overflow-hidden rounded-2xl border border-primary/20">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 540px"
                />
              </div>
              <Badge
                variant="secondary"
                className="w-fit bg-primary/10 text-primary shadow-sm"
              >
                Service #{index + 1}
              </Badge>
              <h3 className="text-xl font-semibold text-foreground">{service.name}</h3>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-muted/40 py-20">
        <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[1fr,1.1fr]">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-foreground">
              Pourquoi choisir Premium Solution ?
            </h3>
            <p className="text-base text-muted-foreground">
              Notre structure familiale basée à Lens s’appuie sur une équipe expérimentée,
              équipée de matériel professionnel et pilotée par des coordinateurs
              disponibles. Nous mettons la transparence et la qualité au cœur de chaque
              mission.
            </p>
          </div>
          <ul className="space-y-4 text-sm text-muted-foreground">
            {avantages.map((item) => (
              <li
                key={item}
                className="rounded-3xl border border-border/60 bg-card/80 p-4"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </AnimatedSection>
    </div>
  );
}
