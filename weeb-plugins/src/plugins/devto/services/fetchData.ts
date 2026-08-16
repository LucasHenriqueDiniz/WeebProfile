import { embedImageOrNull } from "../../../utils/image-to-base64"
import type { DevToArticle, DevToData, DevToTag } from "../types"
import { getMockDevToData } from "./mock-data"

const BASE_URL = "https://dev.to/api"
const AVATAR_MAX_BYTES = 100_000
const REQUEST_TIMEOUT_MS = 15_000

/**
 * Uma página só de artigos.
 *
 * A API pagina em no máximo 1000 por requisição e não devolve contagem total, e
 * contas ativas passam de 1900 artigos — somar tudo custaria dezenas de chamadas
 * por geração. Então nada aqui afirma "total": as seções descrevem esta janela, e
 * os rótulos dizem isso.
 */
const ARTICLE_WINDOW = 30

interface DevToApiArticle {
  id: number
  title?: string
  url?: string
  public_reactions_count?: number
  positive_reactions_count?: number
  comments_count?: number
  reading_time_minutes?: number
  published_at?: string | null
  readable_publish_date?: string | null
  tag_list?: string[]
}

async function request(path: string, signal: AbortSignal): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    headers: { Accept: "application/vnd.forem.api-v1+json" },
    signal,
  })
}

async function embedAvatar(url: string | null | undefined, previewMode: boolean): Promise<string | null> {
  if (!url) return null
  if (previewMode) return url
  // null, nunca a URL original: um SVG em Gist não carrega URL externa, então
  // devolvê-la deixaria uma imagem quebrada em vez de nenhuma.
  return embedImageOrNull(url, { maxBytes: AVATAR_MAX_BYTES, context: "devto/avatar" })
}

function countTags(articles: DevToArticle[], max: number): DevToTag[] {
  const counts = new Map<string, number>()
  for (const article of articles) {
    for (const tag of article.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return (
    [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      // Desempate alfabético para a ordem não variar entre gerações com os mesmos
      // dados -- o que produziria SVGs diferentes sem mudança real.
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
      .slice(0, max)
  )
}

export async function fetchDevToData(config: DevToConfigLike, dev = false, previewMode = false): Promise<DevToData> {
  if (dev || previewMode) {
    const mock = getMockDevToData()
    if (previewMode) return mock
    return { ...mock, profile: { ...mock.profile, avatar: await embedAvatar(mock.profile.avatar, false) } }
  }

  const username = config.username?.trim()
  if (!username) {
    return { ...emptyData(""), _error: "Dev.to username is required. Set it in the plugin settings." }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    // O perfil vem primeiro porque é o único endpoint que valida existência:
    // /articles responde 200 com [] para um username inventado, então sozinho ele
    // não distingue "sem artigos" de "sem usuário".
    const profileResponse = await request(`/users/by_username?url=${encodeURIComponent(username)}`, controller.signal)

    if (profileResponse.status === 404) {
      return { ...emptyData(username), _error: `Dev.to user "${username}" not found.` }
    }
    if (profileResponse.status === 429) {
      return { ...emptyData(username), _error: "Dev.to rate limit reached. Try again in a minute." }
    }
    if (!profileResponse.ok) {
      return { ...emptyData(username), _error: `Dev.to responded ${profileResponse.status}.` }
    }

    const profileJson: any = await profileResponse.json()

    const articlesResponse = await request(
      `/articles?username=${encodeURIComponent(username)}&per_page=${ARTICLE_WINDOW}`,
      controller.signal
    )
    // Artigos são complemento: um perfil válido sem artigos ainda é um card útil,
    // então uma falha aqui não invalida o resto.
    const articlesJson: DevToApiArticle[] = articlesResponse.ok ? await articlesResponse.json().catch(() => []) : []

    const recentArticles: DevToArticle[] = (Array.isArray(articlesJson) ? articlesJson : []).map((article) => ({
      id: article.id,
      title: article.title ?? "(untitled)",
      url: article.url ?? "",
      // public_reactions_count é o número que o Dev.to mostra no card; o positive_
      // é a soma interna e costuma ser maior.
      reactions: article.public_reactions_count ?? article.positive_reactions_count ?? 0,
      comments: article.comments_count ?? 0,
      readingTimeMinutes: article.reading_time_minutes ?? 0,
      publishedAt: article.published_at ?? null,
      readablePublishDate: article.readable_publish_date ?? null,
      tags: Array.isArray(article.tag_list) ? article.tag_list : [],
    }))

    return {
      profile: {
        username: profileJson.username ?? username,
        name: profileJson.name ?? username,
        summary: profileJson.summary || null,
        location: profileJson.location || null,
        joinedAt: profileJson.joined_at || null,
        avatar: await embedAvatar(profileJson.profile_image, previewMode),
      },
      recentArticles,
      topTags: countTags(recentArticles, config.top_tags_max ?? 8),
    }
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError"
    return {
      ...emptyData(username),
      _error: aborted ? "Dev.to request timed out." : "Could not reach Dev.to.",
    }
  } finally {
    clearTimeout(timeout)
  }
}

/** Só o que fetchData precisa; evita importar o tipo completo de config. */
interface DevToConfigLike {
  username?: string
  top_tags_max?: number
}

function emptyData(username: string): DevToData {
  return {
    profile: { username, name: username, summary: null, location: null, joinedAt: null, avatar: null },
    recentArticles: [],
    topTags: [],
  }
}
