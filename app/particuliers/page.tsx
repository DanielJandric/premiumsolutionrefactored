import Image from "next/image";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

const packages = [
  {
    name: "Studio / 1 pièce",
    price: "CHF 200 - 300",
    description:
      "Nettoyage complet avec attention particulière aux surfaces vitrées, cuisine et salle de bain.",
  },
  {
    name: "2 à 3 pièces",
    price: "CHF 300 - 550",
    description:
      "Gestion des pièces de vie, rangement des placards, détartrage salle de bain et électroménagers.",
  },
  {
    name: "4 pièces et plus",
    price: "CHF 550 - 900",
    description:
      "Équipe renforcée pour une intervention rapide : vitres, balcon/terrasse, caves et annexes.",
  },
];

const extras = [
  "Option produits écologiques : +10 % sur le tarif, idéale pour préserver votre santé et l’environnement.",
  "Assistance à l’état des lieux : un référent Premium Solution reste à vos côtés jusqu’à la signature.",
  "Service garde-meubles et nettoyage après déménagement sur demande.",
  "Nettoyage après rénovation légère ou home staging disponible.",
];

export default function ParticuliersPage() {
  return (
    <div className="space-y-20 pb-24">
      <AnimatedSection className="border-b border-border/70 bg-gradient-to-br from-accent via-background to-primary/10 py-20">
        <div className="container mx-auto px-4">
          <PageHeader
            eyebrow="Particuliers"
            title="Nettoyage de fin de bail garanti & entretien régulier"
            description="Premium Solution s’occupe de votre logement lors de votre déménagement. Nous garantissons un nettoyage irréprochable, validé par la gérance, et proposons des prestations régulières pour votre nouveau domicile."
            align="center"
          />
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr,1fr]">
            <div className="relative h-80 overflow-hidden rounded-3xl border border-primary/20 shadow-xl shadow-primary/15">
              <Image
                src="/images/service-fin-de-bail.png"
                alt="Équipe Premium Solution effectuant un nettoyage de fin de bail dans une cuisine moderne"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 480px"
                priority
              />
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-foreground">
                Nos fourchettes tarifaires indicatives
              </h3>
              <div className="grid gap-4">
                {packages.map((pack) => (
                  <div
                    key={pack.name}
                    className="rounded-3xl border border-border/60 bg-card/90 p-5 shadow-lg shadow-primary/5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-primary">
                        {pack.name}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {pack.price}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {pack.description}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Les tarifs définitifs sont précisés après collecte des informations via notre
                chatbot (surface, état du logement, demandes spécifiques).
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">
              Nos garanties pour votre fin de bail
            </h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {extras.map((extra) => (
                <li
                  key={extra}
                  className="rounded-3xl border border-border/60 bg-card/80 p-4"
                >
                  {extra}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">
              Entretien régulier de domicile
            </h3>
            <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 text-sm text-muted-foreground">
              <p>
                Nos équipes peuvent également s’occuper de votre nouveau logement :
                ménages hebdomadaires ou bimensuels, préparation avant réception d’invités,
                nettoyage saisonnier (printemps/automne) et entretien extérieur léger.
              </p>
              <p className="mt-4">
                Tarifs indicatifs : CHF 35-45/h selon la fréquence et la taille du logement.
                Possibilité de forfait mensuel avantageux.
              </p>
            </div>
            <div className="rounded-3xl border border-dashed border-primary/30 bg-card/80 p-6 text-sm text-muted-foreground">
              <p>
                Pour un devis instantané, utilisez notre chatbot Sophie. Elle vous posera des
                questions étape par étape pour préparer un document PDF personnalisé que vous
                recevrez immédiatement.
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-muted/40 py-16">
        <div className="container mx-auto flex flex-col items-center gap-6 px-4 text-center">
          <h3 className="text-2xl font-semibold text-foreground">
            Envie de déléguer votre nettoyage de fin de bail ?
          </h3>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Répondez à notre chatbot en quelques minutes pour recevoir un devis garanti
            Premium Solution. Nos coordinateurs confirment ensuite la date d’intervention et
            vous accompagnent jusqu’à la remise des clés.
          </p>
          <Button asChild size="lg">
            <a href="/devis">Lancer la demande de devis</a>
          </Button>
        </div>
      </AnimatedSection>
    </div>
  );
}
