/**
 * Fetches data from Steam API
 */

import type { SteamConfig, SteamData, SteamGame, SteamPlayerSummary, SteamStatistics } from '../types'
import { getMockSteamData } from './mock-data'

const STEAM_API_BASE = 'https://api.steampowered.com'
const STEAM_STORE_API = 'https://store.steampowered.com/api'

export async function fetchSteamData(
  config: SteamConfig,
  dev: boolean,
  apiKey?: string,
  steamId?: string
): Promise<SteamData> {
  if (dev || !apiKey || !steamId) {
    return await getMockSteamData()
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
    const playerSummary: SteamPlayerSummary | null =
      playerSummaryData.response?.players?.[0] || null

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
    const gamesWithRecent = games.map((game) => {
      const recent = recentGames.find((rg) => rg.appid === game.appid)
      return {
        ...game,
        playtime_2weeks: recent?.playtime_2weeks || 0,
      }
    })

    // Calculate statistics
    const statistics = calculateStatistics(gamesWithRecent)

    return {
      playerSummary,
      games: gamesWithRecent,
      statistics,
    }
  } catch (error) {
    console.error('Error fetching Steam data:', error)
    // Fallback to mock data on error
    return await getMockSteamData()
  }
}

function calculateStatistics(games: SteamGame[]): SteamStatistics {
  const totalGames = games.length
  const totalPlaytime = games.reduce((acc, game) => acc + (game.playtime_forever || 0), 0)
  const recentPlaytime = games.reduce((acc, game) => acc + (game.playtime_2weeks || 0), 0)

  // Find favorite game (most played)
  const favoriteGame = games
    .filter((g) => g.playtime_forever > 0)
    .sort((a, b) => b.playtime_forever - a.playtime_forever)[0]?.name || null

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

