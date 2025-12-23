import React from 'react'
import { FaQuestionCircle } from 'react-icons/fa'
import { FaCircleCheck, FaCirclePause, FaCirclePlay, FaCircleXmark } from 'react-icons/fa6'
import { IoStatsChartOutline } from 'react-icons/io5'
import { Stat } from '../../../templates/Default/DefaultStatRow.js'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle.js'
import { HorizontalMultipleItemsBar } from '../../../templates/Default/HorizontalMultipleItemsBar.js'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle.js'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand.js'
import { TerminalHorizontalMultipleItemsBar } from '../../../templates/Terminal/TerminalHorizontalMultipleItemsBar.js'
import { TerminalLine } from '../../../templates/Terminal/TerminalLine.js'
import { abbreviateNumber } from '../../../utils/number.js'
import { getPseudoCommands } from '../../../utils/pseudo-commands.js'
import type { AnimeStatistics, MangaStatistics, MyAnimeListConfig } from '../types.js'

interface StatisticsHorizontalBarProps {
  data: AnimeStatistics | MangaStatistics
  config: MyAnimeListConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
  isAnime: boolean
}

function TerminalHorizontalBar({
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
}): React.ReactElement {
  return (
    <>
      <TerminalHorizontalMultipleItemsBar
        items={[
          { value: watching, className: 'text-mal-watching' },
          { value: completed, className: 'text-mal-completed' },
          { value: onHold, className: 'text-mal-on-hold' },
          { value: dropped, className: 'text-mal-dropped' },
          { value: planToWatch, className: 'text-mal-plan-to-watch' },
        ]}
      />
      <span className="flex flex-col">
        <TerminalLine
          className={{ right: 'text-mal-watching mt-[0.25rem]' }}
          right="██ Watching"
          left={abbreviateNumber(watching)}
        />
        <TerminalLine
          className={{ right: 'text-mal-completed mt-[0.25rem]' }}
          right="██ Completed"
          left={abbreviateNumber(completed)}
        />
        <TerminalLine
          className={{ right: 'text-mal-on-hold mt-[0.25rem]' }}
          right="██ On Hold"
          left={abbreviateNumber(onHold)}
        />
        <TerminalLine
          className={{ right: 'text-mal-dropped mt-[0.25rem]' }}
          right="██ Dropped"
          left={abbreviateNumber(dropped)}
        />
        <TerminalLine
          className={{ right: 'text-mal-plan-to-watch mt-[0.25rem]' }}
          right="██ Plan to Watch"
          left={abbreviateNumber(planToWatch)}
        />
      </span>
    </>
  )
}

export function StatisticsHorizontalBar({
  data,
  config,
  style,
  size,
  isAnime,
}: StatisticsHorizontalBarProps): React.ReactElement {
  if (!data) {
    return <></>
  }

  const watching = (data as AnimeStatistics).watching || (data as MangaStatistics).reading
  const completed = data.completed
  const onHold = data.on_hold
  const dropped = data.dropped
  const planToWatch = (data as AnimeStatistics).plan_to_watch || (data as MangaStatistics).plan_to_read

  const animeTitle = config.anime_bar_title || 'Anime Statistics'
  const mangaTitle = config.manga_bar_title || 'Manga Statistics'
  const hideTitle = config.manga_bar_hide_title ?? config.anime_bar_hide_title ?? false

  return (
    <section id="mal-manga-or-anime-bar">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle icon={<IoStatsChartOutline />} title={isAnime ? animeTitle : mangaTitle} />}
            <HorizontalMultipleItemsBar
              items={[
                { value: watching, className: 'bg-mal-watching' },
                { value: completed, className: 'bg-mal-completed' },
                { value: onHold, className: 'bg-mal-on-hold' },
                { value: dropped, className: 'bg-mal-dropped' },
                { value: planToWatch, className: isAnime ? 'bg-mal-plan-to-watch' : 'bg-mal-plan-to-read' },
              ]}
            />
            <ul className={`grid ${size === 'full' ? 'grid-cols-5' : 'grid-cols-2'} gap-2 mt-2`}>
              <Stat
                title={isAnime ? 'Watching' : 'Reading'}
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
                title={isAnime ? 'Plan to Watch' : 'Plan to Read'}
                value={planToWatch.toString()}
                icon={<FaQuestionCircle className={isAnime ? "fill-mal-plan-to-watch" : "fill-mal-plan-to-read"} />}
              />
            </ul>
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'mal',
                section: isAnime ? 'anime-bar' : 'manga-bar',
                type: isAnime ? 'anime' : 'manga',
              })}
            />
            <TerminalHorizontalBar
              watching={watching}
              completed={completed}
              onHold={onHold}
              dropped={dropped}
              planToWatch={planToWatch}
            />
          </>
        }
        style={style}
      />
    </section>
  )
}



