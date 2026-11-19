import type { WowForeverData } from "../types"

/**
 * The project owner's character, as the API served it on 19/11/2026 (Pequeno Ibuprofeno,
 * US): a level 31 gnome priest in leveling gear, no guild yet. The pictures are its own
 * renders on Blizzard's server, embedded by a dev render as production does; they follow
 * the character's current look.
 */
export const MOCK_AVATAR_URL = "https://render.worldofwarcraft.com/forever-us/character/199/46305479-avatar.jpg"
export const MOCK_RENDER_URL = "https://render.worldofwarcraft.com/forever-us/character/199/46305479-main-raw.png"

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
    { slot: "Head", name: "Enchanter's Cowl", quality: "UNCOMMON", itemLevel: 33 },
    { slot: "Neck", name: "Sorcerer Collar", quality: "RARE", itemLevel: 22 },
    { slot: "Shoulders", name: "Mantle of Honor", quality: "UNCOMMON", itemLevel: 35 },
    { slot: "Chest", name: "Green Silk Armor", quality: "UNCOMMON", itemLevel: 33 },
    { slot: "Waist", name: "Ivycloth Sash of the Elder", quality: "UNCOMMON", itemLevel: 26 },
    { slot: "Legs", name: "Magistrate's Pantaloons", quality: "RARE", itemLevel: 29 },
    { slot: "Feet", name: "Spidersilk Boots", quality: "RARE", itemLevel: 25 },
    { slot: "Wrist", name: "Bridgebreaker Bindings", quality: "RARE", itemLevel: 29 },
    { slot: "Hands", name: "Ivycloth Gloves of the Prophet", quality: "UNCOMMON", itemLevel: 26 },
    { slot: "Ring 1", name: "Seal of Wrynn", quality: "RARE", itemLevel: 31 },
    { slot: "Ring 2", name: "Ring of Forlorn Spirits", quality: "UNCOMMON", itemLevel: 35 },
    { slot: "Trinket 1", name: "Worgenbane Talisman", quality: "RARE", itemLevel: 26 },
    { slot: "Back", name: "Vital Cape of Healing", quality: "UNCOMMON", itemLevel: 32 },
    { slot: "Main Hand", name: "Staff of Westfall", quality: "RARE", itemLevel: 24 },
    { slot: "Ranged", name: "Consecrated Wand", quality: "UNCOMMON", itemLevel: 30 },
  ],
  stats: [
    { label: "Health", value: 727 },
    { label: "Mana", value: 2751 },
    { label: "Strength", value: 24 },
    { label: "Agility", value: 34 },
    { label: "Stamina", value: 49 },
    { label: "Intellect", value: 149 },
    { label: "Spirit", value: 91 },
    { label: "Armor", value: 408 },
  ],
}
