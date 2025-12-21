import React from 'react'
import { MdOutlinePlaylistPlay } from 'react-icons/md'
import { DefaultGrid } from '../../../templates/Default/DefaultGrid'
import { DefaultList } from '../../../templates/Default/DefaultList'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalList } from '../../../templates/Terminal/TerminalList'
import type { ListItemProps, TerminalLineProps } from '../../../templates/types'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import { abbreviateNumber } from '../../../utils/number'
import type { SpotifyPlaylist } from '../types'

interface PlaylistsProps {
  data: SpotifyPlaylist[]
  config: {
    playlists_max?: number
    playlists_title?: string
    playlists_hide_title?: boolean
  }
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function Playlists({ data, config, style = 'default', size = 'half' }: PlaylistsProps): React.ReactElement {
  if (!data || data.length === 0) {
    return <></>
  }

  const title = config.playlists_title || 'Playlists'
  const hideTitle = config.playlists_hide_title || false
  const maxItems = config.playlists_max || 10
  const limitedData = data.slice(0, maxItems)

  const listItems: ListItemProps[] = limitedData.map((playlist) => ({
    right: playlist.name,
    center: playlist.description,
    left: `${abbreviateNumber(playlist.tracksCount.toString())} tracks`,
    image: playlist.image,
  }))

  const terminalListItems: TerminalLineProps[] = listItems.map((item) => ({
    right: typeof item.right === 'string' ? item.right : String(item.right || ''),
    left: typeof item.left === 'string' ? item.left : String(item.left || ''),
  }))

  return (
    <section id="spotify-playlists">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && (
              <DefaultTitle
                title={title}
                icon={<MdOutlinePlaylistPlay />}
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
                section: 'playlists',
                limit: maxItems,
                size,
              })}
            />
            <TerminalList data={terminalListItems} />
          </>
        }
      />
    </section>
  )
}

