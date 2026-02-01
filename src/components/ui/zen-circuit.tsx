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

        {/* Center kanji/symbol area */}
        <motion.circle
          cx="400"
          cy="400"
          r="60"
          fill="url(#centerGradient)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6, ease: springEase }}
        />

        {/* Center symbol - stylized "N" */}
        <motion.path
          d="M380 380 L380 420 L400 400 L420 420 L420 380"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8, ease: springEase }}
        />

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
            <stop offset="0%" stopColor="var(--color-accent-cyber)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-accent-sakura)" stopOpacity="0.1" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}
