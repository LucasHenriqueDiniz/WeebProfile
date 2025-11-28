/**
 * Statistics - Componente para exibir estatísticas do MyAnimeList
 */

import React from 'react'
import { FaBookOpen, FaCalendar, FaDatabase, FaQuestionCircle, FaStar, FaVideo } from 'react-icons/fa'
import { FaCircleCheck, FaCirclePause, FaCirclePlay, FaCircleXmark } from 'react-icons/fa6'
import { IoStatsChartOutline } from 'react-icons/io5'
import { RiRestartFill } from 'react-icons/ri'
import { StatisticRow } from '../../../weeb-plugins/templates/Default/DefaultStatRow'
import { DefaultTitle } from '../../../weeb-plugins/templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../weeb-plugins/templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../weeb-plugins/templates/Terminal/TerminalCommand'
import { TerminalGrid } from '../../../weeb-plugins/templates/Terminal/TerminalGrid'
import { TerminalLineBreak } from '../../../weeb-plugins/templates/Terminal/TerminalLineBreak'
import type { GridItemProps } from '../../../weeb-plugins/templates/types'
import { emojiStatus } from '../../../weeb-plugins/utils/emoji'
import { abbreviateNumber } from '../../../weeb-plugins/utils/number'
import { getPseudoCommands } from '../../../weeb-plugins/utils/pseudo-commands'
import type { AnimeStatistics, MangaStatistics, MyAnimeListConfig, MyAnimeListData } from '../types'
import { LuCircleCheckBig, LuCircleHelp, LuCirclePause, LuCirclePlay, LuCircleX } from 'react-icons/lu'

interface StatisticsProps {
  data: MyAnimeListData['statistics']
  config: MyAnimeListConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
  hideTerminalEmojis?: boolean
}

export function Statistics({ data, config, style, size, hideTerminalEmojis = false }: StatisticsProps): React.ReactElement {
  if (!data || !data.anime || !data.manga) {
    return <></>
  }

  const animeStatistics = data.anime as AnimeStatistics
  const mangaStatistics = data.manga as MangaStatistics

  const hideTitle = config.statistics_hide_title ?? false
  const statisticsMedia = config.statistics_media ?? 'both'
  const mangaTitle = config.statistics_manga_title ?? 'Manga Statistics'
  const animeTitle = config.statistics_anime_title ?? 'Anime Statistics'

  // Determinar o que mostrar baseado em media type
  const showAnime = statisticsMedia === 'both' || statisticsMedia === 'anime'
  const showManga = statisticsMedia === 'both' || statisticsMedia === 'manga'

  const animeDataAsGridItemProps: GridItemProps[] = [
    {
      title: emojiStatus('Mean Score', hideTerminalEmojis) + ' Mean Score',
      value: animeStatistics.mean_score.toString(),
    },
    {
      title: emojiStatus('Total Days', hideTerminalEmojis) + ' Total Days',
      value: animeStatistics.days_watched.toString(),
    },
    {
      title: emojiStatus('Total Entries', hideTerminalEmojis) + ' Total Entries',
      value: abbreviateNumber(animeStatistics.total_entries),
    },
    {
      title: emojiStatus('Rewatched', hideTerminalEmojis) + ' Rewatched',
      value: abbreviateNumber(animeStatistics.rewatched),
    },
    {
      title: emojiStatus('Episodes Watched', hideTerminalEmojis) + ' Episodes Watched',
      value: abbreviateNumber(animeStatistics.episodes_watched),
    },
    {
      title: emojiStatus('Watching', hideTerminalEmojis) + ' Watching',
      value: abbreviateNumber(animeStatistics.watching),
    },
    {
      title: emojiStatus('Completed', hideTerminalEmojis) + ' Completed',
      value: abbreviateNumber(animeStatistics.completed),
    },
    {
      title: emojiStatus('On Hold', hideTerminalEmojis) + ' On Hold',
      value: abbreviateNumber(animeStatistics.on_hold),
    },
    {
      title: emojiStatus('Dropped', hideTerminalEmojis) + ' Dropped',
      value: abbreviateNumber(animeStatistics.dropped),
    },
    {
      title: emojiStatus('Plan to Watch', hideTerminalEmojis) + ' Plan to Watch',
      value: abbreviateNumber(animeStatistics.plan_to_watch),
    },
  ]

  const mangaDataAsGridItemProps: GridItemProps[] = [
    {
      title: emojiStatus('Mean Score', hideTerminalEmojis) + ' Mean Score',
      value: mangaStatistics.mean_score.toString(),
    },
    {
      title: emojiStatus('Total Days', hideTerminalEmojis) + ' Total Days',
      value: mangaStatistics.days_read.toString(),
    },
    {
      title: emojiStatus('Total Entries', hideTerminalEmojis) + ' Total Entries',
      value: abbreviateNumber(mangaStatistics.total_entries),
    },
    {
      title: emojiStatus('Reread', hideTerminalEmojis) + ' Reread',
      value: abbreviateNumber(mangaStatistics.reread),
    },
    {
      title: emojiStatus('Chapters Read', hideTerminalEmojis) + ' Chapters Read',
      value: abbreviateNumber(mangaStatistics.chapters_read),
    },
    {
      title: emojiStatus('Volumes Read', hideTerminalEmojis) + ' Volumes Read',
      value: abbreviateNumber(mangaStatistics.volumes_read),
    },
    {
      title: emojiStatus('Reading', hideTerminalEmojis) + ' Reading',
      value: abbreviateNumber(mangaStatistics.reading),
    },
    {
      title: emojiStatus('Completed', hideTerminalEmojis) + ' Completed',
      value: abbreviateNumber(mangaStatistics.completed),
    },
    {
      title: emojiStatus('On Hold', hideTerminalEmojis) + ' On Hold',
      value: abbreviateNumber(mangaStatistics.on_hold),
    },
    {
      title: emojiStatus('Dropped', hideTerminalEmojis) + ' Dropped',
      value: abbreviateNumber(mangaStatistics.dropped),
    },
    {
      title: emojiStatus('Plan to Read', hideTerminalEmojis) + ' Plan to Read',
      value: abbreviateNumber(mangaStatistics.plan_to_read),
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
                  title: 'Mean Score',
                  value: abbreviateNumber(animeStatistics.mean_score),
                  strong: true,
                },
                {
                  icon: <FaCirclePlay className="fill-mal-watching" />,
                  title: 'Watching',
                  value: abbreviateNumber(animeStatistics.watching),
                },
                {
                  icon: <FaCircleCheck className="fill-mal-completed" />,
                  title: 'Completed',
                  value: abbreviateNumber(animeStatistics.completed),
                },
                {
                  icon: <FaCirclePause className="fill-mal-on-hold" />,
                  title: 'On Hold',
                  value: abbreviateNumber(animeStatistics.on_hold),
                },
                {
                  icon: <FaCircleXmark className="fill-mal-dropped" />,
                  title: 'Dropped',
                  value: abbreviateNumber(animeStatistics.dropped),
                },
                {
                  icon: <FaQuestionCircle className="fill-mal-plan-to-watch" />,
                  title: 'Plan to Watch',
                  value: abbreviateNumber(animeStatistics.plan_to_watch),
                },
              ]}
            />
            <StatisticRow
              rows={[
                {
                  icon: <FaCalendar />,
                  title: 'Total Days',
                  value: abbreviateNumber(animeStatistics.days_watched),
                  strong: true,
                },
                {
                  icon: <FaDatabase />,
                  title: 'Total Entries',
                  value: abbreviateNumber(animeStatistics.total_entries),
                },
                {
                  icon: <RiRestartFill size={16} />,
                  title: 'Rewatched',
                  value: abbreviateNumber(animeStatistics.rewatched),
                },
                {
                  icon: <FaVideo />,
                  title: 'Episodes Watched',
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
          <div className="w-full flex gap-2">
            <StatisticRow
              rows={[
                {
                  icon: <FaStar className="fill-default-highlight" />,
                  title: 'Mean Score',
                  value: abbreviateNumber(mangaStatistics.mean_score),
                  strong: true,
                },
                {
                  icon: <LuCirclePlay className="fill-mal-watching" />,
                  title: 'Reading',
                  value: abbreviateNumber(mangaStatistics.reading),
                },
                {
                  icon: <LuCircleCheckBig  className="fill-mal-completed" />,
                  title: 'Completed',
                  value: abbreviateNumber(mangaStatistics.completed),
                },
                {
                  icon: <LuCirclePause  className="fill-mal-on-hold" />,
                  title: 'On Hold',
                  value: abbreviateNumber(mangaStatistics.on_hold),
                },
                {
                  icon: <LuCircleX className="fill-mal-dropped" />,
                  title: 'Dropped',
                  value: abbreviateNumber(mangaStatistics.dropped),
                },
                {
                  icon: <LuCircleHelp  className="fill-mal-plan-to-watch" />,
                  title: 'Plan to Read',
                  value: abbreviateNumber(mangaStatistics.plan_to_read),
                },
              ]}
            />
            <StatisticRow
              rows={[
                {
                  icon: <FaCalendar />,
                  title: 'Total Days',
                  value: abbreviateNumber(mangaStatistics.days_read),
                  strong: true,
                },
                {
                  icon: <FaDatabase />,
                  title: 'Total Entries',
                  value: abbreviateNumber(mangaStatistics.total_entries),
                },
                {
                  icon: <RiRestartFill size={16} />,
                  title: 'Reread',
                  value: abbreviateNumber(mangaStatistics.reread),
                },
                {
                  icon: <FaBookOpen />,
                  title: 'Chapters Read',
                  value: abbreviateNumber(mangaStatistics.chapters_read),
                },
                {
                  icon: <FaVideo />,
                  title: 'Volumes Read',
                  value: abbreviateNumber(mangaStatistics.volumes_read),
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
      <TerminalLineBreak className="hidden half:block" />
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
                plugin: 'mal',
                section: 'statistics',
                username: config.username,
                type: 'all',
                size,
              })}
            />
            <TerminalStatistics />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

