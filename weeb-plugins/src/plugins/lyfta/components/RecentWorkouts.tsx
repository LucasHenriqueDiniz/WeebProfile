import React from 'react'
import { FaClock } from 'react-icons/fa'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalLineWithDots } from '../../../templates/Terminal/TerminalLineWithDots'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { LyftaData, LyftaNonEssentialConfig } from '../types'
import { formatWeightInt } from '../utils/weight'

interface RecentWorkoutsProps {
  data: LyftaData
  config: LyftaNonEssentialConfig
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function RecentWorkouts({
  data,
  config,
  style = 'default',
  size = 'half',
}: RecentWorkoutsProps): React.ReactElement {
  if (!data || !data.workoutSummaries || data.workoutSummaries.length === 0) {
    return <></>
  }

  const hideTitle = config.recent_workouts_hide_title || false
  const title = config.recent_workouts_title || 'Recent Workouts'
  const maxWorkouts = config.workouts_max || 4
  const weightUnit = config.weight_unit || 'kg'
  const workouts = data.workoutSummaries.slice(0, maxWorkouts)

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.getMonth() + 1
    return `${day}/${month}`
  }

  const formatNumber = (num: number): string => {
    // Para valores >= 1000, mostra como "X.Xk"
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    // Para valores menores que 10, mostra 1 decimal se necessário
    if (num < 10 && num % 1 !== 0) {
      return num.toFixed(1)
    }
    // Para valores >= 10, arredonda para inteiro
    return Math.round(num).toString()
  }

  const getDurationMinutes = (duration: string | null): number | null => {
    if (!duration) return null
    const parts = duration.split(':')
    if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
      const hours = parseInt(parts[0], 10) || 0
      const minutes = parseInt(parts[1], 10) || 0
      const seconds = parseInt(parts[2], 10) || 0
      return hours * 60 + minutes + Math.round(seconds / 60)
    }
    return null
  }

  return (
    <section id="lyfta-recent-workouts">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden">
            {!hideTitle && <DefaultTitle title={title} icon={<FaClock />} />}

            <div className="rounded-lg shadow-sm p-4 mb-3">
              <div className="space-y-3">
                {workouts.map((workout, index) => {
                  const dateStr = formatDate(workout.workout_perform_date)
                  
                  // Calculate volume from workout exercises (more accurate)
                  // Find the full workout data to calculate volume
                  const fullWorkout = data.workouts.find(w => w.id === workout.id)
                  let volumeKg = 0
                  
                  if (fullWorkout) {
                    volumeKg = fullWorkout.exercises.reduce((acc, exercise) => {
                      const exerciseVolume = exercise.sets.reduce((setAcc, set) => {
                        if (set.weight && set.reps && set.is_completed) {
                          const weight = parseFloat(set.weight)
                          const reps = parseInt(set.reps, 10)
                          if (!isNaN(weight) && !isNaN(reps)) {
                            return setAcc + weight * reps
                          }
                        }
                        return setAcc
                      }, 0)
                      return acc + exerciseVolume
                    }, 0)
                  } else {
                    // Fallback to total_volume if workout not found
                    volumeKg = (workout.total_volume || 0) / 1000
                  }
                  
                  const volumeDisplay = formatNumber(volumeKg)
                  const durationMinutes = getDurationMinutes(workout.workout_duration)
                  const isFirst = index === 0

                  const circleBase =
                    'w-7 h-7 half:w-6 half:h-6 rounded-full flex items-center justify-center text-[11px] font-semibold'
                  const circleClassName = isFirst
                    ? `${circleBase} bg-default-15 text-default-highlight`
                    : `${circleBase} bg-default-muted/20 text-default-highlight`

                  return (
                    <div key={workout.id} className="flex items-start gap-3">
                      {/* Timeline indicator */}
                      <div className="flex flex-col items-center pt-0.5">
                        <div className={circleClassName}>{index + 1}</div>
                        {index < workouts.length - 1 && (
                          <div className="w-px h-4 bg-default-muted/20" />
                        )}
                      </div>

                      {/* Workout info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm half:text-xs font-semibold text-default-fg truncate">
                              {workout.title}
                            </div>
                            <div className="text-xs half:text-[10px] text-default-muted">
                              {dateStr}
                              {durationMinutes
                                ? ` • ${durationMinutes}min`
                                : ''}
                            </div>
                          </div>
                          <div className="text-sm half:text-xs font-bold text-default-highlight tabular-nums flex-shrink-0">
                            {volumeKg} 
                            {weightUnit}
                          </div>
                        </div>
                      </div>
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
                section: 'recent_workouts',
                size,
              })}
            />
            {workouts.map((workout) => {
              const workoutDate = new Date(
                workout.workout_perform_date
              ).toLocaleDateString()
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
