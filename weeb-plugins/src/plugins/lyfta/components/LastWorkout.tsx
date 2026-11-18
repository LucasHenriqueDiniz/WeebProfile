import React from "react"
import { FaDumbbell } from "react-icons/fa"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots"
import { AnimatedNumber } from "../../../templates/AnimatedNumber"
import { CascadeGroup, itemCascade, useAnimations, withCascade } from "../../../templates/animations"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { LyftaData, LyftaNonEssentialConfig } from "../types"
import { bestSet, completedSets, lastWorkoutTopExercises, latestWorkout, workoutVolume } from "../selection"
import { type WeightUnit, clip, formatDay, formatLoad, formatVolume, parseWorkoutTitle, plural } from "../utils/format"
import { ExerciseRow, MuscleChips } from "./shared"

interface LastWorkoutProps {
  data: LyftaData
  config: LyftaNonEssentialConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

/** "20 kg × 15", or "15 reps" for a set without a load. */
function bestSetLabel(set: { weight: number; reps: number } | null, unit: WeightUnit, compact = false): string {
  if (!set) return ""
  if (set.weight <= 0) return plural(set.reps, "rep")
  return compact ? `${formatLoad(set.weight, unit)}×${set.reps}` : `${formatLoad(set.weight, unit)} × ${set.reps}`
}

function volumeLabel(kg: number, unit: WeightUnit): string {
  return kg > 0 ? formatVolume(kg, unit) : "—"
}

export function LastWorkout({ data, config, style = "default", size = "half" }: LastWorkoutProps): React.ReactElement {
  const animations = useAnimations()
  const lastWorkout = data?.workouts?.length ? latestWorkout(data.workouts) : undefined
  if (!lastWorkout) {
    return <></>
  }

  const hideTitle = config.last_workout_hide_title || false
  const title = config.last_workout_title || "Last Workout"
  const weightUnit = config.weight_unit || "kg"
  const showBodyWeight = config.last_workout_show_body_weight !== false

  const exercises = lastWorkoutTopExercises(lastWorkout, config)
  const exercisesCascade = animations ? itemCascade(exercises.length) : null
  const showBodyWeightLine = showBodyWeight && lastWorkout.body_weight > 0

  const { name, muscles } = parseWorkoutTitle(lastWorkout.title)
  const date = formatDay(lastWorkout.workout_perform_date)
  const totalVolume = formatVolume(workoutVolume(lastWorkout), weightUnit)
  const setCount = lastWorkout.exercises.reduce((acc, e) => acc + completedSets(e).length, 0)
  const details = [
    date,
    plural(lastWorkout.exercises.length, "exercise"),
    plural(setCount, "set"),
    showBodyWeightLine ? `BW ${formatLoad(lastWorkout.body_weight, weightUnit)}` : null,
  ].filter(Boolean)

  return (
    <section id="lyfta-last-workout">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-2">
            {!hideTitle && <DefaultTitle title={title} icon={<FaDumbbell />} />}

            {/* Header: name and volume over details, then the muscles it hit. */}
            <div className="flex flex-col gap-1.5 px-3 py-2.5 rounded-lg border border-solid border-default-border bg-default-muted/10">
              <div className="flex items-baseline justify-between gap-3">
                <p className="flex-1 min-w-0 text-base half:text-sm leading-5 font-bold text-default-text truncate">
                  {name}
                </p>
                <p className="flex-shrink-0 text-base half:text-sm leading-5 font-bold text-default-highlight tabular-nums">
                  <AnimatedNumber value={totalVolume} />
                </p>
              </div>
              <p className="text-xs half:text-[11px] leading-4 text-default-muted truncate">{details.join(" · ")}</p>
              {muscles.length > 0 && <MuscleChips muscles={muscles} max={size === "full" ? 8 : 5} />}
            </div>

            {exercises.length > 0 && (
              <div className={withCascade("flex flex-col", exercisesCascade)} style={exercisesCascade?.style}>
                {exercises.map(({ exercise, volume }) => (
                  <ExerciseRow
                    key={exercise.exercise_id}
                    image={exercise.exercise_image}
                    name={exercise.excercise_name.trim()}
                    detail={[plural(completedSets(exercise).length, "set"), bestSetLabel(bestSet(exercise), weightUnit)]
                      .filter(Boolean)
                      .join(" · ")}
                    value={volumeLabel(volume, weightUnit)}
                  />
                ))}
              </div>
            )}
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "lyfta",
                section: "last_workout",
                size,
              })}
            />
            <CascadeGroup count={3 + Number(showBodyWeightLine) + exercises.length}>
              <TerminalLineWithDots title="Workout" value={clip(name, size === "half" ? 30 : 70)} />
              <TerminalLineWithDots title="Date" value={date} />
              <TerminalLineWithDots title="Volume" value={totalVolume} />
              {showBodyWeightLine && (
                <TerminalLineWithDots title="Body Weight" value={formatLoad(lastWorkout.body_weight, weightUnit)} />
              )}
              {exercises.map(({ exercise, volume }) => {
                const value = [
                  bestSetLabel(bestSet(exercise), weightUnit, true),
                  volume > 0 ? formatVolume(volume, weightUnit) : null,
                ]
                  .filter(Boolean)
                  .join(" · ")
                return (
                  <TerminalLineWithDots
                    key={exercise.exercise_id}
                    title={exercise.excercise_name.trim()}
                    titleClassName="max-w-[55%]"
                    value={value}
                  />
                )
              })}
            </CascadeGroup>
          </>
        }
      />
    </section>
  )
}
