import React from "react"
import { FaClock } from "react-icons/fa"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { LyftaData, LyftaNonEssentialConfig } from "../types"
import { formatWeightInt } from "../utils/weight"

interface RecentWorkoutsProps {
  data: LyftaData
  config: LyftaNonEssentialConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return `${date.getDate()}/${date.getMonth() + 1}`
}

function getDurationMinutes(duration: string | null): number | null {
  if (!duration) return null
  const parts = duration.split(":")
  if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
    const h = parseInt(parts[0], 10) || 0
    const m = parseInt(parts[1], 10) || 0
    const s = parseInt(parts[2], 10) || 0
    return h * 60 + m + Math.round(s / 60)
  }
  return null
}

function formatVolume(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}k`
  return Math.round(kg).toString()
}

// Extract "Name" and ["Muscle","Groups"] from titles like "Push #2 (Chest,Shoulders)"
function parseTitle(raw: string): { name: string; muscles: string[] } {
  const match = raw.match(/^(.*?)\s*\(([^)]+)\)\s*$/)
  if (match && match[1] && match[2]) {
    return {
      name: match[1].trim(),
      muscles: match[2]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }
  }
  return { name: raw, muscles: [] }
}

export function RecentWorkouts({
  data,
  config,
  style = "default",
  size = "half",
}: RecentWorkoutsProps): React.ReactElement {
  if (!data?.workoutSummaries?.length) return <></>

  const hideTitle = config.recent_workouts_hide_title || false
  const title = config.recent_workouts_title || "Recent Fitness Workouts"
  const maxWorkouts = config.workouts_max || 4
  const weightUnit = config.weight_unit || "kg"
  const workouts = data.workoutSummaries.slice(0, maxWorkouts)
  // how many muscle chips to show depends on available width
  const maxChips = size === "full" ? 6 : 4

  return (
    <section id="lyfta-recent-workouts">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden">
            {!hideTitle && <DefaultTitle title={title} icon={<FaClock />} />}

            <div className="flex flex-col gap-3">
              {workouts.map((workout, index) => {
                const { name: workoutName, muscles } = parseTitle(workout.title)
                const dateStr = formatDate(workout.workout_perform_date)
                const durationMin = getDurationMinutes(workout.workout_duration)

                // Calculate volume from full workout exercises (more accurate than total_volume)
                const fullWorkout = data.workouts.find((w) => w.id === workout.id)
                let volumeKg = 0
                if (fullWorkout) {
                  volumeKg = fullWorkout.exercises.reduce((acc, exercise) => {
                    return (
                      acc +
                      exercise.sets.reduce((setAcc, set) => {
                        if (set.weight && set.reps && set.is_completed) {
                          const w = parseFloat(set.weight)
                          const r = parseInt(set.reps, 10)
                          return !isNaN(w) && !isNaN(r) ? setAcc + w * r : setAcc
                        }
                        return setAcc
                      }, 0)
                    )
                  }, 0)
                } else {
                  volumeKg = workout.total_volume || 0
                }

                const visibleMuscles = muscles.slice(0, maxChips)

                return (
                  <div key={workout.id} className="flex items-start gap-3 p-3 rounded-lg border border-default-border">
                    {/* Index badge */}
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-default-highlight bg-default-highlight/10 flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>

                    {/* Workout details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm half:text-xs font-semibold text-default-text truncate leading-snug">
                        {workoutName}
                      </p>
                      <p className="text-xs half:text-[10px] text-default-muted mt-0.5">
                        {dateStr}
                        {durationMin ? ` • ${durationMin}min` : ""}
                      </p>
                      {visibleMuscles.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {visibleMuscles.map((muscle, i) => (
                            <span
                              key={i}
                              className="text-[9px] half:text-[8px] px-1.5 py-0.5 rounded-full bg-default-muted/10 text-default-muted border border-default-border/50 leading-none"
                            >
                              {muscle}
                            </span>
                          ))}
                          {muscles.length > maxChips && (
                            <span className="text-[9px] half:text-[8px] px-1.5 py-0.5 text-default-muted leading-none">
                              +{muscles.length - maxChips}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Volume */}
                    <div className="flex-shrink-0 text-right self-center">
                      <p className="text-sm half:text-xs font-bold text-default-highlight tabular-nums">
                        {formatVolume(volumeKg)}
                        {weightUnit}
                      </p>
                    </div>
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
            {workouts.map((workout) => {
              const workoutDate = new Date(workout.workout_perform_date).toLocaleDateString()
              const volume = formatWeightInt(workout.total_volume, weightUnit)
              return (
                <TerminalLineWithDots
                  key={workout.id}
                  title={workout.title}
                  titleClassName="max-w-[60%]"
                  value={`${volume} - ${workoutDate}`}
                />
              )
            })}
          </>
        }
      />
    </section>
  )
}
