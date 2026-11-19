/**
 * Reads a WoW Forever character from the Battle.net API and embeds its picture.
 */

import { embedImageOrNull } from "../../../utils/image-to-base64"
import type { EssentialPluginConfig } from "../../shared/types/base"
import type {
  CharacterImage,
  ItemQuality,
  WowCharacter,
  WowForeverConfig,
  WowForeverData,
  WowItem,
  WowRegion,
  WowStat,
} from "../types"
import { NotServedError, getCharacter, type BattlenetCredentials } from "./battlenet"
import { parseCharacterRef } from "./character-ref"
import { MOCK_AVATAR_URL, MOCK_DATA, MOCK_RENDER_URL } from "./mock-data"

/**
 * The full-body render is a 1600x1200 PNG with a transparent background, 240-500 KB.
 * It goes into the SVG as it is (the generator does not resize), so it is capped a
 * little above the largest seen. The portrait is an 84x84 JPEG of about 4 KB.
 */
const RENDER_MAX_BYTES = 800_000
const AVATAR_MAX_BYTES = 100_000

/** Slots that do not say much about the character: cosmetic, or a stack of arrows. */
const HIDDEN_SLOTS = new Set(["SHIRT", "TABARD", "AMMO"])

/** The most slots the equipment section lists: every slot but the hidden ones. */
export const MAX_EQUIPMENT = 17

interface Named {
  name?: string
}

interface ProfileResponse {
  name: string
  surname?: string
  level: number
  race?: Named
  character_class?: Named
  faction?: Named
  guild?: Named
  ruleset?: Named
  average_item_level?: number
  equipped_item_level?: number
}

interface MediaResponse {
  assets?: Array<{ key: string; value: string }>
}

interface EquipmentResponse {
  equipped_items?: Array<{
    slot?: { type?: string; name?: string }
    name?: string
    quality?: { type?: string }
    level?: { value?: number }
  }>
}

interface Stat {
  effective?: number
}

interface StatisticsResponse {
  health?: number
  power?: number
  power_type?: Named
  armor?: Stat
  strength?: Stat
  agility?: Stat
  stamina?: Stat
  intellect?: Stat
  spirit?: Stat
}

interface PvpSummaryResponse {
  honorable_kills?: number
}

export function characterImageOption(config: WowForeverConfig): CharacterImage {
  const value = config.character_image ?? config.nonEssential?.character_image
  return value === "avatar" || value === "none" ? value : "render"
}

export function mapCharacter(profile: ProfileResponse, pvp: PvpSummaryResponse | null): WowCharacter {
  return {
    name: profile.name,
    surname: profile.surname ?? "",
    level: profile.level,
    race: profile.race?.name ?? "",
    className: profile.character_class?.name ?? "",
    faction: profile.faction?.name ?? "",
    guild: profile.guild?.name || null,
    ruleset: profile.ruleset?.name || null,
    // The level of what the character wears, the gear the card lists. The average also
    // counts better items kept in the bags (27 against 26 for the mock character).
    averageItemLevel: profile.equipped_item_level || profile.average_item_level || null,
    honorableKills: typeof pvp?.honorable_kills === "number" ? pvp.honorable_kills : null,
  }
}

export function mapEquipment(equipment: EquipmentResponse): WowItem[] {
  return (equipment.equipped_items ?? [])
    .filter((item) => item.name && !HIDDEN_SLOTS.has(item.slot?.type ?? ""))
    .map((item) => ({
      slot: item.slot?.name ?? "",
      name: item.name!,
      quality: (item.quality?.type ?? "COMMON") as ItemQuality,
      itemLevel: item.level?.value ?? null,
    }))
}

/** The eight numbers of the character sheet, in its order. Missing ones are left out. */
export function mapStats(statistics: StatisticsResponse): WowStat[] {
  const entries: Array<[string, number | undefined]> = [
    ["Health", statistics.health],
    [statistics.power_type?.name || "Power", statistics.power],
    ["Strength", statistics.strength?.effective],
    ["Agility", statistics.agility?.effective],
    ["Stamina", statistics.stamina?.effective],
    ["Intellect", statistics.intellect?.effective],
    ["Spirit", statistics.spirit?.effective],
    ["Armor", statistics.armor?.effective],
  ]
  return entries
    .filter((entry): entry is [string, number] => typeof entry[1] === "number")
    .map(([label, value]) => ({ label, value }))
}

/** A part the card can do without: a 404 leaves it out, anything else still fails the card. */
async function optional<T>(request: Promise<T>): Promise<T | null> {
  try {
    return await request
  } catch (error) {
    if (error instanceof NotServedError) return null
    throw error
  }
}

async function embedImage(media: MediaResponse | null, kind: "render" | "avatar"): Promise<WowForeverData["image"]> {
  const key = kind === "render" ? "main-raw" : "avatar"
  const url = media?.assets?.find((asset) => asset.key === key)?.value
  const src = await embedImageOrNull(url, {
    maxBytes: kind === "render" ? RENDER_MAX_BYTES : AVATAR_MAX_BYTES,
    context: `wow_forever/${key}`,
  })
  return src ? { kind, src } : null
}

export async function fetchWowForeverData(
  config: WowForeverConfig,
  dev = false,
  essentialConfig?: EssentialPluginConfig,
  previewMode = false
): Promise<WowForeverData> {
  const sections = config.sections ?? []
  const imageKind = characterImageOption(config)
  const wantsImage = sections.includes("character") && imageKind !== "none"

  if (dev || previewMode) {
    if (!wantsImage) return MOCK_DATA
    const url = imageKind === "render" ? MOCK_RENDER_URL : MOCK_AVATAR_URL
    // A preview keeps the URL; a dev render embeds it, as production does.
    const src = previewMode ? url : await embedImageOrNull(url, { context: "wow_forever/mock" })
    return { ...MOCK_DATA, image: src ? { kind: imageKind, src } : null }
  }

  const ref = parseCharacterRef(config.character, config.region)

  // The generator fills these from its own Battle.net client (BATTLENET_CLIENT_ID and
  // BATTLENET_CLIENT_SECRET): they identify the application, not the user, and every
  // Forever character is public. Lowercase, as the renderer passes keys it does not map.
  const clientId = essentialConfig?.clientid
  const clientSecret = essentialConfig?.clientsecret
  if (!clientId || !clientSecret) {
    throw new Error("WoW Forever is unavailable: the server has no Battle.net client configured.")
  }
  const credentials: BattlenetCredentials = { clientId, clientSecret }

  // The profile first, region by region when the user did not pick one: names are unique
  // per region, so the first region that serves it is the character.
  let found: { region: WowRegion; profile: ProfileResponse } | null = null
  for (const region of ref.regions) {
    const profile = await optional(getCharacter<ProfileResponse>(credentials, region, ref.slug))
    if (profile) {
      found = { region, profile }
      break
    }
  }
  if (!found) {
    const where = ref.regions.length === 1 ? ref.regions[0]!.toUpperCase() : "any region"
    throw new Error(
      `WoW Forever character "${ref.slug}" was not found in ${where}. ` +
        "Blizzard only serves a character from level 10, after it logs out."
    )
  }
  const { region, profile } = found
  const get = <T>(route: string): Promise<T> => getCharacter<T>(credentials, region, ref.slug, route)

  const [media, pvp, equipment, statistics] = await Promise.all([
    // Media lags the profile by hours after a character first appears: no picture yet.
    wantsImage ? optional(get<MediaResponse>("/character-media")) : null,
    sections.includes("character") ? optional(get<PvpSummaryResponse>("/pvp-summary")) : null,
    sections.includes("equipment") ? get<EquipmentResponse>("/equipment") : null,
    sections.includes("stats") ? get<StatisticsResponse>("/statistics") : null,
  ])

  return {
    region,
    slug: ref.slug,
    character: mapCharacter(profile, pvp),
    image: wantsImage ? await embedImage(media, imageKind) : null,
    equipment: equipment ? mapEquipment(equipment) : [],
    stats: statistics ? mapStats(statistics) : [],
  }
}
