import { embedImageOrNull } from "../../../utils/image-to-base64"
import type { AniListConfig, AniListData, AniListMedia, AniListWatchingEntry } from "../types"
import { getMockAniListData } from "./mock-data"

const ANILIST_ENDPOINT = "https://graphql.anilist.co"
const COVER_MAX_BYTES = 100_000
const REQUEST_TIMEOUT_MS = 15_000

/**
 * Uma query só para tudo.
 *
 * GraphQL permite pedir estatísticas, favoritos e a lista em andamento numa
 * requisição — o que importa aqui porque cada geração de SVG roda dentro do
 * limite de 6 conexões simultâneas de um Worker, e os plugins REST gastam esse
 * orçamento em várias chamadas.
 *
 * MediaListCollection depende da lista ser pública. Quando não é, a API responde
 * com `errors` e os outros campos ainda vêm — por isso a resposta é tratada campo
 * a campo, e não tudo-ou-nada.
 */
const PROFILE_QUERY = `
query ($name: String, $favoritesPerPage: Int) {
  User(name: $name) {
    name
    statistics {
      anime { count episodesWatched minutesWatched meanScore }
      manga { count chaptersRead volumesRead meanScore }
    }
    favourites {
      anime(perPage: $favoritesPerPage) {
        nodes { id title { romaji english } coverImage { medium } }
      }
    }
  }
  MediaListCollection(userName: $name, type: ANIME, status: CURRENT) {
    lists {
      entries {
        progress
        media { id title { romaji english } episodes coverImage { medium } }
      }
    }
  }
}`

interface GraphQLMedia {
  id: number
  title?: { romaji?: string | null; english?: string | null }
  episodes?: number | null
  coverImage?: { medium?: string | null }
}

/** english quando existe, romaji como fallback — é o que o AniList mostra por padrão. */
function pickTitle(media: GraphQLMedia): string {
  return media.title?.english || media.title?.romaji || `#${media.id}`
}

async function embedCover(url: string | null | undefined, previewMode: boolean): Promise<string | null> {
  if (!url) return null
  // Em preview a URL original serve: o browser carrega direto, e converter para
  // data URI aqui só desperdiçaria uma requisição por card.
  if (previewMode) return url
  // null, nunca a URL original: um SVG em Gist não consegue carregar URL externa,
  // então devolvê-la deixaria uma imagem quebrada em vez de nenhuma. O helper
  // registra o motivo da falha, que antes se perdia num catch vazio.
  return embedImageOrNull(url, { maxBytes: COVER_MAX_BYTES, context: "anilist/cover" })
}

export async function fetchAniListData(config: AniListConfig, dev = false, previewMode = false): Promise<AniListData> {
  if (dev || previewMode) {
    const mock = getMockAniListData()
    if (previewMode) return mock
    return {
      ...mock,
      favoritesAnime: await Promise.all(
        mock.favoritesAnime.map(async (item) => ({ ...item, cover: await embedCover(item.cover, false) }))
      ),
      currentlyWatching: await Promise.all(
        mock.currentlyWatching.map(async (item) => ({ ...item, cover: await embedCover(item.cover, false) }))
      ),
    }
  }

  const username = config.username?.trim()
  if (!username) {
    return { ...emptyData(""), _error: "AniList username is required. Set it in the plugin settings." }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  let payload: any
  try {
    const response = await fetch(ANILIST_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        query: PROFILE_QUERY,
        variables: { name: username, favoritesPerPage: config.favorites_anime_max ?? 10 },
      }),
      signal: controller.signal,
    })

    if (response.status === 429) {
      return { ...emptyData(username), _error: "AniList rate limit reached. Try again in a minute." }
    }

    // 404 é ambíguo no AniList: vem tanto para usuário inexistente quanto para
    // perfil privado, e só o corpo distingue ("User not found" vs "Private User").
    // A diferença importa porque uma delas o usuário resolve com um clique nas
    // configurações do AniList, e a outra significa que digitou o nome errado.
    if (response.status === 404) {
      const body = await response.json().catch(() => null)
      const messages: string[] = (body as any)?.errors?.map((e: any) => String(e?.message ?? "")) ?? []
      if (messages.some((m) => /private/i.test(m))) {
        return {
          ...emptyData(username),
          _error: `AniList profile "${username}" is private. Make it public to show it here.`,
        }
      }
      return { ...emptyData(username), _error: `AniList user "${username}" not found.` }
    }

    if (!response.ok) {
      return { ...emptyData(username), _error: `AniList responded ${response.status}.` }
    }

    payload = await response.json()
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError"
    return {
      ...emptyData(username),
      _error: aborted ? "AniList request timed out." : "Could not reach AniList.",
    }
  } finally {
    clearTimeout(timeout)
  }

  const user = payload?.data?.User
  if (!user) {
    return { ...emptyData(username), _error: `AniList user "${username}" not found.` }
  }

  const animeStats = user.statistics?.anime ?? {}
  const mangaStats = user.statistics?.manga ?? {}

  const favouriteNodes: GraphQLMedia[] = user.favourites?.anime?.nodes ?? []
  const favoritesAnime: AniListMedia[] = await Promise.all(
    favouriteNodes.map(async (node) => ({
      id: node.id,
      title: pickTitle(node),
      cover: await embedCover(node.coverImage?.medium, previewMode),
    }))
  )

  // Ausente quando a lista é privada; nesse caso a seção simplesmente não aparece,
  // em vez de o card inteiro virar erro.
  const entries: Array<{ progress?: number; media?: GraphQLMedia }> =
    payload?.data?.MediaListCollection?.lists?.flatMap((list: any) => list?.entries ?? []) ?? []

  const currentlyWatching: AniListWatchingEntry[] = await Promise.all(
    entries
      .filter((entry) => entry.media)
      .slice(0, config.currently_watching_max ?? 5)
      .map(async (entry) => ({
        id: entry.media!.id,
        title: pickTitle(entry.media!),
        cover: await embedCover(entry.media!.coverImage?.medium, previewMode),
        progress: entry.progress ?? 0,
        totalEpisodes: entry.media!.episodes ?? null,
      }))
  )

  return {
    username: user.name ?? username,
    statistics: {
      animeCount: animeStats.count ?? 0,
      episodesWatched: animeStats.episodesWatched ?? 0,
      minutesWatched: animeStats.minutesWatched ?? 0,
      animeMeanScore: animeStats.meanScore ?? 0,
      mangaCount: mangaStats.count ?? 0,
      chaptersRead: mangaStats.chaptersRead ?? 0,
      volumesRead: mangaStats.volumesRead ?? 0,
      mangaMeanScore: mangaStats.meanScore ?? 0,
    },
    favoritesAnime,
    currentlyWatching,
  }
}

function emptyData(username: string): AniListData {
  return {
    username,
    statistics: {
      animeCount: 0,
      episodesWatched: 0,
      minutesWatched: 0,
      animeMeanScore: 0,
      mangaCount: 0,
      chaptersRead: 0,
      volumesRead: 0,
      mangaMeanScore: 0,
    },
    favoritesAnime: [],
    currentlyWatching: [],
  }
}
