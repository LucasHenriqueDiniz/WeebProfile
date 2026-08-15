/**
 * Normaliza o que o usuário cola no campo do Steam para um SteamID64.
 *
 * Substituiu o "Entrar com Steam" (OpenID). O que aquele fluxo devolvia era um
 * SteamID64 -- identificador **público**, que qualquer um pode ler --, então ele
 * nunca protegeu segredo nenhum: era cinco arquivos, um cookie de state e um selo
 * cifrado para obter um número que a pessoa pode simplesmente colar. O atrito real
 * era outro: a maioria dos perfis usa URL de vanity, que não mostra o número.
 *
 * Isso resolve o atrito sem o fluxo: aceita a URL do perfil nas duas formas, o nome
 * de vanity solto, ou o próprio ID. Só chama a rede quando não dá para extrair o ID
 * do que foi colado.
 */

/** Contas individuais vivem em 7656119…, sempre 17 dígitos. */
const STEAM_ID64 = /^7656\d{13}$/

/** Vanity aceita letras, números, hífen e underscore -- é o que a Steam permite. */
const VANITY = /^[A-Za-z0-9_-]{2,64}$/

export type SteamInput = { kind: "id"; steamId: string } | { kind: "vanity"; vanity: string }

export function parseSteamInput(raw: unknown): SteamInput | null {
  // `unknown`, não `string`: o corpo vem de JSON e o tipo é promessa, não garantia.
  // O ProfileConfigModal, por exemplo, devolve os booleans do endpoint de presença
  // ({ steam: { steamid: true } }), e um `.trim()` neles derrubava a rota inteira.
  if (typeof raw !== "string") return null

  const input = raw.trim()
  if (!input) return null

  if (STEAM_ID64.test(input)) return { kind: "id", steamId: input }

  // URL de perfil, nas duas formas que a Steam usa.
  const comProtocolo = /^https?:\/\//i.test(input) ? input : `https://${input}`
  if (/steamcommunity\.com/i.test(input)) {
    let caminho: string
    try {
      caminho = new URL(comProtocolo).pathname
    } catch {
      return null
    }

    const porId = caminho.match(/\/profiles\/(\d{17})/)
    if (porId?.[1] && STEAM_ID64.test(porId[1])) return { kind: "id", steamId: porId[1] }

    const porVanity = caminho.match(/\/id\/([^/]+)/)
    if (porVanity?.[1]) {
      const vanity = decodeURIComponent(porVanity[1])
      return VANITY.test(vanity) ? { kind: "vanity", vanity } : null
    }
    return null
  }

  // Nome de vanity solto. Depois do teste de ID64 acima, para uma sequência de 17
  // dígitos nunca ser tratada como nome.
  return VANITY.test(input) ? { kind: "vanity", vanity: input } : null
}

export interface ResolveResult {
  steamId?: string
  error?: string
}

/**
 * O resolvedor entra por parâmetro: a chave da Steam vive no worker gerador (ver
 * svg-generator/src/db/app-credentials.ts), não aqui, e injetar deixa toda a lógica
 * de decisão testável sem rede.
 */
export async function resolveSteamId(
  raw: unknown,
  resolveVanity: (vanity: string) => Promise<string | null>
): Promise<ResolveResult> {
  const parsed = parseSteamInput(raw)
  if (!parsed) {
    return { error: "Cole a URL do seu perfil da Steam, ou o SteamID64 de 17 dígitos." }
  }

  if (parsed.kind === "id") return { steamId: parsed.steamId }

  let resolvido: string | null
  try {
    resolvido = await resolveVanity(parsed.vanity)
  } catch {
    return { error: "Não foi possível falar com a Steam agora. Tente de novo." }
  }

  if (!resolvido || !STEAM_ID64.test(resolvido)) {
    return { error: `A Steam não encontrou o perfil "${parsed.vanity}".` }
  }
  return { steamId: resolvido }
}
