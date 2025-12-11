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
  if (!data || !data.statistics) {
    return <></>
  }

  const hideTitle = config.statistics_hide_title || false
  const title = config.statistics_title || 'Statistics'
  const weightUnit = config.weight_unit || 'kg'
  const stats = data.statistics

  return (
    <section id="lyfta-statistics">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<GiWeightLiftingUp />} />}

            <div className="grid grid-cols-2 gap-3 half:gap-2.5">
              <div className="flex flex-col px-4 py-3 half:px-3 half:py-2.5 rounded-xl border border-default-border/50 bg-default-card/40">
                <p className="text-[10px] font-bold uppercase tracking-wider text-default-muted mb-2 half:mb-1.5">
                  Total Workouts
                </p>
                <p className="text-xl half:text-lg font-black text-default-foreground tabular-nums">
                  {stats.totalWorkouts}
                </p>
              </div>

              <div className="flex flex-col px-4 py-3 half:px-3 half:py-2.5 rounded-xl border border-default-border/50 bg-default-card/40">
                <p className="text-[10px] font-bold uppercase tracking-wider text-default-muted mb-2 half:mb-1.5">
                  Total Weight
                </p>
                <p className="text-xl half:text-lg font-black text-default-foreground tabular-nums">
                  {formatWeight(stats.totalLiftedWeight, weightUnit)}
                </p>
              </div>

              <div className="flex flex-col px-4 py-3 half:px-3 half:py-2.5 rounded-xl border border-default-border/50 bg-default-card/40">
                <p className="text-[10px] font-bold uppercase tracking-wider text-default-muted mb-2 half:mb-1.5">
                  Current Streak
                </p>
                <p className="text-xl half:text-lg font-black text-default-foreground tabular-nums">
                  {Math.floor(stats.currentStreak / 7)} weeks
                </p>
              </div>

              <div className="flex flex-col px-4 py-3 half:px-3 half:py-2.5 rounded-xl border border-default-border/50 bg-default-card/40">
                <p className="text-[10px] font-bold uppercase tracking-wider text-default-muted mb-2 half:mb-1.5">
                  Longest Streak
                </p>
                <p className="text-xl half:text-lg font-black text-default-foreground tabular-nums">
                  {Math.floor(stats.longestStreak / 7)} weeks
                </p>
              </div>
            </div>

            {stats.favoriteExercise && (
              <div className="px-4 py-3 half:px-3 half:py-2.5 rounded-xl border border-default-border/50 bg-default-card/40">
                <p className="text-[10px] font-bold uppercase tracking-wider text-default-muted mb-1 half:mb-0.5">
                  Favorite Exercise
                </p>
                <p className="text-base half:text-sm font-bold text-default-foreground">
                  {stats.favoriteExercise}
                </p>
              </div>
            )}
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
            <TerminalLineWithDots title="Total Workouts" value={String(stats.totalWorkouts)} />
            <TerminalLineWithDots 
              title="Total Weight" 
              value={formatWeight(stats.totalLiftedWeight, weightUnit)}
            />
            <TerminalLineWithDots title="Current Streak" value={`${Math.floor(stats.currentStreak / 7)} weeks`} />
            <TerminalLineWithDots title="Longest Streak" value={`${Math.floor(stats.longestStreak / 7)} weeks`} />
            {stats.favoriteExercise && (
              <TerminalLineWithDots title="Favorite Exercise" value={stats.favoriteExercise} />
            )}
          </>
        }
      />
    </section>
  )
}

