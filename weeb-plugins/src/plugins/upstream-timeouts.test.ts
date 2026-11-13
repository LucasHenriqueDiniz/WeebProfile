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
