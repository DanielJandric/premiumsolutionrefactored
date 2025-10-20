import Image from "next/image";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

const services = [
  {
    title: "Conciergerie intégrale d’immeubles",
    description:
      "Entretien quotidien ou hebdomadaire des parties communes, gestion des entrées, parkings, ascenseurs et espaces techniques.",
  },
  {
    title: "Nettoyage de fin de bail garanti",
    description:
      "Remise de clés sereine grâce à une équipe dédiée qui gère le nettoyage complet des appartements sortants et assiste aux états des lieux.",
  },
  {
    title: "Maintenance extérieure",
    description:
      "Soins des espaces verts, désherbage, nettoyage haute pression, traitement des façades et gestion des déchets saisonniers.",
  },
  {
    title: "Reporting & suivi rigoureux",
    description:
      "Compte-rendus digitalisés, photos avant/après et planification des interventions urgentes ou préventives sur simple demande.",
  },
];

const interventions = [
  "Conciergerie quotidienne d’un immeuble résidentiel haut de gamme à Crans-Montana.",
  "Nettoyage complet de parties communes avant livraison de promotions immobilières.",
  "Gestion extérieure et préparation saisonnière des PPE (déneigement, nettoyage de parkings).",
  "Plan d’entretien annuel avec suivi budgétaire pour une régie valaisanne.",
];

export default function GerancesPage() {
  return (
    <div className="space-y-20 pb-24">
      <AnimatedSection className="border-b border-border/70 bg-gradient-to-r from-primary/10 via-background to-accent/20 py-14">
        <div className="container mx-auto px-4">
          <PageHeader
            eyebrow="Gérances & PPE"
            title="Conciergerie premium pour vos immeubles et copropriétés"
            description="Premium Solution accompagne les gérances valaisannes et romandes depuis 2020. Notre équipe de 30 collaborateurs prend en charge l’entretien complet de vos immeubles et PPE, avec un haut niveau d’exigence et une réactivité éprouvée."
            align="center"
          />
          <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr,1fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-lg shadow-primary/5">
                <h3 className="text-xl font-semibold text-foreground">
                  Prestations principales
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {services.map((service) => (
                    <li key={service.title}>
                      <span className="font-semibold text-primary">{service.title}</span>
                      <span className="block">{service.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-6 text-sm text-muted-foreground">
                <p>
                  Vous souhaitez intégrer la dimension écologique dans vos cahiers des
                  charges ? Nos équipes peuvent intervenir avec une gamme complète de
                  produits certifiés, pour seulement +10 % sur le coût de la prestation.
                </p>
              </div>
            </div>
            <div className="relative h-80 overflow-hidden rounded-3xl border border-primary/20 shadow-xl shadow-primary/15">
              <Image
                src="/images/service-conciergerie-immeubles.png"
                alt="Concierge Premium Solution lustrant le sol d’un hall d’immeuble haut de gamme"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 480px"
                priority
              />
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">
              Pourquoi les gérances nous choisissent
            </h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <span className="font-semibold text-primary">Réactivité 24/7 :</span>{" "}
                astreinte pour les urgences (dégâts des eaux, incidents de parties communes, etc.).
              </li>
              <li>
                <span className="font-semibold text-primary">Équipe attitrée :</span>{" "}
                un référent Premium Solution coordonne les interventions et garantit un suivi personnalisé.
              </li>
              <li>
                <span className="font-semibold text-primary">Reporting digital :</span>{" "}
                comptes-rendus partagés avec photos, suivi des demandes et plan d’amélioration continue.
              </li>
              <li>
                <span className="font-semibold text-primary">Excellence garantie :</span>{" "}
                processus de contrôle qualité régulier et formations internes aux standards suisses.
              </li>
            </ul>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">
              Interventions types
            </h3>
            <div className="grid gap-4">
              {interventions.map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-border/60 bg-card/80 p-4 text-sm text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-muted/40 py-16">
        <div className="container mx-auto flex flex-col items-center gap-6 px-4 text-center">
          <h3 className="text-2xl font-semibold text-foreground">
            Besoin d’un partenaire fiable pour vos immeubles ?
          </h3>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Confiez-nous la conciergerie de vos immeubles. Notre chatbot intelligent collecte
            toutes les informations nécessaires afin de générer un devis précis, validé par
            nos coordinateurs avant envoi.
          </p>
          <Button asChild size="lg">
            <a href="/devis">Demander un devis gérance & PPE</a>
          </Button>
        </div>
      </AnimatedSection>
    </div>
  );
}
