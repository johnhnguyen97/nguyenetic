"use client"

import { motion } from "framer-motion"

const PETAL_COUNT = 28

const petalConfigs = Array.from({ length: PETAL_COUNT }, (_, i) => ({
  id: i,
  startX: (i * 37 + 13) % 100,
  delay: (i * 0.73) % 18,
  duration: 14 + ((i * 3.3) % 10),
  size: 10 + ((i * 2.7) % 8),
  drift: (((i * 17) % 120) - 60),
  hueShift: (i * 11) % 30,
}))

export function SakuraPetals() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {petalConfigs.map((p) => (
        <motion.svg
          key={p.id}
          viewBox="0 0 16 16"
          width={p.size}
          height={p.size}
          className="absolute"
          style={{
            left: `${p.startX}%`,
            top: "-20px",
            color: `oklch(0.88 0.06 ${355 + p.hueShift})`,
          }}
          initial={{ y: -40, x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, p.drift, -p.drift / 2, p.drift],
            rotate: [0, 180, 360],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.15, 0.85, 1],
          }}
        >
          <path
            d="M8 1.5 C 4 3.5, 3.5 12, 8 14.5 C 12.5 12, 12 3.5, 8 1.5 Z"
            fill="currentColor"
          />
          <path
            d="M8 4 C 6 5, 6 11, 8 12 C 10 11, 10 5, 8 4 Z"
            fill="currentColor"
            opacity={0.5}
          />
        </motion.svg>
      ))}
    </div>
  )
}
