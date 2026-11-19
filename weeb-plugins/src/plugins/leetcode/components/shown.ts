/**
 * What each LeetCode section shows, shared by the components and calculateHeight so the
 * height counts the same rows the section draws.
 */

import type { LeetCodeConfig, LeetCodeData, LeetCodeLanguage, LeetCodeSkill, LeetCodeSubmission } from "../types"

export const DEFAULT_SKILLS_MAX = 10
export const DEFAULT_LANGUAGES_MAX = 5
export const DEFAULT_RECENT_MAX = 5

function options(config: LeetCodeConfig) {
  return config.nonEssential ?? {}
}

function positive(value: unknown, fallback: number): number {
  const n = Number(value)
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : fallback
}

export function hiddenTitle(value: unknown): boolean {
  return value === true || value === "true"
}

/**
 * `skills_ignored` is comma-separated and case-insensitive. A category name
 * (fundamental, intermediate, advanced) drops every tag in it, as in metrics.
 */
export function shownSkills(data: Pick<LeetCodeData, "skills"> | undefined, config: LeetCodeConfig): LeetCodeSkill[] {
  const ignored = new Set(
    String(options(config).skills_ignored ?? "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  )
  return (data?.skills ?? [])
    .filter((skill) => !ignored.has(skill.name.toLowerCase()) && !ignored.has(skill.category))
    .slice(0, positive(options(config).skills_max, DEFAULT_SKILLS_MAX))
}

export function shownLanguages(
  data: Pick<LeetCodeData, "languages"> | undefined,
  config: LeetCodeConfig
): LeetCodeLanguage[] {
  return (data?.languages ?? []).slice(0, positive(options(config).languages_max, DEFAULT_LANGUAGES_MAX))
}

export function shownRecent(
  data: Pick<LeetCodeData, "recent"> | undefined,
  config: LeetCodeConfig
): LeetCodeSubmission[] {
  return (data?.recent ?? []).slice(0, positive(options(config).recent_max, DEFAULT_RECENT_MAX))
}
