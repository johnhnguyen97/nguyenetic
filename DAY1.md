# Day 1 Audit — nguyenetic portfolio

## Build health

- **Build status:** GREEN — `next build` completes cleanly, all 3 `/work/*` routes SSG as static pages.
- **Lint status:** RED — 5 errors, 3 warnings. Zero errors are in `/work/*` routes; all errors are in core app files.
  - `src/app/page.tsx:36` — `setState` called synchronously inside `useEffect` (`react-hooks/set-state-in-effect`)
  - `src/components/layout/Header.tsx:47` — bare `<a>` instead of Next.js `<Link>` (`@next/next/no-html-link-for-pages`)
  - `src/components/ui/logo.tsx:165` — component defined inside render function (`react-hooks/static-components`)
  - `src/components/ui/zen-circuit.tsx:188` — `Math.random()` called during render (`react-hooks/purity`)
  - `src/lib/language-context.tsx:20` — `setState` called synchronously inside `useEffect`
  - Warnings (3): `particles.tsx` missing `useEffect` dependencies (not blocking)
- **Fix applied:** None — build is green and no `/work/*` routes are broken. Lint errors are pre-existing in core files; fixing them is out of scope for the Day 1 audit.

---

## Existing /work/* inventory

| Route | Lines | What it does | Funnel wiring |
|-|-|-|-|
| `/work/auto-quote` | 1,439 | Full auto-shop estimate flow: photo upload → vehicle info → package/addon selection → customer info → digital signature → deposit confirmation. Self-contained `useReducer` state machine. Uses `window.print()` for PDF. | Collects customer email/phone in the flow but data goes nowhere (no API call, no Supabase write). No explicit "book a service" or "get this for your shop" CTA. No link back to nguyenetic.com services. |
| `/work/reservation` | 278 | Restaurant deposit reservation: date/time/party size → guest details → Stripe-style checkout → confirmation. Modular — 8 subcomponents in `/components/`. Owner dashboard view available via toggle. | Captures guest email but no lead storage. No CTA for "get this system for your restaurant". Confirmation step is the natural upsell moment — unused. |
| `/work/seo-audit` | 1,391 | Local SEO scorecard: URL input → deterministic seeded audit across 6 sections (GBP, citations, reviews, on-page, performance, AI search) → report with per-check fix guidance. Uses `window.print()` PDF + share link. | **Has a CTA** — "Book a 15-min call" mailto link + "Download PDF". Best-wired of the three. Missing email capture before PDF download (high-friction gate opportunity). |

---

## Work.tsx wiring

The Work.tsx component renders 6 project tiles using a `projects` array where `url` fields point to **external live URLs** (gojun.vercel.app, fastfixwhitemarsh.com, etc.) or `#work` anchors. None of the 3 existing `/work/*` routes are referenced anywhere in `Work.tsx` — there is no data entry for auto-quote, reservation, or seo-audit, and no `href="/work/..."` anywhere in the file. The tiles are clickable via `href={project.url}` but they navigate away from the portfolio. Task #5 must add 3+ new project entries to the `projects` array pointing to `/work/auto-quote`, `/work/reservation`, `/work/seo-audit` (and eventually the 4 new apps).

---

## Shared architecture proposal

### AI client (`src/lib/ai/`)

**Current state:** The only AI integration is `src/app/api/chat/route.ts` — a Groq-backed chatbot (llama-3.3-70b) for the Moxie assistant. The project has `@ai-sdk/openai`, `ai` (Vercel AI SDK), and `groq-sdk` in dependencies but no Anthropic SDK. No `src/lib/ai/` directory exists.

**Proposal:** Create `src/lib/ai/client.ts` with a thin wrapper exporting two functions:
- `generateText(prompt, opts)` — for cheap single-turn ops (waste categorization, call-rescue SMS drafts, review reply generation). Default to `claude-haiku-4-5-20251001`.
- `generateStream(messages, opts)` — for interactive streaming (estimate-translate). Default to `claude-sonnet-4-6`.

Add `ANTHROPIC_API_KEY` to `.env.local`. The wrapper reads `process.env.ANTHROPIC_API_KEY` and throws a clear 500 with a user-friendly message if absent. All 4 new apps call this wrapper via a thin `/api/ai/` route — never directly from client components.

**Model assignment:**
| App | Use case | Model |
|-|-|-|
| waste-ledger | Categorize waste item text | haiku-4-5 |
| call-rescue | Draft SMS text-back | haiku-4-5 |
| review-reply | Generate review response | haiku-4-5 |
| estimate-translate | Parse + translate estimate | sonnet-4-6 |

### Lead capture

**Current state:** No shared lead capture exists. auto-quote and reservation collect email inside their flows but write nowhere. seo-audit has no email gate.

**Proposal:** Create `src/components/ui/LeadCapture.tsx` — a compact inline form (email + optional first name + hidden `source` prop) that `POST`s to `/api/leads`. For now, the API route appends to a local `data/leads.json` file (gitignored). When Supabase is provisioned (the `hibiki` project is already on Supabase/us-west-2 — check if nguyenetic has its own instance or reuse hibiki), swap the file write for a Supabase insert with no component changes.

Placement strategy per app:
- **seo-audit**: Gate the full report behind email (collect before showing results, or use a "download PDF" gate)
- **auto-quote**: Show after estimate is generated, before signature step
- **reservation**: Show in confirmation step ("Get notified when we build this for your restaurant")
- **waste-ledger, review-reply, estimate-translate**: Show after first meaningful output

### PDF/report helpers

**Current state:** Both auto-quote and seo-audit use `window.print()` with print-specific CSS. This works well for single-page reports.

**Recommendation:** Keep `window.print()` for all 7 apps — do NOT add `@react-pdf/renderer`. Reasons: (1) it adds ~200KB to the bundle, (2) styled print CSS already works, (3) none of the 4 new apps have complex multi-page layout needs. If a future app needs programmatic PDF generation (e.g., estimate-translate producing a formatted PDF), add `@react-pdf/renderer` at that point only.

### Design primitives

**What exists in `src/components/ui/`:**

| Component | Purpose | Reuse in new apps |
|-|-|-|
| `glass-tile.tsx` | `GlassTile` — glass card with `resting/active/interactive` tones + hover states | Yes — primary card wrapper for all new apps |
| `logo.tsx` | Nguyenetic logo SVG | Yes — page headers |
| `particles.tsx` | Animated particle canvas | No — decorative only |
| `cursor-glow.tsx` | Mouse-follow glow | No — decorative only |
| `scroll-progress.tsx` | Scroll indicator | Optional |
| `retro-grid.tsx` | Grid background | No — decorative only |
| `ink-brush.tsx` | Ink brush SVG | No — decorative only |
| `enso.tsx` | Zen circle animation | No — decorative only |
| `sakura-petals.tsx` | Falling petals animation | No — decorative only |
| `zen-scene.tsx` | 3D zen garden | No — decorative only |
| `zen-circuit.tsx` | Circuit animation | No — decorative only |

**Gaps to add for new apps (propose, not implement):**
- `src/components/ui/Button.tsx` — primary/secondary/ghost variants (currently buttons are inlined in each app)
- `src/components/ui/Input.tsx` — text input with validation state styling
- `src/components/ui/LeadCapture.tsx` — see above
- `src/components/ui/AppShell.tsx` — shared page wrapper (back link, page title, description) used by all `/work/*` pages. All 3 existing apps repeat the same header pattern.

---

## Per-new-app external requirements

| App | Services needed | Required keys | Optional-for-demo |
|-|-|-|-|
| waste-ledger | Anthropic (categorize waste text + tips) | `ANTHROPIC_API_KEY` | None — fully self-contained |
| call-rescue | Anthropic (draft SMS), Twilio (actually send SMS) | `ANTHROPIC_API_KEY` | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — demo works without Twilio by showing the drafted SMS only |
| review-reply | Anthropic (generate reply) | `ANTHROPIC_API_KEY` | None — no signup, no external service |
| estimate-translate | Anthropic (parse estimate text, rewrite for audience) | `ANTHROPIC_API_KEY` | None — fully self-contained |

**Action required before building:** Add `ANTHROPIC_API_KEY` to `.env.local`. All 4 apps block on this. Twilio keys are optional — call-rescue can demo the SMS draft UI without actually sending.

---

## Recommended execution order for waves 2+

**Wave 2 (unblock in parallel — no inter-dependencies):**
- Task #4: Fix seo-audit lint + wire funnel CTA (already has email at `hello@nguyenetic.com` — just needs email capture gate)
- Task #7: Build `/work/review-reply` — simplest new app, Anthropic only, no state machine, no subcomponents needed. Good warm-up.

**Wave 3 (after wave 2 is merged):**
- Task #2: Polish auto-quote — add LeadCapture after estimate generation
- Task #6: Build `/work/waste-ledger` — medium complexity (table + chart + AI tips)
- Task #9: Build `/work/estimate-translate` — medium complexity (text-in, translation-out, streaming)

**Wave 4:**
- Task #3: Polish reservation — add post-demo CTA
- Task #8: Build `/work/call-rescue` — most complex (Twilio optional layer, mock SMS UI needed)

**Wave 5 (after all /work/* routes exist):**
- Task #5: Wire Work.tsx tiles — add 7 project entries pointing to `/work/*` routes, replace the `#work` placeholder entries

**Parallelization note:** Tasks #6, #7, #9 are safe to run simultaneously once `ANTHROPIC_API_KEY` is provisioned and `src/lib/ai/client.ts` exists. Tasks #2 and #3 can also run in parallel. Task #5 must be last.

---

## Open questions for team-lead

- **Supabase:** Does nguyenetic have its own Supabase project, or should leads be written to the hibiki instance? This determines whether LeadCapture uses a file fallback or can go straight to Supabase from day 1.
- **Anthropic API key:** Is `ANTHROPIC_API_KEY` already in `.env.local`? If not, the 4 new apps cannot be built or demoed.
- **Twilio:** Should call-rescue be built to actually send SMS (requiring Twilio provisioning) or demo-mode only (show drafted SMS, "send" is simulated)?
- **Work.tsx overhaul scope:** Should task #5 replace the existing 6 project tiles with the 7 new `/work/*` apps, or add them as additional tiles? The current tiles show GoJUN, FastFix, EVWrap, Ichiban — these are client projects, not SaaS demos. Clarify whether the portfolio should show BOTH or pivot entirely to the SaaS demo apps.
- **Lint errors:** The 5 existing lint errors in core files (page.tsx, Header.tsx, logo.tsx, zen-circuit.tsx, language-context.tsx) are pre-existing. Should they be fixed as part of this sprint or left for a separate cleanup task? They don't block the build.
- **`@ai-sdk/openai` vs Anthropic SDK:** The project has Vercel AI SDK + OpenAI adapter installed. Should the new apps use `@ai-sdk/anthropic` (add it) to get streaming + tool use via the Vercel AI SDK pattern, or use the Anthropic SDK directly? Vercel AI SDK is more consistent with the existing `/api/chat` pattern.
