"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

const springEase = [0.22, 1, 0.36, 1] as const

const projects = [
  {
    title: "GoJUN",
    description: "Interactive Japanese learning platform with AI-powered flashcards and spaced repetition.",
    category: "Web Application",
    tags: ["React", "AI", "Education"],
    url: "https://gojun.vercel.app/",
    gradient: "from-violet-500/20 to-purple-500/20",
  },
  {
    title: "Fast Fix Whitemarsh",
    description: "Full-service phone repair business with online booking, SEO optimization, and local marketing.",
    category: "Business Website",
    tags: ["Next.js", "SEO", "Local Business"],
    url: "https://www.fastfixwhitemarsh.com/",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "EV Wrap",
    description: "Premium vehicle wrapping service with gallery showcase and quote system.",
    category: "Business Website",
    tags: ["Next.js", "E-commerce", "Automotive"],
    url: "https://evwrap-git-development-nguyenetics-projects.vercel.app/",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    title: "Ichiban",
    description: "Elegant Japanese restaurant website with menu integration and reservation system.",
    category: "Restaurant",
    tags: ["Next.js", "Sanity CMS", "Hospitality"],
    url: "https://ichiban-website-taupe.vercel.app/",
    gradient: "from-rose-500/20 to-pink-500/20",
  },
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
            A curated collection of projects showcasing web applications,
            business solutions, and digital experiences.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 gap-6"
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
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative h-full p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-accent-cyber/50 transition-all duration-300">
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs tracking-wider text-muted-foreground uppercase">
                    {project.category}
                  </span>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-accent-cyber group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-semibold mb-3 group-hover:text-accent-cyber transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
