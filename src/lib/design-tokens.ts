/**
 * Phase 1 foundation design tokens.
 * Values mirror the CSS custom properties defined in src/app/globals.css.
 * Use this module when you need tokens in TypeScript (Framer Motion color
 * animations, inline styles, canvas rendering). For Tailwind utility classes,
 * use `bg-ink`, `text-warm`, etc. directly.
 */
export const tokens = {
  color: {
    ink: "oklch(0.08 0.005 260)",
    inkSoft: "oklch(0.14 0.005 260)",
    paper: "oklch(0.97 0.008 80)",
    paperDim: "oklch(0.75 0.005 260)",
    warm: "oklch(0.74 0.15 55)",
    warmHover: "oklch(0.80 0.16 55)",
    warmGlow: "oklch(0.74 0.15 55 / 35%)",
    neutralSubtle: "oklch(0.22 0.005 260)",
    neutralBorder: "oklch(0.28 0.005 260)",
  },
  font: {
    display: "var(--font-geist-sans)",
    body: "var(--font-inter)",
    mono: "var(--font-geist-mono)",
  },
  space: {
    ma: "2.5rem",
    maLg: "5rem",
  },
} as const

export type TokenColor = keyof typeof tokens.color
export type TokenFont = keyof typeof tokens.font
