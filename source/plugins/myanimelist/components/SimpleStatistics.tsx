import getPseudoCommands from "core/utils/getPseudoCommands"
import React from "react"
import { FaBookOpen, FaCalendar, FaStar, FaVideo } from "react-icons/fa"
import { IoStatsChartOutline } from "react-icons/io5"
import { emojiStatus } from "source/helpers/emoji"
import { abbreviateNumber } from "source/helpers/number"
import getEnvVariables from "source/plugins/@utils/getEnvVariables"
import ErrorMessage from "source/templates/Error_Style"
import { Stat } from "templates/Default/Default_StatRow"
import DefaultTitle from "templates/Default/Default_Title"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalCommand from "source/templates/Terminal/TerminalCommand"
import TerminalLineBreak from "templates/Terminal/Terminal_LineBreak"
import TerminalLineWithDots from "source/templates/Terminal/TerminalLineWithDots"
import MAL_ENV_VARIABLES from "../ENV_VARIABLES"
import { MalStatisticsResponse } from "../types/malStatisticsResponse"

export default function SimpleStatistics({ data }: { data: MalStatisticsResponse }): JSX.Element {
  const { myanimelist } = getEnvVariables()
  if (!myanimelist) throw new Error("MAL plugin not found in MalStatistics component")
  if (!data) return <ErrorMessage message="No data found in MalStatistics component" />

  const title =
    myanimelist.statistics_simple_title ?? (MAL_ENV_VARIABLES.statistics_simple_title.defaultValue as string)
  const hideTitle = myanimelist.statistics_simple_hide_title

  const TotalDays = data.anime.days_watched + data.manga.days_read
  const TotalMeanScore =
    (data.anime.mean_score * data.anime.total_entries + data.manga.mean_score * data.manga.total_entries) /
    (data.anime.total_entries + data.manga.total_entries)
  const ChaptersRead = data.manga.chapters_read
  const EpisodesWatched = data.anime.episodes_watched

  return (
    <section id="mal-simple-statistics">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<IoStatsChartOutline />} />}
            <ul className="flex flex-row gap-2 mt-2 justify-between h-full half-mode:grid half-mode:grid-cols-2">
              <Stat
                title="Days Wasted"
                strong
                value={TotalDays.toFixed(1)}
                icon={<FaCalendar className="text-primary" />}
              />
              <Stat
                title="Mean Score"
                strong
                value={TotalMeanScore.toFixed(2)}
                icon={<FaStar className="text-primary" />}
              />
              <Stat
                title="CH's Read"
                strong
                value={abbreviateNumber(ChaptersRead)}
                icon={<FaBookOpen className="text-primary" />}
                smallInHalf
              />
              <Stat
                title="EP's Watched"
                strong
                value={abbreviateNumber(EpisodesWatched)}
                icon={<FaVideo className="text-primary" />}
                smallInHalf
              />
            </ul>
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "mal",
                section: "simple-statistics",
                username: myanimelist.username,
                type: "all",
              })}
            />
            <TerminalLineWithDots title={`${emojiStatus("days_wasted")} Days Wasted`} value={TotalDays.toFixed(1)} />
            <TerminalLineWithDots title={`${emojiStatus("mean_score")} Mean Score`} value={TotalMeanScore.toFixed(2)} />
            <TerminalLineWithDots
              title={`${emojiStatus("chapters_read")} Chapters Read`}
              value={abbreviateNumber(ChaptersRead)}
            />
            <TerminalLineWithDots
              title={`${emojiStatus("episodes_watched")} Episodes Watched`}
              value={abbreviateNumber(EpisodesWatched)}
            />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}
