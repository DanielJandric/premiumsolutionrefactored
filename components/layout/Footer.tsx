import Link from "next/link";
import type { Route } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const services = [
  "Nettoyage de fin de bail",
  "Conciergerie d’immeubles et PPE",
  "Entretien extérieurs",
  "Nettoyage régulier particuliers",
  "Conciergerie d’entreprise",
  "Nettoyage de fin de chantier",
  "Facility services",
  "Nettoyage sur cordes (accès difficiles)",
];

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-border bg-gradient-to-t from-primary/5 via-background to-background dark:border-border/60 dark:from-primary/15 dark:via-background/95">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Premium Solution</h3>
            <p className="text-sm text-muted-foreground">
              Conciergerie et nettoyage professionnel en Suisse romande depuis 2020.
              Une équipe de 30 collaborateurs qualifiés à votre service.
            </p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <MapPin className="mt-1 h-4 w-4 text-primary" />
                Route de Crans 81, 1978 Lens, Suisse
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <Link href="tel:+41766393653" className="hover:text-primary">
                  +41 76 639 36 53
                </Link>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <Link
                  href="mailto:info@premium-solution.ch"
                  className="hover:text-primary"
                >
                  info@premium-solution.ch
                </Link>
              </p>
              <p className="flex items-start gap-2">
                <Clock className="mt-1 h-4 w-4 text-primary" />
                Interventions du lundi au samedi, astreinte pour urgences 24/7
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-primary">Services</h4>
            <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border/80 bg-background/70 py-6 text-sm text-muted-foreground dark:border-border/60 dark:bg-background/80">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <p>
            © {new Date().getFullYear()} Premium Solution — Tous droits réservés.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href={"/mentions-legales" as Route} className="hover:text-primary">
              Mentions légales
            </Link>
            <span className="text-muted-foreground/60">•</span>
            <Link
              href={"/politique-de-confidentialite" as Route}
              className="hover:text-primary"
            >
              Politique de confidentialité
            </Link>
            <span className="text-muted-foreground/60">•</span>
            <Link href={"/contact" as Route} className="hover:text-primary">
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
