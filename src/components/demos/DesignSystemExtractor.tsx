"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Copy, Loader2 } from "lucide-react"

const springEase = [0.22, 1, 0.36, 1] as const

// Pre-curated palettes cycling by URL hash
const COLOR_PALETTES = [
  {
    name: "stripe",
    colors: ["#635bff", "#0a2540", "#00d4ff", "#ff6b6b", "#ffd166", "#06d6a0", "#ffffff", "#f6f9fc"],
    labels: ["Indigo", "Navy", "Cyan", "Coral", "Gold", "Emerald", "White", "Surface"],
    contrasts: ["AAA 12.1:1", "AAA 15.3:1", "AA 4.7:1", "AA 4.5:1", "AA+ 3.2:1", "AAA 7.8:1", "AAA 21:1", "AAA 18.4:1"],
  },
  {
    name: "linear",
    colors: ["#5e6ad2", "#0f0f11", "#f7f8f8", "#e8e8ed", "#9e9fae", "#5e6ad2", "#b4b4c7", "#2d2d3a"],
    labels: ["Violet", "Ink", "Snow", "Cloud", "Mist", "Focus", "Soft", "Surface"],
    contrasts: ["AAA 8.9:1", "AAA 19.8:1", "AAA 20.1:1", "AAA 17.3:1", "AA 5.4:1", "AAA 8.9:1", "AA 4.1:1", "AA+ 3.6:1"],
  },
  {
    name: "notion",
    colors: ["#2eaadc", "#37352f", "#ffffff", "#f7f6f3", "#e9e9e7", "#d3d3d0", "#9b9a97", "#706f6c"],
    labels: ["Blue", "Black", "White", "Beige", "Light", "Silver", "Muted", "Stone"],
    contrasts: ["AAA 7.3:1", "AAA 18.7:1", "AAA 21:1", "AAA 19.2:1", "AAA 16.8:1", "AA+ 13.1:1", "AA 4.9:1", "AA 4.5:1"],
  },
  {
    name: "apple",
    colors: ["#0071e3", "#1d1d1f", "#f5f5f7", "#e8e8ed", "#86868b", "#f56300", "#30d158", "#ff375f"],
    labels: ["Blue", "Carbon", "Silver", "Cloud", "Titanium", "Orange", "Mint", "Pink"],
    contrasts: ["AAA 7.6:1", "AAA 19.1:1", "AAA 20.5:1", "AAA 17.9:1", "AA 4.5:1", "AA+ 3.7:1", "AAA 8.2:1", "AA 4.6:1"],
  },
  {
    name: "zen garden",
    colors: ["#ff8a3d", "#080618", "#f5f0eb", "#3d3352", "#6b5e8a", "#c4a882", "#8b7355", "#2d2540"],
    labels: ["Warm", "Ink", "Paper", "Deep", "Plum", "Sand", "Stone", "Void"],
    contrasts: ["AAA 7.1:1", "AAA 19.4:1", "AAA 18.9:1", "AAA 14.2:1", "AA 5.1:1", "AA 4.8:1", "AA+ 3.9:1", "AAA 16.7:1"],
  },
]

const FONT_OPTIONS = [
  { sans: "Inter", serif: "Playfair Display", mono: "JetBrains Mono" },
  { sans: "Geist", serif: "Lora", mono: "Fira Code" },
  { sans: "DM Sans", serif: "Merriweather", mono: "Source Code Pro" },
  { sans: "Plus Jakarta Sans", serif: "Cormorant", mono: "IBM Plex Mono" },
  { sans: "Outfit", serif: "EB Garamond", mono: "Roboto Mono" },
]

const SPACING_SCALES = [
  { scale: [4, 8, 16, 24, 32, 48, 64], base: "4px", ratio: "2×" },
  { scale: [4, 8, 12, 20, 32, 52, 84], base: "4px", ratio: "φ" },
  { scale: [2, 4, 8, 16, 32, 64, 128], base: "2px", ratio: "2×" },
]

const COMPONENT_SPECS = [
  [
    { name: "Button", radius: "6px", padding: "10px 18px", weight: "500" },
    { name: "Input", radius: "8px", padding: "10px 16px", weight: "400" },
    { name: "Card", radius: "12px", padding: "20px 24px", weight: "n/a" },
  ],
  [
    { name: "Button", radius: "9999px", padding: "12px 24px", weight: "600" },
    { name: "Input", radius: "6px", padding: "12px 20px", weight: "400" },
    { name: "Card", radius: "16px", padding: "24px 32px", weight: "n/a" },
  ],
  [
    { name: "Button", radius: "4px", padding: "8px 16px", weight: "500" },
    { name: "Input", radius: "4px", padding: "8px 14px", weight: "400" },
    { name: "Card", radius: "8px", padding: "16px 20px", weight: "n/a" },
  ],
]

function hashUrl(url: string): number {
  return Array.from(url).reduce((h, c) => (h + c.charCodeAt(0)) & 0xffff, 0)
}

function mockExtract(url: string) {
  const seed = hashUrl(url)
  return {
    palette: COLOR_PALETTES[seed % COLOR_PALETTES.length],
    fonts: FONT_OPTIONS[seed % FONT_OPTIONS.length],
    spacing: SPACING_SCALES[seed % SPACING_SCALES.length],
    components: COMPONENT_SPECS[seed % COMPONENT_SPECS.length],
  }
}

function isValidUrl(s: string): boolean {
  try {
    const u = new URL(s.startsWith("http") ? s : `https://${s}`)
    return u.hostname.includes(".")
  } catch {
    return false
  }
}

const STEPS = [
  "Crawling page...",
  "Sampling colors...",
  "Detecting typography...",
  "Mapping patterns...",
]

type ExtractionResult = ReturnType<typeof mockExtract>

// --- Sub-components ---

function ColorSwatch({
  color,
  label,
  contrast,
  index,
}: {
  color: string
  label: string
  contrast: string
  index: number
}) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(color)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: springEase }}
      onClick={copy}
      className="group flex flex-col items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm rounded-xl"
      aria-label={`Copy ${color}`}
    >
      <div
        className="w-full aspect-square rounded-lg border border-white/10 group-hover:scale-105 transition-transform relative overflow-hidden"
        style={{ background: color }}
      >
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/30"
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="text-[10px] font-mono text-paper/60 group-hover:text-paper transition-colors">{color}</span>
      <span className="text-[9px] font-mono text-warm/70">{contrast}</span>
      <span className="text-[9px] text-paper/50">{label}</span>
    </motion.button>
  )
}

function TypographyCard({
  family,
  type,
  index,
  sampleText,
}: {
  family: string
  type: string
  index: number
  sampleText: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.1, duration: 0.5, ease: springEase }}
      className="p-5 rounded-2xl bg-ink/40 backdrop-blur-md border border-warm/20 flex-1"
    >
      <p className="text-[9px] uppercase tracking-[0.3em] text-warm/60 font-mono mb-3">{type}</p>
      <p
        className="text-5xl leading-none mb-5 text-paper"
        style={{ fontFamily: family }}
      >
        {sampleText}
      </p>
      <div className="space-y-1.5 text-[10px] font-mono text-paper/50">
        <div className="flex justify-between"><span>Family</span><span className="text-paper/80">{family}</span></div>
        <div className="flex justify-between"><span>Weight</span><span className="text-paper/80">400 / 700</span></div>
        <div className="flex justify-between"><span>Letter-spacing</span><span className="text-paper/80">{type === "Mono" ? "0em" : type === "Serif" ? "-0.01em" : "-0.02em"}</span></div>
        <div className="flex justify-between"><span>Line-height</span><span className="text-paper/80">{type === "Mono" ? "1.7" : "1.4"}</span></div>
      </div>
    </motion.div>
  )
}

function SpacingBar({ value, index }: { value: number; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: springEase }}
      className="flex items-center gap-4"
    >
      <div
        className="h-3 rounded-full bg-gradient-to-r from-warm/80 to-warm/30 shrink-0"
        style={{ width: `${value * 2}px` }}
      />
      <span className="text-[10px] font-mono text-paper/60">{value}px</span>
    </motion.div>
  )
}

function ComponentSpec({
  name,
  radius,
  padding,
  weight,
  index,
}: {
  name: string
  radius: string
  padding: string
  weight: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 + 0.1, duration: 0.5, ease: springEase }}
      className="p-5 rounded-2xl bg-ink/40 backdrop-blur-md border border-warm/20 flex-1"
    >
      <p className="text-[9px] uppercase tracking-[0.3em] text-warm/60 font-mono mb-3">{name}</p>
      {/* Mini wireframe preview */}
      <div className="mb-4 p-3 rounded-lg bg-ink/60 border border-warm/10 flex items-center justify-center min-h-12">
        {name === "Button" && (
          <div
            className="px-4 py-2 bg-warm/20 border border-warm/40 text-warm text-xs font-medium"
            style={{ borderRadius: radius }}
          >
            Click me
          </div>
        )}
        {name === "Input" && (
          <div
            className="px-3 py-2 bg-ink/80 border border-paper/20 text-paper/40 text-xs w-full"
            style={{ borderRadius: radius }}
          >
            Placeholder…
          </div>
        )}
        {name === "Card" && (
          <div
            className="p-3 bg-ink/80 border border-paper/20 w-full"
            style={{ borderRadius: radius }}
          >
            <div className="h-2 w-16 bg-paper/20 rounded mb-2" />
            <div className="h-1.5 w-24 bg-paper/10 rounded" />
          </div>
        )}
      </div>
      <div className="space-y-1 text-[10px] font-mono text-paper/50">
        <div className="flex justify-between"><span>Radius</span><span className="text-paper/80">{radius}</span></div>
        <div className="flex justify-between"><span>Padding</span><span className="text-paper/80">{padding}</span></div>
        {weight !== "n/a" && <div className="flex justify-between"><span>Weight</span><span className="text-paper/80">{weight}</span></div>}
      </div>
    </motion.div>
  )
}

// --- Main component ---

export function DesignSystemExtractor() {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [stepsDone, setStepsDone] = useState<number[]>([])
  const [result, setResult] = useState<ExtractionResult | null>(null)
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle")
  const inputRef = useRef<HTMLInputElement>(null)

  const runExtraction = useCallback(async () => {
    const trimmed = url.trim()
    if (!isValidUrl(trimmed)) {
      setError("Please enter a valid URL (e.g. stripe.com)")
      return
    }
    setError("")
    setResult(null)
    setStepsDone([])
    setIsRunning(true)

    for (let i = 0; i < STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 420))
      setStepsDone((prev) => [...prev, i])
    }

    await new Promise((r) => setTimeout(r, 200))
    setIsRunning(false)
    setResult(mockExtract(trimmed))
  }, [url])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") runExtraction()
  }

  const handleCopyTheme = () => {
    if (!result) return
    const tokens = result.palette.colors
      .map((c, i) => `  --color-${result.palette.labels[i].toLowerCase().replace(" ", "-")}: ${c};`)
      .join("\n")
    const snippet = `@theme inline {\n${tokens}\n  --font-sans: "${result.fonts.sans}", system-ui;\n  --font-serif: "${result.fonts.serif}", Georgia;\n  --font-mono: "${result.fonts.mono}", monospace;\n}`
    navigator.clipboard.writeText(snippet)
    setCopyState("copied")
    setTimeout(() => setCopyState("idle"), 2000)
  }

  return (
    <div className="min-h-screen bg-ink py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero input */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: springEase }}
          className="p-8 rounded-2xl bg-ink/40 backdrop-blur-md border border-warm/20"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-warm font-mono mb-2">Design Intelligence</p>
          <h1 className="text-3xl font-display font-bold text-paper mb-2">Design System Extractor</h1>
          <p className="text-paper/50 text-sm mb-8">Enter any URL to extract its design tokens — palette, typography, spacing, and components.</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              ref={inputRef}
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError("") }}
              onKeyDown={handleKeyDown}
              placeholder="stripe.com"
              aria-label="Website URL to extract design system from"
              className="flex-1 px-5 py-3 rounded-lg bg-ink/60 border border-warm/20 text-paper placeholder:text-paper/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm/60 text-sm font-mono"
            />
            <button
              onClick={runExtraction}
              disabled={isRunning}
              className="px-6 py-3 rounded-md bg-gradient-to-br from-[#ffb68d] to-warm text-ink font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm shrink-0"
            >
              {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Extract
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-3 text-sm text-rose-400"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Extraction animation */}
        <AnimatePresence>
          {isRunning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-6 rounded-2xl bg-ink/40 backdrop-blur-md border border-warm/20 overflow-hidden"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-warm font-mono mb-4">Extracting</p>
              <div className="space-y-3">
                {STEPS.map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: stepsDone.includes(i) ? 1 : 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full border border-warm/30 flex items-center justify-center shrink-0">
                      <AnimatePresence mode="wait">
                        {stepsDone.includes(i) ? (
                          <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-warm">
                            <Check className="w-3 h-3" />
                          </motion.span>
                        ) : i === stepsDone.length ? (
                          <motion.span key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <Loader2 className="w-3 h-3 text-warm animate-spin" />
                          </motion.span>
                        ) : null}
                      </AnimatePresence>
                    </div>
                    <span className="text-sm text-paper/70 font-mono">{step}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Color Palette */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: springEase }}
                className="p-6 rounded-2xl bg-ink/40 backdrop-blur-md border border-warm/20"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-warm font-mono mb-1">Color Palette</p>
                <p className="text-paper/40 text-xs mb-5">Detected from {result.palette.name} profile</p>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {result.palette.colors.map((color, i) => (
                    <ColorSwatch
                      key={i}
                      color={color}
                      label={result.palette.labels[i]}
                      contrast={result.palette.contrasts[i]}
                      index={i}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Typography */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5, ease: springEase }}
                className="p-6 rounded-2xl bg-ink/40 backdrop-blur-md border border-warm/20"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-warm font-mono mb-1">Typography</p>
                <p className="text-paper/40 text-xs mb-5">3 font families detected</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <TypographyCard family={result.fonts.sans} type="Sans" index={0} sampleText="Ag" />
                  <TypographyCard family={result.fonts.serif} type="Serif" index={1} sampleText="Ag" />
                  <TypographyCard family={result.fonts.mono} type="Mono" index={2} sampleText="Ag" />
                </div>
              </motion.div>

              {/* Spacing Rhythm */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: springEase }}
                className="p-6 rounded-2xl bg-ink/40 backdrop-blur-md border border-warm/20"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-warm font-mono mb-1">Spacing Rhythm</p>
                <p className="text-paper/40 text-xs mb-5">Base {result.spacing.base} · Ratio {result.spacing.ratio}</p>
                <div className="space-y-3">
                  {result.spacing.scale.map((v, i) => (
                    <SpacingBar key={v} value={v} index={i} />
                  ))}
                </div>
              </motion.div>

              {/* Detected Components */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5, ease: springEase }}
                className="p-6 rounded-2xl bg-ink/40 backdrop-blur-md border border-warm/20"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-warm font-mono mb-1">Detected Components</p>
                <p className="text-paper/40 text-xs mb-5">Button · Input · Card patterns</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {result.components.map((comp, i) => (
                    <ComponentSpec key={comp.name} {...comp} index={i} />
                  ))}
                </div>
              </motion.div>

              {/* Export bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5, ease: springEase }}
                className="p-5 rounded-2xl bg-ink/40 backdrop-blur-md border border-warm/20 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-warm font-mono">Export</p>
                  <p className="text-paper/40 text-xs mt-0.5">Tailwind v4 @theme tokens ready</p>
                </div>
                <button
                  onClick={handleCopyTheme}
                  className="flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-to-br from-[#ffb68d] to-warm text-ink font-medium text-sm hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-warm"
                >
                  {copyState === "copied" ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied ✓
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy @theme
                    </>
                  )}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
