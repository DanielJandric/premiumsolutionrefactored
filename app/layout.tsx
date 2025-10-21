import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";

import "@/app/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ScrollProgress } from "@/components/shared/ScrollProgress";

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
  title: "Premium Solution",
  description:
    "Premium Solution - Conciergerie et nettoyage professionnel en Suisse romande.",
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
          <ScrollProgress />
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
