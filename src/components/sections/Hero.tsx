"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ArrowDown } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const SLIDES = [
  "/images/hero/zen-01.jpg",
  "/images/hero/zen-02.jpg",
  "/images/hero/zen-03.jpg",
  "/images/hero/zen-04.jpg",
] as const

const SLIDE_DURATION_MS = 6000
const CROSSFADE_S = 1.5
const KEN_BURNS_S = 7.5

export function Hero() {
  const { t } = useLanguage()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      SLIDE_DURATION_MS,
    )
    return () => window.clearInterval(id)
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-ink text-paper"
    >
      {/* Crossfading image stack */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.08 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{
              opacity: { duration: CROSSFADE_S, ease: "easeInOut" },
              scale: { duration: KEN_BURNS_S, ease: "linear" },
            }}
            className="absolute inset-0"
          >
            <Image
              src={SLIDES[index]}
              alt=""
              fill
              priority={index === 0}
              fetchPriority={index === 0 ? "high" : "auto"}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0 bg-ink/60"
          style={{
            backgroundImage:
              "linear-gradient(180deg, oklch(0.08 0.005 260 / 0.85) 0%, oklch(0.08 0.005 260 / 0.65) 40%, oklch(0.08 0.005 260 / 0.92) 100%)",
          }}
        />

        {/* Warm amber cast to tie daylight photos to palette */}
        <div
          className="absolute inset-0 mix-blend-multiply"
          style={{ backgroundColor: "oklch(0.74 0.15 55 / 0.25)" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen w-full items-center">
        <div className="mx-auto w-full max-w-6xl px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1
              className="font-display font-semibold tracking-tight text-paper"
              style={{ fontSize: "var(--text-hero)", lineHeight: 0.95 }}
            >
              <span className="block">{t("I build AI that ships.", "動くAIを。")}</span>
              <span className="block text-warm">
                {t("For founders who move fast.", "加速する起業家へ。")}
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-2xl text-lg text-paper/70 leading-relaxed"
          >
            {t(
              "Nguyenetic — AI workflows, custom tools, and the occasional 3D experiment. Available for project work.",
              "Nguyenetic — AIワークフロー、カスタムツール、時々3D実験。プロジェクト受付中。",
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#work"
              className="group inline-flex items-center gap-2 rounded-full bg-warm px-8 py-4 font-medium text-ink transition-all hover:bg-warm-hover"
            >
              <span>{t("See the work", "実績を見る")}</span>
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-warm/40 px-8 py-4 font-medium text-paper transition-all hover:border-warm hover:text-warm"
            >
              {t("Book a call", "相談する")}
            </a>
          </motion.div>
        </div>
      </div>

      {/* Slide indicator dots */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show hero slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-8 bg-warm" : "w-1.5 bg-paper/30 hover:bg-paper/60"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
