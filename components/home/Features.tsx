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
    <AnimatedSection>
      <div className="section-inner-wide grid items-center gap-12 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-8">
          <div className="space-y-4">
            <Badge className="border border-primary/20 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/20">
              Valeurs Premium Solution
            </Badge>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              <span className="text-gradient">Excellence, fiabilité & réactivité</span>{" "}
              <span className="text-foreground">au quotidien</span>
            </h2>
            <p className="text-base text-muted-foreground">
              Premium Solution associe expertise humaine, protocoles rigoureux et outils digitaux pour garantir des
              prestations irréprochables, du hall d’immeuble aux espaces de production.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-border/70 bg-white/85 p-5 shadow-[0_20px_45px_-28px_rgba(31,125,96,0.35)] transition duration-500 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_26px_60px_-28px_rgba(31,125,96,0.4)] dark:border-border/40 dark:bg-white/[0.08]"
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/70">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-foreground dark:text-foreground/90">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {gallery.map((image, index) => (
            <div
              key={image.src}
              className="relative overflow-hidden rounded-[32px] border border-border/70 bg-white/85 shadow-[0_30px_90px_-44px_rgba(31,125,96,0.5)] backdrop-blur-lg transition duration-500 hover:-translate-y-1.5 hover:border-primary/30 dark:border-border/40 dark:bg-white/[0.08]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={640}
                height={360}
                className="h-full w-full object-cover saturate-[1.02]"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(16,24,19,0.5)] via-transparent to-transparent" />
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
