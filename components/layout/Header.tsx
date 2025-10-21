"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const visibilityRef = useRef(true);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      const previousY = lastScrollY.current;
      const threshold = 8;

      let nextVisible = visibilityRef.current;

      if (currentY < 80) {
        nextVisible = true;
      } else if (currentY > previousY + threshold) {
        nextVisible = false;
      } else if (currentY < previousY - threshold) {
        nextVisible = true;
      }

      if (nextVisible !== visibilityRef.current) {
        visibilityRef.current = nextVisible;
        setIsVisible(nextVisible);
      }

      setScrolled(currentY > 10);
      lastScrollY.current = currentY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-transform duration-300",
        "bg-gradient-to-r from-background/95 via-primary/10 to-background/95 backdrop-blur-2xl",
        isVisible ? "translate-y-0 shadow-lg shadow-primary/10" : "-translate-y-full",
        scrolled ? "border-border" : "border-border/70 dark:border-border/50",
      )}
    >
      <div className="container flex items-center justify-between py-3 md:py-4">
        <Link
          href="/"
          className="relative flex items-center gap-3 rounded-2xl border border-transparent px-1.5 py-0.5 transition hover:border-primary/30 hover:bg-primary/5 dark:hover:border-primary/40 dark:hover:bg-primary/10"
        >
          <Image
            src="/logo.png"
            alt="Logo Premium Solution"
            width={64}
            height={64}
            className="h-12 w-auto drop-shadow-[0_4px_8px_rgba(21,103,71,0.25)]"
            priority
            sizes="64px"
          />
          <span className="text-lg font-bold uppercase tracking-[0.4em] text-[#156747] sm:text-2xl">
            Premium Solution
          </span>
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

