"use client";

import { useEffect, useState } from "react";
import { MoonStar, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  const isDark = currentTheme === "dark";

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className={cn("h-10 w-10 rounded-full", className)}
      aria-label="Changer le thème"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <SunMedium
          className={cn(
            "h-5 w-5 transition-all duration-200",
            !mounted || isDark ? "scale-0 opacity-0" : "scale-100 opacity-100",
          )}
        />
        <MoonStar
          className={cn(
            "absolute h-5 w-5 transition-all duration-200",
            !mounted || !isDark ? "scale-0 opacity-0" : "scale-100 opacity-100",
          )}
        />
      </span>
      <span className="sr-only">
        {isDark ? "Basculer en mode clair" : "Basculer en mode sombre"}
      </span>
    </Button>
  );
}
