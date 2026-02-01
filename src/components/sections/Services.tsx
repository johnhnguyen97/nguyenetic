"use client"

import { motion } from "framer-motion"
import {
  Code2,
  Search,
  Megaphone,
  BarChart3,
  Settings,
  Sparkles,
} from "lucide-react"

const springEase = [0.22, 1, 0.36, 1] as const

const services = [
  {
    icon: Code2,
    title: "Web Development",
    description:
      "Custom websites and web applications built with modern frameworks. From landing pages to full-stack platforms.",
    features: ["Next.js / React", "Responsive Design", "CMS Integration", "API Development"],
  },
  {
    icon: Search,
    title: "SEO Optimization",
    description:
      "Strategic search engine optimization to improve visibility and drive organic traffic to your business.",
    features: ["Technical SEO", "Content Strategy", "Local SEO", "Analytics Setup"],
  },
  {
    icon: Megaphone,
    title: "Google Ads",
    description:
      "Data-driven advertising campaigns that maximize ROI and reach your target audience effectively.",
    features: ["Campaign Strategy", "Keyword Research", "Ad Copywriting", "Conversion Tracking"],
  },
  {
    icon: BarChart3,
    title: "Digital Marketing",
    description:
      "Comprehensive marketing strategies that align with your business goals and drive measurable results.",
    features: ["Brand Strategy", "Social Media", "Email Marketing", "Content Creation"],
  },
  {
    icon: Settings,
    title: "Website Management",
    description:
      "Ongoing maintenance and support to keep your digital presence running smoothly and securely.",
    features: ["Updates & Security", "Performance Monitoring", "Content Updates", "Technical Support"],
  },
  {
    icon: Sparkles,
    title: "AI Integration",
    description:
      "Leverage artificial intelligence to automate workflows, enhance user experiences, and gain insights.",
    features: ["Chatbots & Assistants", "Content Generation", "Data Analysis", "Automation"],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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
    <section id="services" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: springEase }}
          className="mb-16 text-center"
        >
          <p className="text-sm tracking-[0.3em] text-accent-sakura mb-4 font-mono">
            サービス
          </p>
          <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-bold mb-4">
            Full-Service Digital Solutions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            From concept to launch and beyond — comprehensive services to build,
            grow, and manage your digital presence.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                variants={itemVariants}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-cyber/10 to-accent-sakura/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative h-full p-6 rounded-2xl border border-border bg-card/30 hover:border-accent-cyber/30 transition-all duration-300">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyber/20 to-accent-sakura/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-accent-cyber" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-semibold mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-accent-cyber" />
                        {feature}
                      </li>
                    ))}
                  </ul>
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
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-6">
            Need a custom solution? Let&apos;s discuss your project.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-accent-cyber to-accent-sakura text-white rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Get a Quote
          </a>
        </motion.div>
      </div>
    </section>
  )
}
