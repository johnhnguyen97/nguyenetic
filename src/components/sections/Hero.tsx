"use client"

import { motion } from "framer-motion"
import { ZenCircuit } from "@/components/ui/zen-circuit"
import { Particles } from "@/components/ui/particles"
import { useLanguage } from "@/lib/language-context"

const springEase = [0.22, 1, 0.36, 1] as const

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3 + i * 0.15,
      duration: 0.8,
      ease: springEase,
    },
  }),
}

export function Hero() {
  const { t, language } = useLanguage()

  const orbitingPlanets = [
    { label: "Next.js", labelJa: "Next.js", angle: 0, distance: 48, size: "lg", color: "cyber", delay: 0 },
    { label: "React", labelJa: "React", angle: 50, distance: 52, size: "md", color: "sakura", delay: 0.3 },
    { label: "Web Apps", labelJa: "Webアプリ", angle: 95, distance: 46, size: "lg", color: "gold", delay: 0.6 },
    { label: "SEO", labelJa: "SEO対策", angle: 140, distance: 50, size: "sm", color: "cyber", delay: 0.9 },
    { label: "Marketing", labelJa: "マーケティング", angle: 180, distance: 54, size: "md", color: "sakura", delay: 1.2 },
    { label: "Design", labelJa: "デザイン", angle: 220, distance: 48, size: "lg", color: "gold", delay: 1.5 },
    { label: "Backend", labelJa: "バックエンド", angle: 265, distance: 52, size: "sm", color: "cyber", delay: 1.8 },
    { label: "AI/ML", labelJa: "AI/ML", angle: 310, distance: 46, size: "md", color: "sakura", delay: 2.1 },
  ]

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Particles background */}
      <Particles
        className="absolute inset-0"
        quantity={80}
        staticity={30}
        ease={80}
        color="#7c3aed"
        size={0.5}
      />

      {/* Gradient overlays */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent z-10" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10" />

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-accent-cyber/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-accent-sakura/10 rounded-full blur-[150px]" />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <div className="order-2 lg:order-1">
            {/* Japanese label */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-12 h-px bg-gradient-to-r from-accent-cyber to-transparent" />
              <span className="text-xs tracking-[0.3em] text-accent-cyber font-mono uppercase">
                {t("Tech & Aesthetics", "技術と美学")}
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              custom={0}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold tracking-tight leading-[1.1] mb-6"
            >
              <span className="block">{t("Build. Launch.", "構築。公開。")}</span>
              <span className="block text-gradient-cyber">{t("Dominate.", "支配。")}</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              custom={1}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg"
            >
              {t(
                "Enterprise-grade web development, strategic SEO, and AI-powered solutions. Building elegant digital experiences that drive measurable results.",
                "エンタープライズグレードのウェブ開発、戦略的SEO、AI搭載ソリューション。測定可能な成果を生み出す洗練されたデジタル体験を構築します。"
              )}
            </motion.p>

            {/* Stats row */}
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="flex gap-8 mb-10"
            >
              <div>
                <div className="text-3xl font-bold text-accent-cyber">50+</div>
                <div className="text-sm text-muted-foreground">{t("Projects", "プロジェクト")}</div>
              </div>
              <div className="w-px bg-border" />
              <div>
                <div className="text-3xl font-bold text-accent-sakura">5+</div>
                <div className="text-sm text-muted-foreground">{t("Years Exp.", "年の経験")}</div>
              </div>
              <div className="w-px bg-border" />
              <div>
                <div className="text-3xl font-bold text-accent-gold">100%</div>
                <div className="text-sm text-muted-foreground">{t("Satisfaction", "満足度")}</div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="flex flex-wrap items-center gap-4"
            >
              <a
                href="#work"
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-medium transition-all hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10">{t("View Projects", "実績を見る")}</span>
                <svg
                  className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-accent-cyber to-accent-sakura opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-4 border border-border rounded-full font-medium text-muted-foreground hover:text-foreground hover:border-accent-cyber/50 transition-all"
              >
                {t("Get in Touch", "お問い合わせ")}
              </a>
            </motion.div>

            {/* Trusted by line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-12 pt-8 border-t border-border/30"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                {t("Full-Stack Solutions", "フルスタックソリューション")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t(
                  "From concept to deployment — web apps, marketing, and everything in between.",
                  "コンセプトから展開まで — Webアプリ、マーケティング、すべてをカバー。"
                )}
              </p>
            </motion.div>
          </div>

          {/* Right: Illustration with orbiting services */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: springEase }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Glow effect behind illustration */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-cyber/20 via-transparent to-accent-sakura/20 rounded-full blur-3xl" />

              {/* Main illustration */}
              <ZenCircuit className="relative z-10 w-full h-full" />

              {/* Orbiting tech planets */}
              {orbitingPlanets.map((planet, i) => {
                const radians = (planet.angle * Math.PI) / 180
                const x = 50 + planet.distance * Math.cos(radians)
                const y = 50 + planet.distance * Math.sin(radians)

                const colorClasses = {
                  cyber: "from-accent-cyber/40 to-accent-cyber/10 border-accent-cyber/30 shadow-accent-cyber/20",
                  sakura: "from-accent-sakura/40 to-accent-sakura/10 border-accent-sakura/30 shadow-accent-sakura/20",
                  gold: "from-accent-gold/40 to-accent-gold/10 border-accent-gold/30 shadow-accent-gold/20",
                }

                return (
                  <motion.div
                    key={planet.label}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + planet.delay * 0.2, duration: 0.6, ease: springEase }}
                    className="absolute z-20"
                    style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                  >
                    <motion.div
                      animate={{
                        y: [0, -6 - i * 2, 0],
                        x: [0, i % 2 === 0 ? 5 : -5, 0],
                        rotate: [0, i % 2 === 0 ? 3 : -3, 0],
                      }}
                      transition={{
                        duration: 4 + i * 0.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.3,
                      }}
                      className={`
                        ${planet.size === "sm" ? "w-12 h-12" : planet.size === "md" ? "w-16 h-16" : "w-20 h-20"}
                        rounded-full bg-gradient-to-br ${colorClasses[planet.color as keyof typeof colorClasses]}
                        backdrop-blur-md border shadow-lg
                        flex items-center justify-center
                        hover:scale-110 transition-transform cursor-default
                        group
                      `}
                    >
                      <span className={`font-medium text-foreground/90 ${planet.size === "sm" ? "text-[9px]" : "text-[11px]"}`}>
                        {language === "ja" ? planet.labelJa : planet.label}
                      </span>
                      {/* Inner glow */}
                      <div className="absolute inset-2 rounded-full bg-white/5" />
                      {/* Highlight */}
                      <div className="absolute top-1 left-1/4 w-1/3 h-1/4 rounded-full bg-white/20 blur-sm" />
                    </motion.div>
                  </motion.div>
                )
              })}

              {/* Floating decorative elements */}
              <motion.div
                animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-2 right-8 w-16 h-16 bg-gradient-to-br from-accent-cyber/30 to-transparent rounded-2xl border border-accent-cyber/20 backdrop-blur-sm z-0"
              />
              <motion.div
                animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-8 -left-2 w-14 h-14 bg-gradient-to-br from-accent-sakura/30 to-transparent rounded-2xl border border-accent-sakura/20 backdrop-blur-sm z-0"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground tracking-wider">{t("Scroll", "スクロール")}</span>
          <div className="w-6 h-10 border border-border/50 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 bg-accent-cyber rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
