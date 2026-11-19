/**
 * Lines of code the user added and deleted, from GitHub's contributor statistics.
 *
 * Idea from the `lines` plugin of lowlighter/metrics (MIT,
 * https://github.com/lowlighter/metrics/tree/master/source/plugins/lines): one
 * `GET /repos/{owner}/{repo}/stats/contributors` per repository, keeping the user's weeks.
 * Reimplemented here; no code copied.
 *
 * How the endpoint behaves (docs for API version 2022-11-28, the one Octokit 21 asks for,
 * read 18/11/2026; "REST API endpoints for repository statistics"):
 *
 * - The statistics are cached by the SHA of the default branch. On a cold cache GitHub
 *   answers 202 with an empty body and starts computing; asking again later gets the 200.
 *   Measured 18/11/2026 on 39 public repositories of jlevy, tj and kentcdodds: 18 answered
 *   202 first, and every one of them answered 200 within 1 to 3 s.
 * - 204 for an empty repository.
 * - Every addition and deletion is 0 in a repository with 10,000 commits or more
 *   (facebook/react, 19,158 commits: 0 lines). Such a repository is left out and counted,
 *   so the card does not draw its zeros as the user's work.
 * - Merge and empty commits are not counted, as on the repository's Insights > Contributors.
 *
 * Bounds: one GraphQL call for the repositories, then at most `lines_repositories_max` (50)
 * repositories, asked again only while they answer 202, at most `RETRY_DELAYS_MS.length`
 * times: 1 + 50 * 4 = 201 subrequests at worst, against the 10,000 of the paid plan. The
 * waits add up to 7 s, inside the card's 45 s budget.
 */

import type { graphql } from "@octokit/graphql"
import type { Octokit } from "@octokit/rest"
import type { GithubConfig, GithubData } from "../types"

type Lines = NonNullable<GithubData["lines"]>

/** Waits before asking again the repositories that answered 202, in order. */
export const RETRY_DELAYS_MS = [1000, 2000, 4000]
/** Weeks kept for the chart: the longest period it offers. */
export const HISTORY_WEEKS = 104
/** Requests in flight at once. */
const CONCURRENCY = 6
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

export const DEFAULT_LINES_REPOSITORIES = 20
export const MAX_LINES_REPOSITORIES = 50

const LINES_REPOSITORIES_QUERY = `
query linesRepositories($login: String!, $first: Int!, $privacy: RepositoryPrivacy) {
  user(login: $login) {
    repositories(
      first: $first
      ownerAffiliations: [OWNER]
      isFork: false
      orderBy: { field: PUSHED_AT, direction: DESC }
      privacy: $privacy
    ) {
      nodes {
        nameWithOwner
        isPrivate
        isEmpty
      }
    }
  }
}`

interface RepositoriesResult {
  user: {
    repositories: { nodes: Array<{ nameWithOwner: string; isPrivate: boolean; isEmpty: boolean } | null> }
  } | null
}

interface ContributorWeek {
  w: number
  a: number
  d: number
  c: number
}

interface ContributorStats {
  author: { login: string } | null
  total: number
  weeks: ContributorWeek[]
}

/** What one repository answered, once the retries are over. */
type RepositoryAnswer =
  | { status: "ready"; stats: ContributorStats[] }
  | { status: "pending" }
  | { status: "empty" }
  | { status: "failed" }

export interface LinesFetchOptions {
  /** Injected by the tests; a real wait otherwise. */
  wait?: (ms: number) => Promise<void>
  now?: Date
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

function repositoriesToQuery(config: GithubConfig): number {
  const max = Math.floor(Number(config.lines_repositories_max ?? DEFAULT_LINES_REPOSITORIES))
  if (!Number.isFinite(max)) return DEFAULT_LINES_REPOSITORIES
  return Math.min(Math.max(max, 1), MAX_LINES_REPOSITORIES)
}

/** Runs `task` over `items`, `limit` at a time, keeping the order. */
async function inPool<T, R>(items: T[], limit: number, task: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let next = 0
  const worker = async () => {
    while (next < items.length) {
      const i = next++
      results[i] = await task(items[i] as T)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

async function askContributorStats(rest: Octokit, nameWithOwner: string): Promise<RepositoryAnswer> {
  const [owner, repo] = nameWithOwner.split("/") as [string, string]
  try {
    const response = await rest.request("GET /repos/{owner}/{repo}/stats/contributors", { owner, repo })
    // Octokit types this endpoint as 200 only
    const status = response.status as number
    if (status === 202) return { status: "pending" }
    if (status === 204 || !Array.isArray(response.data)) return { status: "empty" }
    return { status: "ready", stats: response.data as ContributorStats[] }
  } catch (error) {
    const status = (error as { status?: number }).status
    // A rejected token fails the whole card (see isAuthError in fetchGithub.ts)
    if (status === 401) throw error
    console.warn(`[GitHub lines] ${nameWithOwner}: ${(error as Error).message}`)
    return { status: "failed" }
  }
}

/** Sunday 00:00 UTC of the week `date` is in: where GitHub starts its weeks. */
function weekStart(date: Date): number {
  const day = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  return day - date.getUTCDay() * 24 * 60 * 60 * 1000
}

export async function fetchLinesData(
  rest: Octokit,
  graphqlClient: ReturnType<typeof graphql.defaults>,
  username: string,
  config: GithubConfig,
  { wait = sleep, now = new Date() }: LinesFetchOptions = {}
): Promise<Lines> {
  const result = await graphqlClient<RepositoriesResult>(LINES_REPOSITORIES_QUERY, {
    login: username,
    first: repositoriesToQuery(config),
    // Unset asks for every repository the token can see
    privacy: config.repositories_use_private ? undefined : "PUBLIC",
  })
  if (!result.user) throw new Error(`GitHub has no user ${username}`)

  const repositories = result.user.repositories.nodes
    .filter((repo): repo is NonNullable<typeof repo> => repo !== null && !repo.isEmpty)
    // Asked for public ones only when the card leaves private repositories out, but a
    // token may still see more than it asked for.
    .filter((repo) => !repo.isPrivate || Boolean(config.repositories_use_private))
    .map((repo) => repo.nameWithOwner)

  const answers = new Map<string, RepositoryAnswer>()
  let toAsk = repositories
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length && toAsk.length > 0; attempt++) {
    if (attempt > 0) await wait(RETRY_DELAYS_MS[attempt - 1] as number)
    const round = await inPool(toAsk, CONCURRENCY, (name) => askContributorStats(rest, name))
    round.forEach((answer, i) => answers.set(toAsk[i] as string, answer))
    toAsk = toAsk.filter((name) => answers.get(name)?.status === "pending")
  }

  const login = username.toLowerCase()
  const weeks = new Map<number, { added: number; deleted: number }>()
  const perRepository: Lines["repositories"] = []
  let pending = 0
  let tooLarge = 0

  for (const name of repositories) {
    const answer = answers.get(name)
    if (answer?.status === "pending") pending++
    if (answer?.status !== "ready") continue

    const mine = answer.stats.find((stats) => stats.author?.login?.toLowerCase() === login)
    if (!mine) continue
    let added = 0
    let deleted = 0
    for (const week of mine.weeks) {
      added += week.a
      deleted += week.d
    }
    if (added + deleted === 0) {
      // Commits but no line anywhere in the repository: GitHub stops counting lines at
      // 10,000 commits.
      const anyLines = answer.stats.some((stats) => stats.weeks.some((week) => week.a + week.d > 0))
      if (mine.total > 0 && !anyLines) tooLarge++
      continue
    }
    for (const week of mine.weeks) {
      if (week.a + week.d === 0) continue
      const sum = weeks.get(week.w * 1000) ?? { added: 0, deleted: 0 }
      sum.added += week.a
      sum.deleted += week.d
      weeks.set(week.w * 1000, sum)
    }
    perRepository.push({ name, added, deleted })
  }

  // Every week of the period, the empty ones too, oldest first, ending with this one.
  const last = weekStart(now)
  const history: Lines["weeks"] = Array.from({ length: HISTORY_WEEKS }, (_, i) => {
    const start = last - (HISTORY_WEEKS - 1 - i) * WEEK_MS
    const sum = weeks.get(start) ?? { added: 0, deleted: 0 }
    return { date: new Date(start).toISOString().slice(0, 10), ...sum }
  })

  perRepository.sort((a, b) => b.added + b.deleted - (a.added + a.deleted))
  return {
    added: perRepository.reduce((sum, repo) => sum + repo.added, 0),
    deleted: perRepository.reduce((sum, repo) => sum + repo.deleted, 0),
    weeks: history,
    repositories: perRepository,
    queried: repositories.length,
    pending,
    tooLarge,
  }
}
