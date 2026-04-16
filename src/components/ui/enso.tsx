"use client"

import { motion } from "framer-motion"

interface EnsoProps {
  className?: string
  size?: number
  strokeWidth?: number
  color?: string
  duration?: number
  delay?: number
}

export function Enso({
  className,
  size = 600,
  strokeWidth = 8,
  color = "oklch(0.74 0.15 55 / 0.4)",
  duration = 2.8,
  delay = 0.6,
}: EnsoProps) {
  const radius = size / 2 - strokeWidth * 2
  const circumference = 2 * Math.PI * radius
  const gap = circumference * 0.15
  const dash = circumference - gap

  const drawSettleTime = duration + delay

  return (
    <motion.svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      animate={{
        rotate: [0, 360],
        scale: [1, 1.025, 1],
      }}
      transition={{
        rotate: {
          duration: 72,
          ease: "linear",
          repeat: Infinity,
          delay: drawSettleTime,
        },
        scale: {
          duration: 5,
          ease: "easeInOut",
          repeat: Infinity,
          delay: drawSettleTime,
        },
      }}
      style={{ transformOrigin: "center" }}
    >
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
        initial={{ strokeDashoffset: dash, opacity: 0, rotate: 45 }}
        animate={{ strokeDashoffset: 0, opacity: 1, rotate: -135 }}
        transition={{
          strokeDashoffset: { duration, delay, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.6, delay, ease: "easeOut" },
          rotate: { duration: duration + 0.4, delay, ease: [0.22, 1, 0.36, 1] },
        }}
        style={{ transformOrigin: "center", transformBox: "fill-box" }}
      />
    </motion.svg>
  )
}
