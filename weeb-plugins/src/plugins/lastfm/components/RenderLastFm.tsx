/**
 * Renderizador principal do Plugin LastFM
 * 
 * Migrado do source original, adaptado para source-v2
 */

import React from 'react'
import type { LastFmConfig, LastFmData } from '../types.js'
import { RecentTracks } from './RecentTracks.js'
import { Statistics } from './Statistics.js'
import { TopArtists } from './TopArtists.js'
import { TopAlbums } from './TopAlbums.js'
import { TopTracks } from './TopTracks.js'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle.js'

interface RenderLastFmProps {
  config: LastFmConfig
  data: LastFmData
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function RenderLastFm({
  config,
  data,
  style = 'default',
  size = 'half',
}: RenderLastFmProps): React.ReactElement {
  if (!config.enabled || config.sections.length === 0) {
    return <></>
  }

  const sections = config.sections

  // Combinar nonEssential com propriedades do nível raiz do config
  // Isso permite que configurações como hide_title funcionem mesmo quando
  // estão no nível raiz do config (vindo do server.mjs)
  const sectionConfig = {
    ...(config.nonEssential || {}),
    // Incluir propriedades do nível raiz que são configurações de seção
    ...Object.keys(config).reduce((acc, key) => {
      // Incluir propriedades que começam com o nome de uma seção (ex: recent_tracks_*, top_tracks_*)
      if (
        key.startsWith('recent_tracks_') ||
        key.startsWith('top_artists_') ||
        key.startsWith('top_albums_') ||
        key.startsWith('top_tracks_') ||
        key.startsWith('statistics_') ||
        key === 'hide_intervals'
      ) {
        acc[key] = (config as any)[key]
      }
      return acc
    }, {} as Record<string, any>),
  }

  // Renderizar cada seção solicitada
  const renderedSections = sections.map((section) => {
    switch (section) {
      case 'recent_tracks':
        return (
          <RecentTracks
            key="recent_tracks"
            data={data.recentTracks}
            interval={undefined}
            config={sectionConfig}
            style={style}
            size={size}
          />
        )
      case 'statistics':
        return (
          <Statistics key="statistics" data={data} config={sectionConfig} style={style} size={size} />
        )
      case 'top_artists':
      case 'top_artists_default':
      case 'top_artists_list':
      case 'top_artists_grid': {
        // Suportar compatibilidade com seções antigas
        let displayStyle = sectionConfig.top_artists_style || 'default'
        if (section === 'top_artists_list') {
          displayStyle = 'list'
        } else if (section === 'top_artists_grid') {
          displayStyle = 'grid'
        } else if (section === 'top_artists_default') {
          displayStyle = 'default'
        }
        
            return (
          <TopArtists
                key="top_artists"
                data={data.topArtists}
                interval={data.topArtistsInterval}
            config={{
              ...sectionConfig,
              top_artists_style: displayStyle as 'grid' | 'list' | 'default',
            }}
                style={style}
                size={size}
              />
            )
      }
      case 'top_albums':
      case 'top_albums_default':
      case 'top_albums_list':
      case 'top_albums_grid': {
        // Suportar compatibilidade com seções antigas
        let displayStyle = sectionConfig.top_albums_style || 'default'
        if (section === 'top_albums_list') {
          displayStyle = 'list'
        } else if (section === 'top_albums_grid') {
          displayStyle = 'grid'
        } else if (section === 'top_albums_default') {
          displayStyle = 'default'
        }
        
            return (
          <TopAlbums
                key="top_albums"
                data={data.topAlbums}
                interval={data.topAlbumsInterval}
            config={{
              ...sectionConfig,
              top_albums_style: displayStyle as 'grid' | 'list' | 'default',
            }}
                style={style}
                size={size}
              />
            )
      }
      case 'top_tracks':
      case 'top_tracks_default':
      case 'top_tracks_list':
      case 'top_tracks_grid': {
        // Suportar compatibilidade com seções antigas
        let displayStyle = sectionConfig.top_tracks_style || 'default'
        if (section === 'top_tracks_list') {
          displayStyle = 'list'
        } else if (section === 'top_tracks_grid') {
          displayStyle = 'grid'
        } else if (section === 'top_tracks_default') {
          displayStyle = 'default'
        }
        
            return (
          <TopTracks
                key="top_tracks"
                data={data.topTracks}
                interval={data.topTracksInterval}
            config={{
              ...sectionConfig,
              top_tracks_style: displayStyle as 'grid' | 'list' | 'default',
            }}
                style={style}
                size={size}
              />
            )
      }
      default:
        return (
          <div key={section} className="text-muted">
            Section &quot;{section}&quot; not yet implemented
          </div>
        )
    }
  })

  return (
    <RenderBasedOnStyle
      style={style}
      defaultComponent={<>{renderedSections}</>}
      terminalComponent={<>{renderedSections}</>}
      wrapTerminalBody={true}
    />
  )
}

