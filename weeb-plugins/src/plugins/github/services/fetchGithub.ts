import { graphql } from "@octokit/graphql"
import { Octokit } from "@octokit/rest"
import { GraphqlResponseError } from "@octokit/graphql"
import type { GithubConfig, GithubData, ContributionWeek } from "../types"
import {
  SECTION_QUERIES,
  FOLLOWERS_QUERY,
  REPOSITORY_STARGAZERS_QUERY,
  REPOSITORY_CONTRIBUTORS_QUERY,
  FEATURED_REPOSITORIES_QUERY,
  RECENT_ACTIVITY_QUERY,
} from "./queries"
import { getMockGithubData } from "./mock-data"
import { urlToBase64 } from "../../../utils/image-to-base64"

// Mapeamento de seções para permissões necessárias
const SECTION_PERMISSIONS: Record<string, string[]> = {
  stargazers: ["read:user"],
  top_repositories: ["read:user"],
  star_lists: ["read:user"],
  sponsors: ["read:user"],
  sponsorships: ["read:user"],
  featured_repositories: ["read:user", "public_repo"],
  repository_contributors: ["read:user", "public_repo"],
  people: ["read:user", "followers"],
}

/**
 * Normaliza uma URL de repositório do GitHub para o formato owner/repo
 * Aceita tanto "owner/repo" quanto "https://github.com/owner/repo"
 */
function normalizeRepoUrl(repoUrl: string): { owner: string; repo: string } | null {
  const trimmed = repoUrl.trim()
  
  // Se já está no formato owner/repo
  if (!trimmed.includes("://")) {
    const parts = trimmed.split("/").filter(Boolean)
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return {
        owner: parts[0],
        repo: parts[1],
      }
    }
    return null
  }
  
  // Se é uma URL completa, extrair owner/repo
  try {
    const url = new URL(trimmed)
    // Aceita github.com ou www.github.com
    if (url.hostname === "github.com" || url.hostname === "www.github.com") {
      const pathParts = url.pathname.split("/").filter(Boolean)
      if (pathParts.length >= 2 && pathParts[0] && pathParts[1]) {
        return {
          owner: pathParts[0],
          repo: pathParts[1],
        }
      }
    }
  } catch {
    // URL inválida, tentar parse manual
  }
  
  return null
}

// Função helper para detectar erros de permissão
function isPermissionError(error: any): boolean {
  if (error instanceof GraphqlResponseError) {
    return (
      error.errors?.some(
        (e: any) =>
          e.type === "FORBIDDEN" ||
          e.message?.includes("permission") ||
          e.message?.includes("insufficient_scope") ||
          e.message?.includes("Resource not accessible")
      ) || false
    )
  }

  const errorMessage = error?.message || error?.toString() || ""
  return (
    errorMessage.includes("FORBIDDEN") ||
    errorMessage.includes("permission") ||
    errorMessage.includes("insufficient_scope") ||
    errorMessage.includes("Resource not accessible") ||
    errorMessage.includes("Bad credentials")
  )
}

// Função helper para obter mensagem de erro de permissão
function getPermissionErrorMessage(section: string): string {
  const permissions = SECTION_PERMISSIONS[section] || []
  const permissionList = permissions.length > 0 ? permissions.join(", ") : "permissões específicas"

  return `A seção "${section}" requer ${permissionList}. Verifique se seu Classic Token tem as permissões necessárias.`
}

interface GraphQLResponse {
  user: {
    name?: string
    login?: string
    avatarUrl?: string
    createdAt?: string
    bio?: string
    location?: string
    company?: string
    websiteUrl?: string
    twitterUsername?: string
    followers?: {
      totalCount: number
      nodes?: Array<{
        login: string
        name: string | null
        avatarUrl: string
      }>
    }
    following?: {
      totalCount: number
    }
    languages?: {
      nodes: any[]
    }
    repositories?: {
      nodes: any[]
      totalDiskUsage: number
    }
    contributionsCollection?: {
      totalCommitContributions: number
      totalRepositoriesWithContributedCommits: number
      totalPullRequestContributions: number
      totalPullRequestReviewContributions: number
      totalIssueContributions: number
      restrictedContributionsCount: number
      contributionCalendar?: {
        totalContributions: number
        weeks: {
          contributionDays: {
            color: string
            contributionCount: number
            date: string
            weekday: number
          }[]
        }[]
      }
      commitContributionsByRepository?: Array<{
        repository: {
          name: string
          nameWithOwner: string
          url: string
        }
        contributions: {
          totalCount: number
        }
      }>
    }
    repositoriesContributedTo?: {
      totalCount: number
    }
    starredRepositories?: {
      totalCount: number
      nodes: any[]
    }
    gists?: {
      totalCount: number
      nodes: any[]
    }
    topRepositories?: {
      nodes: any[]
    }
    sponsorshipsAsSponsor?: {
      totalCount: number
      nodes: Array<{
        sponsorable: {
          login: string
          name: string | null
          avatarUrl: string
        }
        tier: {
          name: string
          monthlyPriceInDollars: number
        } | null
      }>
    }
    sponsors?: {
      totalCount: number
      nodes: Array<{
        login: string
        name: string | null
        avatarUrl: string
      }>
    }
    [key: string]: any
  }
}

/**
 * Busca dados do GitHub
 *
 * @param config - Configuração do plugin
 * @param dev - Modo desenvolvimento (usa dados mock, ignora token)
 * @param pat - GitHub Classic Token do usuário (obrigatório em produção)
 */
export async function fetchGithubData(
  config: GithubConfig,
  dev = false,
  pat?: string // Classic Token
): Promise<GithubData> {
  const { username, sections } = config

  // Development mode - return mock data
  if (dev) {
    return await getMockGithubData()
  }

  // Validate Classic Token and username
  // Classic Token must be configured by user
  // Don't use environment variables - this doesn't work for multi-tenant
  if (!pat) {
    throw new Error("GitHub Classic Token is required. " + "Please configure it in your profile settings.")
  }

  const githubToken = pat

  if (!username) {
    throw new Error("GitHub username is required")
  }

  const data: Partial<GithubData> = {}
  const warnings: GithubData['warnings'] = []

  // Configure GraphQL and REST clients with Classic Token
  const graphqlClient = graphql.defaults({
    headers: {
      authorization: `token ${githubToken}`,
    },
  })

  const rest = new Octokit({
    auth: githubToken,
  })

  try {
    // Process each requested section
    for (const section of sections) {
      try {
        // Code habits uses REST API, not GraphQL
        if (section === "code_habits") {
          const codeHabitsResult = await processCodeHabitsData(rest, username)
          data.codeHabits = codeHabitsResult.data
          if (codeHabitsResult.warning) {
            warnings.push({
              type: codeHabitsResult.warning.type,
              message: codeHabitsResult.warning.message,
              section: 'code_habits',
            })
          }
          continue
        }

        // Gists pode usar REST API como fallback
        if (section === "gists") {
          try {
            await processGistsData(graphqlClient, rest, username, data)
          } catch (error: any) {
            console.warn(`Error fetching gists (GraphQL), trying REST API:`, error.message)
            // Fallback para REST API se GraphQL falhar
            await processGistsDataRest(rest, username, data)
          }
          continue
        }

        // People precisa de lógica especial (profile ou repository)
        if (section === "people") {
          try {
            await processPeopleData(graphqlClient, config, data)
          } catch (error: any) {
            console.warn(`Error fetching people:`, error.message)
            data.people = { type: config.people_type || "profile", totalCount: 0, nodes: [] }
          }
          continue
        }

        // Repository Contributors precisa de repositório específico
        if (section === "repository_contributors") {
          try {
            await processRepositoryContributorsData(graphqlClient, rest, config, data)
          } catch (error: any) {
            console.warn(`Error fetching repository contributors:`, error.message)
            data.repositoryContributors = []
          }
          continue
        }

        // Featured Repositories precisa de URLs dos repositórios
        if (section === "featured_repositories") {
          try {
            await processFeaturedRepositoriesData(graphqlClient, config, data)
          } catch (error: any) {
            console.warn(`Error fetching featured repositories:`, error.message)
            data.featuredRepositories = []
          }
          continue
        }

        // Star Lists - por enquanto retornar vazio (precisa de API específica)
        if (section === "star_lists") {
          data.starLists = []
          continue
        }

        // Recent Activity - usa REST Events API
        if (section === "recent_activity") {
          try {
            await processRecentActivityData(rest, username, config, data)
          } catch (error: any) {
            console.warn(`Error fetching recent activity:`, error.message)
            data.recentActivity = []
          }
          continue
        }

        // Notable Contributions - processar de commitContributionsByRepository
        if (section === "notable_contributions") {
          try {
            await processNotableContributionsData(graphqlClient, username, config, data)
          } catch (error: any) {
            console.warn(`Error fetching notable contributions:`, error.message)
            data.notableContributions = []
          }
          continue
        }

        const query = SECTION_QUERIES[section as keyof typeof SECTION_QUERIES]
        if (!query) {
          console.warn(`Unknown section: ${section}`)
          continue
        }

        // Preparar variáveis da query
        const variables: any = { login: username }

        // Para repositories, usar privacy (enum RepositoryPrivacy)
        if (section === "repositories" || section === "favorite_license") {
          // Se não especificado, buscar apenas públicos (ou todos se o token tiver permissão)
          variables.privacy = config.repositories_use_private ? undefined : "PUBLIC"
        }

        const result = await graphqlClient<GraphQLResponse>(query, variables)

        // Process data based on section
        switch (section) {
          case "profile":
            if (!result.user.name || !result.user.login || !result.user.avatarUrl || !result.user.createdAt) {
              throw new Error("Missing required user data")
            }
            // Convert avatarUrl to base64 to work in SVGs
            const avatarUrlBase64 =
              result.user.avatarUrl &&
              (result.user.avatarUrl.startsWith("http://") || result.user.avatarUrl.startsWith("https://"))
                ? await urlToBase64(result.user.avatarUrl)
                : result.user.avatarUrl

            data.user = {
              name: result.user.name,
              login: result.user.login,
              avatarUrl: avatarUrlBase64 || result.user.avatarUrl,
              createdAt: result.user.createdAt,
              followers: result.user.followers?.totalCount || 0,
              following: result.user.following?.totalCount || 0,
              repositories: { totalCount: result.user.repositories?.nodes?.length || 0 },
              contributionCalendar: {
                totalContributions: result.user.contributionsCollection?.contributionCalendar?.totalContributions || 0,
                weeks: result.user.contributionsCollection?.contributionCalendar?.weeks || [],
              },
              repositoriesContributedTo: result.user.repositoriesContributedTo?.totalCount || 0,
            }
            break

          case "favorite_languages":
            data.languages = processLanguagesData(result)
            break

          case "activity":
            data.activity = processActivityData(result)
            break

          case "calendar":
            await processCalendarData(graphqlClient, username, config, data)
            break

          case "repositories":
            data.repositories = processRepositoriesData(result)
            break

          case "favorite_license":
            data.favoriteLicense = processFavoriteLicenseData(result)
            break

          case "starred_repositories":
            data.starredRepositories = processStarredRepositoriesData(result)
            break

          case "top_repositories":
            data.topRepositories = processTopRepositoriesData(result)
            // Calcular stargazers total
            if (data.topRepositories) {
              const totalStars = data.topRepositories.reduce((sum, repo) => sum + repo.stargazerCount, 0)
              data.stargazers = {
                totalCount: totalStars,
                repositories: data.topRepositories,
              }
            }
            break

          case "introduction":
            data.introduction = {
              bio: result.user.bio || undefined,
              location: result.user.location || undefined,
              company: result.user.company || undefined,
              websiteUrl: result.user.websiteUrl || undefined,
              twitterUsername: result.user.twitterUsername || undefined,
            }
            break

          case "sponsorships":
            const sponsorships = result.user.sponsorshipsAsSponsor
            const sponsorshipsNodes = await Promise.all(
              (sponsorships?.nodes || []).map(async (sponsorship: any) => {
                const avatarUrl = sponsorship.sponsorable?.avatarUrl || ""
                const avatarUrlBase64 =
                  avatarUrl && (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://"))
                    ? await urlToBase64(avatarUrl)
                    : avatarUrl
                return {
                  sponsorable: {
                    login: sponsorship.sponsorable?.login || "",
                    name: sponsorship.sponsorable?.name || null,
                    avatarUrl: avatarUrlBase64 || avatarUrl,
                  },
                  tier: sponsorship.tier
                    ? {
                        name: sponsorship.tier.name,
                        monthlyPriceInDollars: sponsorship.tier.monthlyPriceInDollars,
                      }
                    : null,
                }
              })
            )
            data.sponsorships = {
              totalCount: sponsorships?.totalCount || 0,
              nodes: sponsorshipsNodes,
            }
            break

          case "sponsors":
            const sponsors = result.user.sponsors
            const sponsorsNodes = await Promise.all(
              (sponsors?.nodes || []).map(async (sponsor: any) => {
                const avatarUrl = sponsor.avatarUrl || ""
                const avatarUrlBase64 =
                  avatarUrl && (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://"))
                    ? await urlToBase64(avatarUrl)
                    : avatarUrl
                return {
                  login: sponsor.login || "",
                  name: sponsor.name || null,
                  avatarUrl: avatarUrlBase64 || avatarUrl,
                  tier: null, // TODO: pegar tier do sponsor
                }
              })
            )
            data.sponsors = {
              totalCount: sponsors?.totalCount || 0,
              nodes: sponsorsNodes,
            }
            break
        }
      } catch (sectionError: any) {
        // Log erro mas continua processando outras seções
        console.warn(`Error processing section "${section}":`, sectionError.message)

        // Se for erro de permissão/escopo, definir dados vazios e mostrar aviso
        if (isPermissionError(sectionError)) {
          const permissionMessage = getPermissionErrorMessage(section)
          console.warn(`⚠️ ${permissionMessage}`)
          console.warn(`Section "${section}" será pulada devido a permissões insuficientes.`)
          // Definir dados vazios para evitar quebra
          switch (section) {
            case "starred_repositories":
              data.starredRepositories = { totalCount: 0, nodes: [] }
              break
            case "gists":
              data.gists = { totalCount: 0, nodes: [] }
              break
            case "top_repositories":
              data.topRepositories = []
              data.stargazers = { totalCount: 0, repositories: [] }
              break
            case "introduction":
              data.introduction = undefined
              break
            case "recent_activity":
              data.recentActivity = []
              break
            case "sponsorships":
              data.sponsorships = { totalCount: 0, nodes: [] }
              break
            case "sponsors":
              data.sponsors = { totalCount: 0, nodes: [] }
              break
            case "star_lists":
              data.starLists = []
              break
            case "notable_contributions":
              data.notableContributions = []
              break
            case "featured_repositories":
              data.featuredRepositories = []
              break
            case "people":
              data.people = { type: config.people_type || "profile", totalCount: 0, nodes: [] }
              break
            case "repository_contributors":
              data.repositoryContributors = []
              break
          }
        } else {
          // Para outros erros, re-throw apenas se for seção crítica
          if (section === "profile") {
            throw sectionError
          }
        }
      }
    }

    // Add warnings to data if any
    if (warnings.length > 0) {
      data.warnings = warnings
    }

    return data as GithubData
  } catch (error) {
    console.error(`Error fetching GitHub data:`, error)
    throw error
  }
}

/**
 * Processa dados de linguagens
 */
function processLanguagesData(result: GraphQLResponse): GithubData["languages"] {
  const languagesMap = new Map<string, { color: string; size: number }>()

  result.user.repositories?.nodes.forEach((repo: any) => {
    if (repo.languages?.edges) {
      repo.languages.edges.forEach((edge: any) => {
        const current = languagesMap.get(edge.node.name) || {
          color: edge.node.color,
          size: 0,
        }
        languagesMap.set(edge.node.name, {
          color: edge.node.color,
          size: current.size + edge.size,
        })
      })
    }
  })

  return Array.from(languagesMap.entries())
    .map(([name, data]) => ({
      name,
      color: data.color,
      size: data.size,
    }))
    .sort((a, b) => b.size - a.size)
}

/**
 * Processa dados de atividade
 */
function processActivityData(result: GraphQLResponse): GithubData["activity"] {
  const { user } = result
  return {
    totalCommitContributions: user.contributionsCollection?.totalCommitContributions || 0,
    totalRepositoriesWithContributedCommits: user.contributionsCollection?.totalRepositoriesWithContributedCommits || 0,
    totalPullRequestContributions: user.contributionsCollection?.totalPullRequestContributions || 0,
    totalPullRequestReviewContributions: user.contributionsCollection?.totalPullRequestReviewContributions || 0,
    totalIssueContributions: user.contributionsCollection?.totalIssueContributions || 0,
    restrictedContributionsCount: user.contributionsCollection?.restrictedContributionsCount || 0,
    repositoriesContributedTo: user.repositoriesContributedTo?.totalCount || 0,
    issueComments: user.issueComments?.totalCount || 0,
    organizations: user.organizations?.totalCount || 0,
    following: user.following?.totalCount || 0,
    sponsorshipsAsSponsor: user.sponsorshipsAsSponsor?.totalCount || 0,
    starredRepositories: user.starredRepositories?.totalCount || 0,
    watching: user.watching?.totalCount || 0,
    pullRequests: user.pullRequests?.totalCount || 0,
    issues: user.issues?.totalCount || 0,
    gists: user.gists?.totalCount || 0,
  }
}

/**
 * Processa dados de repositórios
 */
function processRepositoriesData(result: GraphQLResponse): GithubData["repositories"] {
  const repositories =
    result.user.repositories?.nodes.map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      url: repo.url,
      stargazerCount: repo.stargazers?.totalCount || 0,
      forkCount: repo.forkCount || 0,
      watchers: {
        totalCount: repo.watchers?.totalCount || 0,
      },
      packages: {
        totalCount: repo.packages?.totalCount || 0,
      },
      primaryLanguage: repo.languages?.edges?.[0]?.node || null,
      updatedAt: repo.updatedAt,
    })) || []

  return {
    totalCount: repositories.length,
    nodes: repositories,
  }
}

/**
 * Processa dados de licença favorita
 */
function processFavoriteLicenseData(result: GraphQLResponse): GithubData["favoriteLicense"] {
  const repositories = result.user.repositories?.nodes || []
  const total = repositories.length || 0
  const licenses = repositories.filter((repo: any) => repo.licenseInfo).map((repo: any) => repo.licenseInfo.name)

  const licenseCount = new Map<string, number>()
  licenses.forEach((license) => {
    licenseCount.set(license, (licenseCount.get(license) || 0) + 1)
  })

  let favoriteLicense = "No License"
  let maxCount = 0

  licenseCount.forEach((count, license) => {
    if (count > maxCount) {
      maxCount = count
      favoriteLicense = license
    }
  })

  return {
    name: favoriteLicense,
    count: maxCount,
    total,
  }
}

/**
 * Processa dados de repositórios favoritados
 */
function processStarredRepositoriesData(result: GraphQLResponse): GithubData["starredRepositories"] {
  const starred = result.user.starredRepositories
  if (!starred) {
    return { totalCount: 0, nodes: [] }
  }

  return {
    totalCount: starred.totalCount || 0,
    nodes: (starred.nodes || []).map((repo: any) => ({
      name: repo.name,
      nameWithOwner: repo.nameWithOwner,
      description: repo.description,
      url: repo.url,
      stargazerCount: repo.stargazerCount || 0,
      forkCount: repo.forkCount || 0,
      primaryLanguage: repo.primaryLanguage || null,
      updatedAt: repo.updatedAt,
    })),
  }
}

/**
 * Processa dados de gists (GraphQL)
 */
async function processGistsData(
  graphqlClient: ReturnType<typeof graphql.defaults>,
  rest: Octokit,
  username: string,
  data: Partial<GithubData>
): Promise<void> {
  const query = SECTION_QUERIES.gists
  const result = await graphqlClient<GraphQLResponse>(query, { login: username })

  const gists = result.user.gists
  if (!gists) {
    data.gists = { totalCount: 0, nodes: [] }
    return
  }

  data.gists = {
    totalCount: gists.totalCount || 0,
    nodes: (gists.nodes || []).map((gist: any) => ({
      name: gist.name || "Untitled",
      description: gist.description,
      url: gist.url,
      files: (gist.files || []).map((file: any) => ({
        name: file.name,
        language: file.language?.name || null,
      })),
      updatedAt: gist.updatedAt,
      stargazerCount: gist.stargazerCount || 0,
    })),
  }
}

/**
 * Processa dados de gists (REST API fallback)
 */
async function processGistsDataRest(rest: Octokit, username: string, data: Partial<GithubData>): Promise<void> {
  try {
    const response = await rest.gists.listForUser({
      username,
      per_page: 20,
    })

    data.gists = {
      totalCount: response.data.length,
      nodes: response.data.map((gist) => ({
        name: Object.keys(gist.files || {})[0] || "Untitled",
        description: gist.description,
        url: gist.html_url,
        files: Object.values(gist.files || {}).map((file: any) => ({
          name: file.filename,
          language: file.language || null,
        })),
        updatedAt: gist.updated_at,
        stargazerCount: 0, // Não disponível na REST API básica
      })),
    }
  } catch (error) {
    console.warn("Error fetching gists via REST API:", error)
    data.gists = { totalCount: 0, nodes: [] }
  }
}

/**
 * Processa dados de top repositórios
 */
function processTopRepositoriesData(result: GraphQLResponse): GithubData["topRepositories"] {
  const topRepos = result.user.topRepositories
  if (!topRepos || !topRepos.nodes) {
    return []
  }

  // Filtrar nulls (alguns repositórios podem retornar null se não tiverem permissão)
  return topRepos.nodes
    .filter((repo: any) => repo !== null)
    .map((repo: any) => ({
      name: repo.name,
      nameWithOwner: repo.nameWithOwner || repo.name,
      description: repo.description,
      url: repo.url,
      stargazerCount: repo.stargazerCount || 0,
      forkCount: repo.forkCount || 0,
      primaryLanguage: repo.primaryLanguage || null,
      updatedAt: repo.updatedAt,
    }))
}

/**
 * Processa dados do Calendar com suporte a múltiplos anos
 */
async function processCalendarData(
  graphqlClient: ReturnType<typeof graphql.defaults>,
  username: string,
  config: GithubConfig,
  data: Partial<GithubData>
): Promise<void> {
  const yearMode = config.calendar_year_mode || "current_year"
  const maxYears = config.calendar_full_max_years || 5
  const currentYear = new Date().getFullYear()

  // Determinar quais anos buscar
  let yearsToFetch: number[] = []
  if (yearMode === "current_year") {
    yearsToFetch = [currentYear]
  } else if (yearMode === "last_year") {
    yearsToFetch = [currentYear - 1]
  } else if (yearMode === "last_6_months") {
    // Para last_6_months, buscar o ano atual (vamos filtrar depois)
    yearsToFetch = [currentYear]
  } else if (yearMode === "full") {
    // Buscar até maxYears anos, começando do ano atual e indo para trás
    for (let i = 0; i < maxYears; i++) {
      const year = currentYear - i
      if (year >= 2000) {
        yearsToFetch.push(year)
      }
    }
  } else {
    // Fallback para current_year
    yearsToFetch = [currentYear]
  }

  const query = SECTION_QUERIES.calendar
  const calendarYears: Array<{ year: number; totalContributions: number; weeks: ContributionWeek[] }> = []
  let totalContributions = 0
  let allWeeks: ContributionWeek[] = []

  // Buscar dados para cada ano
  for (const year of yearsToFetch) {
    const fromDate = new Date(`${year}-01-01T00:00:00Z`)
    const toDate = new Date(`${year}-12-31T23:59:59Z`)

    try {
      const result = await graphqlClient<GraphQLResponse>(query, {
        login: username,
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
      })

      const calendar = result.user.contributionsCollection?.contributionCalendar
      if (calendar) {
        const yearContributions = calendar.totalContributions || 0
        const yearWeeks = calendar.weeks || []

        totalContributions += yearContributions
        allWeeks = [...allWeeks, ...yearWeeks]

        calendarYears.push({
          year,
          totalContributions: yearContributions,
          weeks: yearWeeks,
        })
      }
    } catch (error) {
      console.warn(`Error fetching calendar for year ${year}:`, error)
    }
  }

  // Se não conseguiu buscar nenhum ano, usar dados padrão (último ano)
  if (calendarYears.length === 0) {
    const currentYear = new Date().getFullYear()
    const fromDate = new Date(`${currentYear}-01-01T00:00:00Z`)
    const toDate = new Date(`${currentYear}-12-31T23:59:59Z`)

    try {
      const result = await graphqlClient<GraphQLResponse>(query, {
        login: username,
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
      })

      const calendar = result.user.contributionsCollection?.contributionCalendar
      data.calendar = {
        totalContributions: calendar?.totalContributions || 0,
        weeks: calendar?.weeks || [],
        years: calendar
          ? [
              {
                year: currentYear,
                totalContributions: calendar.totalContributions || 0,
                weeks: calendar.weeks || [],
              },
            ]
          : undefined,
      }
    } catch (error) {
      console.warn("Error fetching default calendar:", error)
      data.calendar = {
        totalContributions: 0,
        weeks: [],
      }
    }
  } else {
    let finalWeeks = allWeeks
    let finalTotalContributions = totalContributions

    // Se last_6_months, filtrar semanas para mostrar apenas últimos 6 meses
    if (yearMode === "last_6_months") {
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      sixMonthsAgo.setHours(0, 0, 0, 0)

      // Filtrar semanas que têm pelo menos um dia dentro dos últimos 6 meses
      finalWeeks = allWeeks.filter((week) => {
        return week.contributionDays.some((day) => {
          const dayDate = new Date(day.date)
          return dayDate >= sixMonthsAgo
        })
      })

      // Recalcular totalContributions baseado nas semanas filtradas
      finalTotalContributions = 0
      finalWeeks.forEach((week) => {
        week.contributionDays.forEach((day) => {
          finalTotalContributions += day.contributionCount || 0
        })
      })
    }

    data.calendar = {
      totalContributions: finalTotalContributions,
      weeks: finalWeeks,
      // Para last_6_months, não setar years (sempre undefined)
      // Para full mode com múltiplos anos, setar years
      years: yearMode === "last_6_months" ? undefined : calendarYears.length > 1 ? calendarYears : undefined,
    }
  }
}

/**
 * Processa dados de People (followers ou repository people)
 */
async function processPeopleData(
  graphqlClient: ReturnType<typeof graphql.defaults>,
  config: GithubConfig,
  data: Partial<GithubData>
): Promise<void> {
  const peopleType = config.people_type || "profile"
  const max = config.people_max || 10

  if (peopleType === "profile") {
    // Buscar followers
    const query = FOLLOWERS_QUERY
    const result = await graphqlClient<GraphQLResponse>(query, {
      login: config.username,
      max,
    })

    const followers = result.user.followers
    const followersNodes = await Promise.all(
      (followers?.nodes || []).map(async (follower: any) => {
        const avatarUrl = follower.avatarUrl || ""
        const avatarUrlBase64 =
          avatarUrl && (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://"))
            ? await urlToBase64(avatarUrl)
            : avatarUrl
        return {
          login: follower.login || "",
          name: follower.name || null,
          avatarUrl: avatarUrlBase64 || avatarUrl,
        }
      })
    )
    data.people = {
      type: "profile",
      totalCount: followers?.totalCount || 0,
      nodes: followersNodes,
    }
  } else {
    // Buscar people do repositório (contributors, stargazers, watchers)
    const repo = config.people_repository
    if (!repo) {
      data.people = { type: "repository", totalCount: 0, nodes: [] }
      return
    }

    const normalized = normalizeRepoUrl(repo)
    if (!normalized) {
      console.warn(`Invalid repository URL format: ${repo}. Expected format: owner/repo or https://github.com/owner/repo`)
      data.people = { type: "repository", totalCount: 0, nodes: [] }
      return
    }
    
    const { owner, repo: repoName } = normalized

    // Por padrão, buscar stargazers
    const query = REPOSITORY_STARGAZERS_QUERY
    const result = await graphqlClient<any>(query, {
      owner,
      repo: repoName,
      max,
    })

    const stargazers = result.repository?.stargazers
    const stargazersNodes = await Promise.all(
      (stargazers?.nodes || []).map(async (person: any) => {
        const avatarUrl = person.avatarUrl || ""
        const avatarUrlBase64 =
          avatarUrl && (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://"))
            ? await urlToBase64(avatarUrl)
            : avatarUrl
        return {
          login: person.login || "",
          name: person.name || null,
          avatarUrl: avatarUrlBase64 || avatarUrl,
        }
      })
    )
    data.people = {
      type: "repository",
      totalCount: stargazers?.totalCount || 0,
      nodes: stargazersNodes,
    }
  }
}

/**
 * Processa dados de Repository Contributors
 */
async function processRepositoryContributorsData(
  graphqlClient: ReturnType<typeof graphql.defaults>,
  rest: Octokit,
  config: GithubConfig,
  data: Partial<GithubData>
): Promise<void> {
  const repo = config.repository_contributors_repository
  if (!repo) {
    data.repositoryContributors = []
    return
  }

  const normalized = normalizeRepoUrl(repo)
  if (!normalized) {
    console.warn(`Invalid repository URL format: ${repo}. Expected format: owner/repo or https://github.com/owner/repo`)
    data.repositoryContributors = []
    return
  }
  
  const { owner, repo: repoName } = normalized

  try {
    // Usar REST API (mais confiável para contributors)
    const response = await rest.repos.listContributors({
      owner,
      repo: repoName,
      per_page: config.repository_contributors_max || 10,
    })

    data.repositoryContributors = await Promise.all(
      response.data.map(async (contributor: any) => {
        const avatarUrl = contributor.avatar_url || ""
        const avatarUrlBase64 =
          avatarUrl && (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://"))
            ? await urlToBase64(avatarUrl)
            : avatarUrl
        return {
          login: contributor.login,
          name: contributor.name || null,
          avatarUrl: avatarUrlBase64 || avatarUrl,
          contributions: contributor.contributions || 0,
        }
      })
    )
  } catch (error: any) {
    // Fallback para GraphQL se REST API falhar
    try {
      const query = REPOSITORY_CONTRIBUTORS_QUERY
      const result = await graphqlClient<any>(query, {
        owner,
        repo: repoName,
      })

      const history = result.repository?.defaultBranchRef?.target?.history?.nodes || []
      const contributorsMap = new Map<
        string,
        { login: string; name: string | null; avatarUrl: string; contributions: number }
      >()

      history.forEach((commit: any) => {
        const user = commit.author?.user
        if (!user) return

        const login = user.login
        if (!login) return

        const current = contributorsMap.get(login) || {
          login,
          name: user.name || null,
          avatarUrl: user.avatarUrl || "",
          contributions: 0,
        }

        contributorsMap.set(login, {
          ...current,
          contributions: current.contributions + 1,
        })
      })

      const contributorsArray = Array.from(contributorsMap.values())
        .sort((a, b) => b.contributions - a.contributions)
        .slice(0, config.repository_contributors_max || 10)

      data.repositoryContributors = await Promise.all(
        contributorsArray.map(async (contributor) => {
          const avatarUrl = contributor.avatarUrl || ""
          const avatarUrlBase64 =
            avatarUrl && (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://"))
              ? await urlToBase64(avatarUrl)
              : avatarUrl
          return {
            ...contributor,
            avatarUrl: avatarUrlBase64 || avatarUrl,
          }
        })
      )
    } catch (graphqlError) {
      console.warn("Error fetching repository contributors (both REST and GraphQL failed):", graphqlError)
      data.repositoryContributors = []
    }
  }
}

/**
 * Processa dados de Featured Repositories
 */
async function processFeaturedRepositoriesData(
  graphqlClient: ReturnType<typeof graphql.defaults>,
  config: GithubConfig,
  data: Partial<GithubData>
): Promise<void> {
  const urls = config.featured_repositories_urls
  if (!urls) {
    data.featuredRepositories = []
    return
  }

  const repoList = urls
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean)
  const featuredRepos: GithubData["featuredRepositories"] = []

  // Processar cada URL (até 20 URLs são permitidas)
  // Se uma URL estiver quebrada/inválida, ela é ignorada e o processo continua
  for (const repoUrl of repoList.slice(0, 20)) {
    const normalized = normalizeRepoUrl(repoUrl)
    if (!normalized) {
      console.warn(`Invalid repository URL format: ${repoUrl}. Expected format: owner/repo or https://github.com/owner/repo`)
      continue
    }
    
    const { owner, repo: repoName } = normalized

    try {
      const query = FEATURED_REPOSITORIES_QUERY
      const result = await graphqlClient<any>(query, {
        owner,
        repo: repoName,
      })

      const repo = result.repository
      if (repo) {
        featuredRepos.push({
          name: repo.name,
          nameWithOwner: repo.nameWithOwner,
          description: repo.description,
          url: repo.url,
          createdAt: repo.createdAt || new Date().toISOString(),
          stargazerCount: repo.stargazerCount || 0,
          forkCount: repo.forkCount || 0,
          issuesCount: repo.issues?.totalCount,
          pullRequestsCount: repo.pullRequests?.totalCount,
          primaryLanguage: repo.primaryLanguage || null,
          license: repo.licenseInfo
            ? {
                name: repo.licenseInfo.name,
                spdxId: repo.licenseInfo.spdxId,
              }
            : null,
        })
      } else {
        console.warn(`Repository not found: ${repoUrl}`)
      }
    } catch (error) {
      // URL quebrada ou repositório não encontrado - continuar com outras URLs
      console.warn(`Error fetching featured repository ${repoUrl}:`, error)
    }
  }

  // Mostrar apenas os repositórios que foram encontrados com sucesso
  data.featuredRepositories = featuredRepos
}

/**
 * Processa dados de Notable Contributions
 */
async function processNotableContributionsData(
  graphqlClient: ReturnType<typeof graphql.defaults>,
  username: string,
  config: GithubConfig,
  data: Partial<GithubData>
): Promise<void> {
  const query = RECENT_ACTIVITY_QUERY
  const result = await graphqlClient<GraphQLResponse>(query, { login: username })

  const contributions: GithubData["notableContributions"] = []
  const commitContributions = result.user.contributionsCollection?.commitContributionsByRepository || []

  commitContributions.forEach((contribution: any) => {
    if (contribution.contributions.totalCount > 0) {
      contributions.push({
        repository: contribution.repository.nameWithOwner,
        repositoryUrl: contribution.repository.url,
        contributions: contribution.contributions.totalCount,
        type: "commits",
      })
    }
  })

  data.notableContributions = contributions
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, config.notable_contributions_max || 10)
}

/**
 * Processa dados de Recent Activity usando REST Events API
 */
async function processRecentActivityData(
  rest: Octokit,
  username: string,
  config: GithubConfig,
  data: Partial<GithubData>
): Promise<void> {
  const max = config.recent_activity_max || 10
  const activities: GithubData["recentActivity"] = []

  try {
    // Fetch user's public events (últimos 30 dias, aproximadamente 3 páginas)
    const events: any[] = []
    for (let page = 1; page <= 3; page++) {
      try {
        const response = await rest.activity.listPublicEventsForUser({
          username,
          per_page: 100,
          page,
        })
        events.push(...response.data)
        // Se retornou menos de 100, não há mais páginas
        if (response.data.length < 100) break
      } catch (error) {
        // Se erro 404 ou similar, usuário não tem eventos públicos
        break
      }
    }

    // Filtrar apenas eventos do próprio usuário e dos últimos 30 dias
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const userEvents = events.filter(
      (event) =>
        event.actor?.login?.toLowerCase() === username.toLowerCase() &&
        event.created_at &&
        new Date(event.created_at) > thirtyDaysAgo
    )

    // Mapear eventos para atividades
    for (const event of userEvents.slice(0, max * 2)) {
      // Limitar para ter margem ao filtrar
      try {
        const repoName = event.repo?.name || ""
        const repoUrl = event.repo?.url ? `https://github.com/${event.repo.name}` : ""
        const createdAt = event.created_at

        switch (event.type) {
          case "PushEvent": {
            // Push com commits
            const payload = event.payload as any
            const commits = payload.commits || []
            const commitsCount = commits.length

            // Se só tem 1 commit, usar a mensagem do commit
            // Se tem vários, usar formato "X commits"
            let title: string
            if (commitsCount === 1 && commits[0]?.message) {
              title = commits[0].message.split("\n")[0] // Primeira linha
              if (title.length > 80) {
                title = title.substring(0, 77) + "..."
              }
            } else {
              title = `${commitsCount} commit${commitsCount > 1 ? "s" : ""}`
            }

            // Tentar pegar stats do push (pode não estar disponível)
            let filesChanged:
              | {
                  files: number
                  additions: number
                  deletions: number
                }
              | undefined
            if (payload.size) {
              // A API pode retornar size (additions + deletions)
              // Mas não temos breakdown exato sem fazer requests adicionais
              filesChanged = {
                files: 0,
                additions: payload.size > 0 ? payload.size : 0,
                deletions: 0,
              }
            }

            // Link: se 1 commit, link do commit; se vários, link do compare
            let url = repoUrl
            if (commitsCount === 1 && commits[0]?.sha) {
              url = `${repoUrl}/commit/${commits[0].sha}`
            } else if (commitsCount > 1 && payload.before && payload.head) {
              url = `${repoUrl}/compare/${payload.before}...${payload.head}`
            }

            activities.push({
              type: "commit",
              title,
              repository: repoName,
              url,
              date: createdAt,
              filesChanged,
            })
            break
          }

          case "PullRequestEvent": {
            const payload = event.payload as any
            const pr = payload.pull_request
            const action = payload.action

            if (!pr) break

            let type: "pr" | "merged" = "pr"
            if (action === "closed" && pr.merged) {
              type = "merged"
            } else if (action !== "opened" && action !== "closed") {
              // Ignorar outros actions (synchronize, etc)
              break
            }

            const title = pr.title || `PR #${pr.number}`
            const prNumber = pr.number
            const url = pr.html_url || `${repoUrl}/pull/${prNumber}`

            activities.push({
              type,
              title: type === "merged" ? `#${prNumber} ${title}` : title,
              repository: repoName,
              url,
              date: createdAt,
              filesChanged:
                pr.additions && pr.deletions
                  ? {
                      files: pr.changed_files || 0,
                      additions: pr.additions,
                      deletions: pr.deletions,
                    }
                  : undefined,
            })
            break
          }

          case "IssuesEvent": {
            const payload = event.payload as any
            const issue = payload.issue
            const action = payload.action

            if (!issue || (action !== "opened" && action !== "closed")) break

            const title = issue.title || `Issue #${issue.number}`
            const issueNumber = issue.number
            const url = issue.html_url || `${repoUrl}/issues/${issueNumber}`

            activities.push({
              type: "issue",
              title: `#${issueNumber} ${title}`,
              repository: repoName,
              url,
              date: createdAt,
            })
            break
          }

          case "IssueCommentEvent": {
            const payload = event.payload as any
            const comment = payload.comment
            const issue = payload.issue

            if (!comment || !issue) break

            const issueNumber = issue.number
            const isPR = issue.pull_request !== undefined
            const url = comment.html_url || issue.html_url || `${repoUrl}/${isPR ? "pull" : "issues"}/${issueNumber}`

            activities.push({
              type: "comment",
              title: isPR ? `Commented on PR #${issueNumber}` : `Commented on issue #${issueNumber}`,
              repository: repoName,
              url,
              date: createdAt,
            })
            break
          }

          case "CreateEvent": {
            const payload = event.payload as any
            const refType = payload.ref_type

            if (refType === "branch") {
              const ref = payload.ref
              activities.push({
                type: "branch",
                title: ref || "Created new branch",
                repository: repoName,
                url: `${repoUrl}/tree/${ref || ""}`,
                date: createdAt,
              })
            }
            // Ignorar outros tipos (tag, repository)
            break
          }

          case "PullRequestReviewEvent": {
            const payload = event.payload as any
            const review = payload.review
            const pr = payload.pull_request

            if (!review || !pr) break

            const prNumber = pr.number
            const reviewState = review.state
            const url = review.html_url || pr.html_url || `${repoUrl}/pull/${prNumber}`

            activities.push({
              type: "comment",
              title: `Reviewed PR #${prNumber}`,
              repository: repoName,
              url,
              date: createdAt,
            })
            break
          }
        }
      } catch (error) {
        // Ignorar eventos que falharam ao processar
        console.warn(`Error processing event:`, error)
      }
    }

    // Ordenar por data (mais recente primeiro) e limitar
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    data.recentActivity = activities.slice(0, max)
  } catch (error) {
    console.error("Error processing recent activity:", error)
    data.recentActivity = []
  }
}

/**
 * Processa dados de code habits (usa REST API)
 */
async function processCodeHabitsData(
  rest: Octokit,
  login: string,
  days = 90
): Promise<{ data: GithubData["codeHabits"]; warning?: { type: 'rate_limit' | 'api_error' | 'partial_data'; message: string } }> {
  const commitsByDay: Record<string, number> = {}
  const commitsByHour: Record<number, number> = {}
  let totalCommits = 0
  const languages: Record<string, { count: number; color: string }> = {}
  const fileTypes: Record<string, number> = {}

  try {
    const startTime = Date.now()
    // Fetch public events - using manual pagination for better control over date filtering
    // According to GitHub Events API documentation, public events API returns events for public repos
    // The payload may or may not include commits array, so we use compareCommits API when needed
    // Note: Events API returns up to 300 events total, and events are returned in reverse chronological order
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    const events: any[] = []
    const maxPages = 3 // Events API returns max 300 events (3 pages of 100)

    for (let page = 1; page <= maxPages; page++) {
      try {
        const response = await rest.activity.listPublicEventsForUser({
          username: login,
          per_page: 100,
          page,
        })
        
        // Log response for debugging
        if (process.env.DEBUG_GITHUB === "1" || (page === 1 && events.length === 0)) {
          console.log(`[GitHub CodeHabits] Page ${page}: Got ${response.data.length} events`)
        }
        
        // Filter events by date as we receive them (events are in reverse chronological order)
        let allEventsRecent = true
        for (const event of response.data) {
          if (!event.created_at) continue
          
          const eventDate = new Date(event.created_at)
          if (eventDate > cutoffDate) {
            events.push(event)
          } else {
            // Events are in reverse chronological order, so if we hit an old event, we're done
            allEventsRecent = false
            break
          }
        }
        
        // If we found an old event or got less than 100 events, we've reached the end
        if (!allEventsRecent || response.data.length < 100) {
          break
        }
      } catch (apiError: any) {
        // Log API errors but continue if it's just an empty page
        const isNotFound = apiError.status === 404
        const isAuthError = apiError.status === 401 || apiError.status === 403
        
        if (isAuthError) {
          throw new Error(`GitHub API authentication failed: ${apiError.message}. Token may be invalid or expired.`)
        }
        
        if (isNotFound) {
          // User not found or no events - this is OK, just break
          if (process.env.DEBUG_GITHUB === "1") {
            console.log(`[GitHub CodeHabits] No events found for ${login} (404)`)
          }
          break
        }
        
        // For other errors, log and continue (might be rate limit or temporary issue)
        console.warn(`[GitHub CodeHabits] Error fetching events page ${page} for ${login}:`, apiError.message)
        if (page === 1) {
          // If first page fails, throw to surface the issue
          throw apiError
        }
        break
      }
    }

    // Log total events fetched for debugging
    const eventsFetchTime = Date.now() - startTime
    console.log(`[GitHub CodeHabits] Fetched ${events.length} total events for ${login} in ${eventsFetchTime}ms`)
    if (events.length > 0) {
      const eventTypes = [...new Set(events.map(e => e.type))]
      const eventTypeCounts = eventTypes.reduce((acc, type) => {
        acc[type] = events.filter(e => e.type === type).length
        return acc
      }, {} as Record<string, number>)
      console.log(`[GitHub CodeHabits] Event types found:`, eventTypeCounts)
      
      // Log sample events for debugging
      if (process.env.DEBUG_GITHUB === "1") {
        console.log(`[GitHub CodeHabits] Sample events (first 3):`, events.slice(0, 3).map(e => ({
          id: (e as any).id,
          type: e.type,
          actor: (e as any).actor?.login,
          repo: (e as any).repo?.name,
          created_at: (e as any).created_at,
        })))
      }
    } else {
      console.warn(`[GitHub CodeHabits] ⚠️ No events returned from API! This may indicate:`)
      console.warn(`  - User has no public activity`)
      console.warn(`  - API returned empty response`)
      console.warn(`  - Rate limit or authentication issue`)
    }
    
    // Filter only user's PushEvents
    // According to GitHub Events API:
    // - Events have: id, type, actor, repo, payload, public, created_at
    // - PushEvent type indicates a push to a repository
    // - actor.login is the username who performed the action
    let pushEvents = events
      .filter((event) => {
        // Type must be PushEvent
        if (event.type !== "PushEvent") return false
        
        // Actor must match the requested user (case-insensitive)
        const actorLogin = (event as any).actor?.login
        if (!actorLogin || actorLogin.toLowerCase() !== login.toLowerCase()) return false
        
        // Must be within the time window
        const createdAt = (event as any).created_at
        if (!createdAt) return false
        const eventDate = new Date(createdAt)
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        if (eventDate <= cutoffDate) return false
        
        return true
      })
    
    // Limit to max 100 most recent PushEvents for performance
    // Increased from 50 since processing is now much faster with parallelization
    const MAX_PUSH_EVENTS = 100
    if (pushEvents.length > MAX_PUSH_EVENTS) {
      pushEvents = pushEvents.slice(0, MAX_PUSH_EVENTS)
      console.log(`[GitHub CodeHabits] Limited to ${MAX_PUSH_EVENTS} most recent PushEvents for performance`)
    }
    
    // Log push events for debugging
    if (process.env.DEBUG_GITHUB === "1" || pushEvents.length === 0) {
      console.log(`[GitHub CodeHabits] Found ${pushEvents.length} PushEvents for ${login} in last ${days} days`)
      if (pushEvents.length === 0 && events.length > 0) {
        const eventTypes = events.map(e => e.type).reduce((acc, type) => {
          acc[type] = (acc[type] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        console.log(`[GitHub CodeHabits] Event types found:`, eventTypes)
      }
      if (pushEvents.length === 0) {
        console.warn(`[GitHub CodeHabits] ⚠️ No push events found for ${login}. This may indicate:`)
        console.warn(`  - User has no public commits in the last ${days} days`)
        console.warn(`  - User's commits are in private repositories (not visible via public events API)`)
        console.warn(`  - Token may not have 'public_repo' or 'repo' scope`)
      }
    }

    // Collect all commit SHAs from push events (limit to last 500 commits for performance)
    // According to GitHub Events API: PushEvent payload may not include commits array
    // We need to fetch commits using the head/before SHAs via compareCommits API
    const commitShas: Array<{ repo: string; owner: string; sha: string; date: Date }> = []
    const MAX_COMMITS = 500 // Increased from 250 - processing is now optimized with parallelization
    const MAX_TIME_MS = 30000 // 30 seconds max processing time (safety limit)
    
    console.log(`[GitHub CodeHabits] Processing ${pushEvents.length} PushEvents to collect commits...`)
    const commitsCollectionStartTime = Date.now()
    let totalCommitsFromCompare = 0
    
    // Helper function to process a single PushEvent and return commits
    async function processPushEvent(event: any): Promise<Array<{ sha: string; owner: string; repo: string; date: Date }>> {
      if (!event.created_at) return []
      
      // Extract repo info - format is "owner/repo"
      const repo = (event as any).repo?.name
      if (!repo) return []
      
      const [owner, repoName] = repo.split("/")
      if (!owner || !repoName) return []
      
      const payload = (event as any).payload
      const eventDate = new Date(event.created_at)
      
      // Check if payload has commits array (older API format - rarely used now)
      let commits: Array<{ sha: string }> = []
      if (payload?.commits && Array.isArray(payload.commits) && payload.commits.length > 0) {
        // Old API format: commits array is present (uncommon in current API)
        commits = payload.commits
        if (process.env.DEBUG_GITHUB === "1") {
          console.log(`[GitHub CodeHabits] PushEvent ${event.id} has commits array with ${commits.length} commits`)
        }
      } else if (payload?.head && payload?.before) {
        // New API format: payload has head and before SHAs but no commits array
        // According to GitHub Events API: PushEvent payload has head (newest) and before (oldest) SHAs
        // We need to fetch commits between before and head using compareCommits API
        // Note: If head === before, it's a force push with same SHA (no new commits)
        if (payload.head === payload.before) {
          // Force push with same SHA - no new commits, use head SHA as fallback (1 commit)
          if (process.env.DEBUG_GITHUB === "1") {
            console.log(`[GitHub CodeHabits] PushEvent ${(event as any).id}: head === before (force push with same SHA), using head SHA`)
          }
          commits = [{ sha: payload.head }]
        } else {
          // Fetch commits between before and head using compare API
          // According to Octokit docs: compareCommits returns commits that are reachable from head but not from base
          try {
            const compareResponse = await rest.repos.compareCommits({
              owner,
              repo: repoName,
              base: payload.before,
              head: payload.head,
            })
            
            // Extract commit SHAs from the comparison
            // According to GitHub API: commits array contains all commits between base and head (in reverse chronological order)
            const commitNodes = compareResponse.data.commits || []
            commits = commitNodes.map((commit: any) => ({ sha: commit.sha }))
            
            if (process.env.DEBUG_GITHUB === "1" && commits.length > 0) {
              console.log(`[GitHub CodeHabits] Compare API: ${owner}/${repoName} - ${commits.length} commits between ${payload.before.substring(0, 7)}..${payload.head.substring(0, 7)}`)
            } else if (commits.length === 0) {
              // Compare returned 0 commits - this might happen if commits are not in same branch
              // Use head SHA as fallback (at least 1 commit)
              if (process.env.DEBUG_GITHUB === "1") {
                console.warn(`[GitHub CodeHabits] Compare API returned 0 commits for ${owner}/${repoName} (${payload.before.substring(0, 7)}..${payload.head.substring(0, 7)}) - using head SHA as fallback`)
              }
              commits = [{ sha: payload.head }]
            }
          } catch (compareError: any) {
            // Handle errors according to GitHub API documentation
            // 404: base or head was not found (deleted branch, commit not found)
            // 422: No common ancestor between base and head
            // 500: Internal server error
            // Rate limit: Octokit handles this automatically, but we catch it here as fallback
            if (compareError.status === 404) {
              // Branch or commit not found - use head SHA as fallback (at least 1 commit)
              if (process.env.DEBUG_GITHUB === "1") {
                console.warn(`[GitHub CodeHabits] Compare API 404 for ${owner}/${repoName} (${payload.before.substring(0, 7)}..${payload.head.substring(0, 7)}) - branch/commit not found, using head SHA as fallback`)
              }
            } else if (compareError.status === 422) {
              // No common ancestor - use head SHA as fallback
              if (process.env.DEBUG_GITHUB === "1") {
                console.warn(`[GitHub CodeHabits] Compare API 422 for ${owner}/${repoName} (${payload.before.substring(0, 7)}..${payload.head.substring(0, 7)}) - no common ancestor, using head SHA as fallback`)
              }
            } else {
              // Other errors (rate limit, auth, etc.) - Octokit should handle rate limits automatically
              console.warn(`[GitHub CodeHabits] Failed to compare commits for ${owner}/${repoName} (${payload.before.substring(0, 7)}..${payload.head.substring(0, 7)}): ${compareError.message} (status: ${compareError.status})`)
            }
            // Use head SHA as fallback (at least 1 commit)
            commits = [{ sha: payload.head }]
          }
        }
      } else if (payload?.head) {
        // Fallback: use head SHA if available (at least 1 commit)
        // This handles cases where before is missing
        commits = [{ sha: payload.head }]
      } else {
        // No commit information available - skip this push event
        if (process.env.DEBUG_GITHUB === "1") {
          console.warn(`[GitHub CodeHabits] PushEvent ${(event as any).id} has no commit information (no head/before/commits)`)
        }
        return []
      }
      
      // Return commits with metadata
      return commits
        .filter(commit => commit?.sha)
        .map(commit => ({
          sha: commit.sha,
          owner,
          repo: repoName,
          date: eventDate,
        }))
    }
    
    // Process PushEvents in parallel batches for performance
    const BATCH_SIZE = 18 // Process 18 PushEvents in parallel (safe for rate limits)
    let earlyExit = false
    
    for (let i = 0; i < pushEvents.length && !earlyExit; i += BATCH_SIZE) {
      // Check time limit
      const elapsedTime = Date.now() - commitsCollectionStartTime
      if (elapsedTime > MAX_TIME_MS) {
        console.log(`[GitHub CodeHabits] Reached time limit of ${MAX_TIME_MS}ms, stopping early (processed ${i}/${pushEvents.length} PushEvents)`)
        earlyExit = true
        break
      }
      
      // Check commits limit
      if (commitShas.length >= MAX_COMMITS) {
        console.log(`[GitHub CodeHabits] Reached limit of ${MAX_COMMITS} commits, stopping`)
        earlyExit = true
        break
      }
      
      const batch = pushEvents.slice(i, i + BATCH_SIZE)
      
      // Process batch in parallel using Promise.allSettled to handle individual failures
      const batchResults = await Promise.allSettled(
        batch.map(event => processPushEvent(event))
      )
      
      // Collect commits from successful batch results
      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          const batchCommits = result.value
          totalCommitsFromCompare += batchCommits.length
          
          for (const commit of batchCommits) {
            if (commitShas.length >= MAX_COMMITS) {
              earlyExit = true
              break
            }
            
            commitShas.push(commit)
            
            // Count commits by day and hour based on the push event time
            const day = commit.date.toLocaleDateString("en-US", { weekday: "long" })
            const hour = commit.date.getHours()
            
            commitsByDay[day] = (commitsByDay[day] || 0) + 1
            commitsByHour[hour] = (commitsByHour[hour] || 0) + 1
            totalCommits++
          }
          
          if (earlyExit) break
        } else {
          // Log rejected promises but continue
          if (process.env.DEBUG_GITHUB === "1") {
            console.warn(`[GitHub CodeHabits] Failed to process PushEvent in batch:`, result.reason)
          }
        }
      }
      
      // Small delay between batches to avoid rate limits (Octokit handles this, but extra safety)
      if (i + BATCH_SIZE < pushEvents.length && !earlyExit) {
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
    }
    
    const commitsCollectionTime = Date.now() - commitsCollectionStartTime
    const commitsTimeLimitReached = commitsCollectionTime >= MAX_TIME_MS
    if (commitsTimeLimitReached) {
      console.log(`[GitHub CodeHabits] Processed PushEvents until time limit reached, collected ${commitShas.length} commit SHAs (${totalCommitsFromCompare} via compare API) in ${commitsCollectionTime}ms`)
    } else {
      console.log(`[GitHub CodeHabits] Processed ${pushEvents.length} PushEvents in batches, collected ${commitShas.length} commit SHAs (${totalCommitsFromCompare} via compare API) in ${commitsCollectionTime}ms`)
    }

    // Calculate commit statistics from actual commit data
    // Optimize: Only analyze detailed stats for the most recent 200 commits (increased from 100)
    // Older commits already have basic counts (day/hour) from push event timestamps
    const MAX_DETAILED_ANALYSIS = 200
    // Check remaining time for detailed analysis
    const elapsedTimeBeforeAnalysis = Date.now() - startTime
    const remainingTimeForAnalysis = MAX_TIME_MS - elapsedTimeBeforeAnalysis
    
    let commitsToAnalyze = commitShas.slice(0, Math.min(MAX_DETAILED_ANALYSIS, commitShas.length))
    
    // If we're running low on time, reduce commits to analyze
    if (remainingTimeForAnalysis < 15000 && commitsToAnalyze.length > 100) {
      commitsToAnalyze = commitShas.slice(0, 100)
      console.log(`[GitHub CodeHabits] Reduced detailed analysis to 100 commits due to time constraints`)
    }
    
    const remainingCommits = commitShas.length - commitsToAnalyze.length
    
    console.log(`[GitHub CodeHabits] Analyzing detailed stats for ${commitsToAnalyze.length} most recent commits${remainingCommits > 0 ? ` (${remainingCommits} older commits will use basic counts only)` : ''}`)
    
    let totalFilesChanged = 0
    let totalChanges = 0
    let largestCommit = 0
    let analyzedCommitsCount = 0
    let rateLimitHit = false
    const commitAnalysisStartTime = Date.now()

    // Process commits in batches to avoid rate limits (only detailed analysis commits)
    const batchSize = 20
    for (let i = 0; i < commitsToAnalyze.length; i += batchSize) {
      // Check time limit during analysis
      const elapsedAnalysisTime = Date.now() - commitAnalysisStartTime
      const totalElapsedTime = Date.now() - startTime
      if (totalElapsedTime > MAX_TIME_MS) {
        console.log(`[GitHub CodeHabits] Reached time limit during analysis, stopping early (analyzed ${analyzedCommitsCount}/${commitsToAnalyze.length} commits)`)
        break
      }
      
      // Se rate limit foi atingido, parar e usar o que já foi coletado
      if (rateLimitHit) {
        console.warn(`⚠️ [GitHub CodeHabits] Rate limit atingido. Usando ${analyzedCommitsCount} commits já analisados de ${commitsToAnalyze.length} total.`)
        break
      }

      const batch = commitsToAnalyze.slice(i, i + batchSize)
      const commitPromises = batch.map(async ({ owner, repo, sha }) => {
        try {
          const commitResponse = await rest.repos.getCommit({
            owner,
            repo,
            ref: sha,
          })

          const commit = commitResponse.data
          const stats = commit.stats
          const files = commit.files || []

          if (stats) {
            const changes = (stats.additions || 0) + (stats.deletions || 0)
            totalChanges += changes
            totalFilesChanged += stats.total || files.length
            largestCommit = Math.max(largestCommit, changes)
            analyzedCommitsCount++
          }
        } catch (error: any) {
          // Detectar rate limit especificamente
          const isRateLimit =
            error.status === 429 ||
            error.response?.status === 429 ||
            error.message?.toLowerCase().includes("rate limit") ||
            error.message?.toLowerCase().includes("api rate limit")

          if (isRateLimit) {
            rateLimitHit = true
            const resetTime = error.response?.headers?.["x-ratelimit-reset"]
              ? new Date(parseInt(error.response.headers["x-ratelimit-reset"]) * 1000).toISOString()
              : "desconhecido"
            console.warn(
              `⚠️ [GitHub CodeHabits] Rate limit atingido ao buscar commit ${sha} de ${owner}/${repo}. Reset em: ${resetTime}`
            )
            return // Para este commit, mas continua processando os outros do batch
          }

          // Ignore outros erros (private repo, deleted commit, etc.)
          if (process.env.DEBUG_GITHUB === "1") {
            console.warn(`Failed to fetch commit ${sha} from ${owner}/${repo}:`, error.message)
          }
        }
      })

      await Promise.all(commitPromises)

      // Pequeno delay entre batches para evitar rate limits
      if (i + batchSize < commitsToAnalyze.length && !rateLimitHit) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }
    
    const commitAnalysisTime = Date.now() - commitAnalysisStartTime
    console.log(`[GitHub CodeHabits] Analyzed ${analyzedCommitsCount} commits in detail in ${commitAnalysisTime}ms`)

    // Scale statistics to account for commits not analyzed in detail
    // Use average from analyzed commits as proxy for all commits
    const averageChangesPerCommit = analyzedCommitsCount > 0 ? Math.round(totalChanges / analyzedCommitsCount) : 0
    
    // If we analyzed fewer commits than total, scale the stats estimates
    // This provides a more accurate picture while avoiding excessive API calls
    if (analyzedCommitsCount > 0 && totalCommits > analyzedCommitsCount) {
      const scalingFactor = totalCommits / analyzedCommitsCount
      totalChanges = Math.round(totalChanges * scalingFactor)
      totalFilesChanged = Math.round(totalFilesChanged * scalingFactor)
    }

    const totalProcessingTime = Date.now() - startTime
    const timeLimitReached = totalProcessingTime >= MAX_TIME_MS
    
    // Log summary for debugging and performance tracking
    if (process.env.DEBUG_GITHUB === "1" || totalCommits === 0) {
      console.log(`[GitHub CodeHabits] Summary for ${login}:`)
      console.log(`  - Total commits from push events: ${totalCommits}`)
      console.log(`  - Commits analyzed in detail: ${analyzedCommitsCount} of ${commitsToAnalyze.length}`)
      console.log(`  - Commit SHAs collected: ${commitShas.length}`)
      console.log(`  - Commits by hour keys: ${Object.keys(commitsByHour).length}`)
      console.log(`  - Commits by day keys: ${Object.keys(commitsByDay).length}`)
      console.log(`  - Total processing time: ${totalProcessingTime}ms${timeLimitReached ? ` (time limit ${MAX_TIME_MS}ms reached)` : ''}`)
    } else {
      const timeLimitMsg = timeLimitReached ? ` (time limit reached)` : ''
      console.log(`[GitHub CodeHabits] Completed processing in ${totalProcessingTime}ms${timeLimitMsg} (events: ${eventsFetchTime}ms, commits: ${commitsCollectionTime}ms, analysis: ${commitAnalysisTime}ms)`)
    }

    const result = {
      commitsByHour,
      commitsByDay,
      languages,
      commitStats: {
        averageChangesPerCommit,
        totalFilesChanged,
        largestCommit,
      },
      analyzedCommits: analyzedCommitsCount || totalCommits,
    }

    // Add warning if time limit was reached
    if (timeLimitReached) {
      return {
        data: result,
        warning: {
          type: 'partial_data' as const,
          message: 'Processing time limit reached. Data may be incomplete but represents a good sample.',
        },
      }
    }

    // Add warning if rate limit was hit
    if (rateLimitHit) {
      return {
        data: result,
        warning: {
          type: 'rate_limit' as const,
          message: 'API rate limit reached. Some data may be incomplete.',
        },
      }
    }

    // Add warning if no commits found
    if (totalCommits === 0 && pushEvents.length === 0) {
      return {
        data: result,
        warning: {
          type: 'partial_data' as const,
          message: 'No commit activity found in the last 90 days.',
        },
      }
    }

    return { data: result }
  } catch (error: any) {
    // Log detailed error information for debugging
    const errorMessage = error?.message || String(error)
    const errorStatus = error?.status || error?.response?.status
    const isRateLimit = errorStatus === 429 || errorMessage?.toLowerCase().includes("rate limit")
    const isAuthError = errorStatus === 401 || errorStatus === 403 || errorMessage?.toLowerCase().includes("bad credentials")
    
    console.error(`[GitHub CodeHabits] Error processing code habits for ${login}:`, {
      message: errorMessage,
      status: errorStatus,
      isRateLimit,
      isAuthError,
      error: error,
    })
    
    // If it's an auth error, throw to surface the issue
    if (isAuthError) {
      throw new Error(`GitHub authentication failed: ${errorMessage}. Please check your token permissions.`)
    }
    
    // Return empty data with warning
    const emptyData = {
      commitsByHour: {},
      commitsByDay: {},
      languages: {},
      commitStats: {
        averageChangesPerCommit: 0,
        totalFilesChanged: 0,
        largestCommit: 0,
      },
      analyzedCommits: 0,
    }

    if (isRateLimit) {
      return {
        data: emptyData,
        warning: {
          type: 'rate_limit' as const,
          message: 'API rate limit reached. Data unavailable.',
        },
      }
    }

    return {
      data: emptyData,
      warning: {
        type: 'api_error' as const,
        message: 'Unable to fetch commit data. Please try again later.',
      },
    }
  }
}
