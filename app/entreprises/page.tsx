import Image from "next/image";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

const highlights = [
  {
    title: "Bureaux & sièges sociaux",
    details:
      "Entretien quotidien ou hebdomadaire, approvisionnement consommables, nettoyage vitres et gestion des zones sensibles.",
  },
  {
    title: "Commerces & showrooms",
    details:
      "Nettoyage avant ouverture, remise en état après événements, vitrines impeccables et respect des surfaces premium.",
  },
  {
    title: "Espaces industriels légers",
    details:
      "Zones de production ou logistique, planifiées hors heures de pointe, avec protocole HSE adapté.",
  },
  {
    title: "Fin de chantier",
    details:
      "Équipe spécialisée pour livraisons de bureaux ou grandes surfaces commerciales, avec contrôle final détaillé.",
  },
];

const commitments = [
  "Planning flexible selon vos horaires d’ouverture ou de production.",
  "Personnel identifié Premium Solution, équipé et sensibilisé aux enjeux confidentialité.",
  "Option écologique : produits respectueux de la santé des collaborateurs et visiteurs.",
  "Suivi qualité continu avec interlocuteur unique et rapports de passage.",
];

const missions = [
  "Contrat annuel de nettoyage pour un siège social à Sion (5 étages, 120 postes).",
  "Entretien quotidien d’un showroom automobile haut de gamme avec vitrines panoramiques.",
  "Nettoyage hebdomadaire d’espaces de coworking à Lausanne avec zones événementielles.",
  "Remise en état d’un plateau de bureaux après rénovation complète.",
];

export default function EntreprisesPage() {
  return (
    <div className="space-y-20 pb-24">
      <AnimatedSection className="border-b border-border/70 bg-gradient-to-tr from-secondary/10 via-background to-accent/20 py-20">
        <div className="container mx-auto px-4">
          <PageHeader
            eyebrow="Entreprises & Commerces"
            title="Conciergerie professionnelle pour vos lieux de travail"
            description="Premium Solution accompagne les entreprises et commerces romands avec des prestations sur mesure : nettoyage régulier, interventions ponctuelles et planification d’événements. Nous adaptons nos équipes et nos process à la culture de votre organisation."
            align="center"
          />
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr,1fr]">
            <div className="relative h-80 overflow-hidden rounded-3xl border border-primary/20 shadow-xl shadow-primary/15">
              <Image
                src="/images/service-conciergerie-entreprises.png"
                alt="Équipe Premium Solution qui entretient un open space d’entreprise"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 480px"
                priority
              />
            </div>
            <div className="space-y-6">
              <div className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-lg shadow-primary/5">
                <h3 className="text-xl font-semibold text-foreground">
                  Domaines d’intervention
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {highlights.map((item) => (
                    <li key={item.title}>
                      <span className="font-semibold text-primary">{item.title}</span>
                      <span className="block">{item.details}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-dashed border-secondary/40 bg-secondary/5 p-6 text-sm text-muted-foreground">
                <p>
                  Nous planifions les interventions en dehors des horaires d’ouverture
                  pour garantir une discrétion totale. Les équipes Premium Solution sont
                  identifiables et signent une charte de confidentialité.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">
              Ce qui fait la différence
            </h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {commitments.map((commitment) => (
                <li
                  key={commitment}
                  className="rounded-3xl border border-border/60 bg-card/80 p-4"
                >
                  {commitment}
                </li>
              ))}
            </ul>
            <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 text-sm text-muted-foreground">
              <p>
                Besoin d’un nettoyage ponctuel après conférence, salon ou événement
                interne ? Nos équipes peuvent intervenir en express avec un coordinateur
                présent jusqu’à la restitution des lieux.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">
              Exemples de missions
            </h3>
            <div className="grid gap-4 text-sm text-muted-foreground">
              {missions.map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-border/60 bg-card/80 p-4"
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
            Confiez vos bureaux à une équipe premium
          </h3>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Notre chatbot collecte vos besoins (périodicité, surface, zones sensibles) pour
            préparer un devis précis qu’un responsable Premium Solution validera avant envoi.
          </p>
          <Button asChild size="lg" variant="secondary">
            <a href="/devis">Obtenir un devis pour mon entreprise</a>
          </Button>
        </div>
      </AnimatedSection>
    </div>
  );
}
