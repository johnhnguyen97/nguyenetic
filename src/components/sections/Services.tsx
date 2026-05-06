"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

export function Services() {
  const t = useTranslations("services")
  const items = t.raw("items") as Array<{ label: string; promise: string; metric: string }>

  return (
    <section
      id="services"
      className="w-full border-t border-warm/20 bg-ink px-6 py-24 text-paper md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-warm">
          — {t("section")}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 flex flex-wrap items-end justify-between gap-8"
        >
          <h2 className="font-[family-name:var(--font-instrument)] text-[clamp(3rem,7vw,6.5rem)] font-normal leading-[0.9] tracking-[-0.02em]">
            {t("titleA")}
            <br />
            <span className="italic text-paper/40">{t("titleB")}</span>
          </h2>
          <p className="max-w-xs font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-paper/40">
            {t("description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 border-t border-paper/10 md:grid-cols-2 lg:grid-cols-3">
          {items.map((s, i) => {
            const num = String(i + 1).padStart(2, "0")
            return (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="relative min-h-[260px] border-b border-paper/10 p-8 md:p-10 md:odd:border-r md:odd:border-paper/10 lg:odd:border-r-0 lg:[&:not(:nth-child(3n))]:border-r lg:[&:not(:nth-child(3n))]:border-paper/10"
              >
                <div className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/40">
                  {num} / {s.label}
                </div>
                <div className="mb-6 text-lg leading-snug text-paper/80">{s.promise}</div>
                <div className="font-[family-name:var(--font-instrument)] text-[clamp(3rem,5vw,4.5rem)] italic leading-none tracking-[-0.02em] text-warm">
                  {s.metric}
                </div>
                <div className="absolute bottom-5 right-6 font-mono text-[10px] tracking-[0.2em] text-warm/60">
                  ↗ {t("readTerms")}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
