import React from "react"
import { FaCalendar } from "react-icons/fa"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import DefaultTitle from "templates/Default/DefaultTitle"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalCommand from "templates/Terminal/TerminalCommand"
import TerminalLineBreak from "templates/Terminal/TerminalLineBreak"
import { CalendarData } from "../types/CalendarData"

const DefaultCalendar = ({ data }: { data: CalendarData }) => {
  const weeks = data.weeks.slice(-52) // Last year
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const isHalfMode = env.size === "half"

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1">
        {weeks.slice(isHalfMode ? -26 : -52).map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.contributionDays.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: day.color }}
                title={`${day.contributionCount} contributions on ${new Date(day.date).toLocaleDateString()}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-end text-xs text-default-muted">
        {data.totalContributions} contributions in the last {isHalfMode ? "6 months" : "year"}
      </div>
    </div>
  )
}

const TerminalCalendar = ({ data }: { data: CalendarData }) => {
  const weeks = data.weeks.slice(-52)
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const isHalfMode = env.size === "half"

  const getContributionSymbol = (count: number): string => {
    if (count === 0) return "⬚"
    if (count <= 3) return "▢"
    if (count <= 6) return "▤"
    if (count <= 9) return "▣"
    return "█"
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap gap-1">
        {weeks.slice(isHalfMode ? -26 : -52).map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-0">
            {week.contributionDays.map((day, dayIndex) => (
              <span
                key={`${weekIndex}-${dayIndex}`}
                className="text-terminal-muted"
                title={`${day.contributionCount} contributions on ${new Date(day.date).toLocaleDateString()}`}
                style={{
                  backgroundColor: day.color,
                }}
              >
                {getContributionSymbol(day.contributionCount)}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="text-terminal-muted text-right">
        {data.totalContributions} contributions in the last {isHalfMode ? "6 months" : "year"}
      </div>
    </div>
  )
}

export default function GithubCalendar({ data }: { data: CalendarData }): JSX.Element {
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const github = env.github
  if (!github) throw new Error("Github plugin not found")

  const title = github.calendar_title ?? "Contribution Calendar"
  const hideTitle = github.calendar_hide_title ?? false

  return (
    <section id="github-calendar">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaCalendar />} />}
            <DefaultCalendar data={data} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand command={`gh contrib-calendar ${github.username}`} />
            <TerminalCalendar data={data} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}
