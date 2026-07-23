export interface GithubRepoConfig {
  enabled: boolean
  sections: string[]
  owner: string
  repo: string
  repository_card_hide_title?: boolean
  repository_card_title?: string
  show_description?: boolean
  show_language?: boolean
  show_stats?: boolean
  show_license?: boolean
  show_topics?: boolean
  max_topics?: number
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
}
