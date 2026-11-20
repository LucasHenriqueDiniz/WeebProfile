/**
 * The clock Code Habits counts commits by. Without a time zone the hours and weekdays
 * followed the server's clock: UTC on the Worker, so a commit pushed at 22:00 in São Paulo
 * landed at 01:00 on the next day.
 */

export const DEFAULT_CODE_HABITS_TIME_ZONE = "UTC"

export interface CodeHabitsClock {
  /** The IANA zone actually used: the requested one, or UTC when it is not a valid zone. */
  timeZone: string
  /** Offset label for the card, e.g. "UTC" or "UTC-3", as of the given date. */
  offsetLabel: (date: Date) => string
  hourAndDay: (date: Date) => { hour: number; day: string }
}

function validTimeZone(timeZone: string | undefined): string {
  const candidate = timeZone?.trim()
  if (!candidate) return DEFAULT_CODE_HABITS_TIME_ZONE
  try {
    return new Intl.DateTimeFormat("en-US", { timeZone: candidate }).resolvedOptions().timeZone
  } catch {
    return DEFAULT_CODE_HABITS_TIME_ZONE
  }
}

export function codeHabitsClock(timeZone?: string): CodeHabitsClock {
  const zone = validTimeZone(timeZone)
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    weekday: "long",
    hour: "numeric",
    hourCycle: "h23",
  })
  const offset = new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "shortOffset" })

  return {
    timeZone: zone,
    offsetLabel: (date) => {
      const name = offset.formatToParts(date).find((p) => p.type === "timeZoneName")?.value ?? "GMT"
      // ICU writes the zero offset as "GMT" or "GMT+0" depending on the zone and version.
      return name.replace(/^GMT/, "UTC").replace(/^UTC[+-]0$/, "UTC")
    },
    hourAndDay: (date) => {
      const byType = Object.fromEntries(parts.formatToParts(date).map((p) => [p.type, p.value]))
      return { hour: Number(byType.hour) % 24, day: byType.weekday ?? "" }
    },
  }
}
