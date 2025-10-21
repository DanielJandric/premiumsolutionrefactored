import Link from "next/link";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  ClipboardList,
  Files,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logoutCollaboratorAction } from "@/app/collaborateurs/actions";

const NAV_LINKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/collaborateurs",
    icon: LayoutDashboard,
  },
  {
    key: "requests",
    label: "Demandes",
    href: "/collaborateurs/demandes",
    icon: ClipboardList,
  },
  {
    key: "chat",
    label: "Assistant",
    href: "/collaborateurs/chat",
    icon: MessageSquare,
  },
  {
    key: "documents",
    label: "Documents",
    href: "/collaborateurs/documents",
    icon: Files,
  },
] as const;

export type CollaboratorNavKey = (typeof NAV_LINKS)[number]["key"];

type CollaboratorShellProps = {
  active: CollaboratorNavKey;
  children: ReactNode;
};

export function CollaboratorShell({ active, children }: CollaboratorShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background pb-20">
      <header className="border-b border-border/80 bg-background/90 backdrop-blur">
        <div className="container flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
              Premium Solution
            </p>
            <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
              Espace collaborateurs
            </h1>
            <p className="text-sm text-muted-foreground">
              Pilotez les demandes clients, l&apos;assistant interne et les documents centralises.
            </p>
          </div>
          <form action={logoutCollaboratorAction}>
            <Button variant="outline" size="sm" className="gap-2">
              <LogOut className="h-4 w-4" />
              Se deconnecter
            </Button>
          </form>
        </div>
        <nav className="border-t border-border/70 bg-background/80">
          <div className="container flex flex-wrap items-center gap-2 py-2.5">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = active === link.key;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/40"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="container py-10">{children}</main>
    </div>
  );
}
