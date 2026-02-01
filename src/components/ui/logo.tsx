"use client"

import { motion } from "framer-motion"

interface LogoProps {
  className?: string
  animated?: boolean
  size?: "sm" | "md" | "lg" | "xl" | "hero"
}

export function Logo({ className = "", animated = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
    hero: "w-32 h-32",
  }

  const LogoSVG = () => (
    <svg
      viewBox="0 0 100 100"
      className={`${sizeClasses[size]} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Main gradient - cyber to sakura to gold */}
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-accent-cyber)" />
          <stop offset="50%" stopColor="var(--color-accent-sakura)" />
          <stop offset="100%" stopColor="var(--color-accent-gold)" />
        </linearGradient>
        {/* Glow filter for that ethereal feel */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Brush stroke filter for Japanese aesthetic */}
        <filter id="brushStroke" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      {/* Outer Enso - incomplete circle for wabi-sabi imperfection */}
      <motion.path
        d="M50 6 C78 6 94 22 94 50 C94 78 78 94 50 94 C22 94 6 78 6 50"
        stroke="url(#logoGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        filter="url(#glow)"
        initial={animated ? { pathLength: 0 } : { pathLength: 0.88 }}
        animate={{ pathLength: 0.88 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      />

      {/* Inner mon-style ring - represents tradition meeting tech */}
      <motion.circle
        cx="50"
        cy="50"
        r="35"
        stroke="url(#logoGradient)"
        strokeWidth="0.8"
        strokeDasharray="3 6"
        fill="none"
        opacity="0.4"
        initial={animated ? { rotate: 0 } : undefined}
        animate={animated ? { rotate: 360 } : undefined}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      />

      {/* The "N" - proper calligraphic N with brush stroke style */}
      <motion.path
        d="M30 72 L30 28 L70 72 L70 28"
        stroke="url(#logoGradient)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#glow)"
        initial={animated ? { pathLength: 0 } : { pathLength: 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
      />

      {/* Brush accent dots - like ink splatters in calligraphy */}
      {[
        { cx: 30, cy: 28, delay: 0 },
        { cx: 70, cy: 28, delay: 0.1 },
        { cx: 30, cy: 72, delay: 0.2 },
        { cx: 70, cy: 72, delay: 0.3 },
      ].map((dot, i) => (
        <motion.circle
          key={i}
          cx={dot.cx}
          cy={dot.cy}
          r="3.5"
          fill="url(#logoGradient)"
          initial={animated ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1 + dot.delay, duration: 0.3, ease: "easeOut" }}
        />
      ))}

      {/* Subtle decorative element - tiny tomoe-inspired swirl */}
      <motion.path
        d="M50 42 Q55 47 50 52 Q45 47 50 42"
        fill="url(#logoGradient)"
        opacity="0.6"
        initial={animated ? { scale: 0 } : { scale: 1 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, duration: 0.4 }}
      />

      {/* Energy particles flowing through - tech element */}
      {animated && (
        <>
          <motion.circle
            r="1.5"
            fill="var(--color-accent-cyber)"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              cx: [30, 50, 70],
              cy: [28, 50, 72],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: 2,
              ease: "easeInOut",
            }}
          />
          <motion.circle
            r="1.5"
            fill="var(--color-accent-sakura)"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              cx: [70, 50, 30],
              cy: [28, 50, 72],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: 2.5,
              ease: "easeInOut",
            }}
          />
        </>
      )}
    </svg>
  )

  return <LogoSVG />
}

// Static version for favicon/og image - with dark background for visibility
export function LogoStatic({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradientStatic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* Dark background circle for favicon visibility */}
      <circle cx="50" cy="50" r="48" fill="#0a0a0a" />

      {/* Outer Enso - incomplete circle */}
      <path
        d="M50 6 C78 6 94 22 94 50 C94 78 78 94 50 94 C22 94 6 78 6 50"
        stroke="url(#logoGradientStatic)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Inner decorative ring */}
      <circle
        cx="50"
        cy="50"
        r="35"
        stroke="url(#logoGradientStatic)"
        strokeWidth="1"
        strokeDasharray="3 6"
        fill="none"
        opacity="0.5"
      />

      {/* The "N" - proper calligraphic N */}
      <path
        d="M30 72 L30 28 L70 72 L70 28"
        stroke="url(#logoGradientStatic)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Brush accent dots */}
      <circle cx="30" cy="28" r="4" fill="url(#logoGradientStatic)" />
      <circle cx="70" cy="28" r="4" fill="url(#logoGradientStatic)" />
      <circle cx="30" cy="72" r="4" fill="url(#logoGradientStatic)" />
      <circle cx="70" cy="72" r="4" fill="url(#logoGradientStatic)" />

      {/* Center tomoe accent */}
      <path
        d="M50 42 Q55 47 50 52 Q45 47 50 42"
        fill="url(#logoGradientStatic)"
        opacity="0.7"
      />
    </svg>
  )
}

// Hero version - larger with more dramatic animations for the center of the orbit
export function LogoHero({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-cyber/20 via-accent-sakura/10 to-accent-gold/20 blur-xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main logo */}
      <Logo size="hero" animated={true} className="relative z-10" />

      {/* Rotating outer accent */}
      <motion.div
        className="absolute inset-[-20%] border border-accent-cyber/20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  )
}
