/**
 * Busca de dados do plugin Websites
 *
 * Diferente dos outros plugins, aqui não existe API: cada site cadastrado pelo
 * usuário é buscado diretamente para ler suas meta tags e a imagem de preview.
 * Por isso tudo passa pelo url-guard e toda falha degrada em silêncio — um site
 * fora do ar nunca pode derrubar o card inteiro.
 */

import { urlToDataUriDirect } from "../../../utils/image-to-base64"
import { assertSafePublicUrl } from "../../../utils/url-guard"
import { MAX_WEBSITES } from "../plugin.metadata"
import type { WebsiteConfigItem, WebsiteEntry, WebsitesConfig, WebsitesData } from "../types"
import { fetchSiteMeta } from "./site-meta"
import { getMockWebsitesData } from "./mock-data"

/** Limites de payload por imagem embutida no SVG. */
const THUMBNAIL_MAX_BYTES = 300_000
const FAVICON_MAX_BYTES = 30_000

/** Timeout por imagem — mais curto que o padrão de 15s, já que são várias por site. */
const IMAGE_TIMEOUT_MS = 6_000

/** Quantos sites são resolvidos ao mesmo tempo. */
const FETCH_CONCURRENCY = 4

/**
 * Orçamento total de rede da geração. Com 12 sites, cada um podendo fazer um
 * fetch de HTML e até quatro de imagem, o pior caso passaria de um minuto.
 * Estourado o prazo, os sites restantes usam só o que o usuário digitou.
 */
const NETWORK_BUDGET_MS = 20_000

/**
 * Único serviço externo usado pelo plugin. Existe porque o /favicon.ico da
 * maioria dos sites é image/x-icon, reprovado pelo MIME allowlist e pelo check
 * de magic bytes de `urlToDataUriDirect`; este endpoint normaliza tudo para PNG.
 */
const FAVICON_SERVICE = "https://www.google.com/s2/favicons"

function faviconUrl(domain: string, size: number): string {
  return `${FAVICON_SERVICE}?domain=${encodeURIComponent(domain)}&sz=${size}`
}

/** Aceita "example.com" além de "https://example.com" e valida o resultado. */
function normalizeUrl(raw: unknown): URL | null {
  if (typeof raw !== "string") return null
  const trimmed = raw.trim()
  if (trimmed === "") return null
  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    return assertSafePublicUrl(candidate)
  } catch {
    return null
  }
}

function readItems(config: WebsitesConfig): WebsiteConfigItem[] {
  const ne = config.nonEssential || {}
  const raw = ne.websites_items ?? (config.websites_items as WebsiteConfigItem[] | undefined)
  return Array.isArray(raw) ? raw : []
}

function readOption<T>(config: WebsitesConfig, key: string, fallback: T): T {
  const ne = (config.nonEssential || {}) as Record<string, unknown>
  const value = ne[key] !== undefined ? ne[key] : (config as Record<string, unknown>)[key]
  return value === undefined ? fallback : (value as T)
}

/** Descarta URLs inválidas e duplicadas, preservando a ordem do usuário. */
function sanitizeItems(items: WebsiteConfigItem[], max: number): Array<{ url: URL; item: WebsiteConfigItem }> {
  const seen = new Set<string>()
  const result: Array<{ url: URL; item: WebsiteConfigItem }> = []

  for (const item of items) {
    if (!item || typeof item !== "object") continue
    const url = normalizeUrl(item.url)
    if (!url) continue
    const key = url.toString().replace(/\/$/, "")
    if (seen.has(key)) continue
    seen.add(key)
    result.push({ url, item })
    if (result.length >= max) break
  }

  return result
}

/** Tenta cada candidato em ordem e devolve o primeiro que virar data URI. */
async function firstEmbeddableImage(
  candidates: Array<string | null>,
  maxBytes: number,
  hasBudget: () => boolean
): Promise<string | null> {
  for (const candidate of candidates) {
    if (!candidate) continue
    if (!hasBudget()) return null
    try {
      assertSafePublicUrl(candidate)
      const { dataUri } = await urlToDataUriDirect(candidate, {
        maxBytes,
        timeout: IMAGE_TIMEOUT_MS,
        // A URL veio do usuário (ou do HTML dele): um host público pode
        // redirecionar para um privado, então o destino final é revalidado.
        validateFinalUrl: assertSafePublicUrl,
      })
      return dataUri
    } catch {
      // Imagem inacessível, grande demais ou em formato não suportado: próxima.
    }
  }
  return null
}

async function resolveWebsite(
  url: URL,
  item: WebsiteConfigItem,
  options: { autofill: boolean; showThumbnail: boolean; showDescription: boolean; hasBudget: () => boolean }
): Promise<WebsiteEntry> {
  const domain = url.hostname.replace(/^www\./, "")
  const manualTitle = typeof item.title === "string" ? item.title.trim() : ""
  const manualDescription = typeof item.description === "string" ? item.description.trim() : ""
  const manualImage = normalizeUrl(item.image)?.toString() ?? null

  const meta = options.autofill && options.hasBudget() ? await fetchSiteMeta(url.toString()) : null

  const thumbnail = options.showThumbnail
    ? await firstEmbeddableImage(
        [manualImage, meta?.imageUrl ?? null, meta?.iconUrl ?? null],
        THUMBNAIL_MAX_BYTES,
        options.hasBudget
      )
    : null

  const favicon = await firstEmbeddableImage([faviconUrl(domain, 64)], FAVICON_MAX_BYTES, options.hasBudget)

  return {
    url: url.toString(),
    domain,
    title: manualTitle || meta?.title || domain,
    description: options.showDescription ? manualDescription || meta?.description || null : null,
    // Sem thumbnail própria, o favicon ainda dá algo para mostrar no card.
    thumbnail: thumbnail ?? (options.showThumbnail ? favicon : null),
    favicon,
  }
}

/** Roda `worker` sobre `items` com um teto de tarefas simultâneas. */
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>
): Promise<Array<R | null>> {
  const results: Array<R | null> = new Array(items.length).fill(null)
  let cursor = 0

  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    for (;;) {
      const index = cursor++
      if (index >= items.length) return
      try {
        results[index] = await worker(items[index]!, index)
      } catch {
        results[index] = null
      }
    }
  })

  await Promise.all(runners)
  return results
}

export async function fetchWebsitesData(
  config: WebsitesConfig,
  dev = false,
  previewMode = false
): Promise<WebsitesData> {
  const max = Math.min(Math.max(1, Number(readOption(config, "websites_max", 6)) || 6), MAX_WEBSITES)

  // Preview e dev nunca fazem rede: a config de preview vem sem sites cadastrados.
  if (dev || previewMode) return getMockWebsitesData(max)

  const entries = sanitizeItems(readItems(config), max)
  if (entries.length === 0) return { websites: [] }

  const deadline = Date.now() + NETWORK_BUDGET_MS
  const options = {
    autofill: readOption<boolean>(config, "websites_autofill", true) !== false,
    showThumbnail: readOption<boolean>(config, "websites_show_thumbnail", true) !== false,
    showDescription: readOption<boolean>(config, "websites_show_description", true) !== false,
    hasBudget: () => Date.now() < deadline,
  }

  const resolved = await mapWithConcurrency(entries, FETCH_CONCURRENCY, ({ url, item }) =>
    resolveWebsite(url, item, options)
  )

  return { websites: resolved.filter((entry): entry is WebsiteEntry => entry !== null) }
}
