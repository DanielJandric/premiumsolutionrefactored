import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

type Breadcrumb = {
  label: string;
  href?: Route;
};

type CollaboratorPageHeaderProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode;
  className?: string;
};

export function CollaboratorPageHeader({
  icon,
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: CollaboratorPageHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Link
            href="/collaborateurs"
            className="flex items-center gap-1 transition hover:text-foreground"
          >
            <Home className="h-3.5 w-3.5" />
            Dashboard
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <div key={`${crumb.label}-${index}`} className="flex items-center gap-2">
              <ChevronRight className="h-3 w-3" />
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="transition hover:text-foreground"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>
      ) : null}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          {icon ? (
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
              {icon}
            </span>
          ) : null}
          <div>
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
