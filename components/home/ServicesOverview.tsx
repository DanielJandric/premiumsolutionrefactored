import Image from "next/image";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { ServiceCard } from "@/components/shared/ServiceCard";

const services = [
  {
    category: "Gerances & PPE",
    title: "Conciergerie d\u2019immeubles",
    description:
      "Gestion complete des immeubles et PPE : proprete des communs, entretien exterieur, interventions rapides et reporting transparent pour les regies.",
    highlights: [
      "Nettoyage regulier des parties communes",
      "Gestion des sorties d\u2019ordures et locaux techniques",
      "Entretien exterieur et nettoyage haute pression",
      "Interventions de fin de bail pour garantir la remise des cles",
    ],
    imageSrc: "/images/service-conciergerie-immeubles.png",
    imageAlt: "Concierge Premium Solution lustrant le sol d\u2019un hall d\u2019immeuble haut de gamme.",
    tone: "emerald" as const,
  },
  {
    category: "Entreprises & Commerces",
    title: "Conciergerie professionnelle",
    description:
      "Nettoyage premium adapte aux bureaux, commerces et espaces recevant du public. Contrats flexibles et equipe dediee.",
    highlights: [
      "Entretien quotidien ou hebdomadaire des espaces de travail",
      "Gestion des zones sensibles (accueil, sanitaires, vitrerie)",
      "Nettoyage de fin de chantier ou d\u2019evenements",
      "Option ecologique avec produits respectueux de l\u2019environnement",
    ],
    imageSrc: "/images/service-conciergerie-entreprises.png",
    imageAlt: "Equipe Premium Solution entretenant un open space d\u2019entreprise au lever du soleil.",
    tone: "gold" as const,
  },
  {
    category: "Particuliers",
    title: "Nettoyage de fin de bail",
    description:
      "Accompagnement de A a Z pour les demenagements : nettoyage complet avec garantie de resultat et assistance le jour de l\u2019etat des lieux.",
    highlights: [
      "Prise en charge complete du logement",
      "Nettoyage des surfaces, sols, vitres et electromenagers",
      "Option produits ecologiques (+10%)",
      "Equipe presente lors de l\u2019etat des lieux pour la remise",
    ],
    imageSrc: "/images/service-menage-particuliers.png",
    imageAlt: "Intervention Premium Solution chez un particulier avec produits ecologiques.",
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
            <span className="text-foreground">pour chaque besoin de proprete</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Premium Solution accompagne les gerances, entreprises et particuliers a chaque etape : conciergerie au long
            cours, nettoyage de fin de bail garanti, interventions ponctuelles et entretien exterieur.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {services.map((service) => (
            <article key={service.title} className="group flex flex-col gap-5">
              <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-white/85 shadow-[0_24px_60px_-32px_rgba(31,125,96,0.3)] backdrop-blur-lg transition duration-500 group-hover:-translate-y-1 group-hover:border-primary/35 group-hover:shadow-[0_32px_72px_-30px_rgba(31,125,96,0.36)] dark:border-border/40 dark:bg-white/[0.08]">
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
                items={service.highlights}
                tone={service.tone}
              />
            </article>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
