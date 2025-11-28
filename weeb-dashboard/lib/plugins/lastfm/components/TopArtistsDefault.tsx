/**
 * TopArtistsDefault - Componente para exibir top artists do LastFM em formato default
 */

import React from 'react'
import { MdOutlinePersonOutline } from 'react-icons/md'
import { getPseudoCommands } from '../../../weeb-plugins/utils/pseudo-commands'
import { abbreviateNumber } from '../../../weeb-plugins/utils/number'
import { TerminalCommand } from '../../../weeb-plugins/templates/Terminal/TerminalCommand'
import TerminalTree from '../../../weeb-plugins/templates/Terminal/TerminalTree'
import { DefaultGrid } from '../../../weeb-plugins/templates/Default/DefaultGrid'
import { DefaultTitle } from '../../../weeb-plugins/templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../weeb-plugins/templates/RenderBasedOnStyle'
import { TerminalLineBreak } from '../../../weeb-plugins/templates/Terminal/TerminalLineBreak'
import type { GridItemProps } from '../../../weeb-plugins/templates/types'
import type { LastFmArtist } from '../types'

interface TopArtistsDefaultProps {
  data: LastFmArtist[]
  interval?: string
  config: {
    top_artists_max?: number
    top_artists_title?: string
    top_artists_hide_title?: boolean
    hide_intervals?: boolean
  }
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function TopArtistsDefault({ data, interval, config, style = 'default', size = 'half' }: TopArtistsDefaultProps): React.ReactElement {
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

  const gridItems: GridItemProps[] = limitedData.map((artist) => ({
    image: artist.image,
    title: artist.artist,
    value: abbreviateNumber(artist.totalPlays) + ' plays',
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
            <DefaultGrid data={gridItems} size={size} />
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
            <TerminalTree data={gridItems} title={title} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

