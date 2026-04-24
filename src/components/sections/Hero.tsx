"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"
import Link from "next/link"
import { OrbitN } from "@/components/ui/orbit-n"
import { useLanguage } from "@/lib/language-context"

type Product = {
  name: string
  nameJa: string
  short: string
  angle: number
  radius: number
  tag: string
  tagJa: string
  href: string
}

const FIELD_PRODUCTS: Product[] = [
  { name: "Auto-Quote", nameJa: "自動見積", short: "AQ", angle: 8, radius: 310, tag: "auto", tagJa: "整備", href: "/work/auto-quote" },
  { name: "Reservation", nameJa: "予約管理", short: "RG", angle: 56, radius: 340, tag: "restaurants", tagJa: "飲食", href: "/work/reservation" },
  { name: "SEO Scorecard", nameJa: "SEO診断", short: "SS", angle: 110, radius: 300, tag: "local", tagJa: "地域", href: "/work/seo-audit" },
  { name: "Waste Ledger", nameJa: "廃棄記録", short: "WL", angle: 162, radius: 355, tag: "kitchen", tagJa: "厨房", href: "/work/waste-ledger" },
  { name: "Review Reply", nameJa: "レビュー返信", short: "RR", angle: 212, radius: 295, tag: "owners", tagJa: "オーナー", href: "/work/review-reply" },
  { name: "Call Rescue", nameJa: "電話救援", short: "CR", angle: 262, radius: 340, tag: "phones", tagJa: "電話", href: "/work/call-rescue" },
  { name: "Estimate Tx", nameJa: "見積翻訳", short: "ET", angle: 316, radius: 320, tag: "service bays", tagJa: "整備場", href: "/work/estimate-translate" },
]

export function Hero() {
  const { t, language } = useLanguage()
  const reduceMotion = useReducedMotion()
  const [time, setTime] = useState(0)

  useEffect(() => {
    if (reduceMotion) return
    let raf = 0
    const loop = (ts: number) => {
      setTime(ts / 1000)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduceMotion])

  const centerX = 720
  const centerY = 480

  // Pre-compute tick marks at fixed precision to avoid SSR/CSR float mismatch.
  const ticks = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2
    return {
      x1: (centerX + Math.cos(a) * 186).toFixed(2),
      y1: (centerY + Math.sin(a) * 186).toFixed(2),
      x2: (centerX + Math.cos(a) * 196).toFixed(2),
      y2: (centerY + Math.sin(a) * 196).toFixed(2),
    }
  })

  return (
    <section
      id="top"
      className="relative w-full min-h-screen overflow-hidden bg-ink text-paper font-[family-name:var(--font-inter)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-16 h-[840px] w-[840px] -translate-x-1/2 rounded-full opacity-60 blur-[80px] lg:left-auto lg:right-[-160px] lg:translate-x-0"
        style={{ background: "radial-gradient(circle, color-mix(in oklch, var(--color-warm) 28%, transparent) 0%, transparent 65%)" }}
      />

      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
      >
        <defs>
          <pattern id="orbit-grid" width="72" height="72" patternUnits="userSpaceOnUse">
            <path d="M 72 0 L 0 0 0 72" fill="none" stroke="var(--color-paper)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#orbit-grid)" />
      </svg>

      <svg
        aria-hidden
        viewBox="0 0 1440 980"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
      >
        {[200, 260, 320, 380].map((r, i) => (
          <circle
            key={r}
            cx={centerX}
            cy={centerY}
            r={r}
            fill="none"
            stroke="var(--color-warm)"
            strokeWidth="0.5"
            strokeDasharray={i % 2 ? "4 10" : "none"}
            opacity={0.22 - i * 0.03}
          />
        ))}
        {ticks.map((tick, i) => (
          <line key={i} {...tick} stroke="var(--color-warm)" strokeWidth="1" opacity="0.35" />
        ))}
      </svg>

      <div className="relative z-10 mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-6 pb-24 pt-32 md:px-10 lg:grid-cols-[minmax(0,1fr)_1fr] lg:pb-32 lg:pt-28">
        <div className="max-w-xl lg:pt-14">
          <div className="mb-8 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-warm">
            <span
              className="inline-block h-2 w-2 rounded-full bg-warm"
              style={{ boxShadow: "0 0 12px var(--color-warm)" }}
              aria-hidden
            />
            {t("◇ 07 satellites live · 01 operator", "◇ 07衛星稼働中 · 01オペレーター")}
          </div>

          <h1 className="font-[family-name:var(--font-instrument)] text-[clamp(4rem,9vw,8rem)] font-normal leading-[0.9] tracking-[-0.03em]">
            {t("A studio", "軌道に")}
            <br />
            <span className="italic text-warm">{t("in orbit", "浮かぶ")}</span>
            <br />
            {t("around", "あなたの")}
            <br />
            <u className="decoration-warm decoration-4 underline-offset-[14px]">
              {t("you.", "ためのスタジオ")}
            </u>
          </h1>

          <p className="mt-10 max-w-md text-[17px] leading-relaxed text-paper/70">
            {t(
              "Managed websites, design, and digital ops for small service businesses. Seven shipped products. One human at the core. Each orbit is a problem someone wrote a check to solve.",
              "小規模サービス事業者向けのウェブ・デザイン・デジタル運用。7つの製品、1人のオペレーター。軌道はそれぞれ、誰かがお金を払って解決した問題です。"
            )}
          </p>

          <div className="mt-11 flex flex-wrap items-center gap-4">
            <Link
              href="#work"
              className="inline-flex items-center gap-2.5 rounded-full bg-warm px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-warm-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-warm focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              {t("see the receipts", "実績を見る")}
              <span className="text-sm" aria-hidden>→</span>
            </Link>
            <Link
              href="#services"
              className="border-b border-paper/30 py-4 font-mono text-xs uppercase tracking-[0.2em] text-paper transition-colors hover:border-warm hover:text-warm focus:outline-none focus-visible:ring-2 focus-visible:ring-warm"
            >
              {t("what I do", "サービス")}
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-7 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/50">
            <span>{t("14-day turnaround", "14日納品")}</span>
            <span className="h-1 w-1 rounded-full bg-warm" aria-hidden />
            <span>{t("fixed price", "固定価格")}</span>
            <span className="h-1 w-1 rounded-full bg-warm" aria-hidden />
            <span>{t("receipts on everything", "全てに領収書")}</span>
          </div>
        </div>

        <div className="relative hidden h-[760px] lg:block">
          <div
            className="absolute left-1/2 top-1/2 text-center"
            style={{
              transform: reduceMotion
                ? "translate(-50%, -50%)"
                : `translate(-50%, -50%) rotate(${Math.sin(time * 0.3) * 1.5}deg)`,
              transition: "transform 0.1s",
            }}
          >
            <OrbitN size={180} showLabel={false} />
            <div className="-mt-2 font-mono text-[10px] tracking-[0.3em] text-warm">
              — {t("core", "核")} —
            </div>
          </div>

          {FIELD_PRODUCTS.map((p, i) => {
            const baseAngle = (p.angle * Math.PI) / 180
            const angle = reduceMotion ? baseAngle : baseAngle + time * 0.06 + i * 0.005
            const x = Math.cos(angle) * p.radius
            const y = Math.sin(angle) * p.radius * 0.7

            return (
              <Link
                key={p.name}
                href={p.href}
                aria-label={`${language === "ja" ? p.nameJa : p.name} — ${language === "ja" ? p.tagJa : p.tag}`}
                className="group absolute left-1/2 top-1/2 min-w-[140px] rounded-xl border border-warm/40 bg-ink/50 px-4 py-3 text-center font-mono text-[10px] tracking-[0.1em] backdrop-blur-md transition-colors hover:border-warm focus:outline-none focus-visible:ring-2 focus-visible:ring-warm"
                style={{
                  transform: `translate(calc(-50% + ${x.toFixed(2)}px), calc(-50% + ${y.toFixed(2)}px))`,
                  boxShadow: "0 8px 24px rgb(0 0 0 / 0.25)",
                }}
              >
                <div className="mb-1 text-[9px] tracking-[0.25em] text-warm">{p.short}</div>
                <div className="text-[12px] tracking-[0.05em] text-paper">
                  {language === "ja" ? p.nameJa : p.name}
                </div>
                <div className="mt-0.5 text-[9px] tracking-[0.2em] text-paper/40">
                  {language === "ja" ? p.tagJa : p.tag}
                </div>
              </Link>
            )
          })}
        </div>

        <div className="grid grid-cols-2 gap-3 lg:hidden">
          <div className="col-span-2 mb-2 flex items-center justify-center gap-3 py-6">
            <OrbitN size={72} showLabel={false} />
            <span className="font-mono text-[10px] tracking-[0.3em] text-warm">
              — {t("core", "核")} —
            </span>
          </div>
          {FIELD_PRODUCTS.map((p) => (
            <Link
              key={p.name}
              href={p.href}
              className="group rounded-xl border border-warm/40 bg-ink/50 p-3 font-mono backdrop-blur-md transition-colors hover:border-warm focus:outline-none focus-visible:ring-2 focus-visible:ring-warm"
            >
              <div className="text-[9px] tracking-[0.25em] text-warm">{p.short}</div>
              <div className="mt-1 text-[13px] tracking-[0.05em] text-paper">
                {language === "ja" ? p.nameJa : p.name}
              </div>
              <div className="mt-0.5 text-[9px] tracking-[0.2em] text-paper/40">
                {language === "ja" ? p.tagJa : p.tag}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6 mx-auto flex max-w-[1440px] flex-wrap justify-between gap-3 border-t border-warm/20 pt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/50 md:left-10 md:right-10">
        <span>{t("lat 37.7749° N · lon 122.4194° W", "北緯 37.77° · 西経 122.42°")}</span>
        <span className="text-warm">● {t("field stable · signal strong", "軌道安定・信号強力")}</span>
        <span className="hidden sm:inline">{t("scroll ↓ to enter gravity", "スクロール↓で重力圏へ")}</span>
      </div>
    </section>
  )
}
