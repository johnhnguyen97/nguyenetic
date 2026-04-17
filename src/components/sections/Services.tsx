"use client"

import { motion } from "framer-motion"
import { Code, TrendingUp, Share2, Search, Palette, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const springEase = [0.22, 1, 0.36, 1] as const

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
            return (
              <motion.div
                key={service.titleEN}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08, duration: 0.7, ease: springEase }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`group relative p-6 rounded-2xl bg-ink/60 backdrop-blur-md border border-warm/40 hover:border-warm transition-all duration-300 cursor-default ${
                  isWide ? "lg:col-span-2" : ""
                }`}
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-warm/10 border border-warm/20 group-hover:bg-warm/20 transition-colors">
                    <Icon className="w-5 h-5 text-warm" />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-display font-bold text-paper text-lg mb-2">
                    {t(service.titleEN, service.titleJA)}
                  </h3>
                  <p className="text-paper/70 text-sm leading-relaxed">
                    {t(service.descEN, service.descJA)}
                  </p>
                </div>

                {/* Subtle corner accent */}
                <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-warm/30 group-hover:bg-warm/60 transition-colors" />
              </motion.div>
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
