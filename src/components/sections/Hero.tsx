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

const CUBE_FACES = [
  { en: "Development", ja: "開発" },
  { en: "Marketing", ja: "マーケティング" },
  { en: "Social", ja: "SNS" },
  { en: "SEO", ja: "SEO" },
  { en: "Design", ja: "デザイン" },
  { en: "AI Solutions", ja: "AI" },
] as const

function ServiceCube() {
  const { language } = useLanguage()

  const size = 220
  const half = size / 2

  const faceTransforms = [
    `rotateY(0deg) translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(90deg) translateZ(${half}px)`,
    `rotateY(-90deg) translateZ(${half}px)`,
    `rotateX(90deg) translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`,
  ]

  return (
    <div
      className="relative scale-75 lg:scale-100"
      style={{
        width: size,
        height: size,
        perspective: 1400,
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
        }}
        transition={{
          duration: 28,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {CUBE_FACES.map((face, i) => (
          <div
            key={face.en}
            className="absolute inset-0 flex items-center justify-center rounded-2xl border border-warm/40 bg-ink/40 backdrop-blur-md"
            style={{
              transform: faceTransforms[i],
              boxShadow: "inset 0 0 40px oklch(0.74 0.15 55 / 0.15), 0 0 60px oklch(0.74 0.15 55 / 0.1)",
            }}
          >
            <span className="font-display text-xl font-semibold tracking-tight text-warm">
              {language === "ja" ? face.ja : face.en}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Ambient glow behind the cube */}
      <div
        className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle, oklch(0.74 0.15 55 / 0.3) 0%, transparent 70%)" }}
      />
    </div>
  )
}

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
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left column: text */}
            <div className="order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1
                  className="font-display font-semibold tracking-tight text-paper"
                  style={{ fontSize: "var(--text-hero)", lineHeight: 0.95 }}
                >
                  <span className="block">{t("Build.", "構築。")}</span>
                  <span className="block">{t("Launch.", "公開。")}</span>
                  <span className="block text-warm">{t("Grow.", "成長。")}</span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 max-w-xl text-lg text-paper/70 leading-relaxed"
              >
                {t(
                  "Full-stack web development, marketing, and social — one team, one invoice, measurable results.",
                  "フルスタック開発、マーケティング、SNS — 一つのチーム、一つの請求書、測定可能な成果。",
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

            {/* Right column: 3D rotating cube */}
            <div className="order-1 lg:order-2 flex items-center justify-center">
              <ServiceCube />
            </div>

          </div>
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
