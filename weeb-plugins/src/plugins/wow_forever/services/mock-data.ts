import { urlToDataUriDirect } from "../../../utils/image-to-base64"
import type { WowForeverData } from "../types"

/**
 * The project owner's character, as the API served it on 19/11/2026 (Pequeno Ibuprofeno,
 * US): a level 31 gnome priest in leveling gear, no guild yet. Every section comes from
 * the live responses passed through the plugin's own mappers. The pictures are the
 * character's own render and the game's icons on Blizzard's render server; a dev render
 * embeds them as production does, a preview keeps the URLs.
 */
export const MOCK_AVATAR_URL = "https://render.worldofwarcraft.com/forever-us/character/199/46305479-avatar.jpg"
export const MOCK_RENDER_URL = "https://render.worldofwarcraft.com/forever-us/character/199/46305479-main-raw.png"

/** Icons as URLs: `mockData` embeds them. */
export const MOCK_DATA: WowForeverData = {
  region: "us",
  slug: "pequeno-ibuprofeno",
  character: {
    name: "Pequeno",
    surname: "Ibuprofeno",
    level: 31,
    race: "Gnome",
    className: "Priest",
    faction: "Alliance",
    guild: null,
    ruleset: "Normal",
    averageItemLevel: 26,
    honorableKills: 0,
  },
  image: null,
  // In the API's order: by inventory slot, head to ranged. The shirt is left out, as fetchData does.
  equipment: [
    {
      slotType: "HEAD",
      slot: "Head",
      name: "Enchanter's Cowl",
      quality: "UNCOMMON",
      itemLevel: 33,
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/133133.jpg",
    },
    {
      slotType: "NECK",
      slot: "Neck",
      name: "Sorcerer Collar",
      quality: "RARE",
      itemLevel: 22,
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/133294.jpg",
    },
    {
      slotType: "SHOULDER",
      slot: "Shoulders",
      name: "Mantle of Honor",
      quality: "UNCOMMON",
      itemLevel: 35,
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/135036.jpg",
    },
    {
      slotType: "CHEST",
      slot: "Chest",
      name: "Green Silk Armor",
      quality: "UNCOMMON",
      itemLevel: 33,
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/132647.jpg",
    },
    {
      slotType: "WAIST",
      slot: "Waist",
      name: "Ivycloth Sash of the Elder",
      quality: "UNCOMMON",
      itemLevel: 26,
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/132514.jpg",
    },
    {
      slotType: "LEGS",
      slot: "Legs",
      name: "Magistrate's Pantaloons",
      quality: "RARE",
      itemLevel: 29,
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/134594.jpg",
    },
    {
      slotType: "FEET",
      slot: "Feet",
      name: "Spidersilk Boots",
      quality: "RARE",
      itemLevel: 25,
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/132539.jpg",
    },
    {
      slotType: "WRIST",
      slot: "Wrist",
      name: "Bridgebreaker Bindings",
      quality: "RARE",
      itemLevel: 29,
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/132606.jpg",
    },
    {
      slotType: "HANDS",
      slot: "Hands",
      name: "Ivycloth Gloves of the Prophet",
      quality: "UNCOMMON",
      itemLevel: 26,
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/132961.jpg",
    },
    {
      slotType: "FINGER_1",
      slot: "Ring 1",
      name: "Seal of Wrynn",
      quality: "RARE",
      itemLevel: 31,
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/133347.jpg",
    },
    {
      slotType: "FINGER_2",
      slot: "Ring 2",
      name: "Ring of Forlorn Spirits",
      quality: "UNCOMMON",
      itemLevel: 35,
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/133343.jpg",
    },
    {
      slotType: "TRINKET_1",
      slot: "Trinket 1",
      name: "Worgenbane Talisman",
      quality: "RARE",
      itemLevel: 26,
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/133439.jpg",
    },
    {
      slotType: "BACK",
      slot: "Back",
      name: "Vital Cape of Healing",
      quality: "UNCOMMON",
      itemLevel: 32,
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/133767.jpg",
    },
    {
      slotType: "MAIN_HAND",
      slot: "Main Hand",
      name: "Staff of Westfall",
      quality: "RARE",
      itemLevel: 24,
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/135147.jpg",
    },
    {
      slotType: "RANGED",
      slot: "Ranged",
      name: "Consecrated Wand",
      quality: "UNCOMMON",
      itemLevel: 30,
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/135464.jpg",
    },
  ],
  stats: [
    { key: "health", label: "Health", value: 727 },
    { key: "power", label: "Mana", value: 2751 },
    { key: "strength", label: "Strength", value: 24 },
    { key: "agility", label: "Agility", value: 34 },
    { key: "stamina", label: "Stamina", value: 49 },
    { key: "intellect", label: "Intellect", value: 149 },
    { key: "spirit", label: "Spirit", value: 91 },
    { key: "armor", label: "Armor", value: 408 },
  ],
  journey: [
    {
      key: "kills",
      label: "Kills",
      value: 3415,
    },
    {
      key: "deaths",
      label: "Deaths",
      value: 43,
    },
    {
      key: "quests",
      label: "Quests",
      value: 342,
    },
    {
      key: "dungeons",
      label: "Dungeons",
      value: 8,
    },
    {
      key: "killing_blows",
      label: "Killing blows",
      value: 1424,
    },
    {
      key: "flight_paths",
      label: "Flight paths",
      value: 51,
    },
    {
      key: "hearthstones",
      label: "Hearthstones",
      value: 33,
    },
    {
      key: "duels_won",
      label: "Duels won",
      value: 1,
    },
  ],
  professions: [
    {
      name: "Tailoring",
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/136249.jpg",
      value: 81,
      max: 150,
      label: "81 / 150",
    },
    {
      name: "Engineering",
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/136243.jpg",
      value: 150,
      max: 150,
      label: "150 / 150",
    },
    {
      name: "Cooking",
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/133971.jpg",
      value: 1,
      max: 75,
      label: "1 / 75",
    },
  ],
  reputations: [
    {
      name: "Stormwind",
      icon: null,
      value: 9005,
      max: 12000,
      label: "Honored",
      tier: 5,
    },
    {
      name: "Ironforge",
      icon: null,
      value: 1958,
      max: 12000,
      label: "Honored",
      tier: 5,
    },
    {
      name: "Gnomeregan Exiles",
      icon: null,
      value: 1383,
      max: 12000,
      label: "Honored",
      tier: 5,
    },
    {
      name: "Darnassus",
      icon: null,
      value: 818,
      max: 12000,
      label: "Honored",
      tier: 5,
    },
    {
      name: "Gadgetzan",
      icon: null,
      value: 600,
      max: 3000,
      label: "Neutral",
      tier: 3,
    },
  ],
  talents: [
    {
      name: "Discipline",
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/135987.jpg",
      value: 22,
      max: 22,
      label: "22",
    },
    {
      name: "Holy",
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/135920.jpg",
      value: 0,
      max: 22,
      label: "0",
    },
    {
      name: "Shadow Magic",
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/136207.jpg",
      value: 0,
      max: 22,
      label: "0",
    },
  ],
  dungeons: [
    {
      boss: "Edwin VanCleef",
      dungeon: "Deadmines",
      kills: 2,
    },
    {
      boss: "Archmage Arugal",
      dungeon: "Shadowfang Keep",
      kills: 1,
    },
    {
      boss: "Bazil Thredd",
      dungeon: "Stormwind Stockade",
      kills: 1,
    },
    {
      boss: "Bazzalan",
      dungeon: "Ragefire Chasm",
      kills: 1,
    },
    {
      boss: "Durgen Dirgehammer",
      dungeon: "Hall of Thanes",
      kills: 1,
    },
    {
      boss: "Mekgineer Thermaplugg",
      dungeon: "Gnomeregan",
      kills: 1,
    },
  ],
  achievements: [
    {
      name: "Journeyman Engineer",
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/136243.jpg",
      completedAt: 1794944400000,
    },
    {
      name: "Explore Redridge Mountains",
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/236814.jpg",
      completedAt: 1794842574000,
    },
    {
      name: "Explore Elwynn Forest",
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/236761.jpg",
      completedAt: 1794763101000,
    },
    {
      name: "Explore Darkshore",
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/236739.jpg",
      completedAt: 1794757226000,
    },
    {
      name: "Novice Priest",
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/626004.jpg",
      completedAt: 1794513360000,
    },
    {
      name: "Journeyman Enchanter",
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/136244.jpg",
      completedAt: 1794511800000,
    },
    {
      name: "Expert Alchemist",
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/136240.jpg",
      completedAt: 1794509160000,
    },
    {
      name: "Journeyman Alchemist",
      icon: "https://render.worldofwarcraft.com/forever-us/icons/56/136240.jpg",
      completedAt: 1794277740000,
    },
  ],
  collection: {
    mounts: ["Cerulean Prideclaw", "Veteran Adventurer's Loyal Companion"],
    pets: ["Zergling", "Panda Cub", "Mini Diablo", "Pachimari", "Condor Hatchling", "Green Wing Macaw"],
    toys: ["Shen'dorei Windwell"],
  },
}

/** Embedded once per URL: the height audit renders the mock hundreds of times. */
const embedded = new Map<string, Promise<string | null>>()

function embed(url: string | null): Promise<string | null> {
  if (!url) return Promise.resolve(null)
  let pending = embedded.get(url)
  if (!pending) {
    pending = urlToDataUriDirect(url)
      .then((r) => r.dataUri)
      .catch(() => null)
    embedded.set(url, pending)
  }
  return pending
}

/**
 * The mock as the options would draw it. `embed` turns the URLs into data URIs (a dev
 * render, as production does); without it the URLs stay (the dashboard's preview).
 */
export async function mockData({
  imageKind,
  itemIcons,
  embed: embedImages,
}: {
  imageKind: "render" | "avatar" | "none"
  itemIcons: boolean
  embed: boolean
}): Promise<WowForeverData> {
  const pic = (url: string | null): Promise<string | null> => (embedImages ? embed(url) : Promise.resolve(url))
  const imageUrl = imageKind === "render" ? MOCK_RENDER_URL : imageKind === "avatar" ? MOCK_AVATAR_URL : null
  const withPics = <T extends { icon: string | null }>(rows: T[]): Promise<T[]> =>
    Promise.all(rows.map(async (r) => ({ ...r, icon: await pic(r.icon) })))

  const [image, equipment, professions, talents, achievements] = await Promise.all([
    pic(imageUrl),
    itemIcons ? withPics(MOCK_DATA.equipment) : MOCK_DATA.equipment.map((i) => ({ ...i, icon: null })),
    withPics(MOCK_DATA.professions),
    withPics(MOCK_DATA.talents),
    withPics(MOCK_DATA.achievements),
  ])
  return {
    ...MOCK_DATA,
    image: image && imageKind !== "none" ? { kind: imageKind, src: image } : null,
    equipment,
    professions,
    talents,
    achievements,
  }
}
