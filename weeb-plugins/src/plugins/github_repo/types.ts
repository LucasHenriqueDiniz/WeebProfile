// Ids seguem a galeria de referência (01 Minimal White = clean, 04 Aurora Glass =
// aurora, etc.) - ver PR/discussão de design. Primeira leva: implementadas todas,
// depois cortamos as que não performarem bem visualmente.
export type BannerVariant =
  | "large"
  | "compact"
  | "minimal"
  | "clean" // 01 Minimal White
  | "editorial" // 02 Editorial Accent
  | "mono" // 03 GitHub Terminal
  | "aurora" // 04 Aurora Glass
  | "bold" // 05 Bold Orange
  | "split" // 06 Split Technologies
  | "blueprint" // 07 Blueprint
  | "ribbon" // 08 Dark Ribbon
  | "social" // 18 Social/OG

export type StarGraphVariant = "line" | "area" | "milestones" | "bars" | "gradient"
export type StatsVariant = "inline" | "grid"
export type LanguagesVariant = "bars" | "spectrum"
export type TopicsVariant = "chips" | "cloud"

export interface GithubRepoConfig {
  enabled: boolean
  sections: string[]
  owner: string
  repo: string
  // Banner
  banner_variant?: BannerVariant
  banner_show_description?: boolean
  banner_show_languages?: boolean
  // Stats (star/fork counters)
  stats_hide_title?: boolean
  stats_title?: string
  stats_variant?: StatsVariant
  // Star growth graph
  star_graph_hide_title?: boolean
  star_graph_title?: string
  star_graph_variant?: StarGraphVariant
  // Language/tech breakdown
  languages_hide_title?: boolean
  languages_title?: string
  languages_variant?: LanguagesVariant
  max_languages?: number
  // Topics
  topics_hide_title?: boolean
  topics_title?: string
  topics_variant?: TopicsVariant
  max_topics?: number
  // Overview (compact multi-metric panel combining stats + star graph + languages)
  overview_max_languages?: number
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
  openIssuesCount: number
  watcherCount: number
  licenseInfo: {
    name: string
    spdxId: string | null
  } | null
  topics: string[]
  languages: RepoLanguage[]
  starHistory: StarHistoryPoint[]
}
