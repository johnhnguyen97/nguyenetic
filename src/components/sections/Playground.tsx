"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Calculator, Sparkles, Palette } from "lucide-react"
import { useTranslations } from "next-intl"
import { SeoPreview } from "@/components/demos/SeoPreview"
import { PricingCalculator } from "@/components/demos/PricingCalculator"
import { ContentGenerator } from "@/components/demos/ContentGenerator"
import { DesignSystemExtractor } from "@/components/demos/DesignSystemExtractor"
import { InkBrushUnderline } from "@/components/ui/ink-brush"
import { GLASS_TILE_CLASSES } from "@/components/ui/glass-tile"

type DemoKey = "seo" | "pricing" | "content" | "design"

interface DemoTab {
  key: DemoKey
  icon: typeof Search
  Component: () => React.ReactNode
}

const DEMOS: DemoTab[] = [
  { key: "seo", icon: Search, Component: SeoPreview },
  { key: "pricing", icon: Calculator, Component: PricingCalculator },
  { key: "content", icon: Sparkles, Component: ContentGenerator },
  { key: "design", icon: Palette, Component: DesignSystemExtractor },
]

export function Playground() {
  const t = useTranslations("playground")
  const [activeKey, setActiveKey] = useState<DemoKey>("seo")
  const active = DEMOS.find((d) => d.key === activeKey)!

  return (
    <section
      id="playground"
      className="relative py-32 px-6 overflow-hidden bg-ink"
    >
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-[0.3em] text-warm font-mono uppercase mb-4"
        >
          {t("section")}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-[clamp(2.5rem,7vw,5rem)] font-semibold tracking-tight text-paper mb-2 leading-[1.05]"
        >
          {t("titleA")}{" "}
          <span className="text-warm">{t("titleB")}</span>
        </motion.h2>

        <InkBrushUnderline className="w-56 h-3 mb-6" />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="max-w-2xl text-lg text-paper/70 leading-relaxed mb-16"
        >
          {t("description")}
        </motion.p>

        <div
          role="tablist"
          aria-label={t("ariaLabel")}
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
                    {t(`demos.${demo.key}.label`)}
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

        <motion.p
          key={`desc-${activeKey}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-sm text-paper/60 mb-8 max-w-2xl"
        >
          {t(`demos.${active.key}.desc`)}
        </motion.p>

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
