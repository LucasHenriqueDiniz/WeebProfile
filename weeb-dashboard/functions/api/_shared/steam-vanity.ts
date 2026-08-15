import type { CloudflareEnv } from "./auth"
import { resolveSteamId } from "./steam-id"

/**
 * Liga o parser de entrada do Steam (steam-id.ts, sem rede) ao worker gerador, que
 * é quem tem a STEAM_API_KEY.
 *
 * Pelo service binding, igual à geração de SVG: fora da internet pública, e sem
 * precisar de uma segunda cópia do segredo no dashboard -- duas cópias divergem
 * calado, e hoje o generator é o dono declarado das credenciais da aplicação.
 */
function resolverViaGenerator(env: CloudflareEnv): (vanity: string) => Promise<string | null> {
  return async (vanity: string) => {
    const init = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vanity }),
    }

    const response = env.SVG_GENERATOR
      ? await env.SVG_GENERATOR.fetch("https://svg-generator/steam/resolve-vanity", init as never)
      : await fetch(`${env.SVG_GENERATOR_URL || "http://localhost:8787"}/steam/resolve-vanity`, init)

    if (!response.ok) throw new Error(`resolve-vanity responded ${response.status}`)
    return ((await response.json()) as { steamId?: string | null }).steamId ?? null
  }
}

type Configs = Record<string, Record<string, string> | undefined>

/**
 * Troca o que o usuário colou no campo do Steam pelo SteamID64 canônico, antes de
 * gravar. Aceita URL do perfil nas duas formas, nome de vanity ou o próprio ID.
 *
 * Normalizar na escrita, e não na leitura, é o que dá erro na hora: colar uma URL
 * errada falha ali, com mensagem, em vez de virar um SVG quebrado no próximo ciclo
 * do cron.
 */
export async function normalizeSteamSecret(
  configs: Configs,
  env: CloudflareEnv
): Promise<{ configs: Configs } | { error: string }> {
  const steam = configs.steam
  if (!steam) return { configs }

  // O metadata usa "steamId"; a escrita no banco minuscula. Aceita os dois para o
  // caso de o cliente mandar já normalizado.
  const chave = "steamId" in steam ? "steamId" : "steamid" in steam ? "steamid" : null
  const bruto: unknown = chave ? steam[chave] : undefined

  // Só age sobre string não vazia. O ProfileConfigModal reenvia o objeto de presença,
  // que traz booleans -- e o setEssentialConfigs sempre ignorou tudo que não é
  // string. Rejeitar aqui transformaria em erro um caso que antes era inofensivo.
  if (!chave || typeof bruto !== "string" || !bruto.trim()) return { configs }

  const resultado = await resolveSteamId(bruto, resolverViaGenerator(env))
  if (resultado.error || !resultado.steamId) {
    return { error: resultado.error || "Não foi possível identificar esse perfil da Steam." }
  }

  return { configs: { ...configs, steam: { ...steam, [chave]: resultado.steamId } } }
}
