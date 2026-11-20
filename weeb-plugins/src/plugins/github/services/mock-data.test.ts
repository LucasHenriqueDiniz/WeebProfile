import { describe, expect, it, vi } from "vitest"
import { getMockGithubData } from "./mock-data"

const sumOfDays = (weeks: Array<{ contributionDays: Array<{ contributionCount: number }> }>) =>
  weeks.flatMap((week) => week.contributionDays).reduce((sum, day) => sum + day.contributionCount, 0)

/**
 * GitHub's calendar total is the sum of its days (3987 of 3987 on a real account, 17/11/2026).
 * The mock's calendar said 844 over days that add up to 992, and the dashboard's calendar
 * previews printed 844.
 */
describe("GitHub mock calendars", () => {
  it("total their days, as GitHub's do", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {})
    const mock = await getMockGithubData()
    expect(mock.calendar.totalContributions).toBe(sumOfDays(mock.calendar.weeks))
    expect(mock.user.contributionCalendar.totalContributions).toBe(sumOfDays(mock.user.contributionCalendar.weeks))
  })
})

/** The punch card and the bars draw the same mock commits: its rows and columns add up to them. */
describe("GitHub mock code habits", () => {
  it("counts the same commits by weekday × hour as by weekday and by hour", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {})
    const { codeHabits } = await getMockGithubData()
    const matrix = codeHabits.commitsByDayHour ?? {}
    for (const [day, count] of Object.entries(codeHabits.commitsByDay)) {
      expect(matrix[day]?.reduce((a, b) => a + b, 0)).toBe(count)
    }
    for (let hour = 0; hour < 24; hour++) {
      const column = Object.values(matrix).reduce((sum, row) => sum + (row[hour] ?? 0), 0)
      expect(column).toBe(codeHabits.commitsByHour[hour] ?? 0)
    }
  })
})
