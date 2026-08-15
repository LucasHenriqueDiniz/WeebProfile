import type { SteamData, SteamGame, SteamPlayerSummary, SteamStatistics } from "../types"

const baseGames: SteamGame[] = [
  {
    appid: 730,
    name: "Counter-Strike 2",
    playtime_forever: 1200,
    playtime_2weeks: 45,
    img_icon_url: "6b0d000c5f0c0c5ed2c0c5ed2c0c5ed2",
    img_logo_url: "af890f85fd6a7c32d8b2c2b2c2b2c2b2",
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg",
  },
  {
    appid: 440,
    name: "Team Fortress 2",
    playtime_forever: 850,
    playtime_2weeks: 0,
    img_icon_url: "fcf6ee4f8b0c0c5ed2c0c5ed2c0c5ed2",
    img_logo_url: "af890f85fd6a7c32d8b2c2b2c2b2c2b2",
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/440/header.jpg",
  },
  {
    appid: 570,
    name: "Dota 2",
    playtime_forever: 2100,
    playtime_2weeks: 120,
    img_icon_url: "0bbb630d63262dd46d4dddddddddddd",
    img_logo_url: "af890f85fd6a7c32d8b2c2b2c2b2c2b2",
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg",
  },
  {
    appid: 271590,
    name: "Grand Theft Auto V",
    playtime_forever: 350,
    playtime_2weeks: 15,
    img_icon_url: "fcf6ee4f8b0c0c5ed2c0c5ed2c0c5ed2",
    img_logo_url: "af890f85fd6a7c32d8b2c2b2c2b2c2b2",
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg",
  },
  {
    appid: 1174180,
    name: "Red Dead Redemption 2",
    playtime_forever: 180,
    playtime_2weeks: 30,
    img_icon_url: "fcf6ee4f8b0c0c5ed2c0c5ed2c0c5ed2",
    img_logo_url: "af890f85fd6a7c32d8b2c2b2c2b2c2b2",
    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg",
  },
]

// Identidade sintética de propósito. Isto aqui era a conta real do dono do
// projeto -- steamid, nome e avatar --, e o preview do wizard mostrava "Amayacrab,
// 5 jogos na biblioteca" com cara de dado verdadeiro antes de qualquer busca
// acontecer. Dado de exemplo precisa parecer exemplo.
const AVATAR_PADRAO_STEAM = "https://avatars.fastly.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb"

const basePlayerSummary: SteamPlayerSummary = {
  steamid: "76561190000000000",
  personaname: "Weeb Profile",
  profileurl: "https://steamcommunity.com/profiles/76561190000000000",
  avatar: `${AVATAR_PADRAO_STEAM}_full.jpg`,
  avatarmedium: `${AVATAR_PADRAO_STEAM}_medium.jpg`,
  avatarfull: `${AVATAR_PADRAO_STEAM}_full.jpg`,
  personastate: 1,
  communityvisibilitystate: 3,
  profilestate: 1,
  lastlogoff: Math.floor(Date.now() / 1000),
}

const baseStatistics: SteamStatistics = {
  totalGames: baseGames.length,
  totalPlaytime: baseGames.reduce((acc, g) => acc + g.playtime_forever, 0),
  recentPlaytime: baseGames.reduce((acc, g) => acc + (g.playtime_2weeks || 0), 0),
  favoriteGame: baseGames.sort((a, b) => b.playtime_forever - a.playtime_forever)[0]?.name || null,
  topGames: baseGames
    .sort((a, b) => b.playtime_forever - a.playtime_forever)
    .slice(0, 10)
    .map((g) => ({ name: g.name, playtime: g.playtime_forever })),
}

export async function getMockSteamData(): Promise<SteamData> {
  return {
    playerSummary: basePlayerSummary,
    games: baseGames,
    statistics: baseStatistics,
  }
}
