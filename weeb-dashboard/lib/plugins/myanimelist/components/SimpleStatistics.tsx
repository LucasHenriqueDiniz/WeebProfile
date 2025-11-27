/**
 * SimpleStatistics - Componente para exibir estatísticas simplificadas do MyAnimeList
 * 
 * Migrado do source original, adaptado para source-v2
 */

import React from 'react'
import { FaBookOpen, FaCalendar, FaStar, FaVideo } from 'react-icons/fa'
import { IoStatsChartOutline } from 'react-icons/io5'
import { abbreviateNumber } from '../../../weeb-plugins/utils/number'
import { emojiStatus } from '../../../weeb-plugins/utils/emoji'
import { DefaultTitle } from '../../../weeb-plugins/templates/Default/DefaultTitle'
import { Stat } from '../../../weeb-plugins/templates/Default/DefaultStatRow'
import { TerminalCommand } from '../../../weeb-plugins/templates/Terminal/TerminalCommand'
import { TerminalLineWithDots } from '../../../weeb-plugins/templates/Terminal/TerminalLineWithDots'
import { TerminalLineBreak } from '../../../weeb-plugins/templates/Terminal/TerminalLineBreak'
import { RenderBasedOnStyle } from '../../../weeb-plugins/templates/RenderBasedOnStyle'
import { getPseudoCommands } from '../../../weeb-plugins/utils/pseudo-commands'
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

  const title = config.statistics_simple_title || 'Simple Statistics'
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
                username: config.username,
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
            <TerminalLineBreak />
          </>
        }
        style={style}
      />
    </section>
  )
}



