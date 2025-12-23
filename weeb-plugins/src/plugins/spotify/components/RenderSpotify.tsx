/**
 * Main rendering component for the Spotify plugin
 */

import React from 'react'
import type { SpotifyConfig, SpotifyData } from '../types.js'
import { RecentTracks } from './RecentTracks.js'
import { TopArtists } from './TopArtists.js'
import { TopTracks } from './TopTracks.js'
import { CurrentlyPlaying } from './CurrentlyPlaying.js'
import { Playlists } from './Playlists.js'
import { Profile } from './Profile.js'

interface RenderSpotifyProps {
  config: SpotifyConfig
  data: SpotifyData
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function RenderSpotify({
  config,
  data,
  style = 'default',
  size = 'half',
}: RenderSpotifyProps): React.ReactElement {
  if (!config.enabled || config.sections.length === 0) {
    return <></>
  }

  const sections = config.sections

  // Combine nonEssential with root-level config properties
  const sectionConfig = {
    ...(config.nonEssential || {}),
    ...Object.keys(config).reduce((acc, key) => {
      if (
        key.startsWith('recent_tracks_') ||
        key.startsWith('top_artists_') ||
        key.startsWith('top_tracks_') ||
        key.startsWith('currently_playing_') ||
        key.startsWith('playlists_') ||
        key.startsWith('profile_')
      ) {
        acc[key] = (config as any)[key]
      }
      return acc
    }, {} as Record<string, any>),
  }

  // Render each requested section
  const renderedSections = sections.map((section) => {
    switch (section) {
      case 'recent_tracks':
        return (
          <RecentTracks
            key="recent_tracks"
            data={data.recentTracks}
            config={sectionConfig}
            style={style}
            size={size}
          />
        )
      case 'top_artists':
        return (
          <TopArtists
            key="top_artists"
            data={data.topArtists}
            interval={data.topArtistsPeriod}
            config={sectionConfig}
            style={style}
            size={size}
          />
        )
      case 'top_tracks':
        return (
          <TopTracks
            key="top_tracks"
            data={data.topTracks}
            interval={data.topTracksPeriod}
            config={sectionConfig}
            style={style}
            size={size}
          />
        )
      case 'currently_playing':
        return (
          <CurrentlyPlaying
            key="currently_playing"
            data={data.currentlyPlaying}
            config={sectionConfig}
            style={style}
            size={size}
          />
        )
      case 'playlists':
        return (
          <Playlists
            key="playlists"
            data={data.playlists}
            config={sectionConfig}
            style={style}
            size={size}
          />
        )
      case 'profile':
        return (
          <Profile
            key="profile"
            data={data.profile}
            config={sectionConfig}
            style={style}
            size={size}
          />
        )
      default:
        return null
    }
  })

  return <>{renderedSections}</>
}
