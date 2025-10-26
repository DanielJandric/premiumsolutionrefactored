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
    <div className="py-8 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
      <InfiniteMarquee speed="normal">
        {certifications.map((cert, index) => (
          <Badge
            key={index}
            variant="outline"
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium border-primary/30 bg-card/80 backdrop-blur hover:bg-primary/10 transition-colors whitespace-nowrap"
          >
            <cert.icon className="h-4 w-4 text-primary" />
            {cert.label}
          </Badge>
        ))}
      </InfiniteMarquee>
    </div>
  );
}
