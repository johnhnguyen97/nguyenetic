"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Globe } from "lucide-react"
import Image from "next/image"

const springEase = [0.22, 1, 0.36, 1] as const

const projects = [
  {
    title: "GoJUN",
    description: "Interactive Japanese learning platform with AI-powered flashcards and spaced repetition system.",
    category: "SaaS Platform",
    tags: ["React", "AI", "Supabase", "EdTech"],
    url: "https://gojun.vercel.app/",
    gradient: "from-violet-500 to-purple-600",
    bgGradient: "from-violet-500/10 via-purple-500/5 to-transparent",
    image: "/projects/gojun.png",
  },
  {
    title: "Fast Fix Whitemarsh",
    description: "Full-service phone repair with online booking, SEO optimization, Google Ads, and local marketing.",
    category: "Business + Marketing",
    tags: ["Next.js", "Sanity", "SEO", "Google Ads"],
    url: "https://www.fastfixwhitemarsh.com/",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 via-cyan-500/5 to-transparent",
    image: "/projects/fastfix.png",
  },
  {
    title: "EV Wrap",
    description: "Premium vehicle wrapping service with gallery showcase, quote calculator, and lead generation.",
    category: "Business Website",
    tags: ["Next.js", "Automotive", "Lead Gen"],
    url: "https://evwrap-git-development-nguyenetics-projects.vercel.app/",
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    image: "/projects/evwrap.png",
  },
  {
    title: "Ichiban",
    description: "Elegant Japanese restaurant website with dynamic menu, reservation system, and CMS integration.",
    category: "Restaurant",
    tags: ["Next.js", "Sanity CMS", "Hospitality"],
    url: "https://ichiban-website-taupe.vercel.app/",
    gradient: "from-rose-500 to-orange-500",
    bgGradient: "from-rose-500/10 via-orange-500/5 to-transparent",
    image: "/projects/ichiban.png",
  },
]

// Enterprise experience logos/systems
const enterpriseExperience = [
  { name: "SaaS Platforms", icon: "☁️" },
  { name: "MES Systems", icon: "🏭" },
  { name: "ERP Integration", icon: "📊" },
  { name: "Fleet Telematics", icon: "🚛" },
  { name: "IoT Dashboards", icon: "📡" },
  { name: "AI/ML Systems", icon: "🤖" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: springEase,
    },
  },
}

export function Work() {
  return (
    <section id="work" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: springEase }}
          className="mb-16"
        >
          <p className="text-sm tracking-[0.3em] text-accent-cyber mb-4 font-mono">
            作品
          </p>
          <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-bold mb-4">
            Selected Work
          </h2>
          <p className="text-muted-foreground max-w-xl text-lg">
            From SaaS platforms to local businesses — delivering complete digital
            solutions with development, SEO, and marketing.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 gap-8"
        >
          {projects.map((project) => (
            <motion.a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              className="group relative block"
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.bgGradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

              <div className="relative h-full rounded-3xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden hover:border-white/20 transition-all duration-500">
                {/* Image/Preview Area */}
                <div className={`relative h-48 bg-gradient-to-br ${project.gradient} overflow-hidden`}>
                  {/* Browser mockup frame */}
                  <div className="absolute inset-2 bg-background/90 rounded-lg overflow-hidden shadow-2xl">
                    {/* Browser bar */}
                    <div className="h-6 bg-muted/50 flex items-center gap-1.5 px-3">
                      <div className="w-2 h-2 rounded-full bg-red-500/60" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                      <div className="w-2 h-2 rounded-full bg-green-500/60" />
                      <div className="ml-2 flex-1 h-3 bg-muted rounded-full max-w-32" />
                    </div>
                    {/* Preview content placeholder */}
                    <div className="h-full bg-gradient-to-br from-muted/20 to-muted/40 flex items-center justify-center">
                      <Globe className={`w-12 h-12 text-muted-foreground/30 group-hover:scale-110 transition-transform duration-500`} />
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r ${project.gradient} text-white`}>
                      {project.category}
                    </span>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </div>

                  <h3 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-full bg-muted/50 text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Enterprise Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: springEase }}
          className="mt-24 text-center"
        >
          <p className="text-sm text-muted-foreground mb-6">
            Enterprise & Industry Experience
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {enterpriseExperience.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2 px-5 py-3 rounded-full border border-border bg-card/30 hover:border-accent-cyber/50 transition-colors"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
