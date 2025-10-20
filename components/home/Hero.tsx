"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const metrics = [
  { label: "Fondee en", value: "2020" },
  { label: "Collaborateurs certifies", value: "30" },
  { label: "Zone d'intervention", value: "Suisse romande" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#8BCB5A_0%,transparent_55%)] opacity-40" />
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container mx-auto flex flex-col items-center gap-16 px-4 pb-20 pt-24">
        <div className="flex-1 space-y-10">
          <Badge className="bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            Conciergerie & Nettoyage premium
          </Badge>

          <div className="space-y-6 text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Premium Solution
              <span className="block text-primary">
                Votre partenaire conciergerie & nettoyage en Suisse romande
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mx-auto w-full max-w-[520px]"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-primary/20 bg-gradient-to-br from-primary/10 via-accent/30 to-secondary/20 shadow-2xl shadow-primary/25">
                <Image
                  src="/images/hero-professional.png"
                  alt="Technicienne Premium Solution prete pour une intervention de conciergerie"
                  fill
                  priority
                  className="object-cover"
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
            <Button asChild size="lg" className="min-w-[200px] shadow-lg shadow-primary/30">
              <Link href="/devis">Obtenir un devis</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="min-w-[200px] border border-primary/20 bg-white/70 text-primary shadow-sm shadow-primary/10 backdrop-blur hover:bg-white/90"
            >
              <Link href="/contact">Contacter l'equipe</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="min-w-[200px] border border-primary/20 bg-white/60 text-primary shadow-sm shadow-primary/10 backdrop-blur hover:bg-white/80"
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
            {metrics.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-primary/20 bg-white/70 p-4 shadow-sm shadow-primary/10 backdrop-blur"
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-primary">{item.label}</dt>
                <dd className="mt-2 text-2xl font-semibold text-foreground">{item.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
