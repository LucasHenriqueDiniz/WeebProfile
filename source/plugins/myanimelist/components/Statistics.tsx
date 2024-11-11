import getPseudoCommands from "core/utils/getPseudoCommands"
import { abbreviateNumber } from "helpers/number"
import React from "react"
import { FaBookOpen, FaCalendar, FaDatabase, FaQuestionCircle, FaStar, FaVideo } from "react-icons/fa"
import { FaCircleCheck, FaCirclePause, FaCirclePlay, FaCircleXmark } from "react-icons/fa6"
import { IoStatsChartOutline } from "react-icons/io5"
import { RiRestartFill } from "react-icons/ri"
import { emojiStatus } from "source/helpers/emoji"
import getEnvVariables from "source/plugins/@utils/getEnvVariables"
import ErrorMessage from "source/templates/Error_Style"
import { StatisticRow } from "templates/Default/Default_StatRow"
import DefaultTitle from "templates/Default/Default_Title"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalCommand from "source/templates/Terminal/TerminalCommand"
import TerminalGrid from "source/templates/Terminal/TerminalGrid"
import TerminalLineBreak from "templates/Terminal/Terminal_LineBreak"
import { GridItemProps } from "templates/types"
import MAL_ENV_VARIABLES from "../ENV_VARIABLES"
import { MalStatisticsResponse } from "../types/malStatisticsResponse"

export default function MalStatistics({ data }: { data: MalStatisticsResponse }): JSX.Element {
  const { myanimelist } = getEnvVariables()
  if (!myanimelist) throw new Error("MAL plugin not found in MalStatistics component")
  if (!data) return <ErrorMessage message="No data found in MalStatistics component" />

  const animeStatistics = data.anime
  const mangaStatistics = data.manga

  const hideTitle = myanimelist.statistics_hide_title
  const statisticsMedia = myanimelist.statistics_media ?? (MAL_ENV_VARIABLES.statistics_media.defaultValue as string)
  const mangaTitle =
    myanimelist.statistics_manga_title ?? (MAL_ENV_VARIABLES.statistics_manga_title.defaultValue as string)
  const animeTitle =
    myanimelist.statistics_anime_title ?? (MAL_ENV_VARIABLES.statistics_anime_title.defaultValue as string)

  const showBoth = statisticsMedia === "both"
  const showAnime = showBoth || statisticsMedia === "anime"
  const showManga = showBoth || statisticsMedia === "manga"

  const animeDataAsGridItemProps: GridItemProps[] = [
    {
      title: "Mean Score",
      value: animeStatistics.mean_score.toString(),
    },
    {
      title: "Total Days",
      value: animeStatistics.days_watched.toString(),
    },
    {
      title: "Total Entries",
      value: abbreviateNumber(animeStatistics.total_entries),
    },
    {
      title: "Rewatched",
      value: abbreviateNumber(animeStatistics.rewatched),
    },
    {
      title: "Episodes Watched",
      value: abbreviateNumber(animeStatistics.episodes_watched),
    },
    {
      title: "Watching",
      value: abbreviateNumber(animeStatistics.watching),
    },
    {
      title: "Completed",
      value: abbreviateNumber(animeStatistics.completed),
    },
    {
      title: "On Hold",
      value: abbreviateNumber(animeStatistics.on_hold),
    },
    {
      title: "Dropped",
      value: abbreviateNumber(animeStatistics.dropped),
    },
    {
      title: "Plan to Watch",
      value: abbreviateNumber(animeStatistics.plan_to_watch),
    },
  ]

  animeDataAsGridItemProps.forEach((item) => {
    item.title = emojiStatus(item.title) + " " + item.title
  })

  const mangaDataAsGridItemProps: GridItemProps[] = [
    {
      title: "Mean Score",
      value: mangaStatistics.mean_score.toString(),
    },
    {
      title: "Total Days",
      value: mangaStatistics.days_read.toString(),
    },
    {
      title: "Total Entries",
      value: abbreviateNumber(mangaStatistics.total_entries),
    },
    {
      title: "Reread",
      value: abbreviateNumber(mangaStatistics.reread),
    },
    {
      title: "Chapters Read",
      value: abbreviateNumber(mangaStatistics.chapters_read),
    },
    {
      title: "Volumes Read",
      value: abbreviateNumber(mangaStatistics.volumes_read),
    },
    {
      title: "Watching",
      value: abbreviateNumber(mangaStatistics.reading),
    },
    {
      title: "Completed",
      value: abbreviateNumber(mangaStatistics.completed),
    },
    {
      title: "On Hold",
      value: abbreviateNumber(mangaStatistics.on_hold),
    },
    {
      title: "Dropped",
      value: abbreviateNumber(mangaStatistics.dropped),
    },
    {
      title: "Plan to Read",
      value: abbreviateNumber(mangaStatistics.plan_to_read),
    },
  ]

  mangaDataAsGridItemProps.forEach((item) => {
    item.title = emojiStatus(item.title) + " " + item.title
  })

  return (
    <section id="mal-statistics">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            <div className="w-full flex half-mode:flex-col gap-2">
              {showAnime && (
                <div className="flex flex-col w-full">
                  {!hideTitle && <DefaultTitle icon={<IoStatsChartOutline />} title={animeTitle} />}
                  <div className="w-full flex">
                    <StatisticRow
                      rows={[
                        {
                          icon: <FaStar className="fill-primary" />,
                          title: "Mean Score",
                          value: abbreviateNumber(animeStatistics.mean_score),
                          strong: true,
                        },
                        {
                          icon: <FaCirclePlay className="fill-mal-watching" />,
                          title: "Watching",
                          value: abbreviateNumber(animeStatistics.watching),
                        },
                        {
                          icon: <FaCircleCheck className="fill-mal-completed" />,
                          title: "Completed",
                          value: abbreviateNumber(animeStatistics.completed),
                        },
                        {
                          icon: <FaCirclePause className="fill-mal-on-hold" />,
                          title: "On Hold",
                          value: abbreviateNumber(animeStatistics.on_hold),
                        },
                        {
                          icon: <FaCircleXmark className="fill-mal-dropped" />,
                          title: "Dropped",
                          value: abbreviateNumber(animeStatistics.dropped),
                        },
                        {
                          icon: <FaQuestionCircle className="fill-mal-plan-to-watch" />,
                          title: "Plan to Watch",
                          value: abbreviateNumber(animeStatistics.plan_to_watch),
                        },
                      ]}
                    />
                    <StatisticRow
                      rows={[
                        {
                          icon: <FaCalendar className="fill-primary" />,
                          title: "Total Days",
                          value: abbreviateNumber(animeStatistics.days_watched),
                          strong: true,
                        },
                        {
                          icon: <FaDatabase className="fill-primary" />,
                          title: "Total Entries",
                          value: abbreviateNumber(animeStatistics.total_entries),
                        },
                        {
                          icon: <RiRestartFill className="fill-primary" size={16} />,
                          title: "Rewatched",
                          value: abbreviateNumber(animeStatistics.rewatched),
                        },
                        {
                          icon: <FaVideo className="fill-primary" />,
                          title: "Episodes Watched",
                          value: abbreviateNumber(animeStatistics.episodes_watched),
                        },
                      ]}
                    />
                  </div>
                </div>
              )}
              {showManga && (
                <div className="flex flex-col w-full">
                  {!hideTitle && <DefaultTitle icon={<IoStatsChartOutline />} title={mangaTitle} />}
                  <div className="w-full flex">
                    <StatisticRow
                      rows={[
                        {
                          icon: <FaStar className="fill-primary" />,
                          title: "Mean Score",
                          value: abbreviateNumber(mangaStatistics.mean_score),
                          strong: true,
                        },
                        {
                          icon: <FaCirclePlay className="fill-mal-watching" />,
                          title: "Reading",
                          value: abbreviateNumber(mangaStatistics.reading),
                        },
                        {
                          icon: <FaCircleCheck className="fill-mal-completed" />,
                          title: "Completed",
                          value: abbreviateNumber(mangaStatistics.completed),
                        },
                        {
                          icon: <FaCirclePause className="fill-mal-on-hold" />,
                          title: "On Hold",
                          value: abbreviateNumber(mangaStatistics.on_hold),
                        },
                        {
                          icon: <FaCircleXmark className="fill-mal-dropped" />,
                          title: "Dropped",
                          value: abbreviateNumber(mangaStatistics.dropped),
                        },
                        {
                          icon: <FaQuestionCircle className="fill-mal-plan-to-watch" />,
                          title: "Plan to Read",
                          value: abbreviateNumber(mangaStatistics.plan_to_read),
                        },
                      ]}
                    />
                    <StatisticRow
                      rows={[
                        {
                          icon: <FaCalendar className="fill-primary" />,
                          title: "Total Days",
                          value: abbreviateNumber(mangaStatistics.days_read),
                          strong: true,
                        },
                        {
                          icon: <FaDatabase className="fill-primary" />,
                          title: "Total Entries",
                          value: abbreviateNumber(mangaStatistics.total_entries),
                        },
                        {
                          icon: <RiRestartFill className="fill-primary" />,
                          title: "Reread",
                          value: abbreviateNumber(mangaStatistics.reread),
                        },
                        {
                          icon: <FaBookOpen className="fill-primary" />,
                          title: "Chapters Read",
                          value: abbreviateNumber(mangaStatistics.chapters_read),
                        },
                        {
                          icon: <FaVideo className="fill-primary" />,
                          title: "Volumes Read",
                          value: abbreviateNumber(mangaStatistics.volumes_read),
                        },
                      ]}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "mal",
                section: "statistics",
                username: myanimelist.username,
                type: "all",
              })}
            />
            <div className="w-full flex half-mode:flex-col gap-1">
              {showAnime && (
                <div className="flex flex-col w-full">
                  <TerminalGrid data={animeDataAsGridItemProps} rightText={animeTitle} centerText="Values" />
                </div>
              )}
              <TerminalLineBreak className="hidden half:block" />
              {showManga && (
                <div className="flex flex-col w-full">
                  <TerminalGrid data={mangaDataAsGridItemProps} rightText={mangaTitle} centerText="Values" />
                </div>
              )}
            </div>
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}
