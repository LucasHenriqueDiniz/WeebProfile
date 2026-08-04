import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../../_shared/auth"
import { getAuthUserId, unauthorized, serverError } from "../../_shared/auth"
import { getDb } from "../../_shared/db"
import { setPluginSecret } from "../../_shared/secrets"
import { buildVerificationBody, isVerified, parseClaimedId, STEAM_VERIFY_URL } from "../../_shared/steam-openid"
import { safeReturnTo } from "../../_shared/return-to"
import { STATE_COOKIE, CLEAR_STATE_COOKIE, DEFAULT_RETURN_TO, readCookie } from "./shared"

/**
 * GET /api/auth/steam/callback - where Steam sends the user back.
 *
 * Three conditions must hold before anything is written, none of them optional:
 *
 *  1. A WeebProfile session, so we know whose profile this attaches to.
 *  2. The nonce in the URL matches the cookie set when the flow started --
 *     otherwise a logged-in user could be walked onto a crafted callback and end
 *     up with someone else's Steam account on their card.
 *  3. Steam confirms it signed these parameters. Everything here arrives as query
 *     parameters the caller controls, so without this step anyone could claim any
 *     SteamID64 by editing a URL.
 *
 * Outcomes use the oauth_success / oauth_error shape the wizard already reads.
 */
function back(origin: string, returnTo: string, params: Record<string, string>): Response {
  const target = new URL(safeReturnTo(returnTo, origin, DEFAULT_RETURN_TO), origin)
  for (const [key, value] of Object.entries(params)) target.searchParams.set(key, value)

  return new Response(null, {
    status: 302,
    headers: {
      Location: target.toString(),
      "Set-Cookie": CLEAR_STATE_COOKIE,
      "Cache-Control": "no-store",
    },
  })
}

export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ request, env }) => {
  try {
    const userId = await getAuthUserId(request, env)
    if (!userId) return unauthorized()

    const url = new URL(request.url)
    const origin = url.origin
    const returnTo = url.searchParams.get("returnTo") || DEFAULT_RETURN_TO

    const fail = (reason: string, description: string) =>
      back(origin, returnTo, { oauth_error: "steam", error_description: description, reason })

    const expectedState = readCookie(request, STATE_COOKIE)
    const receivedState = url.searchParams.get("state")
    if (!expectedState || !receivedState || expectedState !== receivedState) {
      return fail("state_mismatch", "Sessão de conexão expirada. Tente novamente.")
    }

    const verification = await fetch(STEAM_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: buildVerificationBody(url.searchParams).toString(),
    })

    if (!verification.ok || !isVerified(await verification.text())) {
      return fail("not_verified", "A Steam não confirmou esse login.")
    }

    const steamId = parseClaimedId(url.searchParams.get("openid.claimed_id"))
    if (!steamId) {
      return fail("bad_claimed_id", "A Steam não devolveu um Steam ID válido.")
    }

    // The same row the manual field wrote to, so nothing downstream changes: the
    // generator reads steam/steamid out of plugin_secrets either way.
    await setPluginSecret(getDb(env), userId, "steam", "steamId", steamId, env.SECRETS_ENCRYPTION_KEY)

    return back(origin, returnTo, { oauth_success: "steam" })
  } catch (e) {
    return serverError(e)
  }
}
