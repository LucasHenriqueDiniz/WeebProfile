/**
 * TopAlbumsGrid - Componente para exibir top albums do LastFM em formato grid
 */

import React from 'react'
import { MdAlbum } from 'react-icons/md'
import { getPseudoCommands } from '../../../weeb-plugins/utils/pseudo-commands'
import { abbreviateNumber } from '../../../weeb-plugins/utils/number'
import { TerminalCommand } from '../../../weeb-plugins/templates/Terminal/TerminalCommand'
import { TerminalGrid } from '../../../weeb-plugins/templates/Terminal/TerminalGrid'
import { TerminalLineBreak } from '../../../weeb-plugins/templates/Terminal/TerminalLineBreak'
import { DefaultImageGrid } from '../../../weeb-plugins/templates/Default/DefaultImageGrid'
import { DefaultTitle } from '../../../weeb-plugins/templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../weeb-plugins/templates/RenderBasedOnStyle'
import type { GridItemProps } from '../../../weeb-plugins/templates/types'
import type { LastFmAlbum } from '../types'

interface TopAlbumsGridProps {
  data: LastFmAlbum[]
  interval?: string
  config: {
    top_albums_max?: number
    top_albums_title?: string
    top_albums_hide_title?: boolean
    hide_intervals?: boolean
  }
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function TopAlbumsGrid({ data, interval, config, style = 'default', size = 'half' }: TopAlbumsGridProps): React.ReactElement {
  if (!data || data.length === 0) {
    return <></>
  }

  const title = config.top_albums_title || 'Top Albums'
  const hideTitle = config.top_albums_hide_title || false
  const hideIntervals = config.hide_intervals || false
  const finalInterval = interval
  const maxItems = config.top_albums_max || 5

  // Limitar dados
  let limitedData = data
  if (data.length > maxItems) {
    limitedData = data.slice(0, maxItems)
  }

  const gridItems: GridItemProps[] = limitedData.map((album) => ({
    title: album.album,
    image: album.image,
    value: abbreviateNumber(album.plays) + ' plays',
  }))

  return (
    <section id="lastfm-top-albums">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && (
              <DefaultTitle
                title={title}
                subtitle={hideIntervals ? undefined : finalInterval}
                icon={<MdAlbum />}
              />
            )}
            <DefaultImageGrid data={gridItems} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: 'lastfm',
                section: 'top_albums',
                period: finalInterval,
                limit: maxItems,
                size,
              })}
            />
            <TerminalGrid data={gridItems} rightText="Album" leftText="Plays" />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

