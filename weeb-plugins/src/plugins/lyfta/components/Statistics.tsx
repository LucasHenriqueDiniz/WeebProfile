import React from "react"
import { GiWeightLiftingUp } from "react-icons/gi"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots"
import { AnimatedNumber } from "../../../templates/AnimatedNumber"
import { CascadeGroup, useItemCascade, withCascade } from "../../../templates/animations"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { LyftaData, LyftaNonEssentialConfig } from "../types"
import { favoriteExercise, statisticsSummary } from "../selection"
import { clip, formatAmount, formatMonthYear, formatVolume, plural } from "../utils/format"
import { StatTile, StatTiles } from "./shared"

interface StatisticsProps {
  data: LyftaData
  config: LyftaNonEssentialConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

export function Statistics({ data, config, style = "default", size = "half" }: StatisticsProps): React.ReactElement {
  const tilesCascade = useItemCascade(4)

  if (!data?.statistics || !data.workouts) {
    return <></>
  }

  const hideTitle = config.statistics_hide_title || false
  const title = config.statistics_title || "Statistics"
  const weightUnit = config.weight_unit || "kg"
  const summary = statisticsSummary(data)
  const favorite = favoriteExercise(data.workouts)
  const since = summary.firstWorkout ? formatMonthYear(summary.firstWorkout) : ""

  return (
    <section id="lyfta-statistics">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-2">
            {!hideTitle && (
              <DefaultTitle title={title} icon={<GiWeightLiftingUp />} subtitle={since ? `since ${since}` : null} />
            )}

            <StatTiles count={4} size={size} className={withCascade("", tilesCascade)} style={tilesCascade?.style}>
              <StatTile label="Workouts" value={<AnimatedNumber value={summary.workoutsLabel} />} />
              <StatTile label="Volume" value={<AnimatedNumber value={formatVolume(summary.volume, weightUnit)} />} />
              <StatTile label="Week streak" value={formatAmount(summary.currentStreak)} />
              <StatTile label="Exercises" value={<AnimatedNumber value={summary.uniqueExercises} />} />
            </StatTiles>

            {favorite && (
              <div className="flex items-center gap-2 h-[36px] px-3 rounded-lg border border-solid border-default-border">
                <span className="text-[10px] leading-none font-bold uppercase tracking-wider text-default-muted whitespace-nowrap">
                  Favorite
                </span>
                <span className="flex-1 min-w-0 text-sm half:text-[13px] font-semibold text-default-text truncate">
                  {favorite.name}
                </span>
                <span className="text-xs half:text-[11px] text-default-muted whitespace-nowrap tabular-nums">
                  {plural(favorite.count, "session")}
                </span>
              </div>
            )}
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "lyfta",
                section: "statistics",
                size,
              })}
            />
            <CascadeGroup count={5 + Number(!!favorite)}>
              <TerminalLineWithDots title="Workouts" value={summary.workoutsLabel} />
              <TerminalLineWithDots title="Total Volume" value={formatVolume(summary.volume, weightUnit)} />
              <TerminalLineWithDots title="Week Streak" value={plural(summary.currentStreak, "week")} />
              <TerminalLineWithDots title="Best Streak" value={plural(summary.longestStreak, "week")} />
              <TerminalLineWithDots title="Exercises" value={String(summary.uniqueExercises)} />
              {favorite && (
                <TerminalLineWithDots
                  title="Favorite"
                  value={`${clip(favorite.name, size === "half" ? 26 : 70)} (${favorite.count}x)`}
                />
              )}
            </CascadeGroup>
          </>
        }
      />
    </section>
  )
}
