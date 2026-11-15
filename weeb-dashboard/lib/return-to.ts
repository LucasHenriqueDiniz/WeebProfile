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

/** `/login?return_to=…` and `/signup?return_to=…`: where to go once signed in. */
export const RETURN_TO_PARAM = "return_to"

/**
 * Kept for the rest of the tab's life. Clerk moves between its own sub-routes
 * (`/signup/verify-email-address`, `/login/factor-one`) without our query string, and
 * each is a separate route that mounts the page again: without a copy, a visitor who
 * signs up with an email code would land on /dashboard instead of where they came from.
 */
const STORAGE_KEY = "weeb:return_to"

function stored(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

/**
 * The destination for this sign-in, validated, or null for the caller's own default.
 *
 * From the query when it has one, which is then remembered for this tab. On one of
 * Clerk's sub-routes (`/login/…`, `/signup/…`), which drop the query, from what was
 * remembered. On the bare `/login` or `/signup` without one, a remembered destination is
 * dropped: it belongs to a sign-in that was abandoned, and must not take over this one.
 */
export function readReturnTo(location: Pick<Location, "search" | "origin" | "pathname">): string | null {
  const fromQuery = new URLSearchParams(location.search).get(RETURN_TO_PARAM)
  const onSubRoute = location.pathname.split("/").filter(Boolean).length > 1
  if (!fromQuery && !onSubRoute) {
    forgetReturnTo()
    return null
  }

  const safe = safeReturnTo(fromQuery ?? stored(), location.origin, "")
  if (!safe) return null
  try {
    sessionStorage.setItem(STORAGE_KEY, safe)
  } catch {
    // Without storage it still works for every flow that stays on one route.
  }
  return safe
}

/** Called once the destination has been reached, so a later sign-in in this tab does not reuse it. */
export function forgetReturnTo(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing stored, then.
  }
}

/** `path` carrying `returnTo`, for the links between /login and /signup. */
export function withReturnTo(path: string, returnTo: string | null): string {
  return returnTo ? `${path}?${RETURN_TO_PARAM}=${encodeURIComponent(returnTo)}` : path
}
