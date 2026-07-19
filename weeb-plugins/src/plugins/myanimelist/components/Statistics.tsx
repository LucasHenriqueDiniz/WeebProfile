import React from "react"
import { FaBookOpen, FaCalendar, FaDatabase, FaQuestionCircle, FaStar, FaVideo } from "react-icons/fa"
import { FaCircleCheck, FaCirclePause, FaCirclePlay, FaCircleXmark } from "react-icons/fa6"
import { IoStatsChartOutline } from "react-icons/io5"
import { RiRestartFill } from "react-icons/ri"
import { StatisticRow } from "../../../templates/Default/DefaultStatRow"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalGrid } from "../../../templates/Terminal/TerminalGrid"
import type { GridItemProps } from "../../../templates/types"
import { emojiStatus } from "../../../utils/emoji"
import { abbreviateNumber } from "../../../utils/number"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { MyAnimeListConfig, MyAnimeListData } from "../types"

interface StatisticsProps {
  data: MyAnimeListData["statistics"]
  config: MyAnimeListConfig
  style: "default" | "terminal"
  size: "half" | "full"
  hideTerminalEmojis?: boolean
}

export function Statistics({
  data,
  config,
  style,
  size,
  hideTerminalEmojis = false,
}: StatisticsProps): React.ReactElement {
  if (!data || !data.anime || !data.manga) {
    return <></>
  }

  const animeStatistics = data.anime
  const mangaStatistics = data.manga
  const displayNumber = (value: number | null) => (value === null ? "—" : abbreviateNumber(value))
  const displayPlainNumber = (value: number | null) => (value === null ? "—" : value.toString())

  const hideTitle = config.statistics_hide_title ?? false
  const statisticsMedia = config.statistics_media ?? "both"
  const mangaTitle = config.statistics_manga_title ?? "Manga Statistics"
  const animeTitle = config.statistics_anime_title ?? "Anime Statistics"

  // Determinar o que mostrar baseado em media type
  const showAnime = statisticsMedia === "both" || statisticsMedia === "anime"
  const showManga = statisticsMedia === "both" || statisticsMedia === "manga"

  const animeDataAsGridItemProps: GridItemProps[] = [
    {
      title: emojiStatus("Mean Score", hideTerminalEmojis) + " Mean Score",
      value: displayPlainNumber(animeStatistics.mean_score),
    },
    {
      title: emojiStatus("Total Days", hideTerminalEmojis) + " Total Days",
      value: displayPlainNumber(animeStatistics.days_watched),
    },
    {
      title: emojiStatus("Total Entries", hideTerminalEmojis) + " Total Entries",
      value: displayNumber(animeStatistics.total_entries),
    },
    {
      title: emojiStatus("Rewatched", hideTerminalEmojis) + " Rewatched",
      value: displayNumber(animeStatistics.rewatched),
    },
    {
      title: emojiStatus("Episodes Watched", hideTerminalEmojis) + " Episodes Watched",
      value: displayNumber(animeStatistics.episodes_watched),
    },
    {
      title: emojiStatus("Watching", hideTerminalEmojis) + " Watching",
      value: displayNumber(animeStatistics.watching),
    },
    {
      title: emojiStatus("Completed", hideTerminalEmojis) + " Completed",
      value: displayNumber(animeStatistics.completed),
    },
    {
      title: emojiStatus("On Hold", hideTerminalEmojis) + " On Hold",
      value: displayNumber(animeStatistics.on_hold),
    },
    {
      title: emojiStatus("Dropped", hideTerminalEmojis) + " Dropped",
      value: displayNumber(animeStatistics.dropped),
    },
    {
      title: emojiStatus("Plan to Watch", hideTerminalEmojis) + " Plan to Watch",
      value: displayNumber(animeStatistics.plan_to_watch),
    },
  ]

  const mangaDataAsGridItemProps: GridItemProps[] = [
    {
      title: emojiStatus("Mean Score", hideTerminalEmojis) + " Mean Score",
      value: displayPlainNumber(mangaStatistics.mean_score),
    },
    {
      title: emojiStatus("Total Days", hideTerminalEmojis) + " Total Days",
      value: displayPlainNumber(mangaStatistics.days_read),
    },
    {
      title: emojiStatus("Total Entries", hideTerminalEmojis) + " Total Entries",
      value: displayNumber(mangaStatistics.total_entries),
    },
    {
      title: emojiStatus("Reread", hideTerminalEmojis) + " Reread",
      value: displayNumber(mangaStatistics.reread),
    },
    {
      title: emojiStatus("Chapters Read", hideTerminalEmojis) + " Chapters Read",
      value: displayNumber(mangaStatistics.chapters_read),
    },
    {
      title: emojiStatus("Volumes Read", hideTerminalEmojis) + " Volumes Read",
      value: displayNumber(mangaStatistics.volumes_read),
    },
    {
      title: emojiStatus("Reading", hideTerminalEmojis) + " Reading",
      value: displayNumber(mangaStatistics.reading),
    },
    {
      title: emojiStatus("Completed", hideTerminalEmojis) + " Completed",
      value: displayNumber(mangaStatistics.completed),
    },
    {
      title: emojiStatus("On Hold", hideTerminalEmojis) + " On Hold",
      value: displayNumber(mangaStatistics.on_hold),
    },
    {
      title: emojiStatus("Dropped", hideTerminalEmojis) + " Dropped",
      value: displayNumber(mangaStatistics.dropped),
    },
    {
      title: emojiStatus("Plan to Read", hideTerminalEmojis) + " Plan to Read",
      value: displayNumber(mangaStatistics.plan_to_read),
    },
  ]

  const DefaultStatistics = () => (
    <div className="w-full flex half:flex-col gap-2 p-0 m-0">
      {showAnime && (
        <div className="flex flex-col w-full">
          {!hideTitle && <DefaultTitle icon={<IoStatsChartOutline />} title={animeTitle} />}
          <div className="w-full flex gap-2 p-0 m-0">
            <StatisticRow
              rows={[
                {
                  icon: <FaStar />,
                  title: "Mean Score",
                  value: displayNumber(animeStatistics.mean_score),
                  strong: true,
                },
                {
                  icon: <FaCirclePlay className="fill-mal-watching" />,
                  title: "Watching",
                  value: displayNumber(animeStatistics.watching),
                },
                {
                  icon: <FaCircleCheck className="fill-mal-completed" />,
                  title: "Completed",
                  value: displayNumber(animeStatistics.completed),
                },
                {
                  icon: <FaCirclePause className="fill-mal-on-hold" />,
                  title: "On Hold",
                  value: displayNumber(animeStatistics.on_hold),
                },
                {
                  icon: <FaCircleXmark className="fill-mal-dropped" />,
                  title: "Dropped",
                  value: displayNumber(animeStatistics.dropped),
                },
                {
                  icon: <FaQuestionCircle className="fill-mal-plan-to-watch" />,
                  title: "Plan to Watch",
                  value: displayNumber(animeStatistics.plan_to_watch),
                },
              ]}
            />
            <StatisticRow
              rows={[
                {
                  icon: <FaCalendar />,
                  title: "Total Days",
                  value: displayNumber(animeStatistics.days_watched),
                  strong: true,
                },
                {
                  icon: <FaDatabase />,
                  title: "Total Entries",
                  value: displayNumber(animeStatistics.total_entries),
                },
                {
                  icon: <RiRestartFill size={16} />,
                  title: "Rewatched",
                  value: displayNumber(animeStatistics.rewatched),
                },
                {
                  icon: <FaVideo />,
                  title: "Episodes Watched",
                  value: displayNumber(animeStatistics.episodes_watched),
                },
              ]}
            />
          </div>
        </div>
      )}
      {showManga && (
        <div className="flex flex-col w-full">
          {!hideTitle && <DefaultTitle icon={<IoStatsChartOutline />} title={mangaTitle} />}
          <div className="w-full flex gap-2">
            <StatisticRow
              rows={[
                {
                  icon: <FaStar />,
                  title: "Mean Score",
                  value: displayNumber(mangaStatistics.mean_score),
                  strong: true,
                },
                {
                  icon: <FaCirclePlay className="fill-mal-watching" />,
                  title: "Reading",
                  value: displayNumber(mangaStatistics.reading),
                },
                {
                  icon: <FaCircleCheck className="fill-mal-completed" />,
                  title: "Completed",
                  value: displayNumber(mangaStatistics.completed),
                },
                {
                  icon: <FaCirclePause className="fill-mal-on-hold" />,
                  title: "On Hold",
                  value: displayNumber(mangaStatistics.on_hold),
                },
                {
                  icon: <FaCircleXmark className="fill-mal-dropped" />,
                  title: "Dropped",
                  value: displayNumber(mangaStatistics.dropped),
                },
                {
                  icon: <FaQuestionCircle className="fill-mal-plan-to-watch" />,
                  title: "Plan to Read",
                  value: displayNumber(mangaStatistics.plan_to_read),
                },
              ]}
            />
            <StatisticRow
              rows={[
                {
                  icon: <FaCalendar />,
                  title: "Total Days",
                  value: displayNumber(mangaStatistics.days_read),
                  strong: true,
                },
                {
                  icon: <FaDatabase />,
                  title: "Total Entries",
                  value: displayNumber(mangaStatistics.total_entries),
                },
                {
                  icon: <RiRestartFill size={16} />,
                  title: "Reread",
                  value: displayNumber(mangaStatistics.reread),
                },
                {
                  icon: <FaBookOpen />,
                  title: "Chapters Read",
                  value: displayNumber(mangaStatistics.chapters_read),
                },
                {
                  icon: <FaVideo />,
                  title: "Volumes Read",
                  value: displayNumber(mangaStatistics.volumes_read),
                },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  )

  const TerminalStatistics = () => (
    <div className="w-full flex half:flex-col gap-1 p-0 m-0">
      {showAnime && (
        <div className="flex flex-col w-full">
          <TerminalGrid data={animeDataAsGridItemProps} rightText={animeTitle} centerText="Values" />
        </div>
      )}
      {showManga && (
        <div className="flex flex-col w-full">
          <TerminalGrid data={mangaDataAsGridItemProps} rightText={mangaTitle} centerText="Values" />
        </div>
      )}
    </div>
  )

  return (
    <section id="mal-statistics">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={<DefaultStatistics />}
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "mal",
                section: "statistics",
                type: "all",
                size,
              })}
            />
            <TerminalStatistics />
          </>
        }
      />
    </section>
  )
}
