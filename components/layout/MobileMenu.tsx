import Link from "next/link";
import type { Route } from "next";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { NavigationItem } from "@/components/layout/Header";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  navigation: NavigationItem[];
  currentPath: string;
}

export function MobileMenu({
  open,
  onClose,
  navigation,
  currentPath,
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden rounded-2xl border border-border bg-background/95 p-4 shadow-lg backdrop-blur dark:border-border/60 dark:bg-background/90"
        >
          <nav className="space-y-4">
            {navigation.map((item) => (
              <div key={item.name} className="space-y-2">
                <Link
                  href={item.href === "#" ? ("/" as Route) : (item.href as Route)}
                  className={cn(
                    "flex items-center justify-between text-base font-medium transition-colors",
                    currentPath === item.href
                      ? "text-primary"
                      : "text-foreground hover:text-primary",
                  )}
                  onClick={onClose}
                >
                  {item.name}
                </Link>
                    {item.children ? (
                      <div className="space-y-2 rounded-xl border border-dashed border-border/60 bg-muted/40 p-3 dark:border-border/50 dark:bg-muted/20">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href as Route}
                        className={cn(
                          "block text-sm transition-colors",
                          currentPath === child.href
                            ? "text-primary"
                            : "text-muted-foreground hover:text-primary",
                        )}
                        onClick={onClose}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <Link
              href="/devis"
              className="flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90"
              onClick={onClose}
            >
              Obtenir un devis
            </Link>
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
