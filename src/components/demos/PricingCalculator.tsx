"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, animate } from "framer-motion"
import { Minus, Plus, Copy, Check, ArrowRight } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type ScopeKey = "landing" | "fullsite" | "saas" | "platform"
type TimelineKey = "2weeks" | "1month" | "3months" | "flexible"
type ServiceKey = "development" | "marketing" | "seo" | "design" | "social" | "ai"

// ─── Constants ────────────────────────────────────────────────────────────────

const SCOPES: { key: ScopeKey; label: string; multiplier: number }[] = [
  { key: "landing", label: "Landing Page", multiplier: 1 },
  { key: "fullsite", label: "Full Site", multiplier: 2.5 },
  { key: "saas", label: "SaaS App", multiplier: 6 },
  { key: "platform", label: "Complex Platform", multiplier: 12 },
]

const TIMELINES: { key: TimelineKey; label: string; multiplier: number }[] = [
  { key: "2weeks", label: "2 weeks", multiplier: 1.5 },
  { key: "1month", label: "1 month", multiplier: 1.2 },
  { key: "3months", label: "3 months", multiplier: 1 },
  { key: "flexible", label: "Flexible", multiplier: 0.9 },
]

const SERVICES: { key: ServiceKey; label: string; ratePerHr: number; baseHrs: number }[] = [
  { key: "development", label: "Development", ratePerHr: 150, baseHrs: 40 },
  { key: "marketing", label: "Marketing", ratePerHr: 125, baseHrs: 20 },
  { key: "seo", label: "SEO", ratePerHr: 100, baseHrs: 15 },
  { key: "design", label: "Design", ratePerHr: 130, baseHrs: 25 },
  { key: "social", label: "Social Media", ratePerHr: 90, baseHrs: 16 },
  { key: "ai", label: "AI Solutions", ratePerHr: 175, baseHrs: 20 },
]

const TEAM_MULTIPLIERS: Record<number, number> = {
  1: 1,
  2: 1.4,
  3: 1.4,
  4: 2,
  5: 2,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return "$" + Math.round(value).toLocaleString("en-US")
}

function computeDelivery(timeline: TimelineKey, teamSize: number): string {
  const base: Record<TimelineKey, number> = {
    "2weeks": 14,
    "1month": 30,
    "3months": 90,
    "flexible": 60,
  }
  const days = Math.round(base[timeline] / Math.max(1, teamSize * 0.5))
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function encodeState(
  scope: ScopeKey,
  timeline: TimelineKey,
  services: Set<ServiceKey>,
  team: number
): string {
  const params = new URLSearchParams({
    scope,
    timeline,
    services: [...services].join(","),
    team: String(team),
  })
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`
}

// ─── Animated Number ──────────────────────────────────────────────────────────

function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const prevValue = useRef(value)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const from = prevValue.current
    prevValue.current = value
    const ctrl = animate(from, value, {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = formatCurrency(v)
      },
    })
    return () => ctrl.stop()
  }, [value])

  return (
    <span ref={ref} className={className}>
      {formatCurrency(value)}
    </span>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ show }: { show: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 12 }}
      className="fixed bottom-6 right-6 z-50 px-4 py-2 rounded-lg bg-warm text-ink text-sm font-medium shadow-lg pointer-events-none"
    >
      Copied ✓
    </motion.div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

function readUrlParams() {
  if (typeof window === "undefined") {
    return { scopeIndex: 1, timeline: "1month" as TimelineKey, services: new Set<ServiceKey>(["development", "design"]), team: 2 }
  }
  const params = new URLSearchParams(window.location.search)
  const scopeParam = params.get("scope") as ScopeKey | null
  const timelineParam = params.get("timeline") as TimelineKey | null
  const servicesParam = params.get("services")
  const teamParam = params.get("team")

  const scopeIndex = scopeParam
    ? Math.max(0, SCOPES.findIndex((s) => s.key === scopeParam))
    : 1
  const timeline: TimelineKey =
    timelineParam && TIMELINES.find((t) => t.key === timelineParam)
      ? timelineParam
      : "1month"
  const serviceKeys = servicesParam
    ? (servicesParam.split(",").filter((k) => SERVICES.some((s) => s.key === k)) as ServiceKey[])
    : []
  const services = serviceKeys.length > 0 ? new Set<ServiceKey>(serviceKeys) : new Set<ServiceKey>(["development", "design"])
  const teamRaw = teamParam ? parseInt(teamParam, 10) : NaN
  const team = !isNaN(teamRaw) && teamRaw >= 1 && teamRaw <= 5 ? teamRaw : 2
  return { scopeIndex, timeline, services, team }
}

export function PricingCalculator() {
  const [scopeIndex, setScopeIndex] = useState(() => readUrlParams().scopeIndex)
  const [timeline, setTimeline] = useState<TimelineKey>(() => readUrlParams().timeline)
  const [selectedServices, setSelectedServices] = useState<Set<ServiceKey>>(() => readUrlParams().services)
  const [teamSize, setTeamSize] = useState(() => readUrlParams().team)
  const [copied, setCopied] = useState(false)

  const scope = SCOPES[scopeIndex]
  const timelineObj = TIMELINES.find((t) => t.key === timeline)!

  // Compute line items
  const lineItems = SERVICES.filter((s) => selectedServices.has(s.key)).map((s) => {
    const hours = Math.round(s.baseHrs * scope.multiplier)
    const subtotal = hours * s.ratePerHr
    return { ...s, hours, subtotal }
  })

  const baseTotal = lineItems.reduce((sum, s) => sum + s.subtotal, 0)
  const teamMultiplier = TEAM_MULTIPLIERS[teamSize] ?? 1
  const total = selectedServices.size > 0
    ? Math.round(baseTotal * timelineObj.multiplier * teamMultiplier)
    : 0

  const deliveryDate = computeDelivery(timeline, teamSize)

  const toggleService = useCallback((key: ServiceKey) => {
    setSelectedServices((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const handleCopyUrl = useCallback(() => {
    const url = encodeState(scope.key, timeline, selectedServices, teamSize)
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [scope.key, timeline, selectedServices, teamSize])

  const handleContactScroll = useCallback(() => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }, [])

  // Keyboard: slider ArrowLeft/Right
  const handleScopeKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") setScopeIndex((i) => Math.max(0, i - 1))
      else if (e.key === "ArrowRight") setScopeIndex((i) => Math.min(SCOPES.length - 1, i + 1))
    },
    []
  )

  return (
    <>
      <Toast show={copied} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Inputs Column ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-6 bg-ink/40 backdrop-blur-md border border-warm/20 rounded-2xl p-6 hover:border-warm/60 transition-colors duration-300">

          {/* Scope slider */}
          <section aria-labelledby="scope-label">
            <label id="scope-label" className="block text-xs uppercase tracking-widest text-paper/50 mb-3">
              Project Scope
            </label>
            <div className="relative" onKeyDown={handleScopeKeyDown}>
              {/* Track */}
              <div className="relative h-1.5 rounded-full bg-neutral-border/60 mb-4">
                <motion.div
                  className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[#ffb68d] to-warm"
                  animate={{ width: `${(scopeIndex / (SCOPES.length - 1)) * 100}%` }}
                  transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
                />
                {/* Thumb */}
                <motion.button
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-warm border-2 border-ink shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-warm"
                  animate={{ left: `${(scopeIndex / (SCOPES.length - 1)) * 100}%` }}
                  transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
                  tabIndex={0}
                  role="slider"
                  aria-valuemin={0}
                  aria-valuemax={SCOPES.length - 1}
                  aria-valuenow={scopeIndex}
                  aria-valuetext={scope.label}
                  aria-label="Project scope"
                />
              </div>
              {/* Step labels */}
              <div className="grid grid-cols-4 gap-1">
                {SCOPES.map((s, i) => (
                  <button
                    key={s.key}
                    onClick={() => setScopeIndex(i)}
                    className={`text-xs py-1.5 px-1 rounded text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm ${
                      i === scopeIndex
                        ? "text-warm font-medium"
                        : "text-paper/40 hover:text-paper/70"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Timeline pills */}
          <section aria-labelledby="timeline-label">
            <label id="timeline-label" className="block text-xs uppercase tracking-widest text-paper/50 mb-3">
              Timeline
            </label>
            <div className="flex flex-wrap gap-2" role="group" aria-labelledby="timeline-label">
              {TIMELINES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTimeline(t.key)}
                  aria-pressed={timeline === t.key}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm ${
                    timeline === t.key
                      ? "bg-warm/20 border border-warm text-warm"
                      : "border border-warm/20 text-paper/60 hover:border-warm/50 hover:text-paper/90"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </section>

          {/* Service chips */}
          <section aria-labelledby="services-label">
            <label id="services-label" className="block text-xs uppercase tracking-widest text-paper/50 mb-3">
              Services
            </label>
            <div className="flex flex-wrap gap-2" role="group" aria-labelledby="services-label">
              {SERVICES.map((s) => {
                const active = selectedServices.has(s.key)
                return (
                  <button
                    key={s.key}
                    onClick={() => toggleService(s.key)}
                    aria-pressed={active}
                    className={`px-3 py-1.5 rounded-md text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm ${
                      active
                        ? "bg-warm/20 border border-warm text-warm"
                        : "border border-warm/20 text-paper/60 hover:border-warm/50 hover:text-paper/90"
                    }`}
                  >
                    {s.label}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Team size stepper */}
          <section aria-labelledby="team-label">
            <label id="team-label" className="block text-xs uppercase tracking-widest text-paper/50 mb-3">
              Team Size
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setTeamSize((n) => Math.max(1, n - 1))}
                aria-label="Decrease team size"
                disabled={teamSize <= 1}
                className="w-9 h-9 rounded-md border border-warm/30 flex items-center justify-center text-paper/70 hover:border-warm hover:text-warm disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm"
              >
                <Minus size={14} />
              </button>
              <span
                className="text-2xl font-display text-paper min-w-[2ch] text-center"
                aria-live="polite"
                aria-atomic="true"
              >
                {teamSize}
              </span>
              <button
                onClick={() => setTeamSize((n) => Math.min(5, n + 1))}
                aria-label="Increase team size"
                disabled={teamSize >= 5}
                className="w-9 h-9 rounded-md border border-warm/30 flex items-center justify-center text-paper/70 hover:border-warm hover:text-warm disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm"
              >
                <Plus size={14} />
              </button>
              <span className="text-sm text-paper/40">
                {teamSize === 1 ? "Solo" : teamSize <= 3 ? "Small team" : "Enterprise"}
              </span>
            </div>
          </section>
        </div>

        {/* ── Quote Column ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 bg-ink/40 backdrop-blur-md border border-warm/20 rounded-2xl p-6 hover:border-warm/60 transition-colors duration-300">

          {/* Base label */}
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-paper/50">Estimate</span>
            <span className="text-xs text-paper/40">{scope.label}</span>
          </div>

          {/* Line items */}
          {selectedServices.size === 0 ? (
            <p className="text-sm text-paper/40 italic py-4">Select at least one service</p>
          ) : (
            <div className="flex flex-col gap-1">
              <div className="grid grid-cols-4 gap-2 text-xs text-paper/30 uppercase tracking-wide pb-2 border-b border-warm/10">
                <span className="col-span-2">Service</span>
                <span className="text-right">Hrs</span>
                <span className="text-right">Subtotal</span>
              </div>
              {lineItems.map((item) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="grid grid-cols-4 gap-2 text-sm py-1.5"
                >
                  <span className="col-span-2 text-paper/70">{item.label}</span>
                  <span className="text-right text-paper/50">{item.hours}</span>
                  <span className="text-right text-paper/80">{formatCurrency(item.subtotal)}</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Total */}
          <div className="mt-auto pt-4 border-t border-warm/10">
            {selectedServices.size === 0 ? (
              <div className="text-4xl font-display text-paper/20">—</div>
            ) : (
              <AnimatedNumber
                value={total}
                className="text-5xl lg:text-6xl font-display text-warm block"
              />
            )}
            <p className="text-xs text-paper/40 mt-2">
              {selectedServices.size > 0
                ? `Delivered by ${deliveryDate}`
                : "Select services to see your estimate"}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleContactScroll}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-br from-[#ffb68d] to-warm text-ink rounded-md font-medium px-6 py-3 hover:opacity-90 active:scale-[0.98] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm"
            >
              Book a discovery call
              <ArrowRight size={16} />
            </button>
            <button
              onClick={handleCopyUrl}
              className="flex items-center justify-center gap-2 border border-warm/40 hover:border-warm text-warm hover:bg-warm/5 rounded-md px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm"
              aria-label="Copy shareable quote URL"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Copied" : "Share quote"}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
