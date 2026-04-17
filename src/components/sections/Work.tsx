"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const springEase = [0.22, 1, 0.36, 1] as const

const projects = [
  {
    id: "moxie",
    title: "GoJUN",
    descEN: "AI-powered Japanese learning SaaS with real-time flashcards, spaced repetition, and adaptive vocabulary engine.",
    descJA: "リアルタイムフラッシュカード、間隔反復、適応型語彙エンジンを備えたAI搭載日本語学習SaaS。",
    stack: ["Next.js", "React", "TypeScript", "Supabase"],
    featured: true,
    url: "https://gojun.vercel.app/",
  },
  {
    id: "ryoanji",
    title: "Fast Fix Whitemarsh",
    descEN: "Full digital transformation — website, SEO strategy, and Google Ads campaigns driving local bookings.",
    descJA: "ウェブサイト、SEO戦略、Google広告で地元の予約を促進する完全なデジタルトランスフォーメーション。",
    stack: ["Next.js", "Sanity", "Tailwind"],
    featured: false,
    url: "https://www.fastfixwhitemarsh.com/",
  },
  {
    id: "zenwave",
    title: "EV Wrap",
    descEN: "High-converting lead gen site with instant quote calculator and automated capture system.",
    descJA: "即時見積もり計算機と自動キャプチャシステムを備えた高コンバージョンのリードジェン。",
    stack: ["Next.js", "Vercel", "Framer Motion"],
    featured: false,
    url: "https://evwrap-git-development-nguyenetics-projects.vercel.app/",
  },
  {
    id: "ichiban",
    title: "Ichiban Restaurant",
    descEN: "Elegant restaurant experience with dynamic menu CMS, reservation system, and brand storytelling.",
    descJA: "動的メニューCMS、予約システム、ブランドストーリーテリングを備えたエレガントなレストラン体験。",
    stack: ["Next.js", "Sanity", "TypeScript"],
    featured: false,
    url: "https://ichiban-website-taupe.vercel.app/",
  },
  {
    id: "shibui",
    title: "Zen Dashboard",
    descEN: "Internal analytics platform with real-time data visualization and AI-driven performance insights.",
    descJA: "リアルタイムデータ可視化とAI駆動のパフォーマンスインサイトを備えた内部分析プラットフォーム。",
    stack: ["React", "TypeScript", "OpenAI", "Supabase"],
    featured: false,
    url: "#work",
  },
  {
    id: "kaizen",
    title: "Nguyenetic Studio",
    descEN: "Branding, motion, and editorial design system built on Tailwind tokens and Framer Motion primitives.",
    descJA: "TailwindトークンとFramer Motionプリミティブで構築したブランディング・モーション・エディトリアルデザインシステム。",
    stack: ["Tailwind", "Framer Motion", "Vercel"],
    featured: false,
    wide: true,
    url: "#work",
  },
]

// ── GoJUN: AI flashcard SaaS with live chart + streak counter ──────────────
function GoJunPreview() {
  const reduce = useReducedMotion()
  const chartPoints = [18, 32, 24, 45, 38, 58, 52, 71, 65, 82]
  const w = 160
  const h = 56
  const pts = chartPoints
    .map((v, i) => `${(i / (chartPoints.length - 1)) * w},${h - (v / 100) * h}`)
    .join(" ")

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none bg-ink/90 flex flex-col gap-3 p-5 overflow-hidden"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.span
            animate={reduce ? {} : { opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-2 rounded-full bg-green-400"
          />
          <span className="text-[10px] font-mono text-paper/60">ACTIVE SESSION</span>
        </div>
        <span className="text-[10px] font-mono text-warm">🔥 14 day streak</span>
      </div>

      {/* Flashcard */}
      <motion.div
        animate={reduce ? {} : { y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="rounded-lg border border-warm/20 bg-ink/60 px-4 py-3 text-center"
      >
        <p className="text-[11px] text-paper/50 font-mono mb-1">vocabulary · N3</p>
        <p className="text-lg font-display font-bold text-paper">勉強する</p>
        <p className="text-[10px] text-warm mt-1">to study · benkyou suru</p>
      </motion.div>

      {/* Mini line chart */}
      <div className="flex-1 flex flex-col gap-1">
        <p className="text-[9px] font-mono text-paper/40 uppercase tracking-wider">XP this week</p>
        <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="flex-1">
          <motion.polyline
            points={pts}
            fill="none"
            stroke="#D4A843"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={reduce ? { pathLength: 1 } : { pathLength: [0, 1, 1, 0] }}
            transition={{ duration: 4, times: [0, 0.5, 0.85, 1], repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>
    </div>
  )
}

// ── Fast Fix Whitemarsh: map pin + booking confirmation ────────────────────
function FastFixPreview() {
  const reduce = useReducedMotion()
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (reduce) {
      setTimeout(() => setConfirmed(true), 0)
      return
    }
    const t1 = setTimeout(() => setConfirmed(true), 1800)
    const t2 = setTimeout(() => setConfirmed(false), 4200)
    const t3 = setTimeout(() => setConfirmed(true), 6000)
    const t4 = setTimeout(() => setConfirmed(false), 9400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [reduce])

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none bg-ink/90 flex flex-col items-center justify-center gap-4 overflow-hidden"
    >
      {/* Map stub */}
      <div className="relative w-full h-24 bg-ink/60 rounded-xl border border-warm/20 overflow-hidden mx-5">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 18px,#D4A84320 18px,#D4A84320 19px),repeating-linear-gradient(90deg,transparent,transparent 18px,#D4A84320 18px,#D4A84320 19px)" }}
        />
        {/* Pin */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2"
          initial={{ y: -20, opacity: 0 }}
          animate={reduce ? { y: 12, opacity: 1 } : { y: [-20, 12, 12, -20], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: springEase }}
        >
          <div className="w-6 h-6 rounded-full bg-warm flex items-center justify-center shadow-lg">
            <div className="w-2 h-2 rounded-full bg-ink" />
          </div>
          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-warm mx-auto" />
        </motion.div>
      </div>

      {/* Booking card */}
      <AnimatePresence mode="wait">
        {confirmed ? (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: springEase }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-green-400/40 bg-green-400/10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-[11px] font-mono text-green-400">Booking confirmed · 2:30 PM</span>
          </motion.div>
        ) : (
          <motion.div
            key="pending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-warm/30 bg-warm/10"
          >
            <motion.span
              animate={reduce ? {} : { opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-warm"
            />
            <span className="text-[11px] font-mono text-warm">Checking availability…</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── EV Wrap: quote calculator with price ticker ────────────────────────────
function EvWrapPreview() {
  const reduce = useReducedMotion()
  const prices = [1299, 1499, 1799, 2199, 2599]
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setIdx((p) => (p + 1) % prices.length), 1400)
    return () => clearInterval(id)
  }, [reduce, prices.length])

  const options = ["Sedan", "SUV", "Truck", "Van", "Sport"]

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none bg-ink/90 flex flex-col gap-3 p-5 overflow-hidden"
    >
      <p className="text-[10px] font-mono text-paper/50 uppercase tracking-widest">Instant Quote</p>

      {/* Vehicle selector */}
      <div className="flex gap-1.5 flex-wrap">
        {options.map((o, i) => (
          <motion.span
            key={o}
            animate={reduce ? {} : i === idx ? { borderColor: "#D4A843", color: "#D4A843" } : { borderColor: "#D4A84340", color: "#ffffff60" }}
            transition={{ duration: 0.3 }}
            className="text-[9px] font-mono px-2 py-1 rounded border border-warm/20 text-paper/40"
          >
            {o}
          </motion.span>
        ))}
      </div>

      {/* Price display */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.3, ease: springEase }}
            className="text-3xl font-display font-bold text-warm"
          >
            ${prices[idx].toLocaleString()}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* CTA pulse */}
      <motion.div
        animate={reduce ? {} : { boxShadow: ["0 0 0 0 #D4A84340", "0 0 0 8px #D4A84300"] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="h-8 rounded-lg bg-warm/20 border border-warm/40 flex items-center justify-center"
      >
        <span className="text-[10px] font-mono text-warm">Get Full Quote →</span>
      </motion.div>
    </div>
  )
}

// ── Ichiban Restaurant: menu card + reservation counter ────────────────────
function IchibanPreview() {
  const reduce = useReducedMotion()
  const dishes = ["Tonkotsu Ramen", "Gyoza · 6pc", "Matcha Tiramisu", "Miso Black Cod"]
  const [dishIdx, setDishIdx] = useState(0)
  const [seats, setSeats] = useState(4)

  useEffect(() => {
    if (reduce) return
    const d = setInterval(() => setDishIdx((p) => (p + 1) % dishes.length), 2000)
    const s = setInterval(() => setSeats((p) => (p === 1 ? 8 : p - 1)), 2500)
    return () => { clearInterval(d); clearInterval(s) }
  }, [reduce, dishes.length])

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none bg-ink/90 flex flex-col gap-3 p-5 overflow-hidden"
    >
      {/* Menu card */}
      <div className="rounded-xl border border-warm/20 bg-ink/60 p-3 flex-1 flex flex-col gap-2">
        <p className="text-[9px] font-mono text-warm/60 uppercase tracking-widest">Today&apos;s Special</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={dishIdx}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.4, ease: springEase }}
            className="text-sm font-display font-semibold text-paper"
          >
            {dishes[dishIdx]}
          </motion.p>
        </AnimatePresence>
        <div className="flex gap-1 mt-auto">
          {[1,2,3,4,5].map((s) => (
            <span key={s} className="text-[10px] text-warm">★</span>
          ))}
          <span className="text-[9px] font-mono text-paper/40 ml-1">4.9</span>
        </div>
      </div>

      {/* Reservation bar */}
      <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-warm/20 bg-ink/40">
        <span className="text-[10px] font-mono text-paper/50">Seats tonight</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={seats}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.3 }}
            className="text-[11px] font-mono text-warm font-bold"
          >
            {seats} left
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Zen Dashboard: animated bar chart + AI insight pulse ──────────────────
function ZenDashboardPreview() {
  const reduce = useReducedMotion()
  const bars = [62, 84, 71, 93, 58, 77, 88]
  const days = ["M", "T", "W", "T", "F", "S", "S"]

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none bg-ink/90 flex flex-col gap-3 p-5 overflow-hidden"
    >
      {/* KPI row */}
      <div className="flex gap-3">
        {[{ label: "Queries", val: "12.4k" }, { label: "Avg ms", val: "42" }, { label: "Uptime", val: "99.9%" }].map(({ label, val }) => (
          <div key={label} className="flex-1 rounded-lg border border-warm/20 bg-ink/50 p-2 text-center">
            <p className="text-[8px] font-mono text-paper/40 uppercase">{label}</p>
            <p className="text-xs font-display font-bold text-warm">{val}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="flex-1 flex items-end gap-1.5">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              className="w-full rounded-t bg-warm/60"
              initial={{ height: 0 }}
              animate={reduce ? { height: `${h}%` } : { height: [`0%`, `${h}%`] }}
              transition={{ duration: 1, delay: i * 0.08, repeat: Infinity, repeatDelay: 3, ease: springEase }}
              style={{ minHeight: 2 }}
            />
            <span className="text-[8px] font-mono text-paper/30">{days[i]}</span>
          </div>
        ))}
      </div>

      {/* AI insight */}
      <motion.div
        animate={reduce ? {} : { opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-warm/20 bg-warm/5"
      >
        <span className="text-[9px] text-warm">✦</span>
        <span className="text-[9px] font-mono text-paper/60">AI: Peak traffic Wed 14:00 — scale up</span>
      </motion.div>
    </div>
  )
}

// ── Nguyenetic Studio: design tokens cycling + motion primitives ───────────
function NguyeneticStudioPreview() {
  const reduce = useReducedMotion()
  const palettes = [
    ["#D4A843", "#F0D090", "#8B6914"],
    ["#6B7FD4", "#A0AAFF", "#2E3A8C"],
    ["#D46B6B", "#F0A0A0", "#8C2E2E"],
    ["#6BD4A0", "#A0F0C8", "#2E8C5A"],
  ]
  const [palIdx, setPalIdx] = useState(0)
  const headlines = ["Brand · Motion", "Type · Color", "Grid · Space", "Icon · Form"]
  const [headIdx, setHeadIdx] = useState(0)

  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => {
      setPalIdx((p) => (p + 1) % palettes.length)
      setHeadIdx((p) => (p + 1) % headlines.length)
    }, 1800)
    return () => clearInterval(id)
  }, [reduce, palettes.length, headlines.length])

  const pal = palettes[palIdx]

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none bg-ink/90 flex flex-col gap-3 p-5 overflow-hidden"
    >
      {/* Palette swatches */}
      <div className="flex gap-2 items-center">
        {pal.map((c, i) => (
          <motion.div
            key={`${palIdx}-${i}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.07, duration: 0.35, ease: springEase }}
            className="w-6 h-6 rounded-full border border-paper/10"
            style={{ backgroundColor: c }}
          />
        ))}
        <span className="text-[9px] font-mono text-paper/40 ml-1">palette {palIdx + 1}/4</span>
      </div>

      {/* Cycling headline */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={headIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: springEase }}
            className="text-xl font-display font-bold text-paper"
            style={{ color: pal[0] }}
          >
            {headlines[headIdx]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Token pills */}
      <div className="flex gap-1.5 flex-wrap">
        {["--color-warm", "--font-display", "--radius-lg", "--ease-spring"].map((tok) => (
          <span key={tok} className="text-[8px] font-mono px-2 py-0.5 rounded border border-warm/20 text-paper/40">{tok}</span>
        ))}
      </div>
    </div>
  )
}

const previewMap: Record<string, React.ComponentType> = {
  moxie: GoJunPreview,
  ryoanji: FastFixPreview,
  zenwave: EvWrapPreview,
  ichiban: IchibanPreview,
  shibui: ZenDashboardPreview,
  kaizen: NguyeneticStudioPreview,
}

export function Work() {
  const { t } = useLanguage()
  const [hovered, setHovered] = useState<string | null>(null)

  const featured = projects[0]
  const standard = projects.slice(1, 5)
  const wide = projects[5]

  return (
    <section id="work" className="relative py-32 px-6 overflow-hidden bg-ink">
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: springEase }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.3em] text-warm font-mono uppercase mb-4">
            作品 · PORTFOLIO SELECTION 2026
          </p>
          <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-display font-bold text-paper leading-none mb-6">
            {t("Selected ", "セレクテッド ")}
            <span className="text-warm">{t("Works", "ワークス")}</span>
          </h2>
          <p className="text-paper/70 text-lg leading-relaxed max-w-2xl">
            {t(
              "Architecting digital ecosystems where performance meets aesthetic purity. A curated collection of hybrid marketing and development engagements.",
              "パフォーマンスと美的純度が交差するデジタルエコシステムを構築。マーケティングと開発の複合案件のキュレーテッドコレクション。"
            )}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Featured tile — 2×2 */}
          <motion.a
            href={featured.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: springEase }}
            onMouseEnter={() => setHovered(featured.id)}
            onMouseLeave={() => setHovered(null)}
            className="group relative block lg:col-span-2 lg:row-span-2 rounded-2xl overflow-hidden border border-warm/20 hover:border-warm transition-all duration-300"
          >
            <div className="relative h-72 lg:h-full min-h-[340px]">
              <GoJunPreview />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />

              <AnimatePresence>
                {hovered === featured.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-ink/60 flex items-center justify-center"
                  >
                    <p className="text-paper/80 text-sm text-center max-w-xs px-6 leading-relaxed">
                      {t(featured.descEN, featured.descJA)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-paper text-2xl mb-2">
                      {featured.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {featured.stack.map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full border border-warm/30 text-warm font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <motion.div
                    animate={{ x: hovered === featured.id ? 4 : 0, y: hovered === featured.id ? -4 : 0 }}
                    className="text-warm"
                  >
                    <ArrowUpRight className="w-6 h-6" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.a>

          {/* Standard tiles — 1×1 */}
          {standard.map((project, i) => {
            const Preview = previewMap[project.id]
            return (
              <motion.a
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.7, ease: springEase }}
                onMouseEnter={() => setHovered(project.id)}
                onMouseLeave={() => setHovered(null)}
                className="group relative block rounded-2xl overflow-hidden border border-warm/20 hover:border-warm transition-all duration-300"
              >
                <div className="relative h-48">
                  <Preview />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />

                  <AnimatePresence>
                    {hovered === project.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-ink/70 flex items-center justify-center px-5"
                      >
                        <p className="text-paper/80 text-xs text-center leading-relaxed">
                          {t(project.descEN, project.descJA)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="font-display font-semibold text-paper text-base mb-1.5">
                          {project.title}
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {project.stack.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full border border-warm/30 text-warm font-mono">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <motion.div
                        animate={{ x: hovered === project.id ? 4 : 0, y: hovered === project.id ? -4 : 0 }}
                        className="text-warm/60 group-hover:text-warm transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.a>
            )
          })}

          {/* Wide tile — 2×1 */}
          <motion.a
            href={wide.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.4, duration: 0.7, ease: springEase }}
            onMouseEnter={() => setHovered(wide.id)}
            onMouseLeave={() => setHovered(null)}
            className="group relative block lg:col-span-2 rounded-2xl overflow-hidden border border-warm/20 hover:border-warm transition-all duration-300"
          >
            <div className="relative h-48">
              <NguyeneticStudioPreview />
              <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/50 to-transparent" />

              <AnimatePresence>
                {hovered === wide.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-ink/60 flex items-center justify-center px-8"
                  >
                    <p className="text-paper/80 text-sm text-center leading-relaxed max-w-lg">
                      {t(wide.descEN, wide.descJA)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-paper text-lg mb-1.5">
                      {wide.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {wide.stack.map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full border border-warm/30 text-warm font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <motion.div
                    animate={{ x: hovered === wide.id ? 4 : 0, y: hovered === wide.id ? -4 : 0 }}
                    className="text-warm/60 group-hover:text-warm transition-colors"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.a>
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
            {t("Want to see your project here?", "あなたのプロジェクトをここに載せたいですか？")}
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-warm hover:underline underline-offset-4"
          >
            <span>{t("Let's build something amazing", "一緒に素晴らしいものを作りましょう")}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
