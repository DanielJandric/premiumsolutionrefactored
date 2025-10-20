"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Phone, Mail, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

type NavHref = Route | "#";

interface NavItem {
  name: string;
  href: NavHref;
  children?: NavItem[];
}

export type NavigationItem = NavItem;

const navigation: NavItem[] = [
  { name: "Accueil", href: "/" as Route },
  {
    name: "Services",
    href: "#",
    children: [
      { name: "Gérances & PPE", href: "/gerances-ppe" as Route },
      { name: "Entreprises & Commerces", href: "/entreprises" as Route },
      { name: "Particuliers", href: "/particuliers" as Route },
      { name: "Tous les services", href: "/services" as Route },
    ],
  },
  { name: "À propos", href: "/a-propos" as Route },
  { name: "Contact", href: "/contact" as Route },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl dark:border-border/60">
      <div className="border-b border-border bg-primary text-primary-foreground dark:bg-primary/40">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-1.5 text-xs md:text-sm">
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="tel:+41766393653"
              className="flex items-center gap-2 transition hover:opacity-90"
            >
              <Phone className="h-4 w-4" />
              +41 76 639 36 53
            </a>
            <a
              href="mailto:info@premium-solution.ch"
              className="flex items-center gap-2 transition hover:opacity-90"
            >
              <Mail className="h-4 w-4" />
              info@premium-solution.ch
            </a>
          </div>
          <span className="hidden text-sm font-medium md:block">
            Interventions en Suisse romande
          </span>
        </div>
      </div>

      <div className="container flex items-center justify-between py-2.5 md:py-3">
        <Link
          href="/"
          className="relative flex items-center gap-2 rounded-2xl border border-transparent px-1.5 py-0.5 transition hover:border-primary/30 hover:bg-primary/5 dark:hover:border-primary/40 dark:hover:bg-primary/10"
        >
          <Image
            src="/logo.png"
            alt="Premium Solution"
            width={144}
            height={44}
            priority
            className="h-8 w-auto [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.15))] sm:h-9 md:h-10"
            sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 176px"
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navigation.map((item) =>
            item.children ? (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={cn(
                    "inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
                    openDropdown === item.name
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  {item.name}
                  <ChevronDown className="h-4 w-4" aria-hidden />
                </button>
                <AnimatePresence>
                  {openDropdown === item.name ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 top-full mt-3 w-64 rounded-2xl border border-border/80 bg-background shadow-xl"
                    >
                      <div className="p-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href as Route}
                            className={cn(
                              "block rounded-xl px-3 py-2 text-sm transition hover:bg-muted",
                              pathname === child.href
                                ? "bg-muted text-primary"
                                : "text-muted-foreground",
                            )}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={item.name}
                href={item.href as Route}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary",
                )}
              >
                {item.name}
              </Link>
            ),
          )}
          <Button asChild variant="gradient" className="shadow-glow">
            <Link href="/devis">Obtenir un devis</Link>
          </Button>
          <ThemeToggle className="hidden md:inline-flex" />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen((value) => !value)}
            aria-expanded={mobileOpen}
            aria-label="Ouvrir le menu mobile"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="container pb-4 md:hidden">
        <MobileMenu
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          navigation={navigation}
          currentPath={pathname}
        />
      </div>
    </header>
  );
}
