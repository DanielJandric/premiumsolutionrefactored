import Image from "next/image";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    title: "Equipe formee et certifiee",
    description:
      "30 collaborateurs Premium Solution, formes aux standards suisses et equipes de materiel professionnel adapte a chaque typologie de site.",
  },
  {
    title: "Garanties et reactivite",
    description:
      "Fin de bail avec remise des cles garantie, astreinte pour les urgences et coordinateur dedie qui suit votre dossier du devis au rapport final.",
  },
  {
    title: "Procedures digitalisees",
    description:
      "Checklists, rapports photos, chatbot devis et facturation automatisee : un suivi transparent et disponible en permanence.",
  },
  {
    title: "Option ecologique maitrisee",
    description:
      "Produits certifies sur demande (+10 %) et protocoles respectueux des occupants, des surfaces sensibles et de l\u2019environnement.",
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
              <span className="text-gradient">Excellence, fiabilite et reactivite</span>{" "}
              <span className="text-foreground">au quotidien</span>
            </h2>
            <p className="text-base text-muted-foreground">
              Premium Solution associe expertise humaine, protocoles rigoureux et outils digitaux pour garantir des
              prestations irreprochables, du hall d\u2019immeuble aux espaces de production.
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

        <div className="relative">
          <div className="relative overflow-hidden rounded-[36px] border border-border/70 bg-white/85 shadow-[0_30px_90px_-40px_rgba(31,125,96,0.45)] backdrop-blur-lg dark:border-border/40 dark:bg-white/[0.08]">
            <Image
              src="/images/feature-sanitizing.png"
              alt="Controle qualite Premium Solution sur site."
              width={640}
              height={500}
              className="h-full w-full object-cover saturate-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(16,24,19,0.5)] via-transparent to-transparent" />
          </div>

          <div className="absolute -right-6 -bottom-10 w-[260px] rounded-3xl border border-secondary/30 bg-white/95 p-6 shadow-[0_20px_60px_-28px_rgba(192,144,63,0.5)] backdrop-blur-lg dark:border-secondary/40 dark:bg-secondary/25">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-secondary/80">Audit qualite</p>
            <p className="mt-3 text-3xl font-semibold text-foreground dark:text-foreground/90">94 pts / 100</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Score moyen obtenu lors des controles mensuels sur nos sites actifs au dernier trimestre.
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
