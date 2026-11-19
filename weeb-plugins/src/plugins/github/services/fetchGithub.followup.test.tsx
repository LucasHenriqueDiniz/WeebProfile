import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { PluginManager } from "../../manager"
import type { GithubData } from "../types"
import { followupSearches } from "./fetchGithub"

/**
 * The followup section against a fake GitHub search that applies the qualifiers it is sent
 * to a fixed list of issues and pull requests, the way the real one does. Measured on the
 * real API on 18/11/2026: the six searches split every pull request once (antfu: 18 open,
 * 5 drafts, 1920 merged, 185 closed = 2128 `is:pr author:antfu`), and with a token that has
 * the `repo` scope, `author:` alone counted private ones too (665 pull requests for 366 public).
 */

const github = () => PluginManager.getInstance().get("github")!

interface Item {
  kind: "issue" | "pr"
  author: string
  owner: string
  state: "open" | "closed" | "merged"
  draft?: boolean
  isPrivate?: boolean
  archived?: boolean
}

const ITEMS: Item[] = [
  // Opened by octocat on others' repositories
  { kind: "issue", author: "octocat", owner: "acme", state: "open" },
  { kind: "issue", author: "octocat", owner: "acme", state: "closed" },
  { kind: "issue", author: "octocat", owner: "acme", state: "closed", archived: true },
  { kind: "issue", author: "octocat", owner: "secret", state: "open", isPrivate: true },
  { kind: "pr", author: "octocat", owner: "acme", state: "open" },
  { kind: "pr", author: "octocat", owner: "acme", state: "open", draft: true },
  // A draft that was closed: closed, not a draft
  { kind: "pr", author: "octocat", owner: "acme", state: "closed", draft: true },
  { kind: "pr", author: "octocat", owner: "acme", state: "closed" },
  { kind: "pr", author: "octocat", owner: "acme", state: "merged" },
  { kind: "pr", author: "octocat", owner: "acme", state: "merged" },
  { kind: "pr", author: "octocat", owner: "acme", state: "merged", archived: true },
  { kind: "pr", author: "octocat", owner: "secret", state: "merged", isPrivate: true },
  // Opened by others on octocat's repositories
  { kind: "issue", author: "someone", owner: "octocat", state: "open" },
  { kind: "issue", author: "someone", owner: "octocat", state: "open" },
  { kind: "pr", author: "someone", owner: "octocat", state: "merged" },
  { kind: "pr", author: "someone", owner: "octocat", state: "open", draft: true },
]

/** GitHub search over ITEMS, for the qualifiers the section sends; any other one fails. */
function search(query: string): number {
  const filters = query.split(/\s+/).map((term): ((item: Item) => boolean) => {
    const [key, value] = term.split(":") as [string, string]
    switch (`${key}:${key === "author" || key === "user" ? "*" : value}`) {
      case "author:*":
        return (item) => item.author === value
      case "user:*":
        return (item) => item.owner === value
      case "is:issue":
        return (item) => item.kind === "issue"
      case "is:pr":
        return (item) => item.kind === "pr"
      case "is:open":
        return (item) => item.state === "open"
      case "is:closed":
        return (item) => item.state !== "open"
      case "is:merged":
        return (item) => item.state === "merged"
      case "is:unmerged":
        return (item) => item.state !== "merged"
      case "is:public":
        return (item) => !item.isPrivate
      case "draft:true":
        return (item) => Boolean(item.draft)
      case "draft:false":
        return (item) => !item.draft
      case "archived:false":
        return (item) => !item.archived
      default:
        throw new Error(`qualifier the fake does not know: ${term}`)
    }
  })
  return ITEMS.filter((item) => filters.every((matches) => matches(item))).length
}

let asked: Array<{ operation: string; variables: Record<string, string> }>

function fakeGithub() {
  asked = []
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
    const request = input instanceof Request ? input : new Request(String(input), init)
    if (new URL(request.url).pathname !== "/graphql") throw new Error(`unexpected fetch: ${request.url}`)
    const { query, variables = {} } = (await request.json()) as { query: string; variables?: Record<string, string> }
    const operation = query.match(/query\s+(\w+)/)?.[1] ?? ""
    asked.push({ operation, variables })
    if (operation !== "userFollowup") return Response.json({ data: { user: {} } })
    // Each alias searches the variable of the same name
    const data = Object.fromEntries(
      [...query.matchAll(/(\w+):\s*search\(query:\s*\$(\w+)/g)].map(([, alias, variable]) => [
        alias,
        { issueCount: search(variables[variable!]!) },
      ])
    )
    return Response.json({ data })
  })
}

const card = (sections: string[], extra: Record<string, unknown> = {}) => ({
  enabled: true,
  sections,
  username: "octocat",
  ...extra,
})

async function fetchCard(sections: string[], extra: Record<string, unknown> = {}) {
  return (await github().fetchData(card(sections, extra) as never, false, { pat: "ghp_test" })) as unknown as GithubData
}

function drawn(data: GithubData, style: "default" | "terminal", size: "half" | "full" = "half") {
  const element = github().render({ ...card(["followup"]), style, size } as never, data as never)
  return renderToStaticMarkup(element)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
}

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {})
  vi.spyOn(console, "warn").mockImplementation(() => {})
  vi.spyOn(console, "error").mockImplementation(() => {})
})
afterEach(() => vi.restoreAllMocks())

describe("github followup", () => {
  it("counts what the user opened, public only, archived included, in one call", async () => {
    fakeGithub()
    const data = await fetchCard(["followup"])
    expect(asked.map((a) => a.operation)).toEqual(["userFollowup"])
    expect(data.followup).toEqual({
      scope: "created",
      issues: { open: 1, closed: 2 },
      pullRequests: { open: 1, draft: 1, merged: 3, closed: 2 },
    })
  })

  it("splits every pull request and issue once: the states add up to the total", async () => {
    fakeGithub()
    for (const extra of [{}, { followup_scope: "repositories" }, { repositories_use_private: true }]) {
      const { followup } = await fetchCard(["followup"], extra)
      const scope = followupSearches("octocat", card(["followup"], extra) as never).issuesOpen.replace(
        / is:issue is:open$/,
        ""
      )
      const { pullRequests: pr, issues } = followup!
      expect(pr.open + pr.draft + pr.merged + pr.closed).toBe(search(`${scope} is:pr`))
      expect(issues.open + issues.closed).toBe(search(`${scope} is:issue`))
    }
  })

  it("counts private ones only when the card includes private repositories", async () => {
    fakeGithub()
    const data = await fetchCard(["followup"], { repositories_use_private: true })
    expect(asked[0]!.variables.prMerged).toBe("author:octocat is:pr is:merged")
    expect(data.followup?.issues).toEqual({ open: 2, closed: 2 })
    expect(data.followup?.pullRequests.merged).toBe(4)
  })

  it("leaves archived repositories out when asked", async () => {
    fakeGithub()
    const data = await fetchCard(["followup"], { followup_include_archived: false })
    expect(asked[0]!.variables.issuesClosed).toBe("author:octocat is:public archived:false is:issue is:closed")
    expect(data.followup?.issues.closed).toBe(1)
    expect(data.followup?.pullRequests.merged).toBe(2)
  })

  it("counts everything opened on the user's repositories, by anyone", async () => {
    fakeGithub()
    const data = await fetchCard(["followup"], { followup_scope: "repositories" })
    expect(data.followup).toEqual({
      scope: "repositories",
      issues: { open: 2, closed: 0 },
      pullRequests: { open: 0, draft: 1, merged: 1, closed: 0 },
    })
  })

  it("does not search when the section is off", async () => {
    fakeGithub()
    const data = await fetchCard(["activity"])
    expect(asked.map((a) => a.operation)).not.toContain("userFollowup")
    expect(data.followup).toBeUndefined()
  })

  it("draws the counts in both styles and sizes", async () => {
    fakeGithub()
    const data = await fetchCard(["followup"])
    for (const size of ["half", "full"] as const) {
      const html = drawn(data, "default", size)
      expect(html).toContain("Issues &amp; Pull Requests opened by me")
      expect(html).toContain("Issues 3 1 open 2 closed")
      expect(html).toContain("Pull requests 7 1 open 1 draft 3 merged 2 closed")
      // The bar is a line of blocks between the label and the legend
      const terminal = drawn(data, "terminal", size).replace(/(█{2,} ?)+/g, "[bar] ")
      expect(terminal).toContain(
        "followup Issues 3 [bar] █ open 1 █ closed 2 Pull requests 7 [bar] █ open 1 █ draft 1 █ merged 3 █ closed 2"
      )
    }
  })

  it("draws nothing when the fetch failed", () => {
    const element = github().render({ ...card(["followup"]), style: "default", size: "half" } as never, {} as never)
    expect(renderToStaticMarkup(element)).not.toContain("github-followup")
  })
})
