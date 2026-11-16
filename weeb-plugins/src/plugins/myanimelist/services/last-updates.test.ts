import { describe, expect, it, vi } from "vitest"

vi.mock("../../../utils/image-to-base64", () => ({ urlToDataUriDirect: vi.fn() }))

import { urlToDataUriDirect } from "../../../utils/image-to-base64"
import { transformLastUpdates } from "./last-updates"

describe("transformLastUpdates", () => {
  it("maps Jikan Edge updates and embeds imageUrl values", async () => {
    vi.mocked(urlToDataUriDirect).mockResolvedValue({
      dataUri: "data:image/jpeg;base64,AAAA",
      mime: "image/jpeg",
      byteLength: 4,
    })
    const result = await transformLastUpdates(
      {
        data: {
          anime: [
            {
              entry: { title: "Anime", imageUrl: "https://cdn.example/anime.jpg" },
              score: null,
              status: "watching",
              progress: 3,
              total: 12,
              date: "2026-07-19T00:00:00Z",
            },
          ],
          manga: [
            {
              entry: { title: "Manga", imageUrl: null },
              score: 8,
              status: "on hold",
              progress: 2,
              total: null,
              date: "2026-07-18T00:00:00Z",
            },
          ],
        },
      },
      {} as never
    )

    expect(result.anime[0]).toMatchObject({
      image: "data:image/jpeg;base64,AAAA",
      status: "Watching",
      episodes_seen: 3,
      episodes_total: 12,
    })
    expect(result.manga[0]).toMatchObject({ image: null, status: "On Hold", chapters_read: 2, chapters_total: null })
    expect(urlToDataUriDirect).toHaveBeenCalledTimes(1)
  })

  // As Jikan Edge sent it for a real profile (Amayacrab, 2026-11-16). React escapes the
  // text again, so the card read "Guardian&#039;s" instead of "Guardian's".
  it("decodes the HTML entities the scraped titles arrive with", async () => {
    const update = (title: string) => ({
      entry: { title, imageUrl: null },
      score: null,
      status: "reading",
      progress: null,
      total: null,
      date: "2026-10-01T00:00:00Z",
    })

    const result = await transformLastUpdates(
      {
        data: {
          anime: [update("Rock &amp; Roll &quot;Live&quot;")],
          manga: [update("I Became the Sea Guardian&#039;s Adopted Daughter")],
        },
      },
      {} as never
    )

    expect(result.anime[0]!.title).toBe('Rock & Roll "Live"')
    expect(result.manga[0]!.title).toBe("I Became the Sea Guardian's Adopted Daughter")
  })
})
