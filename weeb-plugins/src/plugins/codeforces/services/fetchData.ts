/**
 * Serviço de fetch de dados do Codeforces
 *
 * API: https://codeforces.com/api
 * Documentação: https://codeforces.com/apiHelp
 *
 * Rate Limit: ~5 requests per second per IP
 */

import type { CodeforcesConfig, CodeforcesData, CodeforcesSubmission } from "../types"
import { getMockCodeforcesData } from "./mock-data"
import { fetchJson } from "../../shared/utils/api"
import { ApiError, upstreamFailure } from "../../shared/utils/errors"

const CODEFORCES_API_BASE = "https://codeforces.com/api"

/**
 * Codeforces has no endpoint for the solved count, so it is counted from the
 * submission history. `count=100` counted only the last 100 submissions: tourist's
 * card said 72 while his profile says 3060.
 *
 * The whole history costs time, so it is asked for only when the card shows the solved
 * count: tourist's answered in 0.34 s for count=50 and 1.23 s for all 5,519
 * submissions (2026-11-16). The heaviest accounts measured (11-13k submissions) take
 * 1.7-5.2 s, 0.5 MB gzipped, under fetchJson's 8 s per attempt. It is one call rather
 * than pages because each page would be one more call against the API's rate limit
 * (see MIN_REQUEST_INTERVAL). The cap only bounds the payload of an outlier, and a
 * total counted from a capped history is marked as a lower bound.
 */
export const SUBMISSION_HISTORY_CAP = 20_000
const RECENT_SUBMISSIONS_LIMIT = 50

/**
 * A long history has letters up to U (tourist) and the numbered acmsguru problems.
 * Letters past H go under `I+` and anything that is not a letter under `Other`, so
 * the breakdown has at most ten groups.
 */
const LAST_SINGLE_DIFFICULTY = "H"
const LATER_DIFFICULTIES = "I+"
const OTHER_DIFFICULTIES = "Other"

/**
 * Spacing between this plugin's calls. Codeforces' API documentation asks for at most
 * one call every two seconds; this is 5 a second, what the plugin has always used.
 * Honouring the documented limit would add up to 4 s to every card (three calls), so
 * it is a known gap, not an oversight.
 */
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 200

/**
 * Aguarda o intervalo mínimo entre requisições (throttling)
 */
async function throttleRequest(): Promise<void> {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise((resolve) => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest))
  }

  lastRequestTime = Date.now()
}

/**
 * Resposta genérica da API do Codeforces
 */
interface CodeforcesApiResponse<T> {
  status: "OK" | "FAILED"
  result?: T
  comment?: string
}

/**
 * Resposta do endpoint user.info
 */
interface CodeforcesUserInfo {
  handle: string
  rating?: number
  rank?: string
  maxRating?: number
  maxRank?: string
  firstName?: string
  lastName?: string
  country?: string
  city?: string
  organization?: string
  contribution: number
  friendOfCount: number
  registrationTimeSeconds: number
  lastOnlineTimeSeconds: number
  titlePhoto: string
  avatar: string
}

/**
 * Resposta do endpoint user.rating
 */
interface CodeforcesRatingChange {
  contestId: number
  contestName: string
  handle: string
  rank: number
  ratingUpdateTimeSeconds: number
  oldRating: number
  newRating: number
}

/**
 * Resposta do endpoint user.status
 */
interface CodeforcesSubmissionResponse {
  id: number
  contestId?: number
  creationTimeSeconds: number
  relativeTimeSeconds: number
  problem: {
    contestId?: number
    problemsetName?: string
    index?: string
    name: string
    type: string
    points?: number
    rating?: number
    tags: string[]
  }
  author: {
    contestId?: number
    members: Array<{ handle: string }>
    participantType: string
    ghost: boolean
    room?: number
    startTimeSeconds?: number
  }
  programmingLanguage: string
  verdict: string
  testset: string
  passedTestCount: number
  timeConsumedMillis: number
  memoryConsumedBytes: number
}

/**
 * Converte veredicto do Codeforces para formato legível
 */
function formatVerdict(verdict: string): string {
  const verdictMap: Record<string, string> = {
    OK: "Accepted",
    WRONG_ANSWER: "Wrong Answer",
    TIME_LIMIT_EXCEEDED: "Time Limit Exceeded",
    MEMORY_LIMIT_EXCEEDED: "Memory Limit Exceeded",
    RUNTIME_ERROR: "Runtime Error",
    COMPILATION_ERROR: "Compilation Error",
    CHALLENGED: "Challenged",
    FAILED: "Failed",
    PARTIAL: "Partial",
    REJECTED: "Rejected",
  }
  return verdictMap[verdict] || verdict
}

function difficultyOf(index: string | undefined): string {
  const letter = index?.[0] ?? ""
  if (letter < "A" || letter > "Z") return OTHER_DIFFICULTIES
  return letter > LAST_SINGLE_DIFFICULTY ? LATER_DIFFICULTIES : letter
}

/**
 * Counts each accepted problem once, the way the profile's "problems solved for all
 * time" does, and puts each one in exactly one difficulty, so the breakdown sums to
 * the total.
 */
function countSolvedProblems(submissions: CodeforcesSubmissionResponse[]): CodeforcesData["problemsSolved"] {
  const solved = new Set<string>()
  const byDifficulty: Record<string, number> = {}

  for (const { verdict, problem } of submissions) {
    if (verdict !== "OK" || !problem.name) continue
    const key = `${problem.contestId ?? problem.problemsetName ?? "unknown"}-${problem.index ?? problem.name}`
    if (solved.has(key)) continue
    solved.add(key)
    const difficulty = difficultyOf(problem.index)
    byDifficulty[difficulty] = (byDifficulty[difficulty] || 0) + 1
  }

  return { total: solved.size, byDifficulty }
}

/**
 * Codeforces answers a handle that does not exist with HTTP 400 and
 * `{"status":"FAILED","comment":"handles: User with handle X not found"}`. Reported as
 * "API request failed: HTTP 400", it reached the public preview as a 502 instead of a 404.
 */
function saysHandleNotFound(error: ApiError): boolean {
  if (error.statusCode !== 400 || !error.responseBody) return false
  try {
    const { comment } = JSON.parse(error.responseBody) as CodeforcesApiResponse<unknown>
    return typeof comment === "string" && /\bnot found\b/i.test(comment)
  } catch {
    return false
  }
}

/**
 * Busca dados do Codeforces
 */
export async function fetchCodeforcesData(config: CodeforcesConfig, dev = false): Promise<CodeforcesData> {
  if (dev) {
    return getMockCodeforcesData()
  }

  if (!config.username || typeof config.username !== "string" || config.username.trim() === "") {
    throw new Error("Codeforces username (handle) is required. Please configure your username in the plugin settings.")
  }

  const handle = config.username.trim()

  try {
    // Buscar informações do usuário
    await throttleRequest()
    const userInfoUrl = `${CODEFORCES_API_BASE}/user.info?handles=${encodeURIComponent(handle)}`
    const userInfoResponse = await fetchJson<CodeforcesApiResponse<CodeforcesUserInfo[]>>(userInfoUrl)

    if (userInfoResponse.status !== "OK" || !userInfoResponse.result || userInfoResponse.result.length === 0) {
      throw new ApiError(userInfoResponse.comment || "User not found", 404, "Codeforces")
    }

    const userInfo = userInfoResponse.result?.[0]
    if (!userInfo) {
      throw new ApiError("User info not found in response", 404, "Codeforces")
    }

    // Buscar rating history
    await throttleRequest()
    const ratingUrl = `${CODEFORCES_API_BASE}/user.rating?handle=${encodeURIComponent(handle)}`
    const ratingResponse = await fetchJson<CodeforcesApiResponse<CodeforcesRatingChange[]>>(ratingUrl)

    const contestsCount = ratingResponse.result?.length || 0

    // The whole history only when the solved count is on the card, the newest few for
    // the recent list, and no call at all when neither is (the landing page's preview
    // shows only rating and contests).
    const sections = config.sections ?? []
    const countsSolved = sections.includes("problems_solved")
    let submissions: CodeforcesSubmissionResponse[] = []
    if (countsSolved || sections.includes("recent_submissions")) {
      const submissionsCount = countsSolved ? SUBMISSION_HISTORY_CAP : RECENT_SUBMISSIONS_LIMIT
      await throttleRequest()
      const submissionsUrl = `${CODEFORCES_API_BASE}/user.status?handle=${encodeURIComponent(handle)}&from=1&count=${submissionsCount}`
      const submissionsResponse = await fetchJson<CodeforcesApiResponse<CodeforcesSubmissionResponse[]>>(submissionsUrl)
      submissions = submissionsResponse.result ?? []
    }

    const recentSubmissions: CodeforcesSubmission[] = submissions
      .slice(0, RECENT_SUBMISSIONS_LIMIT)
      .map(({ problem, verdict, creationTimeSeconds }) => {
        const { name, contestId, index } = problem
        return {
          problem: contestId && index ? `${contestId}${index} - ${name}` : name,
          verdict: formatVerdict(verdict),
          date: new Date(creationTimeSeconds * 1000).toISOString(),
          contestId,
          index,
        }
      })

    return {
      rating: userInfo.rating || 0,
      rank: userInfo.rank || "Unrated",
      contestsCount,
      problemsSolved: {
        ...countSolvedProblems(submissions),
        capped: countsSolved && submissions.length >= SUBMISSION_HISTORY_CAP,
      },
      recentSubmissions,
    }
  } catch (error) {
    console.error("[Codeforces] Error fetching data:", error)

    if (error instanceof ApiError && (error.statusCode === 404 || saysHandleNotFound(error))) {
      throw new Error(`Codeforces user "${handle}" not found`)
    }

    throw upstreamFailure("Codeforces", error)
  }
}
