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
    <AnimatedSection className="container mx-auto px-4 py-14">
      <div className="grid items-center gap-8 lg:grid-cols-[1.15fr,0.85fr]">
        <div className="space-y-6">
          <div className="space-y-3">
            <Badge variant="outline" className="border-primary/50 text-primary">
              Valeurs Premium Solution
            </Badge>
            <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Excellence, fiabilité & réactivité au quotidien
            </h2>
            <p className="text-base text-muted-foreground">
              Premium Solution associe expertise humaine, protocoles rigoureux et
              outils digitaux pour garantir des prestations irréprochables, du hall
              d’immeuble aux espaces de production.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-border/70 bg-card/90 p-5 shadow-lg shadow-primary/5 transition hover:-translate-y-1 hover:border-primary/40"
              >
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {gallery.map((image, index) => (
            <div
              key={image.src}
              className="relative overflow-hidden rounded-3xl border border-primary/30 shadow-xl shadow-primary/10"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={640}
                height={360}
                className="h-full w-full object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
              <p className="absolute bottom-4 left-4 max-w-[260px] text-sm font-medium text-white">
                {image.alt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
