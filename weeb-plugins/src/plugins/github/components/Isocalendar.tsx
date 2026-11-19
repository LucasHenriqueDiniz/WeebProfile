/**
 * Isometric contribution calendar: one column per day, as tall as its share of the best day.
 *
 * The cube geometry is ported from lowlighter/metrics (`plugins/isocalendar`), Copyright (c)
 * 2020-present lowlighter, MIT License; see isocalendar.ts. Colors come from the theme, not
 * from GitHub's greens.
 */

import React from "react"
import { FaCubes } from "react-icons/fa"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import {
  ISOCALENDAR_DRAWING_HEIGHT,
  cubeLevel,
  cubePaths,
  duration,
  isocalendarStats,
  isocalendarViewBox,
  type IsocalendarStats,
} from "../isocalendar"
import type { GithubConfig, GithubData } from "../types"

interface IsocalendarProps {
  data: GithubData["isocalendar"]
  config: GithubConfig
  style: "default" | "terminal"
  size: "half" | "full"
}

const DAY_MS = 24 * 60 * 60 * 1000

const plural = (n: number, word: string) => `${n.toLocaleString("en-US")} ${word}${n === 1 ? "" : "s"}`

/** The statistics the drawing shows in its empty top right corner, value then label. */
export function statLines(stats: IsocalendarStats): Array<[string, string]> {
  return [
    [plural(stats.currentStreak, "day"), "current streak"],
    [plural(stats.bestStreak, "day"), "best streak"],
    [stats.bestDay.toLocaleString("en-US"), "best day"],
    [stats.average, "per day"],
  ]
}

/** Line height of a statistic: they sit over the drawing, so they never change the height. */
export const STAT_LINE = 18

function Drawing({
  data,
  config,
  size,
  style,
}: {
  data: NonNullable<GithubData["isocalendar"]>
  config: GithubConfig
  size: "half" | "full"
  style: "default" | "terminal"
}) {
  const d = duration(config)
  const box = isocalendarViewBox(d)
  const height = ISOCALENDAR_DRAWING_HEIGHT[size][d]
  const width = Math.round(((box.width * height) / box.height) * 100) / 100
  const start = Date.parse(`${data.start}T00:00:00Z`)
  const best = Math.max(0, ...data.days.map((day) => day.count))
  const palette =
    style === "terminal"
      ? {
          "--iso-hl": "var(--terminal-color-highlight)",
          "--iso-bg": "var(--terminal-color-background)",
          "--iso-empty": "var(--terminal-color-muted)",
        }
      : {
          "--iso-hl": "var(--default-color-highlight)",
          "--iso-bg": "var(--default-color-background)",
          "--iso-empty": "var(--default-color-muted)",
        }

  // Oldest week first, then Sunday to Saturday: a cube is drawn after the ones it hides.
  const cubes = data.days.map((day) => {
    const offset = Math.round((Date.parse(`${day.date}T00:00:00Z`) - start) / DAY_MS)
    const ratio = best > 0 ? day.count / best : 0
    const level = cubeLevel(ratio)
    const faces = cubePaths(Math.floor(offset / 7), offset % 7, ratio)
    return (
      <g key={day.date}>
        <title>{`${plural(day.count, "contribution")} on ${day.date}`}</title>
        {faces.left && <path className={`l${level}`} d={faces.left} />}
        {faces.right && <path className={`r${level}`} d={faces.right} />}
        <path className={`t${level}`} d={faces.top} />
      </g>
    )
  })

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="weeb-iso"
      viewBox={`0 0 ${Math.round(box.width * 100) / 100} ${box.height}`}
      width={width}
      height={height}
      style={{ display: "block", ...palette } as React.CSSProperties}
      role="img"
      aria-label={`${data.days.reduce((sum, day) => sum + day.count, 0)} contributions from ${data.days[0]?.date ?? data.start} to ${data.end}`}
    >
      {cubes}
    </svg>
  )
}

export function GithubIsocalendar({ data, config, style, size }: IsocalendarProps): React.ReactElement | null {
  if (!data) return null
  const height = ISOCALENDAR_DRAWING_HEIGHT[size][duration(config)]
  const stats = config.isocalendar_hide_stats ? null : statLines(isocalendarStats(data.days))
  const title = config.isocalendar_title || "Isometric Calendar"

  const body = (
    <div style={{ position: "relative", height }}>
      <Drawing data={data} config={config} size={size} style={style} />
      {stats && (
        <div className="flex flex-col items-end" style={{ position: "absolute", top: 0, right: 0 }}>
          {stats.map(([value, label]) =>
            style === "terminal" ? (
              <div key={label} className="text-xs whitespace-nowrap" style={{ lineHeight: `${STAT_LINE}px` }}>
                <span className="text-terminal-warning">{label}</span> <span>{value}</span>
              </div>
            ) : (
              <div
                key={label}
                className="flex items-baseline gap-1.5 whitespace-nowrap"
                style={{ lineHeight: `${STAT_LINE}px` }}
              >
                <span className="text-sm font-semibold text-default-highlight">{value}</span>
                <span className="text-xs text-default-muted">{label}</span>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )

  return (
    <section id="github-isocalendar">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!config.isocalendar_hide_title && <DefaultTitle title={title} icon={<FaCubes />} />}
            {body}
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "github", section: "isocalendar", size })} />
            {body}
          </>
        }
      />
    </section>
  )
}
