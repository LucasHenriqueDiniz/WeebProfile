/**
 * RecentTracks - Componente para exibir faixas recentes do LastFM
 */

import React from 'react'
import { MdOutlineAudiotrack } from 'react-icons/md'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import { abbreviateNumber } from '../../../utils/number'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalList } from '../../../templates/Terminal/TerminalList'
import { TerminalLineBreak } from '../../../templates/Terminal/TerminalLineBreak'
import { DefaultList } from '../../../templates/Default/DefaultList'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import type { ListItemProps } from '../../../templates/types'
import type { LastFmTrack } from '../types'

interface RecentTracksProps {
  data: LastFmTrack[]
  interval?: string
  config: {
    recent_tracks_max?: number
    recent_tracks_title?: string
    recent_tracks_hide_title?: boolean
    hide_intervals?: boolean
  }
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function RecentTracks({ data, interval, config, style = 'default', size = 'half' }: RecentTracksProps): React.ReactElement {
  if (!data || data.length === 0) {
    return <></>
  }

  const title = config.recent_tracks_title || 'Recent Tracks'
  const hideTitle = config.recent_tracks_hide_title || false
  const hideIntervals = config.hide_intervals || false
  // Validar e limitar maxItems (máximo 50, mínimo 1)
  const rawMaxItems = config.recent_tracks_max || 5
  const maxItems = Math.max(1, Math.min(50, rawMaxItems))

  // Limitar dados - se não houver dados suficientes, usar o que tem disponível
  let limitedData = data
  if (data.length > maxItems) {
    limitedData = data.slice(0, maxItems)
  } else {
    // Se pediu mais do que tem disponível, usar todos os dados disponíveis
    limitedData = data
  }

  const listItems: ListItemProps[] = limitedData.map((track) => ({
    right: track.track,
    center: track.artist,
    left: track.date,
    image: track.image,
  }))

  const terminalListItems = listItems.map((item) => ({
    right: item.right,
    left: item.left || '',
  }))

  return (
    <section id="lastfm-recent-tracks">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && (
              <DefaultTitle
                title={title}
                subtitle={hideIntervals ? undefined : interval}
                icon={<MdOutlineAudiotrack />}
              />
            )}
            <DefaultList data={listItems} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'lastfm',
                section: 'recent_tracks',
                period: interval,
                limit: maxItems,
                size,
              })}
            />
            <TerminalList data={terminalListItems} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

