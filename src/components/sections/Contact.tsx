"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/lib/language-context"

export function Contact() {
  const { t } = useLanguage()

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
          — {t("section 005 · transmit", "セクション005 · 送信")}
        </div>

        <h2 className="font-[family-name:var(--font-instrument)] text-[clamp(3.5rem,8vw,7.75rem)] font-normal leading-[0.9] tracking-[-0.03em]">
          {t("Pull your problem", "あなたの問題を")}
          <br />
          <span className="italic text-warm">{t("into orbit.", "軌道へ。")}</span>
        </h2>

        <p className="mx-auto mt-8 max-w-xl text-lg leading-snug text-paper/70">
          {t(
            "Tell me what's broken. I'll tell you if I can fix it, what it'll cost, and when it'll ship. If not, I'll tell you who can.",
            "困っていることを教えてください。解決できるか、費用、納期をお伝えします。できない場合は、適任者を紹介します。"
          )}
        </p>

        <a
          href="mailto:hello@nguyenetic.com"
          className="mt-12 inline-flex items-center gap-3 rounded-full bg-warm px-9 py-5 font-mono text-[13px] font-semibold uppercase tracking-[0.22em] text-ink transition-colors hover:bg-warm-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-warm focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          hello@nguyenetic.com <span className="text-base" aria-hidden>→</span>
        </a>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-6 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/40">
          <span>{t("reply within 24h", "24時間以内に返信")}</span>
          <span className="text-warm">·</span>
          <span>{t("free scope call", "無料相談コール")}</span>
          <span className="text-warm">·</span>
          <span>{t("fixed price quote", "固定価格見積")}</span>
        </div>
      </motion.div>

      <div className="mx-auto mt-28 flex max-w-[1440px] flex-wrap justify-between gap-4 border-t border-warm/20 pt-8 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/40">
        <span>© 2026 nguyenetic · {t("est 2024", "設立2024")}</span>
        <span className="text-warm">◇ {t("field stable · signal strong", "軌道安定・信号強力")}</span>
        <span className="hidden sm:inline">{t("lat 37.7749° N · lon 122.4194° W", "北緯 37.77° · 西経 122.42°")}</span>
      </div>
    </section>
  )
}
