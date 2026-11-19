import React from "react"
import { FaRegClock } from "react-icons/fa"
import { AnimatedNumber } from "../../../templates/AnimatedNumber"
import { CascadeGroup, useItemCascade, withCascade } from "../../../templates/animations"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import { formatDuration, rangeLabel } from "../format"
import type { WakaTimeStats } from "../types"
import { rangeSubtitle } from "./UsageSection"

interface CodingTimeProps {
  stats: WakaTimeStats
  title: string
  hideTitle: boolean
  style: "default" | "terminal"
  size: "half" | "full"
}

/** "Nov 16", from WakaTime's "2026-11-16" (a calendar day in the user's time zone, so no Date). */
function shortDate(date: string): string {
  const [, month, day] = date.split("-").map(Number)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return month && day ? `${months[month - 1]} ${day}` : date
}

interface Stat {
  label: string
  value: string
}

export function codingTimeStats(stats: WakaTimeStats): Stat[] {
  const rows: Stat[] = [
    { label: "Total", value: formatDuration(stats.totalSeconds) },
    { label: "Daily average", value: formatDuration(stats.dailyAverageSeconds) },
  ]
  if (stats.bestDay) {
    rows.push({ label: `Best day (${shortDate(stats.bestDay.date)})`, value: formatDuration(stats.bestDay.seconds) })
  }
  return rows
}

export function CodingTime({ stats, title, hideTitle, style, size }: CodingTimeProps): React.ReactElement {
  const rows = codingTimeStats(stats)
  const cascade = useItemCascade(rows.length)

  return (
    <section id="wakatime-time">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} subtitle={rangeSubtitle(stats)} icon={<FaRegClock />} />}
            <div
              className={withCascade(`grid gap-2 ${rows.length === 3 ? "grid-cols-3" : "grid-cols-2"}`, cascade)}
              style={cascade?.style}
            >
              {rows.map((row) => (
                <div key={row.label} className="flex flex-col min-w-0">
                  <span
                    className="text-xl half:text-lg font-semibold text-default-highlight tabular-nums truncate"
                    style={{ lineHeight: "28px" }}
                  >
                    <AnimatedNumber value={row.value} />
                  </span>
                  <span className="text-sm text-default-muted truncate" style={{ lineHeight: "20px" }}>
                    {row.label}
                  </span>
                </div>
              ))}
            </div>
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "wakatime",
                section: "time",
                period: rangeLabel(stats.range),
                size,
              })}
            />
            <CascadeGroup count={rows.length}>
              {rows.map((row) => (
                <TerminalLineWithDots key={row.label} title={row.label} value={row.value} />
              ))}
            </CascadeGroup>
          </>
        }
      />
    </section>
  )
}
