/**
 * Steam OpenID 2.0 -- the "Sign in through Steam" flow.
 *
 * Worth being precise about what this is, because the naming invites the opposite
 * assumption: it is authentication, not API authorisation. Steam hands back a
 * SteamID64 and nothing else -- no token, no scope, no ability to call anything on
 * the user's behalf. Reading their public profile still uses the application's own
 * Web API key (see svg-generator/src/db/app-credentials.ts). The two are unrelated,
 * which is why the key could be removed without this.
 *
 * So the only thing this buys is proof that the person configuring a card actually
 * owns the account, plus not having to hunt down a 17-digit id.
 */

const STEAM_LOGIN_URL = "https://steamcommunity.com/openid/login"
const CLAIMED_ID_PREFIX = "https://steamcommunity.com/openid/id/"

/**
 * Builds the redirect that sends the user to Steam.
 *
 * identifier_select in both identity and claimed_id is what tells Steam "we do not
 * know who this is yet, ask them" -- the provider fills both in on the way back.
 */
export function buildAuthUrl(returnTo: string, realm: string): string {
  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": returnTo,
    "openid.realm": realm,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  })
  return `${STEAM_LOGIN_URL}?${params.toString()}`
}

/**
 * Pulls the SteamID64 out of the claimed_id Steam echoes back.
 *
 * Strict on the prefix and on the shape: a SteamID64 is 17 digits. Anything else
 * means the callback was not produced by the flow we started.
 */
export function parseClaimedId(claimedId: string | null): string | null {
  if (!claimedId || !claimedId.startsWith(CLAIMED_ID_PREFIX)) return null
  const id = claimedId.slice(CLAIMED_ID_PREFIX.length)
  return /^\d{17}$/.test(id) ? id : null
}

/**
 * Body for the check_authentication round-trip.
 *
 * This step is not optional and is the whole security of the flow. Everything in
 * the callback arrives as query parameters the caller controls, so without asking
 * Steam to confirm it signed them, anyone could hit the callback with any
 * SteamID64 and claim that account. We echo every openid.* parameter back
 * unchanged and only swap the mode.
 */
export function buildVerificationBody(params: URLSearchParams): URLSearchParams {
  const body = new URLSearchParams()
  for (const [key, value] of params) {
    if (key.startsWith("openid.")) body.set(key, value)
  }
  body.set("openid.mode", "check_authentication")
  return body
}

/**
 * Steam answers key:value lines. Only an explicit is_valid:true counts -- treating
 * anything else as success would defeat the verification entirely.
 */
export function isVerified(responseText: string): boolean {
  return responseText
    .split("\n")
    .map((line) => line.trim())
    .includes("is_valid:true")
}

export const STEAM_VERIFY_URL = STEAM_LOGIN_URL
