import React from 'react'
import { FaCode } from 'react-icons/fa'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle.js'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle.js'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand.js'
import { TerminalHorizontalMultipleItemsBar } from '../../../templates/Terminal/TerminalHorizontalMultipleItems.js'
import { TerminalLine } from '../../../templates/Terminal/TerminalLine.js'
import { TerminalLineWithDots } from '../../../templates/Terminal/TerminalLineWithDots.js'
import { abbreviateNumber } from '../../../utils/number.js'
import { getPseudoCommands } from '../../../utils/pseudo-commands.js'
import { randomColorWithString } from '../../../utils/string.js'
import type { GithubConfig, GithubData } from '../types.js'

interface CodeHabitsProps {
  data: GithubData['codeHabits']
  config: GithubConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const DefaultCodeHabits = ({ 
  data, 
  hideLanguages, 
  hideStats, 
  hideWeekdays, 
  hideHours, 
  hideFooter 
}: { 
  data: GithubData['codeHabits']
  hideLanguages?: boolean
  hideStats?: boolean
  hideWeekdays?: boolean
  hideHours?: boolean
  hideFooter?: boolean
}) => {
  const maxCommitsByHour = data.commitsByHour && Object.values(data.commitsByHour).length > 0
    ? Math.max(...Object.values(data.commitsByHour))
    : 0
  const maxCommitsByDay = data.commitsByDay && Object.values(data.commitsByDay).length > 0
    ? Math.max(...Object.values(data.commitsByDay))
    : 0

  return (
    <div className="flex flex-col gap-2">
      {/* Commits by Hour */}
      {!hideHours && (
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-default-muted">Commit activity per hour of day</h3>
          <div className="flex justify-between items-end h-32 gap-[1px]">
            {Array.from({ length: 24 }).map((_, hour) => {
              const commits = data.commitsByHour[hour] || 0
              const height = maxCommitsByHour ? `${Math.max((commits / maxCommitsByHour) * 100, 5)}%` : '5%'
              return (
                <div key={hour} className="flex flex-col items-center w-8 h-full">
                  <div className="w-2 rounded-t-md flex items-end h-full justify-end flex-col">
                    <span className="text-xs text-default-muted mb-1 w-full flex justify-center items-center">
                      {commits}
                    </span>
                    <div
                      className="w-full bg-default-highlight rounded-sm transition-all"
                      style={{ height }}
                      title={`${commits} commits at ${hour}:00`}
                    />
                  </div>
                  <span className="text-xs text-default-muted mt-1">{hour}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 2x2 Grid layout */}
      <div className={`grid gap-x-2 gap-y-2 ${
        !hideLanguages && data.languages && Object.keys(data.languages).length > 0 ? 'grid-cols-2' : 'grid-cols-1'
      }`}>
        {/* Row 1: Titles */}
        {!hideWeekdays && <h3 className="text-sm font-semibold text-default-muted">Commit activity per day of week</h3>}
        {!hideLanguages && data.languages && Object.keys(data.languages).length > 0 && (
          <h3 className="text-sm font-semibold text-default-muted">Language activity</h3>
        )}

        {/* Row 2: Charts */}
        {!hideWeekdays && (
          <div className="flex flex-col gap-1">
            {DAYS.map((day) => {
              const commits = data.commitsByDay[day] || 0
              const width = maxCommitsByDay ? `${Math.max((commits / maxCommitsByDay) * 100, 5)}%` : '1%'
              return (
                <div key={day} className="flex flex-col">
                  <div className="flex justify-between text-xs text-default-muted mb-1 w-full text-center">
                    <span>{day.slice(0, 3)}</span>
                    <span>{commits}</span>
                  </div>
                  <div className="w-full rounded-sm h-2">
                    <div
                      className="h-full bg-default-highlight rounded-sm transition-all"
                      style={{ width }}
                      title={`${commits} commits on ${day}`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!hideLanguages && data.languages && Object.keys(data.languages).length > 0 && (
          <div className="flex flex-col gap-1">
            {Object.entries(data.languages)
              .sort(([, a], [, b]) => b.count - a.count)
              .slice(0, 7)
              .map(([lang, { count, color }]) => {
                const total = Object.values(data.languages).reduce((acc, curr) => acc + curr.count, 0)
                const percentage = total > 0 ? (count / total) * 100 : 0
                return (
                  <div key={lang} className="flex flex-col">
                    <div className="flex justify-between text-xs text-default-muted mb-1">
                      <span className="capitalize">{lang}</span>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full rounded-sm h-2">
                      <div
                        className="h-full rounded-sm transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: color ?? randomColorWithString(lang),
                        }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        )}
      </div>

      {/* Stats */}
      {!hideStats && data.commitStats && (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-default-muted">Commit Statistics</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="px-4 rounded-lg">
              <div className="text-2xl font-bold text-default-highlight text-center">
                {data.commitStats.averageChangesPerCommit || 0}
              </div>
              <div className="text-xs text-default-muted text-center">Avg. Changes per Commit</div>
            </div>
            <div className="px-4 rounded-lg">
              <div className="text-2xl font-bold text-default-highlight text-center">
                {data.commitStats.totalFilesChanged || 0}
              </div>
              <div className="text-xs text-default-muted text-center">Total Files Changed</div>
            </div>
            <div className="px-4 rounded-lg">
              <div className="text-2xl font-bold text-default-highlight text-center">
                {data.commitStats.largestCommit || 0}
              </div>
              <div className="text-xs text-default-muted text-center">Largest Commit (changes)</div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      {!hideFooter && (
        <div className="text-xs text-default-muted text-end">
          Computed from last {data.analyzedCommits || 0} commits
        </div>
      )}
    </div>
  )
}

const TerminalCodeHabits = ({
  data,
  hideLanguages,
  hideStats,
  hideWeekdays,
  hideHours,
  hideFooter,
}: {
  data: GithubData['codeHabits']
  hideLanguages?: boolean
  hideStats?: boolean
  hideWeekdays?: boolean
  hideHours?: boolean
  hideFooter?: boolean
}) => {
  const maxCommitsByHour = data.commitsByHour && Object.values(data.commitsByHour).length > 0
    ? Math.max(...Object.values(data.commitsByHour))
    : 0
  const maxCommitsByDay = data.commitsByDay && Object.values(data.commitsByDay).length > 0
    ? Math.max(...Object.values(data.commitsByDay))
    : 0

  const getBarChart = (value: number, max: number, width: number = 38): string => {
    const filled = Math.round(((value || 0) / (max || 1)) * width)
    return '█'.repeat(filled) + '░'.repeat(width - filled)
  }

  return (
    <div className="flex flex-col gap-1">
      {!hideHours && (
        <>
          <span className="text-terminal-muted my-1">Commits by Hour:</span>
          {Array.from({ length: 24 }).map((_, hour) => {
            const commits = data.commitsByHour[hour] || 0
            return (
              <span key={hour} className="flex items-center overflow-hidden text-sm justify-between w-full">
                <span className="text-terminal-muted w-8">{`${hour}:00`}</span>
                <span className="text-terminal-success">{getBarChart(commits, maxCommitsByHour)}</span>
                <span className="text-terminal-muted">{abbreviateNumber(commits)}</span>
              </span>
            )
          })}
        </>
      )}

      {/* Days */}
      {!hideWeekdays && (
        <>
          <span className="text-terminal-muted my-1">Commits by Day:</span>
          {DAYS.map((day) => {
            const commits = data.commitsByDay[day] || 0
            return (
              <span key={day} className="flex items-center overflow-hidden text-sm">
                <span className="text-terminal-muted w-12">{day.slice(0, 3)}</span>
                <span className="text-terminal-success">{getBarChart(commits, maxCommitsByDay)}</span>
                <span className="text-terminal-muted">{abbreviateNumber(commits)}</span>
              </span>
            )
          })}
        </>
      )}

      {/* Languages */}
      {!hideLanguages && data.languages && Object.keys(data.languages).length > 0 && (
        <>
          <span className="text-terminal-muted my-1">Recent Languages:</span>
          <TerminalHorizontalMultipleItemsBar
            total={Object.values(data.languages).reduce((acc, curr) => acc + curr.count, 0)}
            items={Object.entries(data.languages).map(([_, { count, color }]) => ({
              value: count,
              style: { color },
            }))}
          />
          {Object.entries(data.languages)
            .sort(([, a], [, b]) => b.count - a.count)
            .slice(0, 5)
            .map(([lang, { count, color }]) => (
              <span className="flex flex-col" key={lang}>
                <TerminalLine
                  className={{ right: 'mt-[0.25rem] capitalize' }}
                  style={{ right: { color: color ?? randomColorWithString(lang) } }}
                  right={`██ ${lang}`}
                  left={abbreviateNumber(count)}
                />
              </span>
            ))}
        </>
      )}

      {/* Stats */}
      {!hideStats && data.commitStats && (
        <>
          <span className="text-terminal-muted my-1">Commit Statistics:</span>
          <TerminalLineWithDots
            title="Avg. Changes per Commit"
            value={data.commitStats.averageChangesPerCommit.toString()}
          />
          <TerminalLineWithDots title="Total Files Changed" value={data.commitStats.totalFilesChanged.toString()} />
          <TerminalLineWithDots title="Largest Commit" value={data.commitStats.largestCommit.toString()} />
        </>
      )}

      {!hideFooter && (
        <span className="text-terminal-muted text-right text-xs mt-1">
          {abbreviateNumber(data.analyzedCommits || 0)} commits analyzed
        </span>
      )}
    </div>
  )
}

export function GithubCodeHabits({ data, config, style, size }: CodeHabitsProps): React.ReactElement {
  if (!data) {
    return <></>
  }

  const title = config.code_habits_title ?? 'Code Habits'
  const hideTitle = config.code_habits_hide_title ?? false
  const hideLanguages = config.code_habits_hide_languages ?? false
  const hideStats = config.code_habits_hide_stats ?? false
  const hideWeekdays = config.code_habits_hide_weekdays ?? false
  const hideHours = config.code_habits_hide_hours ?? false
  const hideFooter = config.code_habits_hide_footer ?? false

  return (
    <section id="github-code-habits">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaCode />} />}
            <DefaultCodeHabits 
              data={data} 
              hideLanguages={hideLanguages}
              hideStats={hideStats}
              hideWeekdays={hideWeekdays}
              hideHours={hideHours}
              hideFooter={hideFooter}
            />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'github',
                section: 'code-habits',
                size,
              })}
            />
            <TerminalCodeHabits 
              data={data} 
              hideLanguages={hideLanguages}
              hideStats={hideStats}
              hideWeekdays={hideWeekdays}
              hideHours={hideHours}
              hideFooter={hideFooter}
            />
          </>
        }
      />
    </section>
  )
}

