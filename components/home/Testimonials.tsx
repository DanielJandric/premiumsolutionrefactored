import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { TestimonialsCarousel } from "@/components/shared/TestimonialsCarousel";

const testimonials = [
  {
    company: "Gerance immobiliere \u2013 Sion",
    message:
      "Premium Solution gere nos immeubles avec une rigueur rare. Les rapports photo, la communication proactive et la discretion des equipes offrent une vraie serenite a nos coproprietaires.",
    author: "Claire M., responsable de gerance",
    rating: 5,
  },
  {
    company: "Siege d\u2019entreprise \u2013 Lausanne",
    message:
      "Prestations impeccables, adaptables aux pics d\u2019activite et aux evenements. Le coordinateur anticipe nos besoins et l\u2019equipe hospitality sublime chaque reception.",
    author: "Julien R., facility manager",
    rating: 5,
  },
  {
    company: "PPE prestige \u2013 Geneve",
    message:
      "Excellent service de conciergerie pour notre PPE. Toujours reactifs, force de proposition, et une qualite constante depuis trois ans.",
    author: "Marc D., president de PPE",
    rating: 5,
  },
  {
    company: "Restaurant gastronomique \u2013 Montreux",
    message:
      "Notre etablissement est toujours pret a accueillir nos clients. L\u2019equipe veille aux details de la salle comme de la cuisine, sans jamais perturber le service.",
    author: "Sophie L., gerante",
    rating: 5,
  },
  {
    company: "Residence secondaire \u2013 Crans-Montana",
    message:
      "Fin de bail realisee a la perfection et chalet prepare pour la saison d\u2019hiver. Service attentif, minutieux, et coordination impeccable avec nos artisans.",
    author: "Thomas B.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <AnimatedSection>
      <div className="section-inner space-y-14 md:space-y-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-eyebrow text-primary/70">Temoignages clients</p>
          <h2 className="mt-4 text-balance font-display text-4xl font-semibold md:text-5xl lg:text-6xl">
            <span className="text-gradient-animate">Le luxe de l\u2019execution sans compromis</span>
          </h2>
          <p className="mt-6 text-subtitle text-muted-foreground">
            4.9 / 5 sur nos 250 missions reccentes. Des partenariats durables avec les gerances, entreprises et familles
            qui nous confient leurs espaces.
          </p>
        </div>

        <div className="md:mt-4">
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </div>
    </AnimatedSection>
  );
}
