import React from 'react'
import { FaClock } from 'react-icons/fa'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalLineWithDots } from '../../../templates/Terminal/TerminalLineWithDots'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { LyftaData, LyftaNonEssentialConfig } from '../types'
import { formatWeight } from '../utils/weight'

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
  const maxWorkouts = config.workouts_max || 5
  const weightUnit = config.weight_unit || 'kg'
  const workouts = data.workoutSummaries.slice(0, maxWorkouts)

  return (
    <section id="lyfta-recent-workouts">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<FaClock />} />}

            <div className="flex flex-col gap-2 half:gap-1.5">
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="px-4 py-3 half:px-3 half:py-2.5 rounded-xl border border-default-border/50 bg-default-card/40"
                >
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <p className="text-sm half:text-xs font-bold text-default-foreground truncate flex-1 min-w-0">
                      {workout.title}
                    </p>
                    <p className="text-xs half:text-[10px] text-default-muted flex-shrink-0 whitespace-nowrap">
                      {new Date(workout.workout_perform_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs half:text-[10px] text-default-muted">
                    <span>Volume: {formatWeight(workout.total_volume, weightUnit)}</span>
                    {workout.workout_duration && <span>Duration: {workout.workout_duration}</span>}
                  </div>
                </div>
              ))}
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
              const workoutDate = new Date(workout.workout_perform_date).toLocaleDateString()
              const volume = formatWeight(workout.total_volume, weightUnit)
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

