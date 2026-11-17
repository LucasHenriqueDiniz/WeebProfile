import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fetchFavorites } from "./favorites"
import { DETAILS_DEADLINE_MS } from "./favorite-details"
import type { MalProfileResponse } from "./profile"
import type { MyAnimeListConfig } from "../types"

vi.mock("../../../utils/image-to-base64", () => ({
  embedImageOrNull: vi.fn(),
}))

import { embedImageOrNull } from "../../../utils/image-to-base64"

const EDGE = "https://edge.test"
const EMBEDDED = "data:image/jpeg;base64,AAAA"

// The shape of /v1/users/Amayacrab/favorites on jikan-edge (2026-11-17): camelCase
// ids and years, which the plugin read as `mal_id`/`start_year` and lost.
const anime = [
  {
    malId: 1698,
    title: "Nodame Cantabile",
    url: "https://myanimelist.net/anime/1698",
    type: "TV",
    startYear: 2007,
    imageUrl: "https://cdn.myanimelist.net/images/anime/9/11986.jpg",
  },
  {
    malId: 4224,
    title: "Toradora!",
    url: "https://myanimelist.net/anime/4224",
    type: "TV",
    startYear: 2008,
    imageUrl: "https://cdn.myanimelist.net/images/anime/13/22128.jpg",
  },
  {
    malId: 5081,
    title: "Bakemonogatari",
    url: "https://myanimelist.net/anime/5081",
    type: "TV",
    startYear: 2009,
    imageUrl: "https://cdn.myanimelist.net/images/anime/11/75274.jpg",
  },
]
const manga = [
  {
    malId: 14893,
    title: "Monogatari Series: First Season",
    url: "https://myanimelist.net/manga/14893",
    type: "Light Novel",
    startYear: 2006,
    imageUrl: "https://cdn.myanimelist.net/images/manga/2/279887.jpg",
  },
]

// /v1/anime/1698 and /v1/manga/14893, trimmed to the fields a favorite draws.
const pages: Record<string, unknown> = {
  "/v1/anime/1698": {
    malId: 1698,
    synopsis: "Shinichi Chiaki is a first class musician.",
    type: "TV",
    episodes: 23,
    status: "Finished Airing",
    year: 2007,
    genres: [
      { malId: 4, name: "Comedy", url: "https://myanimelist.net/anime/genre/4/Comedy" },
      { malId: 22, name: "Romance", url: "https://myanimelist.net/anime/genre/22/Romance" },
    ],
    score: 8.25,
    rank: 397,
    popularity: 865,
  },
  "/v1/anime/4224": {
    malId: 4224,
    synopsis: "Ryuuji Takasu is a gentle high school student.",
    episodes: 25,
    status: "Finished Airing",
    year: 2008,
    genres: [{ malId: 8, name: "Drama" }],
    score: 8.03,
    rank: 600,
    popularity: 26,
  },
  "/v1/anime/5081": {
    malId: 5081,
    synopsis: "Koyomi Araragi survives a vampire attack.",
    episodes: 15,
    status: "Finished Airing",
    year: 2009,
    genres: [{ malId: 7, name: "Mystery" }],
    score: 8.32,
    rank: 282,
    popularity: 99,
  },
  "/v1/manga/14893": {
    malId: 14893,
    synopsis: "This is a story, a ghostory of sorts.",
    volumes: 6,
    chapters: 107,
    status: "Finished",
    genres: [{ malId: 1, name: "Action" }],
    score: 8.92,
    rank: 24,
    popularity: 285,
  },
}

function profile(): MalProfileResponse {
  return {
    favorites: { anime, manga, characters: [], people: [] },
  } as unknown as MalProfileResponse
}

function config(extra: Partial<MyAnimeListConfig> = {}): MyAnimeListConfig {
  return {
    enabled: true,
    username: "Amayacrab",
    sections: ["anime_favorites", "manga_favorites"],
    anime_favorites_max: 3,
    manga_favorites_max: 3,
    ...extra,
  } as MyAnimeListConfig
}

type Route = (path: string) => Response | Promise<Response>

/** The edge, answering each detail page; anything else is a test error. */
function edge(route: Route = (path) => Response.json({ data: pages[path], meta: {} })) {
  const requested: string[] = []
  const spy = vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    const url = new URL(input instanceof Request ? input.url : String(input))
    if (url.origin !== EDGE) throw new Error(`request the test did not expect: ${url}`)
    requested.push(url.pathname)
    return route(url.pathname)
  })
  return { requested, spy }
}

beforeEach(() => {
  process.env.JIKAN_EDGE_BASE_URL = EDGE
  vi.mocked(embedImageOrNull).mockReset()
  vi.mocked(embedImageOrNull).mockResolvedValue(EMBEDDED)
  vi.spyOn(console, "warn").mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
  delete process.env.JIKAN_EDGE_BASE_URL
})

describe("MyAnimeList favorites read the jikan-edge contract", () => {
  it("takes the id and start year from malId and startYear", async () => {
    edge()
    const { basic, full } = await fetchFavorites(profile(), config())
    expect(basic.anime.map((x) => [x.mal_id, x.start_year])).toEqual([
      [1698, 2007],
      [4224, 2008],
      [5081, 2009],
    ])
    expect(full.manga[0]).toMatchObject({ mal_id: 14893, start_year: 2006, type: "Light Novel" })
  })
})

describe("MyAnimeList favorite details", () => {
  it("merges each shown favorite's page into it", async () => {
    edge()
    const { full } = await fetchFavorites(profile(), config())
    expect(full.anime[0]).toMatchObject({
      mal_id: 1698,
      title: "Nodame Cantabile",
      score: 8.25,
      popularity: 865,
      rank: 397,
      episodes: 23,
      status: "Finished Airing",
      year: 2007,
      synopsis: "Shinichi Chiaki is a first class musician.",
      genres: [{ name: "Comedy" }, { name: "Romance" }],
    })
    expect(full.manga[0]).toMatchObject({ score: 8.92, chapters: 107, volumes: 6, genres: [{ name: "Action" }] })
  })

  it("asks only for the favorites the card shows", async () => {
    const { requested } = edge()
    await fetchFavorites(profile(), config({ anime_favorites_max: 2 }))
    expect(requested.sort()).toEqual(["/v1/anime/1698", "/v1/anime/4224", "/v1/manga/14893"])
  })

  it("asks for nothing when the list style does not draw the details", async () => {
    const { requested } = edge()
    await fetchFavorites(
      profile(),
      config({ anime_favorites_list_style: "simple", manga_favorites_list_style: "compact" })
    )
    expect(requested).toEqual([])
  })

  it("draws a favorite whose page failed from the profile alone, and keeps the others", async () => {
    edge((path) =>
      path === "/v1/anime/4224"
        ? Response.json({ error: { code: "UPSTREAM_UNAVAILABLE", message: "down" } }, { status: 503 })
        : Response.json({ data: pages[path], meta: {} })
    )
    const { full } = await fetchFavorites(profile(), config())
    expect(full.anime).toHaveLength(3)
    expect(full.anime[1]).toEqual({
      mal_id: 4224,
      title: "Toradora!",
      image: EMBEDDED,
      start_year: 2008,
      type: "TV",
      synopsis: null,
      score: null,
      popularity: null,
      episodes: null,
      status: null,
      rank: null,
      year: null,
      genres: [],
    })
    expect(full.anime[0]?.score).toBe(8.25)
    expect(full.anime[2]?.score).toBe(8.32)
  })

  it("stops asking after the API rate-limits a request", async () => {
    const many = Array.from({ length: 8 }, (_, i) => ({ ...anime[0], malId: 100 + i }))
    const { requested } = edge(() =>
      Response.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests." } },
        { status: 429, headers: { "retry-after": "10" } }
      )
    )
    const { full } = await fetchFavorites(
      { favorites: { anime: many, manga: [], characters: [], people: [] } } as unknown as MalProfileResponse,
      config({ sections: ["anime_favorites"], anime_favorites_max: 8 })
    )
    // The first requests already in flight come back 429; the rest are never sent.
    expect(requested.length).toBeLessThan(8)
    expect(full.anime).toHaveLength(8)
    expect(full.anime.every((x) => x.score === null)).toBe(true)
  })

  it("gives up on pages that do not answer in time, without failing the card", async () => {
    vi.useFakeTimers()
    edge(() => new Promise<Response>(() => {}))
    const pending = fetchFavorites(profile(), config())
    await vi.advanceTimersByTimeAsync(DETAILS_DEADLINE_MS + 100)
    const { full } = await pending
    expect(full.anime.map((x) => x.title)).toEqual(["Nodame Cantabile", "Toradora!", "Bakemonogatari"])
    expect(full.anime.every((x) => x.score === null && x.start_year !== null)).toBe(true)
  })
})

describe("MyAnimeList favorite images", () => {
  it("falls back to MAL's resized copy when the original cannot be embedded", async () => {
    // Aisaka Taiga's original is 450x700 and 158 KB, over the 100 KB limit.
    const original = "https://cdn.myanimelist.net/images/characters/11/514086.jpg"
    vi.mocked(embedImageOrNull).mockImplementation(async (url) => (url === original ? null : EMBEDDED))
    const { basic, sectionsStatus } = await fetchFavorites(
      {
        favorites: {
          anime: [],
          manga: [],
          characters: [{ malId: 12064, name: "Aisaka, Taiga", imageUrl: original }],
          people: [],
        },
      } as unknown as MalProfileResponse,
      config({ sections: ["character_favorites"] })
    )
    expect(embedImageOrNull).toHaveBeenLastCalledWith(
      "https://cdn.myanimelist.net/r/150x240/images/characters/11/514086.jpg",
      expect.anything()
    )
    expect(basic.characters[0]).toEqual({ mal_id: 12064, name: "Aisaka, Taiga", image: EMBEDDED })
    expect(sectionsStatus.characters).toBe("complete")
  })
})
