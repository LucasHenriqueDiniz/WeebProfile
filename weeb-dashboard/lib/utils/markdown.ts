/**
 * The snippet people paste into their GitHub README.
 *
 * The URL goes in as given, with no `?v=` cache-buster. The old one froze at copy time,
 * so it never changed again in the README, and GitHub's image proxy (camo) already
 * refetches: it passes on the route's `Cache-Control: max-age=60, s-maxage=60`, and on
 * 15/11/2026 a camo URL for /svg/<id>.svg went from HIT at age 50 to MISS at age 0
 * 64 seconds after the previous miss. A regenerated card shows up within about two
 * minutes (camo's 60s plus the browser's 60s) under the same URL.
 */

export interface EmbedImage {
  /** Alt text: what screen readers say, and what shows if the image fails to load. */
  alt: string
  url: string
}

export interface MarkdownOptions extends EmbedImage {
  size: "half" | "full"
}

/** Quotes and angle brackets would end the attribute or the tag early. */
function escapeAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

/**
 * A `]` would close the alt text of `![alt](url)` early, and `*`, `` ` `` or `<` would
 * turn into emphasis, code or HTML. CommonMark lets any ASCII punctuation be
 * backslash-escaped, so all of it is.
 */
function escapeMarkdownAlt(value: string): string {
  return value.replace(/[!-/:-@[-`{-~]/g, "\\$&")
}

function imgTag({ alt, url }: EmbedImage, width?: string): string {
  const widthAttribute = width ? ` width="${width}"` : ""
  return `<img align="top"${widthAttribute} alt="${escapeAttribute(alt)}" src="${escapeAttribute(url)}" />`
}

/**
 * The snippet for one SVG.
 *
 * - full (830px): a plain markdown image. GitHub caps images at `max-width: 100%`, so
 *   it fills the 846px README column and shrinks with it on narrower screens.
 * - half (415px): centred at its natural size. It has no `width`: alone, `width="50%"`
 *   only makes it smaller (154px instead of 308px on a 390px phone). Two halves side by
 *   side come from generateMarkdownForMultipleHalf, which does set it.
 */
export function generateMarkdown({ alt, url, size }: MarkdownOptions): string {
  if (size === "full") {
    return `![${escapeMarkdownAlt(alt)}](${url})`
  }
  return `<p align="center">${imgTag({ alt, url })}</p>`
}

/**
 * Several half SVGs in one paragraph, two per row.
 *
 * Each gets `width="50%"`: at a fixed 415px, two of them only fit the README column
 * at 1280px and wider, and wrap onto separate rows below that. The tags are glued
 * together, because any whitespace between them is a space character that pushes
 * 50% + space + 50% past the column width, and the second one wraps.
 *
 * With an odd count the last one is alone on its row, so it keeps its natural size,
 * like a lone half: at 50% it would be 154px on a 390px phone instead of 308px.
 */
export function generateMarkdownForMultipleHalf(images: EmbedImage[]): string {
  if (images.length === 0) return ""
  if (images.length === 1) return generateMarkdown({ ...images[0], size: "half" })
  const lastAlone = images.length % 2 === 1
  const tags = images.map((image, i) => imgTag(image, lastAlone && i === images.length - 1 ? undefined : "50%"))
  return `<p align="center">${tags.join("")}</p>`
}

/** One site of a tiles snippet: its image, where its link goes and what it is called. */
export interface TileLink {
  href: string
  title: string
  src: string
}

/** Three tiles fill the 846px README column at 279px each, close to their 270px. */
export const TILES_PER_ROW = 3

/**
 * The URL as an href, or null unless it is an absolute http(s) URL with no
 * credentials. Same rule as safeHref in weeb-plugins (utils/external-link.tsx), which
 * the generator already applied to these: they are checked again because this is
 * where they turn into a link on the user's profile.
 */
export function linkableUrl(raw: string): string | null {
  let url: URL
  try {
    url = new URL(raw.trim())
  } catch {
    return null
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null
  if (url.username || url.password) return null
  return url.href
}

/**
 * One image per site, each inside a link to the site, three per row.
 *
 * A card in a README is one <img>, and GitHub gives an image one click target: the
 * image itself. Its links only work once the image is opened on its own, so reaching
 * a site takes two clicks. Here each site is its own image, so it takes one.
 *
 * Glued together like generateMarkdownForMultipleHalf, for the same reason: whitespace
 * between the tags is a space character, and three 33% images plus two spaces wrap.
 * The hrefs are written now and stay in the README, so a site added, removed or moved
 * needs the snippet pasted again; the images update by themselves.
 */
export function generateTilesMarkdown(tiles: TileLink[]): string {
  const width = `${Math.floor(100 / TILES_PER_ROW)}%`
  const links = tiles.flatMap((tile) => {
    const href = linkableUrl(tile.href)
    if (!href) return []
    return [`<a href="${escapeAttribute(href)}">${imgTag({ alt: tile.title, url: tile.src }, width)}</a>`]
  })
  return links.length > 0 ? `<p align="center">${links.join("")}</p>` : ""
}
