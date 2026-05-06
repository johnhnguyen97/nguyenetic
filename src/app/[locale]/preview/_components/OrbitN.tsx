"use client";

import type { CSSProperties } from "react";

interface OrbitNProps {
  size?: number;
  accent?: string;
  ink?: string;
  showLabel?: boolean;
  style?: CSSProperties;
}

export function OrbitN({
  size = 44,
  accent = "#FF8A3D",
  ink = "#F5F0E8",
  showLabel = true,
  style,
}: OrbitNProps) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 12, ...style }}>
      <svg viewBox="0 0 120 120" width={size} height={size} style={{ flexShrink: 0 }}>
        <ellipse
          cx="60"
          cy="60"
          rx="52"
          ry="22"
          fill="none"
          stroke={accent}
          strokeWidth="2"
          transform="rotate(-30 60 60)"
        />
        <text
          x="60"
          y="82"
          textAnchor="middle"
          fontFamily="var(--font-instrument), 'Instrument Serif', serif"
          fontSize="78"
          fontStyle="italic"
          fill={ink}
          fontWeight="400"
        >
          N
        </text>
        <circle cx="102" cy="38" r="6" fill={accent} />
      </svg>
      {showLabel && (
        <span
          style={{
            fontFamily: "var(--font-instrument), 'Instrument Serif', serif",
            fontSize: size * 0.5,
            letterSpacing: "-0.01em",
            color: ink,
          }}
        >
          nguyenetic
        </span>
      )}
    </div>
  );
}
