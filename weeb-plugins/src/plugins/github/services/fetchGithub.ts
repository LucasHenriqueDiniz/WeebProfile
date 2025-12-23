/**
 * Serviço de fetch de dados do GitHub
 * 
 * Migrado do source original, adaptado para source-v2
 */

import { graphql } from '@octokit/graphql'
import { Octokit } from '@octokit/rest'
import { GraphqlResponseError } from '@octokit/graphql'
import type { GithubConfig, GithubData, ContributionWeek } from '../types.js'
import { SECTION_QUERIES, FOLLOWERS_QUERY, REPOSITORY_STARGAZERS_QUERY, REPOSITORY_CONTRIBUTORS_QUERY, FEATURED_REPOSITORIES_QUERY, RECENT_ACTIVITY_QUERY } from './queries.js'
import { getMockGithubData } from './mock-data.js'
import { urlToBase64 } from '../../../utils/image-to-base64.js'

// Mapeamento de seções para permissões necessárias
const SECTION_PERMISSIONS: Record<string, string[]> = {
  stargazers: ['read:user'],
  top_repositories: ['read:user'],
  star_lists: ['read:user'],
  sponsors: ['read:user'],
  sponsorships: ['read:user'],
  featured_repositories: ['read:user', 'public_repo'],
  repository_contributors: ['read:user', 'public_repo'],
  people: ['read:user', 'followers'],
}

// Função helper para detectar erros de permissão
function isPermissionError(error: any): boolean {
  if (error instanceof GraphqlResponseError) {
    return error.errors?.some((e: any) => 
      e.type === 'FORBIDDEN' || 
      e.message?.includes('permission') ||
      e.message?.includes('insufficient_scope') ||
      e.message?.includes('Resource not accessible')
    ) || false
  }
  
  const errorMessage = error?.message || error?.toString() || ''
  return (
    errorMessage.includes('FORBIDDEN') ||
    errorMessage.includes('permission') ||
    errorMessage.includes('insufficient_scope') ||
    errorMessage.includes('Resource not accessible') ||
    errorMessage.includes('Bad credentials')
  )
}

// Função helper para obter mensagem de erro de permissão
function getPermissionErrorMessage(section: string): string {
  const permissions = SECTION_PERMISSIONS[section] || []
  const permissionList = permissions.length > 0 
    ? permissions.join(', ')
    : 'permissões específicas'
  
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
    throw new Error(
      'GitHub Classic Token is required. ' +
      'Please configure it in your profile settings.'
    )
  }
  
  const githubToken = pat

  if (!username) {
    throw new Error('GitHub username is required')
  }

  const data: Partial<GithubData> = {}

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
        if (section === 'code_habits') {
          data.codeHabits = await processCodeHabitsData(rest, username)
          continue
        }

        // Gists pode usar REST API como fallback
        if (section === 'gists') {
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
        if (section === 'people') {
          try {
            await processPeopleData(graphqlClient, config, data)
          } catch (error: any) {
            console.warn(`Error fetching people:`, error.message)
            data.people = { type: config.people_type || 'profile', totalCount: 0, nodes: [] }
          }
          continue
        }

        // Repository Contributors precisa de repositório específico
        if (section === 'repository_contributors') {
          try {
            await processRepositoryContributorsData(graphqlClient, rest, config, data)
          } catch (error: any) {
            console.warn(`Error fetching repository contributors:`, error.message)
            data.repositoryContributors = []
          }
          continue
        }

        // Featured Repositories precisa de URLs dos repositórios
        if (section === 'featured_repositories') {
          try {
            await processFeaturedRepositoriesData(graphqlClient, config, data)
          } catch (error: any) {
            console.warn(`Error fetching featured repositories:`, error.message)
            data.featuredRepositories = []
          }
          continue
        }

        // Star Lists - por enquanto retornar vazio (precisa de API específica)
        if (section === 'star_lists') {
          data.starLists = []
          continue
        }

        // Notable Contributions - processar de commitContributionsByRepository
        if (section === 'notable_contributions') {
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
        if (section === 'repositories' || section === 'favorite_license') {
          // Se não especificado, buscar apenas públicos (ou todos se o token tiver permissão)
          variables.privacy = config.repositories_use_private ? undefined : 'PUBLIC'
        }
        
        const result = await graphqlClient<GraphQLResponse>(query, variables)

        // Process data based on section
        switch (section) {
          case 'profile':
            if (!result.user.name || !result.user.login || !result.user.avatarUrl || !result.user.createdAt) {
              throw new Error('Missing required user data')
            }
            // Convert avatarUrl to base64 to work in SVGs
            const avatarUrlBase64 = result.user.avatarUrl && 
              (result.user.avatarUrl.startsWith('http://') || result.user.avatarUrl.startsWith('https://'))
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
                totalContributions:
                  result.user.contributionsCollection?.contributionCalendar?.totalContributions || 0,
                weeks: result.user.contributionsCollection?.contributionCalendar?.weeks || [],
              },
              repositoriesContributedTo: result.user.repositoriesContributedTo?.totalCount || 0,
            }
            break

          case 'favorite_languages':
            data.languages = processLanguagesData(result)
            break

          case 'activity':
            data.activity = processActivityData(result)
            break

          case 'calendar':
            await processCalendarData(graphqlClient, username, config, data)
            break

          case 'repositories':
            data.repositories = processRepositoriesData(result)
            break

          case 'favorite_license':
            data.favoriteLicense = processFavoriteLicenseData(result)
            break

          case 'starred_repositories':
            data.starredRepositories = processStarredRepositoriesData(result)
            break

          case 'top_repositories':
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

          case 'introduction':
            data.introduction = {
              bio: result.user.bio || undefined,
              location: result.user.location || undefined,
              company: result.user.company || undefined,
              websiteUrl: result.user.websiteUrl || undefined,
              twitterUsername: result.user.twitterUsername || undefined,
            }
            break

          case 'recent_activity':
            // Processar atividades recentes
            const activities: GithubData['recentActivity'] = []
            const commitContributions = result.user.contributionsCollection?.commitContributionsByRepository || []
            commitContributions.forEach((contribution: any) => {
              if (contribution.contributions.totalCount > 0) {
                activities.push({
                  type: 'commit',
                  title: `${contribution.contributions.totalCount} commits`,
                  repository: contribution.repository.nameWithOwner,
                  url: contribution.repository.url,
                  date: new Date().toISOString(), // TODO: pegar data real
                })
              }
            })
            data.recentActivity = activities.slice(0, config.recent_activity_max || 10)
            break

          case 'sponsorships':
            const sponsorships = result.user.sponsorshipsAsSponsor
            data.sponsorships = {
              totalCount: sponsorships?.totalCount || 0,
              nodes: (sponsorships?.nodes || []).map((sponsorship: any) => ({
                sponsorable: {
                  login: sponsorship.sponsorable?.login || '',
                  name: sponsorship.sponsorable?.name || null,
                  avatarUrl: sponsorship.sponsorable?.avatarUrl || '',
                },
                tier: sponsorship.tier ? {
                  name: sponsorship.tier.name,
                  monthlyPriceInDollars: sponsorship.tier.monthlyPriceInDollars,
                } : null,
              })),
            }
            break

          case 'sponsors':
            const sponsors = result.user.sponsors
            data.sponsors = {
              totalCount: sponsors?.totalCount || 0,
              nodes: (sponsors?.nodes || []).map((sponsor: any) => ({
                login: sponsor.login || '',
                name: sponsor.name || null,
                avatarUrl: sponsor.avatarUrl || '',
                tier: null, // TODO: pegar tier do sponsor
              })),
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
            case 'starred_repositories':
              data.starredRepositories = { totalCount: 0, nodes: [] }
              break
            case 'gists':
              data.gists = { totalCount: 0, nodes: [] }
              break
            case 'top_repositories':
              data.topRepositories = []
              data.stargazers = { totalCount: 0, repositories: [] }
              break
            case 'introduction':
              data.introduction = undefined
              break
            case 'recent_activity':
              data.recentActivity = []
              break
            case 'sponsorships':
              data.sponsorships = { totalCount: 0, nodes: [] }
              break
            case 'sponsors':
              data.sponsors = { totalCount: 0, nodes: [] }
              break
            case 'star_lists':
              data.starLists = []
              break
            case 'notable_contributions':
              data.notableContributions = []
              break
            case 'featured_repositories':
              data.featuredRepositories = []
              break
            case 'people':
              data.people = { type: config.people_type || 'profile', totalCount: 0, nodes: [] }
              break
            case 'repository_contributors':
              data.repositoryContributors = []
              break
          }
        } else {
          // Para outros erros, re-throw apenas se for seção crítica
          if (section === 'profile') {
            throw sectionError
          }
        }
      }
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
function processLanguagesData(result: GraphQLResponse): GithubData['languages'] {
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
function processActivityData(result: GraphQLResponse): GithubData['activity'] {
  const { user } = result
  return {
    totalCommitContributions: user.contributionsCollection?.totalCommitContributions || 0,
    totalRepositoriesWithContributedCommits:
      user.contributionsCollection?.totalRepositoriesWithContributedCommits || 0,
    totalPullRequestContributions: user.contributionsCollection?.totalPullRequestContributions || 0,
    totalPullRequestReviewContributions:
      user.contributionsCollection?.totalPullRequestReviewContributions || 0,
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
function processRepositoriesData(result: GraphQLResponse): GithubData['repositories'] {
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
function processFavoriteLicenseData(result: GraphQLResponse): GithubData['favoriteLicense'] {
  const repositories = result.user.repositories?.nodes || []
  const total = repositories.length || 0
  const licenses = repositories.filter((repo: any) => repo.licenseInfo).map((repo: any) => repo.licenseInfo.name)

  const licenseCount = new Map<string, number>()
  licenses.forEach((license) => {
    licenseCount.set(license, (licenseCount.get(license) || 0) + 1)
  })

  let favoriteLicense = 'No License'
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
function processStarredRepositoriesData(result: GraphQLResponse): GithubData['starredRepositories'] {
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
      name: gist.name || 'Untitled',
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
async function processGistsDataRest(
  rest: Octokit,
  username: string,
  data: Partial<GithubData>
): Promise<void> {
  try {
    const response = await rest.gists.listForUser({
      username,
      per_page: 20,
    })

    data.gists = {
      totalCount: response.data.length,
      nodes: response.data.map((gist) => ({
        name: Object.keys(gist.files || {})[0] || 'Untitled',
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
    console.warn('Error fetching gists via REST API:', error)
    data.gists = { totalCount: 0, nodes: [] }
  }
}

/**
 * Processa dados de top repositórios
 */
function processTopRepositoriesData(result: GraphQLResponse): GithubData['topRepositories'] {
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
  const yearsConfig = config.calendar_years || 'current'
  
  // Determinar quais anos buscar
  let yearsToFetch: number[] = []
  if (yearsConfig === 'current') {
    yearsToFetch = [new Date().getFullYear()]
  } else {
    // Parse anos separados por vírgula (ex: "2023,2024")
    const years = yearsConfig.split(',').map(y => parseInt(y.trim())).filter(y => !isNaN(y) && y > 2000 && y <= new Date().getFullYear())
    yearsToFetch = years.length > 0 ? years : [new Date().getFullYear()]
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
        years: calendar ? [{
          year: currentYear,
          totalContributions: calendar.totalContributions || 0,
          weeks: calendar.weeks || [],
        }] : undefined,
      }
    } catch (error) {
      console.warn('Error fetching default calendar:', error)
      data.calendar = {
        totalContributions: 0,
        weeks: [],
      }
    }
  } else {
    data.calendar = {
      totalContributions,
      weeks: allWeeks,
      years: calendarYears.length > 1 ? calendarYears : undefined,
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
  const peopleType = config.people_type || 'profile'
  const max = config.people_max || 10

  if (peopleType === 'profile') {
    // Buscar followers
    const query = FOLLOWERS_QUERY
    const result = await graphqlClient<GraphQLResponse>(query, {
      login: config.username,
      max,
    })

    const followers = result.user.followers
    data.people = {
      type: 'profile',
      totalCount: followers?.totalCount || 0,
      nodes: (followers?.nodes || []).map((follower: any) => ({
        login: follower.login || '',
        name: follower.name || null,
        avatarUrl: follower.avatarUrl || '',
      })),
    }
  } else {
    // Buscar people do repositório (contributors, stargazers, watchers)
    const repo = config.people_repository
    if (!repo) {
      data.people = { type: 'repository', totalCount: 0, nodes: [] }
      return
    }

    const [owner, repoName] = repo.split('/')
    if (!owner || !repoName) {
      data.people = { type: 'repository', totalCount: 0, nodes: [] }
      return
    }

    // Por padrão, buscar stargazers
    const query = REPOSITORY_STARGAZERS_QUERY
    const result = await graphqlClient<any>(query, {
      owner,
      repo: repoName,
      max,
    })

    const stargazers = result.repository?.stargazers
    data.people = {
      type: 'repository',
      totalCount: stargazers?.totalCount || 0,
      nodes: (stargazers?.nodes || []).map((person: any) => ({
        login: person.login || '',
        name: person.name || null,
        avatarUrl: person.avatarUrl || '',
      })),
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

  const [owner, repoName] = repo.split('/')
  if (!owner || !repoName) {
    data.repositoryContributors = []
    return
  }

  try {
    // Usar REST API (mais confiável para contributors)
    const response = await rest.repos.listContributors({
      owner,
      repo: repoName,
      per_page: config.repository_contributors_max || 10,
    })

    data.repositoryContributors = response.data.map((contributor: any) => ({
      login: contributor.login,
      name: contributor.name || null,
      avatarUrl: contributor.avatar_url || '',
      contributions: contributor.contributions || 0,
    }))
  } catch (error: any) {
    // Fallback para GraphQL se REST API falhar
    try {
      const query = REPOSITORY_CONTRIBUTORS_QUERY
      const result = await graphqlClient<any>(query, {
        owner,
        repo: repoName,
      })

      const history = result.repository?.defaultBranchRef?.target?.history?.nodes || []
      const contributorsMap = new Map<string, { login: string; name: string | null; avatarUrl: string; contributions: number }>()

      history.forEach((commit: any) => {
        const user = commit.author?.user
        if (!user) return

        const login = user.login
        if (!login) return

        const current = contributorsMap.get(login) || {
          login,
          name: user.name || null,
          avatarUrl: user.avatarUrl || '',
          contributions: 0,
        }

        contributorsMap.set(login, {
          ...current,
          contributions: current.contributions + 1,
        })
      })

      data.repositoryContributors = Array.from(contributorsMap.values())
        .sort((a, b) => b.contributions - a.contributions)
        .slice(0, config.repository_contributors_max || 10)
    } catch (graphqlError) {
      console.warn('Error fetching repository contributors (both REST and GraphQL failed):', graphqlError)
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

  const repoList = urls.split(',').map((url) => url.trim()).filter(Boolean)
  const featuredRepos: GithubData['featuredRepositories'] = []

  // Processar cada URL (até 20 URLs são permitidas)
  // Se uma URL estiver quebrada/inválida, ela é ignorada e o processo continua
  for (const repoUrl of repoList.slice(0, 20)) {
    const [owner, repoName] = repoUrl.split('/')
    if (!owner || !repoName) {
      console.warn(`Invalid repository URL format: ${repoUrl}. Expected format: owner/repo`)
      continue
    }

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
          license: repo.licenseInfo ? {
            name: repo.licenseInfo.name,
            spdxId: repo.licenseInfo.spdxId,
          } : null,
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

  const contributions: GithubData['notableContributions'] = []
  const commitContributions = result.user.contributionsCollection?.commitContributionsByRepository || []

  commitContributions.forEach((contribution: any) => {
    if (contribution.contributions.totalCount > 0) {
      contributions.push({
        repository: contribution.repository.nameWithOwner,
        repositoryUrl: contribution.repository.url,
        contributions: contribution.contributions.totalCount,
        type: 'commits',
      })
    }
  })

  data.notableContributions = contributions
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, config.notable_contributions_max || 10)
}

/**
 * Processa dados de code habits (usa REST API)
 */
async function processCodeHabitsData(rest: Octokit, login: string, days = 90): Promise<GithubData['codeHabits']> {
  const commitsByDay: Record<string, number> = {}
  const commitsByHour: Record<number, number> = {}
  let totalCommits = 0
  const languages: Record<string, { count: number; color: string }> = {}
  const fileTypes: Record<string, number> = {}

  try {
    // Fetch user's public events
    const pages = Math.ceil(days / 100)
    const events = []

    for (let page = 1; page <= pages; page++) {
      const response = await rest.activity.listPublicEventsForUser({
        username: login,
        per_page: 100,
        page,
      })
      events.push(...response.data)
    }

    // Filter only user's PushEvents
    const commits = events
      .filter(({ type }) => type === 'PushEvent')
      .filter(({ actor }) => actor.login?.toLowerCase() === login.toLowerCase())
      .filter(({ created_at }) => created_at && new Date(created_at) > new Date(Date.now() - days * 24 * 60 * 60 * 1000))

    // Process commits
    for (const event of commits) {
      if (!event.created_at) continue
      const date = new Date(event.created_at)
      const day = date.toLocaleDateString('en-US', { weekday: 'long' })
      const hour = date.getHours()

      commitsByDay[day] = (commitsByDay[day] || 0) + 1
      commitsByHour[hour] = (commitsByHour[hour] || 0) + 1
      totalCommits++

      // TODO: Process commit details if needed
      // For now, just count commits
    }

    return {
      commitsByHour,
      commitsByDay,
      languages,
      commitStats: {
        averageChangesPerCommit: 0, // TODO: Calculate based on commits
        totalFilesChanged: 0, // TODO: Calculate based on commits
        largestCommit: 0, // TODO: Calculate based on commits
      },
      analyzedCommits: totalCommits,
    }
  } catch (error) {
    console.error('Error processing code habits:', error)
    return {
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
  }
}
