"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Calculator, Sparkles, Palette } from "lucide-react"
import { SeoPreview } from "@/components/demos/SeoPreview"
import { PricingCalculator } from "@/components/demos/PricingCalculator"
import { ContentGenerator } from "@/components/demos/ContentGenerator"
import { DesignSystemExtractor } from "@/components/demos/DesignSystemExtractor"
import { InkBrushUnderline } from "@/components/ui/ink-brush"
import { useLanguage } from "@/lib/language-context"
import { GLASS_TILE_CLASSES } from "@/components/ui/glass-tile"

type DemoKey = "seo" | "pricing" | "content" | "design"

interface DemoTab {
  key: DemoKey
  labelEn: string
  labelJa: string
  descEn: string
  descJa: string
  icon: typeof Search
  Component: () => React.ReactNode
}

const DEMOS: DemoTab[] = [
  {
    key: "seo",
    labelEn: "SEO Preview",
    labelJa: "SEOプレビュー",
    descEn: "Paste any URL — see the mock SERP + AI Overview + Core Web Vitals scoring.",
    descJa: "URLを貼り付けて、検索結果とAI要約、パフォーマンススコアを確認。",
    icon: Search,
    Component: SeoPreview,
  },
  {
    key: "pricing",
    labelEn: "Pricing Calculator",
    labelJa: "料金シミュレーター",
    descEn: "Pick scope, timeline, services, team size — get a live quote you can share.",
    descJa: "範囲、期間、サービス、チーム規模を選択して、共有可能な見積もりを生成。",
    icon: Calculator,
    Component: PricingCalculator,
  },
  {
    key: "content",
    labelEn: "Content Generator",
    labelJa: "コンテンツジェネレーター",
    descEn: "Give a topic — get a streaming blog outline, tweet thread, newsletter, or script.",
    descJa: "トピックを入力し、ブログ構成、ツイートスレッド、ニュースレター、スクリプトを生成。",
    icon: Sparkles,
    Component: ContentGenerator,
  },
  {
    key: "design",
    labelEn: "Design System Extractor",
    labelJa: "デザインシステム抽出",
    descEn: "Paste a URL — extract palette, typography, spacing, and components as Tailwind tokens.",
    descJa: "URLからパレット、タイポグラフィ、スペーシング、コンポーネントをTailwindトークンとして抽出。",
    icon: Palette,
    Component: DesignSystemExtractor,
  },
]

export function Playground() {
  const { language, t } = useLanguage()
  const [activeKey, setActiveKey] = useState<DemoKey>("seo")
  const active = DEMOS.find((d) => d.key === activeKey)!

  return (
    <section
      id="playground"
      className="relative py-32 px-6 overflow-hidden bg-ink"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-[0.3em] text-warm font-mono uppercase mb-4"
        >
          {t("遊び場 · Playground · Interactive Tools", "遊び場 · インタラクティブツール")}
        </motion.p>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-[clamp(2.5rem,7vw,5rem)] font-semibold tracking-tight text-paper mb-2 leading-[1.05]"
        >
          {t("Play with my work.", "私の仕事で遊ぶ。")}{" "}
          <span className="text-warm">{t("Live.", "ライブで。")}</span>
        </motion.h2>

        <InkBrushUnderline className="w-56 h-3 mb-6" />

        {/* Intro copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="max-w-2xl text-lg text-paper/70 leading-relaxed mb-16"
        >
          {t(
            "Four tools I built — working, not mocked. Every one runs entirely in your browser. Screenshots are for websites; these are the real thing.",
            "実際に動くツールを4つ。モックではなく、ブラウザ上で完全に動作します。スクリーンショットではなく、本物を体験してください。",
          )}
        </motion.p>

        {/* Tab bar */}
        <div
          role="tablist"
          aria-label={t("Interactive demos", "インタラクティブデモ")}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12"
        >
          {DEMOS.map((demo) => {
            const Icon = demo.icon
            const isActive = demo.key === activeKey
            return (
              <button
                key={demo.key}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls={`panel-${demo.key}`}
                id={`tab-${demo.key}`}
                onClick={() => setActiveKey(demo.key)}
                className={`group relative flex items-center gap-3 rounded-xl px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-warm/70 ${
                  isActive
                    ? GLASS_TILE_CLASSES.active
                    : GLASS_TILE_CLASSES.interactive
                }`}
              >
                <div
                  className={`flex-none w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-warm/15 border-warm/50 text-warm"
                      : "bg-ink/50 border-warm/20 text-warm/70 group-hover:text-warm"
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={`font-display text-sm font-semibold truncate transition-colors ${
                      isActive ? "text-paper" : "text-paper/80 group-hover:text-paper"
                    }`}
                  >
                    {language === "ja" ? demo.labelJa : demo.labelEn}
                  </div>
                  <div
                    className={`text-[10px] tracking-[0.2em] uppercase font-mono mt-0.5 ${
                      isActive ? "text-warm" : "text-paper/40"
                    }`}
                  >
                    {isActive ? "● LIVE" : "▸ TRY"}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Description of active demo */}
        <motion.p
          key={`desc-${activeKey}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-sm text-paper/60 mb-8 max-w-2xl"
        >
          {language === "ja" ? active.descJa : active.descEn}
        </motion.p>

        {/* Active demo panel */}
        <div
          className="relative"
          role="tabpanel"
          id={`panel-${activeKey}`}
          aria-labelledby={`tab-${activeKey}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <active.Component />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
