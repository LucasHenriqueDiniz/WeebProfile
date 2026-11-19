/**
 * Battle.net API client for WoW Forever's profile namespace.
 *
 * The application authenticates with its own client (client credentials grant): a
 * Forever character is public, so no user login is involved, and the user only types
 * the character's name. The token lasts 24 hours and is kept per isolate, so a cron run
 * that renders many cards asks for it once.
 *
 * Forever is not in Blizzard's API documentation yet (11/2026). The routes here are the
 * realmless ones developers found after launch and that @pinta365/blizzard-api 0.8.7
 * checked against the live API on 16/11/2026: `/profile/wow/character/{name}-{surname}`
 * in the `profile-forever-{region}` namespace.
 */

import type { WowRegion } from "../types"

const OAUTH_URL = "https://oauth.battle.net/token"
const TIMEOUT_MS = 10_000
/** Renew a cached token this long before Blizzard says it expires. */
const EXPIRY_MARGIN_MS = 5 * 60_000

export interface BattlenetCredentials {
  clientId: string
  clientSecret: string
}

interface CachedToken {
  /** Settles once; kept while in flight, so requests that start together share one token request. */
  token: Promise<string>
  expiresAt: number
}

const tokens = new Map<string, CachedToken>()

/** Test hook: the cache outlives a test otherwise. */
export function clearTokenCache(): void {
  tokens.clear()
}

async function requestToken({
  clientId,
  clientSecret,
}: BattlenetCredentials): Promise<{ token: string; lifetimeMs: number }> {
  const response = await fetch(OAUTH_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!response.ok) {
    // The body can echo the request; only the status leaves this function.
    throw new Error(
      `WoW Forever is unavailable: Battle.net refused the application's credentials (HTTP ${response.status}).`
    )
  }
  const body = (await response.json()) as { access_token?: string; expires_in?: number }
  if (!body.access_token) throw new Error("WoW Forever is unavailable: Battle.net returned no access token.")
  return { token: body.access_token, lifetimeMs: (body.expires_in ?? 3600) * 1000 }
}

function accessToken(credentials: BattlenetCredentials): Promise<string> {
  const cached = tokens.get(credentials.clientId)
  if (cached && cached.expiresAt > Date.now()) return cached.token

  // A card asks for the profile, the media and the PvP summary at once: without sharing
  // the pending request, each of them asked Battle.net for a token of its own.
  const entry: CachedToken = { token: Promise.resolve(""), expiresAt: Number.POSITIVE_INFINITY }
  entry.token = requestToken(credentials).then(
    ({ token, lifetimeMs }) => {
      entry.expiresAt = Date.now() + lifetimeMs - EXPIRY_MARGIN_MS
      return token
    },
    (error: unknown) => {
      if (tokens.get(credentials.clientId) === entry) tokens.delete(credentials.clientId)
      throw error
    }
  )
  tokens.set(credentials.clientId, entry)
  return entry.token
}

/** Thrown for a 404: the character (or that part of it) is not served. */
export class NotServedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "NotServedError"
  }
}

/**
 * GET a character route. A 404 throws NotServedError, so the caller decides whether a
 * missing part is fatal (the profile) or just absent (the render, the PvP summary).
 */
export async function getCharacter<T>(
  credentials: BattlenetCredentials,
  region: WowRegion,
  slug: string,
  route = ""
): Promise<T> {
  const url =
    `https://${region}.api.blizzard.com/profile/wow/character/${encodeURIComponent(slug)}${route}` +
    `?namespace=profile-forever-${region}&locale=en_US`

  for (let attempt = 0; ; attempt++) {
    const token = await accessToken(credentials)
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (response.ok) return (await response.json()) as T
    // A token revoked before its time: drop it and ask for a new one, once.
    if (response.status === 401 && attempt === 0) {
      tokens.delete(credentials.clientId)
      continue
    }
    if (response.status === 404) throw new NotServedError(`${route || "profile"}: HTTP 404`)
    throw new Error(`Battle.net API failed on the character ${route || "profile"}: HTTP ${response.status}`)
  }
}
