import { graphql } from "@octokit/graphql"
import { GraphqlResponseError } from "@octokit/graphql"
import type { GithubRepoConfig, GithubRepoData } from "../types"
import { REPOSITORY_CARD_QUERY } from "./queries"
import { getMockGithubRepoData } from "./mock-data"
import { urlToDataUriDirect } from "../../../utils/image-to-base64"

const OWNER_AVATAR_MAX_BYTES = 250_000

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
      stargazerCount: repo.stargazerCount || 0,
      forkCount: repo.forkCount || 0,
      licenseInfo: repo.licenseInfo
        ? { name: repo.licenseInfo.name, spdxId: repo.licenseInfo.spdxId }
        : null,
      topics: (repo.repositoryTopics?.nodes || []).map((n) => n.topic.name),
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
