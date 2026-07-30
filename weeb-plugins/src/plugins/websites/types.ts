/**
 * Tipos do Plugin Websites
 */

import type { BasePluginConfig, NonEssentialPluginConfig } from "../shared/types/base"

/** Um item cru, como o usuário cadastrou no wizard (object-array). */
export interface WebsiteConfigItem {
  url: string
  title?: string
  description?: string
  image?: string
}

/** Um item já resolvido, com metadados e imagens embutidas. */
export interface WebsiteEntry {
  url: string
  domain: string
  title: string
  description: string | null
  /** Data URI da thumbnail (og:image / apple-touch-icon / favicon) ou null. */
  thumbnail: string | null
  /** Data URI do favicon, usado pela variante compacta. */
  favicon: string | null
}

export type WebsitesVariant = "grid" | "list" | "featured"

export interface WebsitesNonEssentialConfig extends NonEssentialPluginConfig {
  websites_items?: WebsiteConfigItem[]
  websites_variant?: WebsitesVariant
  websites_max?: number
  websites_autofill?: boolean
  websites_show_thumbnail?: boolean
  websites_show_description?: boolean
  websites_hide_title?: boolean
  websites_title?: string
}

export interface WebsitesConfig extends BasePluginConfig {
  nonEssential?: WebsitesNonEssentialConfig
  [key: string]: unknown // Index signature para compatibilidade com PluginConfig
}

export interface WebsitesData {
  websites: WebsiteEntry[]
}
