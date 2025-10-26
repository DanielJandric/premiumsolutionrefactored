/**
 * Premium Solution Design Tokens
 * Palette, typography and layout scales for the premium aesthetic.
 */

// ========================================
// COLORS
// ========================================

export const colors = {
  // Evergreen palette (primary brand)
  green: {
    50: "#F2F6F3",
    100: "#E3EEE5",
    200: "#C5DECF",
    300: "#A0CBB4",
    400: "#76B59A",
    500: "#4A9A7C",
    600: "#2F7D60",
    700: "#216149",
    800: "#184838",
    900: "#102F25",
  },

  // Golden highlights (secondary)
  lime: {
    50: "#FBF6EC",
    100: "#F4E8CF",
    200: "#EBD2A5",
    300: "#E1BC7A",
    400: "#D4A65C",
    500: "#C0903F",
    600: "#A67432",
    700: "#845923",
    800: "#634020",
    900: "#422B11",
  },

  // Warm slate neutrals
  slate: {
    50: "#F6F3ED",
    100: "#ECE6DA",
    200: "#DACFBF",
    300: "#C7B9A5",
    400: "#B19F8C",
    500: "#998574",
    600: "#7B6A5B",
    700: "#5C4F44",
    800: "#3D352F",
    900: "#1F1A16",
  },

  // Premium gold range
  gold: {
    50: "#FFF9EE",
    100: "#FBEED2",
    200: "#F1DDAE",
    300: "#E7CB89",
    400: "#DCB76D",
    500: "#C59C4D",
    600: "#A67E39",
    700: "#84622D",
    800: "#604824",
    900: "#3D2E1A",
  },

  // Sandstone backgrounds
  accent: {
    50: "#FBF8F1",
    100: "#F5EFE3",
    200: "#EADFCF",
    300: "#DDCFB8",
    400: "#C6B89C",
    500: "#AF9F83",
    600: "#8E8067",
    700: "#6D634E",
    800: "#4C4637",
    900: "#2C2821",
  },

  // Semantics
  semantic: {
    success: {
      light: "#D5F5E6",
      DEFAULT: "#139A62",
      dark: "#0B6D46",
    },
    warning: {
      light: "#FEF0D0",
      DEFAULT: "#EDAE49",
      dark: "#B37720",
    },
    error: {
      light: "#FCE2DA",
      DEFAULT: "#D64545",
      dark: "#A42E2E",
    },
    info: {
      light: "#E3EEF8",
      DEFAULT: "#3B82F6",
      dark: "#1E4E8C",
    },
  },

  neutral: {
    darkest: "#0E1411",
    dark: "#1F2A24",
    light: "#F7F3EB",
    white: "#FFFFFF",
  },
} as const;

// ========================================
// SPACING
// ========================================

export const spacing = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "28px",
  8: "32px",
  10: "40px",
  12: "48px",
  14: "56px",
  16: "64px",
  20: "80px",
  24: "96px",
  28: "112px",
  32: "128px",
  36: "144px",
  40: "160px",
  48: "192px",
  56: "224px",
  64: "256px",
} as const;

// ========================================
// TYPOGRAPHY
// ========================================

type Typography = {
  fontFamily: {
    display: string;
    body: string;
    mono: string;
  };
  fontSize: Record<
    string,
    [
      fontSize: string,
      {
        lineHeight: string;
        letterSpacing: string;
        fontWeight?: string | number;
      }
    ]
  >;
  fontWeight: Record<string, string>;
  lineHeight: Record<string, string>;
  letterSpacing: Record<string, string>;
};

export const typography: Typography = {
  fontFamily: {
    display: "var(--font-playfair), var(--font-manrope), system-ui, sans-serif",
    body: "var(--font-inter), var(--font-manrope), system-ui, sans-serif",
    mono: "ui-monospace, monospace",
  },

  fontSize: {
    xs: ["clamp(0.72rem, 0.70rem + 0.10vw, 0.8rem)", { lineHeight: "1.3", letterSpacing: "0.05em" }],
    sm: ["clamp(0.84rem, 0.82rem + 0.14vw, 0.95rem)", { lineHeight: "1.45", letterSpacing: "0.01em" }],
    base: ["clamp(1rem, 0.96rem + 0.18vw, 1.12rem)", { lineHeight: "1.58", letterSpacing: "0" }],
    lg: ["clamp(1.18rem, 1.10rem + 0.28vw, 1.38rem)", { lineHeight: "1.65", letterSpacing: "-0.005em" }],
    xl: ["clamp(1.38rem, 1.20rem + 0.42vw, 1.68rem)", { lineHeight: "1.7", letterSpacing: "-0.01em" }],
    "2xl": ["clamp(1.68rem, 1.40rem + 0.66vw, 2.0rem)", { lineHeight: "1.35", letterSpacing: "-0.015em" }],
    "3xl": ["clamp(2.1rem, 1.70rem + 0.92vw, 2.55rem)", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
    "4xl": ["clamp(2.55rem, 2.0rem + 1.2vw, 3.1rem)", { lineHeight: "1.18", letterSpacing: "-0.025em" }],
    "5xl": ["clamp(3.1rem, 2.4rem + 1.4vw, 3.8rem)", { lineHeight: "1.12", letterSpacing: "-0.03em" }],
    "6xl": ["clamp(3.6rem, 2.8rem + 1.6vw, 4.4rem)", { lineHeight: "1.08", letterSpacing: "-0.035em" }],
    "7xl": ["clamp(4.1rem, 3.1rem + 1.8vw, 5.0rem)", { lineHeight: "1.06", letterSpacing: "-0.04em" }],
    "8xl": ["clamp(4.7rem, 3.5rem + 2.0vw, 5.8rem)", { lineHeight: "1.04", letterSpacing: "-0.045em" }],
    "9xl": ["clamp(5.3rem, 3.9rem + 2.3vw, 6.6rem)", { lineHeight: "1.02", letterSpacing: "-0.05em" }],
  },

  fontWeight: {
    thin: "100",
    extralight: "200",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  },

  lineHeight: {
    none: "1",
    tight: "1.2",
    snug: "1.35",
    normal: "1.5",
    relaxed: "1.7",
    loose: "1.9",
  },

  letterSpacing: {
    tighter: "-0.06em",
    tight: "-0.03em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
};

// ========================================
// BORDER RADIUS
// ========================================

export const borderRadius = {
  none: "0",
  xs: "0.375rem",
  sm: "0.5rem",
  DEFAULT: "0.75rem",
  md: "1rem",
  lg: "1.25rem",
  xl: "1.5rem",
  "2xl": "2rem",
  "3xl": "2.5rem",
  full: "9999px",
} as const;

// ========================================
// SHADOWS
// ========================================

export const shadows = {
  xs: "0 1px 4px rgba(14, 20, 17, 0.08)",
  sm: "0 4px 12px rgba(14, 20, 17, 0.08), 0 2px 6px rgba(14, 20, 17, 0.05)",
  DEFAULT: "0 8px 22px rgba(14, 20, 17, 0.12), 0 4px 10px rgba(14, 20, 17, 0.08)",
  md: "0 16px 36px rgba(12, 18, 15, 0.14), 0 8px 20px rgba(12, 18, 15, 0.1)",
  lg: "0 24px 56px rgba(10, 15, 12, 0.16), 0 12px 28px rgba(10, 15, 12, 0.12)",
  xl: "0 32px 72px rgba(8, 12, 10, 0.18), 0 18px 40px rgba(8, 12, 10, 0.12)",
  "2xl": "0 40px 95px rgba(8, 12, 10, 0.22)",
  inner: "inset 0 1px 0 rgba(255, 255, 255, 0.35), inset 0 -1px 0 rgba(18, 26, 22, 0.18)",

  glow: {
    sm: "0 0 20px rgba(74, 154, 124, 0.32)",
    DEFAULT: "0 0 32px rgba(74, 154, 124, 0.42), 0 0 56px rgba(31, 125, 96, 0.32)",
    md: "0 0 40px rgba(192, 144, 63, 0.45), 0 0 80px rgba(192, 144, 63, 0.35)",
  },

  glowDark: {
    sm: "0 0 24px rgba(160, 210, 182, 0.38)",
    DEFAULT: "0 0 36px rgba(160, 210, 182, 0.42), 0 0 70px rgba(76, 154, 124, 0.32)",
    md: "0 0 48px rgba(210, 168, 93, 0.48), 0 0 90px rgba(210, 168, 93, 0.35)",
  },

  colored: {
    primary: "0 12px 48px rgba(47, 125, 96, 0.32)",
    secondary: "0 12px 48px rgba(192, 144, 63, 0.32)",
    gold: "0 14px 56px rgba(192, 144, 63, 0.36)",
  },
} as const;

// ========================================
// ANIMATIONS
// ========================================

export const animations = {
  duration: {
    fastest: "100ms",
    faster: "150ms",
    fast: "220ms",
    DEFAULT: "320ms",
    slow: "520ms",
    slower: "720ms",
    slowest: "1000ms",
  },

  easing: {
    linear: "linear",
    DEFAULT: "cubic-bezier(0.33, 1, 0.68, 1)",
    in: "cubic-bezier(0.64, 0, 0.78, 0)",
    out: "cubic-bezier(0.16, 1, 0.3, 1)",
    inOut: "cubic-bezier(0.76, 0, 0.24, 1)",
    smooth: "cubic-bezier(0.37, 0, 0.63, 1)",
    bounce: "cubic-bezier(0.25, 1.5, 0.5, 1)",
  },
} as const;

// ========================================
// BREAKPOINTS
// ========================================

export const breakpoints = {
  xs: "475px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// ========================================
// Z-INDEX
// ========================================

export const zIndex = {
  0: "0",
  10: "10",
  20: "20",
  30: "30",
  40: "40",
  50: "50",
  dropdown: "1000",
  sticky: "1020",
  fixed: "1030",
  modalBackdrop: "1040",
  modal: "1050",
  popover: "1060",
  tooltip: "1070",
} as const;

// ========================================
// CONTAINER
// ========================================

export const container = {
  padding: {
    DEFAULT: "1.25rem",
    sm: "1.75rem",
    md: "2.25rem",
    lg: "2.75rem",
    xl: "3.25rem",
    "2xl": "4rem",
  },
  maxWidth: {
    sm: "640px",
    md: "768px",
    lg: "1040px",
    xl: "1280px",
    "2xl": "1400px",
  },
} as const;
