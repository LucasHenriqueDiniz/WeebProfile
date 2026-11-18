import React from "react"
import { GiWeightLiftingUp } from "react-icons/gi"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots"
import { CascadeGroup, useItemCascade, withCascade } from "../../../templates/animations"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { LyftaData, LyftaNonEssentialConfig } from "../types"
import { type TopExercise, topExercises as selectTopExercises } from "../selection"
import { type WeightUnit, formatLoad, plural } from "../utils/format"
import { ExerciseRow } from "./shared"

interface ExercisesProps {
  data: LyftaData
  config: LyftaNonEssentialConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

/** The number on the right: the estimated 1RM, or the heaviest set when 1RM is off. */
function headline(exercise: TopExercise, show1RM: boolean, unit: WeightUnit): { value: string; caption: string } {
  if (show1RM && exercise.best1RM > 0)
    return { value: formatLoad(Math.round(exercise.best1RM), unit), caption: "est. 1RM" }
  if (exercise.bestWeight > 0) return { value: formatLoad(exercise.bestWeight, unit), caption: "best set" }
  return { value: "—", caption: "" }
}

export function Exercises({ data, config, style = "default", size = "half" }: ExercisesProps): React.ReactElement {
  const topExercises = data?.workouts?.length ? selectTopExercises(data, config) : []
  const cascade = useItemCascade(topExercises.length)

  if (topExercises.length === 0) {
    return <></>
  }

  const hideTitle = config.exercises_hide_title || false
  const title = config.exercises_title || "Top Exercises"
  const weightUnit = config.weight_unit || "kg"
  const show1RM = config.exercises_show_1rm !== false
  const hideImages = config.exercises_hide_images === true

  return (
    <section id="lyfta-exercises">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-2">
            {!hideTitle && <DefaultTitle title={title} icon={<GiWeightLiftingUp />} subtitle="by sessions" />}

            <div className={withCascade("flex flex-col", cascade)} style={cascade?.style}>
              {topExercises.map((exercise) => {
                const { value, caption } = headline(exercise, show1RM, weightUnit)
                const detail = [
                  plural(exercise.count, "session"),
                  show1RM && exercise.bestWeight > 0 ? `best ${formatLoad(exercise.bestWeight, weightUnit)}` : null,
                ]
                  .filter(Boolean)
                  .join(" · ")
                return (
                  <ExerciseRow
                    key={exercise.name}
                    image={exercise.image}
                    showImage={!hideImages}
                    name={exercise.name}
                    detail={detail}
                    value={value}
                    caption={caption}
                    accent
                  />
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
                section: "exercises",
                size,
              })}
            />
            <CascadeGroup count={topExercises.length}>
              {topExercises.map((exercise) => {
                const { value, caption } = headline(exercise, show1RM, weightUnit)
                const label = caption === "est. 1RM" ? `1RM ${value}` : caption ? `best ${value}` : null
                return (
                  <TerminalLineWithDots
                    key={exercise.name}
                    title={exercise.name}
                    titleClassName="max-w-[55%]"
                    value={[`${exercise.count}x`, label].filter(Boolean).join(" · ")}
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
