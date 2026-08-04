import React from "react"
import { FaBookOpen, FaClock, FaPlay, FaStar } from "react-icons/fa"
import { IoStatsChartOutline } from "react-icons/io5"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { StatisticRow } from "../../../templates/Default/DefaultStatRow"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots"
import { abbreviateNumber } from "../../../utils/number"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { AniListConfig, AniListStatistics } from "../types"

interface StatisticsProps {
  statistics: AniListStatistics
  config: AniListConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

/** AniList pontua de 0 a 100; mostrar como /100 evita confusão com a escala /10 do MAL. */
const formatScore = (score: number) => (score > 0 ? `${score.toFixed(1)}/100` : "—")

/** minutesWatched vira dias, que é como o próprio AniList apresenta. */
const formatDays = (minutes: number) => `${(minutes / 1440).toFixed(1)}d`

export function Statistics({
  statistics,
  config,
  style = "default",
  size = "half",
}: StatisticsProps): React.ReactElement {
  const media = config.statistics_media ?? "both"
  const showAnime = media === "both" || media === "anime"
  const showManga = media === "both" || media === "manga"

  const hideTitle = config.statistics_hide_title === true || config.statistics_hide_title === "true"
  const title = config.statistics_title || "AniList Statistics"

  const animeRows = [
    { icon: <FaPlay />, title: "anime", value: abbreviateNumber(statistics.animeCount) },
    { icon: <FaPlay />, title: "episodes", value: abbreviateNumber(statistics.episodesWatched) },
    { icon: <FaClock />, title: "watched", value: formatDays(statistics.minutesWatched) },
    { icon: <FaStar />, title: "mean score", value: formatScore(statistics.animeMeanScore) },
  ]

  const mangaRows = [
    { icon: <FaBookOpen />, title: "manga", value: abbreviateNumber(statistics.mangaCount) },
    { icon: <FaBookOpen />, title: "chapters", value: abbreviateNumber(statistics.chaptersRead) },
    { icon: <FaBookOpen />, title: "volumes", value: abbreviateNumber(statistics.volumesRead) },
    { icon: <FaStar />, title: "mean score", value: formatScore(statistics.mangaMeanScore) },
  ]

  return (
    <section id="anilist-statistics">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<IoStatsChartOutline />} />}
            {/* Lado a lado no full, empilhado no half: 415px não comporta duas colunas legíveis. */}
            <div className={`flex w-full gap-4 ${size === "half" ? "flex-col" : "flex-row"}`}>
              {showAnime && <StatisticRow rows={animeRows} />}
              {showManga && <StatisticRow rows={mangaRows} />}
            </div>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "anilist", section: "statistics", size })} />
            {showAnime && (
              <>
                <TerminalLineWithDots title="Anime" value={abbreviateNumber(statistics.animeCount)} />
                <TerminalLineWithDots title="Episodes" value={abbreviateNumber(statistics.episodesWatched)} />
                <TerminalLineWithDots title="Time watched" value={formatDays(statistics.minutesWatched)} />
                <TerminalLineWithDots title="Anime score" value={formatScore(statistics.animeMeanScore)} />
              </>
            )}
            {showManga && (
              <>
                <TerminalLineWithDots title="Manga" value={abbreviateNumber(statistics.mangaCount)} />
                <TerminalLineWithDots title="Chapters" value={abbreviateNumber(statistics.chaptersRead)} />
                <TerminalLineWithDots title="Volumes" value={abbreviateNumber(statistics.volumesRead)} />
                <TerminalLineWithDots title="Manga score" value={formatScore(statistics.mangaMeanScore)} />
              </>
            )}
          </>
        }
      />
    </section>
  )
}
