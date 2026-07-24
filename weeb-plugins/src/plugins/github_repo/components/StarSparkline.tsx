import React from "react"
import type { StarHistoryPoint } from "../types"

// Linha + área, sem eixos/labels (é um "sentimento de tendência", não um gráfico
// analítico) - dados reais amostrados em fetchGithubRepo.ts, não uma curva inventada.
export function StarSparkline({ points, color }: { points: StarHistoryPoint[]; color: string }): React.ReactElement | null {
  if (points.length < 2) return null

  const width = 300
  const height = 56
  const counts = points.map((p) => p.count)
  const min = Math.min(...counts)
  const max = Math.max(...counts)
  const range = max - min || 1
  const stepX = width / (points.length - 1)

  const coords = points.map((p, i) => {
    const x = Math.round(i * stepX)
    const y = Math.round(height - ((p.count - min) / range) * (height - 4) - 2)
    return { x, y }
  })

  const linePath = `M ${coords.map((c) => `${c.x},${c.y}`).join(" L ")}`
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-14 w-full" preserveAspectRatio="none" aria-hidden="true">
      <path d={areaPath} fill={color} opacity={0.16} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
