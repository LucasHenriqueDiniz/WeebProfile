import { describe, it, expect, vi, beforeEach } from "vitest"
import { getBasicFavorites } from "./favorites"
import type { MalProfileResponse } from "./profile"

vi.mock("../../../utils/image-to-base64", () => ({
  urlToDataUriDirect: vi.fn(),
}))

import { urlToDataUriDirect } from "../../../utils/image-to-base64"

function makeAnimeItem(id: number) {
  return {
    mal_id: id,
    title: `Anime ${id}`,
    type: "TV",
    start_year: 2020,
    images: {
      jpg: {
        image_url: `https://cdn.example/${id}.jpg`,
        large_image_url: `https://cdn.example/${id}-large.jpg`,
        small_image_url: `https://cdn.example/${id}-small.jpg`,
      },
      webp: { image_url: "", large_image_url: "", small_image_url: "" },
    },
  }
}

function makeCharacterItem(id: number) {
  return {
    mal_id: id,
    name: `Character ${id}`,
    images: {
      jpg: { image_url: `https://cdn.example/char-${id}.jpg` },
      webp: { image_url: "" },
    },
  }
}

function makeProfile(favorites: Partial<MalProfileResponse["favorites"]>): MalProfileResponse {
  return {
    favorites: {
      anime: [],
      manga: [],
      characters: [],
      people: [],
      ...favorites,
    },
  } as unknown as MalProfileResponse
}

const noLimits = { animeMax: 0, mangaMax: 0, charactersMax: 0, peopleMax: 0 }

describe("getBasicFavorites section status", () => {
  beforeEach(() => {
    vi.mocked(urlToDataUriDirect).mockReset()
  })

  it("marks a section as 'complete' when it wasn't requested (max = 0)", async () => {
    const profile = makeProfile({ anime: [makeAnimeItem(1)] })
    const result = await getBasicFavorites(profile, noLimits, { previewMode: true })
    expect(result.sectionsStatus.anime).toBe("complete")
    expect(result.anime).toHaveLength(0)
  })

  it("marks a section as 'empty' when requested but the user genuinely has 0 favorites", async () => {
    const profile = makeProfile({ anime: [] })
    const result = await getBasicFavorites(profile, { ...noLimits, animeMax: 20 }, { previewMode: true })
    expect(result.sectionsStatus.anime).toBe("empty")
  })

  it("uses small_image_url, not image_url/large_image_url, for anime and manga covers", async () => {
    vi.mocked(urlToDataUriDirect).mockResolvedValue({
      dataUri: "data:image/jpeg;base64,AAAA",
      mime: "image/jpeg",
      byteLength: 10,
    })
    const profile = makeProfile({ anime: [makeAnimeItem(1)] })
    await getBasicFavorites(profile, { ...noLimits, animeMax: 20 }, { previewMode: false })
    expect(urlToDataUriDirect).toHaveBeenCalledWith("https://cdn.example/1-small.jpg", expect.anything())
  })

  it("marks a section as 'complete' when all images embed successfully", async () => {
    vi.mocked(urlToDataUriDirect).mockResolvedValue({
      dataUri: "data:image/jpeg;base64,AAAA",
      mime: "image/jpeg",
      byteLength: 10,
    })
    const profile = makeProfile({ anime: [makeAnimeItem(1), makeAnimeItem(2)] })
    const result = await getBasicFavorites(profile, { ...noLimits, animeMax: 20 }, { previewMode: false })
    expect(result.sectionsStatus.anime).toBe("complete")
    expect(result.anime).toHaveLength(2)
    expect(result.anime[0]?.image).toBe("data:image/jpeg;base64,AAAA")
  })

  it("marks a section as 'partial' when at least one (but not all) image fails to embed, without turning real favorites into an empty list", async () => {
    vi.mocked(urlToDataUriDirect)
      .mockResolvedValueOnce({ dataUri: "data:image/jpeg;base64,AAAA", mime: "image/jpeg", byteLength: 10 })
      .mockRejectedValueOnce(new Error("thumbnail unavailable"))
    const profile = makeProfile({ anime: [makeAnimeItem(1), makeAnimeItem(2)] })
    const result = await getBasicFavorites(profile, { ...noLimits, animeMax: 20 }, { previewMode: false })
    expect(result.sectionsStatus.anime).toBe("partial")
    expect(result.anime).toHaveLength(2) // both real favorites are still present
    expect(result.anime[1]?.image).toBeNull() // failed item just has no image, not omitted, and never ""
  })

  it("produces a controlled empty image (not a thrown error) when a character has no usable image field", async () => {
    const profile = makeProfile({
      characters: [{ mal_id: 1, name: "No Image", images: { jpg: { image_url: "" }, webp: { image_url: "" } } }] as any,
    })
    const result = await getBasicFavorites(profile, { ...noLimits, charactersMax: 20 }, { previewMode: false })
    expect(result.sectionsStatus.characters).toBe("complete") // no image to fetch isn't a failure
    expect(result.characters[0]?.image).toBeNull()
    expect(urlToDataUriDirect).not.toHaveBeenCalled()
  })

  it("marks a section as 'unavailable' (not 'empty') when that category's own processing throws, without sinking the other categories", async () => {
    vi.mocked(urlToDataUriDirect).mockResolvedValue({
      dataUri: "data:image/jpeg;base64,AAAA",
      mime: "image/jpeg",
      byteLength: 10,
    })
    const profile = {
      favorites: {
        anime: [makeAnimeItem(1)],
        manga: [],
        // A getter that throws simulates a malformed/unexpected profile shape for this
        // one category specifically -- Promise.allSettled must isolate it.
        get characters() {
          throw new Error("malformed characters payload")
        },
        people: [],
      },
    } as unknown as MalProfileResponse

    const result = await getBasicFavorites(
      profile,
      { animeMax: 20, mangaMax: 0, charactersMax: 20, peopleMax: 0 },
      { previewMode: false }
    )

    expect(result.sectionsStatus.characters).toBe("unavailable")
    expect(result.characters).toHaveLength(0)
    // anime, an independent category, must still succeed
    expect(result.sectionsStatus.anime).toBe("complete")
    expect(result.anime).toHaveLength(1)
  })

  it("uses the character's real image_url (no small variant exists) rather than inventing one", async () => {
    vi.mocked(urlToDataUriDirect).mockResolvedValue({
      dataUri: "data:image/jpeg;base64,AAAA",
      mime: "image/jpeg",
      byteLength: 10,
    })
    const profile = makeProfile({ characters: [makeCharacterItem(1)] })
    await getBasicFavorites(profile, { ...noLimits, charactersMax: 20 }, { previewMode: false })
    expect(urlToDataUriDirect).toHaveBeenCalledWith("https://cdn.example/char-1.jpg", expect.anything())
  })
})
