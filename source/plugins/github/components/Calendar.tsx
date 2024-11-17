import React from "react"
import { FaCalendar } from "react-icons/fa"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import DefaultTitle from "templates/Default/DefaultTitle"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalCommand from "templates/Terminal/TerminalCommand"
import TerminalLineBreak from "templates/Terminal/TerminalLineBreak"
import GITHUB_ENV_VARIABLES from "../ENV_VARIABLES"
import { CalendarData } from "../types/CalendarData"
import getPseudoCommands from "core/utils/getPseudoCommands"

const DefaultCalendar = ({ data }: { data: CalendarData }) => {
  let weeks = data.weeks.slice(-52).reverse()
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const isHalfMode = env.size === "half"

  if (isHalfMode) {
    weeks = weeks.slice(-26)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.contributionDays.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className="w-[0.7rem] h-[0.7rem] rounded-sm"
                // IF background is not white, make it slightly transparent
                style={{ backgroundColor: day.color === "rgb(235, 237, 240)" ? "rgba(192, 192, 192,0.3)" : day.color }}
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
  let weeks = data.weeks.slice(-52).reverse()
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const isHalfMode = env.size === "half"

  const getContributionSymbol = (count: number): string => {
    if (count === 0) return "⬚"
    if (count <= 3) return "▢"
    if (count <= 6) return "▣"
    if (count <= 9) return "▥"
    return "▩"
  }

  if (isHalfMode) {
    weeks = weeks.slice(-26)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="inline-grid grid-flow-col gap-1 text-[0.75rem]">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-rows-7 w-[0.60rem]">
            {week.contributionDays.map((day, dayIndex) => (
              <span
                key={`${weekIndex}-${dayIndex}`}
                title={`${day.contributionCount} contributions on ${new Date(day.date).toLocaleDateString()}`}
                className="flex items-center justify-center text-baseline w-full h-full"
                style={{
                  color: day.color,
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

  const title = github.calendar_title ?? (GITHUB_ENV_VARIABLES.calendar_title.defaultValue as string)
  const hideTitle = github.calendar_hide_title ?? (GITHUB_ENV_VARIABLES.calendar_hide_title.defaultValue as boolean)

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
            <TerminalCommand
              command={getPseudoCommands({
                prefix: "gh",
                plugin: "github",
                section: "contrib-calendar",
                username: github.username,
              })}
            />
            <TerminalCalendar data={data} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}
