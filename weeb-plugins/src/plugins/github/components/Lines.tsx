import React from "react"
import { GoDiff } from "react-icons/go"
import { AnimatedNumber } from "../../../templates/AnimatedNumber"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalGrid } from "../../../templates/Terminal/TerminalGrid"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots"
import { useAnimations, useItemCascade, withCascade } from "../../../templates/animations"
import { abbreviateNumber } from "../../../utils/number"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { GithubConfig, GithubData } from "../types"

type Lines = NonNullable<GithubData["lines"]>
type Week = Lines["weeks"][number]

/** Weeks the chart draws for each period. */
export const LINES_PERIOD_WEEKS = { "6_months": 26, "1_year": 52, "2_years": 104 } as const
const PERIOD_LABEL = { "6_months": "last 6 months", "1_year": "last 12 months", "2_years": "last 2 years" } as const

/** Height of the default chart and of the terminal one, in px. */
export const DEFAULT_CHART_HEIGHT = 96
export const TERMINAL_CHART_HEIGHT = 64

// The same green and red as the additions and deletions of recent activity
const ADDED = "text-green-600 dark:text-green-400"
const DELETED = "text-red-600 dark:text-red-400"

export interface LinesView {
  lines: Lines
  /** Undefined when the chart is hidden. */
  period?: keyof typeof LINES_PERIOD_WEEKS
  chartType: "area" | "bars"
  repositories: Lines["repositories"]
  notes: string[]
  /** Something was counted: totals, chart and repositories are drawn. */
  hasLines: boolean
}

const repositoryCount = (n: number) => `${n} ${n === 1 ? "repository" : "repositories"}`

/** What the section draws, shared by the component and calculateHeight. */
export function linesView(cfg: GithubConfig, lines: Lines | undefined): LinesView | null {
  if (!lines) return null
  const hasLines = lines.added + lines.deleted > 0
  const notes: string[] = []
  if (lines.pending > 0) notes.push(`${repositoryCount(lines.pending)} still being computed by GitHub`)
  if (lines.tooLarge > 0) notes.push(`${repositoryCount(lines.tooLarge)} of 10,000+ commits not counted`)
  if (!hasLines && notes.length === 0) return null

  const shown = Math.max(0, Math.min(Math.floor(Number(cfg.lines_repositories_shown ?? 4)) || 0, 10))
  const period = cfg.lines_history_period ?? "1_year"
  return {
    lines,
    period: hasLines && !cfg.lines_hide_history ? (period in LINES_PERIOD_WEEKS ? period : "1_year") : undefined,
    chartType: cfg.lines_chart_type === "bars" ? "bars" : "area",
    repositories: hasLines ? lines.repositories.slice(0, shown) : [],
    notes,
    hasLines,
  }
}

function periodWeeks(view: LinesView): Week[] {
  return view.period ? view.lines.weeks.slice(-LINES_PERIOD_WEEKS[view.period]) : []
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const monthYear = (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1] ?? ""} ${iso.slice(0, 4)}`

/**
 * Additions above the middle line, deletions below it, on the same scale. The viewBox is
 * stretched to the section's width (`preserveAspectRatio="none"`), so its units are weeks.
 */
function DiffChart({
  weeks,
  type,
  height,
  addedClass = ADDED,
}: {
  weeks: Week[]
  type: "area" | "bars"
  height: number
  addedClass?: string
}) {
  const animations = useAnimations()
  const width = Math.max(weeks.length, 1) * 10
  const middle = height / 2
  const max = Math.max(1, ...weeks.map((w) => Math.max(w.added, w.deleted)))
  const scale = (value: number) => (value / max) * (middle - 1)

  const area = (key: "added" | "deleted", sign: 1 | -1) => {
    const step = weeks.length > 1 ? width / (weeks.length - 1) : width
    const points = weeks.map((w, i) => `${(i * step).toFixed(1)},${(middle - sign * scale(w[key])).toFixed(1)}`)
    return `M 0,${middle} L ${points.join(" L ")} L ${width},${middle} Z`
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={animations ? "block w-full weeb-bar" : "block w-full"}
      style={{ height }}
      aria-hidden="true"
    >
      {type === "area" ? (
        <>
          <path className={addedClass} fill="currentColor" fillOpacity={0.85} d={area("added", 1)} />
          <path className={DELETED} fill="currentColor" fillOpacity={0.85} d={area("deleted", -1)} />
        </>
      ) : (
        <>
          <g className={addedClass} fill="currentColor">
            {weeks.map((w, i) =>
              w.added > 0 ? (
                <rect key={i} x={i * 10 + 1.5} y={middle - scale(w.added)} width={7} height={scale(w.added)} />
              ) : null
            )}
          </g>
          <g className={DELETED} fill="currentColor">
            {weeks.map((w, i) =>
              w.deleted > 0 ? <rect key={i} x={i * 10 + 1.5} y={middle} width={7} height={scale(w.deleted)} /> : null
            )}
          </g>
        </>
      )}
      <line
        x1={0}
        x2={width}
        y1={middle}
        y2={middle}
        stroke="currentColor"
        strokeOpacity={0.3}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/** A fixed line: the notes and labels have the same height in every engine. */
const line = (px: number): React.CSSProperties => ({ lineHeight: `${px}px` })

const DefaultLines = ({ view }: { view: LinesView }) => {
  const { lines, repositories } = view
  const weeks = periodWeeks(view)
  const maxRepository = Math.max(1, ...repositories.map((r) => r.added + r.deleted))
  const cascade = useItemCascade(repositories.length)
  const bar = useAnimations() ? " weeb-bar" : ""

  return (
    <div className="flex flex-col gap-2">
      {view.hasLines && (
        <div className="flex items-end justify-between gap-4" style={{ height: 48 }}>
          <div className="flex gap-6">
            <div className="flex flex-col">
              <span className={`text-2xl font-bold ${ADDED}`} style={line(32)}>
                +<AnimatedNumber value={abbreviateNumber(lines.added)} />
              </span>
              <span className="text-xs text-default-muted" style={line(16)}>
                added
              </span>
            </div>
            <div className="flex flex-col">
              <span className={`text-2xl font-bold ${DELETED}`} style={line(32)}>
                −<AnimatedNumber value={abbreviateNumber(lines.deleted)} />
              </span>
              <span className="text-xs text-default-muted" style={line(16)}>
                deleted
              </span>
            </div>
          </div>
          <span className="text-xs text-default-muted truncate" style={line(16)}>
            {repositoryCount(lines.repositories.length)}, all time
          </span>
        </div>
      )}

      {view.period && (
        <div className="flex flex-col text-default-muted" style={{ height: DEFAULT_CHART_HEIGHT + 4 + 12 }}>
          <DiffChart weeks={weeks} type={view.chartType} height={DEFAULT_CHART_HEIGHT} />
          <div className="flex justify-between mt-1 text-[10px]" style={line(12)}>
            <span>{weeks[0] ? monthYear(weeks[0].date) : ""}</span>
            <span>weekly, {PERIOD_LABEL[view.period]}</span>
            <span>{weeks.at(-1) ? monthYear(weeks.at(-1)!.date) : ""}</span>
          </div>
        </div>
      )}

      {repositories.length > 0 && (
        <div className={withCascade("flex flex-col gap-2", cascade)} style={cascade?.style}>
          {repositories.map((repo) => (
            <div key={repo.name} className="flex flex-col" style={{ height: 28 }}>
              <div className="flex justify-between gap-2" style={line(20)}>
                <span className="text-sm text-default-text truncate">{repo.name}</span>
                <span className="text-xs font-mono whitespace-nowrap">
                  <span className={ADDED}>+{abbreviateNumber(repo.added)}</span>{" "}
                  <span className={DELETED}>−{abbreviateNumber(repo.deleted)}</span>
                </span>
              </div>
              <div className="flex mt-1 h-1 rounded-sm overflow-hidden">
                <div
                  className={`h-full bg-current ${ADDED}${bar}`}
                  style={{ width: `${(repo.added / maxRepository) * 100}%` }}
                />
                <div
                  className={`h-full bg-current ${DELETED}${bar}`}
                  style={{ width: `${(repo.deleted / maxRepository) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {view.notes.map((note) => (
        <span key={note} className="text-xs text-default-muted truncate" style={line(16)}>
          {note}
        </span>
      ))}
    </div>
  )
}

const TerminalLines = ({ view }: { view: LinesView }) => {
  const { lines, repositories } = view
  const weeks = periodWeeks(view)

  return (
    <div className="flex flex-col">
      {view.hasLines && (
        <>
          <TerminalLineWithDots title="Lines added" value={abbreviateNumber(lines.added)} />
          <TerminalLineWithDots title="Lines deleted" value={abbreviateNumber(lines.deleted)} />
          <TerminalLineWithDots title="Repositories" value={`${lines.repositories.length} of ${lines.queried}`} />
        </>
      )}

      {view.period && (
        <>
          <span className="text-xs text-terminal-muted mt-2 px-1" style={line(16)}>
            weekly, {PERIOD_LABEL[view.period]} (+ above, - below)
          </span>
          <div className="mt-1 px-1 text-terminal-muted">
            <DiffChart
              weeks={weeks}
              type={view.chartType}
              height={TERMINAL_CHART_HEIGHT}
              addedClass="text-terminal-success"
            />
          </div>
        </>
      )}

      {repositories.length > 0 && (
        <div className="mt-2">
          <TerminalGrid
            data={repositories.map((repo) => ({
              title: repo.name,
              value: `+${abbreviateNumber(repo.added)} -${abbreviateNumber(repo.deleted)}`,
            }))}
            rightText="Repository"
            leftText="Lines"
          />
        </div>
      )}

      {view.notes.map((note) => (
        <span key={note} className="text-xs text-terminal-muted truncate mt-1 px-1" style={line(16)}>
          {note}
        </span>
      ))}
    </div>
  )
}

interface LinesProps {
  data: GithubData["lines"]
  config: GithubConfig
  style: "default" | "terminal"
  size: "half" | "full"
}

export function GithubLines({ data, config, style, size }: LinesProps): React.ReactElement {
  const view = linesView(config, data)
  if (!view) return <></>

  const title = config.lines_title ?? "Lines of Code"
  const hideTitle = config.lines_hide_title ?? false

  return (
    <section id="github-lines">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<GoDiff />} />}
            <DefaultLines view={view} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "github", section: "lines", size })} />
            <TerminalLines view={view} />
          </>
        }
      />
    </section>
  )
}
