import React from 'react'
import { MdOutlineAudiotrack } from 'react-icons/md'
import { DefaultList } from '../../../templates/Default/DefaultList.js'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle.js'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle.js'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand.js'
import { TerminalList } from '../../../templates/Terminal/TerminalList.js'
import type { ListItemProps, TerminalLineProps } from '../../../templates/types.js'
import { getPseudoCommands } from '../../../utils/pseudo-commands.js'
import type { SpotifyTrack } from '../types.js'

interface RecentTracksProps {
  data: SpotifyTrack[]
  config: {
    recent_tracks_max?: number
    recent_tracks_title?: string
    recent_tracks_hide_title?: boolean
  }
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function RecentTracks({ data, config, style = 'default', size = 'half' }: RecentTracksProps): React.ReactElement {
  if (!data || data.length === 0) {
    return <></>
  }

  const title = config.recent_tracks_title || 'Recent Tracks'
  const hideTitle = config.recent_tracks_hide_title || false
  const rawMaxItems = config.recent_tracks_max || 10
  const maxItems = Math.max(1, Math.min(50, rawMaxItems))

  const limitedData = data.slice(0, maxItems)

  const listItems: ListItemProps[] = limitedData.map((track) => ({
    right: track.name,
    center: track.artist,
    left: track.album || '',
    image: track.image,
  }))

  const terminalListItems: TerminalLineProps[] = listItems.map((item) => ({
    right: typeof item.right === 'string' ? item.right : String(item.right || ''),
    left: typeof item.left === 'string' ? item.left : String(item.left || ''),
  }))

  return (
    <section id="spotify-recent-tracks">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && (
              <DefaultTitle
                title={title}
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
                plugin: 'spotify',
                section: 'recent_tracks',
              })}
            />
            <TerminalList data={terminalListItems} />
          </>
        }
      />
    </section>
  )
}

