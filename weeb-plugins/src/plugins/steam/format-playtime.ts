/**
 * Steam playtime, which the API gives in minutes: "852d 23h", "3h", "51m".
 *
 * Each section had its own copy. The statistics one floored anything under an hour to
 * "0h", so 51 minutes in the last two weeks read as nothing played; the recent games one
 * had no days and showed 20471h for a library played 852 days.
 */
export function formatPlaytime(minutes: number): string {
  const total = Math.max(0, Math.floor(minutes))
  const hours = Math.floor(total / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h`
  return `${total}m`
}
