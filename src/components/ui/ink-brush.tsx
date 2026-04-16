"use client"

import { motion } from "framer-motion"

interface InkBrushUnderlineProps {
  className?: string
  color?: string
  delay?: number
}

export function InkBrushUnderline({
  className,
  color = "oklch(0.74 0.15 55)",
  delay = 0,
}: InkBrushUnderlineProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 16"
      fill="none"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <motion.path
        d="M2 10 C 30 4, 60 12, 90 8 S 150 6, 180 11 T 238 7"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{
          pathLength: { duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.4, delay, ease: "easeOut" },
        }}
      />
    </svg>
  )
}
