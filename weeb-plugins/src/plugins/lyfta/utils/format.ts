/**
 * Number, date and duration formatting for the Lyfta sections.
 *
 * Every mass the Lyfta API returns is in kg: `total_volume` and `set.weight` alike.
 * The helpers this replaced took grams, and the sections passed kg to some of them,
 * so a 152,914 kg lifetime volume was drawn as "152.9146" in one place and "152.91kg"
 * in another, and a 5,840 kg workout as "6kg".
 */

export type WeightUnit = "kg" | "lbs"

const LBS_PER_KG = 2.20462
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function toUnit(kg: number, unit: WeightUnit): number {
  return unit === "lbs" ? kg * LBS_PER_KG : kg
}

function withThousands(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

/** A whole number with separators up to 99,999, then one decimal and a "k": "5,840", "152.9k". */
export function formatAmount(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "0"
  if (value >= 100_000) return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`
  return withThousands(Math.round(value))
}

/** A volume (kg) in the card's unit: "5,840 kg", "152.9k kg", "12,875 lbs". */
export function formatVolume(kg: number, unit: WeightUnit = "kg"): string {
  return `${formatAmount(toUnit(kg, unit))} ${unit}`
}

/** One load (kg) in the card's unit, keeping a half plate: "20 kg", "12.5 kg", "44 lbs". */
export function formatLoad(kg: number, unit: WeightUnit = "kg"): string {
  const value = toUnit(kg, unit)
  const rounded = unit === "lbs" ? Math.round(value) : Math.round(value * 10) / 10
  return `${rounded} ${unit}`
}

/** "Dec 1", from Lyfta's "2025-12-01 23:33:34". */
export function formatDay(date: string): string {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ""
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`
}

/** The parts of a calendar badge: { month: "DEC", day: "1" }. */
export function calendarParts(date: string): { month: string; day: string } {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return { month: "", day: "" }
  return { month: (MONTHS[d.getMonth()] ?? "").toUpperCase(), day: String(d.getDate()) }
}

/** "Aug 2025". */
export function formatMonthYear(date: string): string {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ""
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

/** Minutes in Lyfta's "HH:MM:SS"; 0 when absent or unparsable. */
export function durationMinutes(duration: string | null | undefined): number {
  const parts = (duration ?? "").split(":")
  if (parts.length !== 3) return 0
  const [h, m, s] = parts.map((p) => parseInt(p, 10) || 0)
  return (h ?? 0) * 60 + (m ?? 0) + (s ?? 0) / 60
}

/** "1h 05m", "45m"; an em dash when nothing was timed. */
export function formatDuration(minutes: number): string {
  const total = Math.round(minutes)
  if (total <= 0) return "—"
  const h = Math.floor(total / 60)
  const m = total % 60
  return h > 0 ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`
}

/** "Pull #1 (Back,Biceps)" → { name: "Pull #1", muscles: ["Back", "Biceps"] }, the way Lyfta names a routine. */
export function parseWorkoutTitle(raw: string): { name: string; muscles: string[] } {
  const match = raw.match(/^(.*?)\s*\(([^)]+)\)\s*$/)
  if (match?.[1] && match[2]) {
    return {
      name: match[1].trim(),
      muscles: match[2]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }
  }
  return { name: raw.trim(), muscles: [] }
}

export function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`
}

/** At most `max` characters, with an ellipsis when cut: for terminal values, which do not truncate. */
export function clip(text: string, max: number): string {
  const trimmed = text.trim()
  return trimmed.length > max ? `${trimmed.slice(0, max - 1).trimEnd()}…` : trimmed
}
