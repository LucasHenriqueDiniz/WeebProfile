import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { PluginManager } from "../../manager"

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
