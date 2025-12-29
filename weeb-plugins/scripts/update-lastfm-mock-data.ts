#!/usr/bin/env tsx
/**
 * Script para atualizar mock-data.ts do Last.fm com dados reais da API
 * 
 * Uso: pnpm update-lastfm-mock
 * 
 * Este script busca dados reais do Last.fm e atualiza o arquivo mock-data.ts
 * para testar o fallback de imagens do Spotify.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const LASTFM_API_BASE = 'https://ws.audioscrobbler.com/2.0/'
const API_KEY = '3f9fde819871f9a82f581fca84f31294'
// Altere o USERNAME abaixo para o seu username do Last.fm
const USERNAME = 'Amayacrab'

interface LastFmApiResponse<T> {
  recenttracks?: {
    track?: Array<{
      name: string
      artist: { '#text': string }
      date?: { uts: string; '#text': string }
      image?: Array<{ '#text': string; size: string }>
    }>
    '@attr': {
      user: string
      total: string
    }
  }
  topartists?: {
    artist?: Array<{
      name: string
      playcount: string
      image?: Array<{ '#text': string; size: string }>
    }>
    '@attr': {
      user: string
      total: string
    }
  }
  topalbums?: {
    album?: Array<{
      name: string
      artist: { name: string }
      playcount: string
      image?: Array<{ '#text': string; size: string }>
    }>
    '@attr': {
      user: string
      total: string
    }
  }
  toptracks?: {
    track?: Array<{
      name: string
      artist: { name: string }
      playcount: string
      image?: Array<{ '#text': string; size: string }>
    }>
    '@attr': {
      user: string
      total: string
    }
  }
  user?: {
    name: string
    playcount: string
    artist_count: string
    lovedtracks: string
  }
  error?: number
  message?: string
}

function buildQueryString(params: Record<string, string | number>): string {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  }
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    console.error(`❌ Erro na requisição: ${url}`)
    console.error(`   Status: ${response.status} ${response.statusText}`)
    console.error(`   Resposta: ${errorText.substring(0, 200)}`)
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  return response.json() as Promise<T>
}

async function fetchRecentTracks(limit = 50) {
  const params = buildQueryString({
    method: 'user.getrecenttracks',
    user: USERNAME,
    api_key: API_KEY,
    format: 'json',
    limit: Math.min(limit, 50),
  })

  const url = `${LASTFM_API_BASE}${params}`
  console.log(`   🔗 Testando URL (API key oculta)...`)
  const response = await fetchJson<LastFmApiResponse<never>>(url)
  
  if (response.error) {
    throw new Error(`Last.fm API Error: ${response.message || 'Unknown error'}`)
  }

  const tracks = response.recenttracks?.track || []
  
  return tracks.map((track) => {
    const image = track.image?.find(img => img.size === 'large')?.['#text'] ||
                  track.image?.find(img => img.size === 'medium')?.['#text'] ||
                  track.image?.[0]?.['#text']
    
    return {
      track: track.name,
      artist: track.artist['#text'],
      date: track.date?.['#text'] || 'now',
      image,
    }
  })
}

async function fetchTopArtists(period: '7day' | '1month' | '3month' | '6month' | '12month' | 'overall' = '1month', limit = 50) {
  const params = buildQueryString({
    method: 'user.gettopartists',
    user: USERNAME,
    api_key: API_KEY,
    format: 'json',
    period,
    limit: Math.min(limit, 50),
  })

  const response = await fetchJson<LastFmApiResponse<never>>(`${LASTFM_API_BASE}${params}`)
  
  if (response.error) {
    throw new Error(`Last.fm API Error: ${response.message || 'Unknown error'}`)
  }

  const artists = response.topartists?.artist || []
  
  return artists.map((artist) => {
    const image = artist.image?.find(img => img.size === 'large')?.['#text'] ||
                  artist.image?.find(img => img.size === 'medium')?.['#text'] ||
                  artist.image?.[0]?.['#text']
    
    return {
      artist: artist.name,
      totalPlays: artist.playcount,
      image,
    }
  })
}

async function fetchTopAlbums(period: '7day' | '1month' | '3month' | '6month' | '12month' | 'overall' = '6month', limit = 50) {
  const params = buildQueryString({
    method: 'user.gettopalbums',
    user: USERNAME,
    api_key: API_KEY,
    format: 'json',
    period,
    limit: Math.min(limit, 50),
  })

  const response = await fetchJson<LastFmApiResponse<never>>(`${LASTFM_API_BASE}${params}`)
  
  if (response.error) {
    throw new Error(`Last.fm API Error: ${response.message || 'Unknown error'}`)
  }

  const albums = response.topalbums?.album || []
  
  return albums.map((album) => {
    const image = album.image?.find(img => img.size === 'large')?.['#text'] ||
                  album.image?.find(img => img.size === 'medium')?.['#text'] ||
                  album.image?.[0]?.['#text']
    
    return {
      album: album.name,
      artist: album.artist.name,
      plays: album.playcount,
      image,
    }
  })
}

async function fetchTopTracks(period: '7day' | '1month' | '3month' | '6month' | '12month' | 'overall' = 'overall', limit = 50) {
  const params = buildQueryString({
    method: 'user.gettoptracks',
    user: USERNAME,
    api_key: API_KEY,
    format: 'json',
    period,
    limit: Math.min(limit, 50),
  })

  const response = await fetchJson<LastFmApiResponse<never>>(`${LASTFM_API_BASE}${params}`)
  
  if (response.error) {
    throw new Error(`Last.fm API Error: ${response.message || 'Unknown error'}`)
  }

  const tracks = response.toptracks?.track || []
  
  return tracks.map((track) => {
    const image = track.image?.find(img => img.size === 'large')?.['#text'] ||
                  track.image?.find(img => img.size === 'medium')?.['#text'] ||
                  track.image?.[0]?.['#text']
    
    return {
      track: track.name,
      artist: track.artist.name,
      plays: track.playcount,
      image,
    }
  })
}

async function fetchUserInfo() {
  const params = buildQueryString({
    method: 'user.getinfo',
    user: USERNAME,
    api_key: API_KEY,
    format: 'json',
  })

  const response = await fetchJson<LastFmApiResponse<never>>(`${LASTFM_API_BASE}${params}`)
  
  if (response.error) {
    throw new Error(`Last.fm API Error: ${response.message || 'Unknown error'}`)
  }

  const user = response.user
  if (!user) {
    throw new Error('User not found')
  }

  return {
    totalScrobbles: user.playcount || '0',
    totalArtists: user.artist_count || '0',
    lovedTracks: user.lovedtracks || '0',
  }
}

function formatTrack(track: any, indent = '    '): string {
  return `${indent}{\n${indent}    track: ${JSON.stringify(track.track)},\n${indent}    artist: ${JSON.stringify(track.artist)},\n${indent}    date: ${JSON.stringify(track.date)},\n${indent}    image: ${JSON.stringify(track.image || '')}\n${indent}}`
}

function formatArtist(artist: any, indent = '    '): string {
  return `${indent}{\n${indent}    artist: ${JSON.stringify(artist.artist)},\n${indent}    totalPlays: ${JSON.stringify(artist.totalPlays)},\n${indent}    image: ${JSON.stringify(artist.image || '')}\n${indent}}`
}

function formatAlbum(album: any, indent = '    '): string {
  return `${indent}{\n${indent}    album: ${JSON.stringify(album.album)},\n${indent}    artist: ${JSON.stringify(album.artist)},\n${indent}    plays: ${JSON.stringify(album.plays)},\n${indent}    image: ${JSON.stringify(album.image || '')}\n${indent}}`
}

function formatTopTrack(track: any, indent = '    '): string {
  return `${indent}{\n${indent}    track: ${JSON.stringify(track.track)},\n${indent}    artist: ${JSON.stringify(track.artist)},\n${indent}    plays: ${JSON.stringify(track.plays)},\n${indent}    image: ${JSON.stringify(track.image || '')}\n${indent}}`
}

async function main() {
  console.log('🎵 Buscando dados do Last.fm...')
  console.log(`   👤 Username: ${USERNAME}`)
  console.log(`   🔑 API Key: ${API_KEY.substring(0, 8)}...\n`)

  try {
    console.log('📊 Buscando recent tracks...')
    const recentTracks = await fetchRecentTracks(50)
    console.log(`   ✓ ${recentTracks.length} tracks encontrados`)

    console.log('👤 Buscando top artists (últimos 30 dias)...')
    const topArtists = await fetchTopArtists('1month', 50)
    console.log(`   ✓ ${topArtists.length} artists encontrados`)

    console.log('💿 Buscando top albums (últimos 180 dias)...')
    const topAlbums = await fetchTopAlbums('6month', 50)
    console.log(`   ✓ ${topAlbums.length} albums encontrados`)

    console.log('🎶 Buscando top tracks...')
    const topTracks = await fetchTopTracks('overall', 50)
    console.log(`   ✓ ${topTracks.length} tracks encontrados`)

    console.log('📈 Buscando estatísticas do usuário...')
    const statistics = await fetchUserInfo()
    console.log(`   ✓ Estatísticas obtidas`)

    // Gerar conteúdo do arquivo
    const fileContent = `import type { LastFmData, LastFmTrack, LastFmArtist, LastFmAlbum, TopTrack, LastFmFeaturedTrack } from "../types"

function generateMockRecentTracks(count = 50): LastFmTrack[] {
  const baseData: LastFmTrack[] = [
${recentTracks.map(t => formatTrack(t)).join(',\n')}
]
  return baseData.slice(0, count)
}

function generateMockTopArtists(count = 10): LastFmArtist[] {
  const baseData: LastFmArtist[] = [
${topArtists.map(a => formatArtist(a)).join(',\n')}
]
  return baseData.slice(0, count)
}

function generateMockTopAlbums(count = 10): LastFmAlbum[] {
  const baseData: LastFmAlbum[] = [
${topAlbums.map(a => formatAlbum(a)).join(',\n')}
]
  return baseData.slice(0, count)
}

function generateMockTopTracks(count = 10): TopTrack[] {
  const baseData: TopTrack[] = [
${topTracks.map(t => formatTopTrack(t)).join(',\n')}
]
  return baseData.slice(0, count)
}

function generateMockFeaturedTrack(): LastFmFeaturedTrack | null {
  ${recentTracks.length > 0 ? `return {
    track: ${JSON.stringify(recentTracks[0].track)},
    artist: ${JSON.stringify(recentTracks[0].artist)},
    image: ${JSON.stringify(recentTracks[0].image || '')},
  }` : 'return null'}
}

export async function getMockLastFmData(config?: {
  recent_tracks_max?: number
  top_artists_max?: number
  top_albums_max?: number
  top_tracks_max?: number
}): Promise<LastFmData> {
  return {
    recentTracks: generateMockRecentTracks(config?.recent_tracks_max || 50),
    topArtists: generateMockTopArtists(config?.top_artists_max || 10),
    topAlbums: generateMockTopAlbums(config?.top_albums_max || 10),
    topTracks: generateMockTopTracks(config?.top_tracks_max || 10),
    statistics: {
      totalScrobbles: ${JSON.stringify(statistics.totalScrobbles)},
      totalArtists: ${JSON.stringify(statistics.totalArtists)},
      lovedTracks: ${JSON.stringify(statistics.lovedTracks)},
    },
    featuredTrack: generateMockFeaturedTrack(),
  }
}
`

    // Salvar arquivo
    const filePath = path.join(__dirname, '../src/plugins/lastfm/services/mock-data.ts')
    fs.writeFileSync(filePath, fileContent, 'utf-8')

    console.log('\n✅ Mock data atualizado com sucesso!')
    console.log(`   Arquivo salvo em: ${filePath}`)
    console.log(`\n📊 Resumo:`)
    console.log(`   - Recent tracks: ${recentTracks.length}`)
    console.log(`   - Top artists: ${topArtists.length} (últimos 30 dias)`)
    console.log(`   - Top albums: ${topAlbums.length} (últimos 180 dias)`)
    console.log(`   - Top tracks: ${topTracks.length}`)
    console.log(`\n💡 Agora você pode testar se o fallback de imagens do Spotify está funcionando!`)

  } catch (error) {
    console.error('\n❌ Erro ao buscar dados:', error)
    process.exit(1)
  }
}

main()

