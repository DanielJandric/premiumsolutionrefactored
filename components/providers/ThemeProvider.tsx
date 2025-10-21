"use client";

import * as React from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: "class" | "data-theme";
  defaultTheme?: string;
  enableSystem?: boolean;
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
}: ThemeProviderProps) {
  React.useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => Promise<void>;
    };

    if (typeof doc.startViewTransition === "function") {
      const vtStyle = doc.createElement("style");
      vtStyle.setAttribute("data-theme-view-transition", "true");
      vtStyle.textContent = `
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation-duration: 0.5s;
        }
      `;
      doc.head.appendChild(vtStyle);

      return () => {
        vtStyle.remove();
      };
    }

    const fallbackStyle = doc.createElement("style");
    fallbackStyle.setAttribute("data-theme-fallback", "true");
    fallbackStyle.textContent = `
      *,
      *::before,
      *::after {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
      }
    `;
    doc.head.appendChild(fallbackStyle);

    return () => {
      fallbackStyle.remove();
    };
  }, []);

  return (
    <NextThemeProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemeProvider>
  );
}
