import Image from "next/image";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const steps = [
  {
    number: "01",
    title: "Exploration & visite des lieux",
    description:
      "Un coordinateur se deplace pour comprendre vos attentes, cartographier les espaces et relever les contraintes horaires ou techniques.",
    highlights: [
      "Audit des surfaces et materiaux sensibles",
      "Analyse des flux occupants et exigences de discretion",
      "Releve photo pour le plan d\u2019intervention",
    ],
    imageSrc: "/images/process-step-1.png",
    imageAlt: "Consultation Premium Solution dans un hall lumineux.",
  },
  {
    number: "02",
    title: "Signature du protocol premium",
    description:
      "Nous composons un protocole sur mesure : frequence, checklists, equipe dediee et options hospitality. Le devis detaille est remis sous 48 h.",
    highlights: [
      "Plan d\u2019action personnalise et calendrier partage",
      "Selection de l\u2019equipe et dotation du materiel",
      "Options ecologiques (+10 %) et services complementaires",
    ],
    imageSrc: "/images/process-step-2.png",
    imageAlt: "Preparation du materiel de conciergerie premium.",
  },
  {
    number: "03",
    title: "Interventions & pilotage continu",
    description:
      "Nos collaborateurs orchestrent chaque mission avec precision. Vous recevez rapports photo, indicateurs et recommandations, tandis qu\u2019un coordinateur assure le suivi.",
    highlights: [
      "Supervision terrain et astreinte 24/7",
      "Reporting digital et alertes en temps reel",
      "Optimisation continue des parcours et couts",
    ],
    imageSrc: "/images/process-step-3.png",
    imageAlt: "Equipe Premium Solution intervenant dans une residence de prestige.",
  },
];

export function Process() {
  return (
    <AnimatedSection>
      <div className="section-inner space-y-14">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-eyebrow text-primary/70">Processus premium</p>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Une trajectoire accompagnee de la premiere visite au reporting
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Transparence, reactivite et sens du detail pilotent chaque dossier. Vos interlocuteurs restent les memes du
            cadrage a la supervision quotidienne.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-6 hidden w-px bg-gradient-to-b from-primary/40 via-primary/15 to-transparent sm:block" />
          <div className="space-y-10">
            {steps.map((step) => (
              <article
                key={step.number}
                className="relative rounded-3xl border border-border/70 bg-white/85 p-6 shadow-[0_24px_60px_-32px_rgba(31,125,96,0.35)] backdrop-blur-md transition duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_32px_72px_-30px_rgba(31,125,96,0.4)] dark:border-border/40 dark:bg-white/[0.05]"
              >
                <div className="grid gap-6 lg:grid-cols-[0.6fr,1fr]">
                  <div className="space-y-5">
                    <div className="flex items-center gap-4">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-lg font-semibold text-primary shadow-inner shadow-primary/15 dark:border-primary/35 dark:bg-primary/25 dark:text-primary-foreground">
                        {step.number}
                      </span>
                      <h3 className="text-xl font-semibold text-foreground dark:text-foreground/90">{step.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                    <ul className="grid gap-2 text-sm text-muted-foreground">
                      {step.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-white/80 shadow-lg shadow-primary/10 dark:border-border/40 dark:bg-white/[0.04]">
                    <Image
                      src={step.imageSrc}
                      alt={step.imageAlt}
                      width={540}
                      height={360}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(16,24,19,0.45)] via-transparent to-transparent" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
