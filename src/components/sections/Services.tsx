"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/lib/language-context"

export function Services() {
  const { t } = useLanguage()

  const promises = [
    { num: "01", label: t("Web dev", "ウェブ開発"), promise: t("From wireframe to production in", "ワイヤーから本番環境まで"), metric: t("14 days", "14日") },
    { num: "02", label: t("SEO", "SEO"), promise: t("Local ranking moved within", "地域順位が動くまで"), metric: t("30 days", "30日") },
    { num: "03", label: t("Ads", "広告"), promise: t("First qualified lead in", "初回の見込み客まで"), metric: t("72 hours", "72時間") },
    { num: "04", label: t("Brand", "ブランド"), promise: t("A mark you'll still love in", "何年経っても愛せるロゴを"), metric: t("10 years", "10年") },
    { num: "05", label: t("AI tools", "AIツール"), promise: t("A custom workflow shipped in", "カスタムワークフローを"), metric: t("1 week", "1週間") },
    { num: "06", label: t("Retainer", "顧問契約"), promise: t("A team on standby in", "待機中のチームを"), metric: t("1 Slack", "1 Slack") },
  ]

  return (
    <section
      id="services"
      className="w-full border-t border-warm/20 bg-ink px-6 py-24 text-paper md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-warm">
          — {t("section 003 · services", "セクション003 · サービス")}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 flex flex-wrap items-end justify-between gap-8"
        >
          <h2 className="font-[family-name:var(--font-instrument)] text-[clamp(3rem,7vw,6.5rem)] font-normal leading-[0.9] tracking-[-0.02em]">
            {t("Six promises.", "6つの約束。")}
            <br />
            <span className="italic text-paper/40">
              {t("One handshake.", "一つの握手。")}
            </span>
          </h2>
          <p className="max-w-xs font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-paper/40">
            {t(
              "Each number below is a deadline, not a hope. Miss one, get the month free.",
              "下の数字は希望ではなく期限。遅延時は当月無料。"
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 border-t border-paper/10 md:grid-cols-2 lg:grid-cols-3">
          {promises.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="relative min-h-[260px] border-b border-paper/10 p-8 md:p-10 md:odd:border-r md:odd:border-paper/10 lg:odd:border-r-0 lg:[&:not(:nth-child(3n))]:border-r lg:[&:not(:nth-child(3n))]:border-paper/10"
            >
              <div className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/40">
                {s.num} / {s.label}
              </div>
              <div className="mb-6 text-lg leading-snug text-paper/80">{s.promise}</div>
              <div className="font-[family-name:var(--font-instrument)] text-[clamp(3rem,5vw,4.5rem)] italic leading-none tracking-[-0.02em] text-warm">
                {s.metric}
              </div>
              <div className="absolute bottom-5 right-6 font-mono text-[10px] tracking-[0.2em] text-warm/60">
                ↗ {t("read the terms", "条件を見る")}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
