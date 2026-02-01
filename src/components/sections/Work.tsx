"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, ExternalLink, Layers, Zap, TrendingUp, Palette } from "lucide-react"

const springEase = [0.22, 1, 0.36, 1] as const

const projects = [
  {
    title: "GoJUN",
    description: "Interactive Japanese learning platform with AI-powered flashcards and spaced repetition system.",
    category: "SaaS Platform",
    tags: ["React", "AI", "Supabase", "EdTech"],
    url: "https://gojun.vercel.app/",
    gradient: "from-violet-500 to-purple-600",
    accentColor: "violet",
    icon: Layers,
    features: ["AI-Powered", "Real-time Sync", "Analytics"],
  },
  {
    title: "Fast Fix Whitemarsh",
    description: "Full-service phone repair with online booking, SEO optimization, Google Ads, and local marketing.",
    category: "Business + Marketing",
    tags: ["Next.js", "Sanity", "SEO", "Google Ads"],
    url: "https://www.fastfixwhitemarsh.com/",
    gradient: "from-blue-500 to-cyan-500",
    accentColor: "blue",
    icon: Zap,
    features: ["Local SEO", "Google Ads", "Booking System"],
  },
  {
    title: "EV Wrap",
    description: "Premium vehicle wrapping service with gallery showcase, quote calculator, and lead generation.",
    category: "Business Website",
    tags: ["Next.js", "Automotive", "Lead Gen"],
    url: "https://evwrap-git-development-nguyenetics-projects.vercel.app/",
    gradient: "from-emerald-500 to-teal-500",
    accentColor: "emerald",
    icon: Palette,
    features: ["Quote Calculator", "Gallery", "Lead Forms"],
  },
  {
    title: "Ichiban",
    description: "Elegant Japanese restaurant website with dynamic menu, reservation system, and CMS integration.",
    category: "Restaurant",
    tags: ["Next.js", "Sanity CMS", "Hospitality"],
    url: "https://ichiban-website-taupe.vercel.app/",
    gradient: "from-rose-500 to-orange-500",
    accentColor: "rose",
    icon: TrendingUp,
    features: ["CMS Managed", "Reservations", "Dynamic Menu"],
  },
]

const enterpriseExperience = [
  { name: "SaaS Platforms", description: "Multi-tenant cloud applications" },
  { name: "MES Systems", description: "Manufacturing execution systems" },
  { name: "ERP Integration", description: "Enterprise resource planning" },
  { name: "Fleet Telematics", description: "Vehicle tracking & analytics" },
  { name: "IoT Dashboards", description: "Real-time sensor monitoring" },
  { name: "AI/ML Systems", description: "Intelligent automation" },
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
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: springEase,
    },
  },
}

export function Work() {
  return (
    <section id="work" className="relative py-32 px-6 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-1/2 h-1/2 bg-accent-cyber/5 rounded-full blur-[200px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-accent-sakura/5 rounded-full blur-[150px]" />

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
            <div className="w-12 h-px bg-gradient-to-r from-accent-cyber to-transparent" />
            <span className="text-xs tracking-[0.3em] text-accent-cyber font-mono uppercase">
              作品
            </span>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 items-end">
            <div>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight mb-4">
                Selected
                <br />
                <span className="text-gradient-cyber">Projects</span>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              From SaaS platforms to local businesses — delivering complete digital
              solutions with development, SEO, and marketing expertise.
            </p>
          </div>
        </motion.div>

        {/* Featured Project - First one larger */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: springEase }}
          className="mb-8"
        >
          <a
            href={projects[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block"
          >
            <div className="relative rounded-3xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden hover:border-violet-500/30 transition-all duration-500">
              <div className="grid lg:grid-cols-2">
                {/* Visual Side */}
                <div className={`relative h-64 lg:h-auto lg:min-h-[400px] bg-gradient-to-br ${projects[0].gradient} p-8 flex items-center justify-center overflow-hidden`}>
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%)] bg-[length:60px_60px]" />
                  </div>

                  {/* Icon container */}
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative"
                  >
                    <div className="w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-2xl">
                      <Layers className="w-16 h-16 text-white" />
                    </div>
                    {/* Floating decorations */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 rounded-lg bg-white/30 backdrop-blur-sm" />
                    <div className="absolute -bottom-6 -left-6 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm" />
                  </motion.div>

                  {/* Feature badges */}
                  <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                    {projects[0].features.map((feature) => (
                      <span
                        key={feature}
                        className="text-xs px-3 py-1.5 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/20"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content Side */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-6">
                    <span className={`text-sm font-medium px-4 py-1.5 rounded-full bg-gradient-to-r ${projects[0].gradient} text-white`}>
                      {projects[0].category}
                    </span>
                    <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-violet-400 transition-colors" />
                  </div>

                  <h3 className="text-3xl font-bold mb-4 group-hover:text-violet-400 transition-colors">
                    {projects[0].title}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                    {projects[0].description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {projects[0].tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-sm px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-violet-400 transition-colors">
                    <span>View Project</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </a>
        </motion.div>

        {/* Other Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          {projects.slice(1).map((project) => {
            const Icon = project.icon
            return (
              <motion.a
                key={project.title}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                className="group relative block"
              >
                <div className="relative h-full rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden hover:border-accent-cyber/30 transition-all duration-500">
                  {/* Top visual */}
                  <div className={`relative h-40 bg-gradient-to-br ${project.gradient} p-6 overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_70%)]" />
                    </div>

                    <div className="relative flex items-center justify-center h-full">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-500">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Category badge */}
                    <span className="absolute top-4 left-4 text-xs font-medium px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
                      {project.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold group-hover:text-accent-cyber transition-colors">
                        {project.title}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-accent-cyber group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-full bg-muted/50 text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.a>
            )
          })}
        </motion.div>

        {/* Enterprise Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: springEase }}
          className="mt-32"
        >
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] text-accent-gold font-mono uppercase mb-4">
              Beyond the Portfolio
            </p>
            <h3 className="text-2xl font-bold mb-4">Enterprise Experience</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Years of experience building mission-critical systems for enterprise clients
              across diverse industries.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enterpriseExperience.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: springEase }}
                className="group p-5 rounded-xl border border-border bg-card/30 hover:border-accent-gold/30 hover:bg-card/50 transition-all duration-300"
              >
                <h4 className="font-semibold mb-1 group-hover:text-accent-gold transition-colors">
                  {item.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
