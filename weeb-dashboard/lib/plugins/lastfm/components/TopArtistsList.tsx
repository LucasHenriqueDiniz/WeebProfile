/**
 * TopArtistsList - Componente para exibir top artists do LastFM em formato lista
 */

import React from 'react'
import { MdOutlinePersonOutline } from 'react-icons/md'
import { getPseudoCommands } from '../../../weeb-plugins/utils/pseudo-commands'
import { abbreviateNumber } from '../../../weeb-plugins/utils/number'
import { TerminalCommand } from '../../../weeb-plugins/templates/Terminal/TerminalCommand'
import { TerminalList } from '../../../weeb-plugins/templates/Terminal/TerminalList'
import { TerminalLineBreak } from '../../../weeb-plugins/templates/Terminal/TerminalLineBreak'
import { DefaultList } from '../../../weeb-plugins/templates/Default/DefaultList'
import { DefaultTitle } from '../../../weeb-plugins/templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../weeb-plugins/templates/RenderBasedOnStyle'
import type { ListItemProps, TerminalLineProps } from '../../../weeb-plugins/templates/types'
import type { LastFmArtist } from '../types'

interface TopArtistsListProps {
  data: LastFmArtist[]
  interval?: string
  config: {
    top_artists_max?: number
    top_artists_title?: string
    top_artists_hide_title?: boolean
    hide_intervals?: boolean
    top_artists_interval_text?: string
  }
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function TopArtistsList({ data, interval, config, style = 'default', size = 'half' }: TopArtistsListProps): React.ReactElement {
  if (!data || data.length === 0) {
    return <></>
  }

  const title = config.top_artists_title || 'Top Artists'
  const hideTitle = config.top_artists_hide_title || false
  const hideIntervals = config.hide_intervals || false
  const finalInterval = interval
  const maxItems = config.top_artists_max || 5

  // Limitar dados
  let limitedData = data
  if (data.length > maxItems) {
    limitedData = data.slice(0, maxItems)
  }

  const listItems: ListItemProps[] = limitedData.map((artist) => ({
    right: artist.artist,
    image: artist.image,
    left: abbreviateNumber(artist.totalPlays) + ' plays',
  }))

  const terminalListItems: TerminalLineProps[] = listItems.map((item) => ({
    right: item.right,
    left: item.left || '',
  }))

  return (
    <section id="lastfm-top-artists">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && (
              <DefaultTitle
                title={title}
                subtitle={hideIntervals ? undefined : finalInterval}
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
                plugin: 'lastfm',
                section: 'top_artists',
                period: finalInterval,
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

