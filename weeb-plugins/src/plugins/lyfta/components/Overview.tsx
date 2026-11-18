import React from "react"
import { FaChartLine } from "react-icons/fa"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots"
import { AnimatedNumber } from "../../../templates/AnimatedNumber"
import { CascadeGroup, useItemCascade, withCascade } from "../../../templates/animations"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { LyftaData, LyftaNonEssentialConfig } from "../types"
import { overviewSummary, overviewTileCount } from "../selection"
import { formatDuration, formatVolume } from "../utils/format"
import { StatTile, StatTiles } from "./shared"

interface OverviewProps {
  data: LyftaData
  config: LyftaNonEssentialConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

export function Overview({ data, config, style = "default", size = "half" }: OverviewProps): React.ReactElement {
  const tiles = overviewTileCount(config)
  const cascade = useItemCascade(tiles)

  if (!data?.workoutSummaries?.length) {
    return <></>
  }

  const hideTitle = config.overview_hide_title || false
  const title = config.overview_title || "Overview"
  const weightUnit = config.weight_unit || "kg"
  const periodDays = config.overview_period_days || 30
  const showVolume = config.overview_show_volume !== false
  const showDuration = config.overview_show_duration !== false
  const showWeeklyAvg = config.overview_show_weekly_avg !== false

  const summary = overviewSummary(data, periodDays)
  const perWeek = summary.perWeek.toFixed(1).replace(/\.0$/, "")
  const volume = formatVolume(summary.volume, weightUnit)
  const time = formatDuration(summary.minutes)

  return (
    <section id="lyfta-overview">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-2">
            {!hideTitle && <DefaultTitle title={title} icon={<FaChartLine />} subtitle={`last ${periodDays} days`} />}

            <StatTiles count={tiles} size={size} className={withCascade("", cascade)} style={cascade?.style}>
              <StatTile label="Workouts" value={<AnimatedNumber value={summary.workouts} />} />
              {showVolume && <StatTile label="Volume" value={<AnimatedNumber value={volume} />} />}
              {showDuration && <StatTile label="Time" value={time} />}
              {showWeeklyAvg && <StatTile label="Per week" value={<AnimatedNumber value={perWeek} />} />}
            </StatTiles>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "lyfta",
                section: "overview",
                size,
              })}
            />
            <CascadeGroup count={tiles}>
              <TerminalLineWithDots title={`Workouts (${periodDays}d)`} value={String(summary.workouts)} />
              {showVolume && <TerminalLineWithDots title="Volume" value={volume} />}
              {showDuration && <TerminalLineWithDots title="Time" value={time} />}
              {showWeeklyAvg && <TerminalLineWithDots title="Per Week" value={`${perWeek} workouts`} />}
            </CascadeGroup>
          </>
        }
      />
    </section>
  )
}
