"use client"

import { motion } from "framer-motion"

const springEase = [0.22, 1, 0.36, 1] as const

interface ZenCircuitProps {
  className?: string
}

export function ZenCircuit({ className }: ZenCircuitProps) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 800 800"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Enso circle - hand-drawn style */}
        <motion.path
          d="M400 100 C550 100 700 250 700 400 C700 550 550 700 400 700 C250 700 100 550 100 400 C100 250 250 100 400 100"
          stroke="url(#ensoGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 0.85, opacity: 1 }}
          transition={{ duration: 2, ease: springEase }}
        />

        {/* Inner rotating ring */}
        <motion.circle
          cx="400"
          cy="400"
          r="200"
          stroke="url(#innerGradient)"
          strokeWidth="1"
          strokeDasharray="10 20"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6, rotate: 360 }}
          transition={{
            opacity: { duration: 1, delay: 0.5 },
            rotate: { duration: 60, repeat: Infinity, ease: "linear" },
          }}
          style={{ transformOrigin: "center" }}
        />

        {/* Circuit nodes */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const radius = 280
          const x = 400 + radius * Math.cos((angle * Math.PI) / 180)
          const y = 400 + radius * Math.sin((angle * Math.PI) / 180)
          return (
            <motion.g key={angle}>
              {/* Node */}
              <motion.circle
                cx={x}
                cy={y}
                r="8"
                fill="url(#nodeGradient)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.5, ease: springEase }}
              />
              {/* Pulse effect */}
              <motion.circle
                cx={x}
                cy={y}
                r="8"
                fill="none"
                stroke="url(#nodeGradient)"
                strokeWidth="1"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut",
                }}
              />
              {/* Connection line to center */}
              <motion.line
                x1={x}
                y1={y}
                x2="400"
                y2="400"
                stroke="url(#lineGradient)"
                strokeWidth="1"
                strokeDasharray="5 10"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ delay: 1 + i * 0.1, duration: 0.8, ease: springEase }}
              />
            </motion.g>
          )
        })}

        {/* Center Logo Background - glowing circle */}
        <motion.circle
          cx="400"
          cy="400"
          r="90"
          fill="url(#centerGradient)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6, ease: springEase }}
        />

        {/* Center Logo - The "N" with Japanese aesthetic */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6, ease: springEase }}
        >
          {/* Outer Enso for logo */}
          <motion.path
            d="M400 320 C456 320 500 364 500 400 C500 456 456 500 400 500 C344 500 300 456 300 400"
            stroke="url(#logoEnsoGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 0.88 }}
            transition={{ delay: 1.6, duration: 1.2, ease: "easeOut" }}
          />

          {/* Inner decorative ring */}
          <circle
            cx="400"
            cy="400"
            r="55"
            stroke="url(#logoEnsoGradient)"
            strokeWidth="1"
            strokeDasharray="3 6"
            fill="none"
            opacity="0.4"
          />

          {/* The "N" - proper calligraphic style */}
          <motion.path
            d="M360 456 L360 344 L440 456 L440 344"
            stroke="url(#logoEnsoGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.8, duration: 1, ease: "easeOut" }}
          />

          {/* Brush accent dots */}
          {[
            { cx: 360, cy: 344 },
            { cx: 440, cy: 344 },
            { cx: 360, cy: 456 },
            { cx: 440, cy: 456 },
          ].map((dot, i) => (
            <motion.circle
              key={i}
              cx={dot.cx}
              cy={dot.cy}
              r="6"
              fill="url(#logoEnsoGradient)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2.2 + i * 0.1, duration: 0.3 }}
            />
          ))}

          {/* Center tomoe accent */}
          <motion.path
            d="M400 384 Q410 394 400 404 Q390 394 400 384"
            fill="url(#logoEnsoGradient)"
            opacity="0.6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2.6, duration: 0.3 }}
          />
        </motion.g>

        {/* Floating data points */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180
          const radius = 150 + Math.random() * 100
          const x = 400 + radius * Math.cos(angle)
          const y = 400 + radius * Math.sin(angle)
          return (
            <motion.circle
              key={`dot-${i}`}
              cx={x}
              cy={y}
              r="2"
              fill="currentColor"
              className="text-accent-cyber/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          )
        })}

        {/* Energy particles flowing to center */}
        <motion.circle
          r="4"
          fill="var(--color-accent-cyber)"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
            cx: [280, 340, 400],
            cy: [280, 340, 400],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 3,
            ease: "easeInOut",
          }}
        />
        <motion.circle
          r="4"
          fill="var(--color-accent-sakura)"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
            cx: [520, 460, 400],
            cy: [520, 460, 400],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 3.5,
            ease: "easeInOut",
          }}
        />

        {/* Gradients */}
        <defs>
          <linearGradient id="ensoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent-cyber)" />
            <stop offset="50%" stopColor="var(--color-accent-sakura)" />
            <stop offset="100%" stopColor="var(--color-accent-gold)" />
          </linearGradient>
          <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent-cyber)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--color-accent-sakura)" stopOpacity="0.5" />
          </linearGradient>
          <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-accent-cyber)" />
            <stop offset="100%" stopColor="var(--color-accent-sakura)" />
          </radialGradient>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent-cyber)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-accent-cyber)" stopOpacity="0.15" />
            <stop offset="70%" stopColor="var(--color-accent-sakura)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="logoEnsoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent-cyber)" />
            <stop offset="50%" stopColor="var(--color-accent-sakura)" />
            <stop offset="100%" stopColor="var(--color-accent-gold)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
