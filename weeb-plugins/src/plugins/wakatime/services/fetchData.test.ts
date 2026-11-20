import { afterEach, describe, expect, it, vi } from "vitest"
import { fetchWakaTimeData, rangesFor } from "./fetchData"

const TOKEN = "waka-test-token"

/** The fields WakaTime answers with, trimmed to what the plugin reads. */
const statsBody = (overrides: Record<string, unknown> = {}) => ({
  data: {
    range: "last_7_days",
    human_readable_range: "last 7 days",
    is_up_to_date: true,
    total_seconds: 7200,
    total_seconds_including_other_language: 7500,
    daily_average: 1028,
    best_day: { date: "2026-11-16", total_seconds: 3600 },
    languages: [
      { name: "Python", total_seconds: 2400 },
      { name: "TypeScript", total_seconds: 4800 },
      { name: "Other", total_seconds: 300 },
    ],
    projects: [{ name: "weeb-profile", total_seconds: 7500 }],
    editors: [{ name: "VS Code", total_seconds: 7500 }],
    operating_systems: [{ name: "Mac", total_seconds: 7500 }],
    ...overrides,
  },
})

type Reply = { status: number; body: unknown }

/**
 * Answers the stats URLs from `stats` in order and the color catalogs from `catalog`, and
 * records every call.
 */
function mockWakaTime(stats: Reply[], catalog: Record<string, Reply> = {}) {
  const calls: Array<{ url: string; headers: Headers }> = []
  const queue = [...stats]
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
    const url = String(input)
    calls.push({ url, headers: new Headers(init?.headers) })
    const path = new URL(url).pathname.replace("/api/v1", "")
    const reply = path.startsWith("/users/") ? queue.shift() : (catalog[path] ?? { status: 200, body: { data: [] } })
    if (!reply) throw new Error(`unexpected request ${url}`)
    return new Response(JSON.stringify(reply.body), { status: reply.status }) as never
  })
  return calls
}

const config = (sections: string[], options: Record<string, unknown> = {}) => ({ sections, ...options })

afterEach(() => vi.restoreAllMocks())

describe("fetchWakaTimeData", () => {
  it("200: maps the stats, items sorted by time, with the token in the header and not the URL", async () => {
    const calls = mockWakaTime([{ status: 200, body: statsBody() }])

    const data = await fetchWakaTimeData(config(["time", "languages"]), false, TOKEN)

    const stats = data.stats.last_7_days!
    expect(stats).toMatchObject({
      range: "last_7_days",
      humanReadableRange: "last 7 days",
      isUpToDate: true,
      totalSeconds: 7200,
      dailyAverageSeconds: 1028,
      bestDay: { date: "2026-11-16", seconds: 3600 },
    })
    expect(stats.languages.map((l) => l.name)).toEqual(["TypeScript", "Python", "Other"])

    const statsCall = calls.find((c) => c.url.includes("/users/current/stats/last_7_days"))!
    expect(statsCall.headers.get("Authorization")).toBe(`Bearer ${TOKEN}`)
    expect(calls.every((c) => !c.url.includes(TOKEN))).toBe(true)
  })

  it("colors languages and editors from WakaTime's catalogs, case-insensitively", async () => {
    mockWakaTime([{ status: 200, body: statsBody() }], {
      "/program_languages": { status: 200, body: { data: [{ name: "typescript", color: "#3178c6" }] } },
      "/editors": { status: 200, body: { data: [{ name: "VS Code", color: "#007acc" }] } },
    })

    const stats = (await fetchWakaTimeData(config(["languages", "editors"]), false, TOKEN)).stats.last_7_days!

    expect(stats.languages.find((l) => l.name === "TypeScript")?.color).toBe("#3178c6")
    expect(stats.languages.find((l) => l.name === "Python")?.color).toBeUndefined()
    expect(stats.editors[0]?.color).toBe("#007acc")
  })

  it("still draws when a color catalog fails", async () => {
    mockWakaTime([{ status: 200, body: statsBody() }], {
      "/program_languages": { status: 500, body: {} },
    })

    const stats = (await fetchWakaTimeData(config(["languages"]), false, TOKEN)).stats.last_7_days!
    expect(stats.languages).toHaveLength(3)
  })

  it("asks once per distinct range the sections use", async () => {
    const calls = mockWakaTime([
      { status: 200, body: statsBody() },
      { status: 200, body: statsBody({ range: "all_time", human_readable_range: "since Mar 3 2021" }) },
    ])

    const data = await fetchWakaTimeData(
      config(["time", "languages", "projects"], { projects_range: "all_time" }),
      false,
      TOKEN
    )

    const statsUrls = calls.filter((c) => c.url.includes("/users/")).map((c) => new URL(c.url).pathname)
    expect(statsUrls.sort()).toEqual([
      "/api/v1/users/current/stats/all_time",
      "/api/v1/users/current/stats/last_7_days",
    ])
    expect(Object.keys(data.stats).sort()).toEqual(["all_time", "last_7_days"])
  })

  it("falls back to the last 7 days for a range WakaTime does not have", () => {
    expect(rangesFor(config(["time"], { time_range: "last_2_days" }))).toEqual(["last_7_days"])
  })

  it("202: waits and asks again, and uses the fresh answer", async () => {
    const calls = mockWakaTime([
      { status: 202, body: statsBody({ is_up_to_date: false, total_seconds: 100 }) },
      { status: 200, body: statsBody() },
    ])

    const stats = (await fetchWakaTimeData(config(["time"]), false, TOKEN, false, { staleRetryDelayMs: 1 })).stats
      .last_7_days!

    expect(calls.filter((c) => c.url.includes("/users/"))).toHaveLength(2)
    expect(stats).toMatchObject({ isUpToDate: true, totalSeconds: 7200 })
  })

  it("202 twice: draws the last numbers WakaTime had, marked as not up to date", async () => {
    mockWakaTime([
      { status: 202, body: statsBody({ is_up_to_date: false }) },
      { status: 202, body: statsBody({ is_up_to_date: false, total_seconds: 7100 }) },
    ])

    const stats = (await fetchWakaTimeData(config(["time"]), false, TOKEN, false, { staleRetryDelayMs: 1 })).stats
      .last_7_days!

    expect(stats).toMatchObject({ isUpToDate: false, totalSeconds: 7100 })
  })

  it("202 twice with nothing computed: fails, so the previous card stays", async () => {
    const empty = statsBody({
      is_up_to_date: false,
      total_seconds: 0,
      total_seconds_including_other_language: 0,
      languages: [],
    })
    mockWakaTime([
      { status: 202, body: empty },
      { status: 202, body: empty },
    ])

    await expect(fetchWakaTimeData(config(["time"]), false, TOKEN, false, { staleRetryDelayMs: 1 })).rejects.toThrow(
      /WakaTime.*202/
    )
  })

  it.each([401, 403])("%i: says the token was refused and points to the personal token", async (status) => {
    mockWakaTime([{ status, body: { error: "Unauthorized" } }])

    await expect(fetchWakaTimeData(config(["time"]), false, TOKEN)).rejects.toThrow(
      new RegExp(`WakaTime.*HTTP ${status}.*wakatime.com/oauth`)
    )
  })

  it("404: names the status", async () => {
    mockWakaTime([{ status: 404, body: { error: "Not found." } }])

    await expect(fetchWakaTimeData(config(["time"]), false, TOKEN)).rejects.toThrow(/WakaTime.*HTTP 404/)
  })

  it("429: rejects naming the provider and status, never returning mock data", async () => {
    mockWakaTime([{ status: 429, body: { error: "Too many requests" } }])

    await expect(fetchWakaTimeData(config(["time"]), false, TOKEN)).rejects.toThrow(/WakaTime.*429/)
  })

  it("never puts the token in an error message", async () => {
    mockWakaTime([{ status: 401, body: { error: `bad token ${TOKEN}` } }])

    const error = await fetchWakaTimeData(config(["time"]), false, TOKEN).catch((e: Error) => e)
    expect(String(error)).not.toContain(TOKEN)
  })

  it("without a token: fails before any request", async () => {
    const calls = mockWakaTime([])

    await expect(fetchWakaTimeData(config(["time"]), false, "  ")).rejects.toThrow(/token is required/)
    expect(calls).toHaveLength(0)
  })

  it("dev and preview: mock data, no request", async () => {
    const calls = mockWakaTime([])

    expect((await fetchWakaTimeData(config(["time"]), true)).stats.last_7_days).toBeDefined()
    expect((await fetchWakaTimeData(config(["time"]), false, undefined, true)).stats.last_7_days).toBeDefined()
    expect(calls).toHaveLength(0)
  })
})
