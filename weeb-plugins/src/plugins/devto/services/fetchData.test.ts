import { describe, it, expect, vi, afterEach } from "vitest"
import { fetchDevToData } from "./fetchData"

const config = (overrides: Record<string, unknown> = {}) => ({ username: "someone", ...overrides })

const profileBody = {
  username: "someone",
  name: "Some One",
  summary: "writes things",
  location: "Brazil",
  joined_at: "Dec 27, 2015",
  profile_image: null,
}

const articleBody = (id: number, overrides: Record<string, unknown> = {}) => ({
  id,
  title: `Article ${id}`,
  url: `https://dev.to/someone/article-${id}`,
  public_reactions_count: 10 * id,
  positive_reactions_count: 999,
  comments_count: id,
  reading_time_minutes: 4,
  published_at: "2026-08-03T12:48:29Z",
  readable_publish_date: "Aug 3",
  tag_list: ["typescript", "react"],
  ...overrides,
})

/** Responde na ordem em que fetchData chama: perfil primeiro, artigos depois. */
function mockSequence(responses: Array<{ status: number; body: unknown }>) {
  const spy = vi.spyOn(globalThis, "fetch")
  for (const { status, body } of responses) {
    spy.mockResolvedValueOnce(new Response(JSON.stringify(body), { status }) as never)
  }
  return spy
}

afterEach(() => vi.restoreAllMocks())

describe("fetchDevToData", () => {
  it("maps profile and articles from the API shape", async () => {
    mockSequence([
      { status: 200, body: profileBody },
      { status: 200, body: [articleBody(1), articleBody(2)] },
    ])

    const data = await fetchDevToData(config())

    expect(data.profile).toMatchObject({ name: "Some One", location: "Brazil", joinedAt: "Dec 27, 2015" })
    expect(data.recentArticles).toHaveLength(2)
    expect(data.recentArticles[0]).toMatchObject({ title: "Article 1", comments: 1 })
  })

  // public_reactions_count is what dev.to shows on the card; positive_ is a larger
  // internal tally, so preferring it would inflate every number on the card.
  it("uses the public reaction count, not the positive one", async () => {
    mockSequence([
      { status: 200, body: profileBody },
      { status: 200, body: [articleBody(1)] },
    ])

    expect((await fetchDevToData(config())).recentArticles[0]!.reactions).toBe(10)
  })

  it("counts tags across the fetched window, most frequent first", async () => {
    mockSequence([
      { status: 200, body: profileBody },
      {
        status: 200,
        body: [
          articleBody(1, { tag_list: ["typescript", "react"] }),
          articleBody(2, { tag_list: ["typescript"] }),
          articleBody(3, { tag_list: ["go"] }),
        ],
      },
    ])

    const tags = (await fetchDevToData(config())).topTags
    expect(tags[0]).toEqual({ name: "typescript", count: 2 })
    // Ties break alphabetically so the same data always renders the same SVG.
    expect(tags.slice(1).map((t) => t.name)).toEqual(["go", "react"])
  })

  // /articles answers 200 with [] for a username that does not exist, so it cannot
  // tell "no posts" from "no user". Only the profile endpoint 404s, which is why
  // it is fetched first and why its failure is the one that stops everything.
  it("reports a missing user from the profile endpoint", async () => {
    mockSequence([{ status: 404, body: { error: "not found", status: 404 } }])

    const data = await fetchDevToData(config({ username: "nobody" }))
    expect(data._error).toMatch(/not found/i)
  })

  it("does not request articles once the profile is missing", async () => {
    const spy = mockSequence([{ status: 404, body: {} }])
    await fetchDevToData(config())
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it("keeps the card when the user simply has no articles", async () => {
    mockSequence([
      { status: 200, body: profileBody },
      { status: 200, body: [] },
    ])

    const data = await fetchDevToData(config())
    expect(data._error).toBeUndefined()
    expect(data.recentArticles).toEqual([])
    expect(data.topTags).toEqual([])
    expect(data.profile.name).toBe("Some One")
  })

  // Articles are supplementary: a valid profile is still a useful card without them.
  it("keeps the profile when the articles request fails", async () => {
    mockSequence([
      { status: 200, body: profileBody },
      { status: 500, body: {} },
    ])

    const data = await fetchDevToData(config())
    expect(data._error).toBeUndefined()
    expect(data.profile.name).toBe("Some One")
    expect(data.recentArticles).toEqual([])
  })

  it("reports rate limiting as its own thing", async () => {
    mockSequence([{ status: 429, body: {} }])
    expect((await fetchDevToData(config()))._error).toMatch(/rate limit/i)
  })

  it("asks for a username instead of calling the API without one", async () => {
    const spy = mockSequence([{ status: 200, body: profileBody }])
    const data = await fetchDevToData(config({ username: "   " }))

    expect(data._error).toMatch(/username is required/i)
    expect(spy).not.toHaveBeenCalled()
  })

  it("escapes the username into the query string", async () => {
    const spy = mockSequence([
      { status: 200, body: profileBody },
      { status: 200, body: [] },
    ])
    await fetchDevToData(config({ username: "a b&c" }))

    expect(String(spy.mock.calls[0]![0])).toContain("a%20b%26c")
  })

  it("surfaces a network failure without throwing", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("boom"))
    expect((await fetchDevToData(config()))._error).toMatch(/could not reach/i)
  })

  it("returns mock data in dev without touching the network", async () => {
    const spy = vi.spyOn(globalThis, "fetch")
    const data = await fetchDevToData(config(), true, true)

    expect(spy).not.toHaveBeenCalled()
    expect(data.recentArticles.length).toBeGreaterThan(0)
    expect(data._error).toBeUndefined()
  })
})
