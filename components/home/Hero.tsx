"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRef } from "react";
import { SVGPatterns, AnimatedBlob } from "@/components/shared/SVGPatterns";

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

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]); // dynamic background shift
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background dark:via-primary/10 noise-texture">
      <motion.div className="absolute inset-0 -z-10" style={{ y }}>
        {/* SVG Pattern */}
        <SVGPatterns pattern="dots" className="text-primary/5" opacity={0.15} />

        {/* Gradient meshes */}
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_10%_-20%,#8BCB5A_0%,transparent_40%),radial-gradient(800px_400px_at_90%_-10%,#60A339_0%,transparent_35%)] opacity-35 dark:opacity-50" />

        {/* Animated blobs */}
        <AnimatedBlob className="top-0 left-0" color="primary" />
        <AnimatedBlob className="bottom-0 right-0" color="secondary" />

        {/* Rotating blur circle */}
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

      <div className="container flex flex-col gap-12 pb-16 pt-16">
        <Badge className="mx-auto bg-primary text-primary-foreground shadow-lg shadow-primary/30 lg:mx-0">
          Conciergerie & Nettoyage premium
        </Badge>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr),minmax(0,1fr)] lg:items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="relative inline-block">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl text-balance"
              >
                <span className="text-gradient-animate bg-gradient-to-r from-primary via-secondary to-primary">
                  Premium Solution
                </span>
                <span className="mt-4 block text-3xl text-foreground sm:text-4xl lg:text-5xl text-balance">
                  Votre partenaire conciergerie & nettoyage en {" "}
                  <span className="text-primary font-bold">Suisse romande</span>
                </span>
              </motion.h1>

              <div className="pointer-events-none absolute -bottom-6 left-1/2 w-full -translate-x-1/2 -z-10 hidden lg:block">
                <Image
                  src="/logo.png"
                  alt=""
                  width={1000}
                  height={220}
                  className="mx-auto h-auto w-full max-w-[720px] opacity-[0.16] contrast-125 [filter:saturate(1.05)] blur-[0.5px] mix-blend-soft-light [mask-image:radial-gradient(120%_120%_at_50%_50%,_#000_60%,_transparent_100%)] dark:opacity-[0.22]"
                  priority={false}
                />
              </div>
              <div className="pointer-events-none absolute -bottom-3 left-1/2 z-0 hidden h-[2px] w-full -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 lg:block" />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mx-auto max-w-2xl text-lg text-muted-foreground lg:mx-0 lg:max-w-xl"
            >
              Depuis 2020, Premium Solution accompagne gerances, PPE, entreprises et particuliers avec une equipe de
              30 collaborateurs certifies. Interventions rapides, controle qualite systematique et option ecologique
              sur demande.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center lg:justify-start"
            >
              <Button asChild size="lg" variant="gradient" className="min-w-[200px] glow-pulse shine">
                <Link href="/devis">Obtenir un devis</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="min-w-[200px] border border-primary/20 bg-card/80 text-primary shadow-sm shadow-primary/10 backdrop-blur transition hover:bg-card/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 dark:border-primary/40 dark:bg-card/25 dark:text-white dark:hover:bg-card/35"
              >
                <Link href="/contact">Contacter l&apos;equipe</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="min-w-[200px] border border-primary/20 bg-card/70 text-primary shadow-sm shadow-primary/10 backdrop-blur transition hover:bg-card/80 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 dark:border-primary/40 dark:bg-card/20 dark:text-white dark:hover:bg-card/30"
              >
                <Link href="/collaborateurs">Acces collaborateurs</Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[460px]"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-primary/20 bg-gradient-to-br from-primary/10 via-accent/30 to-secondary/20 shadow-2xl shadow-primary/25 dark:border-primary/30 dark:from-primary/20 dark:via-primary/15 dark:to-secondary/30 neon-border group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
              <Image
                src="/images/hero-professional.png"
                alt="Technicienne Premium Solution prete pour une intervention de conciergerie"
                fill
                priority
                className="object-cover ken-burns"
                sizes="(max-width: 1024px) 100vw, 460px"
              />
            </div>
          </motion.div>
        </div>

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
              className="rounded-2xl border border-primary/20 bg-card/80 p-6 shadow-md shadow-primary/10 backdrop-blur-md transition-all duration-500 hover:shadow-xl hover:shadow-primary/30 dark:border-primary/30 dark:bg-card/25 card-3d group will-change-transform"
            >
              <dt className="text-eyebrow">{item.label}</dt>
              <dd className="mt-3 text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                {item.value}{item.suffix || ""}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
