import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { PluginManager } from "../../manager"
import type { GithubData } from "../types"

/**
 * The activity, repositories and star_lists sections against a fake GitHub that answers the
 * way the real one did on 17/11/2026, for LucasHenriqueDiniz, antfu and torvalds:
 *
 * - A query that selects `projects` on a user gets `user: null` and a NOT_FOUND error:
 *   GitHub sunset Projects (classic). The activity query asked for it, so the section drew
 *   an error box for every user.
 * - The repositories query asked each of 100 repositories for its languages, releases,
 *   deployments, environments and five issue and pull request counts. GitHub gave up after
 *   10 s with a 502 for 76 repositories (LucasHenriqueDiniz) and 258 (antfu); it answered for
 *   9 (torvalds), and the section then broke on the license and disk usage the fetch never set.
 *   The fake answers 502 to a page of more than 50 repositories that asks for any of those.
 * - The star lists come from `user.lists`. The fetch never asked: the section drew nothing.
 */

const github = () => PluginManager.getInstance().get("github")!

const card = (sections: string[], extra: Record<string, unknown> = {}) => ({
  enabled: true,
  sections,
  username: "octocat",
  ...extra,
})

const UNDRAWN_CONNECTIONS = /\b(issues|pullRequests|releases|deployments|environments|languages)\b/

interface Repo {
  stars: number
  license: string | null
}

const repository = ({ stars, license }: Repo) => ({
  stargazerCount: stars,
  // The old query asked for the count this way
  stargazers: { totalCount: stars },
  forkCount: 2,
  watchers: { totalCount: 1 },
  packages: { totalCount: 0 },
  licenseInfo: license ? { name: license } : null,
})

const ACTIVITY = {
  contributionsCollection: {
    totalCommitContributions: 1621,
    totalRepositoriesWithContributedCommits: 35,
    totalPullRequestContributions: 261,
    totalPullRequestReviewContributions: 7,
    totalIssueContributions: 3,
    restrictedContributionsCount: 2681,
  },
  repositoriesContributedTo: { totalCount: 93 },
  issueComments: { totalCount: 43 },
  organizations: { totalCount: 5 },
  following: { totalCount: 183 },
  sponsorshipsAsSponsor: { totalCount: 2 },
  starredRepositories: { totalCount: 107 },
  watching: { totalCount: 12 },
  pullRequests: { totalCount: 10 },
  issues: { totalCount: 4 },
  gists: { totalCount: 7 },
}

const listItem = (name: string, isPrivate = false) => ({
  isPrivate,
  name,
  nameWithOwner: `someone/${name}`,
  url: `https://github.com/someone/${name}`,
  stargazerCount: 1200,
})

const STAR_LISTS = [
  {
    name: "Command line tooling",
    description: "Small tools",
    isPrivate: false,
    // GitHub answers the first 10 of the list's 9
    items: {
      totalCount: 9,
      nodes: [...["a", "b", "c", "d", "e", "f", "g", "h"].map((n) => listItem(n)), listItem("secret-repo", true)],
    },
  },
  { name: "Drafts", description: null, isPrivate: true, items: { totalCount: 1, nodes: [listItem("draft")] } },
  { name: "Fonts", description: "", isPrivate: false, items: { totalCount: 2, nodes: [listItem("x"), listItem("y")] } },
]

/** Requests the fake GitHub received, by operation, with their variables. */
let asked: Array<{ operation: string; variables: Record<string, unknown> }>

function fakeGithub(repos: Repo[]) {
  asked = []
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
    const request = input instanceof Request ? input : new Request(String(input), init)
    if (new URL(request.url).pathname !== "/graphql") throw new Error(`unexpected fetch: ${request.url}`)
    const { query, variables = {} } = (await request.json()) as { query: string; variables?: Record<string, unknown> }
    const operation = query.match(/query\s+(\w+)/)?.[1] ?? ""
    asked.push({ operation, variables })

    if (/\bprojects\s*\{/.test(query)) {
      return Response.json({
        data: { user: null },
        errors: [
          {
            type: "NOT_FOUND",
            path: ["user", "projects"],
            message:
              "Projects (classic) is being deprecated in favor of the new Projects experience, see: https://github.blog/changelog/2024-05-23-sunset-notice-projects-classic/.",
          },
        ],
      })
    }

    switch (operation) {
      case "userActivity":
        return Response.json({ data: { user: ACTIVITY } })
      case "userStarLists":
        return Response.json({ data: { user: { lists: { nodes: STAR_LISTS } } } })
      case "userRepositories": {
        const perRepository = query.slice(query.indexOf("nodes"))
        if (repos.length > 50 && UNDRAWN_CONNECTIONS.test(perRepository)) {
          return new Response("<html><body><h1>502 Bad Gateway</h1></body></html>", {
            status: 502,
            headers: { "content-type": "text/html" },
          })
        }
        // Pages of 100 when the query asks for a cursor, the first 100 when it does not
        const start = typeof variables.after === "string" ? Number(variables.after.slice(1)) : 0
        const end = start + 100
        return Response.json({
          data: {
            user: {
              repositories: {
                totalCount: repos.length,
                totalDiskUsage: 761_168,
                pageInfo: { hasNextPage: end < repos.length, endCursor: `c${end}` },
                nodes: repos.slice(start, end).map(repository),
              },
              sponsorshipsAsSponsor: { totalCount: 3 },
              contributionsCollection: ACTIVITY.contributionsCollection,
            },
          },
        })
      }
      default:
        return Response.json({ data: { user: {} } })
    }
  })
}

async function fetchCard(sections: string[], extra: Record<string, unknown> = {}) {
  return (await github().fetchData(card(sections, extra) as never, false, { pat: "ghp_test" })) as unknown as GithubData
}

/** The card as it is drawn, the way the generator renders it, in text. */
function drawn(
  sections: string[],
  data: GithubData,
  style: "default" | "terminal",
  extra: Record<string, unknown> = {}
) {
  const element = github().render({ ...card(sections, extra), style, size: "half" } as never, data as never)
  return renderToStaticMarkup(element)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
}

/** `n` repositories, the most starred first (the order the query asks for): 1, 2, ... n stars. */
const repos = (n: number, license: (i: number) => string | null = () => "MIT License"): Repo[] =>
  Array.from({ length: n }, (_, i) => ({ stars: n - i, license: license(i) }))

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {})
  vi.spyOn(console, "warn").mockImplementation(() => {})
  vi.spyOn(console, "error").mockImplementation(() => {})
})
afterEach(() => vi.restoreAllMocks())

describe("github activity with real data", () => {
  it("fetches the counts and draws them", async () => {
    fakeGithub([])
    const data = await fetchCard(["activity"])
    expect(data.activity).toMatchObject({ totalCommitContributions: 1621, issueComments: 43, organizations: 5 })
    expect(drawn(["activity"], data, "default")).toContain("1.6K Total Commits 261 PRs Created")
    expect(drawn(["activity"], data, "terminal")).toContain("Commits 1.6K PRs Created 261")
  })
})

describe("github repositories with real data", () => {
  // torvalds: GitHub answered the old query, and the section broke drawing it.
  it("draws a user with a few repositories", async () => {
    fakeGithub(repos(9, (i) => (i < 6 ? "GNU General Public License v2.0" : null)))
    const data = await fetchCard(["repositories"])
    expect(drawn(["repositories"], data, "default")).toContain(
      "9 Repositories 45 Total Stars 18 Total Forks 9 Total Watchers 0 Total Packages 3 Sponsoring 743 MB Disk Usage GNU General Public License v2.0 (6)"
    )
    expect(drawn(["repositories"], data, "terminal")).toContain("Repositories 9 repos Stars 45")
  })

  // antfu: 258 repositories, three pages. The title said 100 when the fetch read one page.
  it("counts every repository, past the first page of 100", async () => {
    fakeGithub(repos(258, (i) => (i % 4 === 0 ? null : "MIT License")))
    const data = await fetchCard(["repositories"])
    expect(asked.filter((a) => a.operation === "userRepositories")).toHaveLength(3)
    expect(data.repositories.totalCount).toBe(258)
    expect(data.repositories.nodes).toHaveLength(258)
    // 1 + 2 + ... + 258 stars
    expect(drawn(["repositories"], data, "default")).toContain("258 Repositories 33.4K Total Stars 516 Total Forks")
    expect(data.favoriteLicense).toEqual({ name: "MIT License", count: 193, total: 258 })
  })

  it("stops after five pages, keeping the count of all of them", async () => {
    fakeGithub(repos(1132))
    const data = await fetchCard(["repositories"])
    expect(asked.filter((a) => a.operation === "userRepositories")).toHaveLength(5)
    expect(data.repositories.totalCount).toBe(1132)
    expect(data.repositories.nodes).toHaveLength(500)
    expect(drawn(["repositories"], data, "default")).toContain("1.1K Repositories")
  })

  it("asks only for public repositories unless the card includes private ones", async () => {
    fakeGithub(repos(3))
    await fetchCard(["repositories"])
    expect(asked.at(-1)?.variables.privacy).toBe("PUBLIC")
    await fetchCard(["repositories"], { repositories_use_private: true })
    expect(asked.at(-1)?.variables.privacy).toBeUndefined()
  })

  it("reads the pages once for repositories and favorite_license together", async () => {
    fakeGithub(repos(150))
    const data = await fetchCard(["repositories", "favorite_license"])
    expect(asked.filter((a) => a.operation === "userRepositories")).toHaveLength(2)
    expect(data.favoriteLicense).toEqual({ name: "MIT License", count: 150, total: 150 })
  })
})

describe("github star_lists with real data", () => {
  it("fetches the public lists and draws them", async () => {
    fakeGithub([])
    const data = await fetchCard(["star_lists"])
    // The private list stays off the card, and so does the private repository.
    expect(data.starLists?.map((list) => [list.name, list.totalCount, list.repositories.length])).toEqual([
      ["Command line tooling", 8, 5],
      ["Fonts", 2, 2],
    ])
    expect(JSON.stringify(data.starLists)).not.toMatch(/secret-repo|Drafts|draft/)
    const html = drawn(["star_lists"], data, "default")
    expect(html).toContain("Command line tooling Small tools someone/a")
    expect(html).toContain("+3 more repositories Fonts someone/x")
    expect(drawn(["star_lists"], data, "terminal")).toContain("Command line tooling Small tools 8 repos Fonts 2 repos")
  })

  it("keeps a private repository of a list when the card includes private repositories", async () => {
    fakeGithub([])
    const data = await fetchCard(["star_lists"], { repositories_use_private: true })
    expect(data.starLists?.[0]?.totalCount).toBe(9)
    expect(JSON.stringify(data.starLists)).not.toContain("Drafts")
  })
})
