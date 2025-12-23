/**
 * TopTracks - Componente unificado para exibir top tracks do LastFM
 * Renderiza Grid, List ou Default baseado no config.top_tracks_style
 */

import React from 'react'
import { AiOutlineTrophy } from 'react-icons/ai'
import type { TopTrack } from '../types.js'
import { TopItems } from './TopItems.js'
import { abbreviateNumber } from '../../../utils/number.js'
import type { GridItemProps, ListItemProps } from '../../../templates/types.js'

interface TopTracksProps {
  data: TopTrack[]
  interval?: string
  config: {
    top_tracks_max?: number
    top_tracks_title?: string
    top_tracks_hide_title?: boolean
    top_tracks_style?: 'grid' | 'list' | 'default'
    hide_intervals?: boolean
  }
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function TopTracks({ data, interval, config, style = 'default', size = 'half' }: TopTracksProps): React.ReactElement {
  const displayStyle = config.top_tracks_style || 'default'

  return (
    <TopItems
      data={data}
      interval={interval}
      config={{
        max: config.top_tracks_max,
        title: config.top_tracks_title,
        hide_title: config.top_tracks_hide_title,
        hide_intervals: config.hide_intervals,
      }}
      style={style}
      size={size}
      displayStyle={displayStyle}
      sectionId="lastfm-top-tracks"
      sectionName="Top Tracks"
      icon={AiOutlineTrophy}
      terminalLabels={{
        rightText: 'Track',
        centerText: 'Artist',
        leftText: 'Plays',
      }}
      mapToGridItem={(track) => ({
        title: track.track || '',
        image: track.image,
        subtitle: track.artist,
        value: abbreviateNumber(track.plays || '0') + ' plays',
      })}
      mapToListItem={(track) => ({
        right: track.track || '',
        image: track.image,
        center: track.artist,
        left: abbreviateNumber(track.plays || '0') + ' plays',
      })}
    />
  )
}

