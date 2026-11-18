/**
 * Links as typed in the wizard, turned into badges: a safe href, a label and an icon.
 */

import { isEmailAddress, safeHref, safeLinkHref, withDefaultScheme } from "../../../utils/external-link"
import { MAX_LINKS } from "../plugin.metadata"
import { LINK_ICONS, type AboutLink, type LinkConfigItem, type LinkIcon } from "../types"

/** Longest label drawn. Longer ones are cut here; the badge also ends in an ellipsis. */
const MAX_LABEL_LENGTH = 40

/** Sites recognised by their host. The first match wins. */
const HOST_ICONS: Array<[RegExp, LinkIcon]> = [
  [/(^|\.)linkedin\.com$/, "linkedin"],
  [/(^|\.)github\.com$/, "github"],
  [/(^|\.)(x|twitter)\.com$/, "x"],
  [/(^|\.)bsky\.app$/, "bluesky"],
  [/(^|\.)(youtube\.com|youtu\.be)$/, "youtube"],
  [/(^|\.)twitch\.tv$/, "twitch"],
  [/(^|\.)(discord\.gg|discord\.com)$/, "discord"],
  [/(^|\.)instagram\.com$/, "instagram"],
  [/(^|\.)dev\.to$/, "devto"],
  [/(^|\.)medium\.com$/, "medium"],
  [/(^|\.)ko-fi\.com$/, "kofi"],
  [/(^|\.)(mastodon\.[a-z.]+|mstdn\.[a-z.]+|fosstodon\.org|hachyderm\.io)$/, "mastodon"],
]

/** What a badge says when the user left its text empty. */
const ICON_LABELS: Record<Exclude<LinkIcon, "website">, string> = {
  email: "Email",
  github: "GitHub",
  linkedin: "LinkedIn",
  x: "X",
  bluesky: "Bluesky",
  mastodon: "Mastodon",
  youtube: "YouTube",
  twitch: "Twitch",
  discord: "Discord",
  instagram: "Instagram",
  devto: "DEV",
  medium: "Medium",
  kofi: "Ko-fi",
  rss: "RSS",
}

/**
 * The href of a typed address: an email (with or without `mailto:`) or a site, with
 * https:// added when it was typed bare ("example.com"), as the websites plugin does.
 */
export function linkHref(raw: string): string | null {
  const trimmed = raw.trim()
  if (trimmed === "") return null
  if (/^mailto:/i.test(trimmed)) return safeLinkHref(trimmed)
  if (isEmailAddress(trimmed)) return `mailto:${trimmed}`
  return safeHref(withDefaultScheme(trimmed))
}

function isLinkIcon(value: unknown): value is LinkIcon {
  return typeof value === "string" && (LINK_ICONS as readonly string[]).includes(value)
}

/** The icon an href gets on "auto": the site's own, email, a feed, or a globe. */
export function iconForHref(href: string): LinkIcon {
  if (href.startsWith("mailto:")) return "email"
  const url = new URL(href)
  const host = url.hostname.toLowerCase()
  for (const [pattern, icon] of HOST_ICONS) {
    if (pattern.test(host)) return icon
  }
  if (/(^|\/)(rss|feed|atom)(\.xml)?\/?$|\.(rss|atom)$/i.test(url.pathname)) return "rss"
  return "website"
}

function defaultLabel(href: string, icon: LinkIcon): string {
  if (icon === "website") return new URL(href).hostname.replace(/^www\./, "")
  return ICON_LABELS[icon]
}

function cleanLabel(raw: unknown): string {
  if (typeof raw !== "string") return ""
  const label = raw.replace(/\s+/g, " ").trim()
  return [...label].length > MAX_LABEL_LENGTH ? `${[...label].slice(0, MAX_LABEL_LENGTH - 1).join("")}…` : label
}

export function resolveLink(item: LinkConfigItem | null | undefined): AboutLink | null {
  if (!item || typeof item !== "object" || typeof item.url !== "string") return null
  const href = linkHref(item.url)
  if (!href) return null
  // An email always draws the email icon: a LinkedIn logo on a mailto: would lie.
  const icon = href.startsWith("mailto:") ? "email" : isLinkIcon(item.icon) ? item.icon : iconForHref(href)
  return { href, label: cleanLabel(item.label) || defaultLabel(href, icon), icon }
}

/** The links to draw, in the user's order. One that cannot be linked is left out. */
export function resolveLinks(raw: unknown): AboutLink[] {
  if (!Array.isArray(raw)) return []
  return raw
    .flatMap((item) => {
      const link = resolveLink(item as LinkConfigItem)
      return link ? [link] : []
    })
    .slice(0, MAX_LINKS)
}
