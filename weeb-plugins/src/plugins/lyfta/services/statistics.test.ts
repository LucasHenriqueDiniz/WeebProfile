import { describe, it, expect } from "vitest"
import { mockAsOfToday, weekStreaks } from "./fetchData"
import { getMockLyftaData } from "./mock-data"
import { overviewSummary, statisticsSummary } from "../selection"
import { formatAmount, formatLoad, formatVolume } from "../utils/format"

// Wednesday 2026-11-18, noon UTC. Weeks start on Monday: this week began on the 16th.
const NOW = new Date(Date.UTC(2026, 10, 18, 12))

describe("weekStreaks", () => {
  it("counts weeks in a row, not days: three sessions a week is a streak", () => {
    // Mon/Wed/Fri of the last three weeks, rest days in between.
    const dates = ["2026-11-02", "2026-11-04", "2026-11-06", "2026-11-09", "2026-11-11", "2026-11-13", "2026-11-16"]
    expect(weekStreaks(dates, NOW)).toEqual({ currentStreak: 3, longestStreak: 3 })
  })

  it("keeps the streak alive through a week in progress with no workout yet", () => {
    expect(weekStreaks(["2026-11-03", "2026-11-10"], NOW)).toEqual({ currentStreak: 2, longestStreak: 2 })
  })

  it("breaks the current streak after a whole week off, and remembers the longest", () => {
    const dates = ["2026-10-05", "2026-10-12", "2026-10-19", "2026-10-26", "2026-11-16"]
    expect(weekStreaks(dates, NOW)).toEqual({ currentStreak: 1, longestStreak: 4 })
  })

  it("is zero without workouts", () => {
    expect(weekStreaks([], NOW)).toEqual({ currentStreak: 0, longestStreak: 0 })
  })
})

describe("mockAsOfToday", () => {
  it("moves the 2025 mock so the overview has workouts in its last 30 days", async () => {
    const original = await getMockLyftaData()
    expect(overviewSummary(original, 30, NOW).workouts).toBe(0)

    const moved = mockAsOfToday(original, NOW)

    expect(overviewSummary(moved, 30, NOW).workouts).toBeGreaterThan(0)
    expect(moved.statistics.currentStreak).toBeGreaterThan(0)
    // Whole days: each workout keeps its time of day.
    expect(moved.workouts[0]!.workout_perform_date.slice(11)).toBe(original.workouts[0]!.workout_perform_date.slice(11))
  })
})

describe("formatting: every Lyfta mass is kg", () => {
  it("draws the mock's lifetime volume as kg, not divided by 1000", async () => {
    const data = await getMockLyftaData()
    // 152,914.6 kg: drawn as "152.9146" and "152.91kg" before.
    expect(formatVolume(statisticsSummary(data).volume)).toBe("152.9k kg")
  })

  it("keeps separators below 100k and converts lbs", () => {
    expect(formatVolume(5840)).toBe("5,840 kg")
    expect(formatVolume(5840, "lbs")).toBe("12,875 lbs")
    expect(formatLoad(12.5)).toBe("12.5 kg")
    expect(formatLoad(100, "lbs")).toBe("220 lbs")
    expect(formatAmount(0)).toBe("0")
  })
})
