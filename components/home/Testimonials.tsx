import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const testimonials = [
  {
    company: "Régie immobilière – Sion",
    message:
      "« Premium Solution gère nos immeubles avec beaucoup de sérieux. Les rapports photo et la disponibilité des équipes nous offrent une vraie tranquillité. »",
    author: "Claire M., responsable de gérance",
  },
  {
    company: "Siège d’entreprise – Lausanne",
    message:
      "« Prestations impeccables et planification sur mesure. L’équipe est proactive et sait s’adapter à nos pics d’activité. »",
    author: "Julien R., facility manager",
  },
];

export function Testimonials() {
  return (
    <AnimatedSection className="container mx-auto px-4 py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Témoignages
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
          Ce que nos clients apprécient
        </h2>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {testimonials.map((testimonial) => (
          <Card
            key={testimonial.company}
            className="relative h-full overflow-hidden border-primary/20 bg-card/90 shadow-xl shadow-primary/10 backdrop-blur transition hover:-translate-y-1 hover:shadow-primary/15 dark:border-primary/30 dark:bg-card/35 dark:shadow-primary/20"
          >
            <CardHeader>
              <CardTitle className="text-lg text-primary dark:text-primary-foreground">
                {testimonial.company}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-base text-muted-foreground">{testimonial.message}</p>
              <div className="flex items-center justify-between border-t border-dashed border-primary/20 pt-4 text-sm text-muted-foreground dark:border-primary/30">
                <span>{testimonial.author}</span>
                <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-primary dark:border-primary/30 dark:bg-primary/25 dark:text-primary-foreground">
                  Avis
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AnimatedSection>
  );
}
