/* eslint-disable @typescript-eslint/no-explicit-any */
import { graphql } from "@octokit/graphql"
import { Octokit } from "@octokit/rest"
import logger from "source/helpers/logger"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import generateTestData from "../test/generateTestData"
import { CodeHabitsData } from "../types/CodeHabitsData"
import GithubConfig from "../types/GithubConfig"
import GithubData from "../types/GithubData"
import { ProcessedLanguage } from "../types/LanguagesData"
import LicenseData from "../types/LicenseData"
import { RepositoriesData } from "../types/RepositoryData"
import { getLanguageFromExtension } from "../utils/fileExtensionToLanguage"
import { SECTION_QUERIES } from "../utils/getSectionQueries"
import fetchRateLimit from "./rateLimit"
import { checkSectionScopes, getTokenScopes } from "./tokenScopes"

interface GraphQLResponse {
  user: {
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
    }
    repositoriesContributedTo?: {
      totalCount: number
    }
    [key: string]: any
  }
}

async function fetchGithubData(plugin: GithubConfig, dev: boolean | undefined): Promise<GithubData> {
  const { username, sections } = plugin
  logger({
    message: `Sections to process: ${sections}`,
    level: "debug",
  })

  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const token = env.gh_token

  if (dev) return generateTestData()
  if (!token) throw new Error("GitHub token is required")
  if (!username) throw new Error("GitHub username is required")

  const tokenScopes = await getTokenScopes(token)
  logger({
    message: `Token scopes: ${JSON.stringify(tokenScopes)}`,
    level: "debug",
    __filename,
  })

  const data: Partial<GithubData> = {}

  const rateLimit = await fetchRateLimit(token)
  logger({
    message: `Rate limit: ${rateLimit.rate.remaining} / ${rateLimit.rate.limit}`,
    level: "debug",
    __filename,
  })

  if (rateLimit.rate.remaining < 1000) {
    // @ TODO: Add a way to handle this
    logger({
      message: `Rate limit is low: ${rateLimit.rate.remaining} / ${rateLimit.rate.limit}`,
      level: "warn",
      __filename,
    })
  }

  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${token}`,
    },
  })

  const rest = new Octokit({
    auth: token,
  })

  try {
    for (const section of sections) {
      logger({
        message: `Processing section: ${section}`,
        level: "debug",
        __filename,
      })

      if (!checkSectionScopes(tokenScopes, section)) {
        logger({
          message: `Skipping ${section} due to missing required scopes [${JSON.stringify(tokenScopes)}], fix your token scopes at https://github.com/settings/tokens`,
          level: "error",
          __filename,
        })
        continue
      }
      //  Because code habits dont use graphql, it comes before the graphql query
      if (section === "code_habits") {
        data.codeHabits = await processCodeHabitsData(rest, username)
        continue
      }

      const query = SECTION_QUERIES[section as keyof typeof SECTION_QUERIES]
      if (!query) continue

      const result = await graphqlWithAuth<GraphQLResponse>(query, {
        login: username,
        includePrivate: section === "repositories" && tokenScopes.repo,
      })

      switch (section) {
        case "profile":
          if (!result.user.name || !result.user.login || !result.user.avatarUrl || !result.user.createdAt) {
            throw new Error("Missing required user data")
          }
          data.user = {
            name: result.user.name,
            login: result.user.login,
            avatarUrl: result.user.avatarUrl,
            createdAt: result.user.createdAt,
            followers: result.user.followers?.totalCount || 0,
            following: result.user.following?.totalCount || 0,
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
        case "calendar": {
          logger({
            message: `Processing calendar data`,
            level: "debug",
            __filename,
          })

          // Extrair os dados diretamente do caminho correto
          const calendar = result.user.contributionsCollection?.contributionCalendar

          // Criar o objeto calendar exatamente como está no result.json
          data.calendar = {
            totalContributions: calendar?.totalContributions || 0,
            weeks: calendar?.weeks || [],
          }

          logger({
            message: `Successfully processed calendar data with ${data.calendar.totalContributions} contributions`,
            level: "debug",
            __filename,
          })
          break
        }
        case "repositories":
          data.repositories = processRepositoriesData(result)
          break
        case "favorite_license":
          data.favoriteLicense = processFavoriteLicenseData(result)
          break
      }
    }

    logger({
      message: `Final data object: ${JSON.stringify(data).slice(0, 500)}`,
      level: "debug",
      __filename,
    })
    return data as GithubData
  } catch (error) {
    logger({
      message: `Error fetching GitHub data: ${error instanceof Error ? error.message : "Unknown error"}`,
      level: "error",
      __filename,
    })
    throw error
  }
}

export default fetchGithubData

function processLanguagesData(result: GraphQLResponse): ProcessedLanguage[] {
  logger({
    message: "Processing languages data",
    level: "warn",
  })

  const languagesMap = new Map<string, { color: string; size: number }>()

  // Process all repositories
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

  // Convert map to array and sort by size
  const processedLanguages = Array.from(languagesMap.entries())
    .map(([name, data]) => ({
      name,
      color: data.color,
      size: data.size,
    }))
    .sort((a, b) => b.size - a.size)

  logger({
    message: `Processed languages result: ${processedLanguages.length}`,
    level: "debug",
  })

  return processedLanguages
}

async function processCodeHabitsData(rest: any, login: string, days = 90): Promise<CodeHabitsData> {
  const commitsByDay: Record<string, number> = {}
  const commitsByHour: Record<number, number> = {}
  let totalCommits = 0
  let totalChanges = 0
  let totalFilesChanged = 0
  let largestCommit = 0
  const languages: Record<string, { count: number; color: string }> = {}
  const fileTypes: Record<string, number> = {}

  // Get user recent activity
  const events = []
  const pages = Math.ceil(days / 100)

  try {
    for (let page = 1; page <= pages; page++) {
      logger({
        message: `Fetching events page ${page}`,
        level: "debug",
        __filename,
      })

      const response = await rest.activity.listPublicEventsForUser({
        username: login,
        per_page: 100,
        page,
      })

      logger({
        message: `Got ${response.data.length} events from page ${page}`,
        level: "info",
        __filename,
      })

      events.push(...response.data)
    }
  } catch (error) {
    logger({
      message: `Error fetching events: ${error instanceof Error ? error.message : "Unknown error"}`,
      level: "error",
      __filename,
    })
    return {
      commitsByDay: {},
      commitsByHour: {},
      totalCommits: 0,
      analyzedCommits: 0,
      languages: {},
      fileTypes: {},
      commitStats: {
        averageChangesPerCommit: 0,
        totalFilesChanged: 0,
        largestCommit: 0,
      },
      timeRange: {
        start: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString(),
      },
    }
  }

  // Filter push events
  const commits = events
    .filter(({ type }) => type === "PushEvent")
    .filter(({ actor }) => actor.login?.toLowerCase() === login.toLowerCase())
    .filter(({ created_at }) => new Date(created_at) > new Date(Date.now() - days * 24 * 60 * 60 * 1000))

  logger({
    message: `Filtered commits: ${commits.length}`,
    level: "info",
    __filename,
  })

  // Process commits with detailed stats
  for (const event of commits) {
    const date = new Date(event.created_at)
    const day = date.toLocaleDateString("en-US", { weekday: "long" })
    const hour = date.getHours()

    commitsByDay[day] = (commitsByDay[day] || 0) + 1
    commitsByHour[hour] = (commitsByHour[hour] || 0) + 1
    totalCommits++

    if (event.type === "PushEvent" && event.payload && event.payload.commits) {
      for (const commit of event.payload.commits) {
        try {
          // Get detailed commit information
          const [owner, repo] = event.repo.name.split("/")
          const commitResponse = await rest.repos.getCommit({
            owner,
            repo,
            ref: commit.sha,
          })

          const files = commitResponse.data.files || []
          totalFilesChanged += files.length

          // Process changes
          const changes = files.reduce((acc: number, file: any) => {
            const changes = (file.additions || 0) + (file.deletions || 0)
            acc += changes

            // Process language from file extension
            const { name: language, color } = getLanguageFromExtension(file.filename)
            if (!languages[language]) {
              languages[language] = { count: 0, color }
            }
            languages[language].count += changes

            // Process file types
            fileTypes[file.filename] = (fileTypes[file.filename] || 0) + 1

            return acc
          }, 0)

          totalChanges += changes
          largestCommit = Math.max(largestCommit, changes)
        } catch (error) {
          logger({
            message: `Error fetching commit details: ${error instanceof Error ? error.message : "Unknown error"}`,
            level: "warn",
            __filename,
          })
          continue
        }
      }
    }
  }

  const result = {
    commitsByDay,
    commitsByHour,
    totalCommits,
    analyzedCommits: commits.length,
    languages,
    fileTypes,
    commitStats: {
      averageChangesPerCommit: commits.length > 0 ? Math.round(totalChanges / commits.length) : 0,
      totalFilesChanged,
      largestCommit,
    },
    timeRange: {
      start: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date().toISOString(),
    },
  }

  logger({
    message: `Processed code habits data: ${JSON.stringify(result).slice(0, 500)}`,
    level: "debug",
    __filename,
  })

  return result
}

function processRepositoriesData(result: GraphQLResponse): RepositoriesData {
  const repositories =
    result.user.repositories?.nodes.map((repo: any) => ({
      ...repo,
      stargazerCount: repo.stargazers?.totalCount || 0,
      forkCount: repo.forkCount || 0,
      watchers: {
        totalCount: repo.watchers?.totalCount || 0,
      },
      packages: {
        totalCount: repo.packages?.totalCount || 0,
      },
      licenseInfo: repo.licenseInfo?.name || null,
      sponsors: {
        totalCount: repo.sponsors?.totalCount || 0,
      },
    })) || []
  const totalDiskUsage = result.user.repositories?.totalDiskUsage || 0
  const sponsoringCount = result.user.sponsorshipsAsSponsor?.totalCount || 0
  const licenses = result.user.repositories?.nodes
    .filter((repo: any) => repo.licenseInfo)
    .map((repo: any) => repo.licenseInfo.name)

  const favoriteLicense = {
    name: licenses?.[0] || "No License",
    count: licenses?.length || 0,
  }

  return {
    repositories,
    totalDiskUsage,
    favoriteLicense,
    sponsoringCount,
  }
}

function processActivityData(result: GraphQLResponse) {
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
    projects: user.projects?.totalCount || 0,
  }
}

function processFavoriteLicenseData(result: GraphQLResponse): LicenseData {
  logger({
    message: "Processing license data",
    level: "warn",
  })

  const repositories = result.user.repositories?.nodes || []
  const licenses = repositories.filter((repo: any) => repo.licenseInfo).map((repo: any) => repo.licenseInfo.name)
  const total = repositories.length || 0

  const licenseCount = new Map<string, number>()
  licenses.forEach((license) => {
    licenseCount.set(license, (licenseCount.get(license) || 0) + 1)
  })

  // Get the most used license
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
