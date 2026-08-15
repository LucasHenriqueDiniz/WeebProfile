// Redesign 2026-07: cada seção é um card autocontido dirigido pelo tema
// (--default-color-*). Variantes antigas viraram aliases pros layouts novos mais
// próximos - configs salvas continuam válidas, só rendem o visual novo.
export type BannerVariant =
  // variantes atuais
  | "hero" // accent bar + nome grande + descrição + meta row (default)
  | "minimal" // linha única: marca/avatar + nome + descrição + stars
  | "split" // conteúdo à esquerda, painel de stars com delta à direita
  | "display" // tipografia gigante + letra fantasma de fundo
  | "centered" // nome centralizado com glow radial suave - simétrico, estilo capa
  | "centered_dark" // centralizado escuro: grid técnico + glow do highlight
  | "centered_gradient" // centralizado sobre gradiente cheio do highlight, chips brancos
  | "dark" // card escuro fixo com barra highlight lateral
  // aliases legados → layout novo equivalente
  | "large" // → hero
  | "social" // → hero
  | "clean" // → minimal
  | "compact" // → minimal
  | "editorial" // → display
  | "bold" // → display
  | "aurora" // → dark
  | "mono" // → dark
  | "blueprint" // → dark
  | "ribbon" // → dark

export type ResolvedBannerVariant =
  | "hero"
  | "minimal"
  | "split"
  | "display"
  | "centered"
  | "centered_dark"
  | "centered_gradient"
  | "dark"

// Normaliza os aliases legados - usar SEMPRE isto antes de decidir layout/altura,
// pra render e calculateHeight nunca divergirem.
export function resolveBannerVariant(variant?: BannerVariant): ResolvedBannerVariant {
  switch (variant) {
    case "minimal":
    case "clean":
    case "compact":
      return "minimal"
    case "split":
      return "split"
    case "centered":
      return "centered"
    case "centered_dark":
      return "centered_dark"
    case "centered_gradient":
      return "centered_gradient"
    case "display":
    case "editorial":
    case "bold":
      return "display"
    case "dark":
    case "aurora":
    case "mono":
    case "blueprint":
    case "ribbon":
      return "dark"
    default:
      return "hero"
  }
}

export type StarGraphVariant =
  | "area"
  | "bars"
  | "milestones"
  | "sparkline"
  | "steps"
  | "dots"
  // aliases legados
  | "line" // → dots
  | "gradient" // → sparkline

export type ResolvedStarGraphVariant = "area" | "bars" | "milestones" | "sparkline" | "steps" | "dots"

export function resolveStarGraphVariant(variant?: StarGraphVariant): ResolvedStarGraphVariant {
  if (variant === "line") return "dots"
  if (variant === "gradient") return "sparkline"
  return variant ?? "area"
}

export type StatsVariant = "grid" | "inline" | "sparkstats" | "featured"

export type LanguagesVariant =
  | "spectrum"
  | "bars"
  | "donut"
  | "blocks"
  // alias legado
  | "badges" // → spectrum

export type ResolvedLanguagesVariant = "spectrum" | "bars" | "donut" | "blocks"

export function resolveLanguagesVariant(variant?: LanguagesVariant): ResolvedLanguagesVariant {
  if (variant === "badges") return "spectrum"
  return variant ?? "spectrum"
}

export type TopicsVariant = "chips" | "cloud" | "hash"

// Escala real de conteúdo (fonte, ícones, altura do gráfico, padding - tudo junto),
// não só um espaço extra. Aplicada via transform:scale no componente inteiro da seção
// ativa (ver ScaledBox.tsx), e o mesmo fator entra em calculateHeight.
export type ContentSize = "sm" | "md" | "lg" | "xl"
export const CONTENT_SIZE_SCALE: Record<ContentSize, number> = { sm: 0.82, md: 1, lg: 1.3, xl: 1.6 }

export interface GithubRepoConfig {
  enabled: boolean
  // O repositório é um item único (Banner OU Stats OU Star Graph OU Technologies OU
  // Topics OU Overview), nunca uma pilha de seções como o Profile - "sections" aqui
  // sempre tem no máximo 1 entrada; o array só existe pra reaproveitar o mesmo formato
  // sections+sectionConfigs do wizard genérico.
  sections: string[]
  owner: string
  repo: string
  // Tamanho de conteúdo, compartilhado pelo item ativo (qualquer que ele seja).
  content_size?: ContentSize
  // Banner
  banner_variant?: BannerVariant
  banner_show_description?: boolean
  banner_show_languages?: boolean
  // Esconde o avatar/marca nas variantes que o exibem (hero, minimal, dark).
  banner_show_avatar?: boolean
  // Esconde o login do owner ("weebprofile /") antes do nome do repo.
  banner_show_owner?: boolean
  // URL de imagem custom (logo do projeto etc.) - substitui o avatar do owner no
  // banner. Em produção é convertida pra base64 no fetch (Gists não carregam URLs
  // externas dentro de SVG).
  banner_image?: string
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
