# Portfolio Phase 2 — Hero Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing Hero section with a cinematic crossfading AI-generated "digital zen garden" slideshow + new headline copy, matching the foundation tokens from Phase 1.

**Architecture:** Generate 4 hero stills via the `mcp__nano-banana__generate_image` MCP tool (a Gemini-backed image generator available in this session). Save them to `public/images/hero/`. Rewrite `src/components/sections/Hero.tsx` in place as a client component that crossfades the stills using `AnimatePresence` + slow Ken Burns zoom via Framer Motion (already installed). Keep the same export name `Hero` so `page.tsx` needs zero changes. Preserve the `useLanguage()` i18n integration so EN/JA copy still works.

**Tech Stack:** Next.js 16 `<Image />` with `priority` for above-the-fold, Framer Motion for crossfade + Ken Burns, Tailwind v4 with the Phase 1 tokens (`bg-ink`, `text-paper`, `text-warm`, `font-display`), `mcp__nano-banana__generate_image` for asset generation.

**User Verification:** YES — after the Hero ships, the user visually confirms the generated stills look cinematic, the crossfade feels smooth (not choppy or jarring), the headline reads strong, and no existing section regressed. If the user rejects the stills, the task re-runs with refined prompts.

**Spec reference:** `docs/superpowers/specs/2026-04-15-portfolio-upgrade-design.md`
**Previous plan:** `docs/superpowers/plans/2026-04-15-portfolio-phase-1-foundation.md` (merged)

---

## File Structure

| File | Role | Action |
|-|-|-|
| `public/images/hero/zen-01.jpg` | Hero still 1 (establishing shot) | Create via `mcp__nano-banana__generate_image` |
| `public/images/hero/zen-02.jpg` | Hero still 2 (closer, crystal rises) | Create via `mcp__nano-banana__generate_image` |
| `public/images/hero/zen-03.jpg` | Hero still 3 (peak glow, trails) | Create via `mcp__nano-banana__generate_image` |
| `public/images/hero/zen-04.jpg` | Hero still 4 (wide pull-back) | Create via `mcp__nano-banana__generate_image` |
| `src/components/sections/Hero.tsx` | Hero section component | Rewrite in place (keep export name `Hero`) |

**Why rewrite in place instead of creating `HeroVideo.tsx`:** The spec mentioned a new file name but in practice keeping `Hero.tsx` means zero `page.tsx` churn, zero import updates across the codebase, and the component name describes *what* the section is (hero section) rather than *how* it's implemented. Simpler is better.

---

## Task 0: Generate hero stills via Nano Banana MCP

**Goal:** Produce 4 cinematic "digital zen garden" hero background images, saved to `public/images/hero/`, ready to be consumed by `next/image`.

**Files:**
- Create: `public/images/hero/zen-01.jpg`
- Create: `public/images/hero/zen-02.jpg`
- Create: `public/images/hero/zen-03.jpg`
- Create: `public/images/hero/zen-04.jpg`

**Acceptance Criteria:**
- [ ] All 4 PNG files exist in `public/images/hero/`
- [ ] Each image is landscape orientation (wider than tall)
- [ ] Each image is under 2MB on disk (Next.js Image will optimize at request time, but oversized source hurts CI)
- [ ] Visual consistency across the 4: same scene, same color grade, same camera framing logic — they should look like 4 frames from a slow cinematic shot, not 4 unrelated images
- [ ] Dominant tones are deep ink + warm amber highlights (matches Phase 1 palette tokens `#0a0f1a` and `oklch(0.74 0.15 55)`)

**Verify:**
```
pwsh.exe -Command "Get-ChildItem public/images/hero/ | Select-Object Name,Length"
```
Expected: four `.png` files listed, each with a sensible byte size (typically 500KB–2MB).

**Steps:**

- [ ] **Step 1: Create the directory**

```
pwsh.exe -Command "New-Item -ItemType Directory -Force -Path public/images/hero"
```

- [ ] **Step 2: Generate still 1 — establishing shot**

Call `mcp__nano-banana__generate_image` with:
- `prompt`: `"Cinematic wide establishing shot of a dark Japanese zen garden at dusk. Raked gravel patterns glowing with subtle warm amber light trails. Moss-covered stones arranged deliberately. Soft bokeh, moody atmosphere, volumetric mist rolling low across the ground. Deep ink-black shadows, warm amber highlights. Shot on ARRI Alexa, 35mm lens, shallow depth of field, hyperrealistic, film grain, high contrast. 16:9 landscape aspect ratio."`
- `aspectRatio`: `"16:9"` (if the tool supports it; otherwise leave default)
- `outputPath` or similar: `public/images/hero/zen-01.jpg`

If the tool does not support a direct `outputPath`, read the returned image bytes and write to disk using the Write tool or a small Bash + base64 command. The Nano Banana MCP typically returns a path to a generated file — move/rename it to `public/images/hero/zen-01.jpg`.

- [ ] **Step 3: Generate still 2 — slow drift forward**

Same tool, new prompt:
`"Same dark Japanese zen garden composition as the establishing shot, camera now drifted forward. A small glowing warm amber geometric crystal hovers above the central raked gravel pattern. Soft particles of light dust in the air. Moss stones remain in frame but closer. Deep ink shadows, warm amber accent glow, cinematic color grade. 16:9 landscape."`

Save to `public/images/hero/zen-02.jpg`.

- [ ] **Step 4: Generate still 3 — peak glow**

`"Same zen garden, the glowing amber crystal now higher above the gravel, its light radiating outward in long exposure trails that follow the raked patterns. Small architectural shapes barely visible in the misty distance. Deep ink background, warm ember and amber highlights, moody cinematic atmosphere, 16:9 landscape."`

Save to `public/images/hero/zen-03.jpg`.

- [ ] **Step 5: Generate still 4 — wide pull-back**

`"Same zen garden composition, camera now pulled back to a wide shot showing the entire scene. The glowing amber crystal is a soft radiant sphere in the center. Fog rolls across the gravel. Subtle geometric grid lines barely visible in the raked sand. Futuristic yet ancient, deep ink-black with warm amber core, cinematic film still, 16:9 landscape."`

Save to `public/images/hero/zen-04.jpg`.

- [ ] **Step 6: Verify all 4 exist and look right**

```
pwsh.exe -Command "Get-ChildItem public/images/hero/ | Select-Object Name,Length"
```
Expected output: 4 files. Visually open each in an image viewer — they should look like a progression of the same scene.

If any image does NOT match the zen-garden aesthetic or looks off (e.g., wrong subject, wrong orientation, harsh colors), re-run that step with a refined prompt before committing.

- [ ] **Step 7: Commit**

```
pwsh.exe -Command "git add public/images/hero/ && git commit -m 'feat(phase-2): generate digital zen garden hero stills via Nano Banana'"
```

```json:metadata
{"files": ["public/images/hero/zen-01.jpg", "public/images/hero/zen-02.jpg", "public/images/hero/zen-03.jpg", "public/images/hero/zen-04.jpg"], "verifyCommand": "ls public/images/hero/", "acceptanceCriteria": ["4 png files exist", "landscape orientation", "consistent scene progression", "ink+warm palette"], "requiresUserVerification": false}
```

---

## Task 1: Rewrite Hero.tsx as cinematic crossfading slideshow

**Goal:** Replace `src/components/sections/Hero.tsx` with a new implementation that crossfades the 4 zen stills on a 6-second cycle with a slow Ken Burns zoom, overlays the new headline/subheadline/CTAs using Phase 1 tokens, and preserves the `useLanguage()` i18n.

**Files:**
- Modify (full rewrite): `src/components/sections/Hero.tsx`

**Acceptance Criteria:**
- [ ] Component exports `Hero` (same name as current export — no breaking change for `page.tsx`)
- [ ] Background uses all 4 `public/images/hero/zen-0{1..4}.png` stills, crossfading with `AnimatePresence` `mode="wait"` (or `popLayout` — see steps)
- [ ] Each still is displayed for 6 seconds, crossfade transition is 1.5s
- [ ] Each still has a slow Ken Burns zoom (`scale: [1, 1.08]` over 7.5s)
- [ ] First image uses `priority` + `fetchPriority="high"` on `<Image>` for LCP
- [ ] Dark overlay `bg-ink/60` above the image stack so the text stays readable
- [ ] Headline uses `font-display`, `text-paper`, size `text-hero` (from Phase 1 tokens)
- [ ] Headline: EN `"I build AI that ships."` + `"For founders who move fast."` on a second line. JA fallback: `"動くAIを。"` + `"加速する起業家へ。"`
- [ ] Subheadline: EN `"Nguyenetic — AI workflows, custom tools, and the occasional 3D experiment. Available for project work."` JA: `"Nguyenetic — AIワークフロー、カスタムツール、時々3D実験。プロジェクト受付中。"`
- [ ] Primary CTA: `"See the work ↓"` / `"実績を見る ↓"` — links to `#work`, uses warm-amber fill
- [ ] Secondary CTA: `"Book a call"` / `"相談する"` — links to `#contact`, uses warm-amber border ghost
- [ ] No imports of `Particles`, `ZenCircuit`, or any retired Phase 1 component
- [ ] `npm run build` succeeds
- [ ] `npm run lint` — no NEW errors introduced (pre-existing 4 errors in other files are OK)

**Verify:**
```
pwsh.exe -Command "npm run build && npm run lint"
```
Expected: build compiles. Lint shows the same baseline 4 errors as Phase 1, not 5.

**Steps:**

- [ ] **Step 1: Write the full new Hero.tsx**

Replace the entire contents of `src/components/sections/Hero.tsx` with:

```tsx
"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ArrowDown } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const SLIDES = [
  "/images/hero/zen-01.jpg",
  "/images/hero/zen-02.jpg",
  "/images/hero/zen-03.jpg",
  "/images/hero/zen-04.jpg",
] as const

const SLIDE_DURATION_MS = 6000
const CROSSFADE_S = 1.5
const KEN_BURNS_S = 7.5

export function Hero() {
  const { t } = useLanguage()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      SLIDE_DURATION_MS,
    )
    return () => window.clearInterval(id)
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-ink text-paper"
    >
      {/* Crossfading image stack */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.08 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{
              opacity: { duration: CROSSFADE_S, ease: "easeInOut" },
              scale: { duration: KEN_BURNS_S, ease: "linear" },
            }}
            className="absolute inset-0"
          >
            <Image
              src={SLIDES[index]}
              alt=""
              fill
              priority={index === 0}
              fetchPriority={index === 0 ? "high" : "auto"}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0 bg-ink/60"
          style={{
            backgroundImage:
              "linear-gradient(180deg, oklch(0.08 0.005 260 / 0.7) 0%, oklch(0.08 0.005 260 / 0.4) 40%, oklch(0.08 0.005 260 / 0.85) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen w-full items-center">
        <div className="mx-auto w-full max-w-6xl px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1
              className="font-display font-semibold tracking-tight text-paper"
              style={{ fontSize: "var(--text-hero)", lineHeight: 0.95 }}
            >
              <span className="block">{t("I build AI that ships.", "動くAIを。")}</span>
              <span className="block text-warm">
                {t("For founders who move fast.", "加速する起業家へ。")}
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-2xl text-lg text-paper/70 leading-relaxed"
          >
            {t(
              "Nguyenetic — AI workflows, custom tools, and the occasional 3D experiment. Available for project work.",
              "Nguyenetic — AIワークフロー、カスタムツール、時々3D実験。プロジェクト受付中。",
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#work"
              className="group inline-flex items-center gap-2 rounded-full bg-warm px-8 py-4 font-medium text-ink transition-all hover:bg-warm-hover"
            >
              <span>{t("See the work", "実績を見る")}</span>
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-warm/40 px-8 py-4 font-medium text-paper transition-all hover:border-warm hover:text-warm"
            >
              {t("Book a call", "相談する")}
            </a>
          </motion.div>
        </div>
      </div>

      {/* Slide indicator dots */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show hero slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-8 bg-warm" : "w-1.5 bg-paper/30 hover:bg-paper/60"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
```

**Notes on implementation decisions:**
- `AnimatePresence mode="sync"` is used instead of `"wait"` so the outgoing and incoming slides crossfade simultaneously (Ken Burns feels better with overlapping transitions).
- Ken Burns zoom runs for 7.5s on a 6s display cycle, which means each frame still has motion during its crossfade-out — intentional.
- Priority hint is only on the first slide (`index === 0`) — Next.js Image will lazy-load the rest. LCP is the first frame's paint.
- `ArrowDown` from `lucide-react` is already installed (check `package.json` — it's a dependency).
- `bg-warm-hover` requires `--color-warm-hover` token (added in Phase 1 Task 0).
- `text-hero` uses the `--text-hero` CSS variable defined in Phase 1 Task 0 via `font-size: var(--text-hero)` inline style (Tailwind v4 may not auto-generate a `text-hero` utility from a custom scale var, so using inline `style` is the safe path).
- The gradient overlay uses inline `style` for precise three-stop control the Tailwind gradient utilities can't easily express.

- [ ] **Step 2: Build**

```
pwsh.exe -Command "npm run build"
```
Expected: `Compiled successfully`. If Next/Image complains about missing images, verify Task 0 completed and files exist under `public/images/hero/`.

- [ ] **Step 3: Lint**

```
pwsh.exe -Command "npm run lint"
```
Expected: exit 0 with warnings only. The pre-existing 4 errors from before Phase 2 should be the same 4 — not 5. If a new error appears, it's Phase 2's responsibility to fix before commit.

- [ ] **Step 4: Commit**

```
pwsh.exe -Command "git add src/components/sections/Hero.tsx && git commit -m 'feat(phase-2): rewrite Hero with crossfading zen garden slideshow'"
```

```json:metadata
{"files": ["src/components/sections/Hero.tsx"], "verifyCommand": "npm run build && npm run lint", "acceptanceCriteria": ["export name Hero preserved", "4 slides crossfade", "ken burns zoom", "new headline+CTAs", "priority on first image", "tokens used", "build+lint green"], "requiresUserVerification": false}
```

---

## Task 2: Visual smoke test + user verification

**Goal:** Start the dev server, visually inspect the new Hero, confirm the crossfade + Ken Burns + headline + CTAs all feel right, and get explicit user sign-off before planning Phase 3.

**Files:** None modified. This is a gate.

**Acceptance Criteria:**
- [ ] `npm run dev` starts cleanly on an available port
- [ ] http://localhost:PORT renders the new Hero as the first section
- [ ] All 4 zen-garden stills appear in sequence (wait ~24s for a full cycle)
- [ ] Crossfade is smooth (no flash, no hard cut)
- [ ] Ken Burns zoom is subtle but perceptible
- [ ] Headline reads cleanly against the dark overlay (no contrast issues)
- [ ] Primary CTA "See the work" is warm amber, hoverable
- [ ] Secondary CTA "Book a call" has warm-border ghost style
- [ ] Clicking a slide indicator dot jumps to that slide
- [ ] JA language toggle still works on the Header AND swaps the Hero headline/CTAs to Japanese
- [ ] Existing sections below (Services, Work, About, Contact, Moxie chatbot) still render
- [ ] **User has explicitly confirmed** via `AskUserQuestion`

**Verify:**
```
pwsh.exe -Command "npm run dev"
```
Then open the printed URL in a browser.

**Steps:**

- [ ] **Step 1: Start the dev server in the background**

```
pwsh.exe -Command "npm run dev"
```
Wait until `✓ Ready in <time>` and capture the port from the output (default 3000; will auto-increment if taken).

- [ ] **Step 2: Prompt the user to inspect**

Tell the user: "Dev server is up at http://localhost:PORT. Open it, wait through at least one full cycle of the hero (~24 seconds for all 4 slides), hover the CTAs, click a slide indicator dot, toggle the JA language — then answer the verification question."

- [ ] **Step 3: User verification block**

**User Verification Required:**
Before marking this task complete, you MUST call AskUserQuestion:
```yaml
AskUserQuestion:
  question: "Phase 2 Hero is live. Do the AI-generated stills look cinematic, does the crossfade feel smooth, and does the new headline read strong — with no regressions below the fold?"
  header: "Verification"
  options:
    - label: "Looks right, ship Phase 3"
      description: "Stills are on-brand, crossfade smooth, headline strong, no regressions — ready to plan Phase 3 (sections reskin: Services + Work bento grid)"
    - label: "Needs fixes"
      description: "Something is off (stills wrong, crossfade choppy, copy weak, something broke) — describe it and I will patch before moving on"
```

**If the user selects the negative option:** The task is NOT complete. Apply fixes (which may include re-running Task 0 with refined prompts for specific slides), rebuild, and re-verify with AskUserQuestion again.

- [ ] **Step 4: Stop the dev server once verified**

When the user confirms, stop the dev server process that was started in Step 1.

```json:metadata
{"files": [], "verifyCommand": "npm run dev", "acceptanceCriteria": ["dev ready", "hero renders", "crossfade smooth", "ken burns visible", "headline readable", "CTAs styled", "dots work", "JA toggle works", "nothing regressed", "user sign-off"], "requiresUserVerification": true, "userVerificationPrompt": "Phase 2 Hero is live. Do the AI-generated stills look cinematic, does the crossfade feel smooth, and does the new headline read strong — with no regressions below the fold?"}
```

---

## Phase 2 Complete — Next Steps

When all 3 tasks above are marked complete and the user has signed off:

1. **Plan Phase 3 (sections reskin)** — invoke `writing-plans` scoped to: Services section visual upgrade with Phase 1 tokens + Work section rebuild as a bento grid with Nano Banana case-study stills.
2. **Do NOT start Phases 4–6** until Phase 3 is shipped and verified.

Per-phase verification cycle: plan → implement → user verify → next.
