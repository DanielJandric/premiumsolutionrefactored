import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ServiceCardProps {
  title: string;
  description: string;
  items: string[];
  category: string;
}

export function ServiceCard({
  title,
  description,
  items,
  category,
}: ServiceCardProps) {
  return (
    <Card className="relative h-full overflow-hidden border-border/80 bg-white/85 shadow-xl shadow-secondary/5 backdrop-blur transition hover:-translate-y-1.5 hover:shadow-primary/20">
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-xl before:absolute before:inset-[-1px] before:-z-10 before:rounded-[13px] before:bg-[linear-gradient(135deg,rgba(96,163,57,0.35),rgba(63,142,16,0.15),rgba(239,240,237,0.6))]" />
      <div className="absolute left-6 top-6">
        <Badge variant="secondary" className="shadow-sm shadow-secondary/30">
          {category}
        </Badge>
      </div>
      <CardHeader className="space-y-4 pt-16">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-3 pb-6">
        <ul className="space-y-2 text-sm text-muted-foreground">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
