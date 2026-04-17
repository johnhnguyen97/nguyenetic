"use client"

import { motion, type HTMLMotionProps } from "framer-motion"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

type GlassTileSize = "sm" | "md" | "lg"
type GlassTileTone = "resting" | "active" | "interactive"

interface GlassTileProps extends Omit<HTMLMotionProps<"div">, "size"> {
  size?: GlassTileSize
  tone?: GlassTileTone
  interactive?: boolean
  className?: string
}

const SIZE_MAP: Record<GlassTileSize, string> = {
  sm: "rounded-xl p-4",
  md: "rounded-2xl p-6",
  lg: "rounded-2xl p-8",
}

// Apple shadow rule: blur = 2.5–3× Y offset, opacity 0.04–0.10
// Resting: subtle cold elevation. Hover: warm ambient glow.
const TONE_MAP: Record<GlassTileTone, string> = {
  resting:
    "border border-warm/20 bg-ink/40 backdrop-blur-md shadow-[0_4px_12px_oklch(0.05_0.005_260/0.06)]",
  active:
    "border border-warm/60 bg-ink/60 backdrop-blur-md shadow-[0_8px_24px_oklch(0.74_0.15_55/0.08)]",
  interactive:
    "border border-warm/20 bg-ink/40 backdrop-blur-md shadow-[0_4px_12px_oklch(0.05_0.005_260/0.06)] transition-[border-color,box-shadow,background-color] duration-300 hover:border-warm/60 hover:bg-ink/55 hover:shadow-[0_8px_24px_oklch(0.74_0.15_55/0.08)] focus-within:border-warm/70 focus-within:shadow-[0_8px_24px_oklch(0.74_0.15_55/0.10)]",
}

export const GLASS_TILE_CLASSES = {
  resting: TONE_MAP.resting,
  active: TONE_MAP.active,
  interactive: TONE_MAP.interactive,
}

export const GlassTile = forwardRef<HTMLDivElement, GlassTileProps>(
  (
    { size = "md", tone = "resting", interactive, className, children, ...rest },
    ref,
  ) => {
    const effectiveTone = interactive ? "interactive" : tone
    return (
      <motion.div
        ref={ref}
        className={cn(SIZE_MAP[size], TONE_MAP[effectiveTone], className)}
        {...rest}
      >
        {children}
      </motion.div>
    )
  },
)
GlassTile.displayName = "GlassTile"
