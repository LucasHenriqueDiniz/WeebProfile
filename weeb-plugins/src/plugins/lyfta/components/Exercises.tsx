import React from 'react'
import { GiWeightLiftingUp } from 'react-icons/gi'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalStatisticRow } from '../../../templates/Terminal/TerminalStatisticRow'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { LyftaData, LyftaNonEssentialConfig } from '../types'
import { formatWeight } from '../utils/weight'
import { calculate1RM, format1RM } from '../utils/1rm'

interface ExercisesProps {
  data: LyftaData
  config: LyftaNonEssentialConfig
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function Exercises({ data, config, style = 'default', size = 'half' }: ExercisesProps): React.ReactElement {
  if (!data || !data.exercises || data.exercises.length === 0) {
    return <></>
  }

  const hideTitle = config.exercises_hide_title || false
  const title = config.exercises_title || 'Top Exercises'
  const maxExercises = config.exercises_max || 5
  const weightUnit = config.weight_unit || 'kg'
  const show1RM = config.exercises_show_1rm !== false
  const hideImages = config.exercises_hide_images === true

  // Calculate exercise stats from workouts
  const exerciseStats = new Map<
    string,
    {
      count: number
      weights: number[]
      bestWeight: number
      best1RM: number
      averageWeight: number
    }
  >()

  data.workouts.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      const exerciseName = exercise.excercise_name?.trim()
      if (!exerciseName) return

      const stats = exerciseStats.get(exerciseName) || {
        count: 0,
        weights: [],
        bestWeight: 0,
        best1RM: 0,
        averageWeight: 0,
      }

      stats.count++

      // Process sets to get weights and calculate 1RM
      // Note: set.weight is in kg, we need to convert to grams for formatWeight
      // Process all sets (not just completed) to get better stats
      exercise.sets.forEach((set) => {
        if (set.weight && set.reps) {
          const weightKg = parseFloat(set.weight)
          const reps = parseInt(set.reps, 10)
          if (!isNaN(weightKg) && !isNaN(reps) && weightKg > 0 && reps > 0) {
            const weightGrams = weightKg * 1000 // Convert kg to grams
            stats.weights.push(weightGrams)
            if (weightGrams > stats.bestWeight) {
              stats.bestWeight = weightGrams
            }
            const oneRM = calculate1RM(weightKg, reps) // 1RM calculation uses kg
            if (oneRM > stats.best1RM) {
              stats.best1RM = oneRM // Store in kg
            }
          }
        }
      })

      exerciseStats.set(exerciseName, stats)
    })
  })

  // Build image map from both exercises list and workouts (workouts have exercise_image)
  const exerciseImageMap = new Map<string, string>()
  
  // First, add from exercises list
  data.exercises.forEach((ex) => {
    if (ex.name && ex.image_name) {
      const normalizedName = ex.name.trim()
      exerciseImageMap.set(normalizedName, ex.image_name)
      exerciseImageMap.set(normalizedName.toLowerCase(), ex.image_name)
    }
  })
  
  // Then, add from workouts (they have exercise_image directly)
  data.workouts.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      const exerciseName = exercise.excercise_name?.trim()
      if (exerciseName && exercise.exercise_image) {
        exerciseImageMap.set(exerciseName, exercise.exercise_image)
        exerciseImageMap.set(exerciseName.toLowerCase(), exercise.exercise_image)
      }
    })
  })

  // Calculate averages and get top exercises
  const topExercises = Array.from(exerciseStats.entries())
    .map(([name, stats]) => {
      const normalizedName = name.trim()
      // Try exact match first, then case-insensitive
      const image = exerciseImageMap.get(normalizedName) || 
                    exerciseImageMap.get(normalizedName.toLowerCase()) ||
                    null
      
      return {
        name: normalizedName,
        count: stats.count,
        averageWeight: stats.weights.length > 0 ? stats.weights.reduce((a, b) => a + b, 0) / stats.weights.length : 0, // in grams
        bestWeight: stats.bestWeight, // in grams
        best1RM: stats.best1RM, // in kg
        image,
      }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, maxExercises)

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
                  const oneRMDisplay = show1RM && exercise.best1RM > 0 
                    ? format1RM(exercise.best1RM, weightUnit)
                    : null
                  
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
                            {exercise.count} {exercise.count === 1 ? 'session' : 'sessions'}
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
                plugin: 'lyfta',
                section: 'exercises',
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
                  const value = parts.length > 0
                    ? `${exercise.count}x • ${parts.join(' • ')}`
                    : `${exercise.count} ${exercise.count === 1 ? 'time' : 'times'}`
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

