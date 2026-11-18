/**
 * Links inside a card.
 *
 * A card is seen two ways. In a README it is an <img>, where links are inert and a
 * click opens the image itself in a new tab. Opened that way, as a document, the
 * links navigate. Measured in Chromium (11/2026) with HTML <a> inside the
 * foreignObject and with SVG <a> outside it, both behaving the same:
 *
 * | where the card is                          | _top     | _self / none      | _blank  |
 * | ------------------------------------------ | -------- | ----------------- | ------- |
 * | /svg/<id>.svg (CSP `sandbox`)              | navigates| navigates         | blocked |
 * | camo (README click, no `sandbox`)          | navigates| navigates         | popup   |
 * | wizard preview, <iframe sandbox>           | blocked  | loads in the frame| blocked |
 *
 * `_blank` needs `allow-popups`, which the dashboard route's sandbox leaves out.
 * `_top` is the only target that works opened directly and stays inert in the
 * wizard preview instead of loading the site inside it.
 */

import React from "react"

const LINK_PROTOCOLS = new Set(["http:", "https:"])

/**
 * The URL as an href, or null when it is not an absolute http(s) URL.
 *
 * URLs come from users (the websites plugin) and from third-party APIs, so
 * `javascript:`, `data:` and the like are dropped here even though the route's
 * sandbox would not run them: the card is also shown elsewhere, and a link should
 * not depend on the page around it for safety. Credentials in the authority are
 * dropped too, since `https://github.com@evil.example` reads as GitHub.
 *
 * Returning URL.href also normalizes the string: whitespace and control characters
 * the parser strips cannot smuggle a scheme past this check.
 */
export function safeHref(raw: unknown): string | null {
  if (typeof raw !== "string") return null
  let url: URL
  try {
    url = new URL(raw.trim())
  } catch {
    return null
  }
  if (!LINK_PROTOCOLS.has(url.protocol)) return null
  if (url.username || url.password) return null
  return url.href
}

/**
 * One plain address: no spaces, quotes, angle brackets or the separators that would
 * turn `mailto:` into several recipients or smuggle headers past it.
 */
const EMAIL_ADDRESS = /^[^\s@<>"'(),;:\\?&#%]+@[^\s@<>"'(),;:\\?&#%/]+\.[^\s@<>"'(),;:\\?&#%/]+$/

export function isEmailAddress(raw: unknown): raw is string {
  return typeof raw === "string" && raw.length <= 254 && EMAIL_ADDRESS.test(raw)
}

/**
 * An href for a link the user typed to be clicked: an http(s) URL as safeHref takes
 * it, or `mailto:` with exactly one address and nothing after it. The About plugin's
 * link badges are the only links with an email; a README keeps `mailto:` hrefs.
 */
export function safeLinkHref(raw: unknown): string | null {
  const web = safeHref(raw)
  if (web) return web
  if (typeof raw !== "string") return null
  const match = /^mailto:(.*)$/i.exec(raw.trim())
  if (!match) return null
  return isEmailAddress(match[1]) ? `mailto:${match[1]}` : null
}

/**
 * Adds https:// to an address typed without a scheme ("example.com"), the way a
 * GitHub profile keeps its website. A scheme is only recognised with "://", so
 * "localhost:3000" or "example.com:8080/x" get https:// instead of being read as
 * the scheme "localhost:". `javascript:alert(1)` and `data:…` then become
 * unparseable hosts and `mailto:a@b` a URL with credentials, all of which safeHref
 * refuses; `javascript://…` keeps its scheme and is refused there too.
 */
export function withDefaultScheme(raw: string): string {
  const trimmed = raw.trim()
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed.replace(/^\/\//, "")}`
}

interface ExternalLinkProps {
  href: unknown
  className?: string
  style?: React.CSSProperties
  /** Tooltip, kept on the plain element too. */
  title?: string
  /** Element used when `href` is not linkable, so the layout stays the same. */
  fallback?: "div" | "span"
  children: React.ReactNode
}

/**
 * Wraps an item in a link to `href`, or in a plain element when the URL is not
 * safe to link. The link carries no style of its own: the card styles reset
 * `#svg-main a` to inherit color and drop the underline.
 */
export function ExternalLink({
  href,
  className,
  style,
  title,
  fallback = "div",
  children,
}: ExternalLinkProps): React.ReactElement {
  const safe = safeHref(href)
  if (!safe) {
    const Fallback = fallback
    return (
      <Fallback className={className} style={style} title={title}>
        {children}
      </Fallback>
    )
  }
  return (
    <a href={safe} target="_top" rel="noopener noreferrer" className={className} style={style} title={title}>
      {children}
    </a>
  )
}
