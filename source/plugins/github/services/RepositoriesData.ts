import axios from "axios"
import { RepositoriesData, RepositoriesResponse } from "../types"
import isNodeEnvironment from "plugins/@utils/isNodeEnv"

async function Repositories({
  token,
  login,
  type = "repositories",
  repositories = 100,
  _forks = false,
  cursor = null,
}: {
  token: string
  login: string
  type: string
  repositories: number
  _forks?: boolean
  cursor: string | null
}): Promise<RepositoriesResponse> {
  const account = type === "repositories" ? "user" : "organization"
  const after = cursor ? `after: "${cursor}", ` : ""
  const forks = _forks ? "" : ", isFork: false"

  const RepositoriesQuery = `
query BaseRepositories {
  ${account}(login: "${login}") {
    ${type}(${after} first: ${repositories} ${forks}, orderBy: {field: UPDATED_AT, direction: DESC}) {
      edges {
        cursor
      }
      nodes {
        updatedAt
        name
        owner {
          login
        }
        isFork
        forkCount
        watchers {
          totalCount
        }
        stargazers {
          totalCount
        }
        releases {
          totalCount
        }
        deployments {
          totalCount
        }
        environments {
          totalCount
        }
        languages(first: 8) {
          edges {
            size
            node {
              color
              name
            }
          }
        }
        licenseInfo {
          name
          spdxId
        }
        issues_open: issues(states: OPEN) {
          totalCount
        }
        issues_closed: issues(states: CLOSED) {
          totalCount
        }
        pr_open: pullRequests(states: OPEN) {
          totalCount
        }
        pr_closed: pullRequests(states: CLOSED) {
          totalCount
        }
        pr_merged: pullRequests(states: MERGED) {
          totalCount
        }
      }
    }
  }
}
`

  const isNodeEnv = isNodeEnvironment()
  // @TODO Fix CORS issue, this is a temporary solution
  let url = "https://api.github.com/graphql"
  if (!isNodeEnv) {
    url = "https://cors-anywhere.herokuapp.com/https://api.github.com/graphql"
  }

  try {
    const response = await axios.post(
      url,
      { query: RepositoriesQuery },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return response.data.data
  } catch (error) {
    console.error(error)
    throw new Error("Error fetching repositories data")
  }
}

async function fetchAllRepositoriesData(login: string, token: string): Promise<RepositoriesData> {
  let hasNextPage = true
  let afterCursor: string | null = null
  const allRepositories = []

  while (hasNextPage) {
    const result = await Repositories({
      token,
      login: login,
      type: "repositories",
      repositories: 100,
      cursor: afterCursor,
    })
    allRepositories.push(...result.user.repositories.nodes) // Ou result.user.repositoriesContributedTo.nodes
    if (result.user.repositories.edges.length > 0) {
      const lastEdge = result.user.repositories.edges.length
      const lastCursor = result.user.repositories.edges?.[lastEdge - 1]?.cursor
      afterCursor = lastCursor ?? null
    } else {
      hasNextPage = false
    }
  }

  let totalForks = 0
  let totalWatchers = 0
  let totalStars = 0
  let totalReleases = 0
  let totalDeployments = 0
  let totalEnvironments = 0
  const totalLanguages: { name: string; size: number; color: string }[] = []
  let favoriteLicense: { name: string; count: number } = { name: "", count: 0 }
  let totalIssuesOpen = 0
  let totalIssuesClosed = 0
  let totalPRsOpen = 0
  let totalPRsClosed = 0
  let totalPRsMerged = 0

  const parsedLicenses: string[] = []

  allRepositories.forEach((repo) => {
    totalForks += repo.forkCount
    totalWatchers += repo.watchers.totalCount
    totalStars += repo.stargazers.totalCount
    totalReleases += repo.releases.totalCount
    totalDeployments += repo.deployments.totalCount
    totalEnvironments += repo.environments.totalCount
    if (repo.licenseInfo?.name) {
      parsedLicenses.push(repo.licenseInfo.name)
    }
    totalIssuesOpen += repo.issues_open.totalCount
    totalIssuesClosed += repo.issues_closed.totalCount
    totalPRsOpen += repo.pr_open.totalCount
    totalPRsClosed += repo.pr_closed.totalCount
    totalPRsMerged += repo.pr_merged.totalCount

    repo.languages.edges.forEach((lang) => {
      const existingLanguage = totalLanguages.find((l) => l.name === lang.node.name)
      if (existingLanguage) {
        existingLanguage.size += lang.size
      } else {
        totalLanguages.push({
          name: lang.node.name,
          color: lang.node.color,
          size: lang.size,
        })
      }
    })
  })

  // Get the most common license
  const mostCommonLicense = (arr: string[]) =>
    arr.reduce((a, b, i, arr) => (arr.filter((v) => v === a).length >= arr.filter((v) => v === b).length ? a : b))

  favoriteLicense = {
    name: mostCommonLicense(parsedLicenses),
    count: parsedLicenses.filter((license) => license === mostCommonLicense(parsedLicenses)).length,
  }

  const repositoriesData: RepositoriesData = {
    totalForks,
    totalStars,
    totalReleases,
    totalWatchers,
    totalDeployments,
    totalEnvironments,
    totalLanguages,
    favoriteLicense,
    totalIssuesOpen,
    totalIssuesClosed,
    totalPRsOpen,
    totalPRsClosed,
    totalPRsMerged,
    repositories: allRepositories,
  }

  return repositoriesData
}

export async function getSpecificRepository(login: string, token: string, repository: string) {
  const query = `
  query {
    user(login: "${login}") {
      repository(name: "${repository}") {
        name
        defaultBranchRef {
          target {
            ... on Commit {
              history(first: 100) {
                totalCount
                edges {
                  node {
                    committedDate
                    message
                    author {
                      user {
                        login
                      }
                    }
                    additions
                    deletions
                    changedFiles
                  }
                }

              }
            }
          }
        }
      }
    }
  }
  `
  const url = "https://api.github.com/graphql"
  const response = await axios.post(
    url,
    { query },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  console.log(response)

  return response
}

export default fetchAllRepositoriesData
