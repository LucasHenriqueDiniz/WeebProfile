/**
 * Tipos do plugin Dev.to
 *
 * A API REST é pública (https://dev.to/api) e não pede autenticação para dados de
 * perfil e artigos — só o username. Por isso o plugin não tem essentialConfigKeys.
 */

export interface DevToConfig {
  enabled: boolean
  sections: string[]
  username: string
  style?: "default" | "terminal"
  size?: "half" | "full"
  nonEssential?: Record<string, unknown>

  profile_title?: string
  profile_hide_title?: string | boolean

  recent_articles_title?: string
  recent_articles_hide_title?: string | boolean
  recent_articles_max?: number

  top_tags_title?: string
  top_tags_hide_title?: string | boolean
  top_tags_max?: number
}

export interface DevToProfile {
  username: string
  name: string
  summary: string | null
  location: string | null
  joinedAt: string | null
  /** Data URI já embutido, ou null quando a conversão falha. Nunca a URL original. */
  avatar: string | null
}

export interface DevToArticle {
  id: number
  title: string
  url: string
  reactions: number
  comments: number
  readingTimeMinutes: number
  publishedAt: string | null
  readablePublishDate: string | null
  tags: string[]
}

export interface DevToTag {
  name: string
  count: number
}

export interface DevToData {
  profile: DevToProfile
  /**
   * A janela mais recente de artigos, não o histórico inteiro.
   *
   * A API pagina em no máximo 1000 por requisição e não expõe contagem total —
   * uma conta ativa passa de 1900 artigos —, então totais honestos exigiriam
   * dezenas de chamadas. Tudo que é derivado daqui (tags, contagens) descreve
   * esta janela, e os rótulos dizem isso.
   */
  recentArticles: DevToArticle[]
  topTags: DevToTag[]
  /** Preenchido quando a busca falha; RenderDevTo troca o card por PluginError. */
  _error?: string
}
