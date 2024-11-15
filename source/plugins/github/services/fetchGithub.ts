/* eslint-disable @typescript-eslint/no-explicit-any */
import { graphql } from "@octokit/graphql"
import { Octokit } from "@octokit/rest"
import logger from "source/helpers/logger"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import generateTestData from "../test/generateTestData"
import GithubConfig from "../types/GithubConfig"
import GithubData from "../types/GithubData"
import { ProcessedLanguage } from "../types/LanguagesData"
import { SECTION_QUERIES } from "../utils/getSectionQueries"
import { checkSectionScopes, getTokenScopes } from "./tokenScopes"
import { RepositoriesData } from "../types/RepositoryData"
import { CodeHabitsData } from "../types/CodeHabitsData"
import fetchRateLimit from "./rateLimit"

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
        weeks: any[]
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
    level: "info",
  })

  const data: Partial<GithubData> = {}

  const rateLimit = await fetchRateLimit(token)
  logger({
    message: `Rate limit: ${rateLimit.rate.remaining} / ${rateLimit.rate.limit}`,
    level: "info",
  })

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
        level: "info",
      })

      if (!checkSectionScopes(tokenScopes, section)) {
        logger({
          message: `Skipping ${section} due to missing required scopes [${JSON.stringify(tokenScopes)}], fix your token scopes at https://github.com/settings/tokens`,
          level: "error",
        })
        continue
      }

      if (section === "code_habits") {
        logger({
          message: "Processing code_habits section",
          level: "info",
        })
        data.codeHabits = await processCodeHabitsData(rest, username)
        continue
      }

      const query = SECTION_QUERIES[section as keyof typeof SECTION_QUERIES]
      if (!query) continue

      const result = await graphqlWithAuth<GraphQLResponse>(query, {
        login: username,
        includePrivate: section === "repositories" && tokenScopes.repo,
      })

      // Process result based on section
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
        case "languages":
          data.languages = processLanguagesData(result)
          break
        case "activity":
          data.activity = processActivityData(result)
          break
        case "calendar":
          data.calendar = result.user.contributionsCollection?.contributionCalendar
          break
        case "repositories":
          data.repositories = processRepositoriesData(result)
          break
        case "favorite_license":
          data.favoriteLicense = processFavoriteLicenseData(result)
          break
      }
    }

    logger({
      message: `Final data object: ${JSON.stringify(data, null, 2)}`,
      level: "debug",
    })
    return data as GithubData
  } catch (error) {
    logger({
      message: `Error fetching GitHub data: ${error instanceof Error ? error.message : "Unknown error"}`,
      level: "error",
    })
    throw error
  }
}

export default fetchGithubData

function processLanguagesData(result: GraphQLResponse): ProcessedLanguage[] {
  return (
    result.user.languages?.nodes.map((language: any) => ({
      name: language.name,
      color: language.color,
      size: language.size,
    })) || []
  )
}

async function processCodeHabitsData(rest: any, login: string, days = 90): Promise<CodeHabitsData> {
  logger({
    message: "Starting processCodeHabitsData",
    level: "info",
  })

  const commitsByDay: Record<string, number> = {}
  const commitsByHour: Record<number, number> = {}
  let totalCommits = 0

  // Get user recent activity
  const events = []
  const pages = Math.ceil(days / 100)

  let totalChanges = 0
  let totalFiles = 0
  let largestCommit = 0

  try {
    for (let page = 1; page <= pages; page++) {
      logger({
        message: `Fetching events page ${page}`,
        level: "info",
      })

      const response = await rest.activity.listPublicEventsForUser({
        username: login,
        per_page: 100,
        page,
      })

      logger({
        message: `Got ${response.data.length} events from page ${page}`,
        level: "info",
      })

      events.push(...response.data)
    }

    // Filter push events
    const commits = events
      .filter(({ type }) => type === "PushEvent")
      .filter(({ actor }) => actor.login?.toLowerCase() === login.toLowerCase())
      .filter(({ created_at }) => new Date(created_at) > new Date(Date.now() - days * 24 * 60 * 60 * 1000))

    // Process commits with their stats
    for (const event of commits) {
      const pushEvent = event.payload
      if (pushEvent.commits) {
        for (const commit of pushEvent.commits) {
          const additions = commit.stats?.additions || 0
          const deletions = commit.stats?.deletions || 0
          const totalChangesInCommit = additions + deletions

          totalChanges += totalChangesInCommit
          totalFiles += commit.files?.length || 0
          largestCommit = Math.max(largestCommit, totalChangesInCommit)
        }
      }
    }

    // Process commits
    commits.forEach((event) => {
      const date = new Date(event.created_at)
      const day = date.toLocaleDateString("en-US", { weekday: "long" })
      const hour = date.getHours()

      commitsByDay[day] = (commitsByDay[day] || 0) + 1
      commitsByHour[hour] = (commitsByHour[hour] || 0) + 1
      totalCommits++
    })

    const result = {
      commitsByDay,
      commitsByHour,
      totalCommits,
      analyzedCommits: commits.length,
      languages: {},
      fileTypes: {},
      commitStats: {
        averageChangesPerCommit: commits.length > 0 ? Math.round(totalChanges / commits.length) : 0,
        totalFilesChanged: totalFiles,
        largestCommit: largestCommit,
      },
      timeRange: {
        start: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString(),
      },
    }

    logger({
      message: `Processed code habits data: ${JSON.stringify(result)}`,
      level: "info",
    })

    return result
  } catch (error) {
    logger({
      message: `Error fetching events: ${error instanceof Error ? error.message : "Unknown error"}`,
      level: "error",
    })
    // Return empty data structure on error
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

function processFavoriteLicenseData(result: GraphQLResponse) {
  const licenses = result.user.repositories?.nodes
    .filter((repo: any) => repo.licenseInfo)
    .map((repo: any) => repo.licenseInfo.name)
  return {
    name: licenses?.[0] || "No License",
    count: licenses?.length || 0,
  }
}
