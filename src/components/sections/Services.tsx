"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Code2,
  Search,
  Megaphone,
  BarChart3,
  Sparkles,
  Smartphone,
  Palette,
  Cloud,
  Database,
  Cpu,
} from "lucide-react"

const springEase = [0.22, 1, 0.36, 1] as const

// Combined services with detailed info - arranged in constellation
const services = [
  {
    icon: Code2,
    title: "Web Dev",
    fullTitle: "Web Development",
    color: "cyber",
    x: 50, y: 15,
    details: ["Next.js / React", "TypeScript", "Full-Stack Apps", "API Integration"],
    enterprise: { icon: Cloud, label: "SaaS Ready" },
  },
  {
    icon: Smartphone,
    title: "Custom Apps",
    fullTitle: "App Development",
    color: "sakura",
    x: 82, y: 32,
    details: ["Desktop Apps", "Mobile Apps", "Cross-Platform", "Electron / React Native"],
    enterprise: { icon: Database, label: "Scalable" },
  },
  {
    icon: Palette,
    title: "Design",
    fullTitle: "UI/UX Design",
    color: "gold",
    x: 82, y: 68,
    details: ["Brand Identity", "User Research", "Prototyping", "Design Systems"],
    enterprise: { icon: Sparkles, label: "AI-Enhanced" },
  },
  {
    icon: Search,
    title: "SEO",
    fullTitle: "SEO Optimization",
    color: "cyber",
    x: 50, y: 85,
    details: ["Technical SEO", "Local SEO", "Content Strategy", "Analytics"],
    enterprise: { icon: Cpu, label: "Data-Driven" },
  },
  {
    icon: Megaphone,
    title: "Ads",
    fullTitle: "Google Ads",
    color: "sakura",
    x: 18, y: 68,
    details: ["PPC Campaigns", "Conversion Tracking", "A/B Testing", "ROI Optimization"],
    enterprise: { icon: BarChart3, label: "Performance" },
  },
  {
    icon: BarChart3,
    title: "Marketing",
    fullTitle: "Digital Marketing",
    color: "gold",
    x: 18, y: 32,
    details: ["Social Media", "Email Marketing", "Content Creation", "Brand Strategy"],
    enterprise: { icon: Cloud, label: "Full-Funnel" },
  },
]

// Connections between nodes (creating a hexagonal web)
const connections = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], // outer ring
  [0, 3], [1, 4], [2, 5], // cross connections
]

export function Services() {
  const [activeService, setActiveService] = useState<number | null>(null)

  const colorClasses = {
    cyber: "border-accent-cyber/50 shadow-accent-cyber/30",
    sakura: "border-accent-sakura/50 shadow-accent-sakura/30",
    gold: "border-accent-gold/50 shadow-accent-gold/30",
  }
  const iconColors = {
    cyber: "text-accent-cyber",
    sakura: "text-accent-sakura",
    gold: "text-accent-gold",
  }
  const glowColors = {
    cyber: "bg-accent-cyber",
    sakura: "bg-accent-sakura",
    gold: "bg-accent-gold",
  }
  const bgColors = {
    cyber: "from-accent-cyber/20 to-accent-cyber/5",
    sakura: "from-accent-sakura/20 to-accent-sakura/5",
    gold: "from-accent-gold/20 to-accent-gold/5",
  }

  return (
    <section id="services" className="relative py-32 px-6 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-accent-sakura/5 rounded-full blur-[200px]" />
      <div className="absolute bottom-1/4 left-0 w-1/3 h-1/3 bg-accent-cyber/5 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: springEase }}
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-accent-sakura" />
            <span className="text-xs tracking-[0.3em] text-accent-sakura font-mono uppercase">
              サービス
            </span>
            <div className="w-12 h-px bg-gradient-to-r from-accent-sakura to-transparent" />
          </div>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight mb-4">
            Full-Stack <span className="text-gradient-cyber">Ecosystem</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Everything you need to build, launch, and grow — hover to explore each service.
          </p>
        </motion.div>

        {/* Interactive Constellation */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-center mb-16">
          {/* Constellation Visualization */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: springEase }}
            className="relative h-[450px] md:h-[500px]"
          >
            {/* SVG for connection lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--color-accent-cyber)" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="var(--color-accent-sakura)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="var(--color-accent-gold)" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              {connections.map(([from, to], i) => (
                <motion.line
                  key={`line-${i}`}
                  x1={services[from].x}
                  y1={services[from].y}
                  x2={services[to].x}
                  y2={services[to].y}
                  stroke="url(#lineGradient1)"
                  strokeWidth={activeService === from || activeService === to ? "0.6" : "0.25"}
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: springEase }}
                />
              ))}
              {/* Animated pulse along lines */}
              {connections.slice(0, 3).map(([from, to], i) => (
                <motion.circle
                  key={`pulse-${i}`}
                  r="0.6"
                  fill="var(--color-accent-cyber)"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    cx: [services[from].x, services[to].x],
                    cy: [services[from].y, services[to].y],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 1.5,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </svg>

            {/* Service Nodes */}
            {services.map((service, i) => {
              const Icon = service.icon
              const EnterpriseIcon = service.enterprise.icon
              const isActive = activeService === i
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: springEase }}
                  className="absolute z-10"
                  style={{
                    left: `${service.x}%`,
                    top: `${service.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onMouseEnter={() => setActiveService(i)}
                  onMouseLeave={() => setActiveService(null)}
                >
                  <motion.div
                    animate={{ y: isActive ? 0 : [-3, 3, -3] }}
                    transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                    className="group relative"
                  >
                    {/* Glow ring */}
                    <div className={`absolute -inset-3 rounded-full ${glowColors[service.color as keyof typeof glowColors]} ${isActive ? "opacity-40" : "opacity-15"} blur-xl transition-opacity duration-300`} />

                    {/* Main node */}
                    <div className={`
                      relative rounded-full
                      bg-card/95 backdrop-blur-md
                      border-2 ${colorClasses[service.color as keyof typeof colorClasses]}
                      shadow-lg
                      flex flex-col items-center justify-center
                      cursor-pointer
                      transition-all duration-300
                      ${isActive ? "w-28 h-28 md:w-32 md:h-32 scale-110" : "w-18 h-18 md:w-22 md:h-22"}
                    `}>
                      <Icon className={`${isActive ? "w-8 h-8 md:w-10 md:h-10" : "w-6 h-6 md:w-7 md:h-7"} ${iconColors[service.color as keyof typeof iconColors]} mb-1 transition-all`} />
                      <span className={`font-medium text-foreground/90 transition-all ${isActive ? "text-xs md:text-sm" : "text-[9px] md:text-[10px]"}`}>
                        {service.title}
                      </span>

                      {/* Enterprise badge on active */}
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-gold/20 border border-accent-gold/30"
                        >
                          <EnterpriseIcon className="w-3 h-3 text-accent-gold" />
                          <span className="text-[8px] text-accent-gold font-medium">{service.enterprise.label}</span>
                        </motion.div>
                      )}

                      {/* Inner pulse */}
                      <motion.div
                        className={`absolute inset-0 rounded-full border ${colorClasses[service.color as keyof typeof colorClasses]}`}
                        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}

            {/* Center element */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.8, ease: springEase }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-dashed border-accent-cyber/30"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-accent-cyber to-accent-sakura" />
              </div>
            </motion.div>
          </motion.div>

          {/* Service Details Panel */}
          <div className="lg:h-[500px] flex items-center">
            <AnimatePresence mode="wait">
              {activeService !== null ? (
                <motion.div
                  key={activeService}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: springEase }}
                  className={`w-full p-6 rounded-2xl bg-gradient-to-br ${bgColors[services[activeService].color as keyof typeof bgColors]} border border-border backdrop-blur-sm`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    {(() => {
                      const Icon = services[activeService].icon
                      return <Icon className={`w-8 h-8 ${iconColors[services[activeService].color as keyof typeof iconColors]}`} />
                    })()}
                    <div>
                      <h3 className="text-xl font-bold">{services[activeService].fullTitle}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {(() => {
                          const EnterpriseIcon = services[activeService].enterprise.icon
                          return <EnterpriseIcon className="w-3 h-3 text-accent-gold" />
                        })()}
                        <span className="text-xs text-accent-gold">{services[activeService].enterprise.label}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {services[activeService].details.map((detail, i) => (
                      <motion.div
                        key={detail}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-2 text-sm text-foreground/80"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${glowColors[services[activeService].color as keyof typeof glowColors]}`} />
                        {detail}
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">
                      Custom solutions tailored to your business needs
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full p-6 rounded-2xl border border-dashed border-border/50 text-center"
                >
                  <p className="text-muted-foreground mb-2">Hover over a service to explore</p>
                  <p className="text-xs text-muted-foreground/60">Each service includes enterprise-grade capabilities</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Enterprise Experience - Connected Stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: springEase }}
          className="relative"
        >
          {/* Connecting visual element */}
          <div className="absolute left-1/2 -top-16 w-px h-16 bg-gradient-to-b from-transparent via-accent-gold/50 to-accent-gold" />

          <div className="relative p-8 rounded-3xl border border-accent-gold/20 bg-gradient-to-b from-accent-gold/5 to-transparent">
            {/* Header */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-accent-gold/30" />
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent-gold/10 border border-accent-gold/20">
                <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
                <span className="text-sm font-medium text-accent-gold">Enterprise Experience</span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-accent-gold/30" />
            </div>

            {/* Enterprise Stack - Horizontal flow */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { icon: Cloud, label: "SaaS", desc: "Multi-tenant apps" },
                { icon: Database, label: "Data", desc: "Scalable architecture" },
                { icon: Cpu, label: "APIs", desc: "REST & GraphQL" },
                { icon: Sparkles, label: "AI/ML", desc: "Smart automation" },
                { icon: Smartphone, label: "Apps", desc: "Cross-platform" },
                { icon: BarChart3, label: "Analytics", desc: "Data insights" },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="group relative"
                  >
                    <div className="p-4 rounded-xl bg-card/50 border border-border hover:border-accent-gold/30 transition-all duration-300 text-center">
                      <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-accent-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5 text-accent-gold" />
                      </div>
                      <div className="font-semibold text-sm">{item.label}</div>
                      <div className="text-[10px] text-muted-foreground">{item.desc}</div>
                    </div>
                    {/* Connector line to next */}
                    {i < 5 && (
                      <div className="hidden lg:block absolute top-1/2 -right-1.5 w-3 h-px bg-accent-gold/30" />
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Custom Apps CTA inline */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-sakura to-accent-cyber flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold">Need a Custom App?</div>
                  <div className="text-sm text-muted-foreground">Desktop, mobile, or web — I build it all.</div>
                </div>
              </div>
              <a
                href="#contact"
                className="px-6 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:scale-105 transition-transform"
              >
                Let&apos;s Talk
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: springEase }}
          className="mt-16 text-center"
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent-cyber via-accent-sakura to-accent-gold text-white rounded-full font-medium hover:opacity-90 transition-all hover:scale-105"
          >
            <span>Start Your Project</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
