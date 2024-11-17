import React from "react"
import { FaCode } from "react-icons/fa"
import { abbreviateNumber } from "source/helpers/number"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import DefaultTitle from "templates/Default/DefaultTitle"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalCommand from "templates/Terminal/TerminalCommand"
import TerminalLineBreak from "templates/Terminal/TerminalLineBreak"
import { CodeHabitsData } from "../types/CodeHabitsData"
import ErrorMessage from "source/templates/Error_Style"
import randomColorWithString from "source/helpers/string"
import GITHUB_ENV_VARIABLES from "../ENV_VARIABLES"
import TerminalHorizontalMultipleItemsBar from "source/templates/Terminal/TerminalHorizontalMultipleItems"
import TerminalLine from "source/templates/Terminal/TerminalLine"
import TerminalLineWithDots from "source/templates/Terminal/TerminalLineWithDots"
import getPseudoCommands from "core/utils/getPseudoCommands"

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const DefaultCodeHabits = ({ data }: { data: CodeHabitsData }) => {
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const hideLanguages =
    env.github?.code_habits_hide_languages ?? (GITHUB_ENV_VARIABLES.code_habits_hide_languages.defaultValue as boolean)
  const hideStats =
    env.github?.code_habits_hide_stats ?? (GITHUB_ENV_VARIABLES.code_habits_hide_stats.defaultValue as boolean)
  const hideWeekdays =
    env.github?.code_habits_hide_weekdays ?? (GITHUB_ENV_VARIABLES.code_habits_hide_weekdays.defaultValue as boolean)
  const hideHours =
    env.github?.code_habits_hide_hours ?? (GITHUB_ENV_VARIABLES.code_habits_hide_hours.defaultValue as boolean)
  const hideFooter =
    env.github?.code_habits_hide_footer ?? (GITHUB_ENV_VARIABLES.code_habits_hide_footer.defaultValue as boolean)

  const maxCommitsByHour = data?.commitsByHour
    ? Object.values(data.commitsByHour).length > 0
      ? Math.max(...Object.values(data.commitsByHour))
      : 0
    : 0

  const maxCommitsByDay = data?.commitsByDay
    ? Object.values(data.commitsByDay).length > 0
      ? Math.max(...Object.values(data.commitsByDay))
      : 0
    : 0

  return (
    <div className="flex flex-col gap-2">
      {/* Commits by Hour */}
      <div className="flex flex-col">
        {!hideHours && (
          <>
            <h3 className="text-sm font-semibold text-default-muted">Commit activity per hour of day</h3>
            <div className="flex justify-between items-end h-32 gap-[1px]">
              {Array.from({ length: 24 }).map((_, hour) => {
                const commits = data.commitsByHour[hour] || 0
                const height = maxCommitsByHour ? `${Math.max((commits / maxCommitsByHour) * 100, 5)}%` : "5%"
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
          </>
        )}
      </div>

      {/* 2x2 Grid layout */}
      <div
        className={`grid gap-x-2 gap-y-2 ${
          data.languages && Object.keys(data.languages).length > 0 ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
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
              const width = maxCommitsByDay ? `${Math.max((commits / maxCommitsByDay) * 100, 5)}%` : "1%"
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

      {/* Only show stats if they exist */}
      {!hideStats && data.commitStats && (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-default-muted">Commit Statistics</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="px-4 rounded-lg">
              <div className="text-2xl font-bold text-default-fg text-center">
                {data.commitStats.averageChangesPerCommit || 0}
              </div>
              <div className="text-xs text-default-muted text-center">Avg. Changes per Commit</div>
            </div>
            <div className="px-4 rounded-lg">
              <div className="text-2xl font-bold text-default-fg text-center">
                {data.commitStats.totalFilesChanged || 0}
              </div>
              <div className="text-xs text-default-muted text-center">Total Files Changed</div>
            </div>
            <div className="px-4 rounded-lg">
              <div className="text-2xl font-bold text-default-fg text-center">
                {data.commitStats.largestCommit || 0}
              </div>
              <div className="text-xs text-default-muted text-center">Largest Commit (changes)</div>
            </div>
          </div>
        </div>
      )}

      {/* Footer with analyzed commits info */}
      {!hideFooter && (
        <div className="text-xs text-default-muted text-end">
          Computed from last {data.analyzedCommits || 0} commits
        </div>
      )}
    </div>
  )
}

const TerminalCodeHabits = ({ data }: { data: CodeHabitsData }) => {
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const hideLanguages =
    env.github?.code_habits_hide_languages ?? (GITHUB_ENV_VARIABLES.code_habits_hide_languages.defaultValue as boolean)
  const hideStats =
    env.github?.code_habits_hide_stats ?? (GITHUB_ENV_VARIABLES.code_habits_hide_stats.defaultValue as boolean)
  const hideWeekdays =
    env.github?.code_habits_hide_weekdays ?? (GITHUB_ENV_VARIABLES.code_habits_hide_weekdays.defaultValue as boolean)
  const hideHours =
    env.github?.code_habits_hide_hours ?? (GITHUB_ENV_VARIABLES.code_habits_hide_hours.defaultValue as boolean)
  const hideFooter =
    env.github?.code_habits_hide_footer ?? (GITHUB_ENV_VARIABLES.code_habits_hide_footer.defaultValue as boolean)

  const maxCommitsByHour = data?.commitsByHour
    ? Object.values(data.commitsByHour).length > 0
      ? Math.max(...Object.values(data.commitsByHour))
      : 0
    : 0

  const maxCommitsByDay = data?.commitsByDay
    ? Object.values(data.commitsByDay).length > 0
      ? Math.max(...Object.values(data.commitsByDay))
      : 0
    : 0

  const getBarChart = (value: number, max: number, width: number = 38): string => {
    const filled = Math.round(((value || 0) / (max || 1)) * width)
    return "█".repeat(filled) + "░".repeat(width - filled)
  }

  return (
    <div className="flex flex-col gap-1">
      {!hideHours && (
        <>
          <span className="text-terminal-muted my-1">Commits by Hour:</span>
          {Array.from({ length: 24 }).map((_, hour) => {
            const commits = data?.commitsByHour?.[hour] || 0
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
            const commits = data?.commitsByDay?.[day] || 0
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
      {!hideLanguages && Object.keys(data.languages || {}).length > 0 && (
        <>
          <span className="text-terminal-muted my-1">Recent Languages:</span>
          <TerminalHorizontalMultipleItemsBar
            total={Object.values(data.languages || {}).reduce((acc, curr) => acc + curr.count, 0)}
            items={Object.entries(data.languages || {}).map(([_, { count, color }]) => ({
              value: count,
              style: { color },
            }))}
          />
          {Object.entries(data.languages || {})
            .sort(([, a], [, b]) => b.count - a.count)
            .slice(0, 5)
            .map(([lang, { count, color }]) => (
              <span className="flex flex-col" key={lang}>
                <TerminalLine
                  className={{ right: "mt-[0.25rem] capitalize" }}
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
          {abbreviateNumber(data?.analyzedCommits || 0)} commits analyzed
        </span>
      )}
    </div>
  )
}

export default function GithubCodeHabits({ data }: { data: CodeHabitsData }): JSX.Element {
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const github = env.github
  if (!github) throw new Error("Github plugin not found")

  if (!data) {
    return <ErrorMessage message="No code habits data available" />
  }

  const title = github.code_habits_title ?? (GITHUB_ENV_VARIABLES.code_habits_title.defaultValue as string)
  const hideTitle =
    github.code_habits_hide_title ?? (GITHUB_ENV_VARIABLES.code_habits_hide_title.defaultValue as boolean)

  return (
    <section id="github-code-habits">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaCode />} />}
            <DefaultCodeHabits data={data} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                prefix: "gh",
                plugin: "github",
                section: "code-habits",
                username: github.username,
              })}
            />
            <TerminalCodeHabits data={data} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}
