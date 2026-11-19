import {
  LIST,
  characterBodyHeight,
  equipmentBodyHeight,
  listBodyHeight,
  progressBodyHeight,
  statsBodyHeight,
  type Size,
  type Style,
} from "./layout"
import { MAX_ACHIEVEMENTS, MAX_EQUIPMENT, clampMax } from "./services/fetchData"
import type { WowForeverConfig, WowForeverData } from "./types"

export const SECTION_IDS = [
  "character",
  "equipment",
  "stats",
  "journey",
  "professions",
  "reputations",
  "talents",
  "dungeons",
  "achievements",
  "collection",
] as const
export type SectionId = (typeof SECTION_IDS)[number]

export const DEFAULT_TITLES: Record<SectionId, string> = {
  character: "Character",
  equipment: "Equipment",
  stats: "Attributes",
  journey: "Journey",
  professions: "Professions",
  reputations: "Reputations",
  talents: "Talents",
  dungeons: "Dungeons",
  achievements: "Achievements",
  collection: "Collection",
}

/** Each section's option keys, spelled out so they can be found (validate-config-options looks for them). */
const KEYS: Record<SectionId, { title: string; hide: string; max?: string }> = {
  character: { title: "character_title", hide: "character_hide_title" },
  equipment: { title: "equipment_title", hide: "equipment_hide_title", max: "equipment_max" },
  stats: { title: "stats_title", hide: "stats_hide_title" },
  journey: { title: "journey_title", hide: "journey_hide_title" },
  professions: { title: "professions_title", hide: "professions_hide_title" },
  reputations: { title: "reputations_title", hide: "reputations_hide_title", max: "reputations_max" },
  talents: { title: "talents_title", hide: "talents_hide_title" },
  dungeons: { title: "dungeons_title", hide: "dungeons_hide_title", max: "dungeons_max" },
  achievements: { title: "achievements_title", hide: "achievements_hide_title", max: "achievements_max" },
  collection: { title: "collection_title", hide: "collection_hide_title" },
}

/** Sections with a "max" option: its limit and its default (as in plugin.metadata.ts). */
export const MAXES: Partial<Record<SectionId, { limit: number; fallback: number }>> = {
  equipment: { limit: MAX_EQUIPMENT, fallback: MAX_EQUIPMENT },
  reputations: { limit: 15, fallback: 6 },
  dungeons: { limit: 20, fallback: 8 },
  achievements: { limit: MAX_ACHIEVEMENTS, fallback: 5 },
}

function read<T>(config: WowForeverConfig, key: string): T | undefined {
  return (config[key] ?? config.nonEssential?.[key]) as T | undefined
}

/**
 * The section options as the components and calculateHeight read them. Options arrive at
 * the root of the config; the PluginManager also copies them to `nonEssential`.
 */
export function resolveOptions(config: WowForeverConfig) {
  return {
    style: ((config as { style?: string }).style === "terminal" ? "terminal" : "default") as Style,
    title: (id: SectionId): string => read<string>(config, KEYS[id].title) || DEFAULT_TITLES[id],
    hideTitle: (id: SectionId): boolean => read<boolean>(config, KEYS[id].hide) === true,
    max: (id: SectionId): number => {
      const m = MAXES[id]
      const key = KEYS[id].max
      return m && key ? clampMax(read<number>(config, key), m.limit, m.fallback) : Number.POSITIVE_INFINITY
    },
  }
}

export type ResolvedOptions = ReturnType<typeof resolveOptions>

/** The collection's rows: one per kind the character has any of. */
export function collectionRows(data: WowForeverData): Array<{ kind: string; names: string[] }> {
  const c = data.collection
  return [
    { kind: "Mounts", names: c.mounts },
    { kind: "Pets", names: c.pets },
    { kind: "Toys", names: c.toys },
  ].filter((row) => row.names.length > 0)
}

/**
 * A section's body height, or null when it has nothing to draw (the section is then left
 * out of the card). The character sheet always draws.
 */
export function sectionBody(
  id: SectionId,
  data: WowForeverData,
  style: Style,
  size: Size,
  options: ResolvedOptions
): number | null {
  const count = (n: number): number | null => (n > 0 ? n : null)
  switch (id) {
    case "character":
      return characterBodyHeight(style, size, data)
    case "equipment": {
      const n = count(Math.min(data.equipment.length, options.max(id)))
      return n === null ? null : equipmentBodyHeight(style, size, n)
    }
    case "stats":
    case "journey": {
      const n = count((id === "stats" ? data.stats : data.journey).length)
      return n === null ? null : statsBodyHeight(style, size, n)
    }
    case "professions":
    case "talents": {
      const n = count(data[id].length)
      return n === null ? null : progressBodyHeight(style, size, n)
    }
    case "reputations": {
      const n = count(Math.min(data.reputations.length, options.max(id)))
      return n === null ? null : progressBodyHeight(style, size, n)
    }
    case "dungeons":
    case "achievements": {
      const n = count(Math.min(data[id].length, options.max(id)))
      return n === null ? null : listBodyHeight(style, n, LIST.columns[size])
    }
    case "collection": {
      const n = count(collectionRows(data).length)
      return n === null ? null : listBodyHeight(style, n, 1)
    }
  }
}
