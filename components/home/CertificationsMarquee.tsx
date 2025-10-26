"use client";

import { InfiniteMarquee } from "@/components/shared/InfiniteMarquee";
import { Badge } from "@/components/ui/badge";
import { Shield, Award, Leaf, CheckCircle, Star, Zap } from "lucide-react";

const certifications = [
  { icon: Shield, label: "Assurance responsabilité civile" },
  { icon: Award, label: "Personnel certifié" },
  { icon: Leaf, label: "Option produits écologiques" },
  { icon: CheckCircle, label: "Garantie fin de bail" },
  { icon: Star, label: "4.9/5 satisfaction client" },
  { icon: Zap, label: "Intervention 24/7" },
];

export function CertificationsMarquee() {
  return (
    <div className="section-shell-tight bg-gradient-to-r from-[rgba(47,125,96,0.12)] via-[rgba(247,243,235,0.9)] to-[rgba(192,144,63,0.16)] dark:from-[rgba(31,125,96,0.3)] dark:via-[rgba(12,17,15,0.82)] dark:to-[rgba(99,64,32,0.3)]">
      <InfiniteMarquee speed="normal">
        {certifications.map((cert, index) => (
          <Badge
            key={index}
            variant="outline"
            className="flex items-center gap-2 whitespace-nowrap border border-primary/25 bg-white/85 px-6 py-3 text-sm font-medium tracking-[0.08em] text-foreground shadow-sm shadow-primary/10 backdrop-blur transition-colors hover:border-primary/35 hover:bg-white/95 dark:border-primary/35 dark:bg-white/[0.08] dark:text-foreground/90"
          >
            <cert.icon className="h-4 w-4 text-primary" />
            {cert.label}
          </Badge>
        ))}
      </InfiniteMarquee>
    </div>
  );
}
