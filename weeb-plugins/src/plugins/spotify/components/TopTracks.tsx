import React from 'react'
import { AiOutlineTrophy } from 'react-icons/ai'
import { DefaultGrid } from '../../../templates/Default/DefaultGrid'
import { DefaultImageGrid } from '../../../templates/Default/DefaultImageGrid'
import { DefaultList } from '../../../templates/Default/DefaultList'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import { TerminalGrid } from '../../../templates/Terminal/TerminalGrid'
import { TerminalList } from '../../../templates/Terminal/TerminalList'
import TerminalTree from '../../../templates/Terminal/TerminalTree'
import type { GridItemProps, ListItemProps, TerminalLineProps } from '../../../templates/types'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { SpotifyTrack } from '../types'

interface TopTracksProps {
  data: SpotifyTrack[]
  interval?: string
  config: {
    top_tracks_max?: number
    top_tracks_title?: string
    top_tracks_hide_title?: boolean
    top_tracks_style?: 'grid' | 'list' | 'default'
  }
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function TopTracks({ data, interval, config, style = 'default', size = 'half' }: TopTracksProps): React.ReactElement {
  if (!data || data.length === 0) {
    return <></>
  }

  const title = config.top_tracks_title || 'Top Played Tracks'
  const hideTitle = config.top_tracks_hide_title || false
  const displayStyle = config.top_tracks_style || 'default'
  const maxItems = config.top_tracks_max || 10
  const limitedData = data.slice(0, maxItems)

  const gridItems: GridItemProps[] = limitedData.map((track) => ({
    title: track.name,
    subtitle: track.artist,
    value: track.album || '',
    image: track.image,
  }))

  const listItems: ListItemProps[] = limitedData.map((track) => ({
    right: track.name,
    center: track.artist,
    left: track.album || '',
    image: track.image,
  }))

  const terminalListItems: TerminalLineProps[] = listItems.map((item) => ({
    right: typeof item.right === 'string' ? item.right : String(item.right || ''),
    left: typeof item.center === 'string' ? item.center : String(item.center || ''),
  }))

  if (displayStyle === 'list') {
    return (
      <section id="spotify-top-tracks">
        <RenderBasedOnStyle
          style={style}
          defaultComponent={
            <>
              {!hideTitle && (
                <DefaultTitle
                  title={title}
                  subtitle={interval}
                  icon={<AiOutlineTrophy />}
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
                  section: 'top_tracks',
                  period: interval,
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

  if (displayStyle === 'grid') {
    return (
      <section id="spotify-top-tracks">
        <RenderBasedOnStyle
          style={style}
          defaultComponent={
            <>
              {!hideTitle && (
                <DefaultTitle
                  title={title}
                  subtitle={interval}
                  icon={<AiOutlineTrophy />}
                />
              )}
              <DefaultImageGrid data={gridItems} />
            </>
          }
          terminalComponent={
            <>
              <TerminalCommand
                command={getPseudoCommands({
                  plugin: 'spotify',
                  section: 'top_tracks',
                  period: interval,
                  limit: maxItems,
                  size,
                })}
              />
              <TerminalGrid
                data={gridItems}
                rightText="Track"
                centerText="Artist"
                leftText=""
              />
            </>
          }
        />
      </section>
    )
  }

  // default style
  return (
    <section id="spotify-top-tracks">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && (
              <DefaultTitle
                title={title}
                subtitle={interval}
                icon={<AiOutlineTrophy />}
              />
            )}
            <DefaultGrid data={gridItems} size={size} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'spotify',
                section: 'top_tracks',
                period: interval,
                limit: maxItems,
                size,
              })}
            />
            <TerminalTree data={gridItems} title={title} />
          </>
        }
      />
    </section>
  )
}

