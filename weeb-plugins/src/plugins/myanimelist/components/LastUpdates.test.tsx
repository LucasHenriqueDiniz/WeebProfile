import React from "react"
import { renderToString } from "react-dom/server"
import { describe, expect, it } from "vitest"
import type { LastUpdatesAnime, LastUpdatesManga, MyAnimeListConfig } from "../types"
import { LastUpdates } from "./LastUpdates"

// As Jikan Edge sent them for a real profile (Amayacrab, 2026-11-17): a manga still
// running has no total.
const completed: LastUpdatesAnime = {
  title: "Ore dake Level Up na Ken Season 2",
  image: null,
  score: 6,
  status: "Completed",
  episodes_seen: 13,
  episodes_total: 13,
  date: "2026-04-14T21:21:00Z",
}
const readingNoTotal: LastUpdatesManga = {
  title: "The Shepherd Wizard",
  image: null,
  score: 5,
  status: "Reading",
  chapters_read: 41,
  chapters_total: null,
  date: "2026-10-22T05:43:00Z",
}
const completedNoTotal: LastUpdatesManga = { ...readingNoTotal, title: "Finished one-shot", status: "Completed" }

function render(style: "default" | "terminal", update: LastUpdatesAnime | LastUpdatesManga): string {
  const data = "episodes_total" in update ? { anime: [update], manga: [] } : { anime: [], manga: [update] }
  const html = renderToString(
    <LastUpdates
      data={data}
      config={{ last_activity_max: 5 } as unknown as MyAnimeListConfig}
      style={style}
      size="half"
    />
  )
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, " ")
}

describe("MyAnimeList activity progress", () => {
  it("terminal: progress with a total is its percentage", () => {
    expect(render("terminal", completed)).toContain("100 %")
    expect(render("terminal", completed)).toContain("13 / 13")
  })

  // Read 41 chapters of a manga with no total: the card said 0% over an empty bar.
  it("terminal: progress with no total is unknown, not 0%", () => {
    const text = render("terminal", readingNoTotal)
    expect(text).toContain("? %")
    expect(text).not.toContain("0 %")
    expect(text).toContain("41 / ?")
  })

  it("terminal: a completed entry is full even with no total", () => {
    expect(render("terminal", completedNoTotal)).toContain("100 %")
  })

  // The default bar is drawn at 50% as a placeholder when there is no total; its label
  // said "50%", as if it were the progress.
  it("default: progress with no total is labelled ?, not the placeholder's 50%", () => {
    const text = render("default", readingNoTotal)
    expect(text).not.toContain("50%")
    expect(text).toContain("41 / ?")
  })
})
