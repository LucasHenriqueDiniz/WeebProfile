/**
 * Types of the About plugin: what the user types about themselves, drawn as a
 * neofetch-style intro and as link badges.
 */

import type { BasePluginConfig, NonEssentialPluginConfig } from "../shared/types/base"

/** One "Label: value" line of the intro, as typed in the wizard. */
export interface NeofetchField {
  label: string
  value: string
}

/** The icons a link badge can have. "auto" picks one from the link's address. */
export const LINK_ICONS = [
  "website",
  "email",
  "github",
  "linkedin",
  "x",
  "bluesky",
  "mastodon",
  "youtube",
  "twitch",
  "discord",
  "instagram",
  "devto",
  "medium",
  "kofi",
  "rss",
] as const

export type LinkIcon = (typeof LINK_ICONS)[number]

/** One link as typed in the wizard (object-array item). Only the URL is required. */
export interface LinkConfigItem {
  url?: string
  label?: string
  icon?: LinkIcon | "auto"
}

/** A link ready to draw: a safe href, a label and a resolved icon. */
export interface AboutLink {
  /** An http(s) URL or a mailto: address, already checked (safeLinkHref). */
  href: string
  label: string
  icon: LinkIcon
}

/** Where the intro's picture comes from. Unset is "custom": the image, if there is one. */
export type PictureSource = "custom" | "github" | "none"

export interface NeofetchContent {
  /** "user@host": the part before the @ and the part after it are drawn in the accent color. */
  title: string
  fields: NeofetchField[]
  /** A data URI (generation, or an upload), an https URL (wizard preview) or null for no picture. */
  image: string | null
}

export interface AboutNonEssentialConfig extends NonEssentialPluginConfig {
  neofetch_title?: string
  neofetch_fields?: NeofetchField[]
  neofetch_picture?: PictureSource
  /** A data URI from the wizard's upload, or an https URL. */
  neofetch_image?: string
  neofetch_github_user?: string
  neofetch_show_palette?: boolean
  neofetch_show_cursor?: boolean
  links_items?: LinkConfigItem[]
  links_brand_colors?: boolean
}

export interface AboutConfig extends BasePluginConfig {
  nonEssential?: AboutNonEssentialConfig
  [key: string]: unknown // Index signature para compatibilidade com PluginConfig
}

export interface AboutData {
  neofetch: NeofetchContent
  links: AboutLink[]
}
