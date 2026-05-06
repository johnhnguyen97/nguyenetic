"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

export function Contact() {
  const t = useTranslations("contact")

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden border-t border-warm/20 bg-ink px-6 pb-20 pt-32 text-paper md:px-10 md:pt-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[20%] h-[700px] w-[700px] -translate-x-1/2 rounded-full opacity-70 blur-[80px]"
        style={{ background: "radial-gradient(circle, color-mix(in oklch, var(--color-warm) 20%, transparent) 0%, transparent 60%)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-[1000px] text-center"
      >
        <div className="mb-8 font-mono text-[11px] uppercase tracking-[0.3em] text-warm">
          — {t("section")}
        </div>

        <h2 className="font-[family-name:var(--font-instrument)] text-[clamp(3.5rem,8vw,7.75rem)] font-normal leading-[0.9] tracking-[-0.03em]">
          {t("titleA")}
          <br />
          <span className="italic text-warm">{t("titleB")}</span>
        </h2>

        <p className="mx-auto mt-8 max-w-xl text-lg leading-snug text-paper/70">
          {t("description")}
        </p>

        <a
          href="mailto:hello@nguyenetic.com"
          className="mt-12 inline-flex items-center gap-3 rounded-full bg-warm px-9 py-5 font-mono text-[13px] font-semibold uppercase tracking-[0.22em] text-ink transition-colors hover:bg-warm-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-warm focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          hello@nguyenetic.com <span className="text-base" aria-hidden>→</span>
        </a>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-6 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/40">
          <span>{t("replyTime")}</span>
          <span className="text-warm">·</span>
          <span>{t("freeCall")}</span>
          <span className="text-warm">·</span>
          <span>{t("fixedQuote")}</span>
        </div>
      </motion.div>
    </section>
  )
}
