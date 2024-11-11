interface UserResponse {
  databaseId: number
  name: string
  login: string
  location: string
  createdAt: string
  avatarUrl: string
  packages: { totalCount: number }
  starredRepositories: { totalCount: number }
  watching: { totalCount: number }
  sponsorshipsAsSponsor: { totalCount: number }
  sponsorshipsAsMaintainer: { totalCount: number }
  followers: { totalCount: number }
  following: { totalCount: number }
  issueComments: { totalCount: number }
  organizations: { totalCount: number }
  repositoriesContributedTo: { totalCount: number }
  repositories: {
    totalCount: number
    totalDiskUsage: number
  }
  gists: { totalCount: number }
  contributionsCollection: {
    totalRepositoriesWithContributedCommits: number
    totalCommitContributions: number
    restrictedContributionsCount: number
    totalIssueContributions: number
    totalPullRequestContributions: number
    totalPullRequestReviewContributions: number
  }
  calendar: {
    contributionCalendar: {
      weeks: {
        contributionDays: {
          color: string
        }[]
      }[]
    }
  }
}

export type { UserResponse }
