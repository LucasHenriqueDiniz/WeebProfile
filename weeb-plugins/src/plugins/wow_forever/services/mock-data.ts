import type { WowForeverData } from "../types"

/**
 * A made-up level 60 paladin in pre-raid gear. The pictures come from Blizzard's render
 * server: the generic portrait it serves when a character has none (human male), and a
 * full-body render.
 */
export const MOCK_AVATAR_URL = "https://render.worldofwarcraft.com/shadow/avatar/1-0.jpg"
export const MOCK_RENDER_URL = "https://render.worldofwarcraft.com/shadow/avatar/1-0.jpg"

export const MOCK_DATA: WowForeverData = {
  region: "us",
  slug: "liora-brightwater",
  character: {
    name: "Liora",
    surname: "Brightwater",
    level: 60,
    race: "Human",
    className: "Paladin",
    faction: "Alliance",
    guild: "Ashen Vanguard",
    ruleset: "Normal",
    averageItemLevel: 63,
    honorableKills: 1284,
  },
  image: null,
  equipment: [
    { slot: "Head", name: "Lionheart Helm", quality: "EPIC", itemLevel: 63 },
    { slot: "Neck", name: "Mark of Fordring", quality: "RARE", itemLevel: 63 },
    { slot: "Shoulders", name: "Truestrike Shoulders", quality: "RARE", itemLevel: 63 },
    { slot: "Back", name: "Cape of the Black Baron", quality: "RARE", itemLevel: 63 },
    { slot: "Chest", name: "Savage Gladiator Chain", quality: "EPIC", itemLevel: 63 },
    { slot: "Wrist", name: "Wristguards of Stability", quality: "RARE", itemLevel: 61 },
    { slot: "Hands", name: "Gauntlets of Might", quality: "EPIC", itemLevel: 66 },
    { slot: "Waist", name: "Onslaught Girdle", quality: "EPIC", itemLevel: 71 },
    { slot: "Legs", name: "Legplates of Might", quality: "EPIC", itemLevel: 66 },
    { slot: "Feet", name: "Battlechaser's Greaves", quality: "RARE", itemLevel: 61 },
    { slot: "Finger 1", name: "Don Julio's Band", quality: "RARE", itemLevel: 65 },
    { slot: "Finger 2", name: "Blackstone Ring", quality: "RARE", itemLevel: 63 },
    { slot: "Trinket 1", name: "Blackhand's Breadth", quality: "RARE", itemLevel: 63 },
    { slot: "Trinket 2", name: "Hand of Justice", quality: "RARE", itemLevel: 58 },
    { slot: "Main Hand", name: "Arcanite Reaper", quality: "EPIC", itemLevel: 63 },
    { slot: "Ranged", name: "Libram of Truth", quality: "UNCOMMON", itemLevel: 54 },
  ],
  stats: [
    { label: "Health", value: 4912 },
    { label: "Mana", value: 3210 },
    { label: "Strength", value: 312 },
    { label: "Agility", value: 128 },
    { label: "Stamina", value: 296 },
    { label: "Intellect", value: 141 },
    { label: "Spirit", value: 118 },
    { label: "Armor", value: 5644 },
  ],
}
