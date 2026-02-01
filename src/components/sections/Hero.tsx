"use client"

import { motion } from "framer-motion"

const springEase = [0.22, 1, 0.36, 1] as const

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: springEase,
    },
  }),
}

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      delay: 0.8,
      duration: 1.2,
      ease: springEase,
    },
  },
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-cyber/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-sakura/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Japanese decorative text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="text-sm tracking-[0.5em] text-muted-foreground mb-8 font-mono"
        >
          技術と美学の融合
        </motion.p>

        {/* Main heading */}
        <div className="space-y-2">
          <motion.h1
            custom={0}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-[clamp(3rem,8vw,6rem)] font-bold tracking-tight leading-none"
          >
            <span className="text-gradient-cyber">Nguyenetic</span>
          </motion.h1>

          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-[clamp(1.25rem,3vw,2rem)] text-muted-foreground font-light"
          >
            Digital Craftsmanship
          </motion.div>
        </div>

        {/* Decorative line */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={lineVariants}
          className="w-24 h-px bg-gradient-to-r from-transparent via-accent-cyber to-transparent mx-auto mt-12 origin-center"
        />

        {/* Tagline */}
        <motion.p
          custom={3}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="mt-8 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
        >
          Building elegant solutions at the intersection of
          <span className="text-foreground"> design</span> and
          <span className="text-foreground"> technology</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="mt-12 flex items-center justify-center gap-4"
        >
          <a
            href="#work"
            className="group relative px-8 py-3 bg-foreground text-background rounded-full font-medium transition-all hover:scale-105"
          >
            <span className="relative z-10">View Work</span>
            <div className="absolute inset-0 rounded-full bg-accent-cyber opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
          </a>
          <a
            href="#contact"
            className="px-8 py-3 border border-border rounded-full font-medium text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-all"
          >
            Get in Touch
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border border-border/50 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 bg-muted-foreground rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
