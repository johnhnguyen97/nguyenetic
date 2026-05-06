"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { StaticReceipt } from "@/components/ui/static-receipt"

export function Proof() {
  const t = useTranslations("proof")
  const pillars = t.raw("pillars") as Array<{ label: string; sub: string }>

  return (
    <section
      id="proof"
      className="relative w-full overflow-hidden bg-[#0A0A0A] px-6 py-24 text-paper md:px-10 md:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,520px)_1fr] lg:gap-16"
      >
        <div>
          <div className="mb-8 font-mono text-[11px] uppercase tracking-[0.3em] text-warm">
            — {t("section")}
          </div>
          <h2 className="font-[family-name:var(--font-instrument)] text-[clamp(3rem,6vw,5.5rem)] font-normal leading-[0.9] tracking-[-0.03em]">
            {t("titleA")}
            <br />
            {t("titleB")}
            <br />
            <span className="italic text-warm">{t("titleC")}</span>
          </h2>
          <p className="mt-8 max-w-md text-[17px] leading-relaxed text-paper/70">
            {t("description")}
          </p>

          <div className="mt-10 grid gap-3.5 font-mono text-[12px] tracking-[0.12em] text-paper/80">
            {pillars.map((pillar, i) => (
              <div
                key={i}
                className="grid grid-cols-[40px_minmax(120px,180px)_1fr] items-baseline gap-4 border-b border-paper/10 py-3"
              >
                <span className="text-warm">{String(i + 1).padStart(2, "0")}</span>
                <span>{pillar.label}</span>
                <span className="lowercase text-paper/40">{pillar.sub}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-[520px] overflow-hidden rounded-2xl border border-warm/20 md:h-[580px]">
          <StaticReceipt />
        </div>
      </motion.div>
    </section>
  )
}
