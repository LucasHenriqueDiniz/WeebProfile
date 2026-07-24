export type BannerVariant = "large" | "compact" | "minimal"

export interface GithubRepoConfig {
  enabled: boolean
  sections: string[]
  owner: string
  repo: string
  // Banner
  banner_variant?: BannerVariant
  banner_show_description?: boolean
  // Stats (star/fork counters)
  stats_hide_title?: boolean
  stats_title?: string
  // Star growth graph
  star_graph_hide_title?: boolean
  star_graph_title?: string
  // Language/tech breakdown
  languages_hide_title?: boolean
  languages_title?: string
  max_languages?: number
  // Topics
  topics_hide_title?: boolean
  topics_title?: string
  max_topics?: number
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
