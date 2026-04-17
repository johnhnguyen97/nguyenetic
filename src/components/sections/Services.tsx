"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Code, TrendingUp, Share2, Search, Palette, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useState } from "react"
import { GlassTile } from "@/components/ui/glass-tile"

const springEase = [0.22, 1, 0.36, 1] as const

// Mini SVG demos — each < 30 lines, just teaser visuals
function DevMiniDemo() {
  return (
    <svg width="100%" height="28" viewBox="0 0 180 28" className="opacity-80" aria-hidden>
      {["const", "async", "return", "export"].map((word, i) => (
        <motion.text
          key={word}
          x={i * 44 + 4}
          y="18"
          fontSize="10"
          fontFamily="monospace"
          fill="#ff8a3d"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.25 }}
        >
          {word}
        </motion.text>
      ))}
      <motion.rect
        x="0" y="22" height="2" rx="1"
        fill="#ff8a3d"
        initial={{ width: 0 }}
        animate={{ width: [0, 180, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  )
}

function MarketingMiniDemo() {
  const pts = [0, 14, 7, 4, 18, 2, 12, 8, 22, 1].map((v, i) => `${i * 20},${26 - v * 1.2}`)
  return (
    <svg width="100%" height="28" viewBox="0 0 180 28" aria-hidden>
      <motion.polyline
        points={pts.join(" ")}
        fill="none"
        stroke="#ff8a3d"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      {pts.map((p, i) => {
        const [x, y] = p.split(",")
        return (
          <motion.circle
            key={i}
            cx={x} cy={y} r="2.5"
            fill="#ff8a3d"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.12, duration: 0.3 }}
          />
        )
      })}
    </svg>
  )
}

function SocialMiniDemo() {
  return (
    <svg width="100%" height="28" viewBox="0 0 180 28" aria-hidden>
      {[30, 90, 150].map((cx, i) => (
        <g key={cx}>
          <circle cx={cx} cy="14" r="7" fill="none" stroke="#ff8a3d" strokeWidth="1.5" opacity="0.6" />
          {i < 2 && (
            <motion.line
              x1={cx + 7} y1="14" x2={cx + 53} y2="14"
              stroke="#ff8a3d" strokeWidth="1" strokeDasharray="4 3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: i * 0.3, duration: 0.6 }}
            />
          )}
          <motion.circle
            cx={cx} cy="14" r="3"
            fill="#ff8a3d"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.4, 1] }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
          />
        </g>
      ))}
    </svg>
  )
}

function SeoMiniDemo() {
  const bars = [60, 80, 45, 95, 70]
  return (
    <svg width="100%" height="28" viewBox="0 0 180 28" aria-hidden>
      {bars.map((pct, i) => (
        <motion.rect
          key={i}
          x={i * 36 + 2}
          y={28 - (pct / 100) * 24}
          width="22"
          rx="2"
          fill="#ff8a3d"
          opacity={0.3 + i * 0.14}
          initial={{ height: 0, y: 28 }}
          animate={{ height: (pct / 100) * 24, y: 28 - (pct / 100) * 24 }}
          transition={{ delay: i * 0.1, duration: 0.6, ease: springEase }}
        />
      ))}
    </svg>
  )
}

function DesignMiniDemo() {
  const swatches = ["#ff8a3d", "#080618", "#f5f0eb", "#6b5e8a", "#c4a882"]
  return (
    <svg width="100%" height="28" viewBox="0 0 180 28" aria-hidden>
      {swatches.map((c, i) => (
        <motion.rect
          key={c}
          x={i * 36} y="4"
          width="28" height="20"
          rx="4"
          fill={c}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.08, duration: 0.4, ease: springEase }}
        />
      ))}
    </svg>
  )
}

function AiMiniDemo() {
  return (
    <svg width="100%" height="28" viewBox="0 0 180 28" aria-hidden>
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.circle
          key={i}
          cx={i * 30 + 15}
          cy="14"
          r="5"
          fill="none"
          stroke="#ff8a3d"
          strokeWidth="1.5"
          initial={{ scale: 0.5, opacity: 0.2 }}
          animate={{ scale: [0.5, 1.2, 0.5], opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </svg>
  )
}

const MINI_DEMOS = {
  Development: DevMiniDemo,
  Marketing: MarketingMiniDemo,
  Social: SocialMiniDemo,
  SEO: SeoMiniDemo,
  Design: DesignMiniDemo,
  "AI Solutions": AiMiniDemo,
} as const

const services = [
  {
    icon: Code,
    titleEN: "Development",
    titleJA: "開発",
    descEN: "Full-stack solutions built for scale and speed.",
    descJA: "スケールとスピードに最適化されたフルスタック開発。",
    wide: true,
  },
  {
    icon: TrendingUp,
    titleEN: "Marketing",
    titleJA: "マーケティング",
    descEN: "Strategic growth and customer acquisition.",
    descJA: "戦略的グロースと顧客獲得。",
    wide: false,
  },
  {
    icon: Share2,
    titleEN: "Social",
    titleJA: "SNS",
    descEN: "Authentic community engagement and storytelling.",
    descJA: "真のコミュニティエンゲージメントとストーリーテリング。",
    wide: false,
  },
  {
    icon: Search,
    titleEN: "SEO",
    titleJA: "SEO",
    descEN: "Technical + content + AI search visibility.",
    descJA: "テクニカル・コンテンツ・AI検索の最適化。",
    wide: false,
  },
  {
    icon: Palette,
    titleEN: "Design",
    titleJA: "デザイン",
    descEN: "Editorial UI/UX focused on rhythm and clarity.",
    descJA: "リズムと明快さを重視したエディトリアルUI/UX。",
    wide: true,
  },
  {
    icon: Sparkles,
    titleEN: "AI Solutions",
    titleJA: "AI",
    descEN: "Workflows, custom tools, and automation.",
    descJA: "ワークフロー・カスタムツール・自動化。",
    wide: false,
  },
]

export function Services() {
  const { t } = useLanguage()
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <section id="services" className="relative py-32 px-6 overflow-hidden bg-ink">
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
            サービス
          </p>
          <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-display font-bold text-paper leading-none mb-4">
            {t("Services", "サービス")}
          </h2>
          <div className="w-16 h-px bg-warm" />
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, i) => {
            const Icon = service.icon
            const isWide = service.wide
            const MiniDemo = MINI_DEMOS[service.titleEN as keyof typeof MINI_DEMOS]
            const isHovered = hoveredIdx === i

            return (
              <GlassTile
                key={service.titleEN}
                interactive
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08, duration: 0.7, ease: springEase }}
                whileHover={{ scale: 1.02, y: -2 }}
                onHoverStart={() => setHoveredIdx(i)}
                onHoverEnd={() => setHoveredIdx(null)}
                className={`group relative cursor-default ${isWide ? "lg:col-span-2" : ""}`}
              >
                {/* Live demo indicator */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-4 right-4 flex items-center gap-1.5"
                    >
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-warm"
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      />
                      <span className="text-[9px] uppercase tracking-[0.2em] text-warm font-mono">live demo</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Icon */}
                <div className="mb-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-warm/10 border border-warm/20 group-hover:bg-warm/20 transition-colors">
                    <Icon className="w-5 h-5 text-warm" />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-display font-bold text-paper text-lg mb-2">
                    {t(service.titleEN, service.titleJA)}
                  </h3>
                  <p className="text-paper/70 text-sm leading-relaxed mb-4">
                    {t(service.descEN, service.descJA)}
                  </p>
                </div>

                {/* Mini demo area */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: springEase }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 border-t border-warm/10">
                        <MiniDemo />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Corner accent — hidden when live demo indicator is showing */}
                {!isHovered && (
                  <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-warm/30 group-hover:bg-warm/60 transition-colors" />
                )}
              </GlassTile>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: springEase }}
          className="mt-16 text-center"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-warm text-ink rounded-full font-medium hover:bg-warm-hover transition-colors"
          >
            <span>{t("Start Your Project", "プロジェクトを始める")}</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
