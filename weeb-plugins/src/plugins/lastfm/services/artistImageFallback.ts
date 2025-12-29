/**
 * Serviço de fallback para buscar imagens de artistas via Spotify
 * 
 * Quando o Last.fm retorna a imagem padrão (fallback), este serviço tenta
 * buscar a imagem real do artista usando a API do Spotify.
 */

import { fetchJson } from '../../shared/utils/api'
import { ApiError } from '../../shared/utils/errors'

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'

/**
 * Hash da imagem fallback padrão do Last.fm
 */
const LASTFM_FALLBACK_IMAGE_HASH = '2a96cbd8b46e442fc41c2b86b821562f'

/**
 * Cache de tokens do Spotify (client credentials)
 */
let cachedToken: { token: string; expiresAt: number } | null = null

/**
 * Throttle para rate limiting do Spotify
 * Spotify permite ~180 requests/min (~3 req/s)
 * Usamos 350ms entre requests para ficar seguro
 */
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 350 // 350ms = ~2.8 req/s (seguro)

/**
 * Aguarda o intervalo mínimo entre requisições (throttle)
 */
async function throttleRequest(): Promise<void> {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest))
  }
  
  lastRequestTime = Date.now()
}

/**
 * Obtém access token do Spotify usando client credentials
 * 
 * @param clientId - Spotify Client ID
 * @param clientSecret - Spotify Client Secret
 * @returns Access token
 */
async function getSpotifyClientCredentialsToken(
  clientId: string,
  clientSecret: string
): Promise<string> {
  // Verificar cache (tokens duram 1 hora, usar com margem de segurança)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) {
    return cachedToken.token
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`,
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new ApiError(
      error.error_description || error.error || 'Failed to get Spotify client credentials token',
      response.status,
      'Spotify'
    )
  }

  const data = await response.json()
  const expiresAt = Date.now() + (data.expires_in * 1000) - 60000 // 1 minuto de margem

  cachedToken = {
    token: data.access_token,
    expiresAt,
  }

  return data.access_token
}

/**
 * Verifica se uma URL é a imagem fallback padrão do Last.fm
 */
export function isLastFmFallbackImage(url?: string): boolean {
  if (!url) return true
  return url.includes(LASTFM_FALLBACK_IMAGE_HASH)
}

/**
 * Busca imagem de artista no Spotify
 * 
 * @param artistName - Nome do artista
 * @param clientId - Spotify Client ID (opcional, busca em env)
 * @param clientSecret - Spotify Client Secret (opcional, busca em env)
 * @returns URL da imagem do artista ou null se não encontrar
 */
export async function getArtistImageFromSpotify(
  artistName: string,
  clientId?: string,
  clientSecret?: string
): Promise<string | null> {
  try {
    // Throttle para respeitar rate limit
    await throttleRequest()

    // Obter credenciais do ambiente se não fornecidas
    const spotifyClientId = clientId || process.env.SPOTIFY_CLIENT_ID
    const spotifyClientSecret = clientSecret || process.env.SPOTIFY_CLIENT_SECRET

    if (!spotifyClientId || !spotifyClientSecret) {
      // Se não houver credenciais, retorna null silenciosamente
      // Não queremos quebrar o fluxo principal
      return null
    }

    // Obter token
    const accessToken = await getSpotifyClientCredentialsToken(spotifyClientId, spotifyClientSecret)

    // Buscar artista por nome
    const searchParams = new URLSearchParams({
      q: `artist:"${artistName}"`,
      type: 'artist',
      limit: '1',
    })

    const response = await fetchJson<{
      artists: {
        items: Array<{
          id: string
          name: string
          images?: Array<{ url: string; height: number; width: number }>
        }>
      }
    }>(`${SPOTIFY_API_BASE}/search?${searchParams.toString()}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    // Pegar primeira imagem do primeiro resultado (maior resolução disponível)
    const artist = response.artists?.items?.[0]
    if (!artist || !artist.images || artist.images.length === 0) {
      return null
    }

    // Retornar a primeira imagem (Spotify ordena por tamanho, maior primeiro)
    return artist.images[0]?.url || null
  } catch (error) {
    return null
  }
}

/**
 * Obtém imagem de artista com fallback para Spotify
 * 
 * @param artistName - Nome do artista
 * @param lastFmImage - Imagem retornada pelo Last.fm
 * @param clientId - Spotify Client ID (opcional)
 * @param clientSecret - Spotify Client Secret (opcional)
 * @returns URL da imagem ou null
 */
export async function getArtistImageFallback(
  artistName: string,
  lastFmImage?: string,
  clientId?: string,
  clientSecret?: string
): Promise<string | null> {
  // Se não for imagem fallback, retornar a imagem do Last.fm
  if (!isLastFmFallbackImage(lastFmImage)) {
    return lastFmImage || null
  }

  // Se for imagem fallback, tentar buscar no Spotify
  return await getArtistImageFromSpotify(artistName, clientId, clientSecret)
}

