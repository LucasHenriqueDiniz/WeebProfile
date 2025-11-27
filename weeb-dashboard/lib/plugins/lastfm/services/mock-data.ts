/**
 * Dados mock para desenvolvimento
 */

import type { LastFmData, LastFmTrack, LastFmArtist, LastFmAlbum, TopTrack, LastFmFeaturedTrack } from '../types'
import { urlToBase64 } from '../../../weeb-plugins/utils/image-to-base64'

// Dados base para gerar mocks (imagens simplificadas)
const baseTrack = {
  track: 'Jekyll And Hyde',
  artist: 'Five Finger Death Punch',
  image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
}

const baseArtist = {
  artist: 'Chikoi The Maid',
  image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
}

const baseAlbum = {
  album: 'Everlasting Summer',
  artist: 'Seycara Orchestral',
  image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
}

function generateMockRecentTracks(count = 50): LastFmTrack[] {
  const result: LastFmTrack[] = []
  for (let i = 0; i < Math.min(count, 50); i++) {
    let dateStr: string
    if (i < 10) {
      dateStr = `${i * 5 + 2} minutes ago`
    } else if (i < 20) {
      dateStr = `${i - 8} hours ago`
    } else if (i < 50) {
      dateStr = `${i - 18} hours ago`
    } else {
      const days = Math.floor((i - 48) / 24) + 1
      dateStr = `${days} day${days > 1 ? 's' : ''} ago`
    }

    result.push({
      track: baseTrack.track,
      artist: baseTrack.artist,
      image: baseTrack.image,
      date: dateStr,
    })
  }

  return result
}

function generateMockTopArtists(count = 10): LastFmArtist[] {
  const result: LastFmArtist[] = []
  for (let i = 0; i < Math.min(count, 50); i++) {
    result.push({
      artist: `${baseArtist.artist}${i > 0 ? ` ${i + 1}` : ''}`,
      totalPlays: String(Math.max(1, 1000 - i * 50)),
      image: baseArtist.image,
    })
  }

  return result
}

function generateMockTopAlbums(count = 10): LastFmAlbum[] {
  const result: LastFmAlbum[] = []
  for (let i = 0; i < Math.min(count, 50); i++) {
    result.push({
      album: `${baseAlbum.album}${i > 0 ? ` ${i + 1}` : ''}`,
      artist: baseAlbum.artist,
      plays: String(Math.max(1, 500 - i * 25)),
      image: baseAlbum.image,
    })
  }

  return result
}

function generateMockTopTracks(count = 10): TopTrack[] {
  const result: TopTrack[] = []
  for (let i = 0; i < Math.min(count, 50); i++) {
    result.push({
      track: `${baseTrack.track}${i > 0 ? ` ${i + 1}` : ''}`,
      artist: baseTrack.artist,
      plays: String(Math.max(1, 300 - i * 15)),
      image: baseTrack.image,
    })
  }

  return result
}

function generateMockFeaturedTrack(): LastFmFeaturedTrack {
  return {
    track: baseTrack.track,
    artist: baseTrack.artist,
    image: baseTrack.image,
  }
}

/**
 * Converte URLs de imagens para base64 recursivamente (para dados mock)
 */
async function convertImageUrlsToBase64(data: any): Promise<any> {
  if (Array.isArray(data)) {
    return Promise.all(data.map((item) => convertImageUrlsToBase64(item)))
  }

  if (data && typeof data === 'object') {
    const result: any = {}
    for (const [key, value] of Object.entries(data)) {
      if (
        key === 'image' &&
        typeof value === 'string' &&
        (value.startsWith('http://') || value.startsWith('https://'))
      ) {
        // Converter URL para base64
        result[key] = await urlToBase64(value)
      } else {
        result[key] = await convertImageUrlsToBase64(value)
      }
    }
    return result
  }

  return data
}

export async function getMockLastFmData(config?: { 
  recent_tracks_max?: number
  top_artists_max?: number
  top_albums_max?: number
  top_tracks_max?: number
}): Promise<LastFmData> {
  // Limite máximo para exibição: 50 itens
  const recentTracksCount = config?.recent_tracks_max ? Math.min(config.recent_tracks_max, 50) : 5
  const topArtistsCount = config?.top_artists_max ? Math.min(config.top_artists_max, 50) : 10
  const topAlbumsCount = config?.top_albums_max ? Math.min(config.top_albums_max, 50) : 10
  const topTracksCount = config?.top_tracks_max ? Math.min(config.top_tracks_max, 50) : 10
  
  const rawData: LastFmData = {
    recentTracks: generateMockRecentTracks(recentTracksCount),
    topArtists: generateMockTopArtists(topArtistsCount),
    topAlbums: generateMockTopAlbums(topAlbumsCount),
    topTracks: generateMockTopTracks(topTracksCount),
    statistics: {
      // Dados baseados em dados reais da API do LastFM
      totalScrobbles: '152353',
      totalArtists: '11708',
      lovedTracks: '312',
    },
    featuredTrack: generateMockFeaturedTrack(),
    topArtistsInterval: 'Last year',
    topAlbumsInterval: 'Last year',
    topTracksInterval: 'Last year',
  }

  // Converter todas as URLs de imagens para base64
  return await convertImageUrlsToBase64(rawData) as LastFmData
}
