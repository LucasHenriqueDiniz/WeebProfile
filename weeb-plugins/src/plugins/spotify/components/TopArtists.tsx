import React from 'react'
import { MdOutlinePersonOutline } from 'react-icons/md'
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
import type { SpotifyArtist } from '../types'

interface TopArtistsProps {
  data: SpotifyArtist[]
  interval?: string
  config: {
    top_artists_max?: number
    top_artists_title?: string
    top_artists_hide_title?: boolean
    top_artists_style?: 'grid' | 'list' | 'default'
  }
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function TopArtists({ data, interval, config, style = 'default', size = 'half' }: TopArtistsProps): React.ReactElement {
  if (!data || data.length === 0) {
    return <></>
  }

  const title = config.top_artists_title || 'Top Artists'
  const hideTitle = config.top_artists_hide_title || false
  const displayStyle = config.top_artists_style || 'default'
  const maxItems = config.top_artists_max || 10
  const limitedData = data.slice(0, maxItems)

  const gridItems: GridItemProps[] = limitedData.map((artist) => ({
    title: artist.name,
    value: '',
    image: artist.image,
  }))

  const listItems: ListItemProps[] = limitedData.map((artist) => ({
    right: artist.name,
    left: '',
    image: artist.image,
  }))

  const terminalListItems: TerminalLineProps[] = listItems.map((item) => ({
    right: typeof item.right === 'string' ? item.right : String(item.right || ''),
    left: '',
  }))

  if (displayStyle === 'list') {
    return (
      <section id="spotify-top-artists">
        <RenderBasedOnStyle
          style={style}
          defaultComponent={
            <>
              {!hideTitle && (
                <DefaultTitle
                  title={title}
                  subtitle={interval}
                  icon={<MdOutlinePersonOutline />}
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
                  section: 'top_artists',
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
      <section id="spotify-top-artists">
        <RenderBasedOnStyle
          style={style}
          defaultComponent={
            <>
              {!hideTitle && (
                <DefaultTitle
                  title={title}
                  subtitle={interval}
                  icon={<MdOutlinePersonOutline />}
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
                  section: 'top_artists',
                  period: interval,
                  limit: maxItems,
                  size,
                })}
              />
              <TerminalGrid
                data={gridItems}
                rightText="Artist"
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
    <section id="spotify-top-artists">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && (
              <DefaultTitle
                title={title}
                subtitle={interval}
                icon={<MdOutlinePersonOutline />}
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
                section: 'top_artists',
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

