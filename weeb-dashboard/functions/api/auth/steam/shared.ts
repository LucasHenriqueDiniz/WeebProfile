/**
 * Shared between authorize and callback. Kept out of both so the cookie name and
 * its Path cannot drift apart -- a mismatch there would make the state check fail
 * every time, and look like Steam rejecting the login.
 */
export const STATE_COOKIE = "steam_openid_state"
export const STATE_TTL_SECONDS = 600
export const COOKIE_PATH = "/api/auth/steam"
export const DEFAULT_RETURN_TO = "/dashboard/settings"

export const CLEAR_STATE_COOKIE = `${STATE_COOKIE}=; Path=${COOKIE_PATH}; HttpOnly; Secure; SameSite=Lax; Max-Age=0`

export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie")
  if (!header) return null

  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=")
    if (key === name) return rest.join("=")
  }
  return null
}
