"use client"

import { useEffect, useRef, useState } from "react"
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useScroll,
  useSpring,
  animate,
} from "framer-motion"
import Image from "next/image"
import { ArrowDown } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Enso } from "@/components/ui/enso"
import { SakuraPetals } from "@/components/ui/sakura-petals"

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
  {
    en: "Development",
    ja: "開発",
    descEn: "Next.js, React, TypeScript",
    descJa: "Next.js・React・TypeScript",
  },
  {
    en: "Marketing",
    ja: "マーケティング",
    descEn: "Growth, funnels, conversion",
    descJa: "グロース・ファネル・コンバージョン",
  },
  {
    en: "Social",
    ja: "SNS",
    descEn: "Content, scheduling, engagement",
    descJa: "コンテンツ・スケジューリング・エンゲージメント",
  },
  {
    en: "SEO",
    ja: "SEO",
    descEn: "Technical + content + AI search",
    descJa: "テクニカル・コンテンツ・AI検索",
  },
  {
    en: "Design",
    ja: "デザイン",
    descEn: "UI, UX, brand identity",
    descJa: "UI・UX・ブランドアイデンティティ",
  },
  {
    en: "AI Solutions",
    ja: "AI",
    descEn: "Workflows, custom tools, automation",
    descJa: "ワークフロー・ツール・自動化",
  },
] as const

function MagneticWrap({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 20 })
  const springY = useSpring(y, { stiffness: 200, damping: 20 })

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={(e) => {
        const rect = ref.current!.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        x.set((e.clientX - cx) * 0.25)
        y.set((e.clientY - cy) * 0.25)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

function ServiceCube() {
  const { language } = useLanguage()
  const [hoveredFace, setHoveredFace] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  const dragStateRef = useRef({
    startX: 0,
    startY: 0,
    startRotX: 0,
    startRotY: 0,
  })

  useEffect(() => {
    if (isDragging || hoveredFace) return

    const currentX = rotateX.get()
    const currentY = rotateY.get()

    const xControl = animate(rotateX, currentX + 360, {
      duration: 28,
      ease: "linear",
      repeat: Infinity,
    })
    const yControl = animate(rotateY, currentY + 360, {
      duration: 28,
      ease: "linear",
      repeat: Infinity,
    })

    return () => {
      xControl.stop()
      yControl.stop()
    }
  }, [isDragging, hoveredFace, rotateX, rotateY])

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

  const activeFace = CUBE_FACES.find((f) => f.en === hoveredFace)

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
    setHoveredFace(null)
    dragStateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startRotX: rotateX.get(),
      startRotY: rotateY.get(),
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const dx = e.clientX - dragStateRef.current.startX
    const dy = e.clientY - dragStateRef.current.startY
    rotateX.set(dragStateRef.current.startRotX - dy * 0.5)
    rotateY.set(dragStateRef.current.startRotY + dx * 0.5)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false)
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 500, height: 500, perspective: 1400 }}
      onMouseLeave={() => {
        if (!isDragging) setHoveredFace(null)
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(circle, oklch(0.74 0.15 55 / 0.3) 0%, transparent 70%)",
        }}
      />

      {/* Enso — sized to container */}
      <Enso size={500} className="absolute inset-0 pointer-events-none" />

      {/* Rotating + draggable cube */}
      <motion.div
        className={`relative touch-none select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
          rotateX,
          rotateY,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {CUBE_FACES.map((face, i) => {
          const isActive = hoveredFace === face.en
          return (
            <div
              key={face.en}
              onMouseEnter={() => {
                if (!isDragging) setHoveredFace(face.en)
              }}
              className={`absolute inset-0 flex items-center justify-center rounded-2xl border backdrop-blur-md transition-all duration-300 ${
                isActive
                  ? "border-warm bg-ink/60"
                  : "border-warm/40 bg-ink/40"
              }`}
              style={{
                transform: faceTransforms[i],
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                boxShadow: isActive
                  ? "inset 0 0 60px oklch(0.74 0.15 55 / 0.35), 0 0 80px oklch(0.74 0.15 55 / 0.3)"
                  : "inset 0 0 40px oklch(0.74 0.15 55 / 0.15), 0 0 60px oklch(0.74 0.15 55 / 0.1)",
              }}
            >
              <span
                className={`font-display font-semibold tracking-tight text-warm transition-all duration-300 pointer-events-none ${
                  isActive ? "text-2xl" : "text-xl"
                }`}
              >
                {language === "ja" ? face.ja : face.en}
              </span>
            </div>
          )
        })}
      </motion.div>

      {/* Hover description callout */}
      <AnimatePresence mode="wait">
        {activeFace && !isDragging && (
          <motion.div
            key={activeFace.en}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-5 py-2.5 rounded-full bg-ink/85 backdrop-blur-md border border-warm/50 text-warm text-sm font-medium shadow-[0_8px_32px_oklch(0.08_0.005_260_/_0.6)] pointer-events-none"
          >
            {language === "ja" ? activeFace.descJa : activeFace.descEn}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag hint */}
      {!isDragging && !hoveredFace && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-paper/40 font-mono tracking-wider uppercase pointer-events-none whitespace-nowrap">
          drag to rotate · hover to explore
        </div>
      )}
    </div>
  )
}

export function Hero() {
  const { t } = useLanguage()
  const [index, setIndex] = useState(0)
  const heroRef = useRef<HTMLElement>(null)

  // Slide timer
  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      SLIDE_DURATION_MS,
    )
    return () => window.clearInterval(id)
  }, [])

  // Mouse parallax (normalized -1 to 1)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2)
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener("mousemove", handler)
    return () => window.removeEventListener("mousemove", handler)
  }, [mouseX, mouseY])

  // Background counter-moves, cube follows
  const bgX = useTransform(mouseX, [-1, 1], [20, -20])
  const bgY = useTransform(mouseY, [-1, 1], [15, -15])
  const cubeX = useTransform(mouseX, [-1, 1], [-30, 30])
  const cubeY = useTransform(mouseY, [-1, 1], [-20, 20])
  const petalsX = useTransform(mouseX, [-1, 1], [-8, 8])
  const petalsY = useTransform(mouseY, [-1, 1], [-5, 5])

  // Scroll dissolve
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const heroContentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const heroBgY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"])
  const heroBgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const cubeScrollScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.5])
  const cubeScrollRotate = useTransform(scrollYProgress, [0, 1], [0, 30])

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-ink text-paper"
    >
      {/* Crossfading image stack — counter-parallax + scroll zoom */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{
            x: bgX,
            y: bgY,
            translateY: heroBgY,
            scale: heroBgScale,
          }}
        >
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
        </motion.div>

        {/* Dark overlay — stays fixed, not parallaxed */}
        <div
          className="absolute inset-0 bg-ink/60"
          style={{
            backgroundImage:
              "linear-gradient(180deg, oklch(0.08 0.005 260 / 0.85) 0%, oklch(0.08 0.005 260 / 0.65) 40%, oklch(0.08 0.005 260 / 0.92) 100%)",
          }}
        />

        {/* Warm amber cast */}
        <div
          className="absolute inset-0 mix-blend-multiply"
          style={{ backgroundColor: "oklch(0.74 0.15 55 / 0.25)" }}
        />
      </div>

      {/* Falling sakura petals — subtle mouse drift */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ x: petalsX, y: petalsY }}
      >
        <SakuraPetals />
      </motion.div>

      {/* Content — fades on scroll */}
      <motion.div
        className="relative z-10 flex min-h-screen w-full items-center"
        style={{ opacity: heroContentOpacity }}
      >
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
                <MagneticWrap>
                  <a
                    href="#work"
                    className="group inline-flex items-center gap-2 rounded-full bg-warm px-8 py-4 font-medium text-ink transition-all hover:bg-warm-hover"
                  >
                    <span>{t("See the work", "実績を見る")}</span>
                    <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                  </a>
                </MagneticWrap>
                <MagneticWrap>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-full border border-warm/40 px-8 py-4 font-medium text-paper transition-all hover:border-warm hover:text-warm"
                  >
                    {t("Book a call", "相談する")}
                  </a>
                </MagneticWrap>
              </motion.div>
            </div>

            {/* Right column: cube with mouse + scroll parallax */}
            <motion.div
              className="order-1 lg:order-2 flex items-center justify-center scale-50 sm:scale-75 lg:scale-100"
              style={{
                x: cubeX,
                y: cubeY,
                scale: cubeScrollScale,
                rotateZ: cubeScrollRotate,
              }}
            >
              <ServiceCube />
            </motion.div>

          </div>
        </div>
      </motion.div>

      {/* Slide indicator dots — fade on scroll */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2"
        style={{ opacity: heroContentOpacity }}
      >
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
      </motion.div>
    </section>
  )
}
