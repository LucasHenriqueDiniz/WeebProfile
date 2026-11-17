import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { PluginManager } from "../../manager"
import type { GithubRepoData } from "../types"
import { buildStarHistory, starHistoryPageCount, type StarHistoryWeek } from "./star-history"

const DAY = 86_400
const WEEK = 7 * DAY

describe("starHistoryPageCount", () => {
  it("reaches back to the creation week (sindresorhus/ky spans 429 weeks, 15 pages)", () => {
    expect(starHistoryPageCount("2018-09-04T16:26:42Z", Date.parse("2026-11-17T23:00:00Z"))).toBe(15)
  })

  it("asks for one page for a repository created this week", () => {
    expect(starHistoryPageCount("2026-11-16T10:00:00Z", Date.parse("2026-11-17T23:00:00Z"))).toBe(1)
  })

  it("stops at the endpoint's 100-page limit", () => {
    expect(starHistoryPageCount("1950-01-01T00:00:00Z", Date.parse("2026-11-17T23:00:00Z"))).toBe(100)
  })
})

describe("buildStarHistory", () => {
  // Tuesday 2026-11-17; its week started on Sunday 2026-11-15.
  const now = Date.parse("2026-11-17T12:00:00Z")
  const thisWeek = Date.parse("2026-11-15T00:00:00Z") / 1000

  it("starts at the first star, skips days after today and ends on stargazerCount", () => {
    const weeks: StarHistoryWeek[] = [
      // newest first, as the endpoint answers
      { week: thisWeek, total: 2, days: [0, 0, 2, 0, 0, 0, 0] },
      { week: thisWeek - WEEK, total: 3, days: [0, 3, 0, 0, 0, 0, 0] },
      { week: thisWeek - 2 * WEEK, total: 0, days: [0, 0, 0, 0, 0, 0, 0] },
    ]

    const points = buildStarHistory(weeks, 6, now)

    expect(points[0]).toEqual({ date: "2026-11-09T00:00:00.000Z", count: 3 })
    expect(points[points.length - 1]).toEqual({ date: "2026-11-17T00:00:00.000Z", count: 6 })
    expect(points).toHaveLength(9) // 9 days from the first star through today
  })

  it("samples ten points evenly spaced in time, not in star count", () => {
    // 100 stars on the first day, then one a day for 99 days
    const days = Array.from({ length: 100 }, (_, i) => (i === 0 ? 100 : 1))
    const first = thisWeek - 15 * WEEK
    const weeks: StarHistoryWeek[] = []
    for (let w = 0; w < 15; w++) {
      weeks.push({ week: first + w * WEEK, total: 0, days: days.slice(w * 7, w * 7 + 7) })
    }

    const points = buildStarHistory(weeks, 199, now)

    expect(points).toHaveLength(10)
    const gaps = points.slice(1).map((p, i) => (Date.parse(p.date) - Date.parse(points[i]!.date)) / (DAY * 1000))
    expect(Math.max(...gaps) - Math.min(...gaps)).toBeLessThanOrEqual(1)
    // Even spacing in star count would put the second point near star 22; by time it is ~111.
    expect(points[1]!.count).toBeGreaterThan(100)
  })

  it("returns nothing for a repository without stars", () => {
    expect(buildStarHistory([{ week: thisWeek, total: 0, days: [0, 0, 0, 0, 0, 0, 0] }], 0, now)).toEqual([])
  })
})

describe("github_repo star history without being a collaborator", () => {
  // Since July 2026 /stargazers answers 404 to anyone who is not an admin or
  // collaborator, which is every repository the token's account does not own.
  const requests: string[] = []
  const weekStart = (t: number) => {
    const d = new Date(t)
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - d.getUTCDay()) / 1000
  }
  const currentWeek = weekStart(Date.now())
  // 41 weeks, newest first, one star each Sunday
  const weeks: StarHistoryWeek[] = Array.from({ length: 41 }, (_, i) => ({
    week: currentWeek - i * WEEK,
    total: 1,
    days: [1, 0, 0, 0, 0, 0, 0],
  }))
  let failPage: number | null = null

  beforeEach(() => {
    requests.length = 0
    failPage = null
    for (const level of ["log", "warn", "error", "debug"] as const)
      vi.spyOn(console, level).mockImplementation(() => {})
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input instanceof Request ? input.url : input)
      requests.push(url)
      if (url === "https://api.github.com/graphql") {
        return Response.json({
          data: {
            repository: {
              name: "react",
              // facebook/react was transferred: GraphQL answers with the new name
              nameWithOwner: "react/react",
              description: null,
              url: "https://github.com/react/react",
              createdAt: new Date((currentWeek - 40 * WEEK) * 1000 + 3600_000).toISOString(),
              owner: { login: "react", avatarUrl: "" },
              primaryLanguage: null,
              stargazerCount: 41,
              forkCount: 0,
              openIssuesCount: { totalCount: 0 },
              watchers: { totalCount: 0 },
              licenseInfo: null,
              repositoryTopics: { nodes: [] },
              languages: { totalSize: 0, edges: [] },
            },
          },
        })
      }
      const history = url.match(/\/repos\/react\/react\/stargazers\/history\?per_page=30&page=(\d+)$/)
      if (history) {
        const page = Number(history[1])
        if (page === failPage) return Response.json({ message: "Server Error" }, { status: 502 })
        return Response.json(weeks.slice((page - 1) * 30, page * 30))
      }
      return Response.json({ message: "Not Found" }, { status: 404 })
    })
  })
  afterEach(() => vi.restoreAllMocks())

  const fetchCard = async () =>
    (await PluginManager.getInstance()
      .get("github_repo")!
      .fetchData({ enabled: true, sections: ["star_graph"], owner: "facebook", repo: "react" } as never, false, {
        pat: "ghp_x",
      })) as unknown as GithubRepoData

  it("reads the history endpoint for every page back to the creation week", async () => {
    const data = await fetchCard()

    expect(requests.filter((u) => u.includes("/stargazers"))).toEqual([
      "https://api.github.com/repos/react/react/stargazers/history?per_page=30&page=1",
      "https://api.github.com/repos/react/react/stargazers/history?per_page=30&page=2",
    ])
    expect(data.starHistory).toHaveLength(10)
    expect(data.starHistory[0]!.count).toBe(1)
    expect(data.starHistory[9]!.count).toBe(41)
  })

  it("drops the whole history when a page fails, and still returns the card", async () => {
    failPage = 2

    const data = await fetchCard()

    expect(data.stargazerCount).toBe(41)
    expect(data.starHistory).toEqual([])
  })
})
