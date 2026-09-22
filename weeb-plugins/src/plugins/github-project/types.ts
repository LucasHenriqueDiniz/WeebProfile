/**
 * Tipos do Plugin GitHub Project
 */

export interface GitHubRepository {
  name: string
  full_name: string
  description: string
  language: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  watchers_count: number
  license: {
    key: string
    name: string
    spdx_id: string
  } | null
  updated_at: string
  created_at: string
  homepage: string | null
  topics: string[]
  owner: {
    login: string
    avatar_url: string
  }
  default_branch: string
}

export interface GitHubStats {
  open_issues: number
  forks: number
  watchers: number
  stars: number
  pull_requests: number
  releases: number
  contributors: number
}

export interface GitHubLanguage {
  language: string
  bytes: number
  percentage: number
}

export interface GitHubContributor {
  login: string
  avatar_url: string
  html_url: string
  contributions: number
  type: string
}

export interface StarBucket {
  date: string // YYYY-MM-DD
  stars_new: number
  stars_total: number
}

export interface GitHubProjectConfig {
  [key: string]: any
  enabled: boolean
  sections: string[]
  repository: string // owner/repo (global)
  skin?: "glass" | "solid" | "outline"
  sections_config?: {
    banner?: {
      enabled: boolean
      style?: "hero" | "compact" | "minimal" | "centered"
      background?: "default" | "gradient" | "grid" | "spotlight" | "none"
      custom_avatar?: string
      hide_stars?: boolean
      hide_forks?: boolean
      hide_description?: boolean
      hide_watchers?: boolean
      show_contributors?: boolean
      contributors_limit?: number
      terminal_font?: string
      custom_name?: string
      custom_width?: number
      hide_ascii_box?: boolean
      hide_git_commands?: boolean
      hide_background?: boolean
      header_text?: string
      footer_text?: string
    }
    starHistory?: {
      enabled: boolean
      chart_type: "line" | "area" | "bar" | "step"
      show_grid: boolean
      show_dots: boolean
    }
  }
}

export interface GitHubProjectData {
  repository: GitHubRepository
  stats?: GitHubStats
  languages: GitHubLanguage[]
  contributors: GitHubContributor[]
  starHistory: StarBucket[]
  sections_config: GitHubProjectConfig["sections_config"]
  [key: string]: any
}
