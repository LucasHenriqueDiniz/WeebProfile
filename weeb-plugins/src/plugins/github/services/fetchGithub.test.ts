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
            created_at: recent,
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
  const habits = async () => {
    const data = (await github().fetchData(card(["code_habits"]) as never, false, {
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
