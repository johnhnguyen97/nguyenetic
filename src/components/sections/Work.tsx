"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

const springEase = [0.22, 1, 0.36, 1] as const

// ── Live product data ──────────────────────────────────────────────────────────

interface LiveProduct {
  slug: string
  title: string
  tagline: string
  pain: string
  stack: string[]
  status: "Live" | "Live · AI"
  shippedDate: string
}

const liveProducts: LiveProduct[] = [
  {
    slug: "auto-quote",
    title: "Estimate Translator",
    tagline: "Auto shop estimates that read like text messages",
    pain: "Shops lose deals when estimates read like shop-speak. Plain language closes.",
    stack: ["Next.js", "Zod", "localStorage"],
    status: "Live",
    shippedDate: "Apr 2026",
  },
  {
    slug: "reservation",
    title: "Deposit Guardian",
    tagline: "Stop no-shows from draining your week",
    pain: "15–30% of bookings ghost. A deposit screen + confirmation email stops that cold.",
    stack: ["Next.js", "Framer Motion"],
    status: "Live",
    shippedDate: "Apr 2026",
  },
  {
    slug: "seo-audit",
    title: "Local SEO Scorecard",
    tagline: "Why 'near me' searches skip your business",
    pain: "AI Overviews haven't eaten local yet — but you're still invisible. Here's why.",
    stack: ["Next.js", "SVG charts"],
    status: "Live",
    shippedDate: "Apr 2026",
  },
  {
    slug: "waste-ledger",
    title: "Waste Ledger",
    tagline: "Restaurants throw $400/wk in the dumpster",
    pain: "Nobody tracks food waste. Toast requires a full POS swap. This doesn't.",
    stack: ["Claude Sonnet", "SVG charts"],
    status: "Live · AI",
    shippedDate: "Apr 2026",
  },
  {
    slug: "review-reply",
    title: "Review Reply Playground",
    tagline: "Three drafts in ten seconds — no signup",
    pain: "Owners spend 30 min/day on replies. Paste a review, pick a tone, copy a draft.",
    stack: ["Claude Haiku", "Zero auth"],
    status: "Live · AI",
    shippedDate: "Apr 2026",
  },
  {
    slug: "call-rescue",
    title: "Call Rescue Simulator",
    tagline: "Every missed call is $1,200 walking away",
    pain: "27% of contractor calls go unanswered. 85% of those callers never call back.",
    stack: ["Framer Motion", "Interactive sim"],
    status: "Live",
    shippedDate: "Apr 2026",
  },
  {
    slug: "estimate-translate",
    title: "Tech-to-Customer Translator",
    tagline: "Paste shop-speak — get a customer-friendly quote",
    pain: "The deal dies when the customer reads 'upsell'. Plain language keeps it alive.",
    stack: ["Claude Sonnet", "Structured output"],
    status: "Live · AI",
    shippedDate: "Apr 2026",
  },
]

// ── Animated micro-previews ────────────────────────────────────────────────────

function AutoQuotePreview() {
  const reduce = useReducedMotion()
  // SVG path for a cursive-ish signature flourish (140×50 viewBox)
  const pathD = "M 10 40 C 30 10, 50 10, 70 30 C 90 50, 100 20, 130 15"

  return (
    <div
      aria-hidden="true"
      className="w-full h-36 flex flex-col items-center justify-center gap-3 overflow-hidden"
    >
      <p className="text-[9px] font-mono text-paper/40 uppercase tracking-widest">Estimate · Signed</p>
      <svg width="140" height="50" viewBox="0 0 140 50" className="overflow-visible">
        <motion.path
          d={pathD}
          fill="none"
          stroke="#D4A843"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            reduce
              ? { pathLength: 1, opacity: 1 }
              : {
                  pathLength: [0, 1, 1, 0],
                  opacity: [0, 1, 1, 0],
                }
          }
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 4, times: [0, 0.55, 0.85, 1], repeat: Infinity, ease: "easeInOut" }
          }
        />
        {/* Arrow shift hint */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { opacity: [0, 0, 1, 1, 0] }}
          transition={{ duration: 4, times: [0, 0.5, 0.6, 0.85, 1], repeat: Infinity }}
        >
          <text x="28" y="48" fontSize="7" fill="#D4A84380" fontFamily="monospace">estimate</text>
          <text x="72" y="48" fontSize="8" fill="#D4A843" fontFamily="monospace">→</text>
          <text x="84" y="48" fontSize="7" fill="#6ee7b7" fontFamily="monospace">signed</text>
        </motion.g>
      </svg>
    </div>
  )
}

function ReservationPreview() {
  const reduce = useReducedMotion()
  const target = 847
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (reduce) {
      const id = setTimeout(() => setCount(target), 0)
      return () => clearTimeout(id)
    }
    let frame: number
    let start: number | null = null
    const duration = 2800

    function tick(ts: number) {
      if (!start) start = ts
      const elapsed = ts - start
      const progress = Math.min(elapsed / duration, 1)
      setCount(Math.round(progress * target))
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          start = null
          setCount(0)
          frame = requestAnimationFrame(tick)
        }, 1000)
      }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reduce])

  const bars = [
    { label: "No-show cost", color: "#D4A843" },
    { label: "Deposit collected", color: "#6ee7b7" },
    { label: "Net recovery", color: "#a78bfa" },
  ]
  const pct = count / target

  return (
    <div
      aria-hidden="true"
      className="w-full h-36 flex flex-col justify-center gap-2.5 px-4 overflow-hidden"
    >
      <div className="flex items-baseline justify-between mb-1">
        <p className="text-[9px] font-mono text-paper/40 uppercase tracking-widest">Recovered / week</p>
        <motion.span
          className="text-base font-display font-bold text-warm"
          key={Math.floor(count / 50)}
        >
          ${count.toLocaleString()}
        </motion.span>
      </div>
      {bars.map((bar, i) => (
        <div key={bar.label} className="flex items-center gap-2">
          <span className="text-[8px] font-mono text-paper/30 w-24 shrink-0 truncate">{bar.label}</span>
          <div className="flex-1 h-1.5 rounded-full bg-paper/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: bar.color }}
              initial={{ width: "0%" }}
              animate={{ width: `${Math.round(pct * (100 - i * 18))}%` }}
              transition={{ duration: 0.08, ease: "linear" }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function SeoAuditPreview() {
  const reduce = useReducedMotion()
  const score = 72
  const r = 28
  const cx = 38
  const cy = 38
  const circumference = 2 * Math.PI * r

  return (
    <div
      aria-hidden="true"
      className="w-full h-36 flex items-center justify-center gap-6 overflow-hidden"
    >
      <div className="relative w-20 h-20">
        <svg width="76" height="76" viewBox="0 0 76 76">
          {/* Background ring */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#D4A84315" strokeWidth="6" />
          {/* Animated score ring */}
          <motion.circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#D4A843"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={
              reduce
                ? { strokeDashoffset: circumference * (1 - score / 100) }
                : {
                    strokeDashoffset: [
                      circumference,
                      circumference * (1 - score / 100),
                      circumference * (1 - score / 100),
                      circumference,
                    ],
                  }
            }
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 5, times: [0, 0.5, 0.85, 1], repeat: Infinity, ease: "easeOut" }
            }
            transform={`rotate(-90 ${cx} ${cy})`}
          />
          {/* Radar dot */}
          {!reduce && (
            <motion.circle
              r="3"
              fill="#D4A843"
              animate={{
                cx: [cx + r * Math.cos(-Math.PI / 2), cx + r * Math.cos(Math.PI * 0.9)],
                cy: [cy + r * Math.sin(-Math.PI / 2), cy + r * Math.sin(Math.PI * 0.9)],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </svg>
        {/* Score number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-xl font-display font-bold text-warm"
            initial={{ opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { opacity: [0, 0, 1, 1, 0] }}
            transition={{ duration: 5, times: [0, 0.3, 0.4, 0.85, 1], repeat: Infinity }}
          >
            {score}
          </motion.span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-[9px] font-mono text-paper/40 uppercase tracking-widest">SEO Score</p>
        {["GBP", "Citations", "Reviews"].map((label, i) => (
          <div key={label} className="flex items-center gap-1.5">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-warm"
              animate={reduce ? {} : { opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
            />
            <span className="text-[9px] font-mono text-paper/50">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function WasteLedgerPreview() {
  const reduce = useReducedMotion()
  const baseData = [12, 28, 19, 35, 22, 41, 30]
  const [data, setData] = useState(baseData)
  const [phase, setPhase] = useState(0)
  const [drawProgress, setDrawProgress] = useState(reduce ? 1 : 0)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (reduce) {
      setDrawProgress(1)
      return
    }
    const datasets = [
      baseData,
      [18, 22, 31, 27, 38, 29, 44],
      [9, 34, 24, 40, 16, 37, 28],
    ]
    let currentPhase = 0
    let startTime: number | null = null
    const drawDuration = 2800
    const holdDuration = 1000
    let holding = false
    let holdStart = 0

    function animate(ts: number) {
      if (!startTime) startTime = ts
      const elapsed = ts - startTime

      if (!holding) {
        const progress = Math.min(elapsed / drawDuration, 1)
        setDrawProgress(progress)
        if (progress >= 1) {
          holding = true
          holdStart = ts
        }
      } else {
        if (ts - holdStart >= holdDuration) {
          currentPhase = (currentPhase + 1) % datasets.length
          setPhase(currentPhase)
          setData(datasets[currentPhase])
          setDrawProgress(0)
          startTime = ts
          holding = false
        }
      }
      frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce])

  const w = 130
  const h = 44
  const max = Math.max(...data)
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - (v / max) * h,
  }))
  const visibleCount = Math.ceil(drawProgress * (pts.length - 1)) + 1
  const visiblePts = pts.slice(0, visibleCount)
  const pathD = visiblePts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ")
  const lastPt = visiblePts[visiblePts.length - 1]
  const lastVal = data[visibleCount - 1]

  return (
    <div
      aria-hidden="true"
      className="w-full h-36 flex flex-col justify-center gap-2 px-4 overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-mono text-paper/40 uppercase tracking-widest">Food waste · lbs/day</p>
        <AnimatePresence mode="wait">
          <motion.span
            key={`${phase}-${visibleCount}`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[10px] font-mono text-warm font-bold"
          >
            ${(lastVal * 2.4).toFixed(0)}
          </motion.span>
        </AnimatePresence>
      </div>
      <svg width="100%" viewBox={`0 0 ${w} ${h + 4}`} className="overflow-visible">
        <path d={pathD} fill="none" stroke="#D4A843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {visiblePts.map((p, i) => (
          <motion.circle
            key={`${phase}-${i}`}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="#D4A843"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        ))}
        {lastPt && drawProgress > 0.1 && (
          <motion.text
            x={Math.min(lastPt.x, w - 20)}
            y={Math.max(lastPt.y - 6, 8)}
            fontSize="7"
            fill="#D4A843"
            fontFamily="monospace"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ${(lastVal * 2.4).toFixed(0)}
          </motion.text>
        )}
      </svg>
      <p className="text-[8px] font-mono text-paper/25">wk {phase + 1} · tracking active</p>
    </div>
  )
}

function ReviewReplyPreview() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const stars = [1, 3, 5]
  const tones = ["Apologetic", "Professional", "Warm"]

  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setActive((p) => (p + 1) % 3), 1600)
    return () => clearInterval(id)
  }, [reduce])

  return (
    <div
      aria-hidden="true"
      className="w-full h-36 flex flex-col items-center justify-center gap-2.5 overflow-hidden"
    >
      <p className="text-[9px] font-mono text-paper/40 uppercase tracking-widest">Draft tones</p>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={
              reduce
                ? { opacity: i === 2 ? 1 : 0.4, scale: i === 2 ? 1 : 0.95, x: 0 }
                : {
                    opacity: i === active ? 1 : 0.35,
                    scale: i === active ? 1 : 0.92,
                    x: i === active ? 0 : i < active ? -2 : 2,
                  }
            }
            transition={{ duration: 0.4, ease: springEase }}
            className="w-20 rounded-lg border px-2 py-2 flex flex-col gap-1"
            style={{
              borderColor: i === (reduce ? 2 : active) ? "#D4A843" : "#D4A84325",
              backgroundColor: i === (reduce ? 2 : active) ? "#D4A84312" : "#08061808",
            }}
          >
            <div className="flex gap-0.5">
              {Array.from({ length: stars[i] }).map((_, s) => (
                <span key={s} className="text-[8px] text-warm">★</span>
              ))}
            </div>
            <p className="text-[8px] font-mono text-paper/50 truncate">{tones[i]}</p>
            <div className="space-y-0.5">
              <div className="h-1 rounded-full bg-paper/10 w-full" />
              <div className="h-1 rounded-full bg-paper/10 w-3/4" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function CallRescuePreview() {
  const reduce = useReducedMotion()
  // phase: 0 = ringing/missed, 1 = SMS fires back
  const [phase, setPhase] = useState(0)
  const [dotPos, setDotPos] = useState(0)

  useEffect(() => {
    if (reduce) {
      const id = setTimeout(() => { setPhase(1); setDotPos(1) }, 0)
      return () => clearTimeout(id)
    }
    const sequence = async () => {
      setPhase(0)
      setDotPos(0)
      await new Promise((r) => setTimeout(r, 1200))
      setPhase(1)
      setDotPos(0)
      await new Promise((r) => setTimeout(r, 300))
      setDotPos(1)
      await new Promise((r) => setTimeout(r, 1500))
      setPhase(0)
      setDotPos(0)
    }
    sequence()
    const id = setInterval(sequence, 4000)
    return () => clearInterval(id)
  }, [reduce])

  return (
    <div
      aria-hidden="true"
      className="w-full h-36 flex flex-col items-center justify-center gap-3 overflow-hidden"
    >
      <div className="flex items-center gap-6 relative">
        {/* Customer phone */}
        <div className="flex flex-col items-center gap-1">
          <motion.div
            animate={reduce ? {} : phase === 0 ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={{ duration: 0.5, repeat: phase === 0 ? Infinity : 0 }}
            className="w-9 h-14 rounded-lg border-2 border-paper/20 bg-ink/60 flex items-center justify-center"
          >
            <span className="text-base">📞</span>
          </motion.div>
          <span className="text-[8px] font-mono text-paper/30">caller</span>
        </div>

        {/* Signal line with dot */}
        <div className="relative w-16 flex items-center">
          <div className="w-full h-px bg-paper/10" />
          {/* missed call X */}
          <AnimatePresence mode="wait">
            {phase === 0 ? (
              <motion.span
                key="x"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-400 text-xs font-bold"
              >
                ✕
              </motion.span>
            ) : (
              <motion.div
                key="dot"
                className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-warm"
                initial={{ left: "100%" }}
                animate={{ left: dotPos === 1 ? "0%" : "100%" }}
                transition={{ duration: 0.8, ease: springEase }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Contractor phone */}
        <div className="flex flex-col items-center gap-1">
          <motion.div
            animate={reduce ? {} : phase === 1 ? { scale: [1, 1.06, 1] } : { scale: 1 }}
            transition={{ duration: 0.4, repeat: phase === 1 ? 3 : 0 }}
            className="w-9 h-14 rounded-lg border-2 border-warm/40 bg-ink/60 flex items-center justify-center"
          >
            <span className="text-base">📱</span>
          </motion.div>
          <span className="text-[8px] font-mono text-paper/30">contractor</span>
        </div>
      </div>

      <motion.p
        className="text-[9px] font-mono text-center"
        animate={{ color: phase === 0 ? "#ef444480" : "#D4A843" }}
        transition={{ duration: 0.4 }}
      >
        {phase === 0 ? "missed call" : "SMS fired ✓"}
      </motion.p>
    </div>
  )
}

function EstimateTranslatePreview() {
  const reduce = useReducedMotion()
  const phrases = [
    { tech: "R&R serpentine belt", plain: "Replace drive belt" },
    { tech: "Flush brake fluid DOT4", plain: "Refresh brake fluid" },
    { tech: "Repack CV axle boots", plain: "Seal wheel axle" },
  ]
  const [idx, setIdx] = useState(0)
  const [charCount, setCharCount] = useState(reduce ? phrases[0].plain.length : 0)
  const [typing, setTyping] = useState(!reduce)

  useEffect(() => {
    if (reduce) {
      setCharCount(phrases[0].plain.length)
      return
    }
    let cancelled = false
    const currentPhrase = phrases[idx].plain

    setCharCount(0)
    setTyping(true)

    let i = 0
    const typeInterval = setInterval(() => {
      if (cancelled) return
      i++
      setCharCount(i)
      if (i >= currentPhrase.length) {
        clearInterval(typeInterval)
        setTimeout(() => {
          if (cancelled) return
          setIdx((p) => (p + 1) % phrases.length)
        }, 1800)
      }
    }, 55)
    return () => {
      cancelled = true
      clearInterval(typeInterval)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, reduce])

  const phrase = phrases[idx]

  return (
    <div
      aria-hidden="true"
      className="w-full h-36 flex flex-col items-center justify-center gap-2 px-3 overflow-hidden"
    >
      <p className="text-[9px] font-mono text-paper/40 uppercase tracking-widest">Tech → Plain</p>
      <div className="flex items-stretch gap-2 w-full">
        {/* Tech side */}
        <div className="flex-1 rounded-lg border border-paper/10 bg-ink/60 p-2 flex flex-col gap-1">
          <p className="text-[8px] font-mono text-paper/30 uppercase">Shop-speak</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[9px] font-mono text-paper/50 leading-snug"
            >
              {phrase.tech}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Arrow */}
        <motion.div
          className="flex items-center self-center"
          animate={reduce ? {} : { scale: [1, 1.2, 1], color: ["#D4A84380", "#D4A843", "#D4A84380"] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <ArrowUpRight className="w-3.5 h-3.5 text-warm rotate-90" />
        </motion.div>

        {/* Plain side */}
        <div className="flex-1 rounded-lg border border-warm/20 bg-warm/5 p-2 flex flex-col gap-1">
          <p className="text-[8px] font-mono text-warm/60 uppercase">Customer</p>
          <p className="text-[9px] font-mono text-warm leading-snug">
            {reduce ? phrase.plain : phrase.plain.slice(0, charCount)}
            {typing && charCount < phrase.plain.length && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-px h-3 bg-warm ml-px align-middle"
              />
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

// Map slug → preview component
const previewMap: Record<string, React.ComponentType> = {
  "auto-quote": AutoQuotePreview,
  "reservation": ReservationPreview,
  "seo-audit": SeoAuditPreview,
  "waste-ledger": WasteLedgerPreview,
  "review-reply": ReviewReplyPreview,
  "call-rescue": CallRescuePreview,
  "estimate-translate": EstimateTranslatePreview,
}

// ── Live product tile ──────────────────────────────────────────────────────────

function LiveProductTile({ product, index }: { product: LiveProduct; index: number }) {
  const reduce = useReducedMotion()
  const isAI = product.status === "Live · AI"
  const Preview = previewMap[product.slug]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.07, duration: 0.6, ease: springEase }}
    >
      <Link
        href={`/work/${product.slug}`}
        className="group block h-full rounded-2xl border border-warm/15 bg-ink/35 backdrop-blur-sm
          transition-[border-color,box-shadow,background-color] duration-300
          hover:border-warm/50 hover:bg-ink/50 hover:shadow-[0_8px_28px_oklch(0.74_0.15_55/0.12)]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm/60"
      >
        <div className="p-5 flex flex-col gap-3 h-full">
          {/* Top row: status chip + shipped date */}
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1.5 text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                isAI
                  ? "border-violet-400/30 bg-violet-400/8 text-violet-300"
                  : "border-emerald-400/30 bg-emerald-400/8 text-emerald-400"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isAI ? "bg-violet-400" : "bg-emerald-400"}`} />
              {product.status}
            </span>
            <span className="text-[9px] font-mono text-paper/30">Shipped: {product.shippedDate}</span>
          </div>

          {/* Animated micro-preview */}
          {Preview && (
            <div className="rounded-xl border border-warm/10 bg-ink/50 overflow-hidden">
              <Preview />
            </div>
          )}

          {/* Title */}
          <div>
            <h3 className="font-display font-semibold text-paper text-base leading-tight mb-1.5 group-hover:text-warm transition-colors duration-200">
              {product.title}
            </h3>
            <p className="text-[11px] text-warm/80 font-mono leading-snug mb-2">
              {product.tagline}
            </p>
            <p className="text-[11px] text-paper/50 leading-relaxed">
              {product.pain}
            </p>
          </div>

          {/* Bottom row: stack chips + CTA */}
          <div className="flex items-end justify-between gap-2 pt-1 mt-auto">
            <div className="flex flex-wrap gap-1">
              {product.stack.map((tag) => (
                <span key={tag} className="text-[8px] font-mono px-1.5 py-0.5 rounded border border-warm/20 text-paper/40">
                  {tag}
                </span>
              ))}
            </div>
            <motion.div
              animate={reduce ? {} : undefined}
              className="flex items-center gap-1 text-[10px] font-mono text-warm/50 group-hover:text-warm transition-colors duration-200 shrink-0"
            >
              <span className="hidden group-hover:inline">Try it</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ── Main Work section ──────────────────────────────────────────────────────────

export function Work() {
  const { t } = useLanguage()

  return (
    <section id="work" className="relative py-32 px-6 overflow-hidden bg-ink">
      <div className="relative max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: springEase }}
          className="mb-12"
        >
          <p className="text-xs tracking-[0.3em] text-warm/60 font-mono uppercase mb-3">
            製品 · WORK 2026
          </p>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-display font-bold text-paper leading-none mb-4">
            {t("Work", "作品")}
          </h2>
          <p className="text-paper/60 text-base leading-relaxed max-w-xl">
            {t(
              "Seven SaaS demos you can try right now. Each one solves a pain I've seen real small-business owners scream about.",
              "今すぐ試せる7つのSaaSデモ。実際の中小企業オーナーが叫んでいる悩みを解決します。"
            )}
          </p>
        </motion.div>

        {/* Live products grid */}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))" }}
        >
          {liveProducts.map((product, i) => (
            <LiveProductTile key={product.slug} product={product} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease: springEase }}
          className="mt-16 text-center"
        >
          <p className="text-paper/50 text-sm mb-4">
            {t("Want one of these for your business?", "あなたのビジネスにも欲しいですか？")}
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-warm hover:underline underline-offset-4"
          >
            <span>{t("Let's build something that pays for itself", "投資対効果の高いものを一緒に作りましょう")}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
