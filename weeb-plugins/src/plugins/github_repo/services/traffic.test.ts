import { afterEach, describe, expect, it, vi } from "vitest"
import { PluginManager } from "../../manager"
import type { GithubRepoData } from "../types"
import { buildTrafficSeries, fetchTraffic, TRAFFIC_DAYS } from "./traffic"

// GitHub's answer for LucasHenriqueDiniz/WeebProfile on 19/11/2026: 14 days, 05/11 to 18/11.
const NOW = Date.parse("2026-11-19T15:00:00Z")
const day = (d: number) => new Date(Date.UTC(2026, 10, d)).toISOString().replace(".000Z", "Z")

function viewsBody(entries: Array<[number, number, number]>, count: number, uniques: number) {
  return { count, uniques, views: entries.map(([d, c, u]) => ({ timestamp: day(d), count: c, uniques: u })) }
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } })

/** Answers each traffic path with its body; records the URLs asked. */
function mockGithub(routes: Record<string, () => Response>) {
  const asked: string[] = []
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      asked.push(url)
      const route = Object.keys(routes).find((path) => url.endsWith(`/traffic/${path}`))
      return route ? routes[route]!() : json({ message: "Not Found" }, 404)
    })
  )
  return asked
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("buildTrafficSeries", () => {
  it("keeps GitHub's 14 days and its totals", () => {
    const entries = Array.from({ length: 14 }, (_, i): [number, number, number] => [
      5 + i,
      i === 3 ? 1 : 0,
      i === 3 ? 1 : 0,
    ])
    const series = buildTrafficSeries(viewsBody(entries, 13, 4), "views", NOW)

    expect(series.days).toHaveLength(TRAFFIC_DAYS)
    expect(series.days[0]!.date).toBe("2026-11-05T00:00:00.000Z")
    expect(series.days[13]!.date).toBe("2026-11-18T00:00:00.000Z")
    expect(series.days[3]).toEqual({ date: "2026-11-08T00:00:00.000Z", count: 1, uniques: 1 })
    // The totals are GitHub's, not a sum of the days.
    expect(series).toMatchObject({ count: 13, uniques: 4 })
  })

  it("fills the days GitHub leaves out with 0, ending on yesterday", () => {
    const series = buildTrafficSeries(viewsBody([[10, 5, 2]], 5, 2), "views", NOW)

    expect(series.days.map((d) => d.date.slice(5, 10))).toEqual(
      Array.from({ length: 14 }, (_, i) => `11-${String(5 + i).padStart(2, "0")}`)
    )
    expect(series.days.filter((d) => d.count > 0)).toEqual([{ date: "2026-11-10T00:00:00.000Z", count: 5, uniques: 2 }])
  })

  it("moves the window to today when GitHub already answers today", () => {
    const series = buildTrafficSeries(viewsBody([[19, 3, 1]], 3, 1), "views", NOW)
    expect(series.days[0]!.date).toBe("2026-11-06T00:00:00.000Z")
    expect(series.days[13]).toEqual({ date: "2026-11-19T00:00:00.000Z", count: 3, uniques: 1 })
  })
})

describe("fetchTraffic", () => {
  const off = { clones: false, referrers: false, paths: false }
  const all = { clones: true, referrers: true, paths: true }

  it("200: the views, clones, referrers and paths the section shows", async () => {
    const asked = mockGithub({
      views: () => json(viewsBody([[18, 9, 3]], 9, 3)),
      clones: () => json({ count: 4, uniques: 2, clones: [{ timestamp: day(17), count: 4, uniques: 2 }] }),
      "popular/referrers": () => json([{ referrer: "Google", count: 1, uniques: 1 }]),
      "popular/paths": () => json([{ path: "/o/r", title: "Overview", count: 9, uniques: 3 }]),
    })

    const traffic = await fetchTraffic("o/r", "ghp_test", all, NOW)

    expect(asked.map((u) => u.replace("https://api.github.com/repos/o/r/traffic/", "")).sort()).toEqual([
      "clones",
      "popular/paths",
      "popular/referrers",
      "views",
    ])
    expect(traffic.views).toMatchObject({ count: 9, uniques: 3 })
    expect(traffic.views.days[13]).toEqual({ date: "2026-11-18T00:00:00.000Z", count: 9, uniques: 3 })
    expect(traffic.clones?.days[12]).toEqual({ date: "2026-11-17T00:00:00.000Z", count: 4, uniques: 2 })
    expect(traffic.referrers).toEqual([{ referrer: "Google", count: 1, uniques: 1 }])
    expect(traffic.paths).toEqual([{ path: "/o/r", title: "Overview", count: 9, uniques: 3 }])
  })

  it("asks only for the views when nothing else is on", async () => {
    const asked = mockGithub({ views: () => json(viewsBody([], 0, 0)) })
    const traffic = await fetchTraffic("o/r", "ghp_test", off, NOW)
    expect(asked).toEqual(["https://api.github.com/repos/o/r/traffic/views"])
    expect(traffic).toMatchObject({ clones: null, referrers: null, paths: null })
  })

  it("empty window: 14 days of 0 and empty lists", async () => {
    mockGithub({
      views: () => json({ count: 0, uniques: 0, views: [] }),
      clones: () => json({ count: 0, uniques: 0, clones: [] }),
      "popular/referrers": () => json([]),
      "popular/paths": () => json([]),
    })
    const traffic = await fetchTraffic("o/r", "ghp_test", all, NOW)
    expect(traffic.views.count).toBe(0)
    expect(traffic.views.days).toHaveLength(14)
    expect(traffic.views.days.every((d) => d.count === 0 && d.uniques === 0)).toBe(true)
    expect(traffic.referrers).toEqual([])
    expect(traffic.paths).toEqual([])
  })

  it("403 without push access (classic token): says what the token needs", async () => {
    // GitHub's body for facebook/react with a classic `repo` token, 19/11/2026.
    mockGithub({
      views: () =>
        json(
          {
            message: "Must have push access to repository",
            documentation_url: "https://docs.github.com/rest/metrics/traffic#get-page-views",
            status: "403",
          },
          403
        ),
    })
    await expect(fetchTraffic("facebook/react", "ghp_test", off, NOW)).rejects.toThrow(
      /^Traffic needs push access to facebook\/react: a 'repo' token, or fine-grained with Administration \(read\)/
    )
  })

  it("403 from a fine-grained token without the Administration permission", async () => {
    mockGithub({ views: () => json({ message: "Resource not accessible by personal access token" }, 403) })
    await expect(fetchTraffic("o/r", "github_pat_test", off, NOW)).rejects.toThrow(/needs push access/)
  })

  it("another error keeps GitHub's status and message", async () => {
    mockGithub({ views: () => json({ message: "API rate limit exceeded" }, 403) })
    await expect(fetchTraffic("o/r", "ghp_test", off, NOW)).rejects.toThrow(
      "GitHub traffic (views): HTTP 403 API rate limit exceeded"
    )
  })
})

describe("github_repo fetchData and the traffic section", () => {
  const plugin = PluginManager.getInstance().get("github_repo")!
  const repository = {
    name: "r",
    nameWithOwner: "o/r",
    description: null,
    url: "https://github.com/o/r",
    createdAt: "2020-01-01T00:00:00Z",
    owner: { login: "o", avatarUrl: "" },
    primaryLanguage: null,
    stargazerCount: 3,
    forkCount: 0,
    openIssuesCount: { totalCount: 0 },
    watchers: { totalCount: 0 },
    licenseInfo: null,
    repositoryTopics: { nodes: [] },
    languages: { totalSize: 0, edges: [] },
  }

  /** GraphQL answers the repository; REST answers the traffic, or 403 without push access. */
  function mockApi(trafficStatus: 200 | 403) {
    const asked: string[] = []
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input)
        asked.push(url)
        if (url.endsWith("/graphql")) return json({ data: { repository } })
        if (url.includes("/traffic/")) {
          return trafficStatus === 200
            ? json(viewsBody([[18, 2, 1]], 2, 1))
            : json({ message: "Must have push access to repository" }, 403)
        }
        return json([])
      })
    )
    return asked
  }

  // Options at the root of the config, as the dashboard stores them.
  const config = (sections: string[], options: Record<string, unknown> = {}) =>
    ({ ...plugin.config, enabled: true, owner: "o", repo: "r", sections, ...options }) as never

  it("fetches the traffic only when the section is on", async () => {
    const asked = mockApi(200)
    const data = (await plugin.fetchData(config(["stats"]), false, { pat: "ghp_test" })) as unknown as GithubRepoData
    expect(asked.some((u) => u.includes("/traffic/"))).toBe(false)
    expect(data.traffic).toBeNull()
  })

  it("a traffic card skips the star history and reads the options at the root", async () => {
    const asked = mockApi(200)
    const data = (await plugin.fetchData(config(["traffic"], { traffic_show_referrers: true }), false, {
      pat: "ghp_test",
    })) as unknown as GithubRepoData
    expect(asked.some((u) => u.includes("/stargazers/"))).toBe(false)
    expect(asked.filter((u) => u.includes("/traffic/")).map((u) => u.split("/traffic/")[1])).toEqual([
      "views",
      "popular/referrers",
    ])
    expect(data.traffic?.views.count).toBe(2)
  })

  it("throws the push-access message, not the generic permission one", async () => {
    mockApi(403)
    await expect(plugin.fetchData(config(["traffic"]), false, { pat: "ghp_test" })).rejects.toThrow(/needs push access/)
  })
})
