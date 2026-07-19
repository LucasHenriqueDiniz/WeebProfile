import React from "react"
import { FaBookOpen, FaCalendar, FaStar, FaVideo } from "react-icons/fa"
import { IoStatsChartOutline } from "react-icons/io5"
import { Stat } from "../../../templates/Default/DefaultStatRow"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots"
import { emojiStatus } from "../../../utils/emoji"
import { abbreviateNumber } from "../../../utils/number"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { MyAnimeListConfig, MyAnimeListData } from "../types"

interface SimpleStatisticsProps {
  data: MyAnimeListData["statistics"]
  config: MyAnimeListConfig
  style: "default" | "terminal"
  size: "half" | "full"
  hideTerminalEmojis?: boolean
}

export function SimpleStatistics({
  data,
  config,
  style,
  size,
  hideTerminalEmojis = false,
}: SimpleStatisticsProps): React.ReactElement {
  if (!data || !data.anime || !data.manga) {
    return <></>
  }

  const title = config.statistics_simple_title || "Anime & Manga Statistics"
  const hideTitle = config.statistics_simple_hide_title || false

  const anime = data.anime as Record<keyof MyAnimeListData["statistics"]["anime"], number>
  const manga = data.manga as Record<keyof MyAnimeListData["statistics"]["manga"], number>
  const TotalDays = anime.days_watched + manga.days_read
  const TotalMeanScore =
    (anime.mean_score * anime.total_entries + manga.mean_score * manga.total_entries) /
    (anime.total_entries + manga.total_entries)
  const ChaptersRead = manga.chapters_read
  const EpisodesWatched = anime.episodes_watched

  return (
    <section id="mal-simple-statistics">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<IoStatsChartOutline />} />}
            <div className="flex flex-row mt-2 items-center h-full">
              <ul className="flex half:flex-col gap-1 w-full">
                <Stat
                  key="days-wasted"
                  title="Days Wasted"
                  value={TotalDays.toFixed(1)}
                  strong
                  icon={<FaCalendar className="text-default-highlight" />}
                />
                <Stat
                  key="mean-score"
                  title="Mean Score"
                  value={TotalMeanScore.toFixed(2)}
                  strong
                  icon={<FaStar className="text-default-highlight" />}
                />
              </ul>
              <ul className="flex half:flex-col gap-1 w-full">
                <Stat
                  key="chapters-read"
                  title="CH's Read"
                  value={abbreviateNumber(ChaptersRead)}
                  strong
                  icon={<FaBookOpen className="text-default-highlight" />}
                  smallInHalf
                />
                <Stat
                  key="episodes-watched"
                  title="EP's Watched"
                  value={abbreviateNumber(EpisodesWatched)}
                  strong
                  icon={<FaVideo className="text-default-highlight" />}
                  smallInHalf
                />
              </ul>
            </div>
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "mal",
                section: "simple-statistics",
                type: "all",
              })}
            />
            <TerminalLineWithDots
              title={`${emojiStatus("days_wasted", hideTerminalEmojis)} Days Wasted`}
              value={TotalDays.toFixed(1)}
            />
            <TerminalLineWithDots
              title={`${emojiStatus("mean_score", hideTerminalEmojis)} Mean Score`}
              value={TotalMeanScore.toFixed(2)}
            />
            <TerminalLineWithDots
              title={`${emojiStatus("chapters_read", hideTerminalEmojis)} Chapters Read`}
              value={abbreviateNumber(ChaptersRead)}
            />
            <TerminalLineWithDots
              title={`${emojiStatus("episodes_watched", hideTerminalEmojis)} Episodes Watched`}
              value={abbreviateNumber(EpisodesWatched)}
            />
          </>
        }
        style={style}
      />
    </section>
  )
}
