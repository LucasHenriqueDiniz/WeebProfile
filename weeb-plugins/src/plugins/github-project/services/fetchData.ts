import {
  GitHubContributor,
  GitHubLanguage,
  GitHubProjectConfig,
  GitHubProjectData,
  GitHubRepository,
  GitHubStats,
  StarBucket,
} from "../types"
import { getMockData } from "./mock-data"

// GitHub API base URL
const GITHUB_API_BASE = "https://api.github.com"

// Rate limiting and concurrency control
const _MAX_CONCURRENT = 3
const _activeRequests = new Set<string>()

// Retry configuration
const RETRY_ATTEMPTS = 3
const BASE_DELAY = 1000

/**
 * Parse repository input (owner/repo format)
 */
export function parseRepositoryInput(input: string): { owner: string; repo: string } {
  const clean = input.trim().toLowerCase()
  const parts = clean.split("/")

  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error("Invalid repository format. Use: owner/repo")
  }

  return { owner: parts[0], repo: parts[1] }
}

/**
 * Fetch repository data with ETag caching
 */
async function fetchRepositoryWithEtag(url: string, etag?: string): Promise<{ data: any; etag?: string }> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "WeebProfile-GitHub-Plugin",
  }

  if (etag) {
    headers["If-None-Match"] = etag
  }

  // Get token from environment
  const token = process.env.GITHUB_PROJECT_BANNER_TOKEN
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(url, { headers })

  // Handle rate limiting
  const rateLimitRemaining = response.headers.get("x-ratelimit-remaining")
  const rateLimitLimit = response.headers.get("x-ratelimit-limit")

  if (rateLimitRemaining && rateLimitLimit) {
    console.log(`Rate limit: ${rateLimitRemaining}/${rateLimitLimit}`)
  }

  if (response.status === 304) {
    throw new Error("Not Modified - use cached data")
  }

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const newEtag = response.headers.get("etag") || undefined

  return { data, etag: newEtag }
}

/**
 * Exponential backoff retry
 */
async function retryWithBackoff<T>(fn: () => Promise<T>, attempts: number = RETRY_ATTEMPTS): Promise<T> {
  let lastError: Error

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (i === attempts - 1) break

      const delay = BASE_DELAY * Math.pow(2, i)
      console.log(`Retrying in ${delay}ms... (attempt ${i + 1}/${attempts})`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}

/**
 * Fetch basic repository information
 */
export async function fetchRepository(owner: string, repo: string): Promise<GitHubRepository> {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}`

  return retryWithBackoff(async () => {
    const { data } = await fetchRepositoryWithEtag(url)
    return data
  })
}

/**
 * Fetch repository statistics
 */
export async function fetchRepositoryStats(owner: string, repoName: string): Promise<GitHubStats> {
  // Get basic stats from repository info
  const repository = await fetchRepository(owner, repoName)

  // Fetch additional stats
  const [_issues, pulls, releases, contributors] = await Promise.all([
    fetch(`${GITHUB_API_BASE}/repos/${owner}/${repoName}/issues?state=open&per_page=1`)
      .then((res) => res.json().then(() => repository.open_issues_count))
      .catch(() => 0),
    fetch(`${GITHUB_API_BASE}/repos/${owner}/${repoName}/pulls?state=all&per_page=1`)
      .then((res) => res.json().then(() => 0)) // Would need pagination for real count
      .catch(() => 0),
    fetch(`${GITHUB_API_BASE}/repos/${owner}/${repoName}/releases?per_page=1`)
      .then((res) => res.json().then(() => 0)) // Would need pagination for real count
      .catch(() => 0),
    fetch(`${GITHUB_API_BASE}/repos/${owner}/${repoName}/contributors?per_page=1`)
      .then((res) => res.json().then(() => 0)) // Would need pagination for real count
      .catch(() => 0),
  ])

  return {
    open_issues: repository.open_issues_count,
    forks: repository.forks_count,
    watchers: repository.watchers_count,
    stars: repository.stargazers_count,
    pull_requests: pulls,
    releases: releases,
    contributors: contributors,
  }
}

/**
 * Fetch repository languages
 */
export async function fetchRepositoryLanguages(owner: string, repo: string): Promise<GitHubLanguage[]> {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`

  return retryWithBackoff(async () => {
    const { data } = await fetchRepositoryWithEtag(url)

    const total = Object.values(data).reduce((sum: number, bytes: any) => sum + (bytes as number), 0)

    return Object.entries(data)
      .map(([language, bytes]) => ({
        language,
        bytes: bytes as number,
        percentage: Math.round(((bytes as number) / total) * 1000) / 10,
      }))
      .sort((a, b) => b.bytes - a.bytes)
  })
}

/**
 * Fetch repository contributors
 */
export async function fetchRepositoryContributors(
  owner: string,
  repo: string,
  limit: number = 10
): Promise<GitHubContributor[]> {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contributors?per_page=${limit}`

  return retryWithBackoff(async () => {
    const { data } = await fetchRepositoryWithEtag(url)
    return data
  })
}

/**
 * Fetch star history (mock implementation - would need backend service for real data)
 */
export async function fetchStarHistory(_owner: string, _repo: string): Promise<StarBucket[]> {
  // This would typically come from a database with backfilled data
  // For now, return empty array - real implementation would query DB
  return []
}

/**
 * Main data fetching function
 */
export async function fetchGitHubProjectData(
  config: GitHubProjectConfig,
  dev: boolean = false
): Promise<GitHubProjectData> {
  // Handle dev mode with mock data
  if (dev) {
    const mockData = getMockData(config)
    return {
      repository: mockData.repository,
      stats: mockData.stats,
      languages: mockData.languages,
      contributors: mockData.contributors,
      starHistory: mockData.starHistory,
      sections_config: config.sections_config,
    }
  }

  // Validate required config
  if (!config.repository) {
    throw new Error("Repository is required")
  }

  const { owner, repo } = parseRepositoryInput(config.repository)

  // Fetch data in parallel where possible
  const [repository, stats, languages, contributors, starHistory] = await Promise.all([
    fetchRepository(owner, repo),
    fetchRepositoryStats(owner, repo),
    fetchRepositoryLanguages(owner, repo),
    fetchRepositoryContributors(owner, repo, (config.sections_config as any)?.contributors?.limit || 10),
    fetchStarHistory(owner, repo),
  ])

  return {
    repository,
    stats,
    languages,
    contributors,
    starHistory,
    sections_config: config.sections_config,
  }
}
