import getPseudoCommands from "core/utils/getPseudoCommands"
import React from "react"
import { FaQuestionCircle } from "react-icons/fa"
import { FaCircleCheck, FaCirclePause, FaCirclePlay, FaCircleXmark } from "react-icons/fa6"
import { IoStatsChartOutline } from "react-icons/io5"
import { abbreviateNumber } from "source/helpers/number"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import HorizontalMultipleItemsBar from "source/templates/Default/DefaultHorizontalMultipleItems"
import ErrorMessage from "source/templates/Error_Style"
import TerminalCommand from "source/templates/Terminal/TerminalCommand"
import TerminalHorizontalMultipleItemsBar from "source/templates/Terminal/TerminalHorizontalMultipleItems"
import TerminalLine from "source/templates/Terminal/TerminalLine"
import { Stat } from "templates/Default/Default_StatRow"
import DefaultTitle from "templates/Default/DefaultTitle"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalLineBreak from "templates/Terminal/TerminalLineBreak"
import MAL_ENV_VARIABLES from "../ENV_VARIABLES"
import { AnimeStatistics, MangaStatistics } from "../types/malStatistics"

const TerminalHorizontalBar = ({
  watching,
  completed,
  onHold,
  dropped,
  planToWatch,
}: {
  watching: number
  completed: number
  onHold: number
  dropped: number
  planToWatch: number
}): JSX.Element => {
  return (
    <>
      <TerminalHorizontalMultipleItemsBar
        items={[
          { value: watching, className: "text-mal-watching" },
          { value: completed, className: "text-mal-completed" },
          { value: onHold, className: "text-mal-on-hold" },
          { value: dropped, className: "text-mal-dropped" },
          { value: planToWatch, className: "text-mal-plan-to-watch" },
        ]}
      />
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
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const myanimelist = env.myanimelist
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
            <HorizontalMultipleItemsBar
              items={[
                { value: watching, className: "bg-mal-watching" },
                { value: completed, className: "bg-mal-completed" },
                { value: onHold, className: "bg-mal-on-hold" },
                { value: dropped, className: "bg-mal-dropped" },
                { value: planToWatch, className: "bg-mal-plan-to-watch" },
              ]}
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
