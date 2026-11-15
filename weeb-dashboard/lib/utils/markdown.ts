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

/** A `]` would close the alt text of `![alt](url)` early. */
function escapeMarkdownAlt(value: string): string {
  return value.replace(/[\\[\]]/g, "\\$&")
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
 */
export function generateMarkdownForMultipleHalf(images: EmbedImage[]): string {
  if (images.length === 0) return ""
  if (images.length === 1) return generateMarkdown({ ...images[0], size: "half" })
  return `<p align="center">${images.map((image) => imgTag(image, "50%")).join("")}</p>`
}
