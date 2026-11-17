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
