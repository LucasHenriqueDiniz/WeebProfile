import { describe, it, expect } from "vitest"
import { createProfileRepoUrl, guessGithubLogin, isGithubLogin, resolveProfileReadme } from "./github-profile"

describe("isGithubLogin", () => {
  it.each(["octocat", "Lucas-Diniz", "a", "a1-b2", "x".repeat(39)])("accepts %s", (login) => {
    expect(isGithubLogin(login)).toBe(true)
  })

  it.each(["", "-lead", "trail-", "dou--ble", "has space", "a/b", "x".repeat(40), "é"])("rejects %j", (login) => {
    expect(isGithubLogin(login)).toBe(false)
  })
})

describe("guessGithubLogin", () => {
  const svg = (username?: unknown) => ({ pluginsConfig: { github: { enabled: true, username } } })

  it("prefers the GitHub account the user signed in with", () => {
    expect(guessGithubLogin("signed-in", [svg("from-plugin")])).toBe("signed-in")
  })

  it("falls back to the first github plugin username, trimmed", () => {
    expect(guessGithubLogin(null, [{ pluginsConfig: {} }, svg(" from-plugin "), svg("later")])).toBe("from-plugin")
  })

  it("is null when nothing looks like a login", () => {
    expect(guessGithubLogin(null, [svg(""), svg(42), { pluginsConfig: null }])).toBeNull()
  })
})

describe("createProfileRepoUrl", () => {
  it("prefills the repository name", () => {
    expect(createProfileRepoUrl("octocat")).toBe("https://github.com/new?name=octocat")
  })
})

describe("resolveProfileReadme", () => {
  /** The GitHub API, answering by URL; anything unlisted is a 404. */
  const api =
    (routes: Record<string, { status: number; body?: unknown } | Error>) =>
    async (input: RequestInfo | URL): Promise<Response> => {
      const route = routes[String(input)]
      if (route instanceof Error) throw route
      return Response.json(route?.body ?? { message: "Not Found" }, { status: route?.status ?? 404 })
    }
  const base = "https://api.github.com/repos/octocat/octocat"

  it("opens the README's editor on the branch the API names", async () => {
    const fetchJson = api({
      [`${base}/readme`]: { status: 200, body: { html_url: "https://github.com/octocat/octocat/blob/main/README.md" } },
    })
    expect(await resolveProfileReadme("octocat", fetchJson)).toEqual({
      kind: "edit",
      url: "https://github.com/octocat/octocat/edit/main/README.md",
    })
  })

  it("offers to add a README to a repository that has none", async () => {
    const fetchJson = api({ [base]: { status: 200, body: { default_branch: "trunk" } } })
    expect(await resolveProfileReadme("octocat", fetchJson)).toEqual({
      kind: "add-readme",
      url: "https://github.com/octocat/octocat/new/trunk?filename=README.md",
    })
  })

  it("offers to create the repository when there is none", async () => {
    expect(await resolveProfileReadme("octocat", api({}))).toEqual({
      kind: "no-repo",
      url: "https://github.com/new?name=octocat",
    })
  })

  it.each([
    ["rate-limited", api({ [`${base}/readme`]: { status: 403 } })],
    ["unreachable", api({ [`${base}/readme`]: new TypeError("Failed to fetch") })],
    ["rate-limited on the second call", api({ [base]: { status: 403 } })],
  ])("links to the repository page when the API is %s", async (_case, fetchJson) => {
    expect(await resolveProfileReadme("octocat", fetchJson)).toEqual({
      kind: "unknown",
      url: "https://github.com/octocat/octocat",
    })
  })
})
