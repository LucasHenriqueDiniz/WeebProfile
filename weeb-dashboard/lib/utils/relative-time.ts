/** "2h ago" style timestamp — falls back to the plain date past a week. */
export function formatRelative(iso: string | null | undefined, locale: string): string {
  if (!iso) return "—"
  const date = new Date(iso)
  const diffMs = date.getTime() - Date.now()
  const diffMin = Math.round(diffMs / 60_000)
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minute")
  const diffHours = Math.round(diffMin / 60)
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hour")
  const diffDays = Math.round(diffHours / 24)
  if (Math.abs(diffDays) < 7) return rtf.format(diffDays, "day")
  return date.toLocaleDateString(locale)
}
