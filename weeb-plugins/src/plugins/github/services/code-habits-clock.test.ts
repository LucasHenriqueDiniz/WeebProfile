import { describe, expect, it } from "vitest"
import { codeHabitsClock } from "./code-habits-clock"

// Tuesday 17/11/2026 01:30 UTC is Monday 22:30 in São Paulo (UTC-3, no daylight saving).
const LATE_MONDAY_IN_BRAZIL = new Date("2026-11-17T01:30:00Z")

describe("codeHabitsClock", () => {
  it("counts on UTC by default, whatever the machine's own zone", () => {
    const clock = codeHabitsClock()
    expect(clock.timeZone).toBe("UTC")
    expect(clock.hourAndDay(LATE_MONDAY_IN_BRAZIL)).toEqual({ hour: 1, day: "Tuesday" })
    expect(clock.offsetLabel(LATE_MONDAY_IN_BRAZIL)).toBe("UTC")
  })

  it("moves the hour and the weekday to the requested zone", () => {
    const clock = codeHabitsClock("America/Sao_Paulo")
    expect(clock.hourAndDay(LATE_MONDAY_IN_BRAZIL)).toEqual({ hour: 22, day: "Monday" })
    expect(clock.offsetLabel(LATE_MONDAY_IN_BRAZIL)).toBe("UTC-3")
  })

  it("labels half-hour offsets", () => {
    expect(codeHabitsClock("Asia/Kolkata").offsetLabel(LATE_MONDAY_IN_BRAZIL)).toBe("UTC+5:30")
  })

  it("draws midnight as hour 0, not 24", () => {
    expect(codeHabitsClock("UTC").hourAndDay(new Date("2026-11-17T00:05:00Z")).hour).toBe(0)
  })

  it.each(["", "  ", "Mars/Olympus_Mons", "not a zone"])("falls back to UTC for %j", (zone) => {
    expect(codeHabitsClock(zone).timeZone).toBe("UTC")
  })
})
