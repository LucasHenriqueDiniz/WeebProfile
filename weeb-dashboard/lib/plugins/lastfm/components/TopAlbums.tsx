/**
 * TopAlbums - Componente unificado para exibir top albums do LastFM
 * Renderiza Grid, List ou Default baseado no config.top_albums_style
 */

import React from 'react'
import { MdAlbum } from 'react-icons/md'
import type { LastFmAlbum } from '../types'
import { TopItems } from './TopItems'
import { abbreviateNumber } from '../../../weeb-plugins/utils/number'
import type { GridItemProps, ListItemProps } from '../../../weeb-plugins/templates/types'

interface TopAlbumsProps {
  data: LastFmAlbum[]
  interval?: string
  config: {
    top_albums_max?: number
    top_albums_title?: string
    top_albums_hide_title?: boolean
    top_albums_style?: 'grid' | 'list' | 'default'
    hide_intervals?: boolean
  }
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function TopAlbums({ data, interval, config, style = 'default', size = 'half' }: TopAlbumsProps): React.ReactElement {
  const displayStyle = config.top_albums_style || 'default'

  return (
    <TopItems
      data={data}
      interval={interval}
      config={{
        max: config.top_albums_max,
        title: config.top_albums_title,
        hide_title: config.top_albums_hide_title,
        hide_intervals: config.hide_intervals,
      }}
      style={style}
      size={size}
      displayStyle={displayStyle}
      sectionId="lastfm-top-albums"
      sectionName="Top Albums"
      icon={MdAlbum}
      terminalLabels={{
        rightText: 'Album',
        leftText: 'Plays',
      }}
      mapToGridItem={(album) => ({
        title: album.album || '',
        image: album.image,
        value: abbreviateNumber(album.plays || '0') + ' plays',
      })}
      mapToListItem={(album) => ({
        right: album.album || '',
        image: album.image,
        center: album.artist,
        left: abbreviateNumber(album.plays || '0') + ' plays',
      })}
    />
  )
}

