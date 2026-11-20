import React from "react"
import { AnimatedNumber } from "../../../templates/AnimatedNumber"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { useAnimations } from "../../../templates/animations"
import { abbreviateNumber } from "../../../utils/number"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import { listsSideBySide, trafficParts, type TrafficList } from "../traffic-height"
import type { GithubRepoConfig, GithubRepoData, TrafficDay } from "../types"
import { ScaledBox } from "./ScaledBox"
import { Card, HL, HL_SOFTER, formatCount } from "./redesign"

interface TrafficProps {
  config: GithubRepoConfig
  data: GithubRepoData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

// Every line has a fixed line height and nothing wraps: traffic-height.ts adds them up.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function dayLabel(iso: string | undefined): string {
  if (!iso) return ""
  const d = new Date(iso)
  return `${MONTHS[d.getUTCMonth()] ?? ""} ${d.getUTCDate()}`
}

/**
 * One bar per day: the views in a light bar, the unique visitors in a solid one over it.
 * Fills its box (`preserveAspectRatio="none"`), drawn as a block so no line box sits under it.
 */
function DayBars({
  days,
  height,
  color,
  showUniques = true,
}: {
  days: TrafficDay[]
  height: number
  color: string
  showUniques?: boolean
}): React.ReactElement {
  const animations = useAnimations()
  const step = 20
  const width = days.length * step
  const max = Math.max(1, ...days.map((d) => d.count))
  const barHeight = (value: number) => (value > 0 ? Math.max(2, (value / max) * (height - 2)) : 0)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={animations ? "block w-full weeb-bar" : "block w-full"}
      style={{ height }}
      aria-hidden="true"
    >
      <line x1={0} y1={height - 0.5} x2={width} y2={height - 0.5} stroke={color} strokeOpacity={0.25} />
      {days.map((day, i) => {
        const x = i * step + 3
        const views = barHeight(day.count)
        const uniques = showUniques ? barHeight(Math.min(day.uniques, day.count)) : 0
        return (
          <g key={day.date}>
            {views > 0 && (
              <rect
                x={x}
                y={height - views}
                width={step - 6}
                height={views}
                fill={color}
                opacity={showUniques ? 0.3 : 0.85}
              />
            )}
            {uniques > 0 && <rect x={x} y={height - uniques} width={step - 6} height={uniques} fill={color} />}
          </g>
        )
      })}
    </svg>
  )
}

function Eyebrow14({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <div className="whitespace-nowrap text-[10px] font-medium uppercase leading-[14px] tracking-[0.14em] text-default-muted-light">
      {children}
    </div>
  )
}

function Total({ value, label, hot = false }: { value: number; label: string; hot?: boolean }): React.ReactElement {
  return (
    <div className="min-w-0">
      <div
        className="whitespace-nowrap text-[22px] font-semibold leading-[22px] tracking-[-0.02em] text-default-text"
        style={hot ? { color: HL } : undefined}
      >
        <AnimatedNumber value={formatCount(value)} />
      </div>
      <div className="mt-1 whitespace-nowrap text-[10px] uppercase leading-[14px] tracking-[0.1em] text-default-muted-light">
        {label}
      </div>
    </div>
  )
}

function DefaultList({ list }: { list: TrafficList }): React.ReactElement {
  const max = Math.max(1, ...list.rows.map((r) => r.count))
  return (
    <div className="mt-3 min-w-0 flex-1">
      <Eyebrow14>{list.title}</Eyebrow14>
      <div className="mt-1.5">
        {list.rows.length === 0 && (
          <div className="flex h-5 items-center whitespace-nowrap px-2 text-xs leading-4 text-default-muted">
            None in the last 14 days
          </div>
        )}
        {list.rows.map((row, i) => (
          <div
            key={`${row.label}-${i}`}
            className={`relative flex h-5 items-center gap-2 overflow-hidden rounded-md px-2 text-xs leading-4${
              i > 0 ? " mt-1" : ""
            }`}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-md"
              style={{ width: `${(row.count / max) * 100}%`, background: HL_SOFTER }}
            />
            <span className="relative min-w-0 flex-1 truncate text-default-text">{row.label}</span>
            <span className="relative flex-shrink-0 whitespace-nowrap text-default-muted">
              <b className="font-semibold text-default-text">{formatCount(row.count)}</b> · {formatCount(row.uniques)}{" "}
              unique
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TerminalListBlock({ list }: { list: TrafficList }): React.ReactElement {
  return (
    <div className="mt-1 min-w-0 flex-1">
      <div className="whitespace-nowrap text-xs leading-4 text-terminal-highlight">
        {list.id === "referrers" ? "referrers" : "paths"}
      </div>
      {list.rows.length === 0 && (
        <div className="whitespace-nowrap text-xs leading-4 text-terminal-muted">none in the last 14 days</div>
      )}
      {list.rows.map((row, i) => (
        <div key={`${row.label}-${i}`} className="flex gap-2 text-xs leading-4">
          <span className="min-w-0 flex-1 truncate text-terminal-text">{row.label}</span>
          <span className="flex-shrink-0 whitespace-nowrap text-terminal-muted">
            {abbreviateNumber(row.count)} ({abbreviateNumber(row.uniques)})
          </span>
        </div>
      ))}
    </div>
  )
}

export function Traffic({ config, data, style = "default", size = "half" }: TrafficProps): React.ReactElement {
  const parts = config.enabled && data ? trafficParts(config, data) : null
  const traffic = data?.traffic
  if (!parts || !traffic) return <></>

  const { views } = traffic
  const clones = parts.showClones ? traffic.clones : null
  const first = dayLabel(views.days[0]?.date)
  const last = dayLabel(views.days[views.days.length - 1]?.date)
  const sideBySide = listsSideBySide(size, parts)
  const empty = views.count === 0

  return (
    <section id="github-repo-traffic">
      <ScaledBox size={config.content_size}>
        <RenderBasedOnStyle
          style={style}
          defaultComponent={
            <Card className="pb-4">
              <div className="px-[18px] pt-4">
                <Eyebrow14>Traffic · last 14 days</Eyebrow14>
                <div className="mt-2 flex gap-x-6">
                  <Total value={views.count} label="Views" hot />
                  <Total value={views.uniques} label="Visitors" />
                  {clones && <Total value={clones.count} label="Clones" />}
                  {clones && <Total value={clones.uniques} label="Cloners" />}
                </div>
              </div>
              <div className="relative mt-3 px-[18px]">
                <DayBars days={views.days} height={84} color={HL} />
                {empty && (
                  <div className="absolute inset-x-0 top-0 flex h-[84px] items-center justify-center whitespace-nowrap text-xs leading-4 text-default-muted">
                    No views in the last 14 days
                  </div>
                )}
                <div className="mt-1.5 flex justify-between gap-2 whitespace-nowrap text-[10px] leading-[14px] text-default-muted-light">
                  <span>{first}</span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-sm" style={{ background: HL, opacity: 0.3 }} />
                    views
                    <span className="ml-1.5 inline-block h-2 w-2 rounded-sm" style={{ background: HL }} />
                    unique visitors
                  </span>
                  <span>{last}</span>
                </div>
              </div>
              {clones && (
                <div className="mt-3 px-[18px]">
                  <Eyebrow14>Clones per day</Eyebrow14>
                  <div className="mt-1.5">
                    <DayBars days={clones.days} height={32} color={HL} showUniques={false} />
                  </div>
                </div>
              )}
              {sideBySide ? (
                <div className="flex gap-x-4 px-[18px]">
                  {parts.lists.map((list) => (
                    <DefaultList key={list.id} list={list} />
                  ))}
                </div>
              ) : (
                parts.lists.map((list) => (
                  <div key={list.id} className="flex px-[18px]">
                    <DefaultList list={list} />
                  </div>
                ))
              )}
            </Card>
          }
          terminalComponent={
            <>
              <TerminalCommand command={getPseudoCommands({ plugin: "github_repo", section: "traffic", size })} />
              <div className="overflow-hidden whitespace-nowrap px-1 py-1 text-sm leading-5">
                <span className="text-terminal-highlight">
                  <AnimatedNumber value={abbreviateNumber(views.count)} /> views
                </span>{" "}
                <span className="text-terminal-muted">({abbreviateNumber(views.uniques)} unique)</span>
                {clones && (
                  <>
                    {" "}
                    <span className="text-terminal-success">
                      <AnimatedNumber value={abbreviateNumber(clones.count)} /> clones
                    </span>{" "}
                    <span className="text-terminal-muted">({abbreviateNumber(clones.uniques)} unique)</span>
                  </>
                )}
              </div>
              <div className="relative px-1">
                <DayBars days={views.days} height={60} color="var(--terminal-color-highlight)" />
                {empty && (
                  <div className="absolute inset-x-0 top-0 flex h-[60px] items-center justify-center whitespace-nowrap text-xs leading-4 text-terminal-muted">
                    no views in the last 14 days
                  </div>
                )}
                <div className="flex justify-between gap-2 whitespace-nowrap text-xs leading-4 text-terminal-muted">
                  <span>{first}</span>
                  <span>views / unique per day</span>
                  <span>{last}</span>
                </div>
              </div>
              {clones && (
                <div className="mt-1 px-1">
                  <div className="whitespace-nowrap text-xs leading-4 text-terminal-muted">clones per day</div>
                  <DayBars days={clones.days} height={24} color="var(--terminal-color-success)" showUniques={false} />
                </div>
              )}
              <div className={sideBySide ? "flex gap-x-4 px-1 pb-1" : "px-1 pb-1"}>
                {parts.lists.map((list) => (
                  <TerminalListBlock key={list.id} list={list} />
                ))}
              </div>
            </>
          }
        />
      </ScaledBox>
    </section>
  )
}
