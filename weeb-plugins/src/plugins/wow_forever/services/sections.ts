/**
 * From the Battle.net responses to what the sections draw, for the sections beyond the
 * character sheet. The shapes are the ones the Forever API returned on 19/11/2026 for a
 * level 31 character (responses saved while building the plugin); fields that may be
 * absent are optional.
 */

import type { WowAchievement, WowBossKill, WowCollection, WowProgress, WowStat } from "../types"

interface Named {
  name?: string
  id?: number
}

// ---------------------------------------------------------------- statistics

export interface StatisticsCategory {
  name?: string
  statistics?: Array<{ id?: number; name?: string; quantity?: number }>
  sub_categories?: StatisticsCategory[]
}

export interface AchievementStatisticsResponse {
  categories?: StatisticsCategory[]
}

function flatten(
  categories: StatisticsCategory[] = [],
  path: string[] = []
): Array<{ path: string[]; name: string; quantity: number }> {
  return categories.flatMap((category) => [
    ...(category.statistics ?? [])
      .filter((s) => s.name && typeof s.quantity === "number")
      .map((s) => ({ path: [...path, category.name ?? ""], name: s.name!, quantity: s.quantity! })),
    ...flatten(category.sub_categories, [...path, category.name ?? ""]),
  ])
}

/**
 * The lifetime numbers, in this order, by the statistic's English name (the API is asked
 * for en_US). Statistics the character has no entry for yet are left out.
 */
const JOURNEY: Array<[label: string, statistic: string]> = [
  ["Kills", "Total kills"],
  ["Deaths", "Total deaths"],
  ["Quests", "Quests completed"],
  ["Dungeons", "Total 5-player dungeons entered"],
  ["Killing blows", "Total Killing Blows"],
  ["Flight paths", "Flight paths taken"],
  ["Hearthstones", "Number of times hearthed"],
  ["Duels won", "Duels won"],
]

export function mapJourney(response: AchievementStatisticsResponse): WowStat[] {
  const byName = new Map<string, number>()
  for (const s of flatten(response.categories)) if (!byName.has(s.name)) byName.set(s.name, s.quantity)
  return JOURNEY.filter(([, name]) => byName.has(name)).map(([label, name]) => ({ label, value: byName.get(name)! }))
}

/** "Edwin VanCleef Kills (Deadmines)", "Bazzalan kills (Ragefire Chasm)". */
const BOSS_KILL = /^(.+?) kills \((.+)\)$/i

/** Bosses killed, from the "Boss Kills" statistics: most kills first. */
export function mapDungeons(response: AchievementStatisticsResponse): WowBossKill[] {
  return flatten(response.categories)
    .filter((s) => s.path.includes("Boss Kills") && s.quantity > 0)
    .flatMap((s) => {
      const match = s.name.match(BOSS_KILL)
      return match ? [{ boss: match[1]!, dungeon: match[2]!, kills: s.quantity }] : []
    })
    .sort((a, b) => b.kills - a.kills || a.boss.localeCompare(b.boss))
}

// ---------------------------------------------------------------- professions

interface ProfessionEntry {
  profession?: Named
  tiers?: Array<{ tier?: Named; skill_points?: number; max_skill_points?: number }>
  skill_points?: number
  max_skill_points?: number
}

export interface ProfessionsResponse {
  primaries?: ProfessionEntry[]
  secondaries?: ProfessionEntry[]
}

/** Primary professions, then secondary ones; icons are filled in by the caller. */
export function mapProfessions(response: ProfessionsResponse): Array<WowProgress & { id: number | undefined }> {
  return [...(response.primaries ?? []), ...(response.secondaries ?? [])].flatMap((entry) => {
    const tier = entry.tiers?.[entry.tiers.length - 1]
    const value = tier?.skill_points ?? entry.skill_points
    const max = tier?.max_skill_points ?? entry.max_skill_points
    const name = entry.profession?.name
    if (!name || typeof value !== "number" || !max) return []
    return [{ id: entry.profession?.id, name, icon: null, value, max, label: `${value} / ${max}` }]
  })
}

// ---------------------------------------------------------------- reputations

export interface ReputationsResponse {
  reputations?: Array<{
    faction?: Named
    standing?: { value?: number; max?: number; tier?: number; name?: string }
  }>
}

/** Highest standing first, then the furthest along it. */
export function mapReputations(response: ReputationsResponse): WowProgress[] {
  return (response.reputations ?? [])
    .flatMap((r) => {
      const name = r.faction?.name
      const standing = r.standing
      if (!name || !standing?.name) return []
      const max = standing.max ?? 0
      // Exalted has no next standing: its bar is full.
      const value = max > 0 ? Math.min(standing.value ?? 0, max) : 1
      return [{ name, icon: null, value, max: max > 0 ? max : 1, label: standing.name, tier: standing.tier ?? 0 }]
    })
    .sort((a, b) => (b.tier ?? 0) - (a.tier ?? 0) || b.value / b.max - a.value / a.max)
}

// ---------------------------------------------------------------- talents

export interface SpecializationsResponse {
  specialization_groups?: Array<{
    is_active?: boolean
    specializations?: Array<{ specialization?: Named; specialization_name?: string; spent_points?: number }>
  }>
}

export interface PlayableClassResponse {
  specializations?: Named[]
}

/** Talent points a Classic character has: one per level from 10, 51 at 60. */
export const talentPoints = (level: number): number => Math.max(0, Math.min(51, level - 9))

/**
 * Every tree of the class in the class's order, with the points the active group spent
 * in it ("22 / 0 / 0"). Without the class's list, the trees the group spent points in.
 */
export function mapTalents(
  response: SpecializationsResponse,
  playableClass: PlayableClassResponse | null,
  level: number
): Array<WowProgress & { id: number | undefined }> {
  const groups = response.specialization_groups ?? []
  const active = groups.find((g) => g.is_active) ?? groups[0]
  const spent = new Map<number | string, number>()
  for (const s of active?.specializations ?? []) {
    spent.set(s.specialization?.id ?? s.specialization_name ?? "", s.spent_points ?? 0)
  }
  const trees: Named[] = playableClass?.specializations?.length
    ? playableClass.specializations
    : (active?.specializations ?? []).map((s) => ({
        id: s.specialization?.id,
        name: s.specialization_name ?? s.specialization?.name,
      }))
  const max = Math.max(1, talentPoints(level))
  return trees.flatMap((tree) => {
    if (!tree.name) return []
    const points = spent.get(tree.id ?? tree.name) ?? spent.get(tree.name) ?? 0
    return [{ id: tree.id, name: tree.name, icon: null, value: points, max, label: String(points) }]
  })
}

// ---------------------------------------------------------------- achievements

export interface AchievementsResponse {
  achievements?: Array<{ achievement?: Named; completed_timestamp?: number; criteria?: { is_completed?: boolean } }>
}

/** Completed achievements, the latest first; icons are filled in by the caller. */
export function mapAchievements(response: AchievementsResponse): Array<WowAchievement & { id: number | undefined }> {
  return (response.achievements ?? [])
    .filter((a) => a.achievement?.name && typeof a.completed_timestamp === "number")
    .map((a) => ({
      id: a.achievement?.id,
      name: a.achievement!.name!,
      icon: null,
      completedAt: a.completed_timestamp!,
    }))
    .sort((a, b) => b.completedAt - a.completedAt)
}

// ---------------------------------------------------------------- collection

export interface MountsResponse {
  mounts?: Array<{ mount?: Named }>
}
export interface PetsResponse {
  pets?: Array<{ species?: Named }>
}
export interface ToysResponse {
  toys?: Array<{ toy?: Named }>
}

const names = (list: Array<Named | undefined>): string[] => [
  ...new Set(list.map((n) => n?.name).filter((n): n is string => Boolean(n))),
]

/** The collection endpoints leave a list out when the character has none of it. */
export function mapCollection(
  mounts: MountsResponse | null,
  pets: PetsResponse | null,
  toys: ToysResponse | null
): WowCollection {
  return {
    mounts: names((mounts?.mounts ?? []).map((m) => m.mount)),
    pets: names((pets?.pets ?? []).map((p) => p.species)),
    toys: names((toys?.toys ?? []).map((t) => t.toy)),
  }
}
