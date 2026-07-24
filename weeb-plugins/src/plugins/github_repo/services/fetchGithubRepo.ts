import { graphql } from "@octokit/graphql"
import { GraphqlResponseError } from "@octokit/graphql"
import type { GithubRepoConfig, GithubRepoData, StarHistoryPoint } from "../types"
import { REPOSITORY_CARD_QUERY } from "./queries"
import { getMockGithubRepoData } from "./mock-data"
import { urlToDataUriDirect } from "../../../utils/image-to-base64"

const OWNER_AVATAR_MAX_BYTES = 250_000
const STARGAZERS_PER_PAGE = 100
const STAR_HISTORY_SAMPLE_POINTS = 10

/**
 * Amostra o crescimento de estrelas do repositório sem paginar todos os stargazers
 * (inviável para repos populares). Usa a página 1 pra saber o total real e a página
 * `total` como último ponto, e distribui o restante das amostras uniformemente entre
 * elas - a mesma técnica usada por ferramentas como star-history.com. Cada ponto vem
 * do `starred_at` do primeiro item daquela página (Accept: application/vnd.github.star+json),
 * então é dado real, só que amostrado - não uma curva inventada.
 */
async function fetchStarHistory(owner: string, repo: string, pat: string, totalStars: number): Promise<StarHistoryPoint[]> {
  if (totalStars <= 0) return []

  const totalPages = Math.max(1, Math.ceil(totalStars / STARGAZERS_PER_PAGE))
  const sampleCount = Math.min(STAR_HISTORY_SAMPLE_POINTS, totalPages)
  const pages = new Set<number>()
  for (let i = 0; i < sampleCount; i++) {
    const page = 1 + Math.round((i / Math.max(1, sampleCount - 1)) * (totalPages - 1))
    pages.add(page)
  }
  pages.add(totalPages)

  const points: StarHistoryPoint[] = []
  for (const page of Array.from(pages).sort((a, b) => a - b)) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/stargazers?per_page=${STARGAZERS_PER_PAGE}&page=${page}`,
        {
          headers: {
            Accept: "application/vnd.github.star+json",
            Authorization: `token ${pat}`,
            "User-Agent": "WeebProfile",
          },
        }
      )
      if (!res.ok) continue
      const data = (await res.json()) as Array<{ starred_at?: string }>
      const first = data[0]
      if (first?.starred_at) {
        const countAtPage = Math.min((page - 1) * STARGAZERS_PER_PAGE + 1, totalStars)
        points.push({ date: first.starred_at, count: countAtPage })
      }
    } catch {
      // Amostragem best-effort - se uma página falhar, seguimos com os outros pontos.
    }
  }

  // Garante que o ponto mais recente reflita o total real (a última página pode ter
  // menos de STARGAZERS_PER_PAGE itens e a contagem exata acima já cobre isso, mas
  // o timestamp da última entrada pode não ser "agora").
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
