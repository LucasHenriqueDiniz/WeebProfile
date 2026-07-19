import { describe, expect, it, vi } from "vitest"

vi.mock("../../../utils/image-to-base64", () => ({ urlToDataUriDirect: vi.fn() }))

import { urlToDataUriDirect } from "../../../utils/image-to-base64"
import { transformLastUpdates } from "./last-updates"

describe("transformLastUpdates", () => {
  it("maps Jikan Edge updates and embeds imageUrl values", async () => {
    vi.mocked(urlToDataUriDirect).mockResolvedValue({ dataUri: "data:image/jpeg;base64,AAAA", mime: "image/jpeg", byteLength: 4 })
    const result = await transformLastUpdates(
      {
        data: {
          anime: [{ entry: { title: "Anime", imageUrl: "https://cdn.example/anime.jpg" }, score: null, status: "watching", progress: 3, total: 12, date: "2026-07-19T00:00:00Z" }],
          manga: [{ entry: { title: "Manga", imageUrl: null }, score: 8, status: "on hold", progress: 2, total: null, date: "2026-07-18T00:00:00Z" }],
        },
      },
      {} as never
    )

    expect(result.anime[0]).toMatchObject({ image: "data:image/jpeg;base64,AAAA", status: "Watching", episodes_seen: 3, episodes_total: 12 })
    expect(result.manga[0]).toMatchObject({ image: null, status: "On Hold", chapters_read: 2, chapters_total: null })
    expect(urlToDataUriDirect).toHaveBeenCalledTimes(1)
  })
})
