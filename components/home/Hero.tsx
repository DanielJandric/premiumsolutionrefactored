"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRef } from "react";

const metrics = [
  { label: "Fondee en", value: 2020, isYear: true },
  { label: "Collaborateurs certifies", value: 30, suffix: "+" },
  { label: "Clients satisfaits", value: 250, suffix: "+" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background dark:via-primary/10">
      <motion.div className="absolute inset-0 -z-10" style={{ y }}>
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_10%_-20%,#8BCB5A_0%,transparent_40%),radial-gradient(800px_400px_at_90%_-10%,#60A339_0%,transparent_35%)] opacity-35 dark:opacity-50" />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-primary/20"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      <div className="container flex flex-col items-center gap-12 pb-16 pt-16">
        <div className="flex-1 space-y-10">
          <Badge className="bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            Conciergerie & Nettoyage premium
          </Badge>

          <div className="space-y-6 text-center lg:text-left">
            <div className="relative inline-block">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
              >
                <span className="text-gradient-animate bg-gradient-to-r from-primary via-secondary to-primary">
                  Premium Solution
                </span>
                <span className="block mt-4 text-3xl sm:text-4xl lg:text-5xl text-foreground">
                  Votre partenaire conciergerie & nettoyage en{" "}
                  <span className="text-primary font-bold">Suisse romande</span>
                </span>
              </motion.h1>

              {/* Motif décoratif sous le titre: logo léger + soulignement gradient */}
              <div className="pointer-events-none absolute -bottom-6 left-1/2 w-full -translate-x-1/2 -z-10">
                <Image
                  src="/logo.png"
                  alt=""
                  width={1000}
                  height={220}
                  className="mx-auto h-auto w-full max-w-[720px] opacity-[0.16] contrast-125 [filter:saturate(1.05)] blur-[0.5px] mix-blend-soft-light [mask-image:radial-gradient(120%_120%_at_50%_50%,_#000_60%,_transparent_100%)] dark:opacity-[0.22]"
                  priority={false}
                />
              </div>
              <div className="pointer-events-none absolute -bottom-3 left-1/2 z-0 h-[2px] w-full -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0"></div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mx-auto w-full max-w-[520px]"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-primary/20 bg-gradient-to-br from-primary/10 via-accent/30 to-secondary/20 shadow-2xl shadow-primary/25 dark:border-primary/30 dark:from-primary/20 dark:via-primary/15 dark:to-secondary/30 neon-border group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
                <Image
                  src="/images/hero-professional.png"
                  alt="Technicienne Premium Solution prete pour une intervention de conciergerie"
                  fill
                  priority
                  className="object-cover ken-burns"
                  sizes="(max-width: 1024px) 100vw, 560px"
                />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="max-w-2xl text-lg text-muted-foreground"
            >
              Depuis 2020, Premium Solution accompagne gerances, PPE, entreprises et particuliers avec une equipe de
              30 collaborateurs certifies. Interventions rapides, controle qualite systematique et option ecologique
              sur demande.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Button asChild size="lg" variant="gradient" className="min-w-[200px] glow-pulse shine">
              <Link href="/devis">Obtenir un devis</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="min-w-[200px] border border-primary/20 bg-card/80 text-primary shadow-sm shadow-primary/10 backdrop-blur transition hover:bg-card/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 dark:border-primary/40 dark:bg-card/30 dark:text-primary-foreground dark:hover:bg-card/40"
            >
              <Link href="/contact">Contacter l&apos;equipe</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="min-w-[200px] border border-primary/20 bg-card/70 text-primary shadow-sm shadow-primary/10 backdrop-blur transition hover:bg-card/80 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 dark:border-primary/40 dark:bg-card/25 dark:text-primary-foreground dark:hover:bg-card/35"
            >
              <Link href="/collaborateurs">Acces collaborateurs</Link>
            </Button>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid w-full gap-6 sm:grid-cols-3"
          >
            {metrics.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="rounded-2xl border border-primary/20 bg-card/80 p-4 shadow-sm shadow-primary/10 backdrop-blur transition-all duration-500 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 dark:border-primary/30 dark:bg-card/25 card-3d"
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-primary">{item.label}</dt>
                <dd className="mt-2 text-2xl font-semibold text-foreground">
                  {item.value}{item.suffix || ""}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
