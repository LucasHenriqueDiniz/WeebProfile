import React from "react"
import type { StarGraphVariant, StarHistoryPoint } from "../types"

interface StarSparklineProps {
  points: StarHistoryPoint[]
  color: string
  variant?: StarGraphVariant
  height?: number
}

function computeCoords(points: StarHistoryPoint[], width: number, height: number) {
  const counts = points.map((p) => p.count)
  const min = Math.min(...counts)
  const max = Math.max(...counts)
  const range = max - min || 1
  const stepX = width / (points.length - 1)
  // Margem vertical proporcional à altura - com o gráfico configurável pra ficar bem
  // maior, uma margem fixa de poucos px deixava de fazer sentido em alturas grandes.
  const padding = Math.max(4, height * 0.08)

  return points.map((p, i) => ({
    x: Math.round(i * stepX),
    y: Math.round(height - ((p.count - min) / range) * (height - padding * 2) - padding),
    count: p.count,
  }))
}

// "area" (10 Dark Area): linha + área preenchida, sem eixos/labels - "sentimento de
// tendência", não gráfico analítico. É o comportamento original do componente.
function AreaChart({ points, color, width, height }: { points: StarHistoryPoint[]; color: string; width: number; height: number }) {
  const coords = computeCoords(points, width, height)
  const linePath = `M ${coords.map((c) => `${c.x},${c.y}`).join(" L ")}`
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`

  return (
    <>
      <path d={areaPath} fill={color} opacity={0.16} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </>
  )
}

// "line" (09 Clean Line): só a linha, com grade horizontal leve por trás - mais
// "editorial", sem preenchimento.
function LineChart({ points, color, width, height }: { points: StarHistoryPoint[]; color: string; width: number; height: number }) {
  const coords = computeCoords(points, width, height)
  const linePath = `M ${coords.map((c) => `${c.x},${c.y}`).join(" L ")}`

  return (
    <>
      <g stroke="currentColor" strokeOpacity={0.12} strokeWidth={1}>
        <path d={`M0,${height * 0.15}H${width}`} />
        <path d={`M0,${height * 0.5}H${width}`} />
        <path d={`M0,${height * 0.85}H${width}`} />
      </g>
      <path d={linePath} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={coords[coords.length - 1]?.x} cy={coords[coords.length - 1]?.y} r={3.5} fill={color} />
    </>
  )
}

// "milestones" (11): mesma linha, mas marca alguns pontos com um círculo + o valor
// de estrelas naquele ponto - até 4 marcos igualmente espaçados.
function MilestonesChart({ points, color, width, height }: { points: StarHistoryPoint[]; color: string; width: number; height: number }) {
  const coords = computeCoords(points, width, height)
  const linePath = `M ${coords.map((c) => `${c.x},${c.y}`).join(" L ")}`
  const markCount = Math.min(4, coords.length)
  const markIndexes = Array.from({ length: markCount }, (_, i) => Math.round((i * (coords.length - 1)) / (markCount - 1 || 1)))

  return (
    <>
      <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {markIndexes.map((idx) => {
        const c = coords[idx]
        if (!c) return null
        const isLast = idx === coords.length - 1
        return (
          <g key={idx}>
            <circle cx={c.x} cy={c.y} r={4} fill="var(--default-color-surface, #fff)" stroke={color} strokeWidth={2.5} />
            <text
              x={Math.min(Math.max(c.x, 14), width - 14)}
              y={isLast ? Math.max(c.y - 10, 10) : Math.min(c.y + 18, height - 2)}
              fontSize={Math.min(11, Math.max(9, height * 0.09))}
              textAnchor="middle"
              fill="currentColor"
              opacity={0.65}
            >
              {c.count}★
            </text>
          </g>
        )
      })}
    </>
  )
}

// "bars" (12 Monthly Bars): converte os pontos amostrados em barras de crescimento
// (diferença entre pontos consecutivos) - aproximação de "novas estrelas por período",
// já que os pontos amostrados não são necessariamente meses exatos.
function BarsChart({ points, color, width, height }: { points: StarHistoryPoint[]; color: string; width: number; height: number }) {
  const deltas = points.slice(1).map((p, i) => Math.max(0, p.count - (points[i]?.count ?? 0)))
  const maxDelta = Math.max(...deltas, 1)
  const gap = 6
  const barWidth = (width - gap * (deltas.length - 1)) / deltas.length

  return (
    <g>
      {deltas.map((delta, i) => {
        const barHeight = Math.max(4, (delta / maxDelta) * (height - 6))
        const x = i * (barWidth + gap)
        const y = height - barHeight
        return <rect key={i} x={x} y={y} width={barWidth} height={barHeight} rx={3} fill={color} opacity={0.85} />
      })}
    </g>
  )
}

// "gradient" (13 Sparkline Gradient): linha com stroke em gradiente de duas cores +
// linha de base pontilhada - pensado pra ficar ao lado de outros stats compactos.
function GradientChart({ points, color, width, height, gradientId }: { points: StarHistoryPoint[]; color: string; width: number; height: number; gradientId: string }) {
  const coords = computeCoords(points, width, height)
  const linePath = `M ${coords.map((c) => `${c.x},${c.y}`).join(" L ")}`

  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1">
          <stop stopColor={color} />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <path d={`M0,${height - 2}H${width}`} stroke="currentColor" strokeOpacity={0.25} strokeDasharray="4 6" />
      <path d={linePath} fill="none" stroke={`url(#${gradientId})`} strokeWidth={3} strokeLinecap="round" />
    </>
  )
}

// Dados reais amostrados em fetchGithubRepo.ts, não uma curva inventada - cada
// variante só muda a forma de desenhar os mesmos pontos.
// Altura default subiu de 56 pra 120 - o gráfico era pequeno/apagado demais pra ser
// a peça central da seção; height é configurável via star_graph_chart_height.
export function StarSparkline({ points, color, variant = "area", height = 120 }: StarSparklineProps): React.ReactElement | null {
  const gradientId = React.useId()
  if (points.length < 2) return null

  const width = 300

  return (
    // xmlns é obrigatório: este svg vive dentro do foreignObject (namespace XHTML) do
    // SVG final — sem declarar o namespace ele vira elemento XHTML desconhecido e o
    // gráfico simplesmente não pinta quando o arquivo é servido como .svg.
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      style={{ height }}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {variant === "line" && <LineChart points={points} color={color} width={width} height={height} />}
      {variant === "milestones" && <MilestonesChart points={points} color={color} width={width} height={height} />}
      {variant === "bars" && <BarsChart points={points} color={color} width={width} height={height} />}
      {variant === "gradient" && <GradientChart points={points} color={color} width={width} height={height} gradientId={gradientId} />}
      {variant === "area" && <AreaChart points={points} color={color} width={width} height={height} />}
    </svg>
  )
}
