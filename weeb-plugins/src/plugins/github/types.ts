/**
 * Tipos do Plugin GitHub
 */

export interface ContributionDay {
  color: string
  contributionCount: number
  date: string
  weekday?: number
}

export interface ContributionWeek {
  contributionDays: ContributionDay[]
}

export interface GithubConfig {
  enabled: boolean
  sections: string[]
  username: string
  profile_hide_title?: boolean
  profile_title?: string
  profile_hide_avatar?: boolean
  favorite_languages_title?: string
  favorite_languages_hide_title?: boolean
  favorite_license_title?: string
  favorite_license_hide_title?: boolean
  favorite_languages_max_languages?: number
  favorite_languages_ignore_languages?: string
  repositories_title?: string
  repositories_hide_title?: boolean
  repositories_use_private?: boolean
  activity_title?: string
  activity_hide_title?: boolean
  calendar_title?: string
  calendar_hide_title?: boolean
  code_habits_title?: string
  code_habits_hide_title?: boolean
  code_habits_hide_languages?: boolean
  code_habits_hide_stats?: boolean
  code_habits_hide_weekdays?: boolean
  code_habits_hide_hours?: boolean
  code_habits_hide_footer?: boolean
  starred_repositories_title?: string
  starred_repositories_hide_title?: boolean
  starred_repositories_max?: number
  gists_title?: string
  gists_hide_title?: boolean
  gists_max?: number
  stargazers_title?: string
  stargazers_hide_title?: boolean
  top_repositories_title?: string
  top_repositories_hide_title?: boolean
  top_repositories_max?: number
  // Novas seções
  calendar_years?: string
  star_lists_hide_title?: boolean
  star_lists_title?: string
  star_lists_max?: number
  notable_contributions_hide_title?: boolean
  notable_contributions_title?: string
  notable_contributions_max?: number
  recent_activity_hide_title?: boolean
  recent_activity_title?: string
  recent_activity_max?: number
  introduction_hide_title?: boolean
  introduction_title?: string
  introduction_custom_text?: string
  featured_repositories_hide_title?: boolean
  featured_repositories_title?: string
  featured_repositories_urls?: string
  featured_repositories_max?: number
  sponsorships_hide_title?: boolean
  sponsorships_title?: string
  sponsorships_max?: number
  sponsors_hide_title?: boolean
  sponsors_title?: string
  sponsors_max?: number
  people_hide_title?: boolean
  people_title?: string
  people_type?: 'profile' | 'repository'
  people_repository?: string
  people_max?: number
  repository_contributors_hide_title?: boolean
  repository_contributors_title?: string
  repository_contributors_repository?: string
  repository_contributors_max?: number
}

export interface GithubData {
  user: {
    login: string
    name: string
    bio?: string
    avatarUrl: string
    location?: string
    company?: string
    websiteUrl?: string
    twitterUsername?: string
    createdAt: string
    followers: number
    following: number
    repositories: { totalCount: number }
    contributionCalendar: {
      totalContributions: number
      weeks: ContributionWeek[]
    }
    repositoriesContributedTo: number
    contributionsCollection?: {
      totalCommitContributions: number
      totalIssueContributions: number
      totalPullRequestContributions: number
      totalPullRequestReviewContributions: number
    }
  }
  activity: {
    totalCommitContributions: number
    totalRepositoriesWithContributedCommits: number
    totalPullRequestContributions: number
    totalPullRequestReviewContributions: number
    totalIssueContributions: number
    restrictedContributionsCount: number
    repositoriesContributedTo: number
    issueComments: number
    organizations: number
    following: number
    sponsorshipsAsSponsor: number
    starredRepositories: number
    watching: number
    pullRequests: number
    issues: number
    gists: number
  }
  calendar: {
    totalContributions: number
    weeks: ContributionWeek[]
    years?: Array<{
      year: number
      totalContributions: number
      weeks: ContributionWeek[]
    }>
  }
  languages: Array<{
    name: string
    size: number
    color: string
  }>
  repositories: {
    totalCount: number
    nodes: Array<{
      name: string
      description: string | null
      url: string
      stargazerCount: number
      forkCount: number
      watchers: {
        totalCount: number
      }
      packages: {
        totalCount: number
      }
      primaryLanguage: {
        name: string
        color: string
      } | null
      updatedAt: string
    }>
  }
  totalDiskUsage: number
  sponsoringCount: number
  favoriteLicense: {
    name: string
    count: number
    total: number
  }
  codeHabits: {
    commitsByHour: {
      [key: number]: number
    }
    commitsByDay: {
      [key: string]: number
    }
    languages: {
      [key: string]: {
        count: number
        color: string
      }
    }
    commitStats: {
      averageChangesPerCommit: number
      totalFilesChanged: number
      largestCommit: number
    }
    analyzedCommits: number
  }
  // Novas seções inspiradas no lowlighter/metrics
  starredRepositories?: {
    totalCount: number
    nodes: Array<{
      name: string
      nameWithOwner: string
      description: string | null
      url: string
      stargazerCount: number
      forkCount: number
      primaryLanguage: {
        name: string
        color: string
      } | null
      updatedAt: string
    }>
  }
  gists?: {
    totalCount: number
    nodes: Array<{
      name: string
      description: string | null
      url: string
      files: Array<{
        name: string
        language: string | null
      }>
      updatedAt: string
      stargazerCount: number
    }>
  }
  topRepositories?: Array<{
    name: string
    nameWithOwner: string
    description: string | null
    url: string
    stargazerCount: number
    forkCount: number
    primaryLanguage: {
      name: string
      color: string
    } | null
    updatedAt: string
  }>
  stargazers?: {
    totalCount: number
    repositories: Array<{
      name: string
      stargazerCount: number
    }>
  }
  // Novas seções
  introduction?: {
    bio?: string
    location?: string
    company?: string
    websiteUrl?: string
    twitterUsername?: string
  }
  recentActivity?: Array<{
    type: 'commit' | 'pr' | 'issue' | 'comment' | 'branch' | 'merged'
    title: string
    repository: string
    url: string
    date: string
    filesChanged?: {
      files: number
      additions: number
      deletions: number
    }
  }>
  starLists?: Array<{
    name: string
    description: string | null
    repositories: Array<{
      name: string
      nameWithOwner: string
      url: string
      stargazerCount: number
    }>
  }>
  notableContributions?: Array<{
    repository: string
    repositoryUrl: string
    contributions: number
    type: 'commits' | 'prs' | 'issues'
  }>
  featuredRepositories?: Array<{
    name: string
    nameWithOwner: string
    description: string | null
    url: string
    createdAt: string
    stargazerCount: number
    forkCount: number
    issuesCount?: number
    pullRequestsCount?: number
    primaryLanguage: {
      name: string
      color: string
    } | null
    license?: {
      name: string
      spdxId: string
    } | null
  }>
  sponsorships?: {
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
      tier: {
        name: string
        monthlyPriceInDollars: number
      } | null
    }>
  }
  people?: {
    type: 'profile' | 'repository'
    totalCount: number
    nodes: Array<{
      login: string
      name: string | null
      avatarUrl: string
      contributions?: number
    }>
  }
  repositoryContributors?: Array<{
    login: string
    name: string | null
    avatarUrl: string
    contributions: number
  }>
}
