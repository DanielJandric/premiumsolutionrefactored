import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";

import "@/app/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { SkipLinks } from "@/components/shared/SkipLinks";
import { CustomCursor } from "@/components/shared/CustomCursor";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.premium-solution.ch"),
  title: {
    default: "Premium Solution CM Sàrl | Conciergerie & Nettoyage Suisse romande",
    template: "%s | Premium Solution CM Sàrl",
  },
  description:
    "Premium Solution CM Sàrl accompagne gérances, PPE, entreprises et particuliers en Suisse romande avec des prestations de conciergerie, nettoyage professionnel et facility management haut de gamme.",
  keywords: [
    "Premium Solution",
    "conciergerie Suisse romande",
    "nettoyage professionnel",
    "facility management",
    "conciergerie entreprise",
    "conciergerie PPE",
    "nettoyage fin de bail",
    "services de nettoyage Valais",
  ],
  applicationName: "Premium Solution",
  authors: [{ name: "Premium Solution CM Sàrl", url: "https://www.premium-solution.ch" }],
  creator: "Premium Solution CM Sàrl",
  publisher: "Premium Solution CM Sàrl",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Premium Solution CM Sàrl | Conciergerie & Nettoyage Suisse romande",
    description:
      "Conciergerie, nettoyage professionnel et services premium pour gérances, entreprises et particuliers en Suisse romande.",
    url: "https://www.premium-solution.ch",
    siteName: "Premium Solution CM Sàrl",
    images: [
      {
        url: "/images/hero-professional.png",
        width: 1200,
        height: 630,
        alt: "Premium Solution - Conciergerie et nettoyage haut de gamme",
      },
    ],
    locale: "fr_CH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Solution CM Sàrl | Conciergerie & Nettoyage Suisse romande",
    description:
      "Prestations de conciergerie et nettoyage premium pour gérances, entreprises et particuliers en Suisse romande.",
    creator: "@PremiumSolution",
    images: ["/images/hero-professional.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  category: "conciergerie et nettoyage professionnel",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={cn(
          inter.variable,
          manrope.variable,
          "min-h-screen bg-background text-foreground antialiased",
        )}
        style={{
          fontFamily: "Inter, Manrope, system-ui, sans-serif",
        }}
      >
        <ThemeProvider>
          <SkipLinks />
          <CustomCursor />
          <ScrollProgress />
          <div className="flex min-h-screen flex-col">
            <Header />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
