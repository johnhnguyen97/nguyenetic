"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

const springEase = [0.22, 1, 0.36, 1] as const

const projects = [
  {
    id: "moxie",
    title: "GoJUN",
    descEN: "AI-powered Japanese learning SaaS with real-time flashcards, spaced repetition, and adaptive vocabulary engine.",
    descJA: "リアルタイムフラッシュカード、間隔反復、適応型語彙エンジンを備えたAI搭載日本語学習SaaS。",
    stack: ["Next.js", "React", "TypeScript", "Supabase"],
    image: "https://picsum.photos/seed/moxie/800/600",
    featured: true,
    url: "https://gojun.vercel.app/",
  },
  {
    id: "ryoanji",
    title: "Fast Fix Whitemarsh",
    descEN: "Full digital transformation — website, SEO strategy, and Google Ads campaigns driving local bookings.",
    descJA: "ウェブサイト、SEO戦略、Google広告で地元の予約を促進する完全なデジタルトランスフォーメーション。",
    stack: ["Next.js", "Sanity", "Tailwind"],
    image: "https://picsum.photos/seed/ryoanji/800/400",
    featured: false,
    url: "https://www.fastfixwhitemarsh.com/",
  },
  {
    id: "zenwave",
    title: "EV Wrap",
    descEN: "High-converting lead gen site with instant quote calculator and automated capture system.",
    descJA: "即時見積もり計算機と自動キャプチャシステムを備えた高コンバージョンのリードジェン。",
    stack: ["Next.js", "Vercel", "Framer Motion"],
    image: "https://picsum.photos/seed/zenwave/800/400",
    featured: false,
    url: "https://evwrap-git-development-nguyenetics-projects.vercel.app/",
  },
  {
    id: "ichiban",
    title: "Ichiban Restaurant",
    descEN: "Elegant restaurant experience with dynamic menu CMS, reservation system, and brand storytelling.",
    descJA: "動的メニューCMS、予約システム、ブランドストーリーテリングを備えたエレガントなレストラン体験。",
    stack: ["Next.js", "Sanity", "TypeScript"],
    image: "https://picsum.photos/seed/ichiban/800/400",
    featured: false,
    url: "https://ichiban-website-taupe.vercel.app/",
  },
  {
    id: "shibui",
    title: "Zen Dashboard",
    descEN: "Internal analytics platform with real-time data visualization and AI-driven performance insights.",
    descJA: "リアルタイムデータ可視化とAI駆動のパフォーマンスインサイトを備えた内部分析プラットフォーム。",
    stack: ["React", "TypeScript", "OpenAI", "Supabase"],
    image: "https://picsum.photos/seed/shibui/800/400",
    featured: false,
    url: "#work",
  },
  {
    id: "kaizen",
    title: "Nguyenetic Studio",
    descEN: "Branding, motion, and editorial design system built on Tailwind tokens and Framer Motion primitives.",
    descJA: "TailwindトークンとFramer Motionプリミティブで構築したブランディング・モーション・エディトリアルデザインシステム。",
    stack: ["Tailwind", "Framer Motion", "Vercel"],
    image: "https://picsum.photos/seed/kaizen/1200/400",
    featured: false,
    wide: true,
    url: "#work",
  },
]

export function Work() {
  const { t } = useLanguage()
  const [hovered, setHovered] = useState<string | null>(null)

  const featured = projects[0]
  const standard = projects.slice(1, 5)
  const wide = projects[5]

  return (
    <section id="work" className="relative py-32 px-6 overflow-hidden bg-ink">
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: springEase }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.3em] text-warm font-mono uppercase mb-4">
            作品 · PORTFOLIO SELECTION 2026
          </p>
          <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-display font-bold text-paper leading-none mb-6">
            {t("Selected ", "セレクテッド ")}
            <span className="text-warm">{t("Works", "ワークス")}</span>
          </h2>
          <p className="text-paper/70 text-lg leading-relaxed max-w-2xl">
            {t(
              "Architecting digital ecosystems where performance meets aesthetic purity. A curated collection of hybrid marketing and development engagements.",
              "パフォーマンスと美的純度が交差するデジタルエコシステムを構築。マーケティングと開発の複合案件のキュレーテッドコレクション。"
            )}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Featured tile — 2×2 */}
          <motion.a
            href={featured.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: springEase }}
            onMouseEnter={() => setHovered(featured.id)}
            onMouseLeave={() => setHovered(null)}
            className="group relative block lg:col-span-2 lg:row-span-2 rounded-2xl overflow-hidden border border-warm/20 hover:border-warm transition-all duration-300"
          >
            <div className="relative h-72 lg:h-full min-h-[340px]">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

              <AnimatePresence>
                {hovered === featured.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-ink/60 flex items-center justify-center"
                  >
                    <p className="text-paper/80 text-sm text-center max-w-xs px-6 leading-relaxed">
                      {t(featured.descEN, featured.descJA)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-paper text-2xl mb-2">
                      {featured.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {featured.stack.map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full border border-warm/30 text-warm font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <motion.div
                    animate={{ x: hovered === featured.id ? 4 : 0, y: hovered === featured.id ? -4 : 0 }}
                    className="text-warm"
                  >
                    <ArrowUpRight className="w-6 h-6" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.a>

          {/* Standard tiles — 1×1 */}
          {standard.map((project, i) => (
            <motion.a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.7, ease: springEase }}
              onMouseEnter={() => setHovered(project.id)}
              onMouseLeave={() => setHovered(null)}
              className="group relative block rounded-2xl overflow-hidden border border-warm/20 hover:border-warm transition-all duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

                <AnimatePresence>
                  {hovered === project.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-ink/70 flex items-center justify-center px-5"
                    >
                      <p className="text-paper/80 text-xs text-center leading-relaxed">
                        {t(project.descEN, project.descJA)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-paper text-base mb-1.5">
                        {project.title}
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {project.stack.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full border border-warm/30 text-warm font-mono">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <motion.div
                      animate={{ x: hovered === project.id ? 4 : 0, y: hovered === project.id ? -4 : 0 }}
                      className="text-warm/60 group-hover:text-warm transition-colors"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}

          {/* Wide tile — 2×1 (spans 2 cols on desktop, 1 on mobile) */}
          <motion.a
            href={wide.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.4, duration: 0.7, ease: springEase }}
            onMouseEnter={() => setHovered(wide.id)}
            onMouseLeave={() => setHovered(null)}
            className="group relative block lg:col-span-2 rounded-2xl overflow-hidden border border-warm/20 hover:border-warm transition-all duration-300"
          >
            <div className="relative h-48">
              <Image
                src={wide.image}
                alt={wide.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/50 to-transparent" />

              <AnimatePresence>
                {hovered === wide.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-ink/60 flex items-center justify-center px-8"
                  >
                    <p className="text-paper/80 text-sm text-center leading-relaxed max-w-lg">
                      {t(wide.descEN, wide.descJA)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-paper text-lg mb-1.5">
                      {wide.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {wide.stack.map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full border border-warm/30 text-warm font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <motion.div
                    animate={{ x: hovered === wide.id ? 4 : 0, y: hovered === wide.id ? -4 : 0 }}
                    className="text-warm/60 group-hover:text-warm transition-colors"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.a>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease: springEase }}
          className="mt-16 text-center"
        >
          <p className="text-paper/50 text-sm mb-4">
            {t("Want to see your project here?", "あなたのプロジェクトをここに載せたいですか？")}
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-warm hover:underline underline-offset-4"
          >
            <span>{t("Let's build something amazing", "一緒に素晴らしいものを作りましょう")}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
