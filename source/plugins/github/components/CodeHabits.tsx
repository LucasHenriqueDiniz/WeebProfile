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

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const DefaultCodeHabits = ({ data }: { data: CodeHabitsData }) => {
  // Safe calculation of max values with null checks
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
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-default-fg">Code Habits</h2>

      {/* Commits by Hour */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-default-muted">Commit activity per hour of day</h3>
        <div className="flex justify-between items-end h-32">
          {Array.from({ length: 24 }).map((_, hour) => {
            const commits = data.commitsByHour[hour] || 0
            const height = maxCommitsByHour ? `${Math.max((commits / maxCommitsByHour) * 100, 5)}%` : "5%"
            return (
              <div key={hour} className="flex flex-col items-center w-8">
                <span className="text-xs text-default-muted mb-1">{commits}</span>
                <div className="w-4 bg-default-surface rounded-sm" style={{ height: "100%" }}>
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

      {/* Two-column layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Commits by Day */}
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-default-muted">Commit activity per day of week</h3>
          <div className="flex flex-col gap-3">
            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => {
              const commits = data.commitsByDay[day] || 0
              const width = maxCommitsByDay ? `${Math.max((commits / maxCommitsByDay) * 100, 5)}%` : "5%"
              return (
                <div key={day} className="flex flex-col">
                  <div className="flex justify-between text-xs text-default-muted mb-1">
                    <span>{day.slice(0, 3)}</span>
                    <span>{commits}</span>
                  </div>
                  <div className="w-full bg-default-surface rounded-sm h-2">
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
        </div>

        {/* Languages */}
        {data.languages && Object.keys(data.languages).length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-default-muted">Language activity</h3>
            <div className="flex flex-col gap-3">
              {Object.entries(data.languages)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 7)
                .map(([lang, count]) => {
                  const total = Object.values(data.languages || {}).reduce((a, b) => a + b, 0)
                  const percentage = total > 0 ? (count / total) * 100 : 0
                  return (
                    <div key={lang} className="flex flex-col">
                      <div className="flex justify-between text-xs text-default-muted mb-1">
                        <span>{lang}</span>
                        <span>{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-default-surface rounded-sm h-2">
                        <div
                          className="h-full bg-default-highlight rounded-sm transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        )}
      </div>

      {/* Only show stats if they exist */}
      {data.commitStats && (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-default-muted">Commit Statistics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-default-surface rounded-lg">
              <div className="text-2xl font-bold text-default-fg">{data.commitStats.averageChangesPerCommit || 0}</div>
              <div className="text-xs text-default-muted">Avg. Changes per Commit</div>
            </div>
            <div className="p-4 bg-default-surface rounded-lg">
              <div className="text-2xl font-bold text-default-fg">{data.commitStats.totalFilesChanged || 0}</div>
              <div className="text-xs text-default-muted">Total Files Changed</div>
            </div>
            <div className="p-4 bg-default-surface rounded-lg">
              <div className="text-2xl font-bold text-default-fg">{data.commitStats.largestCommit || 0}</div>
              <div className="text-xs text-default-muted">Largest Commit (changes)</div>
            </div>
          </div>
        </div>
      )}

      {/* Footer with analyzed commits info */}
      <div className="text-sm text-default-muted text-center">
        Computed from last {data.analyzedCommits || 0} commits
      </div>
    </div>
  )
}

const TerminalCodeHabits = ({ data }: { data: CodeHabitsData }) => {
  // Add safety checks here too
  if (!data) {
    return <div>No data available</div>
  }

  const getBarChart = (value: number, max: number, width: number = 20): string => {
    const filled = Math.round(((value || 0) / (max || 1)) * width)
    return "█".repeat(filled) + "░".repeat(width - filled)
  }

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
    <div className="flex flex-col gap-1">
      <span className="text-terminal-muted">Commits by Hour:</span>
      {Array.from({ length: 24 }).map((_, hour) => {
        const commits = data?.commitsByHour?.[hour] || 0
        return (
          <span key={hour} className="flex items-center gap-2">
            <span className="text-terminal-muted w-8">{`${hour}:00`}</span>
            <span className="text-terminal-success">{getBarChart(commits, maxCommitsByHour)}</span>
            <span className="text-terminal-muted">{abbreviateNumber(commits)}</span>
          </span>
        )
      })}

      <span className="text-terminal-muted mt-2">Commits by Day:</span>
      {DAYS.map((day) => {
        const commits = data?.commitsByDay?.[day] || 0
        return (
          <span key={day} className="flex items-center gap-2">
            <span className="text-terminal-muted w-12">{day.slice(0, 3)}</span>
            <span className="text-terminal-success">{getBarChart(commits, maxCommitsByDay)}</span>
            <span className="text-terminal-muted">{abbreviateNumber(commits)}</span>
          </span>
        )
      })}

      <span className="text-terminal-muted text-right mt-2">
        Total: {abbreviateNumber(data?.totalCommits || 0)} commits
      </span>
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

  const title = github.code_habits_title ?? "Code Habits"
  const hideTitle = github.code_habits_hide_title ?? false

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
            <TerminalCommand command={`gh code-habits ${github.username}`} />
            <TerminalCodeHabits data={data} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}
