import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  items: string[];
  category: string;
  className?: string;
  tone?: "emerald" | "gold" | "stone";
}

export function ServiceCard({
  title,
  description,
  items,
  category,
  className,
  tone = "emerald",
}: ServiceCardProps) {
  const toneStyles: Record<
    NonNullable<ServiceCardProps["tone"]>,
    {
      background: string;
      badge: string;
      bullet: string;
      glow: string;
    }
  > = {
    emerald: {
      background:
        "before:bg-[radial-gradient(circle_at_0%_0%,rgba(74,154,124,0.32),transparent_58%),radial-gradient(circle_at_90%_90%,rgba(47,125,96,0.24),transparent_55%)]",
      badge: "bg-primary/15 text-primary border border-primary/20 dark:bg-primary/25 dark:text-primary-foreground",
      bullet: "bg-primary",
      glow: "shadow-[0_18px_50px_-22px_rgba(47,125,96,0.42)]",
    },
    gold: {
      background:
        "before:bg-[radial-gradient(circle_at_0%_0%,rgba(192,144,63,0.28),transparent_55%),radial-gradient(circle_at_90%_90%,rgba(192,144,63,0.22),transparent_50%)]",
      badge: "bg-secondary/15 text-secondary-foreground border border-secondary/25 dark:bg-secondary/30",
      bullet: "bg-secondary",
      glow: "shadow-[0_18px_55px_-24px_rgba(192,144,63,0.36)]",
    },
    stone: {
      background:
        "before:bg-[radial-gradient(circle_at_0%_0%,rgba(155,138,118,0.24),transparent_50%),radial-gradient(circle_at_90%_90%,rgba(93,81,67,0.22),transparent_48%)]",
      badge: "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-900/40 dark:text-slate-200",
      bullet: "bg-slate-500",
      glow: "shadow-[0_18px_50px_-24px_rgba(61,55,45,0.32)]",
    },
  };

  const palette = toneStyles[tone];

  return (
    <Card
      className={cn(
        "relative flex h-full flex-col overflow-hidden border border-border/70 bg-white/85 backdrop-blur transition duration-500 dark:border-border/40 dark:bg-white/[0.08]",
        "hover:-translate-y-1.5 hover:border-primary/30",
        palette.glow,
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 rounded-[20px]",
          "before:absolute before:inset-[-1px] before:-z-10 before:rounded-[22px] before:content-['']",
          palette.background
        )}
      />
      <div className="absolute left-6 top-6">
        <Badge className={cn("px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em]", palette.badge)}>
          {category}
        </Badge>
      </div>
      <CardHeader className="space-y-4 pt-16">
        <CardTitle className="text-2xl font-semibold text-foreground dark:text-foreground/90">{title}</CardTitle>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 pb-6">
        <ul className="flex flex-col space-y-2 text-sm text-muted-foreground">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className={cn("mt-1 h-1.5 w-1.5 shrink-0 rounded-full", palette.bullet)} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
