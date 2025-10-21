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
    // Add View Transition API support for theme changes
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      // Enable smooth theme transitions using View Transitions API
      const style = document.createElement('style');
      style.textContent = `
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation-duration: 0.5s;
        }
      `;
      document.head.appendChild(style);
    } else {
      // Fallback to CSS transitions for browsers that don't support View Transitions
      const style = document.createElement('style');
      style.textContent = `
        * {
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
        *::before,
        *::after {
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
      `;
      document.head.appendChild(style);

      // Remove transitions after theme change to avoid performance issues
      setTimeout(() => {
        style.remove();
      }, 500);
    }
  }, []);

  return (
    <NextThemeProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      // Enable transitions on theme change
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemeProvider>
  );
}
