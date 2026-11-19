import { graphql } from "@octokit/graphql"
import { GraphqlResponseError } from "@octokit/graphql"
import type { GithubRepoConfig, GithubRepoData } from "../types"
import { REPOSITORY_CARD_QUERY } from "./queries"
import { getMockGithubRepoData } from "./mock-data"
import { fetchStarHistory } from "./star-history"
import { fetchTraffic, TrafficPermissionError } from "./traffic"
import { embedImageOrNull as embedImage } from "../../../utils/image-to-base64"

const GITHUB_BUDGET_MS = 45_000

const OWNER_AVATAR_MAX_BYTES = 250_000

async function embedImageOrNull(url: string): Promise<string | null> {
  if (!url.startsWith("https://")) return null
  return embedImage(url, { maxBytes: OWNER_AVATAR_MAX_BYTES, context: "github_repo/avatar" })
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
    createdAt: string
    owner: { login: string; avatarUrl: string }
    primaryLanguage: { name: string; color: string } | null
    stargazerCount: number
    forkCount: number
    openIssuesCount: { totalCount: number } | null
    watchers: { totalCount: number } | null
    licenseInfo: { name: string; spdxId: string | null } | null
    repositoryTopics: { nodes: Array<{ topic: { name: string } }> }
    languages: {
      totalSize: number
      edges: Array<{ size: number; node: { name: string; color: string | null } }>
    } | null
  } | null
}

/**
 * Busca dados de um único repositório do GitHub.
 *
 * @param config - Configuração do plugin (owner/repo)
 * @param dev - Modo desenvolvimento (usa dados mock, ignora token)
 * @param pat - GitHub Classic Token do usuário (obrigatório em produção)
 */
export async function fetchGithubRepoData(
  config: GithubRepoConfig,
  dev = false,
  pat?: string
): Promise<GithubRepoData> {
  if (dev) {
    const mock = await getMockGithubRepoData()
    // Imagem custom também precisa virar base64 no preview: o wizard exibe o SVG via
    // <img>, e o browser bloqueia URLs externas dentro de SVG-as-image - uma URL crua
    // simplesmente não renderiza. data: URIs passam direto.
    const customImage = config.banner_image?.trim()
    if (customImage) {
      mock.owner.avatarUrl = customImage.startsWith("data:image/")
        ? customImage
        : ((await embedImageOrNull(customImage)) ?? mock.owner.avatarUrl)
    }
    return mock
  }

  if (!pat) {
    throw new Error("GitHub Classic Token is required. Please configure it in your profile settings.")
  }

  const target = normalizeGithubRepoTarget(config.owner, config.repo)
  if (!target) {
    throw new Error("Repository owner and name are required (e.g. owner/repo).")
  }

  // Octokit had no timeout; one budget for this card's GitHub calls.
  const graphqlClient = graphql.defaults({
    headers: { authorization: `token ${pat}` },
    request: { signal: AbortSignal.timeout(GITHUB_BUDGET_MS) },
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

    // Imagem custom do banner (logo do projeto) tem prioridade sobre o avatar do
    // owner; ambas são embutidas em base64 (Gists não carregam URLs externas em SVG).
    const customImage = config.banner_image?.trim()
    const customImageBase64 = customImage
      ? customImage.startsWith("data:image/")
        ? customImage
        : await embedImageOrNull(customImage)
      : null
    const avatarUrl = repo.owner?.avatarUrl
    const avatarUrlBase64 =
      customImageBase64 ?? (avatarUrl && avatarUrl.startsWith("https://") ? await embedImageOrNull(avatarUrl) : null)

    const totalLanguageSize = repo.languages?.totalSize || 0
    const languages = (repo.languages?.edges || [])
      .filter((edge) => edge.node.color)
      .map((edge) => ({
        name: edge.node.name,
        color: edge.node.color as string,
        percentage: totalLanguageSize > 0 ? Math.round((edge.size / totalLanguageSize) * 1000) / 10 : 0,
      }))

    const stargazerCount = repo.stargazerCount || 0
    const sections = config.sections ?? []
    const wantsTraffic = sections.includes("traffic")
    // Best effort: without the history (rate limit, timeout) the card still renders,
    // just without the chart. A traffic card draws no star, so it skips the history
    // (up to 100 requests for an old repository).
    const starHistory = sections.some((s) => s !== "traffic")
      ? await fetchStarHistory(repo.nameWithOwner, repo.createdAt, pat, stargazerCount).catch(() => [])
      : []
    // Not best effort: a traffic card without its traffic would be a blank chart, and a
    // token without push access needs a message that says so.
    const traffic = wantsTraffic
      ? await fetchTraffic(repo.nameWithOwner, pat, {
          clones: config.traffic_show_clones === true,
          referrers: config.traffic_show_referrers === true,
          paths: config.traffic_show_paths === true,
        })
      : null

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
      openIssuesCount: repo.openIssuesCount?.totalCount || 0,
      watcherCount: repo.watchers?.totalCount || 0,
      licenseInfo: repo.licenseInfo ? { name: repo.licenseInfo.name, spdxId: repo.licenseInfo.spdxId } : null,
      topics: (repo.repositoryTopics?.nodes || []).map((n) => n.topic.name),
      languages,
      starHistory,
      traffic,
    }
  } catch (error) {
    if (error instanceof TrafficPermissionError) throw error
    if (isPermissionError(error)) {
      throw new Error(
        "Your GitHub Classic Token can't read this repository. " +
          "A public repository needs no scopes; a private one needs the 'repo' scope."
      )
    }
    throw error
  }
}
