import React from "react"
import { GiWeightLiftingUp } from "react-icons/gi"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalStatisticRow } from "../../../templates/Terminal/TerminalStatisticRow"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { LyftaData, LyftaNonEssentialConfig } from "../types"
import { formatWeight } from "../utils/weight"
import { format1RM } from "../utils/1rm"
import { topExercises as selectTopExercises } from "../selection"

interface ExercisesProps {
  data: LyftaData
  config: LyftaNonEssentialConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

export function Exercises({ data, config, style = "default", size = "half" }: ExercisesProps): React.ReactElement {
  if (!data || !data.exercises || data.exercises.length === 0) {
    return <></>
  }

  const hideTitle = config.exercises_hide_title || false
  const title = config.exercises_title || "Most Performed Exercises"
  const weightUnit = config.weight_unit || "kg"
  const show1RM = config.exercises_show_1rm !== false
  const hideImages = config.exercises_hide_images === true

  const topExercises = selectTopExercises(data, config)

  if (topExercises.length === 0) {
    return <></>
  }

  return (
    <section id="lyfta-exercises">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden">
            {!hideTitle && <DefaultTitle title={title} icon={<GiWeightLiftingUp />} />}

            <div className="rounded-lg shadow-sm p-4">
              <div className="space-y-2">
                {topExercises.map((exercise) => {
                  const oneRMDisplay = show1RM && exercise.best1RM > 0 ? format1RM(exercise.best1RM, weightUnit) : null

                  return (
                    <div key={exercise.name} className="flex justify-between items-center">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {!hideImages && exercise.image && (
                          <img
                            src={exercise.image}
                            alt={exercise.name}
                            className="w-8 h-8 half:w-6 half:h-6 object-contain flex-shrink-0 rounded"
                            loading="lazy"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm half:text-xs font-semibold text-default-fg truncate">
                            {exercise.name}
                          </div>
                          <div className="text-xs half:text-[10px] text-default-muted">
                            {exercise.count} {exercise.count === 1 ? "session" : "sessions"}
                          </div>
                        </div>
                      </div>
                      {oneRMDisplay && (
                        <div className="text-right flex-shrink-0">
                          <div className="text-base half:text-sm font-bold text-default-highlight tabular-nums">
                            {oneRMDisplay}
                          </div>
                          <div className="text-xs half:text-[10px] text-default-muted">est. 1RM</div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
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
            <div className="w-full flex gap-2 p-0 m-0">
              <TerminalStatisticRow
                rows={topExercises.map((exercise) => {
                  const parts = []
                  if (exercise.averageWeight > 0) {
                    parts.push(`Avg: ${formatWeight(exercise.averageWeight, weightUnit)}`)
                  }
                  if (exercise.bestWeight > 0) {
                    parts.push(`Best: ${formatWeight(exercise.bestWeight, weightUnit)}`)
                  }
                  if (show1RM && exercise.best1RM > 0) {
                    parts.push(`1RM: ${format1RM(exercise.best1RM, weightUnit)}`)
                  }
                  const value =
                    parts.length > 0
                      ? `${exercise.count}x • ${parts.join(" • ")}`
                      : `${exercise.count} ${exercise.count === 1 ? "time" : "times"}`
                  return {
                    icon: null,
                    title: exercise.name,
                    value,
                  }
                })}
              />
            </div>
          </>
        }
      />
    </section>
  )
}
