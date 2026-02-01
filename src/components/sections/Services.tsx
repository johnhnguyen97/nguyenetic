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
  Server,
  Cloud,
  Factory,
  Truck,
} from "lucide-react"

const springEase = [0.22, 1, 0.36, 1] as const

const coreServices = [
  {
    icon: Code2,
    title: "Web Development",
    description: "Full-stack web applications with modern frameworks",
    color: "cyber",
  },
  {
    icon: Smartphone,
    title: "App Development",
    description: "Cross-platform mobile and desktop applications",
    color: "sakura",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "User-centered design that converts visitors",
    color: "gold",
  },
  {
    icon: Search,
    title: "SEO Optimization",
    description: "Data-driven strategies for organic growth",
    color: "cyber",
  },
  {
    icon: Megaphone,
    title: "Google Ads",
    description: "High-ROI campaigns that drive conversions",
    color: "sakura",
  },
  {
    icon: BarChart3,
    title: "Digital Marketing",
    description: "Full-funnel marketing that delivers results",
    color: "gold",
  },
]

const enterpriseCapabilities = [
  {
    icon: Cloud,
    title: "SaaS Platforms",
    description: "Multi-tenant cloud applications with subscription management, user roles, and analytics dashboards.",
  },
  {
    icon: Factory,
    title: "MES Systems",
    description: "Manufacturing execution systems for real-time production tracking and quality control.",
  },
  {
    icon: Server,
    title: "ERP Integration",
    description: "Seamless integration with enterprise resource planning systems and business workflows.",
  },
  {
    icon: Truck,
    title: "Fleet Telematics",
    description: "Vehicle tracking, route optimization, and driver performance monitoring solutions.",
  },
  {
    icon: Settings,
    title: "IoT Dashboards",
    description: "Real-time sensor monitoring, data visualization, and automated alerting systems.",
  },
  {
    icon: Sparkles,
    title: "AI/ML Systems",
    description: "Intelligent automation, predictive analytics, and machine learning integrations.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: springEase,
    },
  },
}

export function Services() {
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
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-gradient-to-r from-accent-sakura to-transparent" />
            <span className="text-xs tracking-[0.3em] text-accent-sakura font-mono uppercase">
              サービス
            </span>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 items-end">
            <div>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight mb-4">
                Full-Stack
                <br />
                <span className="text-gradient-cyber">Full-Service</span>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              From startup MVPs to enterprise systems — comprehensive development
              and marketing solutions that scale with your business.
            </p>
          </div>
        </motion.div>

        {/* Core Services - Orbital Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-24"
        >
          {coreServices.map((service, i) => {
            const Icon = service.icon
            const colorClasses = {
              cyber: "from-accent-cyber/30 to-accent-cyber/5 border-accent-cyber/20 hover:border-accent-cyber/40",
              sakura: "from-accent-sakura/30 to-accent-sakura/5 border-accent-sakura/20 hover:border-accent-sakura/40",
              gold: "from-accent-gold/30 to-accent-gold/5 border-accent-gold/20 hover:border-accent-gold/40",
            }
            const iconColors = {
              cyber: "text-accent-cyber",
              sakura: "text-accent-sakura",
              gold: "text-accent-gold",
            }

            return (
              <motion.div
                key={service.title}
                variants={itemVariants}
                className="group relative"
              >
                <div className={`
                  relative h-full p-6 rounded-2xl
                  bg-gradient-to-br ${colorClasses[service.color as keyof typeof colorClasses]}
                  border backdrop-blur-sm
                  transition-all duration-500
                  hover:scale-[1.02] hover:shadow-lg
                `}>
                  {/* Floating icon orb */}
                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                    className={`
                      w-14 h-14 rounded-full
                      bg-gradient-to-br from-card to-card/50
                      border border-border/50
                      flex items-center justify-center mb-5
                      shadow-lg
                      group-hover:scale-110 transition-transform duration-300
                    `}
                  >
                    <Icon className={`w-6 h-6 ${iconColors[service.color as keyof typeof iconColors]}`} />
                  </motion.div>

                  <h3 className="text-lg font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>

                  {/* Subtle glow on hover */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colorClasses[service.color as keyof typeof colorClasses]} blur-xl`} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Enterprise Section - Visual Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: springEase }}
          className="relative mb-16"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-6 bg-background">
            <span className="text-xs tracking-[0.3em] text-accent-gold font-mono uppercase">
              Enterprise Grade
            </span>
          </div>
        </motion.div>

        {/* Enterprise Capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: springEase }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center mb-4">
            Battle-Tested in Production
          </h3>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Years of experience building mission-critical systems that handle real-world scale
            and complexity.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {enterpriseCapabilities.map((cap) => {
            const Icon = cap.icon
            return (
              <motion.div
                key={cap.title}
                variants={itemVariants}
                className="group"
              >
                <div className="relative h-full p-6 rounded-xl border border-border bg-card/30 hover:border-accent-gold/30 hover:bg-card/50 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent-gold/10 flex items-center justify-center shrink-0 group-hover:bg-accent-gold/20 transition-colors">
                      <Icon className="w-5 h-5 text-accent-gold" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 group-hover:text-accent-gold transition-colors">
                        {cap.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {cap.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: springEase }}
          className="mt-20 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
            <div className="text-left">
              <p className="font-semibold mb-1">Ready to build something great?</p>
              <p className="text-sm text-muted-foreground">Let&apos;s discuss your project requirements.</p>
            </div>
            <a
              href="#contact"
              className="shrink-0 inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-accent-cyber to-accent-sakura text-white rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
