"use client"

import { useId } from "react"
import { useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface OrbitNProps {
  size?: number
  showLabel?: boolean
  className?: string
  /** aria-label for the whole mark; only used when showLabel is false */
  label?: string
  /** Seconds for one full orbit. Default 14s. */
  orbitSeconds?: number
  /** Disable the satellite animation regardless of motion preference. */
  animate?: boolean
}

/**
 * Orbit-N mark: italic N with a tilted orbit ring. The satellite travels
 * a horizontal ellipse in local coords; a parent rotate(-30) tilts the plane.
 * Two satellite instances are layered: the "back" one renders under the N
 * (visible while tracing the far half of the orbit), the "front" one over
 * the N (visible while tracing the near half) — giving a 3D orbit read.
 */
export function OrbitN({
  size = 44,
  showLabel = true,
  className,
  label = "nguyenetic",
  orbitSeconds = 14,
  animate = true,
}: OrbitNProps) {
  const pathId = useId().replace(/:/g, "") + "-orbit"
  const reduceMotion = useReducedMotion()
  const motion = animate && !reduceMotion
  const dur = `${orbitSeconds}s`

  return (
    <span
      className={cn("inline-flex items-center gap-3", className)}
      aria-label={showLabel ? undefined : label}
      role={showLabel ? undefined : "img"}
    >
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        className="shrink-0"
        aria-hidden={showLabel ? undefined : "true"}
        focusable="false"
      >
        <defs>
          <path
            id={pathId}
            d="M -52 0 A 52 22 0 1 0 52 0 A 52 22 0 1 0 -52 0"
            fill="none"
          />
        </defs>

        <ellipse
          cx="60"
          cy="60"
          rx="52"
          ry="22"
          fill="none"
          stroke="var(--color-warm)"
          strokeWidth="2"
          transform="rotate(-30 60 60)"
        />

        {/* Back-half satellite — rendered under the N, visible only during
            the second half of the path (the far/top arc of the tilted orbit). */}
        <g transform="translate(60 60) rotate(-30)">
          <circle
            cx={motion ? 0 : 42}
            cy={motion ? 0 : -22}
            r="6"
            fill="var(--color-warm)"
            opacity={motion ? 0 : 1}
          >
            {motion && (
              <>
                <animateMotion dur={dur} repeatCount="indefinite">
                  <mpath href={`#${pathId}`} />
                </animateMotion>
                <animate
                  attributeName="opacity"
                  dur={dur}
                  repeatCount="indefinite"
                  values="0;0;1;1"
                  keyTimes="0;0.5;0.5;1"
                />
              </>
            )}
          </circle>
        </g>

        <text
          x="60"
          y="82"
          textAnchor="middle"
          fontFamily="var(--font-instrument), serif"
          fontSize="78"
          fontStyle="italic"
          fill="var(--color-paper)"
          fontWeight="400"
        >
          N
        </text>

        {/* Front-half satellite — renders above the N, visible only during
            the first half of the path (the near/bottom arc of the tilted orbit). */}
        <g transform="translate(60 60) rotate(-30)">
          <circle
            cx={motion ? 0 : 0}
            cy={motion ? 0 : 0}
            r="6"
            fill="var(--color-warm)"
            opacity={motion ? 1 : 0}
          >
            {motion && (
              <>
                <animateMotion dur={dur} repeatCount="indefinite">
                  <mpath href={`#${pathId}`} />
                </animateMotion>
                <animate
                  attributeName="opacity"
                  dur={dur}
                  repeatCount="indefinite"
                  values="1;1;0;0"
                  keyTimes="0;0.5;0.5;1"
                />
              </>
            )}
          </circle>
        </g>
      </svg>
      {showLabel && (
        <span
          className="font-[family-name:var(--font-instrument)] text-paper leading-none tracking-tight"
          style={{ fontSize: size * 0.5 }}
        >
          nguyenetic
        </span>
      )}
    </span>
  )
}
