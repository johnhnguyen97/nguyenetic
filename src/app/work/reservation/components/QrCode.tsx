"use client"

// Generates a deterministic QR-like SVG from a seed string.
// Not a real QR spec — purely decorative but looks convincingly real.
function seededRandom(seed: string): () => number {
  let h = 0x811c9dc5
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return () => {
    h ^= h << 13
    h ^= h >> 17
    h ^= h << 5
    return (h >>> 0) / 0xffffffff
  }
}

interface QrCodeProps {
  value: string
  size?: number
  className?: string
}

export function QrCode({ value, size = 160, className = "" }: QrCodeProps) {
  const modules = 21
  const rng = seededRandom(value)
  const cellSize = size / modules

  // Generate module grid
  const grid: boolean[][] = Array.from({ length: modules }, () =>
    Array.from({ length: modules }, () => rng() > 0.5)
  )

  // Enforce finder patterns (top-left, top-right, bottom-left) — 7x7 solid squares
  const finderPattern = (startRow: number, startCol: number) => {
    for (let r = startRow; r < startRow + 7; r++) {
      for (let c = startCol; c < startCol + 7; c++) {
        const dr = r - startRow
        const dc = c - startCol
        // Outer ring
        if (dr === 0 || dr === 6 || dc === 0 || dc === 6) {
          grid[r][c] = true
        } else if (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4) {
          // Inner 3x3
          grid[r][c] = true
        } else {
          grid[r][c] = false
        }
      }
    }
    // Separator (quiet zone)
    for (let i = startRow; i < startRow + 8 && i < modules; i++) {
      if (startCol + 7 < modules) grid[i][startCol + 7] = false
    }
    for (let j = startCol; j < startCol + 8 && j < modules; j++) {
      if (startRow + 7 < modules) grid[startRow + 7][j] = false
    }
  }

  finderPattern(0, 0)
  finderPattern(0, modules - 7)
  finderPattern(modules - 7, 0)

  // Timing patterns
  for (let i = 8; i < modules - 8; i++) {
    grid[6][i] = i % 2 === 0
    grid[i][6] = i % 2 === 0
  }

  const cells: { x: number; y: number }[] = []
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (grid[r][c]) {
        cells.push({ x: c * cellSize, y: r * cellSize })
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-label="Reservation QR code for check-in"
      role="img"
    >
      <rect width={size} height={size} fill="white" rx="4" />
      {cells.map(({ x, y }, i) => (
        <rect
          key={i}
          x={x + 0.5}
          y={y + 0.5}
          width={cellSize - 1}
          height={cellSize - 1}
          fill="#080618"
          rx="0.5"
        />
      ))}
    </svg>
  )
}
