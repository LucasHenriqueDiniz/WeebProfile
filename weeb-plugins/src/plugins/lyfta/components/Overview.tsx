import React from 'react'
import { FaChartLine } from 'react-icons/fa'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle.js'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle.js'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand.js'
import { TerminalLineWithDots } from '../../../templates/Terminal/TerminalLineWithDots.js'
import { getPseudoCommands } from '../../../utils/pseudo-commands.js'
import type { LyftaData, LyftaNonEssentialConfig } from '../types.js'

interface OverviewProps {
  data: LyftaData
  config: LyftaNonEssentialConfig
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function Overview({ data, config, style = 'default', size = 'half' }: OverviewProps): React.ReactElement {
  if (!data || !data.workoutSummaries || data.workoutSummaries.length === 0) {
    return <></>
  }

  const hideTitle = config.overview_hide_title || false
  const title = config.overview_title || 'Overview'
  const weightUnit = config.weight_unit || 'kg'
  const periodDays = config.overview_period_days || 30
  const showVolume = config.overview_show_volume !== false
  const showDuration = config.overview_show_duration !== false
  const showWeeklyAvg = config.overview_show_weekly_avg !== false

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - periodDays)

  const recentWorkouts = data.workoutSummaries.filter((workout) => {
    const workoutDate = new Date(workout.workout_perform_date)
    return workoutDate >= cutoffDate
  })

  const totalWorkouts = recentWorkouts.length
  
  // Calculate total volume from full workouts (more accurate)
  // Use workouts if available, otherwise fallback to workoutSummaries total_volume
  const totalVolume = data.workouts && data.workouts.length > 0
    ? data.workouts
        .filter((workout) => {
          const workoutDate = new Date(workout.workout_perform_date)
          return workoutDate >= cutoffDate
        })
        .reduce((acc, workout) => {
          // Calculate volume from exercises (weight x reps)
          const workoutVolume = workout.exercises.reduce((exerciseAcc, exercise) => {
            const exerciseVolume = exercise.sets.reduce((setAcc, set) => {
              if (set.weight && set.reps && set.is_completed) {
                const weight = parseFloat(set.weight)
                const reps = parseInt(set.reps, 10)
                if (!isNaN(weight) && !isNaN(reps)) {
                  return setAcc + weight * reps // volume em kg
                }
              }
              return setAcc
            }, 0)
            return exerciseAcc + exerciseVolume
          }, 0)
          return acc + workoutVolume
        }, 0)
    : recentWorkouts.reduce((acc, w) => acc + (w.total_volume || 0) / 1000, 0) // Fallback: convert grams to kg

  const totalDurationMinutes = recentWorkouts.reduce((acc, w) => {
    if (!w.workout_duration) return acc
    const parts = w.workout_duration.split(':')
    if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
      const hours = parseInt(parts[0], 10) || 0
      const minutes = parseInt(parts[1], 10) || 0
      const seconds = parseInt(parts[2], 10) || 0
      return acc + hours * 60 + minutes + seconds / 60
    }
    return acc
  }, 0)

  const totalDurationHours = Math.floor(totalDurationMinutes / 60)
  const totalDurationMins = Math.round(totalDurationMinutes % 60)
  const totalDurationStr =
    totalDurationMinutes > 0
      ? totalDurationHours > 0
        ? `${totalDurationHours}h ${totalDurationMins}m`
        : `${totalDurationMins}m`
      : '0m'

  const workoutsPerWeek =
    periodDays > 0 ? (totalWorkouts / (periodDays / 7)).toFixed(1) : '0'

  return (
    <section id="lyfta-overview">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden">
            {!hideTitle && (
              <DefaultTitle
                title={title}
                icon={<FaChartLine />}
                subtitle={`${periodDays}d overview`}
              />
            )}

            <div className="rounded-lg shadow-sm p-4 mb-3 space-y-3">
              {/* Grid 2x2 responsivo para 415px */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-2xl half:text-xl font-bold text-default-highlight tabular-nums">
                    {totalWorkouts}
                  </div>
                  <div className="text-xs text-default-muted">
                    workouts ({periodDays}d)
                  </div>
                </div>

                {showVolume && (
                  <div className="text-center">
                    <div className="text-2xl half:text-xl font-bold text-default-success tabular-nums">
                                    {totalVolume}
                    </div>
                    <div className="text-xs text-default-muted">
                      volume {weightUnit}
                    </div>
                  </div>
                )}

                {showDuration && (
                  <div className="text-center">
                    <div className="text-2xl half:text-xl font-bold text-default-highlight tabular-nums">
                      {totalDurationMinutes > 0
                        ? Math.round(totalDurationMinutes / 60)
                        : 0}
                      h
                    </div>
                    <div className="text-xs text-default-muted">
                      total duration
                    </div>
                  </div>
                )}

                {showWeeklyAvg && workoutsPerWeek !== '0' && (
                  <div className="text-center">
                    <div className="text-2xl half:text-xl font-bold text-default-success tabular-nums">
                      {workoutsPerWeek}x
                    </div>
                    <div className="text-xs text-default-muted">
                      per week (avg)
                    </div>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-default-muted text-center">
                {totalWorkouts > 0
                  ? `${totalWorkouts} workouts • ${workoutsPerWeek}x/week • ${totalDurationStr}`
                  : 'No workouts in this period'}
              </p>
            </div>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'lyfta',
                section: 'overview',
                size,
              })}
            />
            <TerminalLineWithDots
              title={`Workouts (${periodDays}d)`}
              value={String(totalWorkouts)}
            />
            {showWeeklyAvg && (
              <TerminalLineWithDots
                title="Avg per Week"
                value={`${workoutsPerWeek} workouts`}
              />
            )}
            {showVolume && (
              <TerminalLineWithDots
                title="Total Volume"
                value={`${totalVolume}${weightUnit}`}
              />
            )}
            {showDuration && (
              <TerminalLineWithDots
                title="Total Duration"
                value={totalDurationStr}
              />
            )}
          </>
        }
      />
    </section>
  )
}
