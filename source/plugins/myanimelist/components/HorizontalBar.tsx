import getPseudoCommands from "core/utils/getPseudoCommands"
import React from "react"
import { FaQuestionCircle } from "react-icons/fa"
import { FaCircleCheck, FaCirclePause, FaCirclePlay, FaCircleXmark } from "react-icons/fa6"
import getEnvVariables from "source/plugins/@utils/getEnvVariables"
import ErrorMessage from "source/templates/Error_Style"
import { Stat } from "templates/Default/Default_StatRow"
import DefaultTitle from "templates/Default/Default_Title"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalCommand from "source/templates/Terminal/TerminalCommand"
import TerminalLineBreak from "templates/Terminal/Terminal_LineBreak"
import MAL_ENV_VARIABLES from "../ENV_VARIABLES"
import { AnimeStatistics, MangaStatistics } from "../types/malStatisticsResponse"
import { IoStatsChartOutline } from "react-icons/io5"
import { abbreviateNumber } from "source/helpers/number"
import TerminalLine from "source/templates/Terminal/TerminalLine"

interface HorizontalBarProps {
  watching: number
  completed: number
  onHold: number
  dropped: number
  planToWatch: number
}

const HorizontalBar = ({ watching, completed, onHold, dropped, planToWatch }: HorizontalBarProps): JSX.Element => {
  const total = watching + completed + onHold + dropped + planToWatch

  const watchingPercent = (watching / total) * 100
  const completedPercent = (completed / total) * 100
  const onHoldPercent = (onHold / total) * 100
  const droppedPercent = (dropped / total) * 100
  const planToWatchPercent = (planToWatch / total) * 100

  return (
    <div className="flex h-2.5 w-full rounded overflow-hidden">
      <span className="bg-mal-watching" style={{ width: `${watchingPercent}%` }} />
      <span className="bg-mal-completed" style={{ width: `${completedPercent}%` }} />
      <span className="bg-mal-on-hold" style={{ width: `${onHoldPercent}%` }} />
      <span className="bg-mal-dropped" style={{ width: `${droppedPercent}%` }} />
      <span className="bg-mal-plan-to-watch" style={{ width: `${planToWatchPercent}%` }} />
    </div>
  )
}

const TerminalHorizontalBar = ({
  watching,
  completed,
  onHold,
  dropped,
  planToWatch,
}: HorizontalBarProps): JSX.Element => {
  const total = watching + completed + onHold + dropped + planToWatch
  const barWidth = 49 // Total width of the ASCII bar

  // Calculate number of characters for each section
  const watchingChars = Math.round((watching / total) * barWidth)
  const completedChars = Math.round((completed / total) * barWidth)
  const onHoldChars = Math.round((onHold / total) * barWidth)
  const droppedChars = Math.round((dropped / total) * barWidth)
  const planToWatchChars = barWidth - (watchingChars + completedChars + onHoldChars + droppedChars)

  return (
    <>
      <div className="font-mono tracking-tighter text-center mx-1 overflow-hidden">
        <span className="text-mal-watching">{"█".repeat(watchingChars)}</span>
        <span className="text-mal-completed">{"█".repeat(completedChars)}</span>
        <span className="text-mal-on-hold">{"█".repeat(onHoldChars)}</span>
        <span className="text-mal-dropped">{"█".repeat(droppedChars)}</span>
        <span className="text-mal-plan-to-watch">{"█".repeat(planToWatchChars)}</span>
      </div>
      <span className="flex flex-col">
        <TerminalLine
          className={{ right: "text-mal-watching mt-[0.25rem]" }}
          right="██ Watching"
          left={abbreviateNumber(watching)}
        />
        <TerminalLine
          className={{ right: "text-mal-completed mt-[0.25rem]" }}
          right="██ Completed"
          left={abbreviateNumber(completed)}
        />
        <TerminalLine
          className={{ right: "text-mal-on-hold mt-[0.25rem]" }}
          right="██ On Hold"
          left={abbreviateNumber(onHold)}
        />
        <TerminalLine
          className={{ right: "text-mal-dropped mt-[0.25rem]" }}
          right="██ Dropped"
          left={abbreviateNumber(dropped)}
        />
        <TerminalLine
          className={{ right: "text-mal-plan-to-watch mt-[0.25rem]" }}
          right="██ Plan to Watch"
          left={abbreviateNumber(planToWatch)}
        />
      </span>
    </>
  )
}

export default function StatisticsHorizontalBar({ data }: { data: AnimeStatistics | MangaStatistics }): JSX.Element {
  const { myanimelist } = getEnvVariables()
  if (!myanimelist) throw new Error("MAL plugin not found in MalStatistics component")
  if (!data) return <ErrorMessage message="No data found in StatisticsHorizontalBar component" />

  const watching = data.watching || data.reading
  const completed = data.completed
  const onHold = data.on_hold
  const dropped = data.dropped
  const planToWatch = data.plan_to_watch || data.plan_to_read
  const isAnime = "days_watched" in data

  const animeTitle = myanimelist.statistics_anime_title ?? (MAL_ENV_VARIABLES.anime_bar_title.defaultValue as string)
  const mangeTitle = myanimelist.statistics_manga_title ?? (MAL_ENV_VARIABLES.manga_bar_title.defaultValue as string)
  const hideTitle = myanimelist.manga_bar_hide_title ?? myanimelist.anime_bar_hide_title ?? false

  return (
    <section id="mal-manga-or-anime-bar">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle icon={<IoStatsChartOutline />} title={isAnime ? animeTitle : mangeTitle} />}
            <HorizontalBar
              watching={watching}
              completed={completed}
              onHold={onHold}
              dropped={dropped}
              planToWatch={planToWatch}
            />
            <ul className="flex flex-row gap-2 mt-2 justify-between h-full half-mode:grid half-mode:grid-cols-2">
              <Stat
                title={isAnime ? "Watching" : "Reading"}
                value={watching.toString()}
                icon={<FaCirclePlay className="fill-mal-watching" />}
              />
              <Stat
                title="Completed"
                value={completed.toString()}
                icon={<FaCircleCheck className="fill-mal-completed" />}
              />
              <Stat title="On Hold" value={onHold.toString()} icon={<FaCirclePause className="fill-mal-on-hold" />} />
              <Stat title="Dropped" value={dropped.toString()} icon={<FaCircleXmark className="fill-mal-dropped" />} />
              <Stat
                title="Plan to Watch"
                value={planToWatch.toString()}
                icon={<FaQuestionCircle className="default-plan-to-watch" />}
              />
            </ul>
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "mal",
                section: isAnime ? "anime-bar" : "manga-bar",
                username: myanimelist.username,
                type: isAnime ? "anime" : "manga",
              })}
            />
            <TerminalHorizontalBar
              watching={watching}
              completed={completed}
              onHold={onHold}
              dropped={dropped}
              planToWatch={planToWatch}
            />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}
