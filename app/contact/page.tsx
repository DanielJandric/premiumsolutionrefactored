import Image from "next/image";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContactForm } from "@/components/shared/ContactForm";

const contactDetails = [
  {
    label: "Téléphone",
    value: "+41 76 639 36 53",
    href: "tel:+41766393653",
  },
  {
    label: "Email",
    value: "info@premium-solution.ch",
    href: "mailto:info@premium-solution.ch",
  },
  {
    label: "Adresse",
    value: "Route de Crans 81, 1978 Lens, Suisse",
  },
];

export default function ContactPage() {
  return (
    <div className="space-y-20 pb-24">
      <AnimatedSection className="border-b border-border/70 bg-gradient-to-br from-primary/10 via-background to-accent/20 py-20">
        <div className="container mx-auto px-4">
          <PageHeader
            eyebrow="Contact"
            title="Parlons de votre projet de conciergerie ou de nettoyage"
            description="Notre équipe répond sous 24 h ouvrables. Pour une intervention urgente, contactez-nous directement par téléphone. Sinon, utilisez le formulaire ou lancez le chatbot pour obtenir un devis instantané."
            align="center"
          />
        </div>
      </AnimatedSection>

      <AnimatedSection className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-[1fr,1.2fr]">
          <div className="space-y-8">
            <div className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-lg shadow-primary/5">
              <h3 className="text-2xl font-semibold text-foreground">
                Coordonnées principales
              </h3>
              <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
                {contactDetails.map((item) => (
                  <li key={item.label}>
                    <span className="block text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                      {item.label}
                    </span>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-base text-foreground hover:text-primary"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-base text-foreground">{item.value}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-dashed border-primary/30 bg-muted/50 p-6 text-sm text-muted-foreground">
              <p>
                Nos horaires d’accueil téléphonique : lundi au vendredi, 08 h 00 – 18 h 30.
                En dehors de ces plages, laissez-nous un message, nous vous rappellerons rapidement.
              </p>
              <p className="mt-3">
                Intervention terrain : 7 j/7 pour les urgences (dégâts des eaux, remises de clés).
                Un coordinateur Premium Solution reste joignable.
              </p>
            </div>
            <div className="relative h-56 overflow-hidden rounded-3xl border border-primary/20 shadow-xl shadow-primary/15">
              <Image
                src="/images/cta-swiss-romande.png"
                alt="Carte aérienne de la Suisse romande illustrant la zone d’intervention de Premium Solution"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 420px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
              <p className="absolute bottom-4 left-4 max-w-[260px] text-sm font-medium text-white">
                Nous intervenons dans tout le Valais et la Suisse romande
              </p>
            </div>
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
