"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, ExternalLink, Layers, Zap, TrendingUp, Palette, Check } from "lucide-react"

const springEase = [0.22, 1, 0.36, 1] as const

// Custom logo components for each project
const GoJunLogo = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>
      <linearGradient id="gojunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#gojunGrad)" />
    <text x="50" y="42" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold" fontFamily="sans-serif">GO</text>
    <text x="50" y="68" textAnchor="middle" fill="white" fontSize="18" fontFamily="sans-serif">準</text>
  </svg>
)

const FastFixLogo = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>
      <linearGradient id="fastfixGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
    <rect x="10" y="25" width="80" height="50" rx="8" fill="url(#fastfixGrad)" />
    <path d="M25 50 L40 50 L35 40 L50 55 L35 55 L40 65 Z" fill="white" />
    <text x="60" y="55" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">FIX</text>
  </svg>
)

const EVWrapLogo = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>
      <linearGradient id="evwrapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#14b8a6" />
      </linearGradient>
    </defs>
    <path d="M20 70 Q50 20 80 70" fill="none" stroke="url(#evwrapGrad)" strokeWidth="12" strokeLinecap="round" />
    <circle cx="30" cy="70" r="12" fill="url(#evwrapGrad)" />
    <circle cx="70" cy="70" r="12" fill="url(#evwrapGrad)" />
    <text x="50" y="55" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="sans-serif">EV</text>
  </svg>
)

const IchibanLogo = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>
      <linearGradient id="ichibanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f43f5e" />
        <stop offset="100%" stopColor="#f97316" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#ichibanGrad)" />
    <text x="50" y="62" textAnchor="middle" fill="white" fontSize="36" fontWeight="bold" fontFamily="serif">一</text>
  </svg>
)

const projects = [
  {
    title: "GoJUN",
    subtitle: "AI-Powered Japanese Learning",
    description: "Built a complete SaaS platform from scratch — real-time flashcard system with AI-generated content, spaced repetition algorithms, and user analytics.",
    category: "SaaS Platform",
    tags: ["React", "AI", "Supabase", "EdTech"],
    url: "https://gojun.vercel.app/",
    gradient: "from-violet-500 to-purple-600",
    accentClass: "text-violet-400 border-violet-500/30 bg-violet-500/10",
    icon: Layers,
    Logo: GoJunLogo,
    highlights: ["Custom AI integration", "Real-time data sync", "User authentication", "Analytics dashboard"],
    impact: "Full SaaS with AI",
  },
  {
    title: "Fast Fix Whitemarsh",
    subtitle: "Full Digital Transformation",
    description: "Developed website, implemented SEO strategy, and managed Google Ads campaigns — driving local customers and online bookings.",
    category: "Business + Marketing",
    tags: ["Next.js", "Sanity", "SEO", "Google Ads"],
    url: "https://www.fastfixwhitemarsh.com/",
    gradient: "from-blue-500 to-cyan-500",
    accentClass: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    icon: Zap,
    Logo: FastFixLogo,
    highlights: ["SEO optimization", "Google Ads management", "Online booking system", "Content management"],
    impact: "Top 3 Local Search",
  },
  {
    title: "EV Wrap",
    subtitle: "Lead Generation Machine",
    description: "Built a high-converting website with instant quote calculator, portfolio gallery, and automated lead capture system.",
    category: "Business Website",
    tags: ["Next.js", "Automotive", "Lead Gen"],
    url: "https://evwrap-git-development-nguyenetics-projects.vercel.app/",
    gradient: "from-emerald-500 to-teal-500",
    accentClass: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    icon: Palette,
    Logo: EVWrapLogo,
    highlights: ["Quote calculator", "Lead capture forms", "Portfolio showcase", "Mobile-first design"],
    impact: "High Conversions",
  },
  {
    title: "Ichiban",
    subtitle: "Restaurant Digital Experience",
    description: "Created an elegant online presence with dynamic menu management, reservation system, and seamless CMS for easy updates.",
    category: "Restaurant",
    tags: ["Next.js", "Sanity CMS", "Hospitality"],
    url: "https://ichiban-website-taupe.vercel.app/",
    gradient: "from-rose-500 to-orange-500",
    accentClass: "text-rose-400 border-rose-500/30 bg-rose-500/10",
    icon: TrendingUp,
    Logo: IchibanLogo,
    highlights: ["Dynamic menu CMS", "Reservation system", "Mobile optimized", "Brand storytelling"],
    impact: "Online Orders Live",
  },
]

export function Work() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  return (
    <section id="work" className="relative py-32 px-6 overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-accent-cyber/5 rounded-full blur-[200px]"
      />
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-accent-sakura/5 rounded-full blur-[180px]"
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: springEase }}
          className="mb-20 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-px bg-gradient-to-r from-transparent to-accent-cyber"
            />
            <span className="text-xs tracking-[0.3em] text-accent-cyber font-mono uppercase">
              作品
            </span>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-px bg-gradient-to-l from-transparent to-accent-cyber"
            />
          </div>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight mb-4">
            Real Projects, <span className="text-gradient-cyber">Real Results</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Not just websites — complete digital solutions that drive business growth.
          </p>
        </motion.div>

        {/* Staggered Bento Grid */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {projects.map((project, i) => {
            const Icon = project.icon
            const Logo = project.Logo
            const isLarge = i === 0
            const isHovered = hoveredProject === i

            return (
              <motion.a
                key={project.title}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 60, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, duration: 0.8, ease: springEase }}
                onMouseEnter={() => setHoveredProject(i)}
                onMouseLeave={() => setHoveredProject(null)}
                className={`
                  group relative block
                  ${isLarge ? "col-span-12 lg:col-span-7" : "col-span-12 md:col-span-6 lg:col-span-5"}
                  ${i === 2 ? "lg:col-start-1" : ""}
                `}
                style={{ perspective: "1000px" }}
              >
                <motion.div
                  animate={{
                    rotateY: isHovered ? 2 : 0,
                    rotateX: isHovered ? -2 : 0,
                    scale: isHovered ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`
                    relative h-full rounded-2xl border overflow-hidden
                    bg-card/50 backdrop-blur-sm
                    transition-all duration-500
                    ${isHovered ? `border-transparent shadow-2xl shadow-${project.gradient.split("-")[1]}-500/20` : "border-border"}
                  `}
                >
                  {/* Gradient overlay on hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-5 transition-opacity`}
                  />

                  {/* Content */}
                  <div className={`relative ${isLarge ? "grid lg:grid-cols-2" : ""}`}>
                    {/* Visual area */}
                    <div className={`relative ${isLarge ? "h-64 lg:h-auto lg:min-h-[350px]" : "h-48"} bg-gradient-to-br ${project.gradient} overflow-hidden`}>
                      {/* Animated grid pattern */}
                      <motion.div
                        animate={{ backgroundPosition: isHovered ? "60px 60px" : "0px 0px" }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 opacity-30 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%)] bg-[length:60px_60px]"
                      />

                      {/* Center logo */}
                      <div className="relative flex items-center justify-center h-full">
                        <motion.div
                          animate={{
                            rotate: isHovered ? [0, -3, 3, 0] : 0,
                            scale: isHovered ? 1.1 : 1,
                          }}
                          transition={{ duration: 0.5 }}
                          className={`${isLarge ? "w-28 h-28" : "w-20 h-20"} rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-2xl p-3`}
                        >
                          <Logo />
                        </motion.div>

                        {/* Floating particles on hover */}
                        {isHovered && (
                          <>
                            {[...Array(5)].map((_, j) => (
                              <motion.div
                                key={j}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                  opacity: [0, 1, 0],
                                  scale: [0, 1, 0.5],
                                  x: (j - 2) * 40,
                                  y: Math.sin(j) * 30,
                                }}
                                transition={{ duration: 1.5, delay: j * 0.1, repeat: Infinity }}
                                className="absolute w-2 h-2 rounded-full bg-white/50"
                              />
                            ))}
                          </>
                        )}
                      </div>

                      {/* Category pill */}
                      <motion.span
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="absolute top-4 left-4 text-xs font-medium px-3 py-1.5 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/20"
                      >
                        {project.category}
                      </motion.span>

                      {/* Impact badge */}
                      <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm border border-white/20"
                      >
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-white" />
                          <span className="text-xs font-medium text-white">{project.impact}</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Text content */}
                    <div className={`p-5 ${isLarge ? "lg:p-8 flex flex-col justify-center" : ""}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className={`${isLarge ? "text-2xl" : "text-lg"} font-bold group-hover:text-gradient-cyber transition-colors`}>
                            {project.title}
                          </h3>
                          <p className={`text-sm ${project.accentClass.split(" ")[0]} mt-1`}>{project.subtitle}</p>
                        </div>
                        <motion.div
                          animate={{ x: isHovered ? 4 : 0, y: isHovered ? -4 : 0 }}
                          className="text-muted-foreground"
                        >
                          <ArrowUpRight className="w-5 h-5" />
                        </motion.div>
                      </div>

                      <p className={`text-muted-foreground ${isLarge ? "text-base mb-6" : "text-sm mb-4 line-clamp-2"} leading-relaxed`}>
                        {project.description}
                      </p>

                      {/* Highlights with animation */}
                      <div className={`space-y-1.5 ${isLarge ? "mb-6" : "mb-4"}`}>
                        {project.highlights.slice(0, isLarge ? 4 : 2).map((highlight, j) => (
                          <motion.div
                            key={highlight}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + j * 0.1 }}
                            className="flex items-center gap-2 text-sm text-foreground/70"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${project.gradient}`} />
                            {highlight}
                          </motion.div>
                        ))}
                      </div>

                      {/* Tech tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.slice(0, isLarge ? 4 : 3).map((tag, j) => (
                          <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 + j * 0.05 }}
                            className={`text-[10px] px-2.5 py-1 rounded-full border ${project.accentClass}`}
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>

                      {/* View project link for large card */}
                      {isLarge && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.8 }}
                          className="mt-6 flex items-center gap-2 text-sm font-medium text-violet-400"
                        >
                          <span>View Live Project</span>
                          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.a>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease: springEase }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-4">Want to see your project here?</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-accent-cyber hover:underline underline-offset-4"
          >
            <span>Let&apos;s build something amazing</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
