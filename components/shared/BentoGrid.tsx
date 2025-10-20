"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  span?: "1" | "2" | "full";
  rowSpan?: "1" | "2";
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({ children, className, span = "1", rowSpan = "1" }: BentoCardProps) {
  const spanClasses = {
    "1": "md:col-span-1",
    "2": "md:col-span-2",
    "full": "md:col-span-full",
  };

  const rowSpanClasses = {
    "1": "",
    "2": "md:row-span-2",
  };

  return (
    <div
      className={cn(
        "rounded-3xl border border-border/70 bg-card/90 p-6 shadow-lg shadow-primary/5 transition-all duration-500 hover:shadow-xl hover:shadow-primary/15 dark:border-border/60 dark:bg-card/35 card-3d neon-border group",
        spanClasses[span],
        rowSpanClasses[rowSpan],
        className
      )}
    >
      {children}
    </div>
  );
}
