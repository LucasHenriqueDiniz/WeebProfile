import { format } from 'date-fns'
import React from 'react'
import { FaList, FaStar } from 'react-icons/fa'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { PercentageBar } from '../../../templates/Default/PercentageBar'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { emojiStatus } from '../../../utils/emoji'
import { ImageComponent } from '../../../utils/image'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { LastUpdatesAnime, LastUpdatesManga, MyAnimeListConfig, MyAnimeListData } from '../types'

function getStatusColor(status: string) {
  switch (status) {
    case 'Completed':
      return 'text-mal-completed'
    case 'Plan to Watch':
      return 'text-mal-plan-to-watch'
    case 'Plan to Read':
      return 'text-mal-plan-to-read'
    case 'Watching':
      return 'text-mal-watching'
    case 'Reading':
      return 'text-mal-reading'
    case 'On Hold':
      return 'text-mal-on-hold'
    case 'Dropped':
      return 'text-mal-dropped'
    default:
      return 'text-mal-watching'
  }
}

interface LastUpdatesProps {
  data: MyAnimeListData['last_updated']
  config: MyAnimeListConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
  hideTerminalEmojis?: boolean
}

function DefaultUpdate({ update }: { update: LastUpdatesAnime | LastUpdatesManga }): React.ReactElement {
  const isAnime = 'episodes_total' in update
  const title = update.title
  const imgSrc = update.image
  const total = isAnime ? (update.episodes_total ?? 0) : (update.chapters_total ?? 0)
  const current = isAnime ? (update.episodes_seen ?? 0) : (update.chapters_read ?? 0)
  const status = update.status
  const date = format(new Date(update.date), 'MMM d, h:mm a')
  const score = update.score ?? 0

  return (
    <div className="grid grid-cols-[75px_1fr] gap-2 min-h-[75px]">
      <div className="image-square-container-75">
        <ImageComponent url64={imgSrc} alt={title} className="image-square" width={75} height={75} />
      </div>
      <div className="flex flex-col justify-between w-full min-w-0">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <h3 className="text-sm font-semibold truncate text-default-text leading-none flex-1">{title}</h3>
          <span className="flex items-center gap-1 text-sm text-default-highlight flex-shrink-0">
            {score === 0 || !score ? '-' : score} <FaStar size={14} className="text-default-highlight" />
          </span>
        </div>

        <PercentageBar current={current} total={total} status={status} />

        <div className="flex justify-between items-center gap-2">
          <div className="flex items-baseline gap-2 text-sm text-default-text min-w-0">
            <span className={getStatusColor(status)}>{status}</span>
            <span className="text-default-muted">
              {current === 0 || !current ? '?' : current} / {total === 0 || !total ? '?' : total}
            </span>
          </div>
          <span className="text-xs text-default-muted flex-shrink-0">{date}</span>
        </div>
      </div>
    </div>
  )
}

function TerminalUpdate({
  update,
  hideTerminalEmojis = false,
}: {
  update: LastUpdatesAnime | LastUpdatesManga
  hideTerminalEmojis?: boolean
}): React.ReactElement {
  const isAnime = 'episodes_total' in update
  const title = update.title
  const total = isAnime ? (update.episodes_total ?? 0) : update.chapters_total || 0
  const current = isAnime ? (update.episodes_seen ?? 0) : update.chapters_read || 0
  const status = update.status
  const date = format(new Date(update.date), 'MMM d, h:mm a')
  const score = update.score ?? 0

  const percentage = total === 0 ? 0 : Math.round((current / total) * 100) || 0
  const progressBarLength = 36
  const filledBlocks = Math.round((percentage / 100) * progressBarLength)
  const progressBar = '█'.repeat(filledBlocks) + '░'.repeat(progressBarLength - filledBlocks)

  return (
    <div className="flex flex-col gap-1">
      <div className="text-terminal-warning truncate font-bold text-md">* {title}</div>
      <div className="flex items-center">
        <span className="text-terminal-muted font-bold">{percentage}%</span>
        <span
          className={`text-mal-${status.toLowerCase().split(' ').join('-')} tracking-tighter text-center w-full overflow-hidden`}
        >
          {progressBar}
        </span>
        <span className="text-terminal-muted">
          {current}/{total === 0 || !total ? '?' : total}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="font-bold">
          <span className={`text-mal-${status.toLowerCase().split(' ').join('-')}`}>
            {emojiStatus(status, hideTerminalEmojis)} {status}
          </span>{' '}
          | {score === 0 || !score ? '-' : score}/10
        </span>
        <span className="text-terminal-muted">{date}</span>
      </div>
    </div>
  )
}

export function LastUpdates({
  data,
  config,
  style,
  size,
  hideTerminalEmojis = false,
}: LastUpdatesProps): React.ReactElement {
  if (!data) {
    return <></>
  }

  // Filtrar baseado nas configurações de hide
  const hideAnime = config.last_activity_hide_anime ?? false
  const hideManga = config.last_activity_hide_manga ?? false
  
  let array: (LastUpdatesAnime | LastUpdatesManga)[] = []
  if (!hideAnime && !hideManga) {
    array = [...data.anime, ...data.manga]
  } else if (!hideAnime) {
    array = data.anime
  } else if (!hideManga) {
    array = data.manga
  }
  
  let allUpdates = array.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const title = config.last_activity_title || 'Recent Anime Activity'
  const maxItems = config.last_activity_max ?? 6

  if (maxItems && allUpdates.length > maxItems) {
    allUpdates = allUpdates.slice(0, maxItems)
  }

  return (
    <section id="mal-last-updates">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            <DefaultTitle title={title} icon={<FaList />} />
            <div className="flex flex-col gap-1">
              {allUpdates.map((update, index) => (
                <DefaultUpdate key={index} update={update} />
              ))}
            </div>
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'mal',
                section: 'last_updates',
                limit: maxItems,
              })}
            />
            <div className="flex flex-col gap-2">
              {allUpdates.map((update, index) => (
                <TerminalUpdate key={index} update={update} hideTerminalEmojis={hideTerminalEmojis} />
              ))}
            </div>
          </>
        }
        style={style}
      />
    </section>
  )
}



