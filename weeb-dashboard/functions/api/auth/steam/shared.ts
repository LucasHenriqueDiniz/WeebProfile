/**
 * Shared between authorize and callback. Kept out of both so the cookie name and
 * its Path cannot drift apart -- a mismatch there would make the state check fail
 * every time, and look like Steam rejecting the login.
 */
import { encryptSecret, decryptSecret } from "../../_shared/secret-crypto"

export const STATE_COOKIE = "steam_openid_state"
export const STATE_TTL_SECONDS = 600
export const COOKIE_PATH = "/api/auth/steam"
export const DEFAULT_RETURN_TO = "/dashboard/settings"

export const CLEAR_STATE_COOKIE = `${STATE_COOKIE}=; Path=${COOKIE_PATH}; HttpOnly; Secure; SameSite=Lax; Max-Age=0`

/**
 * O cookie de state carrega a identidade, não só o nonce.
 *
 * O callback exigia sessão do Clerk (`getAuthUserId`) e devolvia 401 sempre: ele
 * chega como navegação de topo vinda do steamcommunity.com, e o cookie `__session`
 * não sobrevive a esse salto cross-site. O nosso sobrevive porque é `SameSite=Lax`
 * -- foi o que o authorize já tinha percebido para o nonce e ninguém estendeu para
 * a sessão.
 *
 * A resposta certa não é afrouxar cookie do Clerk: um callback de OAuth não deve
 * depender de sessão ambiente atravessar um redirect de terceiro, porque isso varia
 * por navegador. Quem estabelece identidade é o `authorize`, que roda same-site e
 * tem sessão; ele sela `{state, userId}` aqui e o callback só abre.
 *
 * Cifrado, não assinado nem em texto puro: AES-GCM é autenticado, então adulterar
 * falha ao abrir. Sem isso qualquer um forjaria um `userId` e escreveria o próprio
 * SteamID na conta alheia.
 */
interface SteamState {
  state: string
  userId: string
}

export async function sealState(state: string, userId: string, key: string): Promise<string> {
  const payload = JSON.stringify({ s: state, u: userId, e: Math.floor(Date.now() / 1000) + STATE_TTL_SECONDS })
  return encryptSecret(payload, key)
}

export async function openState(sealed: string | null, key: string): Promise<SteamState | null> {
  if (!sealed) return null

  try {
    const { s, u, e } = JSON.parse(await decryptSecret(sealed, key))
    // O Max-Age do cookie já expira no navegador; o `e` cobre o caso de o valor ser
    // reapresentado fora dele, para a janela ser do servidor e não do cliente.
    if (typeof s !== "string" || typeof u !== "string" || typeof e !== "number") return null
    if (e < Math.floor(Date.now() / 1000)) return null
    return { state: s, userId: u }
  } catch {
    // Chave errada, valor adulterado ou lixo: nada disso distingue um do outro
    // para quem chama, e todos significam a mesma coisa -- recomeçar o fluxo.
    return null
  }
}

export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie")
  if (!header) return null

  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=")
    if (key === name) return rest.join("=")
  }
  return null
}
