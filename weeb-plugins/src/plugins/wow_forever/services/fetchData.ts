/**
 * Reads a WoW Forever character from the Battle.net API: one call per route the enabled
 * sections draw, icons through the icon cache, the render embedded as a data URI.
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
import { pluginCacheGet, pluginCachePut } from "../../../utils/plugin-cache"
import { NotServedError, getCharacter, getStatic, type BattlenetCredentials } from "./battlenet"
import { parseCharacterRef } from "./character-ref"
import { iconFor, type IconKind } from "./icons"
import { mockData } from "./mock-data"
import {
  mapAchievements,
  mapCollection,
  mapDungeons,
  mapJourney,
  mapProfessions,
  mapReputations,
  mapTalents,
  type AchievementStatisticsResponse,
  type AchievementsResponse,
  type MountsResponse,
  type PetsResponse,
  type PlayableClassResponse,
  type ProfessionsResponse,
  type ReputationsResponse,
  type SpecializationsResponse,
  type ToysResponse,
} from "./sections"

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
/** The most achievements the achievements section lists, and the default. */
export const MAX_ACHIEVEMENTS = 10
export const DEFAULT_ACHIEVEMENTS = 5

/** A "max" option as a whole number from 1 to `limit`, `fallback` when unset. */
export function clampMax(value: unknown, limit: number, fallback = Math.min(DEFAULT_ACHIEVEMENTS, limit)): number {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? Math.min(Math.floor(n), limit) : fallback
}

interface Named {
  name?: string
  id?: number
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
    item?: { id?: number }
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

export function mapEquipment(equipment: EquipmentResponse): Array<WowItem & { id: number | undefined }> {
  return (equipment.equipped_items ?? [])
    .filter((item) => item.name && !HIDDEN_SLOTS.has(item.slot?.type ?? ""))
    .map((item) => ({
      id: item.item?.id,
      slot: item.slot?.name ?? "",
      name: item.name!,
      quality: (item.quality?.type ?? "COMMON") as ItemQuality,
      itemLevel: item.level?.value ?? null,
      icon: null,
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

/** Sections that read the lifetime statistics: both come from one response. */
const STATISTICS_SECTIONS = ["journey", "dungeons"]

function readOption<T>(config: WowForeverConfig, key: string): T | undefined {
  return (config[key] ?? config.nonEssential?.[key]) as T | undefined
}

/** Drops the ids the mappers keep for the icon lookups. */
const withoutId = <T extends { id?: number }>({ id: _id, ...rest }: T): Omit<T, "id"> => rest

/** Fills each entry's icon, in parallel, through the icon cache. */
async function withIcons<T extends { id?: number; icon: string | null }>(
  entries: T[],
  icon: (id: number) => Promise<string | null>
): Promise<T[]> {
  return Promise.all(entries.map(async (e) => ({ ...e, icon: e.id ? await icon(e.id) : null })))
}

/** The class's talent trees, kept like an icon: a class's trees do not change. */
async function playableClass(
  credentials: BattlenetCredentials,
  region: WowRegion,
  classId: number | undefined
): Promise<PlayableClassResponse | null> {
  if (!classId) return null
  const key = `wow_forever/class/${classId}`
  const cached = await pluginCacheGet(key)
  if (cached) {
    try {
      return JSON.parse(cached) as PlayableClassResponse
    } catch {
      // Unreadable: fetch it again below.
    }
  }
  try {
    const response = await getStatic<PlayableClassResponse>(credentials, region, `/data/wow/playable-class/${classId}`)
    const trees: PlayableClassResponse = {
      specializations: (response.specializations ?? []).map(({ id, name }) => ({ id, name })),
    }
    await pluginCachePut(key, JSON.stringify(trees))
    return trees
  } catch {
    return null
  }
}

export async function fetchWowForeverData(
  config: WowForeverConfig,
  dev = false,
  essentialConfig?: EssentialPluginConfig,
  previewMode = false
): Promise<WowForeverData> {
  const sections = config.sections ?? []
  const has = (id: string): boolean => sections.includes(id)
  const imageKind = characterImageOption(config)
  const wantsImage = has("character") && imageKind !== "none"
  const itemIcons = readOption<boolean>(config, "equipment_show_icons") !== false

  if (dev || previewMode)
    return mockData({ imageKind: wantsImage ? imageKind : "none", itemIcons, embed: !previewMode })

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
  // A part a character may not have yet (no media, no talents spent, no collection).
  const maybe = <T>(on: boolean, route: string): Promise<T | null> =>
    on ? optional(get<T>(route)) : Promise.resolve(null)
  const icon = (kind: IconKind) => (id: number) => iconFor(credentials, region, kind, id)

  const [
    media,
    pvp,
    equipment,
    statistics,
    lifetime,
    professions,
    reputations,
    specializations,
    achievements,
    mounts,
    pets,
    toys,
    classTrees,
  ] = await Promise.all([
    // Media lags the profile by hours after a character first appears: no picture yet.
    maybe<MediaResponse>(wantsImage, "/character-media"),
    maybe<PvpSummaryResponse>(has("character"), "/pvp-summary"),
    has("equipment") ? get<EquipmentResponse>("/equipment") : null,
    has("stats") ? get<StatisticsResponse>("/statistics") : null,
    maybe<AchievementStatisticsResponse>(STATISTICS_SECTIONS.some(has), "/achievements/statistics"),
    maybe<ProfessionsResponse>(has("professions"), "/professions"),
    maybe<ReputationsResponse>(has("reputations"), "/reputations"),
    maybe<SpecializationsResponse>(has("talents"), "/specializations"),
    maybe<AchievementsResponse>(has("achievements"), "/achievements"),
    maybe<MountsResponse>(has("collection"), "/collections/mounts"),
    maybe<PetsResponse>(has("collection"), "/collections/pets"),
    maybe<ToysResponse>(has("collection"), "/collections/toys"),
    has("talents") ? playableClass(credentials, region, profile.character_class?.id) : null,
  ])

  const achievementsMax = clampMax(readOption<number>(config, "achievements_max"), MAX_ACHIEVEMENTS)
  const [items, professionRows, talentRows, achievementRows] = await Promise.all([
    equipment ? (itemIcons ? withIcons(mapEquipment(equipment), icon("item")) : mapEquipment(equipment)) : [],
    professions ? withIcons(mapProfessions(professions), icon("profession")) : [],
    specializations
      ? withIcons(mapTalents(specializations, classTrees, profile.level), icon("playable-specialization"))
      : [],
    // Only the ones the section draws get an icon looked up.
    achievements ? withIcons(mapAchievements(achievements).slice(0, achievementsMax), icon("achievement")) : [],
  ])

  return {
    region,
    slug: ref.slug,
    character: mapCharacter(profile, pvp),
    image: wantsImage ? await embedImage(media, imageKind) : null,
    equipment: items.map((r) => withoutId(r)),
    stats: statistics ? mapStats(statistics) : [],
    journey: lifetime ? mapJourney(lifetime) : [],
    professions: professionRows.map((r) => withoutId(r)),
    reputations: reputations ? mapReputations(reputations) : [],
    talents: talentRows.map((r) => withoutId(r)),
    dungeons: lifetime ? mapDungeons(lifetime) : [],
    achievements: achievementRows.map((r) => withoutId(r)),
    collection: mapCollection(mounts, pets, toys),
  }
}
