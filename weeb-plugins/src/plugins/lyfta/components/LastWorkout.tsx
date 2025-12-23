import React from 'react'
import { FaDumbbell } from 'react-icons/fa'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle.js'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle.js'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand.js'
import { TerminalLineWithDots } from '../../../templates/Terminal/TerminalLineWithDots.js'
import { getPseudoCommands } from '../../../utils/pseudo-commands.js'
import type { LyftaData, LyftaNonEssentialConfig } from '../types.js'
import { formatWeight } from '../utils/weight.js'

// Format date as "DD/MM" (like example)
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.getMonth() + 1
  return `${day}/${month}`
}

interface LastWorkoutProps {
  data: LyftaData
  config: LyftaNonEssentialConfig
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function LastWorkout({ data, config, style = 'default', size = 'half' }: LastWorkoutProps): React.ReactElement {
  if (!data || !data.workouts || data.workouts.length === 0) {
    return <></>
  }

  const hideTitle = config.last_workout_hide_title || false
  const title = config.last_workout_title || 'Last Workout'
  const weightUnit = config.weight_unit || 'kg'
  const showBodyWeight = config.last_workout_show_body_weight !== false
  const maxExercises = config.last_workout_max_exercises || 5

  // Ordena sem mutar o array original
  const lastWorkout = [...data.workouts]
    .sort(
      (a, b) =>
        new Date(b.workout_perform_date).getTime() -
        new Date(a.workout_perform_date).getTime()
    )[0]

  if (!lastWorkout) {
    return <></>
  }

  const exercisesWithVolume = lastWorkout.exercises.map((exercise) => {
    const exerciseVolume = exercise.sets.reduce((acc, set) => {
      if (set.weight && set.reps && set.is_completed) {
        const weight = parseFloat(set.weight)
        const reps = parseInt(set.reps, 10)
        if (!isNaN(weight) && !isNaN(reps)) {
          return acc + weight * reps // volume em kg (soma peso x reps)
        }
      }
      return acc
    }, 0)
    return { exercise, volume: exerciseVolume }
  })

  const topExercises = exercisesWithVolume
    .sort((a, b) => b.volume - a.volume)
    .slice(0, maxExercises)

  const visibleExercises = topExercises.filter(({ volume }) => volume > 0)

  const workoutDate = formatDate(lastWorkout.workout_perform_date)

  // Calculate total volume from all exercises (weight x reps for each set)
  const totalVolumeKg = exercisesWithVolume.reduce((acc, { volume }) => acc + volume, 0)

  return (
    <section id="lyfta-last-workout">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden">
            {!hideTitle && <DefaultTitle title={title} icon={<FaDumbbell />} />}

            <div className="rounded-lg shadow-sm p-4">
              {/* Header: título, data, volume / BW */}
              <div className="flex justify-between items-start mb-3 gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm half:text-xs font-semibold text-default-fg truncate">
                    {lastWorkout.title}
                  </div>
                  <div className="text-xs half:text-[10px] text-default-muted">
                    {workoutDate}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm half:text-xs font-bold text-default-highlight tabular-nums">
                    {totalVolumeKg}
                    {weightUnit}
                  </div>
                  {showBodyWeight && lastWorkout.body_weight > 0 && (
                    <div className="text-xs half:text-[10px] text-default-muted">
                      BW:{' '}
                      {formatWeight(lastWorkout.body_weight * 1000, weightUnit)}
                    </div>
                  )}
                </div>
              </div>

              {/* Lista de exercícios com sets + volume */}
              {visibleExercises.length > 0 && (
                <div className="space-y-2.5 pt-1">
                  {visibleExercises.map(({ exercise, volume }) => {
                    const completedSets = exercise.sets.filter(
                      (set) =>
                        set.is_completed && set.weight && set.reps
                    )
                    const setsCount =
                      completedSets.length || exercise.sets.length || 0

                    const volumeDisplay = formatWeight(
                      volume * 1000, // volume em kg -> grams para helper
                      weightUnit
                      )

                    return (
                      <div
                        key={exercise.exercise_id}
                        className="flex items-start gap-2"
                      >
                        {/* Exercise image */}
                        {exercise.exercise_image && (
                          <img
                            src={exercise.exercise_image}
                            alt={exercise.excercise_name}
                            className="w-8 h-8 half:w-6 half:h-6 object-contain flex-shrink-0 rounded"
                            loading="lazy"
                          />
                        )}
                        
                        <div className="flex-1 min-w-0">
                          {/* Exercise name - maior e destacado */}
                          <div className="text-xs half:text-[11px] font-semibold text-default-fg truncate mb-0.5">
                            {exercise.excercise_name}
                          </div>
                          
                          {/* Sets and volume - menores e cor diferente */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] half:text-[9px] text-default-muted">
                              {setsCount > 0
                                    ? `${setsCount} ${setsCount === 1 ? 'set' : 'sets'}`
                                                : 'no sets'}
                            </span>
                            <span className="text-[10px] half:text-[9px] font-medium text-default-success tabular-nums">
                              {volumeDisplay} total
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Fallback se nenhum exercício tiver volume > 0 */}
              {visibleExercises.length === 0 && (
                <p className="text-xs half:text-[10px] text-default-muted mt-1">
                  No volume data for this workout yet.
                </p>
              )}
            </div>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'lyfta',
                section: 'last_workout',
                size,
              })}
            />
            <TerminalLineWithDots title="Workout" value={lastWorkout.title} />
            <TerminalLineWithDots title="Date" value={workoutDate} />
            <TerminalLineWithDots 
              title="Total Volume" 
              value={`${totalVolumeKg}${weightUnit}`}
            />
            {showBodyWeight && lastWorkout.body_weight > 0 && (
              <TerminalLineWithDots
                title="Body Weight"
                value={formatWeight(lastWorkout.body_weight * 1000, weightUnit)}
              />
            )}
            {topExercises.map(({ exercise, volume }) => {
              const completedSets = exercise.sets.filter(
                (set) => set.is_completed && set.weight && set.reps
              )
              const setsCount = completedSets.length

              // Encontrar o melhor set (maior peso, depois maior reps)
              let bestSet = { weight: 0, reps: 0 }
              for (const set of completedSets) {
                const weight = parseFloat(set.weight || '0')
                const reps = parseInt(set.reps || '0', 10)
                if (weight > bestSet.weight || (weight === bestSet.weight && reps > bestSet.reps)) {
                  bestSet = { weight, reps }
                }
              }

              // Formatar: "Best: 15x20kg • 1160kg" (mais simples)
              const parts: string[] = []
              if (bestSet.weight > 0 && bestSet.reps > 0) {
                parts.push(`${bestSet.reps}x${formatWeight(bestSet.weight * 1000, weightUnit)}`)
              }
              if (volume > 0) {
                parts.push(formatWeight(volume * 1000, weightUnit))
              }

              return (
                <TerminalLineWithDots
                  key={exercise.exercise_id}
                  title={exercise.excercise_name}
                  value={parts.join(' • ')}
                />
              )
            })}
          </>
        }
      />
    </section>
  )
}
