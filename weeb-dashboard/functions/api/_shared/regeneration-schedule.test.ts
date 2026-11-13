import { describe, it, expect } from "vitest"
import { nightsFrom, retryDelayNights } from "./regeneration-schedule"

describe("retryDelayNights", () => {
  it.each([
    [1, 1],
    [2, 2],
    [3, 4],
    [4, 7],
    [20, 7],
  ])("waits %i failure(s) -> %i night(s)", (failCount, nights) => {
    expect(retryDelayNights(failCount)).toBe(nights)
  })

  it("never schedules the retry for tonight", () => {
    expect(retryDelayNights(0)).toBeGreaterThanOrEqual(1)
  })
})

describe("nightsFrom", () => {
  // The next run starts at about the same minute as this one; landing at exactly
  // +24h would miss it by seconds and cost the SVG a whole day.
  it("lands before the run that starts at the same minute on that night", () => {
    const tonight = new Date("2026-11-13T03:07:30.000Z")
    const tomorrowsRun = new Date("2026-11-14T03:07:01.000Z")

    expect(new Date(nightsFrom(tonight, 1)).getTime()).toBeLessThanOrEqual(tomorrowsRun.getTime())
  })

  it("stays after the run before it", () => {
    const tonight = new Date("2026-11-13T03:07:30.000Z")

    expect(nightsFrom(tonight, 2) > "2026-11-14T03:07:30.000Z").toBe(true)
  })
})
