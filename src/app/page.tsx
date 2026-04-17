"use client"

import { motion, AnimatePresence, useInView, useMotionValue, animate } from "framer-motion"
import { useEffect, useRef, useState, useCallback } from "react"
import { Header } from "@/components/layout/Header"
import { Hero } from "@/components/sections/Hero"
import { Work } from "@/components/sections/Work"
import { Services } from "@/components/sections/Services"
import { Playground } from "@/components/sections/Playground"
import { ChatbotDemo } from "@/components/ui/chatbot-demo"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { CursorGlow } from "@/components/ui/cursor-glow"
import { InkBrushUnderline } from "@/components/ui/ink-brush"
import { useLanguage } from "@/lib/language-context"

const springEase = [0.22, 1, 0.36, 1] as const

// Animated counter for numeric stats
function AnimatedStat({
  target,
  suffix,
  label,
}: {
  target: number
  suffix: string
  label: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const motionVal = useMotionValue(0)
  const [display, setDisplay] = useState("0")

  useEffect(() => {
    if (!inView) return
    const controls = animate(motionVal, target, {
      duration: 1.2,
      ease: "easeOut",
    })
    const unsubscribe = motionVal.on("change", (v) => {
      setDisplay(Math.round(v).toString())
    })
    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [inView, motionVal, target])

  return (
    <div
      ref={ref}
      className="p-6 rounded-2xl border border-border bg-background hover:border-warm/50 transition-colors"
    >
      <div className="text-3xl font-bold text-warm mb-2">
        {display}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

// Email compose mini-preview
function EmailPreview({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.22, ease: springEase }}
          className="mt-3 p-4 rounded-xl bg-ink/40 backdrop-blur-md border border-warm/20 text-left text-sm pointer-events-none"
        >
          <div className="flex items-center gap-2 mb-2 text-paper/50 text-xs font-mono">
            <span className="text-warm/60">To:</span>
            <span className="text-paper/80">hello@nguyenetic.com</span>
          </div>
          <div className="flex items-center gap-2 mb-3 text-paper/50 text-xs font-mono border-b border-warm/10 pb-2">
            <span className="text-warm/60">Subject:</span>
            <span className="text-paper/60 italic">Project inquiry</span>
          </div>
          <p className="text-paper/40 text-xs italic">Hi John, I&apos;d like to talk about…</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Home() {
  const { t } = useLanguage()

  // Footer easter egg state
  const [easterEggActive, setEasterEggActive] = useState(false)
  const clickCountRef = useRef(0)
  const lastClickTimeRef = useRef(0)

  const handleFooterClick = useCallback(() => {
    const now = Date.now()
    if (now - lastClickTimeRef.current > 3000) {
      clickCountRef.current = 0
    }
    lastClickTimeRef.current = now
    clickCountRef.current += 1

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0
      setEasterEggActive(true)
      setTimeout(() => setEasterEggActive(false), 2000)
    }
  }, [])

  // Contact email hover state
  const [emailHovered, setEmailHovered] = useState(false)

  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Header />

      {/* Easter egg shimmer overlay */}
      <AnimatePresence>
        {easterEggActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 pointer-events-none z-[9999]"
            style={{
              background:
                "linear-gradient(135deg, #ff8a3d22 0%, #08061844 35%, #f5f0eb11 65%, #ff8a3d22 100%)",
              animation: "shimmer-cycle 2s ease-in-out",
            }}
          />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shimmer-cycle {
          0%   { opacity: 0; filter: hue-rotate(0deg); }
          25%  { opacity: 1; filter: hue-rotate(30deg); }
          50%  { opacity: 0.6; filter: hue-rotate(60deg); }
          75%  { opacity: 1; filter: hue-rotate(20deg); }
          100% { opacity: 0; filter: hue-rotate(0deg); }
        }
      `}</style>

      <main>
        <Hero />
        <Services />
        <Work />
        <Playground />

        {/* About Section */}
        <section id="about" className="py-32 px-6 bg-card/50">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-sm tracking-[0.3em] text-warm mb-4 font-mono">
                  {t("About Me", "私について")}
                </p>
                <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-bold mb-2">
                  {t("Enterprise-Grade Solutions, Startup Speed", "エンタープライズ品質、スタートアップの速度")}
                </h2>
                <InkBrushUnderline className="w-48 h-3 mb-6" />
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    {t(
                      "With experience building SaaS platforms, real-time dashboards, and AI-powered applications, I bring full-stack expertise to projects of all sizes.",
                      "SaaSプラットフォーム、リアルタイムダッシュボード、AI搭載アプリケーションの構築経験を持ち、あらゆる規模のプロジェクトにフルスタックの専門知識を提供します。"
                    )}
                  </p>
                  <p>
                    {t(
                      "From concept to deployment, I deliver complete digital solutions backed by strategic SEO, Google Ads, and comprehensive digital marketing to drive measurable results.",
                      "コンセプトから展開まで、戦略的SEO、Google広告、包括的なデジタルマーケティングに裏打ちされた完全なデジタルソリューションを提供し、測定可能な成果を実現します。"
                    )}
                  </p>
                </div>

                {/* Tech Stack */}
                <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
                    {t("Tech Stack", "技術スタック")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Next.js", "React", "TypeScript", "Node.js", "Supabase", "Sanity", "Tailwind", "Vercel"].map((tech) => (
                      <span key={tech} className="text-xs px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground border border-border">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats — count-up on scroll into view */}
              <div className="grid grid-cols-2 gap-4">
                <AnimatedStat
                  target={50}
                  suffix="+"
                  label={t("Projects Delivered", "納品プロジェクト")}
                />
                <AnimatedStat
                  target={100}
                  suffix="%"
                  label={t("Client Satisfaction", "顧客満足度")}
                />
                <AnimatedStat
                  target={5}
                  suffix="+"
                  label={t("Years Experience", "年の経験")}
                />
                {/* 24/7 stays static */}
                <div className="p-6 rounded-2xl border border-border bg-background hover:border-warm/50 transition-colors">
                  <div className="text-3xl font-bold text-foreground mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">{t("Support Available", "サポート対応")}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto text-center"
          >
            <p className="text-sm tracking-[0.3em] text-warm mb-4 font-mono">
              {t("Contact", "お問い合わせ")}
            </p>
            <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-bold mb-2">
              {t("Let's Build Something Together", "一緒に何かを作りましょう")}
            </h2>
            <InkBrushUnderline className="w-48 h-3 mx-auto mb-6" />
            <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
              {t(
                "Ready to elevate your digital presence? Whether you need a new website, want to improve your SEO, or launch a marketing campaign — I'm here to help.",
                "デジタルプレゼンスを向上させる準備はできていますか？新しいウェブサイトが必要な場合、SEOを改善したい場合、マーケティングキャンペーンを開始したい場合 — お手伝いします。"
              )}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:hello@nguyenetic.com"
                className="inline-flex items-center gap-2 px-8 py-4 bg-warm text-ink rounded-full font-medium hover:bg-warm-hover transition-colors"
              >
                {t("Start a Project", "プロジェクトを始める")}
              </a>
              <a
                href="https://calendly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 border border-warm/40 rounded-full font-medium hover:border-warm hover:text-warm transition-colors"
              >
                {t("Schedule a Call", "通話を予約")}
              </a>
            </div>

            <div className="mt-16 pt-16 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">{t("Or reach out directly", "または直接お問い合わせください")}</p>

              {/* Interactive email with compose preview */}
              <div className="inline-block relative">
                <a
                  href="mailto:hello@nguyenetic.com"
                  onMouseEnter={() => setEmailHovered(true)}
                  onMouseLeave={() => setEmailHovered(false)}
                  onFocus={() => setEmailHovered(true)}
                  onBlur={() => setEmailHovered(false)}
                  className="text-xl font-medium hover:text-warm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-warm rounded"
                >
                  hello@nguyenetic.com
                </a>
                <EmailPreview visible={emailHovered} />
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* AI Chatbot Demo */}
      <ChatbotDemo />

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()}{" "}
            <button
              onClick={handleFooterClick}
              className="font-medium text-muted-foreground hover:text-paper transition-colors cursor-default select-none focus:outline-none"
              aria-label="Nguyenetic"
            >
              Nguyenetic
            </button>
            . {t("All rights reserved.", "全著作権所有。")}
          </p>
          <p className="text-sm text-muted-foreground font-mono">
            {t("Fusion of Tech & Aesthetics", "技術と美学の融合")}
          </p>
        </div>
      </footer>
    </>
  )
}
