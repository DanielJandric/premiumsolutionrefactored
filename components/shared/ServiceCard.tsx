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
