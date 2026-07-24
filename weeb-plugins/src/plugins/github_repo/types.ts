export interface GithubRepoConfig {
  enabled: boolean
  sections: string[]
  owner: string
  repo: string
  // Banner section
  banner_show_description?: boolean
  // Insights section (stats + star graph + technologies)
  insights_hide_title?: boolean
  insights_title?: string
  insights_show_star_graph?: boolean
  insights_show_languages?: boolean
  insights_show_topics?: boolean
  max_topics?: number
  max_languages?: number
}

export interface StarHistoryPoint {
  date: string
  count: number
}

export interface RepoLanguage {
  name: string
  color: string
  percentage: number
}

export interface GithubRepoData {
  name: string
  nameWithOwner: string
  description: string | null
  url: string
  owner: {
    login: string
    avatarUrl: string | null
  }
  primaryLanguage: {
    name: string
    color: string
  } | null
  stargazerCount: number
  forkCount: number
  licenseInfo: {
    name: string
    spdxId: string | null
  } | null
  topics: string[]
  languages: RepoLanguage[]
  starHistory: StarHistoryPoint[]
}
