/**
 * Fetches data from Steam API
 */

import type { SteamConfig, SteamData, SteamGame, SteamPlayerSummary, SteamStatistics } from "../types"
import { getMockSteamData } from "./mock-data"
import { urlToDataUriDirect } from "../../../utils/image-to-base64"

const STEAM_IMAGE_MAX_BYTES = 250_000

const STEAM_API_BASE = "https://api.steampowered.com"
const STEAM_STORE_API = "https://store.steampowered.com/api"

export async function fetchSteamData(
  config: SteamConfig,
  dev: boolean,
  apiKey?: string,
  steamId?: string,
  previewMode = false
): Promise<SteamData> {
  // Em modo dev ou preview, retornar dados mock
  if (dev || previewMode) {
    console.log("[Steam] Using mock data (dev mode or preview mode)")
    const mockData = await getMockSteamData()

    // Em modo preview, manter URLs originais (não converter para base64)
    if (previewMode) {
      return mockData
    }

    // Converter URLs de imagens para base64 para que o Playwright possa carregá-las
    return (await convertImageUrlsToBase64(mockData, previewMode)) as SteamData
  }

  // The two are no longer the same kind of problem, so they no longer share a
  // message. steamId is the user's to provide; apiKey belongs to the deployment
  // and its absence is an operator error the user can do nothing about.
  if (!steamId) {
    throw new Error("Steam ID is required. Please configure it in your profile settings.")
  }
  if (!apiKey) {
    throw new Error("Steam is unavailable: the server has no Steam Web API key configured.")
  }

  try {
    // Fetch player summary
    const playerSummaryResponse = await fetch(
      `${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`
    )

    if (!playerSummaryResponse.ok) {
      throw new Error(`Failed to fetch player summary: ${playerSummaryResponse.statusText}`)
    }

    const playerSummaryData = await playerSummaryResponse.json()
    const playerSummary: SteamPlayerSummary | null = playerSummaryData.response?.players?.[0] || null

    // Fetch owned games
    const gamesResponse = await fetch(
      `${STEAM_API_BASE}/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`
    )

    if (!gamesResponse.ok) {
      throw new Error(`Failed to fetch games: ${gamesResponse.statusText}`)
    }

    const gamesData = await gamesResponse.json()
    const games: SteamGame[] = gamesData.response?.games || []

    // Fetch recently played games (last 2 weeks)
    const recentGamesResponse = await fetch(
      `${STEAM_API_BASE}/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}`
    )

    let recentGames: SteamGame[] = []
    if (recentGamesResponse.ok) {
      const recentGamesData = await recentGamesResponse.json()
      recentGames = recentGamesData.response?.games || []
    }

    // Merge recent games playtime into games list
    const gamesComRecentes = games.map((game) => {
      const recent = recentGames.find((rg) => rg.appid === game.appid)
      return {
        ...game,
        playtime_2weeks: recent?.playtime_2weeks || 0,
      }
    })

    // Depois do merge: a janela de capas depende do playtime_2weeks que acabou de
    // ser preenchido.
    const gamesWithRecent = withHeaderImages(gamesComRecentes, config)

    // Calculate statistics
    const statistics = calculateStatistics(gamesWithRecent)

    const apiData: SteamData = {
      playerSummary,
      games: gamesWithRecent,
      statistics,
    }

    // Em modo preview, manter URLs originais (não converter para base64)
    if (previewMode) {
      console.debug("[Steam] Preview mode: keeping image URLs as-is")
      return apiData
    }

    // Converter URLs de imagens para base64 para que o Playwright possa carregá-las
    console.log("[Steam] Converting image URLs to base64...")
    const dataWithBase64Images = await convertImageUrlsToBase64(apiData, previewMode)
    console.log("[Steam] Image conversion completed")

    return dataWithBase64Images
  } catch (error) {
    console.error("Error fetching Steam data:", error)
    // Fallback to mock data on error, with image conversion
    console.log("[Steam] Using mock data as fallback")
    const mockData = await getMockSteamData()

    // Em modo preview, manter URLs originais (não converter para base64)
    if (previewMode) {
      return mockData
    }

    return (await convertImageUrlsToBase64(mockData, previewMode)) as SteamData
  }
}

/** Mesma URL que o mock usa; conferida respondendo 200 em 15/08/2026. */
function headerImageUrl(appid: number): string {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`
}

/**
 * Preenche `header_image` nos jogos que vão aparecer.
 *
 * A API da Steam não devolve esse campo -- `GetOwnedGames` dá `img_icon_url` e
 * `img_logo_url`, que o próprio componente marca como "often invalid". Só o mock
 * tinha `header_image`, então o preview mostrava capa e a geração real não: os cards
 * saíam como retângulos escuros. A pista estava no comentário do componente, "we'll
 * use header_image instead **when available**" -- nunca estava.
 *
 * Preenche só a janela renderizada, não a biblioteca inteira: converter imagem para
 * base64 é uma requisição por jogo, e uma conta com 800 jogos faria 800 delas em
 * série. O recorte espelha o que RecentGames e TopGames de fato fatiam, incluindo a
 * ordenação, para não baixar imagem que ninguém vai ver.
 */
export function withHeaderImages(games: SteamGame[], config: SteamConfig): SteamGame[] {
  // SteamConfig tem index signature `unknown`, então os limites chegam sem tipo.
  // Coagir aqui evita que um valor inesperado vire um slice gigante.
  const limite = (valor: unknown, padrao: number) => (typeof valor === "number" && valor > 0 ? valor : padrao)
  const recentMax = limite(config.recent_games_max, 5)
  const topMax = limite(config.top_games_max, 5)

  const comCapa = new Set<number>()

  games
    .filter((g) => (g.playtime_2weeks || 0) > 0)
    .sort((a, b) => (b.playtime_2weeks || 0) - (a.playtime_2weeks || 0))
    // +1 porque o card de destaque em Statistics mostra o mais jogado das 2 semanas
    // mesmo quando a seção Recent Games está desligada ou com limite menor.
    .slice(0, Math.max(recentMax, 1))
    .forEach((g) => comCapa.add(g.appid))

  games
    .filter((g) => g.playtime_forever > 0)
    .sort((a, b) => b.playtime_forever - a.playtime_forever)
    .slice(0, topMax)
    .forEach((g) => comCapa.add(g.appid))

  return games.map((g) => (comCapa.has(g.appid) ? { ...g, header_image: headerImageUrl(g.appid) } : g))
}

function calculateStatistics(games: SteamGame[]): SteamStatistics {
  const totalGames = games.length
  const totalPlaytime = games.reduce((acc, game) => acc + (game.playtime_forever || 0), 0)
  const recentPlaytime = games.reduce((acc, game) => acc + (game.playtime_2weeks || 0), 0)

  // Find favorite game (most played)
  const favoriteGame =
    games.filter((g) => g.playtime_forever > 0).sort((a, b) => b.playtime_forever - a.playtime_forever)[0]?.name || null

  // Top games by playtime
  const topGames = games
    .filter((g) => g.playtime_forever > 0)
    .sort((a, b) => b.playtime_forever - a.playtime_forever)
    .slice(0, 10)
    .map((g) => ({
      name: g.name,
      playtime: g.playtime_forever,
    }))

  return {
    totalGames,
    totalPlaytime,
    recentPlaytime,
    favoriteGame,
    topGames,
  }
}

async function convertImageUrlsToBase64(data: any, previewMode = false): Promise<any> {
  if (Array.isArray(data)) {
    return Promise.all(data.map((item) => convertImageUrlsToBase64(item, previewMode)))
  }

  if (data && typeof data === "object") {
    const result: any = {}
    for (const [key, value] of Object.entries(data)) {
      if (
        (key === "avatar" || key === "avatarmedium" || key === "avatarfull" || key === "header_image") &&
        typeof value === "string" &&
        (value.startsWith("http://") || value.startsWith("https://"))
      ) {
        // Em modo preview, manter URLs originais
        if (previewMode) {
          result[key] = value
        } else {
          // Converter URL para base64 com otimização
          try {
            result[key] = (await urlToDataUriDirect(value, { maxBytes: STEAM_IMAGE_MAX_BYTES })).dataUri
          } catch {
            result[key] = null
          }
        }
      } else {
        result[key] = await convertImageUrlsToBase64(value, previewMode)
      }
    }
    return result
  }

  return data
}
