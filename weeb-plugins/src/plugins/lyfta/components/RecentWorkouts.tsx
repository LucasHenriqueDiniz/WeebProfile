import React from "react"
import { FaClock } from "react-icons/fa"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots"
import { CascadeGroup, useItemCascade, withCascade } from "../../../templates/animations"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { LyftaData, LyftaNonEssentialConfig } from "../types"
import { recentWorkouts, workoutVolume } from "../selection"
import {
  calendarParts,
  durationMinutes,
  formatDay,
  formatDuration,
  formatVolume,
  parseWorkoutTitle,
  plural,
} from "../utils/format"

interface RecentWorkoutsProps {
  data: LyftaData
  config: LyftaNonEssentialConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

export function RecentWorkouts({
  data,
  config,
  style = "default",
  size = "half",
}: RecentWorkoutsProps): React.ReactElement {
  const workouts = recentWorkouts(data, config)
  const cascade = useItemCascade(workouts.length)

  if (workouts.length === 0) return <></>

  const hideTitle = config.recent_workouts_hide_title || false
  const title = config.recent_workouts_title || "Recent Workouts"
  const weightUnit = config.weight_unit || "kg"
  const fullWorkouts = new Map((data.workouts ?? []).map((w) => [w.id, w]))

  const rows = workouts.map((summary) => {
    const workout = fullWorkouts.get(summary.id)
    const { name, muscles } = parseWorkoutTitle(summary.title)
    const minutes = durationMinutes(summary.workout_duration)
    const volumeKg = summary.total_volume > 0 ? summary.total_volume : workout ? workoutVolume(workout) : 0
    // What it worked, as Lyfta names it in the title, or how much of it there was.
    const detail = [
      muscles.length > 0 ? muscles.join(" · ") : workout ? plural(workout.exercises.length, "exercise") : null,
      minutes > 0 ? formatDuration(minutes) : null,
    ]
      .filter(Boolean)
      .join(" · ")
    return { summary, name, detail, volume: volumeKg > 0 ? formatVolume(volumeKg, weightUnit) : "—" }
  })

  return (
    <section id="lyfta-recent-workouts">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-2">
            {!hideTitle && <DefaultTitle title={title} icon={<FaClock />} />}

            <div className={withCascade("flex flex-col gap-1.5", cascade)} style={cascade?.style}>
              {rows.map(({ summary, name, detail, volume }) => {
                const { month, day } = calendarParts(summary.workout_perform_date)
                return (
                  <div key={summary.id} className="flex items-center gap-2.5 h-[44px]">
                    <div className="w-10 h-10 flex-shrink-0 rounded-md bg-default-15 flex flex-col items-center justify-center">
                      <span className="text-[9px] leading-none font-bold tracking-wider text-default-highlight">
                        {month}
                      </span>
                      <span className="text-base leading-5 font-bold text-default-highlight tabular-nums">{day}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm half:text-[13px] leading-5 font-semibold text-default-text truncate">
                        {name}
                      </p>
                      <p className="text-xs half:text-[11px] leading-4 text-default-muted truncate">{detail}</p>
                    </div>
                    <p className="flex-shrink-0 text-sm half:text-[13px] leading-5 font-bold text-default-text tabular-nums whitespace-nowrap">
                      {volume}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "lyfta",
                section: "recent_workouts",
                size,
              })}
            />
            <CascadeGroup count={rows.length}>
              {rows.map(({ summary, name, volume }) => (
                <TerminalLineWithDots
                  key={summary.id}
                  title={name}
                  titleClassName="max-w-[55%]"
                  value={`${volume} · ${formatDay(summary.workout_perform_date)}`}
                />
              ))}
            </CascadeGroup>
          </>
        }
      />
    </section>
  )
}
