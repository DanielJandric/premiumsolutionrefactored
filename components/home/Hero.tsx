"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SVGPatterns, AnimatedBlob } from "@/components/shared/SVGPatterns";

const metrics = [
  { label: "Fondée en", value: "2020", accent: "" },
  { label: "Collaborateurs certifiés", value: "30+", accent: "" },
  { label: "Clients satisfaits", value: "250+", accent: "" },
];

const highlights = [
  {
    title: "Garanties & réactivité",
    description:
      "Fin de bail avec remise des clés garantie, astreinte pour les urgences et coordinateur dédié qui suit votre dossier du devis au rapport final.",
  },
  {
    title: "Procédures digitalisées",
    description:
      "Checklists, rapports photo, chatbot devis et facturation automatisée : un suivi transparent et disponible en permanence.",
  },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "45%"]);

  return (
    <section
      ref={ref}
      className="section-shell relative overflow-hidden bg-gradient-to-b from-[rgba(247,243,235,1)] via-[rgba(247,243,235,0.85)] to-background dark:bg-gradient-to-b dark:from-[rgba(12,17,15,1)] dark:via-[rgba(12,17,15,0.92)] dark:to-[rgba(12,17,15,1)]"
    >
      <motion.div className="absolute inset-0 -z-10" style={{ y }}>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(950px_520px_at_12%_-5%,rgba(192,144,63,0.22)_0%,transparent_60%),radial-gradient(720px_480px_at_82%_-10%,rgba(76,154,124,0.22)_0%,transparent_65%),radial-gradient(1200px_680px_at_50%_110%,rgba(192,144,63,0.16)_0%,transparent_70%)]" />
          <SVGPatterns pattern="grid" className="text-stone-200/60 dark:text-stone-700/40" opacity={0.28} />
        </div>
        <AnimatedBlob className="-top-20 -left-24" color="primary" />
        <AnimatedBlob className="-bottom-36 -right-12" color="secondary" />
      </motion.div>

      <div className="section-inner-wide relative flex flex-col gap-14">
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,1.05fr),minmax(0,0.95fr)] lg:items-center">
          <div className="space-y-8 text-center lg:max-w-2xl lg:text-left">
            <Badge className="mx-auto w-fit border border-primary/20 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/20 lg:mx-0">
              Conciergerie & Nettoyage premium
            </Badge>

            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-hero text-gradient-animate"
              >
                <span className="block">Premium Solution</span>
                <span className="mt-4 block text-balance font-display text-[clamp(1.6rem,1.28rem+1.1vw,2.45rem)] text-foreground">
                  Votre partenaire conciergerie & nettoyage en{" "}
                  <span className="text-primary font-semibold">Suisse romande</span>
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.05 }}
                className="mx-auto max-w-2xl text-subtitle text-muted-foreground lg:mx-0"
              >
                Depuis 2020, Premium Solution accompagne gérances, PPE, entreprises et particuliers avec une équipe de
                trente collaborateurs certifiés. Interventions rapides, contrôle qualité systématique et option
                écologique sur demande.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center lg:justify-start"
            >
              <Button asChild size="lg" variant="gradient" className="min-w-[200px] shadow-lg shadow-primary/30">
                <Link href="/devis">Obtenir un devis</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="min-w-[200px] border border-primary/25 bg-white/70 text-primary shadow-sm backdrop-blur transition hover:border-primary/40 hover:bg-white/80 dark:border-primary/30 dark:bg-primary/20 dark:text-primary-foreground dark:hover:bg-primary/25"
              >
                <Link href="/contact">Contacter l’équipe</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="min-w-[200px] border border-primary/25 bg-white/60 text-primary shadow-sm backdrop-blur transition hover:border-primary/35 hover:bg-white/70 dark:border-primary/30 dark:bg-primary/30 dark:text-primary-foreground dark:hover:bg-primary/35"
              >
                <Link href="/collaborateurs">Acces collaborateurs</Link>
              </Button>
            </motion.div>

            {highlights.length > 0 ? (
              <motion.ul
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="grid gap-4 text-left text-sm text-muted-foreground sm:grid-cols-2"
              >
                {highlights.map((item, index) => (
                  <li
                    key={item.title}
                    className="rounded-2xl border border-border/60 bg-white/80 p-4 shadow-sm shadow-[rgba(32,42,36,0.06)] backdrop-blur dark:border-border/40 dark:bg-white/10 dark:text-muted-foreground/90"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-2 text-base font-semibold text-foreground dark:text-foreground/90">{item.title}</p>
                    <p className="mt-2 leading-relaxed">{item.description}</p>
                  </li>
                ))}
              </motion.ul>
            ) : null}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mx-auto w-full max-w-[420px] lg:max-w-[460px]"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[36px] border border-white/60 bg-gradient-to-br from-white/90 via-white/70 to-white/50 shadow-lg shadow-[rgba(31,125,96,0.18)] backdrop-blur-lg dark:from-[rgba(31,125,96,0.25)] dark:via-[rgba(12,17,15,0.65)] dark:to-[rgba(12,17,15,0.4)]">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src="/images/video2_hero_equipment.mp4"
                autoPlay
                muted
                loop
                playsInline
                poster="/images/hero-professional.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(16,24,19,0.55)] via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>

        <motion.dl
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="grid w-full gap-5 rounded-3xl border border-border/60 bg-white/80 p-6 shadow-sm shadow-primary/10 backdrop-blur-lg dark:border-border/40 dark:bg-white/5 sm:grid-cols-3"
        >
          {metrics.map((item) => (
            <div key={item.label} className="flex flex-col gap-2 text-center sm:text-left">
              <dt className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                {item.label}
              </dt>
              <dd className="text-3xl font-semibold text-foreground dark:text-foreground/90">{item.value}</dd>
              {item.accent ? <span className="text-xs text-muted-foreground">{item.accent}</span> : null}
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
