import { describe, expect, it } from "vitest"
import type { GithubData } from "../types"
import { codeHabitsHighlights, codeHabitsVariant, dayHourMatrix, level } from "./code-habits-insights"

type Habits = GithubData["codeHabits"]

const habits = (extra: Partial<Habits> = {}): Habits => ({
  commitsByHour: { 13: 88, 22: 45, 9: 12 },
  commitsByDay: { Monday: 50, Tuesday: 95 },
  languages: {},
  analyzedCommits: 145,
  ...extra,
})

describe("codeHabitsVariant", () => {
  it("draws the bars unless another layout is asked for", () => {
    expect(codeHabitsVariant({} as never, habits())).toBe("bars")
    expect(codeHabitsVariant({ code_habits_variant: "summary" } as never, habits())).toBe("summary")
  })

  it("falls back to the bars when a punch card has no weekday × hour counts", () => {
    const asked = { code_habits_variant: "punchcard" } as never
    expect(codeHabitsVariant(asked, habits())).toBe("bars")
    expect(codeHabitsVariant(asked, habits({ commitsByDayHour: {} }))).toBe("bars")
    expect(codeHabitsVariant(asked, habits({ commitsByDayHour: { Tuesday: Array(24).fill(0) } }))).toBe("bars")
    const tuesday = Array<number>(24).fill(0)
    tuesday[13] = 3
    expect(codeHabitsVariant(asked, habits({ commitsByDayHour: { Tuesday: tuesday } }))).toBe("punchcard")
  })
})

describe("dayHourMatrix", () => {
  it("puts the weekdays in calendar order and fills missing hours with zero", () => {
    const matrix = dayHourMatrix(habits({ commitsByDayHour: { Saturday: [1], Sunday: [0, 2] } }))!
    expect(matrix).toHaveLength(7)
    expect(matrix[0]).toEqual([0, 2, ...Array(22).fill(0)])
    expect(matrix[6]).toEqual([1, ...Array(23).fill(0)])
  })
})

describe("codeHabitsHighlights", () => {
  it("names the peak hour, the busiest day and the part of the day with most commits", () => {
    expect(codeHabitsHighlights(habits())).toEqual({
      peakHour: { hour: 13, commits: 88 },
      busiestDay: { day: "Tuesday", commits: 95 },
      // 12h–18h: 88 of 145
      rhythm: { label: "Afternoon", share: 61 },
    })
  })

  it("leaves everything out when there are no commits, instead of naming midnight and Sunday", () => {
    expect(codeHabitsHighlights(habits({ commitsByHour: {}, commitsByDay: {} }))).toEqual({
      peakHour: undefined,
      busiestDay: undefined,
      rhythm: undefined,
    })
  })
})

describe("level", () => {
  it.each([
    [0, 10, 0],
    [1, 10, 1],
    [3, 10, 2],
    [6, 10, 3],
    [10, 10, 4],
  ])("%i of %i is level %i", (value, max, expected) => {
    expect(level(value, max)).toBe(expected)
  })
})
