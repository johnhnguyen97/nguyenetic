"use client"

import { motion } from "framer-motion"
import { StaticReceipt } from "@/components/ui/static-receipt"
import { useLanguage } from "@/lib/language-context"

export function Proof() {
  const { t } = useLanguage()

  const promises: Array<[string, string, string, string, string]> = [
    ["01", t("Fixed scope", "確定スコープ"), t("written before we start", "着手前に文書化"), "Fixed scope", "written before we start"],
    ["02", t("Fixed price", "固定価格"), t("no surprise line items", "追加請求なし"), "Fixed price", "no surprise line items"],
    ["03", t("Fixed deadline", "確定納期"), t("or the month is free", "遅延時は当月無料"), "Fixed deadline", "or the month is free"],
  ]

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
            — {t("section 002 · the promise", "セクション002 · 約束")}
          </div>
          <h2 className="font-[family-name:var(--font-instrument)] text-[clamp(3rem,6vw,5.5rem)] font-normal leading-[0.9] tracking-[-0.03em]">
            {t("We hand you", "お渡しするのは")}
            <br />
            {t("the receipt,", "領収書。")}
            <br />
            <span className="italic text-warm">
              {t("not the estimate.", "見積書ではなく。")}
            </span>
          </h2>
          <p className="mt-8 max-w-md text-[17px] leading-relaxed text-paper/70">
            {t(
              "Every engagement ends with a stamped receipt of exactly what we shipped, what it cost, and what it's earning you. No retainers you can't read. No \"strategic alignment.\" Just work and numbers.",
              "全ての案件は、納品物・費用・収益効果を明記した押印済み領収書で締めくくります。不透明な顧問料なし。曖昧な『戦略的連携』なし。仕事と数字だけ。"
            )}
          </p>

          <div className="mt-10 grid gap-3.5 font-mono text-[12px] tracking-[0.12em] text-paper/80">
            {promises.map(([n, title, sub]) => (
              <div
                key={n}
                className="grid grid-cols-[40px_minmax(120px,180px)_1fr] items-baseline gap-4 border-b border-paper/10 py-3"
              >
                <span className="text-warm">{n}</span>
                <span>{title}</span>
                <span className="lowercase text-paper/40">{sub}</span>
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
