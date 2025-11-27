/**
 * TopTracksGrid - Componente para exibir top tracks do LastFM em formato grid
 */

import React from 'react'
import { AiOutlineTrophy } from 'react-icons/ai'
import { getPseudoCommands } from '../../../weeb-plugins/utils/pseudo-commands'
import { abbreviateNumber } from '../../../weeb-plugins/utils/number'
import { TerminalCommand } from '../../../weeb-plugins/templates/Terminal/TerminalCommand'
import { TerminalGrid } from '../../../weeb-plugins/templates/Terminal/TerminalGrid'
import { TerminalLineBreak } from '../../../weeb-plugins/templates/Terminal/TerminalLineBreak'
import { DefaultImageGrid } from '../../../weeb-plugins/templates/Default/DefaultImageGrid'
import { DefaultTitle } from '../../../weeb-plugins/templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../weeb-plugins/templates/RenderBasedOnStyle'
import type { GridItemProps } from '../../../weeb-plugins/templates/types'
import type { TopTrack } from '../types'

interface TopTracksGridProps {
  data: TopTrack[]
  interval?: string
  config: {
    top_tracks_max?: number
    top_tracks_title?: string
    top_tracks_hide_title?: boolean
    hide_intervals?: boolean
  }
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function TopTracksGrid({ data, interval, config, style = 'default', size = 'half' }: TopTracksGridProps): React.ReactElement {
  if (!data || data.length === 0) {
    return <></>
  }

  const title = config.top_tracks_title || 'Top Tracks'
  const hideTitle = config.top_tracks_hide_title || false
  const hideIntervals = config.hide_intervals || false
  const finalInterval = interval
  const maxItems = config.top_tracks_max || 5

  // Limitar dados
  let limitedData = data
  if (data.length > maxItems) {
    limitedData = data.slice(0, maxItems)
  }

  const gridItems: GridItemProps[] = limitedData.map((track) => ({
    title: track.track,
    image: track.image,
    subtitle: track.artist,
    value: abbreviateNumber(track.plays) + ' plays',
  }))

  return (
    <section id="lastfm-top-tracks">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && (
              <DefaultTitle
                title={title}
                subtitle={hideIntervals ? undefined : finalInterval}
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
                plugin: 'lastfm',
                section: 'top_tracks',
                period: finalInterval,
                limit: maxItems,
                size,
              })}
            />
            <TerminalGrid data={gridItems} rightText="Track" centerText="Artist" leftText="Plays" />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

