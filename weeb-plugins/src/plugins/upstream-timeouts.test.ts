import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { PluginManager } from "./manager"

/**
 * Steam, Lyfta and the GitHub clients called their APIs with no timeout, so a hung
 * upstream held the whole generation. Every request they make must carry a signal.
 */

const calls: Array<{ url: string; signal: AbortSignal | null | undefined }> = []

beforeEach(() => {
  calls.length = 0
  for (const level of ["log", "warn", "error", "debug"] as const) vi.spyOn(console, level).mockImplementation(() => {})
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
    const url = String(input instanceof Request ? input.url : input)
    calls.push({ url, signal: init?.signal ?? (input instanceof Request ? input.signal : undefined) })
    return Response.json({ message: "Bad credentials" }, { status: 401 })
  })
})
afterEach(() => vi.restoreAllMocks())

const plugin = (name: string) => PluginManager.getInstance().get(name)!

describe.each([
  ["steam", { enabled: true, sections: ["recent_games"] }, { apiKey: "k", steamId: "76561197960287930" }],
  ["lyfta", { enabled: true, sections: ["statistics"] }, { apiKey: "k" }],
  ["github", { enabled: true, sections: ["favorite_languages"], username: "octocat" }, { pat: "ghp_x" }],
  [
    "github_repo",
    { enabled: true, sections: ["stats", "star_graph"], owner: "octocat", repo: "hello-world" },
    { pat: "ghp_x" },
  ],
])("%s", (name, config, secrets) => {
  it("puts a signal on every upstream request", async () => {
    await plugin(name)
      .fetchData(config as never, false, secrets)
      .catch(() => undefined)

    expect(calls.length).toBeGreaterThan(0)
    expect(calls.filter((c) => !(c.signal instanceof AbortSignal)).map((c) => c.url)).toEqual([])
  })
})

describe("requests to APIs that refuse an anonymous client", () => {
  // Dev.to and the Stack Exchange API answer 403 without a User-Agent, and a Worker's
  // fetch sends none.
  it.each([
    ["devto", { enabled: true, sections: ["profile"], username: "someone" }],
    ["stackoverflow", { enabled: true, sections: ["reputation"], userId: "22656" }],
  ])("%s sends a User-Agent", async (name, config) => {
    const agents: Array<string | null> = []
    vi.mocked(globalThis.fetch).mockImplementation(async (input, init) => {
      agents.push(new Headers(init?.headers).get("User-Agent"))
      return Response.json({}, { status: 404 })
    })

    await plugin(name)
      .fetchData(config as never, false, {})
      .catch(() => undefined)

    expect(agents.length).toBeGreaterThan(0)
    expect(agents.every((agent) => agent?.startsWith("WeebProfile/"))).toBe(true)
  })
})

describe("stackoverflow URLs", () => {
  // `/users?ids=` ignores ids and lists the top users (every card got Jon Skeet), and
  // `/users/{id}/tags&...` had no `?` and was a 400 for everyone.
  it("asks for the configured user and their tags by path", async () => {
    const urls: string[] = []
    vi.mocked(globalThis.fetch).mockImplementation(async (input) => {
      const url = String(input instanceof Request ? input.url : input)
      urls.push(url)
      return url.includes("/tags")
        ? Response.json({ items: [{ tag_name: "c#", answer_score: 1, question_score: 1 }] })
        : Response.json({
            items: [
              {
                user_id: 1,
                display_name: "Jeff Atwood",
                reputation: 1,
                badge_counts: { gold: 0, silver: 0, bronze: 0 },
              },
            ],
          })
    })

    await plugin("stackoverflow").fetchData(
      { enabled: true, sections: ["reputation"], userId: "1" } as never,
      false,
      {}
    )

    expect(urls.map((u) => new URL(u).pathname)).toEqual(["/2.3/users/1", "/2.3/users/1/tags"])
    expect(urls.every((u) => new URL(u).searchParams.get("site") === "stackoverflow")).toBe(true)
  })
})
