import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeAll, describe, expect, it, vi } from "vitest"
import { ANIMATION_TIMING, AnimationsProvider, WAVE_ROWS, sectionTail } from "../../../templates/animations"
import { getMockGithubData } from "../services/mock-data"
import type { GithubConfig, GithubData } from "../types"
import { GithubCalendar } from "./Calendar"

type Calendar = GithubData["calendar"]

let oneYear: Calendar
let threeYears: Calendar

beforeAll(async () => {
  // The mock embeds avatars from the network; the calendar has none, so no requests.
  const fetch = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("no network in calendar tests"))
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
  try {
    oneYear = (await getMockGithubData()).calendar
  } finally {
    fetch.mockRestore()
    warn.mockRestore()
  }
  // A partial current year above two whole ones, as the "full" year mode fetches them.
  const years = [2026, 2025, 2024].map((year, i) => ({
    year,
    totalContributions: 100,
    weeks: i === 0 ? oneYear.weeks.slice(0, 20) : oneYear.weeks,
  }))
  threeYears = { ...oneYear, years }
})

function render(calendar: Calendar, size: "half" | "full", animations?: boolean): string {
  const node = <GithubCalendar data={calendar} config={{} as GithubConfig} style="default" size={size} />
  return renderToStaticMarkup(
    animations === undefined ? node : <AnimationsProvider enabled={animations}>{node}</AnimationsProvider>
  )
}

/** The wave as the markup gives it: the gap between diagonals, and each column's place in render order. */
function waveOf(html: string): { step: number; places: number[] } {
  const step = Number(/--weeb-wave:([\d.]+)s/.exec(html)?.[1])
  const places = [...html.matchAll(/class="flex flex-col weeb-wave" style="[^"]*--weeb-c:(\d+)"/g)].map((m) =>
    Number(m[1])
  )
  return { step, places }
}

const cases = [
  ["one year, half", () => oneYear, "half"],
  ["one year, full", () => oneYear, "full"],
  ["three years, half", () => threeYears, "half"],
  ["three years, full", () => threeYears, "full"],
] as const

describe("GithubCalendar with animations off", () => {
  it.each(cases)("%s carries no animation markup", (_, calendar, size) => {
    const html = render(calendar(), size, false)
    expect(html).toBe(render(calendar(), size))
    expect(html).not.toContain("weeb-")
  })
})

describe("GithubCalendar wave", () => {
  // Mock year in half size: 53 weeks drawn as 27 columns over 26.
  it("starts at the top right cell and ends at the bottom left one", () => {
    const { places } = waveOf(render(oneYear, "half", true))
    expect(places).toHaveLength(53)
    const top = places.slice(0, 27)
    const bottom = places.slice(27)
    // Right to left in each row of weeks, one step per column.
    expect(top).toEqual(top.map((_, x) => 26 - x))
    // The row below continues where the rows of the one above end, at the same columns.
    expect(bottom).toEqual(bottom.map((_, x) => 26 - x + WAVE_ROWS))
    expect(Math.min(...places)).toBe(top.at(-1))
    expect(Math.max(...places)).toBe(bottom[0])
  })

  it("runs one wave over every year, top year first", () => {
    const { places } = waveOf(render(threeYears, "full", true))
    // 20 weeks, then two whole years, each in a block below the one before.
    expect(places.slice(0, 20)).toEqual(places.slice(0, 20).map((_, x) => 52 - x))
    expect(places[20]).toBe(52 + WAVE_ROWS)
    expect(places[73]).toBe(52 + 2 * WAVE_ROWS)
  })

  // The cells start with the section's content, and the last one has to be in place when
  // the rest of the section is: the wave may not make the card longer.
  it.each(cases)("%s ends with the rest of its section", (_, calendar, size) => {
    const t = ANIMATION_TIMING
    const { step, places } = waveOf(render(calendar(), size, true))
    expect(step).toBeGreaterThan(0)
    const lastStart = t.contentDelay + (Math.max(...places) + WAVE_ROWS - 1) * step
    expect(lastStart).toBeLessThanOrEqual(t.contentDelay + t.wave)
    expect(lastStart).toBeGreaterThan(t.contentDelay + t.wave - 0.001)
    expect(lastStart + t.cell).toBeLessThanOrEqual(sectionTail("default"))
  })

  it("adds no time to a default section", () => {
    const t = ANIMATION_TIMING
    expect(sectionTail("default")).toBeCloseTo(t.contentDelay + t.fill, 10)
  })
})
