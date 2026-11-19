/**
 * LeetCode plugin types
 */

import type { BasePluginConfig, NonEssentialPluginConfig } from "../shared/types/base"

export type LeetCodeDifficulty = "Easy" | "Medium" | "Hard"

/** LeetCode groups its problem tags in three levels; `skills_ignored` takes these too. */
export type LeetCodeSkillCategory = "fundamental" | "intermediate" | "advanced"

export interface LeetCodeDifficultyCount {
  difficulty: LeetCodeDifficulty
  /** Problems of this difficulty the user has an accepted submission for. */
  solved: number
  /** Problems of this difficulty on LeetCode. */
  total: number
}

export interface LeetCodeSkill {
  name: string
  category: LeetCodeSkillCategory
  solved: number
}

export interface LeetCodeLanguage {
  name: string
  solved: number
}

export interface LeetCodeSubmission {
  title: string
  slug: string
  /** ISO 8601. */
  date: string
}

export interface LeetCodeNonEssentialConfig extends NonEssentialPluginConfig {
  solved_title?: string
  solved_hide_title?: boolean
  skills_title?: string
  skills_hide_title?: boolean
  skills_max?: number
  /** Comma-separated tag names or categories (fundamental, intermediate, advanced). */
  skills_ignored?: string
  languages_title?: string
  languages_hide_title?: boolean
  languages_max?: number
  recent_title?: string
  recent_hide_title?: boolean
  recent_max?: number
}

export interface LeetCodeConfig extends BasePluginConfig {
  username?: string
  nonEssential?: LeetCodeNonEssentialConfig
  [key: string]: unknown
}

export interface LeetCodeData {
  username: string
  solved: {
    total: number
    /** Every problem on LeetCode. */
    questions: number
    byDifficulty: LeetCodeDifficultyCount[]
  }
  /** Most solved first. */
  skills: LeetCodeSkill[]
  /** Most solved first. */
  languages: LeetCodeLanguage[]
  /** Newest first, up to RECENT_SUBMISSIONS_LIMIT. */
  recent: LeetCodeSubmission[]
}
