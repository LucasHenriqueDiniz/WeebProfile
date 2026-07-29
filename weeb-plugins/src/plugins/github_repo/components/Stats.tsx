import React from "react"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { abbreviateNumber } from "../../../utils/number"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { GithubRepoConfig, GithubRepoData } from "../types"
import { ScaledBox } from "./ScaledBox"
import { Card, Delta, HL, computeStarDelta, formatCount, starCoords } from "./redesign"

interface StatsProps {
  config: GithubRepoConfig
  data: GithubRepoData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

function statItems(data: GithubRepoData) {
  return [
    { label: "Stars", value: data.stargazerCount, hot: true },
    { label: "Forks", value: data.forkCount, hot: false },
    { label: "Issues", value: data.openIssuesCount, hot: false },
    { label: "Watchers", value: data.watcherCount, hot: false },
  ]
}

// Divisor vertical fino entre células (sem borda no primeiro).
function CellDivider(): React.ReactElement {
  return <div className="absolute bottom-[22%] left-0 top-[22%] w-px bg-default-muted/20" style={{ width: 0.5 }} />
}

// "grid" (default): quatro células com divisores finos, Stars em highlight.
function GridStats({ data }: { data: GithubRepoData }): React.ReactElement {
  return (
    <Card>
      <div className="grid grid-cols-4">
        {statItems(data).map((item, i) => (
          <div key={item.label} className="relative px-2 py-4 text-center">
            {i > 0 && <CellDivider />}
            <div
              className="text-[21px] font-semibold leading-tight tracking-[-0.02em] text-default-text"
              style={item.hot ? { color: HL } : undefined}
            >
              {formatCount(item.value)}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.1em] text-default-muted-light">{item.label}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// "inline": faixa única com os quatro números + delta de stars quando disponível.
function InlineStats({ data }: { data: GithubRepoData }): React.ReactElement {
  const delta = computeStarDelta(data.starHistory)
  return (
    <Card className="flex flex-row items-center justify-between px-[18px] py-3">
      {statItems(data).map((item) => (
        <span key={item.label} className="flex items-baseline gap-1.5 text-xs text-default-muted">
          <b className="text-base font-semibold text-default-text">{formatCount(item.value)}</b>
          {item.label.toLowerCase()}
        </span>
      ))}
      <Delta delta={delta} />
    </Card>
  )
}

// "sparkstats": grid com mini-sparkline real de stars na primeira célula.
function SparkStats({ data }: { data: GithubRepoData }): React.ReactElement {
  const history = data.starHistory
  const hasSpark = history.length >= 2
  const coords = hasSpark ? starCoords(history, 60, 16, 0.12) : []
  const sparkPath = hasSpark ? `M ${coords.map((c) => `${c.x},${c.y}`).join(" L ")}` : ""

  return (
    <Card>
      <div className="grid grid-cols-4">
        {statItems(data).map((item, i) => (
          <div key={item.label} className="relative px-2 py-4 text-center">
            {i > 0 && <CellDivider />}
            <div
              className="text-[21px] font-semibold leading-tight tracking-[-0.02em] text-default-text"
              style={item.hot ? { color: HL } : undefined}
            >
              {formatCount(item.value)}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.1em] text-default-muted-light">{item.label}</div>
            {item.hot && hasSpark && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 60 16"
                className="mx-auto mt-1.5"
                style={{ width: 60, height: 16 }}
                aria-hidden="true"
              >
                <path d={sparkPath} fill="none" stroke={HL} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}

// "featured": bloco highlight de stars à esquerda + três colunas à direita.
function FeaturedStats({ data }: { data: GithubRepoData }): React.ReactElement {
  const delta = computeStarDelta(data.starHistory)
  const rest = statItems(data).filter((i) => !i.hot)

  return (
    <Card className="flex flex-row items-stretch">
      <div
        className="flex w-[150px] flex-shrink-0 flex-col items-center justify-center gap-0.5 py-5 text-white"
        style={{ background: HL }}
      >
        <div className="text-[26px] font-bold leading-none tracking-[-0.02em]">{formatCount(data.stargazerCount)}</div>
        <div className="text-[10px] uppercase tracking-[0.14em]" style={{ opacity: 0.85 }}>
          stars{delta ? ` · ${delta.label}` : ""}
        </div>
      </div>
      <div className="grid flex-1 grid-cols-3 items-center">
        {rest.map((item) => (
          <div key={item.label} className="text-center">
            <div className="text-lg font-semibold leading-tight text-default-text">{formatCount(item.value)}</div>
            <div className="text-[10px] uppercase tracking-[0.1em] text-default-muted-light">{item.label}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export function Stats({ config, data, style = "default", size = "half" }: StatsProps): React.ReactElement {
  if (!config.enabled || !data) return <></>

  const variant = config.stats_variant ?? "grid"

  return (
    <section id="github-repo-stats">
      <ScaledBox size={config.content_size}>
        <RenderBasedOnStyle
          style={style}
          defaultComponent={
            <>
              {variant === "inline" && <InlineStats data={data} />}
              {variant === "sparkstats" && <SparkStats data={data} />}
              {variant === "featured" && <FeaturedStats data={data} />}
              {(variant === "grid" || !["inline", "sparkstats", "featured"].includes(variant)) && (
                <GridStats data={data} />
              )}
            </>
          }
          terminalComponent={
            <>
              <TerminalCommand command={getPseudoCommands({ plugin: "github_repo", section: "stats", size })} />
              <div className="flex items-center gap-4 px-1 py-1 text-sm">
                <span className="text-terminal-highlight">⭐ {abbreviateNumber(data.stargazerCount)}</span>
                <span className="text-terminal-muted">🍴 {abbreviateNumber(data.forkCount)}</span>
              </div>
            </>
          }
        />
      </ScaledBox>
    </section>
  )
}
