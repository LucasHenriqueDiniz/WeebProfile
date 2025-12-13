import React from 'react'
import { GiWeightLiftingUp } from 'react-icons/gi'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalLineWithDots } from '../../../templates/Terminal/TerminalLineWithDots'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { LyftaData, LyftaNonEssentialConfig } from '../types'
import { formatWeight } from '../utils/weight'

interface StatisticsProps {
  data: LyftaData
  config: LyftaNonEssentialConfig
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function Statistics({ data, config, style = 'default', size = 'half' }: StatisticsProps): React.ReactElement {
  if (!data || !data.statistics || !data.workoutSummaries) {
    return <></>
  }

  const hideTitle = config.statistics_hide_title || false
  const title = config.statistics_title || 'Statistics'
  const weightUnit = config.weight_unit || 'kg'
  const stats = data.statistics

  const longestStreakWeeks = Math.floor(stats.longestStreak / 7)
  const currentStreakWeeks = Math.floor(stats.currentStreak / 7)

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  return (
    <section id="lyfta-statistics">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden">
            {!hideTitle && (
              <DefaultTitle
                title={title}
                icon={<GiWeightLiftingUp />}
                subtitle="Lifetime stats"
              />
            )}

            <div className="rounded-lg shadow-sm p-4 mb-3 space-y-3">
              {/* Métricas principais em grid 2x2 (fica perfeito em 415px) */}
              <div className="grid grid-cols-2 gap-3">
                {stats.totalWorkouts >= 0 && (
                  <div className="text-center">
                    <div className="text-2xl half:text-xl font-bold text-default-highlight tabular-nums">
                      {stats.totalWorkouts}
                    </div>
                    <div className="text-xs text-default-muted">total workouts</div>
                  </div>
                )}

                {stats.totalLiftedWeight > 0 && (
                  <div className="text-center">
                    <div className="text-2xl half:text-xl font-bold text-default-success tabular-nums">
                      {formatNumber(stats.totalLiftedWeight / 1000)}
                    </div>
                    <div className="text-xs text-default-muted">total {weightUnit}</div>
                  </div>
                )}
              </div>

              {/* Chips de streak / favorite – mais leves que cards grandes */}
              {(longestStreakWeeks > 0 ||
                currentStreakWeeks > 0 ||
                stats.favoriteExercise) && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {longestStreakWeeks > 0 && (
                    <div className="inline-flex items-center rounded-full bg-default-muted/10 px-2.5 py-1">
                      <span className="text-[11px] text-default-muted mr-1">
                        longest streak
                      </span>
                      <span className="text-xs font-semibold text-default-success tabular-nums">
                        {longestStreakWeeks}w
                      </span>
                    </div>
                  )}

                  {currentStreakWeeks > 0 &&
                    currentStreakWeeks !== longestStreakWeeks && (
                      <div className="inline-flex items-center rounded-full bg-default-muted/10 px-2.5 py-1">
                        <span className="text-[11px] text-default-muted mr-1">
                          current streak
                        </span>
                        <span className="text-xs font-semibold text-default-highlight tabular-nums">
                          {currentStreakWeeks}w
                        </span>
                      </div>
                    )}

                  {stats.favoriteExercise && (
                    <div className="inline-flex items-center rounded-full bg-default-muted/10 px-2.5 py-1 max-w-full">
                      <span className="text-[11px] text-default-muted mr-1">
                        favorite
                      </span>
                      <span className="text-xs font-semibold text-default-fg truncate">
                        {stats.favoriteExercise}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {stats.totalWorkouts === 0 && (
                <div className="text-center pt-2">
                  <p className="text-sm text-default-muted">
                    No workouts recorded yet
                  </p>
                </div>
              )}
            </div>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'lyfta',
                section: 'statistics',
                size,
              })}
            />
            {stats.totalWorkouts > 0 && (
              <TerminalLineWithDots title="Total Workouts" value={String(stats.totalWorkouts)} />
            )}
            {stats.totalLiftedWeight > 0 && (
              <TerminalLineWithDots
                title="Total Weight"
                value={formatWeight(stats.totalLiftedWeight, weightUnit)}
              />
            )}
            {longestStreakWeeks > 0 && (
              <TerminalLineWithDots title="Longest Streak" value={`${longestStreakWeeks}w`} />
            )}
            {currentStreakWeeks > 0 && currentStreakWeeks !== longestStreakWeeks && (
              <TerminalLineWithDots title="Current Streak" value={`${currentStreakWeeks}w`} />
            )}
            {stats.favoriteExercise && (
              <TerminalLineWithDots title="Favorite Exercise" value={stats.favoriteExercise} />
            )}
          </>
        }
      />
    </section>
  )
}
