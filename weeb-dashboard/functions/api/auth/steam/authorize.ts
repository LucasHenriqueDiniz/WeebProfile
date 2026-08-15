import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../../_shared/auth"
import { getAuthUserId, unauthorized, serverError } from "../../_shared/auth"
import { buildAuthUrl } from "../../_shared/steam-openid"
import { safeReturnTo } from "../../_shared/return-to"
import { STATE_COOKIE, STATE_TTL_SECONDS, DEFAULT_RETURN_TO, sealState } from "./shared"

/**
 * GET /api/auth/steam/authorize - begin "Sign in through Steam".
 *
 * Named to match what the wizard already links to for an oauth-typed config key
 * (see PluginCard: /api/auth/{provider}/authorize?returnTo=...). Note that the
 * Spotify button using that same shape has no endpoint behind it -- these are the
 * first auth routes that actually exist.
 *
 * Requires a WeebProfile session: the callback has to attach the returned
 * SteamID64 to someone, and the only safe answer is whoever started the flow.
 *
 * The nonce is double-submitted -- carried inside return_to, which Steam echoes
 * back and signs, and set as a short-lived HttpOnly cookie. Without it a logged-in
 * user could be walked onto a crafted callback and end up with someone else's
 * Steam account bound to their profile.
 */
export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ request, env }) => {
  try {
    const userId = await getAuthUserId(request, env)
    if (!userId) return unauthorized()

    const url = new URL(request.url)
    const state = crypto.randomUUID()
    const returnTo = safeReturnTo(url.searchParams.get("returnTo"), url.origin, DEFAULT_RETURN_TO)

    // Both ride inside return_to, which is covered by the signature Steam applies,
    // so tampering with either fails check_authentication rather than silently
    // redirecting somewhere else.
    const callback = new URL("/api/auth/steam/callback", url.origin)
    callback.searchParams.set("state", state)
    callback.searchParams.set("returnTo", returnTo)

    // Este é o único ponto do fluxo com sessão do Clerk garantida: a chamada é
    // same-site. O callback chega do steamcommunity.com e não tem essa garantia,
    // então a identidade viaja selada dentro do próprio cookie de state (ver sealState).
    const sealed = await sealState(state, userId, env.SECRETS_ENCRYPTION_KEY)

    return new Response(null, {
      status: 302,
      headers: {
        Location: buildAuthUrl(callback.toString(), url.origin),
        // Lax, not Strict: the user comes back via a top-level redirect from
        // steamcommunity.com, and Strict withholds the cookie exactly then.
        "Set-Cookie": `${STATE_COOKIE}=${sealed}; Path=/api/auth/steam; HttpOnly; Secure; SameSite=Lax; Max-Age=${STATE_TTL_SECONDS}`,
        "Cache-Control": "no-store",
      },
    })
  } catch (e) {
    return serverError(e)
  }
}
