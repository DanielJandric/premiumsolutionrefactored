import Image from "next/image";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    title: "Équipe formée et certifiée",
    description:
      "30 collaborateurs Premium Solution, formés aux standards suisses et équipés de matériel professionnel adapté à chaque typologie de site.",
  },
  {
    title: "Garanties & réactivité",
    description:
      "Fin de bail garantit la remise des clés, astreinte pour les urgences et coordinateur dédié qui suit votre dossier du devis au rapport final.",
  },
  {
    title: "Procédures digitalisées",
    description:
      "Checklists, rapports photos, chatbot devis et facturation automatisée : un suivi transparent et disponible en permanence.",
  },
  {
    title: "Option écologique maîtrisée",
    description:
      "Produits certifiés sur demande (+10 %) et protocoles respectueux des occupants, des surfaces sensibles et de l’environnement.",
  },
];

const gallery = [
  {
    src: "/images/feature-sanitizing.png",
    alt: "Désinfection d’une poignée avec un spray Premium Solution écologique.",
  },
  {
    src: "/images/feature-eco-product.png",
    alt: "Produits Premium Solution alignés pour les interventions écologiques.",
  },
];

export function Features() {
  return (
    <AnimatedSection className="container py-14">
      <div className="grid items-center gap-8 lg:grid-cols-[1.15fr,0.85fr]">
        <div className="space-y-6">
          <div className="space-y-3">
            <Badge variant="outline" className="border-primary/50 text-primary dark:border-primary/45 dark:text-white">
              Valeurs Premium Solution
            </Badge>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              <span className="text-gradient bg-gradient-to-r from-foreground via-primary to-foreground">
                Excellence, fiabilité & réactivité
              </span>{" "}
              <span className="text-foreground">au quotidien</span>
            </h2>
            <p className="text-base text-muted-foreground">
              Premium Solution associe expertise humaine, protocoles rigoureux et
              outils digitaux pour garantir des prestations irréprochables, du hall
              d’immeuble aux espaces de production.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-border/70 bg-card/90 p-5 shadow-lg shadow-primary/5 transition-all duration-500 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/20 dark:border-border/60 dark:bg-card/35 dark:shadow-primary/15 dark:hover:border-primary/45 card-3d neon-border group"
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                <div className="relative">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {gallery.map((image, index) => (
            <div
              key={image.src}
              className="relative overflow-hidden rounded-3xl border border-primary/30 shadow-xl shadow-primary/10 dark:border-primary/40 dark:shadow-primary/20 neon-border group"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={640}
                height={360}
                className="h-full w-full object-cover ken-burns"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent transition-opacity group-hover:from-black/40" />
              <p className="absolute bottom-4 left-4 max-w-[260px] text-sm font-medium text-white drop-shadow-lg">
                {image.alt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
