import { graphql } from "@octokit/graphql"
import { GraphqlResponseError } from "@octokit/graphql"
import type { GithubRepoConfig, GithubRepoData, StarHistoryPoint } from "../types"
import { REPOSITORY_CARD_QUERY } from "./queries"
import { getMockGithubRepoData } from "./mock-data"
import { urlToDataUriDirect } from "../../../utils/image-to-base64"

const OWNER_AVATAR_MAX_BYTES = 250_000
const STARGAZERS_PER_PAGE = 100
const STAR_HISTORY_SAMPLE_POINTS = 10
// Acima disso, buscar toda seria caro demais - cai pra amostragem por página.
const DIRECT_FETCH_MAX_PAGES = 10

function stargazersUrl(owner: string, repo: string, page: number): string {
  return `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/stargazers?per_page=${STARGAZERS_PER_PAGE}&page=${page}`
}

async function fetchStargazersPage(owner: string, repo: string, pat: string, page: number): Promise<string[]> {
  try {
    const res = await fetch(stargazersUrl(owner, repo, page), {
      headers: {
        Accept: "application/vnd.github.star+json",
        Authorization: `token ${pat}`,
        "User-Agent": "WeebProfile",
      },
    })
    if (!res.ok) return []
    const data = (await res.json()) as Array<{ starred_at?: string }>
    return data.map((item) => item.starred_at).filter((d): d is string => !!d)
  } catch {
    return []
  }
}

function sampleEvenly(points: StarHistoryPoint[], sampleCount: number): StarHistoryPoint[] {
  if (points.length <= sampleCount) return points
  const step = (points.length - 1) / (sampleCount - 1)
  const sampled: StarHistoryPoint[] = []
  for (let i = 0; i < sampleCount; i++) {
    sampled.push(points[Math.round(i * step)] as StarHistoryPoint)
  }
  return sampled
}

/**
 * Amostra o crescimento de estrelas do repositório - dados reais, não uma curva
 * inventada. Dois caminhos:
 *
 * - Repo pequeno/médio (<= DIRECT_FETCH_MAX_PAGES * 100 estrelas): busca todas as
 *   páginas em paralelo e usa o starred_at de cada stargazer, amostrando pontos
 *   igualmente espaçados na lista completa. Cobre a grande maioria dos repos reais
 *   com granularidade de verdade (antes, repos com <=100 estrelas só geravam 1
 *   ponto - impossível de virar gráfico, já que o componente exige >= 2 pontos).
 * - Repo popular (mais páginas que isso): paginar tudo seria caro/lento, então
 *   segue a técnica usada por ferramentas como star-history.com - amostra o
 *   primeiro item de N páginas igualmente espaçadas ao longo do total.
 *
 * Ambos os caminhos buscam as páginas em paralelo (Promise.all) em vez de sequencial,
 * já que isso roda a cada geração de SVG.
 */
async function fetchStarHistory(owner: string, repo: string, pat: string, totalStars: number): Promise<StarHistoryPoint[]> {
  if (totalStars <= 0) return []

  const totalPages = Math.max(1, Math.ceil(totalStars / STARGAZERS_PER_PAGE))

  if (totalPages <= DIRECT_FETCH_MAX_PAGES) {
    const pageResults = await Promise.all(
      Array.from({ length: totalPages }, (_, i) => fetchStargazersPage(owner, repo, pat, i + 1))
    )
    const allDates = pageResults.flat()
    if (allDates.length === 0) return []

    const allPoints = allDates.map((date, i) => ({ date, count: i + 1 }))
    const sampleCount = Math.min(STAR_HISTORY_SAMPLE_POINTS, allPoints.length)
    const points = sampleEvenly(allPoints, sampleCount)
    // Garante que o ponto mais recente reflita o total real (a API pode não retornar
    // todas as estrelas se alguma delas "unstarred" entre a contagem e a busca).
    const lastPoint = points[points.length - 1] as StarHistoryPoint
    points[points.length - 1] = { date: lastPoint.date, count: totalStars }
    return points
  }

  // Repo popular: amostra o primeiro item de N páginas espalhadas pelo total,
  // sem paginar tudo.
  const sampleCount = Math.min(STAR_HISTORY_SAMPLE_POINTS, totalPages)
  const pages = new Set<number>()
  for (let i = 0; i < sampleCount; i++) {
    const page = 1 + Math.round((i / Math.max(1, sampleCount - 1)) * (totalPages - 1))
    pages.add(page)
  }
  pages.add(totalPages)

  const sortedPages = Array.from(pages).sort((a, b) => a - b)
  const firstDates = await Promise.all(
    sortedPages.map(async (page) => {
      const dates = await fetchStargazersPage(owner, repo, pat, page)
      return dates.length > 0 ? { page, date: dates[0] as string } : null
    })
  )

  const points: StarHistoryPoint[] = firstDates
    .filter((entry): entry is { page: number; date: string } => entry !== null)
    .map(({ page, date }) => ({ date, count: Math.min((page - 1) * STARGAZERS_PER_PAGE + 1, totalStars) }))

  if (points.length > 0) {
    const last = points[points.length - 1] as StarHistoryPoint
    points[points.length - 1] = { date: last.date, count: totalStars }
  }

  return points.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

async function embedImageOrNull(url: string): Promise<string | null> {
  if (!url.startsWith("https://")) return null
  try {
    return (await urlToDataUriDirect(url, { maxBytes: OWNER_AVATAR_MAX_BYTES })).dataUri
  } catch {
    return null
  }
}

/**
 * Normaliza owner/repo separados ou uma URL completa do GitHub para { owner, repo }
 */
export function normalizeGithubRepoTarget(owner: string, repo: string): { owner: string; repo: string } | null {
  const trimmedOwner = owner?.trim()
  const trimmedRepo = repo?.trim()
  if (trimmedOwner && trimmedRepo) {
    return { owner: trimmedOwner, repo: trimmedRepo }
  }
  return null
}

function isPermissionError(error: unknown): boolean {
  if (error instanceof GraphqlResponseError) {
    return (
      error.errors?.some(
        (e: { type?: string; message?: string }) =>
          e.type === "FORBIDDEN" || e.message?.includes("permission") || e.message?.includes("insufficient_scope")
      ) || false
    )
  }
  const message = (error as Error)?.message || String(error)
  return (
    message.includes("FORBIDDEN") ||
    message.includes("permission") ||
    message.includes("insufficient_scope") ||
    message.includes("Bad credentials")
  )
}

interface RepositoryCardResponse {
  repository: {
    name: string
    nameWithOwner: string
    description: string | null
    url: string
    owner: { login: string; avatarUrl: string }
    primaryLanguage: { name: string; color: string } | null
    stargazerCount: number
    forkCount: number
    licenseInfo: { name: string; spdxId: string | null } | null
    repositoryTopics: { nodes: Array<{ topic: { name: string } }> }
    languages: { totalSize: number; edges: Array<{ size: number; node: { name: string; color: string | null } }> } | null
  } | null
}

/**
 * Busca dados de um único repositório do GitHub.
 *
 * @param config - Configuração do plugin (owner/repo)
 * @param dev - Modo desenvolvimento (usa dados mock, ignora token)
 * @param pat - GitHub Classic Token do usuário (obrigatório em produção)
 */
export async function fetchGithubRepoData(config: GithubRepoConfig, dev = false, pat?: string): Promise<GithubRepoData> {
  if (dev) {
    return await getMockGithubRepoData()
  }

  if (!pat) {
    throw new Error("GitHub Classic Token is required. Please configure it in your profile settings.")
  }

  const target = normalizeGithubRepoTarget(config.owner, config.repo)
  if (!target) {
    throw new Error("Repository owner and name are required (e.g. owner/repo).")
  }

  const graphqlClient = graphql.defaults({
    headers: { authorization: `token ${pat}` },
  })

  try {
    const result = await graphqlClient<RepositoryCardResponse>(REPOSITORY_CARD_QUERY, {
      owner: target.owner,
      repo: target.repo,
    })

    const repo = result.repository
    if (!repo) {
      throw new Error(`Repository not found: ${target.owner}/${target.repo}`)
    }

    const avatarUrl = repo.owner?.avatarUrl
    const avatarUrlBase64 = avatarUrl && avatarUrl.startsWith("https://") ? await embedImageOrNull(avatarUrl) : null

    const totalLanguageSize = repo.languages?.totalSize || 0
    const languages = (repo.languages?.edges || [])
      .filter((edge) => edge.node.color)
      .map((edge) => ({
        name: edge.node.name,
        color: edge.node.color as string,
        percentage: totalLanguageSize > 0 ? Math.round((edge.size / totalLanguageSize) * 1000) / 10 : 0,
      }))

    const stargazerCount = repo.stargazerCount || 0
    // Best-effort: se a amostragem de estrelas falhar (rate limit, token sem escopo,
    // etc.) o card ainda funciona - só sem o gráfico.
    const starHistory = await fetchStarHistory(target.owner, target.repo, pat, stargazerCount).catch(() => [])

    return {
      name: repo.name,
      nameWithOwner: repo.nameWithOwner,
      description: repo.description,
      url: repo.url,
      owner: {
        login: repo.owner?.login || target.owner,
        avatarUrl: avatarUrlBase64,
      },
      primaryLanguage: repo.primaryLanguage,
      stargazerCount,
      forkCount: repo.forkCount || 0,
      licenseInfo: repo.licenseInfo
        ? { name: repo.licenseInfo.name, spdxId: repo.licenseInfo.spdxId }
        : null,
      topics: (repo.repositoryTopics?.nodes || []).map((n) => n.topic.name),
      languages,
      starHistory,
    }
  } catch (error) {
    if (isPermissionError(error)) {
      throw new Error(
        "Your GitHub Classic Token doesn't have permission to read this repository. " +
          "Make sure it has the 'repo' or 'public_repo' scope."
      )
    }
    throw error
  }
}
