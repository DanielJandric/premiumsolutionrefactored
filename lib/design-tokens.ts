/**
 * Design Tokens - Premium Solution
 * Système de design centralisé pour maintenir la cohérence visuelle
 */

// ========================================
// COLORS
// ========================================

export const colors = {
  // Palette primaire (Vert) - 50 à 900
  green: {
    50: '#F1F8EC',
    100: '#E3F1D9',
    200: '#C7E3B3',
    300: '#ABD58D',
    400: '#8FCB67',
    500: '#65A540', // Primary light
    600: '#3F8E10', // Primary DEFAULT
    700: '#32720D', // Primary dark
    800: '#265609',
    900: '#193A06',
  },

  // Palette secondaire (Vert clair) - 50 à 900
  lime: {
    50: '#F4F9EE',
    100: '#E9F3DD',
    200: '#D3E7BB',
    300: '#BDDB99',
    400: '#A7CF77',
    500: '#80B660', // Secondary light
    600: '#60A339', // Secondary DEFAULT
    700: '#4D832D', // Secondary dark
    800: '#3A6222',
    900: '#274116',
  },

  // Palette tertiaire (Bleu-gris) - Pour varier les sections
  slate: {
    50: '#F8F9FA',
    100: '#F1F3F5',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#ADB5BD',
    600: '#6C757D',
    700: '#495057',
    800: '#343A40',
    900: '#212529',
  },

  // Palette gold (Premium)
  gold: {
    50: '#FFFCF0',
    100: '#FFF9E1',
    200: '#FFF3C4',
    300: '#FFEDA6',
    400: '#FFE788',
    500: '#FFD54F',
    600: '#FFC107',
    700: '#FFA000',
    800: '#FF8F00',
    900: '#FF6F00',
  },

  // Palette accent (Beige/Cream)
  accent: {
    50: '#FCFCFB',
    100: '#F7F7F5', // Neutral light
    200: '#EFF0ED', // Accent light
    300: '#EBECE9', // Accent DEFAULT
    400: '#BCBDBA', // Accent dark
    500: '#9A9B98',
    600: '#787976',
    700: '#5F605E',
    800: '#464746',
    900: '#2E2E2D',
  },

  // Couleurs sémantiques
  semantic: {
    success: {
      light: '#D1F4E0',
      DEFAULT: '#10B981',
      dark: '#059669',
    },
    warning: {
      light: '#FEF3C7',
      DEFAULT: '#F59E0B',
      dark: '#D97706',
    },
    error: {
      light: '#FEE2E2',
      DEFAULT: '#DC2626',
      dark: '#B91C1C',
    },
    info: {
      light: '#DBEAFE',
      DEFAULT: '#3B82F6',
      dark: '#2563EB',
    },
  },

  // Couleurs neutres
  neutral: {
    darkest: '#000000',
    dark: '#164D06',
    light: '#F7F7F5',
    white: '#FFFFFF',
  },
} as const;

// ========================================
// SPACING
// ========================================

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  10: '40px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
  36: '144px',
  40: '160px',
  48: '192px',
  56: '224px',
  64: '256px',
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
    display: 'var(--font-manrope), system-ui, sans-serif',
    body: 'var(--font-inter), system-ui, sans-serif',
    mono: 'ui-monospace, monospace',
  },

  fontSize: {
    xs: ['clamp(0.72rem, 0.70rem + 0.12vw, 0.80rem)', { lineHeight: '1.25', letterSpacing: '0.05em' }],
    sm: ['clamp(0.84rem, 0.82rem + 0.16vw, 0.94rem)', { lineHeight: '1.35', letterSpacing: '0' }],
    base: ['clamp(0.98rem, 0.94rem + 0.22vw, 1.08rem)', { lineHeight: '1.55', letterSpacing: '0' }],
    lg: ['clamp(1.12rem, 1.06rem + 0.28vw, 1.32rem)', { lineHeight: '1.65', letterSpacing: '-0.01em' }],
    xl: ['clamp(1.28rem, 1.16rem + 0.38vw, 1.58rem)', { lineHeight: '1.75', letterSpacing: '-0.01em' }],
    '2xl': ['clamp(1.52rem, 1.30rem + 0.60vw, 1.92rem)', { lineHeight: '1.4', letterSpacing: '-0.015em' }],
    '3xl': ['clamp(1.92rem, 1.48rem + 0.82vw, 2.4rem)', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
    '4xl': ['clamp(2.35rem, 1.70rem + 1.10vw, 2.95rem)', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
    '5xl': ['clamp(2.85rem, 1.98rem + 1.36vw, 3.55rem)', { lineHeight: '1.15', letterSpacing: '-0.03em' }],
    '6xl': ['clamp(3.35rem, 2.26rem + 1.52vw, 4.25rem)', { lineHeight: '1.12', letterSpacing: '-0.035em' }],
    '7xl': ['clamp(3.85rem, 2.52rem + 1.70vw, 4.85rem)', { lineHeight: '1.08', letterSpacing: '-0.04em' }],
    '8xl': ['clamp(4.35rem, 2.80rem + 1.92vw, 5.65rem)', { lineHeight: '1.05', letterSpacing: '-0.045em' }],
    '9xl': ['clamp(5.10rem, 3.20rem + 2.20vw, 6.90rem)', { lineHeight: '1.02', letterSpacing: '-0.05em' }],
  },

  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  lineHeight: {
    none: '1',
    tight: '1.15',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// ========================================
// BORDER RADIUS
// ========================================

export const borderRadius = {
  none: '0',
  xs: '0.25rem',     // 4px
  sm: '0.375rem',    // 6px
  DEFAULT: '0.5rem', // 8px
  md: '0.625rem',    // 10px
  lg: '0.75rem',     // 12px
  xl: '1rem',        // 16px
  '2xl': '1.5rem',   // 24px
  '3xl': '2rem',     // 32px
  full: '9999px',
} as const;

// ========================================
// SHADOWS
// ========================================

export const shadows = {
  // Standard shadows
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',

  // Glow shadows (light mode)
  glow: {
    sm: '0 0 10px rgba(63, 142, 16, 0.2), 0 0 20px rgba(63, 142, 16, 0.1)',
    DEFAULT: '0 0 20px rgba(63, 142, 16, 0.3), 0 0 40px rgba(63, 142, 16, 0.2), 0 0 60px rgba(63, 142, 16, 0.1)',
    md: '0 0 30px rgba(63, 142, 16, 0.4), 0 0 60px rgba(63, 142, 16, 0.3), 0 0 90px rgba(63, 142, 16, 0.2)',
    lg: '0 0 40px rgba(63, 142, 16, 0.5), 0 0 80px rgba(63, 142, 16, 0.3), 0 0 120px rgba(63, 142, 16, 0.2)',
  },

  // Glow shadows (dark mode)
  glowDark: {
    sm: '0 0 15px rgba(126, 194, 86, 0.3), 0 0 30px rgba(126, 194, 86, 0.2)',
    DEFAULT: '0 0 25px rgba(126, 194, 86, 0.4), 0 0 50px rgba(126, 194, 86, 0.3), 0 0 75px rgba(126, 194, 86, 0.2)',
    md: '0 0 40px rgba(126, 194, 86, 0.5), 0 0 80px rgba(126, 194, 86, 0.4), 0 0 120px rgba(126, 194, 86, 0.3)',
    lg: '0 0 50px rgba(126, 194, 86, 0.6), 0 0 100px rgba(126, 194, 86, 0.4), 0 0 150px rgba(126, 194, 86, 0.3)',
  },

  // Colored shadows
  colored: {
    primary: '0 8px 40px -12px rgba(63, 142, 16, 0.25)',
    secondary: '0 8px 40px -12px rgba(96, 163, 57, 0.25)',
    gold: '0 8px 40px -12px rgba(255, 193, 7, 0.3)',
  },
} as const;

// ========================================
// ANIMATIONS
// ========================================

export const animations = {
  duration: {
    fastest: '100ms',
    faster: '150ms',
    fast: '200ms',
    DEFAULT: '300ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms',
  },

  easing: {
    linear: 'linear',
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: 'cubic-bezier(0.23, 1, 0.32, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// ========================================
// BREAKPOINTS
// ========================================

export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ========================================
// Z-INDEX
// ========================================

export const zIndex = {
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  dropdown: '1000',
  sticky: '1020',
  fixed: '1030',
  modalBackdrop: '1040',
  modal: '1050',
  popover: '1060',
  tooltip: '1070',
} as const;

// ========================================
// CONTAINER
// ========================================

export const container = {
  padding: {
    DEFAULT: '1rem',    // 16px
    sm: '1.5rem',       // 24px
    md: '2rem',         // 32px
    lg: '2.5rem',       // 40px
    xl: '3rem',         // 48px
    '2xl': '4rem',      // 64px
  },
  maxWidth: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px',
  },
} as const;
