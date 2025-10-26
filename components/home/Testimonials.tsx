import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { TestimonialsCarousel } from "@/components/shared/TestimonialsCarousel";

const testimonials = [
  {
    company: "Régie immobilière – Sion",
    message:
      "« Premium Solution gère nos immeubles avec beaucoup de sérieux. Les rapports photo et la disponibilité des équipes nous offrent une vraie tranquillité. »",
    author: "Claire M., responsable de gérance",
    rating: 5,
  },
  {
    company: "Siège d'entreprise – Lausanne",
    message:
      "« Prestations impeccables et planification sur mesure. L'équipe est proactive et sait s'adapter à nos pics d'activité. »",
    author: "Julien R., facility manager",
    rating: 5,
  },
  {
    company: "Copropriété PPE – Genève",
    message:
      "« Excellent service de conciergerie pour notre PPE. Toujours réactifs et professionnels. »",
    author: "Marc D., président de PPE",
    rating: 5,
  },
  {
    company: "Restaurant – Montreux",
    message:
      "« Le nettoyage quotidien est impeccable. Notre établissement est toujours prêt pour accueillir nos clients. »",
    author: "Sophie L., gérante",
    rating: 5,
  },
  {
    company: "Particulier – Martigny",
    message:
      "« Fin de bail parfaitement réalisée. Clés remises sans aucune déduction. Je recommande vivement ! »",
    author: "Thomas B.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <AnimatedSection>
      <div className="section-inner space-y-14 md:space-y-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-eyebrow text-primary/70">Témoignages clients</p>
          <h2 className="mt-4 text-balance font-display text-4xl font-semibold md:text-5xl lg:text-6xl">
            <span className="text-gradient-animate">Ce que nos clients</span>{" "}
            <span className="text-foreground">apprécient</span>
          </h2>
          <p className="mt-6 text-subtitle text-muted-foreground">
            Plus de 250 clients satisfaits nous font confiance.
          </p>
        </div>

        <div className="md:mt-4">
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </div>
    </AnimatedSection>
  );
}
