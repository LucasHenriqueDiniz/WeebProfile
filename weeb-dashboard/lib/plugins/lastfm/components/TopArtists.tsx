/**
 * TopArtists - Componente unificado para exibir top artists do LastFM
 * Renderiza Grid, List ou Default baseado no config.top_artists_style
 */

import React from 'react'
import { MdOutlinePersonOutline } from 'react-icons/md'
import type { LastFmArtist } from '../types'
import { TopItems } from './TopItems'
import { abbreviateNumber } from '../../../weeb-plugins/utils/number'
import type { GridItemProps, ListItemProps } from '../../../weeb-plugins/templates/types'

interface TopArtistsProps {
  data: LastFmArtist[]
  interval?: string
  config: {
    top_artists_max?: number
    top_artists_title?: string
    top_artists_hide_title?: boolean
    top_artists_style?: 'grid' | 'list' | 'default'
    hide_intervals?: boolean
  }
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function TopArtists({ data, interval, config, style = 'default', size = 'half' }: TopArtistsProps): React.ReactElement {
  const displayStyle = config.top_artists_style || 'default'

  return (
    <TopItems
      data={data}
      interval={interval}
      config={{
        max: config.top_artists_max,
        title: config.top_artists_title,
        hide_title: config.top_artists_hide_title,
        hide_intervals: config.hide_intervals,
      }}
      style={style}
      size={size}
      displayStyle={displayStyle}
      sectionId="lastfm-top-artists"
      sectionName="Top Artists"
      icon={MdOutlinePersonOutline}
      terminalLabels={{
        rightText: 'Artist',
        leftText: 'Plays',
      }}
      mapToGridItem={(artist) => ({
        title: artist.artist || '',
        image: artist.image,
        value: abbreviateNumber(artist.totalPlays || '0') + ' plays',
      })}
      mapToListItem={(artist) => ({
        right: artist.artist || '',
        image: artist.image,
        left: abbreviateNumber(artist.totalPlays || '0') + ' plays',
      })}
    />
  )
}

