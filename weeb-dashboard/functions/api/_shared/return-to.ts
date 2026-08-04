/**
 * Validates a caller-supplied post-login destination.
 *
 * Any redirect target that arrives in a query parameter is an open redirect
 * waiting to happen: the callback would happily send a user to an attacker's site
 * carrying our domain's credibility. Only same-origin paths are allowed, and the
 * check is a whitelist -- parse it, confirm the origin matches, hand back only the
 * path -- rather than a blacklist of prefixes, which is what tends to get bypassed
 * by "//evil.example" or "/\evil.example".
 */
export function safeReturnTo(candidate: string | null, origin: string, fallback: string): string {
  if (!candidate) return fallback

  let parsed: URL
  try {
    parsed = new URL(candidate, origin)
  } catch {
    return fallback
  }

  if (parsed.origin !== origin) return fallback
  return `${parsed.pathname}${parsed.search}${parsed.hash}`
}
