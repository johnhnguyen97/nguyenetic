# brag-plan — Nguyenetic

## What it is
Nguyenetic is a one-person studio ("a studio in orbit around you") selling managed websites, design and digital ops to small service businesses. Its portfolio isn't screenshots. It's seven working products (`/work/*`) you can use in the browser, plus an engineering blog about how they were built.

- **For:** owners of small service businesses (restaurants, contractors, auto shops) who want a fixed-price, fixed-deadline build.
- **What sets it apart:** each portfolio piece is a live tool doing its job. Every engagement ends with a stamped receipt ("We hand you the receipt, not the estimate.").
- **Most impressive claim:** "Every missed call is $1,200 walking away." Call Rescue turns that into a booked job in 4 minutes.
- **Visual hook:** the hero's Orbit-N mark with 7 product satellites circling the core.
- **Real UI shown:** Call Rescue's two-phone simulator (missed call → auto text-back → booked $1,180 job) and Waste Ledger (log "Atlantic Salmon $48" → this week's waste goes from $218 to $266, and salmon jumps to the top of the list). Both were captured frame by frame from the running app. The hero orbit, OrbitN mark and StaticReceipt markup are ported from the source.
- **Tone:** `polished` leaning `default`: confident, warm, editorial (Instrument Serif and amber on ink). Soft dip transitions.
- **Share caption:** see `share-copy.txt`.

## Angle
**Most portfolios are screenshots. This one is seven working products.** The video starts with the genre cliché and crosses it out. Then it shows the products actually running.

## Hook (0–3.0s)
"Most portfolios are ~~screenshots.~~" An amber strike-through crosses out the last word, and "This one is seven working products." appears underneath.

## Highlights
1. **Call Rescue (contractors):** "Every missed call is $1,200 walking away." The real simulator plays: missed call, a 7-second text-back, the customer replies, and the card reads "Job booked. $1,180 · 4 minutes".
2. **Waste Ledger (restaurants):** "Stop throwing $400 a week in the dumpster." A cursor types an entry and clicks Log waste. The live dashboard ticks from $218 to $266 and the camera pushes in on it.
3. **The promise:** "We hand you the receipt, not the estimate." The real receipt prints line by line and a PAID stamp lands.

## Punchline / outro
The Orbit-N mark spins over the "nguyenetic" wordmark, with nguyenetic.com, "14-day turnaround · fixed price · receipts on everything", and "writing about this work → /blog".

## Visual identity (from `src/app/globals.css`, `layout.tsx`)
- Ink `oklch(0.08 0.005 260)`, paper `oklch(0.97 0.008 80)`, single accent warm amber `oklch(0.74 0.15 55)`. Call Rescue keeps its own `#facc15`.
- Instrument Serif (display, italics), JetBrains Mono (eyebrows/labels), Inter (body). These are the site's own font files, pulled from the dev server.
- 72px grid texture and a warm radial glow (from `Hero.tsx`). Product UIs sit in a minimal browser frame showing the real route plus a LIVE dot.

## Storyboard (30fps, 1920×1080, 22.2s; cuts on a 100 BPM / 0.6s beat grid)

| # | Time | Scene | On screen | Motion | Sound |
|---|---|---|---|---|---|
| 1 | 0.0–3.0 | Hook | "Most portfolios are screenshots." / "This one is seven working products." | Words rise in; amber strike-through; sub fades up | Warm Am pad, clock ticks, swipe on strike, riser |
| 2 | 3.0–7.2 | Reveal | Hero: "07 satellites live · 01 operator", "A studio in orbit around you.", "Managed websites, design, and digital ops for small service businesses." | Rings draw, OrbitN pops, 7 satellites launch into orbit one by one | Impact on the downbeat; groove starts; pentatonic blips per satellite |
| 3 | 7.2–12.0 | Call Rescue | Headline left; live two-phone simulator in a browser frame; outcome card | Real frames flip in sequence; signal dot travels; outcome card slides up | Whoosh in; message blips; A-major lift on "Job booked" |
| 4 | 12.0–16.2 | Waste Ledger | Headline left; form typing → dashboard $218 → $266 | Typing flipbook, cursor click + ripple, staggered swap, push-in, highlight rings | Soft typing ticks, click, rising blips on count-up |
| 5 | 16.2–19.2 | Receipt | "We hand you the receipt, not the estimate." + receipt | Receipt slides out, lines print, PAID stamp slams with a small shake | Printer ratchet ticks; stamp thump |
| 6 | 19.2–22.2 | Outro | OrbitN, "nguyenetic", nguyenetic.com, pills, /blog | Mark springs in with satellite orbiting; lines stagger up | Drums drop out; Am add9 bell arpeggio; reverb tail |

Total: 3.0 + 4.2 + 4.8 + 4.2 + 3.0 + 3.0 = **22.2s**

## Build notes
- Composition: `work/comp/index.html`. Each frame is a pure function of `t` (`renderAt(t)`). Fonts and images are awaited before capture, and frames are rendered with Playwright (`work/render.mjs`).
- Real UI captures: `work/capture.mjs` drives `/work/call-rescue` and `/work/waste-ledger` on the local dev server.
- Audio: synthesized in `work/audio.mjs` (A minor, 100 BPM, Schroeder reverb shared by music and SFX), then loudness-normalized in ffmpeg.
