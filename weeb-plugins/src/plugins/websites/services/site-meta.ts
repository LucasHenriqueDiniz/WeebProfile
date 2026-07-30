/**
 * Lê os metadados de uma página web (Open Graph / <title> / ícones).
 *
 * O parse é feito com regex, e não com HTMLRewriter: este pacote também roda em
 * Node (weeb-debug-tool e os scripts de preview), onde HTMLRewriter não existe.
 *
 * Só o <head> interessa, então a leitura para em `</head>` ou no limite de bytes
 * — o que vier primeiro — para não carregar uma página inteira na memória do Worker.
 */

import { assertSafePublicUrl } from "../../../utils/url-guard"

const HTML_MAX_BYTES = 256_000
const HTML_TIMEOUT_MS = 8_000
const USER_AGENT = "WeebProfile/1.0 (+https://weebprofile.pages.dev)"

export interface SiteMeta {
  /** URL final, após redirects — base para resolver caminhos relativos. */
  finalUrl: string
  title: string | null
  description: string | null
  imageUrl: string | null
  iconUrl: string | null
}

const EMPTY_META = (finalUrl: string): SiteMeta => ({
  finalUrl,
  title: null,
  description: null,
  imageUrl: null,
  iconUrl: null,
})

const HTML_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  "#39": "'",
  "#x27": "'",
  "#x2F": "/",
  "#47": "/",
}

function decodeEntities(value: string): string {
  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity: string) => {
    const direct = HTML_ENTITIES[entity] ?? HTML_ENTITIES[entity.toLowerCase()]
    if (direct !== undefined) return direct
    if (/^#\d+$/.test(entity)) return String.fromCodePoint(Number(entity.slice(1)))
    if (/^#x[0-9a-fA-F]+$/i.test(entity)) return String.fromCodePoint(parseInt(entity.slice(2), 16))
    return match
  })
}

function clean(value: string | null | undefined): string | null {
  if (!value) return null
  const text = decodeEntities(value).replace(/\s+/g, " ").trim()
  return text === "" ? null : text
}

/**
 * Lê o corpo da resposta até `</head>` ou até HTML_MAX_BYTES.
 * Usa streaming quando disponível; cai para `response.text()` em ambientes
 * (e mocks de teste) sem `body.getReader`.
 */
async function readHead(response: Response): Promise<string> {
  const body = response.body as ReadableStream<Uint8Array> | null
  if (!body || typeof body.getReader !== "function") {
    return (await response.text()).slice(0, HTML_MAX_BYTES)
  }

  const reader = body.getReader()
  const decoder = new TextDecoder("utf-8")
  let html = ""
  let received = 0

  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      if (!value) continue
      received += value.byteLength
      html += decoder.decode(value, { stream: true })
      if (html.includes("</head>") || received >= HTML_MAX_BYTES) break
    }
  } finally {
    // Encerra o download assim que o <head> chegou.
    await reader.cancel().catch(() => undefined)
  }

  return html
}

/** Extrai o `content` de uma <meta> cujo property/name bate com `names`. */
function findMetaContent(html: string, names: string[]): string | null {
  const tags = html.match(/<meta\b[^>]*>/gi)
  if (!tags) return null

  for (const name of names) {
    for (const tag of tags) {
      const keyMatch = tag.match(/\b(?:property|name|itemprop)\s*=\s*["']([^"']+)["']/i)
      if (!keyMatch || keyMatch[1]!.trim().toLowerCase() !== name) continue
      const contentMatch = tag.match(/\bcontent\s*=\s*["']([^"']*)["']/i)
      const content = clean(contentMatch?.[1])
      if (content) return content
    }
  }
  return null
}

/** Procura <link rel="..."> na ordem de preferência dada. */
function findLinkHref(html: string, rels: string[]): string | null {
  const tags = html.match(/<link\b[^>]*>/gi)
  if (!tags) return null

  for (const wanted of rels) {
    for (const tag of tags) {
      const relMatch = tag.match(/\brel\s*=\s*["']([^"']+)["']/i)
      if (!relMatch) continue
      const relValues = relMatch[1]!.trim().toLowerCase().split(/\s+/)
      if (!relValues.includes(wanted)) continue
      const hrefMatch = tag.match(/\bhref\s*=\s*["']([^"']*)["']/i)
      const href = clean(hrefMatch?.[1])
      if (href) return href
    }
  }
  return null
}

/** Resolve uma URL possivelmente relativa e descarta o que não for https seguro. */
function resolveSafe(value: string | null, base: string): string | null {
  if (!value) return null
  try {
    const resolved = new URL(value, base).toString()
    assertSafePublicUrl(resolved)
    return resolved
  } catch {
    return null
  }
}

/**
 * Busca a página e devolve seus metadados. Nunca lança: um site fora do ar,
 * bloqueando bots ou servindo algo que não é HTML devolve metadados vazios.
 */
export async function fetchSiteMeta(rawUrl: string): Promise<SiteMeta> {
  let url: URL
  try {
    url = assertSafePublicUrl(rawUrl)
  } catch {
    return EMPTY_META(rawUrl)
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), HTML_TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(url.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
      },
      // Aproveita o cache da Cloudflare entre regenerações; ignorado fora do Worker.
      cf: { cacheTtl: 3600, cacheEverything: true },
    } as RequestInit)
  } catch {
    return EMPTY_META(url.toString())
  } finally {
    clearTimeout(timeoutId)
  }

  if (!response.ok) return EMPTY_META(url.toString())

  const contentType = (response.headers.get("content-type") || "").toLowerCase()
  if (!contentType.includes("html")) return EMPTY_META(response.url || url.toString())

  // Um redirect pode ter levado a um host privado; revalida o destino final.
  const finalUrl = response.url || url.toString()
  try {
    assertSafePublicUrl(finalUrl)
  } catch {
    return EMPTY_META(url.toString())
  }

  let html: string
  try {
    html = await readHead(response)
  } catch {
    return EMPTY_META(finalUrl)
  }

  const titleTag = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]

  return {
    finalUrl,
    title: findMetaContent(html, ["og:title", "twitter:title"]) ?? clean(titleTag),
    description: findMetaContent(html, ["og:description", "twitter:description", "description"]),
    imageUrl: resolveSafe(
      findMetaContent(html, ["og:image:secure_url", "og:image", "twitter:image", "twitter:image:src"]),
      finalUrl
    ),
    iconUrl: resolveSafe(findLinkHref(html, ["apple-touch-icon", "apple-touch-icon-precomposed"]), finalUrl),
  }
}
