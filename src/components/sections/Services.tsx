"use client"

import { motion } from "framer-motion"
import {
  Code2,
  Search,
  Megaphone,
  BarChart3,
  Settings,
  Sparkles,
  Smartphone,
  Palette,
  Cloud,
  Database,
  Cpu,
  Globe,
} from "lucide-react"

const springEase = [0.22, 1, 0.36, 1] as const

// Services arranged in a hexagonal constellation pattern
const services = [
  { icon: Code2, title: "Web Dev", color: "cyber", x: 50, y: 20 },
  { icon: Smartphone, title: "Apps", color: "sakura", x: 80, y: 35 },
  { icon: Palette, title: "Design", color: "gold", x: 80, y: 65 },
  { icon: Search, title: "SEO", color: "cyber", x: 50, y: 80 },
  { icon: Megaphone, title: "Ads", color: "sakura", x: 20, y: 65 },
  { icon: BarChart3, title: "Marketing", color: "gold", x: 20, y: 35 },
]

// Connections between nodes (creating a hexagonal web)
const connections = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], // outer ring
  [0, 3], [1, 4], [2, 5], // cross connections
]

const enterpriseCapabilities = [
  {
    icon: Cloud,
    title: "SaaS Platforms",
    description: "Multi-tenant cloud apps with analytics",
  },
  {
    icon: Database,
    title: "Data Systems",
    description: "Scalable database architecture",
  },
  {
    icon: Settings,
    title: "IoT Dashboards",
    description: "Real-time sensor monitoring",
  },
  {
    icon: Sparkles,
    title: "AI/ML Systems",
    description: "Intelligent automation & analytics",
  },
  {
    icon: Cpu,
    title: "API Development",
    description: "RESTful & GraphQL integrations",
  },
  {
    icon: Globe,
    title: "Cloud Hosting",
    description: "Vercel, AWS, edge deployment",
  },
]

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: springEase,
    },
  },
}

export function Services() {
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
            Everything you need to build, launch, and grow — all interconnected.
          </p>
        </motion.div>

        {/* Constellation Visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: springEase }}
          className="relative h-[500px] md:h-[600px] mb-24"
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
                strokeWidth="0.3"
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
                r="0.8"
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
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: springEase }}
                className="absolute"
                style={{
                  left: `${service.x}%`,
                  top: `${service.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                  className="group relative"
                >
                  {/* Glow ring */}
                  <div className={`absolute -inset-2 rounded-full ${glowColors[service.color as keyof typeof glowColors]} opacity-20 blur-xl group-hover:opacity-40 transition-opacity`} />

                  {/* Main node */}
                  <div className={`
                    relative w-20 h-20 md:w-24 md:h-24 rounded-full
                    bg-card/90 backdrop-blur-md
                    border-2 ${colorClasses[service.color as keyof typeof colorClasses]}
                    shadow-lg
                    flex flex-col items-center justify-center
                    cursor-pointer
                    group-hover:scale-110 transition-all duration-300
                  `}>
                    <Icon className={`w-7 h-7 md:w-8 md:h-8 ${iconColors[service.color as keyof typeof iconColors]} mb-1`} />
                    <span className="text-[10px] md:text-xs font-medium text-foreground/80">
                      {service.title}
                    </span>

                    {/* Inner pulse */}
                    <motion.div
                      className={`absolute inset-0 rounded-full border ${colorClasses[service.color as keyof typeof colorClasses]}`}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
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
              className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-dashed border-accent-cyber/30"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-accent-cyber to-accent-sakura" />
            </div>
          </motion.div>
        </motion.div>

        {/* Enterprise Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: springEase }}
          className="relative"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-gold/10 border border-accent-gold/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
              <span className="text-xs tracking-wider text-accent-gold font-mono">PRODUCTION READY</span>
            </div>
            <h3 className="text-2xl font-bold mb-3">Enterprise Capabilities</h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Scalable architecture for mission-critical applications.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {enterpriseCapabilities.map((cap, i) => {
              const Icon = cap.icon
              return (
                <motion.div
                  key={cap.title}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="relative h-full p-4 rounded-xl border border-border bg-card/30 hover:border-accent-gold/30 hover:bg-card/50 transition-all duration-300 text-center">
                    <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-accent-gold/10 flex items-center justify-center group-hover:bg-accent-gold/20 group-hover:scale-110 transition-all">
                      <Icon className="w-5 h-5 text-accent-gold" />
                    </div>
                    <h4 className="text-sm font-semibold mb-1 group-hover:text-accent-gold transition-colors">
                      {cap.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: springEase }}
          className="mt-20 text-center"
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
