# Portfolio Phase 1 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install the new design-token foundation (ink black + off-white + warm amber accent + Geist/Inter type system) into `globals.css` and reskin the `Header` to use it, without breaking any existing component.

**Architecture:** Add *new* design tokens alongside the existing Japanese-theme tokens in `globals.css` using Tailwind v4 `@theme`. Old tokens (`accent-cyber`, `accent-sakura`, `zen-ink`, etc.) are kept intact so `Services`, `chatbot-demo`, `Logo`, `particles`, and the rest of the current site keep rendering while we reskin incrementally in later phases. Only `Header` is migrated in this phase. The site's default background flips from light to ink-black.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4 (`@theme` CSS-first config), Framer Motion (existing), `next/font/google` for Inter.

**User Verification:** YES — after the foundation ships and the dev server is running, the user visually confirms that (a) the Header reskin looks right, (b) no existing section is visibly broken, and (c) the new color palette / type pairing feels on-brand before we commit Phase 2.

**Spec reference:** `docs/superpowers/specs/2026-04-15-portfolio-upgrade-design.md`

---

## File Structure

| File | Role | Action |
|-|-|-|
| `src/app/globals.css` | Tailwind v4 theme config, all design tokens | Modify — add new tokens alongside old, flip root bg to ink |
| `src/app/layout.tsx` | Root layout, loads fonts, sets `dark` class | Modify — add Inter alongside Geist, update themeColor |
| `src/components/layout/Header.tsx` | Site header | Modify — replace `accent-cyber` refs with new `accent-warm`, keep all functionality |
| `src/lib/design-tokens.ts` | Canonical TypeScript map of new tokens (optional typed access) | Create — small, typed, documents intent |

No new dependencies required. Inter is loaded via `next/font/google` (no install needed — it's a Google Font fetched at build time by the existing Next.js font system).

---

## Task 0: Add new design tokens to globals.css

**Goal:** Introduce the new ink/off-white/amber palette + typography scale in `globals.css` without removing or overwriting any existing Japanese-theme token.

**Files:**
- Modify: `src/app/globals.css` (append to `@theme inline` block; add new `:root` vars; update `body` background)

**Acceptance Criteria:**
- [ ] New tokens exist as CSS variables: `--color-ink`, `--color-paper`, `--color-warm`, `--color-warm-glow`, `--color-neutral-subtle`
- [ ] New Tailwind utility classes resolve: `bg-ink`, `text-paper`, `text-warm`, `bg-warm/20`, `border-warm`
- [ ] Old tokens still exist: `accent-cyber`, `accent-sakura`, `accent-gold`, `zen-ink`, `zen-paper`, `zen-stone`, `glow-primary`, `glow-sakura`
- [ ] `body` renders with ink-black background by default (no `.dark` class required on `<html>` for the color to work, though the existing class is left in place)
- [ ] `npm run build` succeeds with zero new warnings
- [ ] `npm run lint` passes

**Verify:**
```
pwsh.exe -Command "npm run lint && npm run build"
```
Expected: both commands exit 0; build output includes `Compiled successfully`.

**Steps:**

- [ ] **Step 1: Read the current `globals.css`**

Use the Read tool on `src/app/globals.css`. Note the existing `@theme inline` block ends at line 83 and includes all the old tokens. Do not touch lines 7–33 (existing Japanese-theme tokens) or the ShadCN-style vars in lines 34–73.

- [ ] **Step 2: Add new tokens into the `@theme inline` block**

Insert the following block *inside* `@theme inline { ... }`, immediately after the existing `--text-heading` line (around current line 32), before `--color-background: var(--background);`:

```css
  /* === Phase 1 Foundation tokens (2026-04-15) === */
  /* Ink & paper core palette */
  --color-ink: oklch(0.08 0.005 260);
  --color-ink-soft: oklch(0.14 0.005 260);
  --color-paper: oklch(0.97 0.008 80);
  --color-paper-dim: oklch(0.75 0.005 260);

  /* Warm amber — single accent */
  --color-warm: oklch(0.74 0.15 55);
  --color-warm-hover: oklch(0.80 0.16 55);
  --color-warm-glow: oklch(0.74 0.15 55 / 35%);

  /* Neutrals */
  --color-neutral-subtle: oklch(0.22 0.005 260);
  --color-neutral-border: oklch(0.28 0.005 260);

  /* Display type scale */
  --text-hero: clamp(3.5rem, 9vw, 7.5rem);
  --text-section: clamp(2rem, 5vw, 3.5rem);

  /* Fonts — loaded in layout.tsx */
  --font-display: var(--font-geist-sans);
  --font-body: var(--font-inter);
```

- [ ] **Step 3: Update the `body` background rule to default to ink**

Replace the `@layer base { body { @apply bg-background ... } }` block. Find the LAST `@layer base` block in the file (the one at the bottom, around lines 190–197). Leave it as-is — it sets body styles that work in dark mode.

For the middle `@layer base` block (around lines 154–165), modify the `body` rule to add an explicit ink background so the site looks right even if the `dark` class is ever removed:

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply bg-ink text-paper antialiased;
    font-feature-settings: "ss01", "ss02", "cv01";
  }
}
```

**Note:** The existing `dark` class on `<html>` still activates the ShadCN dark-mode palette for any component still using those vars. We are *layering* the new ink palette on top as the explicit body default — both systems coexist.

- [ ] **Step 4: Build**

Run:
```
pwsh.exe -Command "npm run build"
```
Expected: `Compiled successfully`. If Tailwind complains about an unknown utility, re-check token names match what's added to `@theme`.

- [ ] **Step 5: Lint**

Run:
```
pwsh.exe -Command "npm run lint"
```
Expected: exit 0. No ESLint errors introduced.

- [ ] **Step 6: Commit**

```
pwsh.exe -Command "git add src/app/globals.css && git commit -m 'feat(phase-1): add foundation design tokens (ink/paper/warm)'"
```

```json:metadata
{"files": ["src/app/globals.css"], "verifyCommand": "npm run build", "acceptanceCriteria": ["new tokens resolve as tailwind utilities", "old tokens intact", "body defaults to ink bg", "build+lint green"], "requiresUserVerification": false}
```

---

## Task 1: Load Inter font in layout.tsx

**Goal:** Add the Inter font via `next/font/google` alongside the existing Geist loader so `--font-inter` resolves at runtime and the `--font-body` token in `globals.css` points at a real font.

**Files:**
- Modify: `src/app/layout.tsx` (add Inter import, variable, and apply to body className)

**Acceptance Criteria:**
- [ ] `Inter` imported from `next/font/google` with `variable: "--font-inter"` and `subsets: ["latin"]`
- [ ] `inter.variable` is appended to the `<body>` className alongside `geistSans.variable` and `geistMono.variable`
- [ ] `themeColor` light-mode entry stays valid but dark-mode entry uses the new `#0a0f1a` ink hex (matches new token)
- [ ] `npm run build` succeeds
- [ ] DevTools "Computed" inspector on `<body>` shows `--font-inter` has a resolved `__variable_*` value

**Verify:**
```
pwsh.exe -Command "npm run build"
```
Expected: build completes; Next.js font manifest includes `inter-*.woff2` in the build output.

**Steps:**

- [ ] **Step 1: Add the Inter import and loader**

Edit `src/app/layout.tsx`. Find the existing `Geist_Mono` import block (lines 2–14). Add `Inter` to the import and create a loader after `geistMono`:

```tsx
import { Geist, Geist_Mono, Inter } from "next/font/google"
```

Then after the existing `geistMono` declaration:

```tsx
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})
```

- [ ] **Step 2: Apply Inter to the body className**

Find the `<body>` element (around line 149). Update its className:

```tsx
<body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable}`}>
```

- [ ] **Step 3: Update the dark-mode themeColor to match the new ink token**

Find the `viewport` export (lines 16–24). Update the dark-mode themeColor hex:

```tsx
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1a" },
  ],
}
```

- [ ] **Step 4: Build**

Run:
```
pwsh.exe -Command "npm run build"
```
Expected: `Compiled successfully`. Build output should mention font manifest includes Inter.

- [ ] **Step 5: Commit**

```
pwsh.exe -Command "git add src/app/layout.tsx && git commit -m 'feat(phase-1): load Inter font alongside Geist'"
```

```json:metadata
{"files": ["src/app/layout.tsx"], "verifyCommand": "npm run build", "acceptanceCriteria": ["Inter loader wired", "inter.variable on body", "dark themeColor matches ink", "build green"], "requiresUserVerification": false}
```

---

## Task 2: Reskin Header with new tokens

**Goal:** Update `Header.tsx` to use the new `warm` accent color and `font-display` variable, while preserving all existing behavior (scroll state, mobile menu, language toggle).

**Files:**
- Modify: `src/components/layout/Header.tsx`

**Acceptance Criteria:**
- [ ] Logo wordmark uses `font-display` (Geist) and on hover transitions to `text-warm` (not `text-accent-cyber`)
- [ ] Desktop nav item underline uses `bg-warm` (not `bg-accent-cyber`)
- [ ] Desktop CTA button border/hover uses `border-warm` and `hover:text-warm`
- [ ] Mobile menu items hover uses `hover:text-warm`
- [ ] Language toggle active state **keeps** `bg-accent-sakura/20` — this is the JA toggle and belongs to the Japanese layer; do not change it
- [ ] `glass` utility (used for scrolled state) still works (its definition lives in `globals.css` and references `bg-background` — unchanged)
- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes

**Verify:**
```
pwsh.exe -Command "npm run build && npm run lint"
```
Expected: both pass. Smoke-test in next task.

**Steps:**

- [ ] **Step 1: Read the current Header**

Read `src/components/layout/Header.tsx` to confirm the current structure. The file is ~175 lines; focus on lines 47–89 (logo, desktop nav, CTA) and lines 139–165 (mobile menu).

- [ ] **Step 2: Replace accent-cyber references on the logo wordmark**

Find line 49:
```tsx
<span className="font-semibold tracking-tight group-hover:text-accent-cyber transition-colors">
```

Replace with:
```tsx
<span className="font-display font-semibold tracking-tight group-hover:text-warm transition-colors">
```

- [ ] **Step 3: Replace the desktop nav underline color**

Find the nav map (lines 56–65). In the `<span>` inside each link (line 63):
```tsx
<span className="absolute -bottom-1 left-0 w-0 h-px bg-accent-cyber transition-all group-hover:w-full" />
```

Replace with:
```tsx
<span className="absolute -bottom-1 left-0 w-0 h-px bg-warm transition-all group-hover:w-full" />
```

- [ ] **Step 4: Replace the desktop CTA button accents**

Find the `<a href="#contact">` element in the desktop block (lines 83–88):
```tsx
<a
  href="#contact"
  className="text-sm px-5 py-2.5 rounded-full border border-border hover:border-accent-cyber hover:text-accent-cyber transition-all"
>
```

Replace with:
```tsx
<a
  href="#contact"
  className="text-sm px-5 py-2.5 rounded-full border border-neutral-border hover:border-warm hover:text-warm transition-all"
>
```

- [ ] **Step 5: Replace the mobile menu item hover color**

Find the mobile nav map (lines 140–152). In the `<motion.a>` className (line 148):
```tsx
className="block text-2xl font-medium hover:text-accent-cyber transition-colors"
```

Replace with:
```tsx
className="block text-2xl font-medium font-display hover:text-warm transition-colors"
```

- [ ] **Step 6: Do NOT change the language toggle**

The language toggle (lines 69–82 desktop, 92–103 mobile) uses `bg-accent-sakura/20 text-accent-sakura` for the active JA state. Leave this intact — it's a semantic signifier for the Japanese language mode, not a brand color decision.

- [ ] **Step 7: Build + lint**

Run:
```
pwsh.exe -Command "npm run build && npm run lint"
```
Expected: both exit 0.

- [ ] **Step 8: Commit**

```
pwsh.exe -Command "git add src/components/layout/Header.tsx && git commit -m 'feat(phase-1): reskin Header with warm accent and display font'"
```

```json:metadata
{"files": ["src/components/layout/Header.tsx"], "verifyCommand": "npm run build && npm run lint", "acceptanceCriteria": ["header uses text-warm instead of text-accent-cyber", "desktop nav underline is warm", "CTA border+hover is warm", "mobile menu hover is warm", "JA toggle unchanged", "build+lint green"], "requiresUserVerification": false}
```

---

## Task 3: Create typed design-tokens module

**Goal:** Export a small TypeScript constant map of the new tokens so future components can reference them programmatically (for inline styles, Framer Motion color animations, etc.) with type safety and a single source of truth.

**Files:**
- Create: `src/lib/design-tokens.ts`

**Acceptance Criteria:**
- [ ] File exports a `tokens` object with `color`, `font`, and `space` sub-objects
- [ ] Values are string literals that match the CSS `@theme` entries 1:1
- [ ] Type inference on `tokens.color.warm` returns a string literal type
- [ ] TypeScript compiles (`npm run build`)

**Verify:**
```
pwsh.exe -Command "npm run build"
```
Expected: `Compiled successfully`. No type errors.

**Steps:**

- [ ] **Step 1: Create the file**

Create `src/lib/design-tokens.ts` with this content:

```ts
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
```

- [ ] **Step 2: Build to confirm TypeScript happy**

Run:
```
pwsh.exe -Command "npm run build"
```
Expected: `Compiled successfully`.

- [ ] **Step 3: Commit**

```
pwsh.exe -Command "git add src/lib/design-tokens.ts && git commit -m 'feat(phase-1): add typed design-tokens module'"
```

```json:metadata
{"files": ["src/lib/design-tokens.ts"], "verifyCommand": "npm run build", "acceptanceCriteria": ["exports tokens with color/font/space", "values match globals.css", "build green"], "requiresUserVerification": false}
```

---

## Task 4: Visual smoke test + user verification

**Goal:** Start the dev server, visually inspect the site in a browser, and get explicit user sign-off that the new foundation looks right and nothing existing is broken — before we start Phase 2 (Hero rebuild).

**Files:** None modified. This is a gate.

**Acceptance Criteria:**
- [ ] `npm run dev` starts without errors
- [ ] Browser loads http://localhost:3000 and renders
- [ ] Header logo wordmark hovers warm-amber (not cyan)
- [ ] Desktop nav underline on hover is warm-amber
- [ ] Desktop CTA button hover is warm-amber
- [ ] Body background is ink-black (not the old grayish dark)
- [ ] No existing section visually explodes (Services, Work, Hero-old, chatbot-demo, Moxie) — minor visual inconsistencies expected, but nothing should be unreadable
- [ ] **User has explicitly confirmed** all of the above via `AskUserQuestion`

**Verify:**
```
pwsh.exe -Command "npm run dev"
```
Then open http://localhost:3000 in a browser.

**Steps:**

- [ ] **Step 1: Start the dev server**

Run in the background so it survives across turns:
```
pwsh.exe -Command "npm run dev"
```

Wait until `✓ Ready in <time>` appears in the output. If the port is in use, read the dev-server output for the actual URL.

- [ ] **Step 2: Ask the user to open the browser**

Tell the user: "Dev server is up at http://localhost:3000. Open it and scroll through the whole page. Hover the header nav items, the logo wordmark, and the CTA button."

- [ ] **Step 3: User verification block**

**User Verification Required:**
Before marking this task complete, you MUST call AskUserQuestion:
```yaml
AskUserQuestion:
  question: "Phase 1 foundation is live on http://localhost:3000. Does the new ink+warm+Geist header reskin look right, and is every other existing section still rendering without visible breakage?"
  header: "Verification"
  options:
    - label: "Looks right, ship Phase 2"
      description: "Header warm accent good, nothing else broken — ready to plan Phase 2 (Hero rebuild)"
    - label: "Needs fixes"
      description: "Something is off (color, contrast, broken section) — describe it and I will patch before moving on"
```

**If the user selects the negative option:** The task is NOT complete. Apply their requested fixes, rebuild, and re-verify with AskUserQuestion again.

- [ ] **Step 4: Stop the dev server once verified**

Once the user confirms, stop the background dev server via the process shell the agent tool provides.

```json:metadata
{"files": [], "verifyCommand": "npm run dev", "acceptanceCriteria": ["dev server ready", "header reskin visible", "no existing section broken", "user sign-off captured"], "requiresUserVerification": true, "userVerificationPrompt": "Phase 1 foundation is live on http://localhost:3000. Does the new ink+warm+Geist header reskin look right, and is every other existing section still rendering without visible breakage?"}
```

---

## Phase 1 Complete — Next Steps

When all 5 tasks above are marked complete and the user has signed off:

1. **Plan Phase 2 (Hero rebuild)** — invoke `writing-plans` with the same spec, this time scoped to the Hero section: generate AI stills via `mcp__nano-banana__generate_image`, build `HeroVideo.tsx` (technically a crossfading-stills component), replace the current Hero section, update `page.tsx`.
2. **Do NOT start Phase 3+** until Phase 2 is shipped and verified.

Each phase follows the same pattern: plan → implement → user verify → next.
