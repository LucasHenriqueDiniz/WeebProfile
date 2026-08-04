import { describe, it, expect, vi, afterEach } from "vitest"
import { fetchAniListData } from "./fetchData"
import type { AniListConfig } from "../types"

const config = (overrides: Partial<AniListConfig> = {}): AniListConfig => ({
  enabled: true,
  sections: ["statistics"],
  username: "someone",
  ...overrides,
})

const respond = (status: number, body: unknown) =>
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(body), { status }) as never)

afterEach(() => vi.restoreAllMocks())

const fullUser = {
  data: {
    User: {
      name: "Someone",
      statistics: {
        anime: { count: 532, episodesWatched: 4838, minutesWatched: 109_349, meanScore: 85.65 },
        manga: { count: 12, chaptersRead: 340, volumesRead: 22, meanScore: 79.1 },
      },
      favourites: {
        anime: {
          nodes: [
            { id: 1, title: { english: "Cowboy Bebop", romaji: "Cowboy Bebop" }, coverImage: { medium: null } },
            { id: 2, title: { english: null, romaji: "Sousou no Frieren" }, coverImage: { medium: null } },
          ],
        },
      },
    },
    MediaListCollection: {
      lists: [
        {
          entries: [
            { progress: 18, media: { id: 3, title: { english: "Attack on Titan" }, episodes: 25, coverImage: {} } },
            { progress: 1094, media: { id: 4, title: { romaji: "One Piece" }, episodes: null, coverImage: {} } },
          ],
        },
      ],
    },
  },
}

describe("fetchAniListData", () => {
  it("maps statistics straight from the API shape", async () => {
    respond(200, fullUser)
    const data = await fetchAniListData(config())

    expect(data.statistics).toMatchObject({
      animeCount: 532,
      episodesWatched: 4838,
      minutesWatched: 109_349,
      animeMeanScore: 85.65,
      chaptersRead: 340,
    })
  })

  it("prefers the english title and falls back to romaji", async () => {
    respond(200, fullUser)
    const data = await fetchAniListData(config())

    expect(data.favoritesAnime.map((a) => a.title)).toEqual(["Cowboy Bebop", "Sousou no Frieren"])
  })

  // AniList leaves `episodes` null while a series is still airing.
  it("keeps a null episode count rather than inventing a total", async () => {
    respond(200, fullUser)
    const data = await fetchAniListData(config())

    expect(data.currentlyWatching.find((e) => e.title === "One Piece")?.totalEpisodes).toBeNull()
    expect(data.currentlyWatching.find((e) => e.title === "Attack on Titan")?.totalEpisodes).toBe(25)
  })

  it("caps the in-progress list, which can run to hundreds of entries", async () => {
    const many = {
      data: {
        ...fullUser.data,
        MediaListCollection: {
          lists: [
            {
              entries: Array.from({ length: 199 }, (_, i) => ({
                progress: i,
                media: { id: i, title: { romaji: `Show ${i}` }, episodes: 12, coverImage: {} },
              })),
            },
          ],
        },
      },
    }
    respond(200, many)

    const data = await fetchAniListData(config({ currently_watching_max: 5 }))
    expect(data.currentlyWatching).toHaveLength(5)
  })

  // Both of these come back as 404; only the body tells them apart, and the
  // distinction is the difference between "fix your spelling" and "flip a setting".
  it("distinguishes a private profile from a missing one", async () => {
    respond(404, { errors: [{ message: "Not Found." }, { message: "Private User" }] })
    const priv = await fetchAniListData(config({ username: "someone" }))
    expect(priv._error).toMatch(/private/i)

    respond(404, { errors: [{ message: "Not Found." }, { message: "User not found" }] })
    const missing = await fetchAniListData(config({ username: "nobody" }))
    expect(missing._error).toMatch(/not found/i)
    expect(missing._error).not.toMatch(/private/i)
  })

  it("reports rate limiting as its own thing", async () => {
    respond(429, {})
    expect((await fetchAniListData(config()))._error).toMatch(/rate limit/i)
  })

  it("asks for a username instead of calling the API without one", async () => {
    const spy = respond(200, fullUser)
    const data = await fetchAniListData(config({ username: "  " }))

    expect(data._error).toMatch(/username is required/i)
    expect(spy).not.toHaveBeenCalled()
  })

  // A private list makes MediaListCollection absent while the profile itself still
  // resolves. The section should disappear, not take the whole card down.
  it("keeps the rest of the card when the list is private", async () => {
    respond(200, { data: { User: fullUser.data.User, MediaListCollection: null } })
    const data = await fetchAniListData(config())

    expect(data._error).toBeUndefined()
    expect(data.currentlyWatching).toEqual([])
    expect(data.statistics.animeCount).toBe(532)
  })

  it("surfaces a network failure without throwing", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("boom"))
    expect((await fetchAniListData(config()))._error).toMatch(/could not reach/i)
  })

  it("returns mock data in dev without touching the network", async () => {
    const spy = respond(200, fullUser)
    const data = await fetchAniListData(config(), true, true)

    expect(spy).not.toHaveBeenCalled()
    expect(data.statistics.animeCount).toBeGreaterThan(0)
    expect(data._error).toBeUndefined()
  })
})
