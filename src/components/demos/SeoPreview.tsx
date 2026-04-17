"use client"

import { useState, useEffect, useId } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion"
import { Search, CheckCircle2, Loader2, Globe, ExternalLink } from "lucide-react"

// ---------------------------------------------------------------------------
// Deterministic mock data generator
// ---------------------------------------------------------------------------

function hashSeed(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

function seededRand(seed: number, index: number, min: number, max: number): number {
  const val = ((seed * 9301 + 49297 * (index + 1)) % 233280) / 233280
  return min + val * (max - min)
}

interface MockData {
  overallScore: number
  lcp: number
  cls: number
  inp: number
  readability: number
  keywordDensity: number
  internalLinks: number
  schemaMarkup: number
  aiVisibility: number
  title: string
  description: string
  breadcrumb: string
  aiSummary: string
}

function mockAnalyze(url: string): MockData {
  const seed = hashSeed(url)
  const r = (i: number, mn: number, mx: number) => seededRand(seed, i, mn, mx)

  const domain = (() => {
    try { return new URL(url).hostname } catch { return url }
  })()
  const path = (() => {
    try { return new URL(url).pathname.replace(/\//g, " › ").replace(/^[ ›]+/, "") || "Home" } catch { return "Home" }
  })()

  return {
    overallScore: Math.round(r(0, 62, 97)),
    lcp: parseFloat(r(1, 1.1, 3.5).toFixed(1)),
    cls: parseFloat(r(2, 0.01, 0.18).toFixed(2)),
    inp: Math.round(r(3, 75, 230)),
    readability: Math.round(r(4, 58, 96)),
    keywordDensity: Math.round(r(5, 40, 88)),
    internalLinks: Math.round(r(6, 30, 82)),
    schemaMarkup: Math.round(r(7, 25, 90)),
    aiVisibility: Math.round(r(8, 28, 72)),
    title: `${domain.replace(/^www\./, "")} — ${["Professional Services", "Expert Solutions", "Digital Excellence", "Premium Experience"][Math.floor(r(9, 0, 4))]}`,
    description: `Discover how ${domain.replace(/^www\./, "")} delivers exceptional value through ${["innovative digital solutions", "strategic web development", "SEO-driven growth", "performance-first design"][Math.floor(r(10, 0, 4))]}. Trusted by businesses worldwide.`,
    breadcrumb: `${domain} › ${path}`,
    aiSummary: `Based on analysis of **${domain}**, this page demonstrates ${r(11, 0.5, 1) > 0.75 ? "strong" : "moderate"} topical authority in its domain. The content structure suggests expertise in ${["web development and digital services", "technical SEO and performance", "user experience and conversion", "AI-powered business solutions"][Math.floor(r(12, 0, 4))]}. Key strengths include ${["structured data markup", "semantic heading hierarchy", "internal link architecture"][Math.floor(r(13, 0, 3))]} — citation **[1]** — and ${["page speed optimization", "mobile responsiveness", "Core Web Vitals compliance"][Math.floor(r(14, 0, 3))]} — citation **[2]**. AI search engines like Perplexity and ChatGPT are ${r(15, 0.3, 1) > 0.6 ? "likely" : "occasionally"} to surface this content for relevant queries **[3]**.`,
  }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CircularProgress({ value, size = 80, label }: { value: number; size?: number; label?: string }) {
  const r = (size - 12) / 2
  const circ = 2 * Math.PI * r
  const motionVal = useMotionValue(0)
  const dashoffset = useTransform(motionVal, (v) => circ - (v / 100) * circ)

  useEffect(() => {
    const ctrl = animate(motionVal, value, { duration: 1.2, ease: "easeOut" })
    return ctrl.stop
  }, [value, motionVal])

  const color = value >= 80 ? "#22c55e" : value >= 60 ? "#ff8a3d" : "#ef4444"

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke="oklch(0.22 0.005 260)" strokeWidth="6"
          />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={color} strokeWidth="6"
            strokeLinecap="round"
            style={{ strokeDasharray: circ, strokeDashoffset: dashoffset }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <CountUp to={value} />
        </div>
      </div>
      {label && <span className="text-[10px]" style={{ color: "oklch(0.74 0.15 55 / 0.6)" }}>{label}</span>}
    </div>
  )
}

function CountUp({ to }: { to: number }) {
  const motionVal = useMotionValue(0)
  const rounded = useTransform(motionVal, Math.round)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const unsub = rounded.on("change", setDisplay)
    const ctrl = animate(motionVal, to, { duration: 1.2, ease: "easeOut" })
    return () => { ctrl.stop(); unsub() }
  }, [to, motionVal, rounded])

  return (
    <span className="text-xl font-bold tabular-nums" style={{ color: "#f5f5f0", fontFamily: "var(--font-display)" }}>
      {display}
    </span>
  )
}

function MiniGauge({ label, value, unit }: { label: string; value: number; unit: string }) {
  const isGood = label === "LCP" ? value < 2.5 : label === "CLS" ? value < 0.1 : value < 150
  const color = isGood ? "#22c55e" : value < (label === "LCP" ? 4 : label === "CLS" ? 0.25 : 300) ? "#f59e0b" : "#ef4444"

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-xs font-mono font-semibold" style={{ color }}>
        {value}{unit}
      </div>
      <div className="text-[10px]" style={{ color: "oklch(0.74 0.15 55 / 0.5)" }}>{label}</div>
      <div
        className="w-2 h-2 rounded-full"
        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
      />
    </div>
  )
}

function HBar({ label, value, delay }: { label: string; value: number; delay: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px]">
        <span style={{ color: "oklch(0.74 0.15 55 / 0.7)" }}>{label}</span>
        <span style={{ color: "#f5f5f0" }}>{value}%</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: "oklch(0.22 0.005 260)" }}>
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
          style={{ background: "linear-gradient(90deg, #ffb68d, #ff8a3d)" }}
        />
      </div>
    </div>
  )
}

const STEPS = ["Fetching page resources", "Parsing semantic structure", "Scoring SEO signals"]

function AnalyzingState() {
  const [done, setDone] = useState([false, false, false])

  useEffect(() => {
    const timers = STEPS.map((_, i) =>
      setTimeout(() => setDone((prev) => { const n = [...prev]; n[i] = true; return n }), 600 + i * 700)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="space-y-3 py-4">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-3">
          <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
            {done[i] ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                <CheckCircle2 className="w-5 h-5" style={{ color: "#22c55e" }} />
              </motion.div>
            ) : (
              <motion.div
                animate={{ opacity: i === done.filter(Boolean).length ? [0.4, 1, 0.4] : 0.2 }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: "oklch(0.74 0.15 55 / 0.5)" }} />
              </motion.div>
            )}
          </div>
          <span
            className="text-sm"
            style={{ color: done[i] ? "#f5f5f0" : "oklch(0.74 0.15 55 / 0.4)", transition: "color 0.3s" }}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function SeoPreview() {
  const inputId = useId()
  const [url, setUrl] = useState("")
  const [urlError, setUrlError] = useState("")
  const [phase, setPhase] = useState<"idle" | "analyzing" | "results">("idle")
  const [data, setData] = useState<MockData | null>(null)

  const validate = (val: string) => {
    if (!val.startsWith("http://") && !val.startsWith("https://")) {
      return "URL must start with http:// or https://"
    }
    return ""
  }

  const handleAnalyze = () => {
    const err = validate(url)
    if (err) { setUrlError(err); return }
    setUrlError("")
    setPhase("analyzing")
    setTimeout(() => {
      setData(mockAnalyze(url))
      setPhase("results")
    }, 2500)
  }

  const handleUrlChange = (val: string) => {
    setUrl(val)
    if (urlError) setUrlError(validate(val))
  }

  const resultVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  }

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Input bar */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: "oklch(0.10 0.005 260 / 0.6)",
          border: "1px solid oklch(0.74 0.15 55 / 0.2)",
          backdropFilter: "blur(12px)",
        }}
      >
        <label htmlFor={inputId} className="text-xs font-medium mb-2 block" style={{ color: "oklch(0.74 0.15 55 / 0.7)" }}>
          Enter any URL to analyze
        </label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Globe
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "oklch(0.74 0.15 55 / 0.5)" }}
            />
            <input
              id={inputId}
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder="https://yoursite.com/page"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm bg-transparent focus:outline-none transition-all"
              style={{
                color: "#f5f5f0",
                border: urlError
                  ? "1px solid #ef4444"
                  : "1px solid oklch(0.28 0.005 260)",
              }}
              onFocus={(e) => {
                if (!urlError) e.target.style.borderColor = "oklch(0.74 0.15 55 / 0.8)"
              }}
              onBlur={(e) => {
                if (!urlError) e.target.style.borderColor = "oklch(0.28 0.005 260)"
              }}
              aria-describedby={urlError ? `${inputId}-error` : undefined}
              aria-invalid={!!urlError}
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!url.trim() || phase === "analyzing"}
            className="px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-opacity disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            style={{
              background: "linear-gradient(135deg, #ffb68d, #ff8a3d)",
              color: "#080618",
            }}
          >
            <Search className="w-4 h-4" />
            Analyze
          </button>
        </div>
        {urlError && (
          <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-xs" style={{ color: "#f87171" }}>
            {urlError}
          </p>
        )}
      </div>

      {/* Analyzing state */}
      <AnimatePresence>
        {phase === "analyzing" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl p-5"
            style={{
              background: "oklch(0.10 0.005 260 / 0.6)",
              border: "1px solid oklch(0.74 0.15 55 / 0.15)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="text-sm font-medium mb-2" style={{ color: "#f5f5f0" }}>
              Analyzing…
            </div>
            <AnalyzingState />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {phase === "results" && data && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {/* Section A: Mock SERP card */}
            <motion.div variants={resultVariants} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              <div className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "oklch(0.74 0.15 55 / 0.6)" }}>
                <Search className="w-3 h-3" />
                Google Search Preview
              </div>
              <div className="bg-white text-gray-900 p-4 rounded-lg max-w-full shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  {/* Google G favicon inline SVG */}
                  <svg width="16" height="16" viewBox="0 0 48 48" className="flex-shrink-0">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  <span className="text-xs text-gray-500 truncate">{data.breadcrumb}</span>
                </div>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-sky-600 text-lg font-medium hover:underline block leading-snug mb-1"
                  tabIndex={0}
                >
                  {data.title}
                </a>
                <p className="text-sm text-gray-600 leading-relaxed">{data.description}</p>
              </div>
            </motion.div>

            {/* Section B: AI Overview */}
            <motion.div variants={resultVariants} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              <div
                className="rounded-xl p-5"
                style={{
                  background: "oklch(0.10 0.005 260 / 0.7)",
                  border: "1px solid oklch(0.74 0.15 55 / 0.2)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "oklch(0.74 0.15 55 / 0.15)", color: "#ff8a3d" }}
                  >
                    AI Overview
                  </div>
                  <ExternalLink className="w-3.5 h-3.5" style={{ color: "oklch(0.74 0.15 55 / 0.4)" }} />
                </div>
                <div className="text-sm leading-relaxed" style={{ color: "#f5f5f0" }}>
                  {data.aiSummary.split(/(\*\*[^*]+\*\*|\[\d+\])/).map((part, i) => {
                    if (/^\*\*[^*]+\*\*$/.test(part)) {
                      return <strong key={i} style={{ color: "#ffb68d" }}>{part.slice(2, -2)}</strong>
                    }
                    if (/^\[\d+\]$/.test(part)) {
                      return (
                        <span
                          key={i}
                          className="inline-flex items-center justify-center text-[10px] font-bold w-5 h-5 rounded-full mx-0.5 align-middle"
                          style={{ background: "oklch(0.74 0.15 55 / 0.2)", color: "#ff8a3d" }}
                        >
                          {part.slice(1, -1)}
                        </span>
                      )
                    }
                    return part
                  })}
                </div>
              </div>
            </motion.div>

            {/* Section C: Score grid */}
            <motion.div variants={resultVariants} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              <div className="grid grid-cols-2 gap-3">
                {/* Overall score */}
                <div
                  className="rounded-xl p-4 flex flex-col items-center gap-2"
                  style={{
                    background: "oklch(0.10 0.005 260 / 0.6)",
                    border: "1px solid oklch(0.74 0.15 55 / 0.2)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div className="text-xs font-medium" style={{ color: "oklch(0.74 0.15 55 / 0.7)" }}>
                    Overall SEO Score
                  </div>
                  <CircularProgress value={data.overallScore} size={80} />
                  <div className="text-[10px]" style={{ color: "oklch(0.74 0.15 55 / 0.5)" }}>out of 100</div>
                </div>

                {/* Core Web Vitals */}
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "oklch(0.10 0.005 260 / 0.6)",
                    border: "1px solid oklch(0.74 0.15 55 / 0.2)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div className="text-xs font-medium mb-3" style={{ color: "oklch(0.74 0.15 55 / 0.7)" }}>
                    Core Web Vitals
                  </div>
                  <div className="flex justify-around">
                    <MiniGauge label="LCP" value={data.lcp} unit="s" />
                    <MiniGauge label="CLS" value={data.cls} unit="" />
                    <MiniGauge label="INP" value={data.inp} unit="ms" />
                  </div>
                </div>

                {/* Content quality */}
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "oklch(0.10 0.005 260 / 0.6)",
                    border: "1px solid oklch(0.74 0.15 55 / 0.2)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div className="text-xs font-medium mb-3" style={{ color: "oklch(0.74 0.15 55 / 0.7)" }}>
                    Content Quality
                  </div>
                  <div className="space-y-2.5">
                    <HBar label="Readability" value={data.readability} delay={0.1} />
                    <HBar label="Keyword density" value={data.keywordDensity} delay={0.2} />
                    <HBar label="Internal links" value={data.internalLinks} delay={0.3} />
                    <HBar label="Schema markup" value={data.schemaMarkup} delay={0.4} />
                  </div>
                </div>

                {/* AI Citations */}
                <div
                  className="rounded-xl p-4 flex flex-col items-center justify-center gap-2"
                  style={{
                    background: "oklch(0.10 0.005 260 / 0.6)",
                    border: "1px solid oklch(0.74 0.15 55 / 0.2)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div className="text-xs font-medium" style={{ color: "oklch(0.74 0.15 55 / 0.7)" }}>
                    AI-Search Visibility
                  </div>
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg width="80" height="80" className="-rotate-90 absolute inset-0">
                      <circle cx="40" cy="40" r="32" fill="none" stroke="oklch(0.22 0.005 260)" strokeWidth="6" />
                      <motion.circle
                        cx="40" cy="40" r="32"
                        fill="none"
                        stroke="#ff8a3d"
                        strokeWidth="6"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "201", strokeDashoffset: "201" }}
                        animate={{ strokeDashoffset: 201 - (data.aiVisibility / 100) * 201 }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                      />
                    </svg>
                    <div className="z-10 flex flex-col items-center">
                      <CountUp to={data.aiVisibility} />
                      <span className="text-[10px]" style={{ color: "oklch(0.74 0.15 55 / 0.5)" }}>%</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-center" style={{ color: "oklch(0.74 0.15 55 / 0.5)" }}>
                    Likelihood of AI citation
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Reset */}
            <motion.div variants={resultVariants} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="flex justify-center">
              <button
                onClick={() => { setPhase("idle"); setData(null); setUrl("") }}
                className="text-xs px-4 py-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-warm"
                style={{
                  border: "1px solid oklch(0.74 0.15 55 / 0.3)",
                  color: "oklch(0.74 0.15 55)",
                  background: "transparent",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "oklch(0.74 0.15 55 / 0.1)" }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
              >
                Analyze another URL
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
