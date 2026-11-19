import { graphql } from "@octokit/graphql"
import { Octokit } from "@octokit/rest"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { PluginManager } from "../../manager"
import type { GithubConfig } from "../types"
import { HISTORY_WEEKS, RETRY_DELAYS_MS, fetchLinesData } from "./fetchLines"

/**
 * The lines section against a fake GitHub that answers like the real one did on 18/11/2026:
 * a 202 with an empty body while it computes a repository's statistics (cold cache), a 204
 * for an empty repository, and 0 additions and deletions everywhere in a repository of
 * 10,000 commits or more (facebook/react).
 */

const NOW = new Date("2026-11-18T12:00:00Z")
// Sunday 00:00 UTC, in seconds, as GitHub writes `w`
const THIS_WEEK = Date.UTC(2026, 10, 15) / 1000
const WEEK = 7 * 24 * 60 * 60

const week = (weeksAgo: number, a: number, d: number, c = 1) => ({ w: THIS_WEEK - weeksAgo * WEEK, a, d, c })
const contributor = (login: string | null, weeks: ReturnType<typeof week>[]) => ({
  author: login ? { login } : null,
  total: weeks.reduce((sum, w) => sum + w.c, 0),
  weeks,
})

interface FakeRepo {
  name: string
  isPrivate?: boolean
  isEmpty?: boolean
  /** One per call; the last repeats. */
  answers: Response[]
}

function fakeGithub(repos: FakeRepo[]) {
  const calls: Record<string, number> = {}
  const graphqlBodies: Array<{ variables: Record<string, unknown> }> = []
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
    const request = input instanceof Request ? input : new Request(String(input), init)
    const url = new URL(request.url)
    if (url.pathname === "/graphql") {
      const body = (await request.json()) as { variables: Record<string, unknown> }
      graphqlBodies.push(body)
      return Response.json({
        data: {
          user: {
            repositories: {
              nodes: repos.map((r) => ({
                nameWithOwner: `octocat/${r.name}`,
                isPrivate: r.isPrivate ?? false,
                isEmpty: r.isEmpty ?? false,
              })),
            },
          },
        },
      })
    }
    const match = url.pathname.match(/^\/repos\/octocat\/([^/]+)\/stats\/contributors$/)
    const repo = repos.find((r) => r.name === match?.[1])
    if (!repo) throw new Error(`unexpected fetch: ${request.url}`)
    const n = calls[repo.name] ?? 0
    calls[repo.name] = n + 1
    return (repo.answers[Math.min(n, repo.answers.length - 1)] as Response).clone()
  })
  return { calls, graphqlBodies }
}

const computing = () => new Response("{}", { status: 202, headers: { "content-type": "application/json" } })
const ready = (stats: unknown) => Response.json(stats)

function clients() {
  const rest = new Octokit({ auth: "ghp_test" })
  const gql = graphql.defaults({ headers: { authorization: "token ghp_test" } })
  return { rest, gql }
}

const config = (extra: Partial<GithubConfig> = {}): GithubConfig => ({
  enabled: true,
  sections: ["lines"],
  username: "octocat",
  ...extra,
})

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {})
})
afterEach(() => vi.restoreAllMocks())

describe("fetchLinesData", () => {
  it("sums the user's weeks across repositories, and no one else's", async () => {
    fakeGithub([
      {
        name: "app",
        answers: [
          ready([
            // Login in another case than the config's
            contributor("OctoCat", [week(0, 100, 10), week(1, 50, 5), week(200, 1000, 0)]),
            contributor("someone", [week(0, 9999, 9999)]),
            contributor(null, [week(0, 7777, 7777)]),
          ]),
        ],
      },
      { name: "lib", answers: [ready([contributor("octocat", [week(0, 1, 2), week(3, 30, 40)])])] },
      { name: "theirs", answers: [ready([contributor("someone", [week(0, 5, 5)])])] },
    ])
    const { rest, gql } = clients()
    const wait = vi.fn(async () => {})

    const lines = await fetchLinesData(rest, gql, "octocat", config(), { wait, now: NOW })

    // The week 200 weeks ago counts in the total, outside the chart's 104 weeks
    expect(lines.added).toBe(100 + 50 + 1000 + 1 + 30)
    expect(lines.deleted).toBe(10 + 5 + 2 + 40)
    expect(lines.repositories).toEqual([
      { name: "octocat/app", added: 1150, deleted: 15 },
      { name: "octocat/lib", added: 31, deleted: 42 },
    ])
    expect(lines.weeks).toHaveLength(HISTORY_WEEKS)
    expect(lines.weeks.at(-1)).toEqual({ date: "2026-11-15", added: 101, deleted: 12 })
    expect(lines.weeks.at(-2)).toEqual({ date: "2026-11-08", added: 50, deleted: 5 })
    expect(lines.weeks.at(-4)).toEqual({ date: "2026-10-25", added: 30, deleted: 40 })
    expect(lines.weeks.at(-3)).toEqual({ date: "2026-11-01", added: 0, deleted: 0 })
    expect(lines.weeks[0]?.date).toBe("2024-11-24")
    expect({ queried: lines.queried, pending: lines.pending, tooLarge: lines.tooLarge }).toEqual({
      queried: 3,
      pending: 0,
      tooLarge: 0,
    })
    expect(wait).not.toHaveBeenCalled()
  })

  it("asks again, with a growing wait, only the repositories GitHub is still computing", async () => {
    const { calls } = fakeGithub([
      { name: "warm", answers: [ready([contributor("octocat", [week(0, 10, 1)])])] },
      // Cold cache: ready on the third call
      {
        name: "cold",
        answers: [computing(), computing(), ready([contributor("octocat", [week(0, 20, 2)])])],
      },
      // Never ready within one generation
      { name: "huge", answers: [computing()] },
    ])
    const { rest, gql } = clients()
    const waits: number[] = []

    const lines = await fetchLinesData(rest, gql, "octocat", config(), {
      wait: async (ms) => void waits.push(ms),
      now: NOW,
    })

    expect(waits).toEqual(RETRY_DELAYS_MS)
    expect(calls).toEqual({ warm: 1, cold: 3, huge: 1 + RETRY_DELAYS_MS.length })
    expect(lines.added).toBe(30)
    expect(lines.repositories.map((r) => r.name)).toEqual(["octocat/cold", "octocat/warm"])
    expect(lines.pending).toBe(1)
    expect(lines.queried).toBe(3)
  })

  it("stops waiting as soon as nothing is pending", async () => {
    fakeGithub([{ name: "cold", answers: [computing(), ready([contributor("octocat", [week(0, 1, 1)])])] }])
    const { rest, gql } = clients()
    const waits: number[] = []

    const lines = await fetchLinesData(rest, gql, "octocat", config(), {
      wait: async (ms) => void waits.push(ms),
      now: NOW,
    })

    expect(waits).toEqual([RETRY_DELAYS_MS[0]])
    expect(lines.pending).toBe(0)
  })

  it("leaves out a repository of 10,000+ commits, whose lines GitHub reports as 0", async () => {
    fakeGithub([
      {
        name: "react",
        answers: [ready([contributor("octocat", [week(0, 0, 0, 12)]), contributor("someone", [week(0, 0, 0, 500)])])],
      },
      // Commits with no line of their own in a repository that counts lines: not too large
      {
        name: "renames",
        answers: [ready([contributor("octocat", [week(0, 0, 0, 2)]), contributor("someone", [week(0, 5, 5)])])],
      },
      { name: "app", answers: [ready([contributor("octocat", [week(0, 3, 4)])])] },
    ])
    const { rest, gql } = clients()

    const lines = await fetchLinesData(rest, gql, "octocat", config(), { wait: async () => {}, now: NOW })

    expect(lines.tooLarge).toBe(1)
    expect(lines.repositories.map((r) => r.name)).toEqual(["octocat/app"])
    expect([lines.added, lines.deleted]).toEqual([3, 4])
  })

  it("skips empty, inaccessible and private repositories without waiting on them", async () => {
    const { calls, graphqlBodies } = fakeGithub([
      { name: "empty-flag", isEmpty: true, answers: [] },
      { name: "no-content", answers: [new Response(null, { status: 204 })] },
      { name: "gone", answers: [Response.json({ message: "Not Found" }, { status: 404 })] },
      { name: "secret", isPrivate: true, answers: [] },
      { name: "app", answers: [ready([contributor("octocat", [week(0, 3, 4)])])] },
    ])
    const { rest, gql } = clients()
    const wait = vi.fn(async () => {})

    const lines = await fetchLinesData(rest, gql, "octocat", config(), { wait, now: NOW })

    expect(calls).toEqual({ "no-content": 1, gone: 1, app: 1 })
    expect(graphqlBodies[0]?.variables).toMatchObject({ privacy: "PUBLIC", first: 20 })
    expect(lines.queried).toBe(3)
    expect(lines.pending).toBe(0)
    expect(wait).not.toHaveBeenCalled()
  })

  it("asks for private repositories only when the card includes them, and at most 50", async () => {
    const { calls, graphqlBodies } = fakeGithub([
      { name: "secret", isPrivate: true, answers: [ready([contributor("octocat", [week(0, 3, 4)])])] },
    ])
    const { rest, gql } = clients()

    const lines = await fetchLinesData(
      rest,
      gql,
      "octocat",
      config({ repositories_use_private: true, lines_repositories_max: 500 }),
      { wait: async () => {}, now: NOW }
    )

    expect(graphqlBodies[0]?.variables.first).toBe(50)
    expect(graphqlBodies[0]?.variables).not.toHaveProperty("privacy")
    expect(calls).toEqual({ secret: 1 })
    expect(lines.repositories).toHaveLength(1)
  })
})

describe("fetchGithub lines", () => {
  const github = () => PluginManager.getInstance().get("github")!

  it("reaches the card through the plugin", async () => {
    fakeGithub([{ name: "app", answers: [ready([contributor("octocat", [week(0, 3, 4)])])] }])

    const data = (await github().fetchData(config() as never, false, { pat: "ghp_test" })) as {
      lines?: { added: number; deleted: number }
    }

    expect(data.lines).toMatchObject({ added: 3, deleted: 4 })
  })

  it("fails the card when GitHub rejects the token", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async () =>
      Response.json({ message: "Bad credentials" }, { status: 401 })
    )

    await expect(github().fetchData(config() as never, false, { pat: "ghp_revoked" })).rejects.toThrow(
      /rejected the token/
    )
  })
})
