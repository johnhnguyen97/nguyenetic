"use client"

import { useTranslations } from "next-intl"

export function StaticReceipt() {
  const t = useTranslations("receipt")
  const lineItems = t.raw("items") as Array<{ desc: string; qty: string; price: string }>

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden p-10"
      style={{
        background: "radial-gradient(ellipse at 50% 60%, #1a1a2e 0%, #0A0A0A 75%)",
      }}
    >
      <div className="absolute right-[-40px] top-1/2 flex h-[340px] w-[220px] -translate-y-1/2 items-center justify-center rounded-sm border border-warm/10 font-[family-name:var(--font-instrument)] text-[140px] italic leading-none tracking-[-0.05em] text-warm/15">
        N
      </div>

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

      <div
        className="relative z-10 w-[340px] bg-paper px-7 pb-3 pt-8 font-mono text-[11px] leading-relaxed text-[#0A0A0A] shadow-[0_40px_80px_rgb(0_0_0_/_0.6),0_10px_24px_rgb(0_0_0_/_0.37)]"
        style={{ transform: "rotate(-2.5deg)" }}
      >
        <div className="mb-4 border-b border-dashed border-black/40 pb-4 text-center">
          <div className="font-[family-name:var(--font-instrument)] text-[28px] italic leading-none tracking-[-0.02em]">
            nguyenetic
          </div>
          <div className="mt-1.5 text-[9px] tracking-[0.3em] text-black/55">
            {t("studio")}
          </div>
        </div>

        <div className="mb-3 text-[9px] tracking-[0.2em] text-black/55">
          {t("invoice")}<br />
          {t("client")}
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
          <span>{t("total")}</span>
          <span>$7,000</span>
        </div>

        <div className="mt-3.5 text-center text-[9px] tracking-[0.2em] text-black/55">
          {t("terms")}<br />
          {t("shipped")}
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
            {t("paid")}
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
        ◇ {t("footer")}
      </div>
      <div className="absolute bottom-5 right-5 z-20 font-mono text-[10px] tracking-[0.2em] text-warm">
        — {t("signed")}
      </div>
    </div>
  )
}
