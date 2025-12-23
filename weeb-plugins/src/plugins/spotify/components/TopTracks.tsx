import React from 'react'
import { AiOutlineTrophy } from 'react-icons/ai'
import { DefaultGrid } from '../../../templates/Default/DefaultGrid.js'
import { DefaultImageGrid } from '../../../templates/Default/DefaultImageGrid.js'
import { DefaultList } from '../../../templates/Default/DefaultList.js'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle.js'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle.js'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand.js'
import { TerminalGrid } from '../../../templates/Terminal/TerminalGrid.js'
import { TerminalList } from '../../../templates/Terminal/TerminalList.js'
import TerminalTree from '../../../templates/Terminal/TerminalTree.js'
import type { GridItemProps, ListItemProps, TerminalLineProps } from '../../../templates/types.js'
import { getPseudoCommands } from '../../../utils/pseudo-commands.js'
import type { SpotifyTrack } from '../types.js'

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

  const title = config.top_tracks_title || 'Top Tracks'
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

