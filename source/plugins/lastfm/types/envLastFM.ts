export const LastFmSections = [
  "recent_tracks",
  "statistics",
  "top_artists_grid",
  "top_artists_list",
  "top_artists_default",
  "top_albums_list",
  "top_albums_grid",
  "top_albums_default",
  "top_tracks_list",
  "top_tracks_grid",
  "top_tracks_default",
]

export interface LastFmConfig {
  plugin_lastfm: boolean
  username: string
  sections: string[]

  hide_intervals?: boolean
  hide_header?: boolean

  // Custom titles
  statistics_title?: string
  recent_tracks_title?: string
  top_artists_title?: string
  top_artists_interval_text?: string

  top_albums_title?: string
  top_albums_interval_text?: string

  top_tracks_title?: string
  top_tracks_interval_text?: string

  statistics_hide_title?: boolean

  recent_tracks_max?: number
  recent_tracks_hide_title?: boolean

  top_artists_max?: number
  top_artists_hide_title?: boolean

  top_albums_max?: number
  top_albums_hide_title?: boolean

  top_tracks_max?: number
  top_tracks_hide_title?: boolean
}

export default LastFmConfig
