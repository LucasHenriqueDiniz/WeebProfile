/**
 * LeetCode data, from leetcode.com's public GraphQL endpoint (no key, public profiles).
 *
 * The fields are the ones lowlighter/metrics' leetcode plugin asks for, in four queries
 * (source/plugins/leetcode/queries/*.graphql), merged here into one request:
 *
 *   MIT License, Copyright (c) 2020-present lowlighter
 *   https://github.com/lowlighter/metrics/blob/master/LICENSE.md
 *
 * Measured 18/11/2026 from a Worker on this account (`wrangler dev --remote`, colo POA):
 * 32 of 32 requests answered 200, with no User-Agent and with ours. AniList blocks Workers
 * with 403; LeetCode, also behind Cloudflare, did not.
 */

import type {
  LeetCodeConfig,
  LeetCodeData,
  LeetCodeDifficulty,
  LeetCodeDifficultyCount,
  LeetCodeSkill,
  LeetCodeSkillCategory,
} from "../types"
import { getMockLeetCodeData } from "./mock-data"
import { fetchJson } from "../../shared/utils/api"
import { upstreamFailure } from "../../shared/utils/errors"

export const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql"

/** `recentAcSubmissionList` answers at most 20, whatever `limit` asks (measured 18/11/2026). */
export const RECENT_SUBMISSIONS_LIMIT = 20

const DIFFICULTIES: LeetCodeDifficulty[] = ["Easy", "Medium", "Hard"]
const SKILL_CATEGORIES: LeetCodeSkillCategory[] = ["fundamental", "intermediate", "advanced"]

/** The recent list is its own root field, asked for only when the card shows it. */
function buildQuery(withRecent: boolean): string {
  return `query LeetCode($username: String!${withRecent ? ", $limit: Int!" : ""}) {
  allQuestionsCount { difficulty count }
  matchedUser(username: $username) {
    username
    languageProblemCount { languageName problemsSolved }
    tagProblemCounts {
      advanced { tagName problemsSolved }
      intermediate { tagName problemsSolved }
      fundamental { tagName problemsSolved }
    }
    submitStatsGlobal { acSubmissionNum { difficulty count } }
  }${withRecent ? "\n  recentAcSubmissionList(username: $username, limit: $limit) { title titleSlug timestamp }" : ""}
}`
}

interface DifficultyCount {
  difficulty: string
  count: number
}

interface TagCount {
  tagName: string
  problemsSolved: number
}

interface LeetCodeResponse {
  data?: {
    allQuestionsCount?: DifficultyCount[]
    matchedUser?: {
      username: string
      languageProblemCount?: Array<{ languageName: string; problemsSolved: number }>
      tagProblemCounts?: Partial<Record<LeetCodeSkillCategory, TagCount[]>>
      submitStatsGlobal?: { acSubmissionNum?: DifficultyCount[] }
    } | null
    recentAcSubmissionList?: Array<{ title: string; titleSlug: string; timestamp: string }> | null
  } | null
  errors?: Array<{ message?: string; path?: string[] }>
}

/**
 * An unknown username answers HTTP 200 with
 * `{"errors":[{"message":"That user does not exist.","path":["matchedUser"]}],"data":{"matchedUser":null}}`.
 */
function saysUserDoesNotExist(response: LeetCodeResponse): boolean {
  return (response.errors ?? []).some((e) => /does not exist/i.test(e.message ?? ""))
}

function countOf(list: DifficultyCount[] | undefined, difficulty: string): number {
  return list?.find((d) => d.difficulty === difficulty)?.count ?? 0
}

export function toLeetCodeData(response: LeetCodeResponse, username: string): LeetCodeData {
  const user = response.data?.matchedUser
  if (!user) throw new Error("LeetCode answered without the user")

  const questions = response.data?.allQuestionsCount
  const accepted = user.submitStatsGlobal?.acSubmissionNum
  const byDifficulty: LeetCodeDifficultyCount[] = DIFFICULTIES.map((difficulty) => ({
    difficulty,
    solved: countOf(accepted, difficulty),
    total: countOf(questions, difficulty),
  }))

  const skills: LeetCodeSkill[] = SKILL_CATEGORIES.flatMap((category) =>
    (user.tagProblemCounts?.[category] ?? []).map(({ tagName, problemsSolved }) => ({
      name: tagName,
      category,
      solved: problemsSolved,
    }))
  )
    .filter((skill) => skill.solved > 0)
    .sort((a, b) => b.solved - a.solved)

  const languages = (user.languageProblemCount ?? [])
    .map(({ languageName, problemsSolved }) => ({ name: languageName, solved: problemsSolved }))
    .filter((language) => language.solved > 0)
    .sort((a, b) => b.solved - a.solved)

  const recent = (response.data?.recentAcSubmissionList ?? []).map(({ title, titleSlug, timestamp }) => ({
    title,
    slug: titleSlug,
    date: new Date(Number(timestamp) * 1000).toISOString(),
  }))

  return {
    username: user.username || username,
    solved: {
      total: countOf(accepted, "All"),
      questions: countOf(questions, "All"),
      byDifficulty,
    },
    skills,
    languages,
    recent,
  }
}

export async function fetchLeetCodeData(config: LeetCodeConfig, dev = false): Promise<LeetCodeData> {
  if (dev) {
    return getMockLeetCodeData()
  }

  if (!config.username || typeof config.username !== "string" || config.username.trim() === "") {
    throw new Error("LeetCode username is required. Please configure your username in the plugin settings.")
  }

  const username = config.username.trim()
  const withRecent = (config.sections ?? []).includes("recent")

  let response: LeetCodeResponse
  try {
    response = await fetchJson<LeetCodeResponse>(LEETCODE_GRAPHQL_URL, {
      method: "POST",
      body: {
        query: buildQuery(withRecent),
        variables: withRecent ? { username, limit: RECENT_SUBMISSIONS_LIMIT } : { username },
      },
    })
  } catch (error) {
    console.error("[LeetCode] Error fetching data:", error)
    throw upstreamFailure("LeetCode", error)
  }

  if (saysUserDoesNotExist(response)) {
    throw new Error(`LeetCode user "${username}" not found`)
  }

  if (!response.data?.matchedUser) {
    const reason = response.errors?.[0]?.message ?? "no user in the answer"
    throw upstreamFailure("LeetCode", new Error(reason))
  }

  return toLeetCodeData(response, username)
}
