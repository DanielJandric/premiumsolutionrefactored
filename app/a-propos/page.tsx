import Image from "next/image";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { PageHeader } from "@/components/shared/PageHeader";

const valeurs = [
  {
    title: "Excellence",
    description:
      "Processus qualité strict, contrôles réguliers et formation continue de nos 30 collaborateurs.",
  },
  {
    title: "Fiabilité",
    description:
      "Planning maîtrisé, astreinte pour urgences et interlocuteur unique pour chaque client.",
  },
  {
    title: "Réactivité",
    description:
      "Capacité d’intervention rapide dans tout le Valais et la Suisse romande, même pour les besoins impromptus.",
  },
  {
    title: "Engagement écologique",
    description:
      "Produits éco-responsables disponibles sur l’ensemble de nos prestations et procédures respectueuses.",
  },
];

const timeline = [
  {
    year: "2020",
    title: "Création de Premium Solution",
    description:
      "Fondation de l’entreprise à Lens avec une équipe de concierges expérimentés et une orientation premium.",
  },
  {
    year: "2021-2022",
    title: "Déploiement Suisse romande",
    description:
      "Ouverture de nouveaux contrats dans le Valais, Vaud et Genève. Introduction de l’option écologique sur toutes les prestations.",
  },
  {
    year: "2023",
    title: "Automatisation & digitalisation",
    description:
      "Mise en place du chatbot Sophie, génération automatique des devis/factures PDF et archivage sécurisé Supabase.",
  },
  {
    year: "2024+",
    title: "Élargissement de l’offre",
    description:
      "Renforcement des équipes spécialisées (fin de chantier, nettoyage sur cordes) et accompagnement des régies dans leurs projets immobiliers.",
  },
];

export default function AproposPage() {
  return (
    <div className="space-y-20 pb-24">
      <AnimatedSection className="border-b border-border/70 bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-20">
        <div className="container mx-auto px-4">
          <PageHeader
            eyebrow="À propos"
            title="Premium Solution, partenaire propreté depuis 2020"
            description="Basée à Lens, Premium Solution accompagne gérances, entreprises et particuliers dans toute la Suisse romande. Nous combinons exigence suisse, technologies modernes et services humains pour offrir une expérience de conciergerie haut de gamme."
            align="center"
          />
        </div>
      </AnimatedSection>

      <AnimatedSection className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">
              Une équipe de 30 collaborateurs qualifiés
            </h3>
            <p className="text-sm text-muted-foreground">
              Premium Solution s’appuie sur une équipe polyvalente : concierges, spécialistes
              fin de bail, agents d’entretien vitres et techniciens accès difficiles. Chaque
              mission est pilotée par un coordinateur qui garantit la qualité et la
              communication avec nos clients.
            </p>
            <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 text-sm text-muted-foreground">
              <p>
                Nous investissons dans la formation continue : sécurité, gestes professionnels,
                produits écologiques et relation client. Résultat : des équipes stables, en
                uniforme Premium Solution, qui incarnent nos valeurs sur le terrain.
              </p>
            </div>
          </div>
          <div className="relative h-80 overflow-hidden rounded-3xl border border-primary/20 shadow-xl shadow-primary/15">
            <Image
              src="/images/hero-professional.png"
              alt="Collaboratrice Premium Solution prête pour une intervention"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 460px"
              priority
            />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="container mx-auto px-4">
        <div className="rounded-3xl border border-border/60 bg-card/90 p-8 shadow-lg shadow-primary/5">
          <h3 className="text-2xl font-semibold text-foreground">Nos valeurs</h3>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {valeurs.map((valeur) => (
              <div
                key={valeur.title}
                className="space-y-3 rounded-3xl border border-border/60 bg-muted/40 p-5"
              >
                <h4 className="text-lg font-semibold text-primary">{valeur.title}</h4>
                <p className="text-sm text-muted-foreground">{valeur.description}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-semibold text-foreground">
            Une croissance guidée par la satisfaction client
          </h3>
          <div className="mt-8 grid gap-6 lg:grid-cols-4">
            {timeline.map((step) => (
              <div
                key={step.year}
                className="rounded-3xl border border-border/60 bg-card/80 p-5 text-sm text-muted-foreground"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
                  {step.year}
                </p>
                <h4 className="mt-3 text-base font-semibold text-foreground">
                  {step.title}
                </h4>
                <p className="mt-2">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
