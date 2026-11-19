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
  slot: string
  name: string
  quality: ItemQuality
  itemLevel: number | null
}

export interface WowStat {
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
}
