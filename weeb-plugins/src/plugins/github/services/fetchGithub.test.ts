import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { PluginManager } from "../../manager"
import type { GithubData } from "../types"

/**
 * A GitHub card whose sections cannot be fetched must fail, not ship as blank space.
 * With a revoked PAT the plugin used to set every section to empty and return
 * normally: the generator answered 200 with hasErrors=false and a 354px card holding
 * no visible text, and the dashboard published it over the last good one.
 */

const github = () => PluginManager.getInstance().get("github")!

const card = (sections: string[]) => ({ enabled: true, sections, username: "octocat" })

function githubAnswers(respond: () => Response) {
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    const url = String(input instanceof Request ? input.url : input)
    if (url.startsWith("https://api.github.com/")) return respond()
    throw new Error(`unexpected fetch: ${url}`)
  })
}

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {})
  vi.spyOn(console, "warn").mockImplementation(() => {})
  vi.spyOn(console, "error").mockImplementation(() => {})
})
afterEach(() => vi.restoreAllMocks())

describe("fetchGithub with a token GitHub rejects", () => {
  it.each([[["favorite_languages"]], [["favorite_languages", "top_repositories", "starred_repositories"]]])(
    "fails the plugin instead of returning empty sections (%j)",
    async (sections) => {
      githubAnswers(() => Response.json({ message: "Bad credentials" }, { status: 401 }))

      await expect(github().fetchData(card(sections) as never, false, { pat: "ghp_revoked" })).rejects.toThrow(
        /rejected the token.*revoked/
      )
    }
  )
})

describe("fetchGithub with a token missing a section's scope", () => {
  it("fails the plugin with the scope the section needs", async () => {
    githubAnswers(() =>
      Response.json({
        data: null,
        errors: [{ type: "FORBIDDEN", message: "Resource not accessible by personal access token" }],
      })
    )

    await expect(
      github().fetchData(card(["favorite_languages"]) as never, false, { pat: "ghp_narrow" })
    ).rejects.toThrow(/favorite_languages/)
  })
})

/**
 * Code habits from a fake GitHub: push events in three repositories, the commits in
 * them, and the repositories' primary languages. "gone" was deleted, so GraphQL fails
 * its alias and answers the others. Each commit touches 3 files and 15 lines, so a
 * count of lines cannot pass for a count of files.
 */
describe("fetchGithub code_habits", () => {
  const recent = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  let pushedAt = recent
  afterEach(() => {
    pushedAt = recent
  })
  const COMMITS: Record<string, string[]> = { app: ["a1", "a2", "a3"], dotfiles: ["d1"], gone: ["g1"] }
  const LANGUAGES: Record<string, { name: string; color: string } | null> = {
    app: { name: "TypeScript", color: "#3178c6" },
    dotfiles: { name: "Lua", color: "#000080" },
    gone: null,
  }

  function fakeGithub(commit: (sha: string) => Response) {
    const calls: string[] = []
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const request = input instanceof Request ? input : new Request(String(input), init)
      const url = new URL(request.url)
      calls.push(url.pathname)
      if (url.pathname === "/users/octocat/events/public") {
        return Response.json(
          Object.keys(COMMITS).map((repo, i) => ({
            id: String(i),
            type: "PushEvent",
            actor: { login: "octocat" },
            repo: { name: `octocat/${repo}` },
            created_at: pushedAt,
            payload: { before: `before-${repo}`, head: `head-${repo}` },
          }))
        )
      }
      const compare = url.pathname.match(/^\/repos\/octocat\/([^/]+)\/compare\//)
      if (compare) return Response.json({ commits: (COMMITS[compare[1] ?? ""] ?? []).map((sha) => ({ sha })) })
      const sha = url.pathname.match(/^\/repos\/octocat\/[^/]+\/commits\/([^/]+)$/)
      if (sha) return commit(sha[1] ?? "")
      if (url.pathname === "/graphql") {
        const { variables } = (await request.json()) as { variables: Record<string, string> }
        const data: Record<string, unknown> = {}
        const errors: unknown[] = []
        for (const [key, name] of Object.entries(variables).filter(([k]) => k.startsWith("n"))) {
          const alias = `r${key.slice(1)}`
          const language = LANGUAGES[name]
          data[alias] = language ? { primaryLanguage: language } : null
          if (!language) errors.push({ type: "NOT_FOUND", path: [alias], message: "Could not resolve to a Repository" })
        }
        return Response.json(errors.length ? { data, errors } : { data })
      }
      return Response.json({ message: "Not Found" }, { status: 404 })
    })
    return calls
  }

  const readable = () => Response.json({ stats: { additions: 10, deletions: 5, total: 15 }, files: [{}, {}, {}] })
  const habits = async (options: Record<string, unknown> = {}) => {
    const data = (await github().fetchData({ ...card(["code_habits"]), ...options } as never, false, {
      pat: "ghp_test",
    })) as unknown as GithubData
    return data.codeHabits
  }

  it("counts files changed, not lines", async () => {
    fakeGithub(readable)
    const { commitStats, analyzedCommits } = await habits()
    expect(analyzedCommits).toBe(5)
    expect(commitStats).toEqual({ averageChangesPerCommit: 15, totalFilesChanged: 15, largestCommit: 15 })
  })

  it("credits each commit to its repository's language, skipping a repository GraphQL cannot resolve", async () => {
    fakeGithub(readable)
    const { languages } = await habits()
    expect(languages).toEqual({
      TypeScript: { count: 3, color: "#3178c6" },
      Lua: { count: 1, color: "#000080" },
    })
  })

  it("leaves the stats out when no commit could be read, instead of reporting zeros", async () => {
    fakeGithub(() => Response.json({ message: "Server Error" }, { status: 500 }))
    const { commitStats, analyzedCommits, commitsByDay } = await habits()
    expect(commitStats).toBeUndefined()
    // The charts still count the 5 pushed commits.
    expect(analyzedCommits).toBe(5)
    expect(Object.values(commitsByDay).reduce((a, b) => a + b, 0)).toBe(5)
  })

  it("counts the hour and weekday of each push on the card's time zone, not the server's", async () => {
    // Two days ago at 01:30 UTC: 22:30 of the day before in São Paulo.
    const pushed = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    pushed.setUTCHours(1, 30, 0, 0)
    pushedAt = pushed.toISOString()
    const weekday = (date: Date, timeZone: string) => date.toLocaleDateString("en-US", { weekday: "long", timeZone })

    fakeGithub(readable)
    const utc = await habits()
    expect(utc.commitsByHour).toEqual({ 1: 5 })
    expect(utc.commitsByDay).toEqual({ [weekday(pushed, "UTC")]: 5 })
    expect(utc.timeZoneLabel).toBe("UTC")

    const brazil = await habits({ code_habits_timezone: "America/Sao_Paulo" })
    expect(brazil.commitsByHour).toEqual({ 22: 5 })
    expect(brazil.commitsByDay).toEqual({ [weekday(pushed, "America/Sao_Paulo")]: 5 })
    expect(weekday(pushed, "America/Sao_Paulo")).not.toBe(weekday(pushed, "UTC"))
    expect(brazil).toMatchObject({ timeZone: "America/Sao_Paulo", timeZoneLabel: "UTC-3" })
  })

  it("counts each push by weekday and hour together, for the punch card", async () => {
    const pushed = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    pushed.setUTCHours(1, 30, 0, 0)
    pushedAt = pushed.toISOString()
    const day = pushed.toLocaleDateString("en-US", { weekday: "long", timeZone: "America/Sao_Paulo" })

    fakeGithub(readable)
    const { commitsByDayHour } = await habits({ code_habits_timezone: "America/Sao_Paulo" })
    expect(Object.keys(commitsByDayHour ?? {})).toEqual([day])
    expect(commitsByDayHour?.[day]?.[22]).toBe(5)
    expect(commitsByDayHour?.[day]?.reduce((a, b) => a + b, 0)).toBe(5)
  })

  it("stops reading commits once the Worker's subrequest cap is hit", async () => {
    const calls = fakeGithub(() => {
      throw new Error("Too many subrequests.")
    })
    const { commitStats } = await habits()
    expect(commitStats).toBeUndefined()
    // No GraphQL call after the cap: it would fail the same way.
    expect(calls.filter((p) => p === "/graphql")).toHaveLength(0)
  })
})

/**
 * The card is public. A token with the repo scope makes GitHub return private
 * repositories in the sections that do not query by privacy; their names must stay
 * off the card unless "Include private repositories" is on.
 */
describe("fetchGithub with private repositories in GitHub's answer", () => {
  const SECTIONS = ["favorite_languages", "top_repositories", "starred_repositories", "notable_contributions"]

  const repo = (name: string, isPrivate: boolean) => ({
    isPrivate,
    name,
    nameWithOwner: `octocat/${name}`,
    description: null,
    url: `https://github.com/octocat/${name}`,
    stargazerCount: 3,
    forkCount: 0,
    primaryLanguage: null,
    updatedAt: "2026-11-01T00:00:00Z",
    languages: { edges: [{ size: 100, node: { name: isPrivate ? "SecretLang" : "TypeScript", color: "#000" } }] },
  })
  const both = [repo("public-app", false), repo("private-app", true)]
  const ANSWERS: Record<string, unknown> = {
    userLanguages: { user: { repositories: { nodes: both } } },
    userTopRepositories: { user: { topRepositories: { nodes: both } } },
    userStarredRepositories: { user: { starredRepositories: { totalCount: 2, nodes: both } } },
    userRecentActivity: {
      user: {
        contributionsCollection: {
          commitContributionsByRepository: both.map((repository) => ({ repository, contributions: { totalCount: 5 } })),
        },
      },
    },
  }

  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const request = input instanceof Request ? input : new Request(String(input), init)
      if (new URL(request.url).pathname !== "/graphql") throw new Error(`unexpected fetch: ${request.url}`)
      const { query } = (await request.json()) as { query: string }
      const operation = query.match(/query\s+(\w+)/)?.[1] ?? ""
      const answer = JSON.stringify(ANSWERS[operation] ?? { user: {} })
      // Like GitHub, answer only the fields the query asks for.
      const data = query.includes("isPrivate") ? answer : answer.replace(/"isPrivate":(true|false),/g, "")
      return Response.json({ data: JSON.parse(data) })
    })
  })

  const fetchCard = async (extra: Record<string, unknown> = {}) =>
    JSON.stringify(await github().fetchData({ ...card(SECTIONS), ...extra } as never, false, { pat: "ghp_test" }))

  it("leaves private repositories off the card by default", async () => {
    const data = await fetchCard()
    expect(data).toContain("public-app")
    expect(data).not.toMatch(/private-app|SecretLang/)
  })

  it("shows them when Include private repositories is on", async () => {
    const data = await fetchCard({ repositories_use_private: true })
    expect(data).toContain("private-app")
    expect(data).toContain("SecretLang")
  })
})

/**
 * A fake GitHub that answers a contribution calendar for exactly the range asked for, as the
 * real one does: from `from` to `to`, across the new year, the first and last weeks cut at the
 * edges, one contribution a day. Without `to` it answers the year after `from`.
 */
describe("fetchGithub calendar, last 6 months", () => {
  const DAY = 86_400_000
  const asked: Array<{ from?: string; to?: string }> = []

  function calendarBetween(from: string, to: string) {
    const weeks: Array<{ contributionDays: Array<Record<string, unknown>> }> = []
    for (let day = Date.parse(from.slice(0, 10)); day <= Date.parse(to.slice(0, 10)); day += DAY) {
      const weekday = new Date(day).getUTCDay()
      if (weeks.length === 0 || weekday === 0) weeks.push({ contributionDays: [] })
      weeks.at(-1)!.contributionDays.push({
        date: new Date(day).toISOString().slice(0, 10),
        weekday,
        contributionCount: 1,
        color: "#40c463",
      })
    }
    const totalContributions = weeks.reduce((sum, week) => sum + week.contributionDays.length, 0)
    return { totalContributions, weeks }
  }

  beforeEach(() => {
    asked.length = 0
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const request = input instanceof Request ? input : new Request(String(input), init)
      if (new URL(request.url).pathname !== "/graphql") throw new Error(`unexpected fetch: ${request.url}`)
      const { variables = {} } = (await request.json()) as { variables?: { from?: string; to?: string } }
      asked.push({ from: variables.from, to: variables.to })
      const from = variables.from ?? new Date(Date.now() - 365 * DAY).toISOString()
      const to = variables.to ?? new Date(Date.parse(from) + 365 * DAY).toISOString()
      return Response.json({
        data: { user: { contributionsCollection: { contributionCalendar: calendarBetween(from, to) } } },
      })
    })
  })
  afterEach(() => vi.useRealTimers())

  async function sixMonthsCalendar(today: string) {
    vi.setSystemTime(new Date(`${today}T12:00:00Z`))
    const data = (await github().fetchData(
      { ...card(["calendar"]), calendar_year_mode: "last_6_months" } as never,
      false,
      { pat: "ghp_test" }
    )) as unknown as GithubData
    const days = data.calendar.weeks.flatMap((week) => week.contributionDays.map((day) => day.date))
    return { calendar: data.calendar, days }
  }

  // Six months before March reach into the previous year.
  it("reaches into the previous year in the first half of the year", async () => {
    const { calendar, days } = await sixMonthsCalendar("2026-03-10")
    expect(days[0]).toBe("2025-09-10")
    expect(days.at(-1)).toBe("2026-03-10")
    expect(calendar.totalContributions).toBe(days.length)
    expect(calendar.years).toBeUndefined()
  })

  // GitHub draws the rest of the year as empty days when asked for it.
  it("stops at today, with no empty future weeks", async () => {
    const { calendar, days } = await sixMonthsCalendar("2026-11-17")
    expect(days[0]).toBe("2026-05-17")
    expect(days.at(-1)).toBe("2026-11-17")
    expect(calendar.totalContributions).toBe(days.length)
  })

  it("asks GitHub for the range in one query, ending now", async () => {
    await sixMonthsCalendar("2026-03-10")
    const ranged = asked.filter((range) => range.from)
    expect(ranged).toEqual([{ from: "2025-09-10T00:00:00.000Z", to: "2026-03-10T12:00:00.000Z" }])
  })
})
