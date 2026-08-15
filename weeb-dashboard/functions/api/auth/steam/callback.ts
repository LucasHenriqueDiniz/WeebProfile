import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../../_shared/auth"
import { serverError } from "../../_shared/auth"
import { getDb } from "../../_shared/db"
import { setPluginSecret } from "../../_shared/secrets"
import { buildVerificationBody, isVerified, parseClaimedId, STEAM_VERIFY_URL } from "../../_shared/steam-openid"
import { safeReturnTo } from "../../_shared/return-to"
import { STATE_COOKIE, CLEAR_STATE_COOKIE, DEFAULT_RETURN_TO, readCookie, openState } from "./shared"

/**
 * GET /api/auth/steam/callback - where Steam sends the user back.
 *
 * Duas condições antes de qualquer escrita, nenhuma opcional:
 *
 *  1. O cookie selado abre, e o nonce dentro dele bate com o da URL. Ele carrega
 *     também o userId, posto lá pelo authorize, que exige sessão e roda same-site.
 *     Isso cobre as duas coisas de uma vez: de quem é o perfil, e que o fluxo não
 *     foi forjado -- sem o nonce, um usuário logado poderia ser levado a um callback
 *     montado e terminar com a conta Steam de outro no card dele.
 *  2. A Steam confirma que assinou estes parâmetros. Tudo aqui chega como query
 *     string que o chamador controla, então sem esta etapa qualquer um reivindicaria
 *     qualquer SteamID64 editando a URL.
 *
 * Não há checagem de sessão do Clerk aqui, e é deliberado: esta rota chega como
 * navegação de topo do steamcommunity.com, e o cookie `__session` não sobrevive ao
 * salto cross-site. Exigi-lo fazia todo login pelo Steam responder 401.
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
    const url = new URL(request.url)
    const origin = url.origin
    const returnTo = url.searchParams.get("returnTo") || DEFAULT_RETURN_TO

    const fail = (reason: string, description: string) =>
      back(origin, returnTo, { oauth_error: "steam", error_description: description, reason })

    // O cookie carrega nonce e identidade juntos. Nada aqui consulta a sessão do
    // Clerk: esta rota chega como navegação de topo do steamcommunity.com, e o
    // `__session` não sobrevive ao salto cross-site -- exigi-lo devolvia 401 em todo
    // login pelo Steam. Quem provou identidade foi o authorize, same-site, ao selar
    // este cookie; ver sealState em ./shared.
    const sealed = await openState(readCookie(request, STATE_COOKIE), env.SECRETS_ENCRYPTION_KEY)
    const receivedState = url.searchParams.get("state")
    if (!sealed || !receivedState || sealed.state !== receivedState) {
      return fail("state_mismatch", "Sessão de conexão expirada. Tente novamente.")
    }
    const userId = sealed.userId

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
