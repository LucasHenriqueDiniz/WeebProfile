interface LastFmTrack {
  track: string
  artist: string
  date: string
  image: string | undefined
}

interface LastFmArtist {
  artist: string
  image: string | undefined
  totalPlays: string
}

interface LastFmAlbum {
  album: string
  artist: string
  plays: string
  image: string | undefined
}

interface LastFmFeaturedTrack {
  track: string
  artist: string
  image: string | undefined
}

interface TopTrack {
  track: string
  artist: string
  plays: string
  image: string | undefined
}

interface LastFmDynamicData {
  [key: string]:
    | string
    | number
    | boolean
    | LastFmTrack[]
    | LastFmArtist[]
    | LastFmAlbum[]
    | LastFmFeaturedTrack
    | TopTrack[]
    | null
}

interface LastFmData extends LastFmDynamicData {
  totalScrobbles: string
  totalArtists: string
  lovedTracks: string
  recentTracks: LastFmTrack[]
  topArtists: LastFmArtist[]
  topAlbums: LastFmAlbum[]
  topTracks: TopTrack[]
  featuredTrack: LastFmFeaturedTrack | null
  topArtistsInterval: string
  topAlbumsInterval: string
  topTracksInterval: string
}

export type { LastFmAlbum, LastFmArtist, LastFmData, LastFmFeaturedTrack, LastFmTrack, TopTrack }
