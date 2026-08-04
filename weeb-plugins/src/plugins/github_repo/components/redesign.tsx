import React from "react"
import type { StarHistoryPoint } from "../types"

// Primitivas compartilhadas do redesign do plugin Repository.
//
// Regras do design system:
// - Cores SEMPRE via variáveis de tema (--default-color-*); a única exceção são as
//   cores de linguagem, que vêm dos dados do GitHub.
// - Tons "soft" do highlight via color-mix (o CSS base do projeto já depende dele).
// - Cada seção é um card autocontido (sem DefaultTitle em cima).

export const HL = "var(--default-color-highlight)"
export const HL_SOFT = "color-mix(in srgb, var(--default-color-highlight) 14%, transparent)"
export const HL_SOFTER = "color-mix(in srgb, var(--default-color-highlight) 7%, transparent)"
export const SUCCESS = "var(--default-color-success)"
export const TEXT = "var(--default-color-default)"
export const MUTED = "var(--default-color-muted)"
export const MUTED_LIGHT = "var(--default-color-muted-light)"

// Contadores no formato compacto do GitHub (1.2k, 34k) - números crus com 5+ dígitos
// quebram o layout dos cards mais apertados.
export function formatCount(value: number): string {
  if (value >= 10000) return `${Math.round(value / 1000)}k`
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`
  return String(value)
}

// Crescimento percentual aproximado no último "período" da amostra de starHistory
// (últimos ~2 pontos da amostragem). Retorna null quando não dá pra afirmar nada.
export function computeStarDelta(history: StarHistoryPoint[]): { pct: number; label: string } | null {
  if (!history || history.length < 2) return null
  const last = history[history.length - 1]
  const prev = history[history.length - 2]
  if (!last || !prev || prev.count <= 0) return null
  const pct = Math.round(((last.count - prev.count) / prev.count) * 100)
  if (pct <= 0) return null
  return { pct, label: `▲ +${pct}%` }
}

// Frame do card - todas as seções do plugin usam este contorno.
export function Card({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}): React.ReactElement {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-default-border ${className}`}
      style={{ background: "var(--default-color-surface)", ...style }}
    >
      {children}
    </div>
  )
}

export function Eyebrow({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}): React.ReactElement {
  return (
    <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-default-muted-light" style={style}>
      {children}
    </div>
  )
}

export function Delta({
  delta,
  className = "",
}: {
  delta: { label: string } | null
  className?: string
}): React.ReactElement {
  if (!delta) return <></>
  return (
    <span className={`text-xs font-medium ${className}`} style={{ color: SUCCESS }}>
      {delta.label}
    </span>
  )
}

export function DotSep(): React.ReactElement {
  return <span className="h-[3px] w-[3px] flex-shrink-0 rounded-full bg-default-muted-light" />
}

export function LangDot({ color, size = 8 }: { color: string; size?: number }): React.ReactElement {
  return (
    <span
      className="inline-block flex-shrink-0 rounded-full"
      style={{ width: size, height: size, background: color }}
    />
  )
}

// Coordenadas normalizadas do histórico de estrelas para desenhar em um viewBox
// width x height (0,0 no topo). Mantém margem vertical proporcional.
export function starCoords(
  points: StarHistoryPoint[],
  width: number,
  height: number,
  padRatio = 0.1
): Array<{ x: number; y: number; count: number }> {
  const counts = points.map((p) => p.count)
  const min = Math.min(...counts)
  const max = Math.max(...counts)
  const range = max - min || 1
  const stepX = width / (points.length - 1)
  const pad = Math.max(4, height * padRatio)
  return points.map((p, i) => ({
    x: Math.round(i * stepX * 10) / 10,
    y: Math.round((height - ((p.count - min) / range) * (height - pad * 2) - pad) * 10) / 10,
    count: p.count,
  }))
}

// Cabeçalho padrão das seções de gráfico: número gigante + "stars" + delta.
export function StarsHead({
  count,
  delta,
  eyebrow,
}: {
  count: number
  delta: { label: string } | null
  eyebrow?: string
}): React.ReactElement {
  return (
    <div className="flex items-start justify-between px-[18px] pt-4">
      <div>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <div className={`flex items-baseline gap-2 ${eyebrow ? "mt-1.5" : ""}`}>
          <span className="text-[28px] font-semibold leading-none tracking-[-0.02em] text-default-text">
            {formatCount(count)}
          </span>
          <span className="text-[13px] text-default-muted">stars</span>
        </div>
      </div>
      <Delta delta={delta} />
    </div>
  )
}
