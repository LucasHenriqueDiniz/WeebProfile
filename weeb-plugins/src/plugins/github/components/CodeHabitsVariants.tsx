/**
 * The two compact layouts of Code Habits, next to the original bars (CodeHabits.tsx):
 *
 * - punchcard: one row per weekday, one dot per hour, the dot's size and strength by how
 *   many commits landed there. Needs the weekday × hour counts.
 * - summary: three highlight tiles (peak hour, busiest day, rhythm) over a 24-hour strip.
 *
 * Every box has a fixed height (inline line heights included) so `codeHabitsHeight` can
 * add them up without a browser. The terminal versions use only characters the embedded
 * JetBrains Mono subset has (Latin and Latin Extended): "·" for an empty hour, then
 * ". o O @" by quartile.
 */

import React from "react"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots"
import type { GithubData } from "../types"
import { CODE_HABITS_DAYS, codeHabitsHighlights, dayHourMatrix, hourCounts, level } from "./code-habits-insights"

type Habits = GithubData["codeHabits"]
type Size = "half" | "full"

/** Punch card geometry: a row per weekday and the largest dot, per card size. */
export const PUNCHCARD_GEOMETRY: Record<Size, { row: number; dot: number }> = {
  half: { row: 16, dot: 12 },
  full: { row: 24, dot: 20 },
}
/** Width of the weekday labels on the left of the punch card. */
const DAY_LABEL_WIDTH = 36
/** The hour labels under the punch card and the strip. */
export const HOUR_AXIS_HEIGHT = 16
/** A summary tile: `py-2`, a 16px label, a 28px value, a 16px caption. */
export const SUMMARY_TILE_HEIGHT = 8 + 16 + 28 + 16 + 8
/** The summary's 24-hour strip. */
export const SUMMARY_STRIP_HEIGHT = 20

const AXIS_HOURS = [0, 6, 12, 18]
const TERMINAL_GLYPHS = ["·", ".", "o", "O", "@"] as const

const zoneSuffix = (habits: Habits): string => (habits.timeZoneLabel ? ` (${habits.timeZoneLabel})` : "")

const oneLine: React.CSSProperties = { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }

const grid24: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }

function HourAxis({ indent = 0, every = AXIS_HOURS }: { indent?: number; every?: number[] }) {
  return (
    <div className="flex" style={{ height: HOUR_AXIS_HEIGHT }}>
      {indent > 0 && <span style={{ width: indent, flex: "none" }} />}
      <div className="flex-1" style={grid24}>
        {Array.from({ length: 24 }, (_, hour) => (
          <span
            key={hour}
            className="text-default-muted"
            // Centred on its column, as the dots and cells above it are.
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: 10,
              lineHeight: `${HOUR_AXIS_HEIGHT}px`,
              whiteSpace: "nowrap",
              overflow: "visible",
            }}
          >
            {every.includes(hour) ? `${hour}h` : ""}
          </span>
        ))}
      </div>
    </div>
  )
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-semibold text-default-muted" style={{ lineHeight: "20px", ...oneLine }}>
    {children}
  </h3>
)

export function DefaultPunchcard({ data, size }: { data: Habits; size: Size }): React.ReactElement {
  const matrix = dayHourMatrix(data) ?? []
  const max = Math.max(0, ...matrix.flat())
  const { row, dot } = PUNCHCARD_GEOMETRY[size]
  return (
    <div className="flex flex-col gap-2">
      <SectionLabel>{`Commits by weekday and hour${zoneSuffix(data)}`}</SectionLabel>
      <div className="flex flex-col">
        {CODE_HABITS_DAYS.map((day, d) => (
          <div key={day} className="flex items-center" style={{ height: row }}>
            <span
              className="text-xs text-default-muted"
              style={{ width: DAY_LABEL_WIDTH, flex: "none", lineHeight: "16px" }}
            >
              {day.slice(0, 3)}
            </span>
            <div className="flex-1" style={{ ...grid24, height: row }}>
              {(matrix[d] ?? []).map((commits, hour) => {
                const l = level(commits, max)
                // Area grows with the count: the diameter follows its square root.
                const size = l === 0 ? 3 : Math.max(4, Math.round(Math.sqrt(commits / max) * dot))
                return (
                  <span key={hour} className="flex items-center justify-center" style={{ height: row }}>
                    <span
                      className={`rounded-full ${l === 0 ? "bg-default-muted" : "bg-default-highlight"}`}
                      style={{ width: size, height: size, opacity: l === 0 ? 0.35 : 0.4 + l * 0.15 }}
                      title={`${commits} commits on ${day} at ${hour}:00`}
                    />
                  </span>
                )
              })}
            </div>
          </div>
        ))}
        <HourAxis indent={DAY_LABEL_WIDTH} />
      </div>
    </div>
  )
}

function Tile({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <div className="flex flex-col rounded-lg bg-default-surface px-3 py-2" style={{ minWidth: 0 }}>
      <span className="text-xs text-default-muted" style={{ lineHeight: "16px", ...oneLine }}>
        {label}
      </span>
      <span className="text-lg font-bold text-default-highlight" style={{ lineHeight: "28px", ...oneLine }}>
        {value}
      </span>
      <span className="text-xs text-default-muted" style={{ lineHeight: "16px", ...oneLine }}>
        {caption}
      </span>
    </div>
  )
}

export function DefaultSummary({ data }: { data: Habits }): React.ReactElement {
  const { peakHour, busiestDay, rhythm } = codeHabitsHighlights(data)
  const hours = hourCounts(data)
  const max = Math.max(0, ...hours)
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-2">
        <Tile
          label="Peak hour"
          value={peakHour ? `${peakHour.hour}h` : "-"}
          caption={peakHour ? `${peakHour.commits} commits` : "no commits"}
        />
        <Tile
          label="Busiest day"
          value={busiestDay?.day ?? "-"}
          caption={busiestDay ? `${busiestDay.commits} commits` : "no commits"}
        />
        <Tile label="Rhythm" value={rhythm?.label ?? "-"} caption={rhythm ? `${rhythm.share}% of commits` : ""} />
      </div>
      <SectionLabel>{`Hour by hour${zoneSuffix(data)}`}</SectionLabel>
      <div className="flex flex-col">
        <div style={{ ...grid24, gap: 2, height: SUMMARY_STRIP_HEIGHT }}>
          {hours.map((commits, hour) => {
            const l = level(commits, max)
            return (
              <span
                key={hour}
                className={`rounded-sm ${l === 0 ? "bg-default-muted" : "bg-default-highlight"}`}
                style={{ height: SUMMARY_STRIP_HEIGHT, opacity: l === 0 ? 0.2 : 0.25 + l * 0.1875 }}
                title={`${commits} commits at ${hour}:00`}
              />
            )
          })}
        </div>
        <HourAxis />
      </div>
    </div>
  )
}

// A fixed line, as in CodeHabits.tsx: the font's own line height varies by engine.
const TerminalLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-terminal-muted my-1" style={{ lineHeight: "19px" }}>
    {children}
  </span>
)

const terminalLine: React.CSSProperties = { lineHeight: "20px", whiteSpace: "pre", overflow: "hidden" }

/** One glyph per hour in a half card, glyph and space in a full one. */
function glyphRow(values: number[], max: number, size: Size): React.ReactNode[] {
  return values.map((v, hour) => {
    const l = level(v, max)
    return (
      <span key={hour} className={l === 0 ? "text-terminal-muted" : "text-terminal-success"}>
        {TERMINAL_GLYPHS[l] + (size === "full" ? " " : "")}
      </span>
    )
  })
}

/** "0h", "6h", "12h", "18h" under the glyphs, each at its hour's column. */
function terminalAxis(size: Size, indent: number): string {
  const step = size === "full" ? 2 : 1
  const chars = Array<string>(indent + 24 * step).fill(" ")
  for (const hour of AXIS_HOURS) {
    const label = `${hour}h`
    label.split("").forEach((c, i) => (chars[indent + hour * step + i] = c))
  }
  return chars.join("").trimEnd()
}

export function TerminalPunchcard({ data, size }: { data: Habits; size: Size }): React.ReactElement {
  const matrix = dayHourMatrix(data) ?? []
  const max = Math.max(0, ...matrix.flat())
  return (
    <>
      <TerminalLabel>{`Commits by weekday and hour${zoneSuffix(data)}:`}</TerminalLabel>
      {CODE_HABITS_DAYS.map((day, d) => (
        <span key={day} className="text-sm" style={terminalLine}>
          <span className="text-terminal-muted">{`${day.slice(0, 3)} `}</span>
          {glyphRow(matrix[d] ?? [], max, size)}
        </span>
      ))}
      <span className="text-sm text-terminal-muted" style={terminalLine}>
        {terminalAxis(size, 4)}
      </span>
    </>
  )
}

export function TerminalSummary({ data, size }: { data: Habits; size: Size }): React.ReactElement {
  const { peakHour, busiestDay, rhythm } = codeHabitsHighlights(data)
  const hours = hourCounts(data)
  return (
    <>
      <TerminalLabel>{`Rhythm${zoneSuffix(data)}:`}</TerminalLabel>
      <TerminalLineWithDots title="Peak hour" value={peakHour ? `${peakHour.hour}h (${peakHour.commits})` : "-"} />
      <TerminalLineWithDots
        title="Busiest day"
        value={busiestDay ? `${busiestDay.day} (${busiestDay.commits})` : "-"}
      />
      <TerminalLineWithDots title="Rhythm" value={rhythm ? `${rhythm.label} (${rhythm.share}%)` : "-"} />
      <span className="text-sm" style={terminalLine}>
        <span className="text-terminal-muted">{"hrs "}</span>
        {glyphRow(hours, Math.max(0, ...hours), size)}
      </span>
      <span className="text-sm text-terminal-muted" style={terminalLine}>
        {terminalAxis(size, 4)}
      </span>
    </>
  )
}
