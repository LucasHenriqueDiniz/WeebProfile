/**
 * World of Warcraft: Forever plugin types.
 *
 * Forever has no realms: a character is a first name and a surname, unique per region.
 */

import type { BasePluginConfig, NonEssentialPluginConfig } from "../shared/types/base"

/** The regions the Battle.net API serves Forever in. China has its own API and is not one of them. */
export const WOW_REGIONS = ["us", "eu", "kr", "tw"] as const
export type WowRegion = (typeof WOW_REGIONS)[number]

/** What the character section draws beside the info: the full-body render, the portrait, or nothing. */
export type CharacterImage = "render" | "avatar" | "none"

export interface WowForeverOptions {
  /** "Name Surname", "name-surname" or the character's armory link. */
  character?: string
  region?: string
  character_title?: string
  character_hide_title?: boolean
  character_image?: CharacterImage
  equipment_title?: string
  equipment_hide_title?: boolean
  equipment_max?: number
  stats_title?: string
  stats_hide_title?: boolean
  equipment_show_icons?: boolean
  journey_title?: string
  journey_hide_title?: boolean
  professions_title?: string
  professions_hide_title?: boolean
  reputations_title?: string
  reputations_hide_title?: boolean
  reputations_max?: number
  talents_title?: string
  talents_hide_title?: boolean
  dungeons_title?: string
  dungeons_hide_title?: boolean
  dungeons_max?: number
  achievements_title?: string
  achievements_hide_title?: boolean
  achievements_max?: number
  collection_title?: string
  collection_hide_title?: boolean
  /** Names to leave out, compared without case. */
  professions_hide?: string[]
  reputations_hide?: string[]
  /** `journey_show_<key>`, `stats_show_<key>`, `equipment_show_<slot>`: see options.ts. */
  [key: `${string}_show_${string}`]: boolean | undefined
}

export interface WowForeverNonEssentialConfig extends NonEssentialPluginConfig, WowForeverOptions {}

export interface WowForeverConfig extends BasePluginConfig, WowForeverOptions {
  nonEssential?: WowForeverNonEssentialConfig
  [key: string]: any // Index signature for compatibility with PluginConfig
}

/** Item quality as the API names it (`quality.type`). */
export type ItemQuality = "POOR" | "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY" | "ARTIFACT" | "HEIRLOOM"

export interface WowCharacter {
  name: string
  surname: string
  level: number
  race: string
  className: string
  faction: string
  guild: string | null
  ruleset: string | null
  averageItemLevel: number | null
  honorableKills: number | null
}

export interface WowItem {
  /** The API's slot type ("HEAD", "FINGER_1"): what the per-slot options name. */
  slotType: string
  slot: string
  name: string
  quality: ItemQuality
  itemLevel: number | null
  /** Data URI, or null when the section draws no icons or the API has none. */
  icon: string | null
}

/** A row with a bar: a profession's skill, a reputation's standing, a talent tree's points. */
export interface WowProgress {
  name: string
  icon: string | null
  value: number
  max: number
  /** What the row prints at its end: "81 / 150", "Honored", "22". */
  label: string
  /** Reputation standing tier, 0 (Hated) to 7 (Exalted): the bar takes its color. */
  tier?: number
}

export interface WowBossKill {
  boss: string
  dungeon: string
  kills: number
}

export interface WowAchievement {
  name: string
  icon: string | null
  /** Unix ms. */
  completedAt: number
}

export interface WowCollection {
  mounts: string[]
  pets: string[]
  toys: string[]
}

export interface WowStat {
  /** Stable id ("kills", "health"): what the per-field options name. */
  key: string
  label: string
  value: number
}

export interface WowForeverData {
  region: WowRegion
  /** `{name}-{surname}` in lowercase, as the API and the armory address the character. */
  slug: string
  character: WowCharacter
  /**
   * The picture the character section draws, as a data URI, and which one it is. Null
   * when the section is off, the image is set to none, or Blizzard has not rendered the
   * character yet (media lags the profile by hours).
   */
  image: { kind: "render" | "avatar"; src: string } | null
  equipment: WowItem[]
  stats: WowStat[]
  /** Lifetime numbers from the statistics: kills, deaths, quests, dungeons, travel. */
  journey: WowStat[]
  professions: WowProgress[]
  reputations: WowProgress[]
  /** The active talent group: every tree of the class, with the points spent in it. */
  talents: WowProgress[]
  dungeons: WowBossKill[]
  achievements: WowAchievement[]
  collection: WowCollection
}
