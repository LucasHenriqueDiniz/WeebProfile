import React from 'react'
import { FaBookOpen, FaCalendar, FaStar, FaVideo } from 'react-icons/fa'
import { IoStatsChartOutline } from 'react-icons/io5'
import { Stat } from '../../../templates/Default/DefaultStatRow'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalLineWithDots } from '../../../templates/Terminal/TerminalLineWithDots'
import { emojiStatus } from '../../../utils/emoji'
import { abbreviateNumber } from '../../../utils/number'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { MyAnimeListConfig, MyAnimeListData } from '../types'

interface SimpleStatisticsProps {
  data: MyAnimeListData['statistics']
  config: MyAnimeListConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
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

  const title = config.statistics_simple_title || 'Anime & Manga Statistics'
  const hideTitle = config.statistics_simple_hide_title || false

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
            <div className="flex flex-row mt-2 items-center h-full">
              <ul className="flex half:flex-col gap-1 w-full">
              <Stat
                title="Days Wasted"
                value={TotalDays.toFixed(1)}
                strong
                icon={<FaCalendar className="text-default-highlight" />}
              />
              <Stat
                title="Mean Score"
                value={TotalMeanScore.toFixed(2)}
                strong
                icon={<FaStar className="text-default-highlight" />}
                />
              </ul>
              <ul className="flex half:flex-col gap-1 w-full">
              <Stat
                title="CH's Read"
                value={abbreviateNumber(ChaptersRead)}
                strong
                icon={<FaBookOpen className="text-default-highlight" />}
                smallInHalf
              />
              <Stat
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
                plugin: 'mal',
                section: 'simple-statistics',
                type: 'all',
              })}
            />
            <TerminalLineWithDots
              title={`${emojiStatus('days_wasted', hideTerminalEmojis)} Days Wasted`}
              value={TotalDays.toFixed(1)}
            />
            <TerminalLineWithDots
              title={`${emojiStatus('mean_score', hideTerminalEmojis)} Mean Score`}
              value={TotalMeanScore.toFixed(2)}
            />
            <TerminalLineWithDots
              title={`${emojiStatus('chapters_read', hideTerminalEmojis)} Chapters Read`}
              value={abbreviateNumber(ChaptersRead)}
            />
            <TerminalLineWithDots
              title={`${emojiStatus('episodes_watched', hideTerminalEmojis)} Episodes Watched`}
              value={abbreviateNumber(EpisodesWatched)}
            />
          </>
        }
        style={style}
      />
    </section>
  )
}



