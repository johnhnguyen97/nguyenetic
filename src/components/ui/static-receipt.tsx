"use client"

import { useLanguage } from "@/lib/language-context"

export function StaticReceipt() {
  const { t } = useLanguage()

  const lineItems = [
    { desc: t("Discovery call", "要件定義コール"), qty: "1", price: "$0" },
    { desc: t("Wireframes + copy", "ワイヤー+コピー"), qty: "3", price: "$800" },
    { desc: t("Design system", "デザインシステム"), qty: "1", price: "$1,200" },
    { desc: t("Build + integration", "実装+連携"), qty: "14d", price: "$4,400" },
    { desc: t("SEO + analytics", "SEO+解析"), qty: "1", price: "$600" },
    { desc: t("30-day support", "30日サポート"), qty: "30d", price: t("incl.", "込み") },
  ]

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden p-10"
      style={{
        background: "radial-gradient(ellipse at 50% 60%, #1a1a2e 0%, #0A0A0A 75%)",
      }}
    >
      {/* faint outer N paper */}
      <div className="absolute right-[-40px] top-1/2 flex h-[340px] w-[220px] -translate-y-1/2 items-center justify-center rounded-sm border border-warm/10 font-[family-name:var(--font-instrument)] text-[140px] italic leading-none tracking-[-0.05em] text-warm/15">
        N
      </div>

      {/* paper slip behind receipt */}
      <div
        aria-hidden
        className="absolute h-[320px] w-[260px] rounded-sm bg-paper/80 shadow-[0_20px_40px_rgb(0_0_0_/_0.38)]"
        style={{
          left: "35%",
          top: "60%",
          transform: "translate(-50%, -50%) rotate(8deg)",
          opacity: 0.55,
        }}
      />

      {/* the receipt */}
      <div
        className="relative z-10 w-[340px] bg-paper px-7 pb-3 pt-8 font-mono text-[11px] leading-relaxed text-[#0A0A0A] shadow-[0_40px_80px_rgb(0_0_0_/_0.6),0_10px_24px_rgb(0_0_0_/_0.37)]"
        style={{ transform: "rotate(-2.5deg)" }}
      >
        <div className="mb-4 border-b border-dashed border-black/40 pb-4 text-center">
          <div className="font-[family-name:var(--font-instrument)] text-[28px] italic leading-none tracking-[-0.02em]">
            nguyenetic
          </div>
          <div className="mt-1.5 text-[9px] tracking-[0.3em] text-black/55">
            {t("A STUDIO IN ORBIT", "軌道を描くスタジオ")}
          </div>
        </div>

        <div className="mb-3 text-[9px] tracking-[0.2em] text-black/55">
          {t("INVOICE №07 · 2026-03-14", "請求書 №07 · 2026-03-14")}<br />
          {t("CLIENT: WASTE LEDGER CO.", "顧客: 廃棄記録社")}
        </div>

        <div className="mb-3 border-b border-t border-dashed border-black/25 py-2.5">
          {lineItems.map((l, i) => (
            <div key={i} className="grid grid-cols-[1fr_40px_70px] gap-1 text-[11px]">
              <span>{l.desc}</span>
              <span className="text-right text-black/55">{l.qty}</span>
              <span className="text-right">{l.price}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-sm font-semibold">
          <span>{t("TOTAL", "合計")}</span>
          <span>$7,000</span>
        </div>

        <div className="mt-3.5 text-center text-[9px] tracking-[0.2em] text-black/55">
          {t("— FIXED PRICE · FIXED SHIP DATE —", "— 固定価格 · 確定納期 —")}<br />
          {t("SHIPPED 14 DAYS · ON TIME", "14日で納品・期日通り")}
        </div>

        <div
          className="absolute flex h-24 w-24 flex-col items-center justify-center rounded-full border-[3px] border-warm bg-warm/15 text-warm opacity-95"
          style={{ right: -10, bottom: 48, transform: "rotate(14deg)" }}
          aria-hidden
        >
          <div className="font-[family-name:var(--font-instrument)] text-[32px] italic leading-none">
            N
          </div>
          <div className="mt-0.5 font-mono text-[7px] tracking-[0.25em]">
            {t("PAID · 07", "支払済 · 07")}
          </div>
        </div>

        <div
          aria-hidden
          className="absolute -bottom-2.5 left-0 right-0 h-3"
          style={{
            background:
              "repeating-linear-gradient(90deg, var(--color-paper) 0, var(--color-paper) 8px, transparent 8px, transparent 14px)",
          }}
        />
      </div>

      <div className="absolute left-5 top-5 z-20 font-mono text-[10px] tracking-[0.3em] text-paper/40">
        ◇ {t("receipt · invoice №07 · stamped", "領収書 · 請求 №07 · 押印済")}
      </div>
      <div className="absolute bottom-5 right-5 z-20 font-mono text-[10px] tracking-[0.2em] text-warm">
        — {t("signed, nguyenetic", "nguyenetic 署名")}
      </div>
    </div>
  )
}
