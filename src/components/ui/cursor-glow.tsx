"use client"

import { useEffect } from "react"
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion"

export function CursorGlow() {
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const springX = useSpring(x, { stiffness: 120, damping: 25 })
  const springY = useSpring(y, { stiffness: 120, damping: 25 })

  useEffect(() => {
    if (reduceMotion) return
    const handler = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener("mousemove", handler)
    return () => window.removeEventListener("mousemove", handler)
  }, [x, y, reduceMotion])

  if (reduceMotion) return null

  return (
    <div
      className="fixed inset-0 z-[99] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, oklch(0.74 0.15 55 / 0.10) 0%, oklch(0.74 0.15 55 / 0.04) 30%, transparent 60%)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  )
}
