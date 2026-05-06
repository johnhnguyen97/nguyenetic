"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

type WorkItem = {
  n: string
  href: "/work/auto-quote" | "/work/reservation" | "/work/seo-audit" | "/work/waste-ledger" | "/work/review-reply" | "/work/call-rescue" | "/work/estimate-translate"
}

const WORK_ITEMS: WorkItem[] = [
  { n: "01", href: "/work/waste-ledger" },
  { n: "02", href: "/work/call-rescue" },
  { n: "03", href: "/work/review-reply" },
  { n: "04", href: "/work/auto-quote" },
  { n: "05", href: "/work/reservation" },
  { n: "06", href: "/work/seo-audit" },
  { n: "07", href: "/work/estimate-translate" },
]

export function Work() {
  const t = useTranslations("work")
  const items = t.raw("items") as Array<{ name: string; stat: string; tag: string }>
  const featured = { ...WORK_ITEMS[0], ...items[0] }
  const sideItems = [
    { ...WORK_ITEMS[1], ...items[1] },
    { ...WORK_ITEMS[5], ...items[5] },
  ]
  const rowItems = [
    { ...WORK_ITEMS[2], ...items[2] },
    { ...WORK_ITEMS[3], ...items[3] },
    { ...WORK_ITEMS[4], ...items[4] },
    { ...WORK_ITEMS[6], ...items[6] },
  ]

  return (
    <section id="work" className="w-full bg-paper px-6 py-24 text-[#0A0A0A] md:px-10 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 flex flex-wrap items-start justify-between gap-6"
        >
          <div>
            <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-black/50">
              — {t("section")}
            </div>
            <h2 className="font-[family-name:var(--font-instrument)] text-[clamp(3rem,7vw,6.75rem)] font-normal leading-[0.88] tracking-[-0.02em]">
              {t("titleA")}
              <br />
              <span className="italic">{t("titleB")}</span>
              <br />
              <span className="text-warm">{t("titleC")}</span>
            </h2>
          </div>
          <div className="text-right font-mono text-[11px] tracking-[0.2em] text-black/50">
            <div className="font-[family-name:var(--font-instrument)] text-[72px] italic leading-none tracking-[-0.02em] text-[#0A0A0A]">
              07
            </div>
            <div className="mt-2 uppercase">{t("liveShipping")}</div>
          </div>
        </motion.div>

        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Link
            href={featured.href}
            className="group relative flex min-h-[380px] flex-col justify-between overflow-hidden rounded-3xl bg-[#0A0A0A] p-8 text-paper transition-all hover:ring-2 hover:ring-warm focus:outline-none focus-visible:ring-2 focus-visible:ring-warm md:p-12"
          >
            <svg
              aria-hidden
              width="100%"
              height="140"
              viewBox="0 0 600 140"
              className="absolute right-[-80px] top-10 opacity-30"
            >
              {[40, 65, 50, 85, 70, 95, 82].map((h, i) => (
                <rect
                  key={i}
                  x={i * 78}
                  y={140 - h}
                  width="56"
                  height={h}
                  fill="var(--color-warm)"
                  opacity={0.4 + i * 0.08}
                />
              ))}
            </svg>

            <div className="relative">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-warm">
                {t("featured")}
              </div>
              <h3 className="mt-5 font-[family-name:var(--font-instrument)] text-[clamp(2.75rem,5vw,4.75rem)] font-normal leading-[0.95] tracking-[-0.02em]">
                {featured.name}.
              </h3>
              <p className="mt-5 max-w-md text-base leading-relaxed text-paper/70">
                {t("description")}
              </p>
            </div>

            <div className="relative flex flex-wrap items-end gap-11">
              <div>
                <div className="font-[family-name:var(--font-instrument)] text-[clamp(2.5rem,4vw,4rem)] italic leading-none text-warm">
                  −34%
                </div>
                <div className="mt-2 font-mono text-[10px] tracking-[0.22em] text-paper/40">
                  {t("wasteLabel")}
                </div>
              </div>
              <div>
                <div className="font-[family-name:var(--font-instrument)] text-[clamp(2.5rem,4vw,4rem)] italic leading-none text-paper">
                  $1.6k
                </div>
                <div className="mt-2 font-mono text-[10px] tracking-[0.22em] text-paper/40">
                  {t("savedLabel")}
                </div>
              </div>
              <div className="ml-auto font-mono text-[11px] tracking-[0.18em] text-warm transition-transform group-hover:translate-x-1">
                {t("tryIt")}
              </div>
            </div>
          </Link>

          <div className="grid grid-rows-2 gap-4">
            {sideItems.map((w) => (
              <Link
                key={w.n}
                href={w.href}
                className="group flex flex-col justify-between rounded-2xl border border-black/10 bg-white p-7 transition-all hover:border-warm hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-warm"
              >
                <div>
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-black/50">
                    #{w.n} · {w.tag}
                  </div>
                  <h4 className="font-[family-name:var(--font-instrument)] text-[clamp(2rem,3.5vw,2.5rem)] font-normal leading-none tracking-[-0.02em]">
                    {w.name}
                  </h4>
                </div>
                <div className="flex items-end justify-between">
                  <div className="font-[family-name:var(--font-instrument)] text-[clamp(2rem,3vw,2.625rem)] italic leading-none tracking-[-0.02em] text-warm">
                    {w.stat}
                  </div>
                  <div className="font-mono text-xs text-[#0A0A0A] transition-transform group-hover:translate-x-1">↗</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rowItems.map((w) => (
            <Link
              key={w.n}
              href={w.href}
              className="group flex min-h-[150px] flex-col justify-between rounded-2xl border border-black/10 bg-white p-6 transition-all hover:border-warm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-warm"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-black/50">
                #{w.n} · {w.tag}
              </div>
              <div>
                <h4 className="mb-1.5 font-[family-name:var(--font-instrument)] text-[clamp(1.5rem,2.5vw,1.875rem)] font-normal leading-tight tracking-[-0.01em]">
                  {w.name}
                </h4>
                <div className="font-mono text-[13px] text-warm">{w.stat}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
