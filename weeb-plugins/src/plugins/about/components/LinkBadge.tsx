import React from "react"
import type { IconType } from "react-icons"
import {
  FaDev,
  FaDiscord,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaMastodon,
  FaMedium,
  FaTwitch,
  FaYoutube,
} from "react-icons/fa"
import { FaBluesky, FaXTwitter } from "react-icons/fa6"
import { LuGlobe, LuMail, LuRss } from "react-icons/lu"
import { SiKofi } from "react-icons/si"
import { BADGE, type Style } from "../layout"
import type { AboutLink, LinkIcon } from "../types"

/** Line icons for the generic ones, filled marks for the brands, as on the badges they replace. */
const ICONS: Record<LinkIcon, IconType> = {
  website: LuGlobe,
  email: LuMail,
  github: FaGithub,
  linkedin: FaLinkedin,
  x: FaXTwitter,
  bluesky: FaBluesky,
  mastodon: FaMastodon,
  youtube: FaYoutube,
  twitch: FaTwitch,
  discord: FaDiscord,
  instagram: FaInstagram,
  devto: FaDev,
  medium: FaMedium,
  kofi: SiKofi,
  rss: LuRss,
}

/**
 * Brand colors, for "Brand colors" on. They are the sites' own, not the card's, like
 * the language colors of the GitHub plugin. A site whose mark is black or white
 * (GitHub, X, DEV, Medium) takes the text color, which suits either background; a
 * website or an email takes the theme's accent.
 */
const BRAND_COLORS: Partial<Record<LinkIcon, string>> = {
  linkedin: "#0a66c2",
  youtube: "#ff0000",
  twitch: "#9146ff",
  discord: "#5865f2",
  instagram: "#e4405f",
  bluesky: "#1185fe",
  mastodon: "#6364ff",
  kofi: "#ff5e5b",
  rss: "#f26522",
}
const MONOCHROME: ReadonlySet<LinkIcon> = new Set(["github", "x", "devto", "medium"])

function iconColor(icon: LinkIcon, style: Style, brandColors: boolean): string {
  const accent = style === "terminal" ? "var(--terminal-color-highlight)" : "var(--default-color-highlight)"
  const text = style === "terminal" ? "var(--terminal-color-default)" : "var(--default-color-default)"
  if (!brandColors) return accent
  if (MONOCHROME.has(icon)) return text
  return BRAND_COLORS[icon] ?? accent
}

interface LinkBadgeProps {
  link: AboutLink
  style: Style
  /** From badgeWidth: fixed, so a row packs as calculateHeight counts and a tile is filled. */
  width: number
  brandColors: boolean
}

/**
 * One link as a button: icon and text centered in a fixed-size pill. The same element
 * is a badge in the card and the whole of a tile.
 *
 * `_top`, as every link in a card (utils/external-link.tsx): it navigates when the
 * image is opened on its own and stays inert in the wizard's sandboxed preview.
 */
export function LinkBadge({ link, style, width, brandColors }: LinkBadgeProps): React.ReactElement {
  const terminal = style === "terminal"
  const Icon = ICONS[link.icon]
  return (
    <a
      href={link.href}
      target="_top"
      rel="noopener noreferrer"
      title={link.label}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: `${BADGE.iconGap}px`,
        width: `${width}px`,
        height: `${BADGE.height}px`,
        flexShrink: 0,
        boxSizing: "border-box",
        padding: "0 10px",
        borderRadius: `${BADGE.radius}px`,
        border: terminal
          ? "1px solid color-mix(in srgb, var(--terminal-color-muted) 35%, transparent)"
          : "1px solid color-mix(in srgb, var(--default-color-highlight) 35%, transparent)",
        backgroundColor: terminal
          ? "var(--terminal-color-surface)"
          : "color-mix(in srgb, var(--default-color-highlight) 8%, transparent)",
        color: terminal ? "var(--terminal-color-default)" : "var(--default-color-default)",
        // The style's own embedded font (Poppins, JetBrains Mono), whatever global font
        // the card picked: badgeWidth sizes the badge from that font's widths, and with a
        // system or serif font a wide label overflowed into an ellipsis.
        fontFamily: "var(--font-family)",
        fontSize: `${BADGE.font}px`,
        // The terminal style embeds JetBrains Mono at 400 and 600 only: 500 fell to 400,
        // thinner than the README buttons it replaces.
        fontWeight: terminal ? 600 : 500,
        lineHeight: `${BADGE.height - 2}px`,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textDecoration: "none",
      }}
    >
      <Icon size={BADGE.icon} style={{ flexShrink: 0, color: iconColor(link.icon, style, brandColors) }} aria-hidden />
      <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{link.label}</span>
    </a>
  )
}
