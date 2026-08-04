import React from "react"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import { resolveStarGraphVariant } from "../types"
import type { GithubRepoConfig, GithubRepoData, StarHistoryPoint } from "../types"
import { ScaledBox } from "./ScaledBox"
import { Card, Delta, Eyebrow, HL, StarsHead, computeStarDelta, formatCount, starCoords } from "./redesign"

interface StarGraphProps {
  config: GithubRepoConfig
  data: GithubRepoData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

const CHART_W = 415
const CHART_H = 110

function monthLabel(dateIso: string): string {
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
  const d = new Date(dateIso)
  return months[d.getUTCMonth()] ?? ""
}

// Gradiente de preenchimento vertical do highlight (área/overview compartilham).
export function HlFillGradient({ id, strength = 0.22 }: { id: string; strength?: number }): React.ReactElement {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="var(--default-color-highlight)" stopOpacity={strength} />
        <stop offset="1" stopColor="var(--default-color-highlight)" stopOpacity="0" />
      </linearGradient>
    </defs>
  )
}

function AreaChart({ points, gradientId }: { points: StarHistoryPoint[]; gradientId: string }): React.ReactElement {
  const coords = starCoords(points, CHART_W, CHART_H)
  const line = `M ${coords.map((c) => `${c.x},${c.y}`).join(" L ")}`
  const last = coords[coords.length - 1]
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      preserveAspectRatio="none"
      className="mt-2 w-full"
      style={{ height: CHART_H }}
      aria-hidden="true"
    >
      <HlFillGradient id={gradientId} />
      <path d={`${line} L ${CHART_W},${CHART_H} L 0,${CHART_H} Z`} fill={`url(#${gradientId})`} />
      <path d={line} fill="none" stroke={HL} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      {last && (
        <>
          <circle cx={last.x - 6} cy={last.y} r={4.5} fill={HL} />
          <circle cx={last.x - 6} cy={last.y} r={8} fill={HL} opacity={0.18} />
        </>
      )}
    </svg>
  )
}

function BarsChart({ points }: { points: StarHistoryPoint[] }): React.ReactElement {
  const deltas = points.slice(1).map((p, i) => Math.max(0, p.count - (points[i]?.count ?? 0)))
  const maxDelta = Math.max(...deltas, 1)
  const first = points[0]
  const last = points[points.length - 1]
  return (
    <>
      <div className="flex flex-1 items-end gap-1.5 px-[18px] pt-3" style={{ minHeight: 84 }}>
        {deltas.map((d, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-[5px]"
            style={{
              height: `${Math.max(8, (d / maxDelta) * 100)}%`,
              background: HL,
              opacity: 0.25 + (0.75 * i) / Math.max(1, deltas.length - 1),
            }}
          />
        ))}
      </div>
      <div className="flex justify-between px-[18px] pb-3 pt-1.5 text-[10px] text-default-muted-light">
        <span>{first ? monthLabel(first.date) : ""}</span>
        <span>{last ? monthLabel(last.date) : ""}</span>
      </div>
    </>
  )
}

// "milestones": linha do tempo de marcos redondos (100, 500, 1k...) cruzados de
// verdade pelo histórico + o próximo alvo.
function MilestonesChart({ points }: { points: StarHistoryPoint[] }): React.ReactElement {
  const total = points[points.length - 1]?.count ?? 0
  const targets = [10, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000]
  const crossed = targets.filter((t) => total >= t).slice(-2)
  const next = targets.find((t) => t > total) ?? total * 2

  const crossDate = (target: number): string => {
    const p = points.find((pt) => pt.count >= target)
    if (!p) return ""
    const d = new Date(p.date)
    return `${monthLabel(p.date)} ${String(d.getUTCFullYear()).slice(2)}`
  }

  // posição atual na régua: fração do caminho até o próximo marco
  const progress = Math.min(0.92, Math.max(0.35, total / next))

  return (
    <div className="px-[18px] pb-4">
      <Eyebrow>Star milestones</Eyebrow>
      <div className="relative mt-3.5 h-1 rounded-full bg-default-muted/10">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, color-mix(in srgb, ${HL} 50%, transparent), ${HL})`,
          }}
        />
        {crossed.map((t, i) => (
          <div
            key={t}
            className="absolute top-[-4px] h-3 w-3 rounded-full"
            style={{ left: `${(i / Math.max(1, crossed.length)) * (progress * 72)}%`, background: HL }}
          />
        ))}
        <div
          className="absolute top-[-6px] h-4 w-4 rounded-full"
          style={{
            left: `calc(${progress * 100}% - 8px)`,
            background: HL,
            boxShadow: `0 0 0 4px color-mix(in srgb, ${HL} 14%, transparent)`,
          }}
        />
        <div
          className="absolute right-0 top-[-4px] h-3 w-3 rounded-full border-2 bg-default-surface"
          style={{ borderColor: "color-mix(in srgb, var(--default-color-muted) 35%, transparent)" }}
        />
      </div>
      <div className="mt-3.5 flex justify-between text-[11px] text-default-muted">
        {crossed.map((t) => (
          <span key={t}>
            <b className="text-default-text">{formatCount(t)}</b>
            <br />
            {crossDate(t)}
          </span>
        ))}
        <span className="text-center">
          <b style={{ color: HL }}>{formatCount(total)}</b>
          <br />
          today
        </span>
        <span className="text-right">
          <b className="text-default-muted-light">{formatCount(next)}</b>
          <br />
          next
        </span>
      </div>
    </div>
  )
}

function SparklineChart({
  points,
  gradientId,
}: {
  points: StarHistoryPoint[]
  gradientId: string
}): React.ReactElement {
  const W = 240
  const H = 76
  const coords = starCoords(points, W, H, 0.12)
  const line = `M ${coords.map((c) => `${c.x},${c.y}`).join(" L ")}`
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="h-full flex-1"
      aria-hidden="true"
    >
      <HlFillGradient id={gradientId} strength={0.14} />
      <path d={`${line} L ${W},${H} L 0,${H} Z`} fill={`url(#${gradientId})`} />
      <path d={line} fill="none" stroke={HL} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StepsChart({ points, gradientId }: { points: StarHistoryPoint[]; gradientId: string }): React.ReactElement {
  const coords = starCoords(points, CHART_W, CHART_H)
  const steps: string[] = []
  coords.forEach((c, i) => {
    if (i === 0) steps.push(`M ${c.x},${c.y}`)
    else steps.push(`L ${c.x},${coords[i - 1]?.y ?? c.y}`, `L ${c.x},${c.y}`)
  })
  const line = steps.join(" ")
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      preserveAspectRatio="none"
      className="mt-2 w-full"
      style={{ height: CHART_H }}
      aria-hidden="true"
    >
      <HlFillGradient id={gradientId} strength={0.1} />
      <path d={`${line} L ${CHART_W},${CHART_H} L 0,${CHART_H} Z`} fill={`url(#${gradientId})`} />
      <path d={line} fill="none" stroke={HL} strokeWidth={2.5} strokeLinejoin="round" />
    </svg>
  )
}

function DotsChart({ points }: { points: StarHistoryPoint[] }): React.ReactElement {
  const coords = starCoords(points, CHART_W - 40, CHART_H - 20).map((c) => ({ ...c, x: c.x + 20, y: c.y + 10 }))
  const line = `M ${coords.map((c) => `${c.x},${c.y}`).join(" L ")}`
  const last = coords[coords.length - 1]
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      className="mt-2 w-full"
      style={{ height: CHART_H }}
      aria-hidden="true"
    >
      {[0.18, 0.5, 0.85].map((f) => (
        <line
          key={f}
          x1={18}
          y1={CHART_H * f}
          x2={CHART_W - 18}
          y2={CHART_H * f}
          stroke="color-mix(in srgb, var(--default-color-muted) 22%, transparent)"
          strokeDasharray="3 5"
        />
      ))}
      <path d={line} fill="none" stroke={HL} strokeWidth={1.5} opacity={0.5} />
      {coords.slice(0, -1).map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r={4} fill={HL} />
      ))}
      {last && (
        <>
          <circle cx={last.x} cy={last.y} r={5.5} fill={HL} />
          <circle cx={last.x} cy={last.y} r={10} fill={HL} opacity={0.15} />
        </>
      )}
    </svg>
  )
}

// Gráfico do estilo terminal (herda o comportamento pré-redesign, alturas calibradas).
function TerminalChart({ points }: { points: StarHistoryPoint[] }): React.ReactElement {
  const coords = starCoords(points, 300, 120)
  const line = `M ${coords.map((c) => `${c.x},${c.y}`).join(" L ")}`
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 300 120"
      className="w-full"
      style={{ height: 120 }}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={`${line} L 300,120 L 0,120 Z`} fill="var(--terminal-color-highlight)" opacity={0.16} />
      <path
        d={line}
        fill="none"
        stroke="var(--terminal-color-highlight)"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function StarGraph({ config, data, style = "default", size = "half" }: StarGraphProps): React.ReactElement {
  const gradientId = React.useId()
  if (!config.enabled || !data || data.starHistory.length < 2) return <></>

  const variant = resolveStarGraphVariant(config.star_graph_variant)
  const points = data.starHistory
  const delta = computeStarDelta(points)
  const total = data.stargazerCount

  return (
    <section id="github-repo-star_graph">
      <ScaledBox size={config.content_size}>
        <RenderBasedOnStyle
          style={style}
          defaultComponent={
            <Card className="flex flex-col">
              {variant === "area" && (
                <>
                  <StarsHead count={total} delta={delta} eyebrow="Star growth" />
                  <AreaChart points={points} gradientId={gradientId} />
                </>
              )}
              {variant === "bars" && (
                <>
                  <StarsHead count={total} delta={delta} />
                  <BarsChart points={points} />
                </>
              )}
              {variant === "milestones" && (
                <div className="pt-4">
                  <MilestonesChart points={points} />
                </div>
              )}
              {variant === "sparkline" && (
                <div className="flex flex-row items-center" style={{ height: 76 }}>
                  <div className="flex-shrink-0 py-3 pl-[18px] pr-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[22px] font-semibold leading-none tracking-[-0.02em] text-default-text">
                        {formatCount(total)}
                      </span>
                      <span className="text-xs text-default-muted">★</span>
                    </div>
                    <Delta delta={delta} className="text-[11px]" />
                  </div>
                  <SparklineChart points={points} gradientId={gradientId} />
                </div>
              )}
              {variant === "steps" && (
                <>
                  <StarsHead count={total} delta={delta} />
                  <StepsChart points={points} gradientId={gradientId} />
                </>
              )}
              {variant === "dots" && (
                <>
                  <StarsHead count={total} delta={delta} />
                  <DotsChart points={points} />
                </>
              )}
            </Card>
          }
          terminalComponent={
            <>
              <TerminalCommand command={getPseudoCommands({ plugin: "github_repo", section: "star_graph", size })} />
              <div className="px-1 pb-1">
                <TerminalChart points={points} />
              </div>
            </>
          }
        />
      </ScaledBox>
    </section>
  )
}
