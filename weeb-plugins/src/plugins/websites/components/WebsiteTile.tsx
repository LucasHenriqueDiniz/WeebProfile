import React from "react"
import { ExternalLink } from "../../../utils/external-link"
import { ImageComponent } from "../../../utils/image"
import type { WebsiteEntry } from "../types"

/**
 * One site drawn on its own, for a README that gives every site its own image and link
 * (see Plugin.tiles). The README lays them side by side at a percentage width, so every
 * tile must have the same size, whatever its title or description: text truncates to
 * one line, and a missing description still takes its line.
 *
 * The SVG is wider than the card by a transparent margin on every side, which becomes
 * the gap between tiles: in the README they sit glued together, since any whitespace
 * between the <a> tags would be a space character that breaks the row.
 *
 * The card's classes must exist in the style's CSS, and `border` alone draws nothing:
 * without preflight there is no border-style, so `border-solid` goes with it. Until
 * 11/2026 the default tile used bg-default-muted/5 and border-default-border/60, which
 * have no rule: no border, no background, and the text sat on the page's own color. The
 * muted tints are relative to the page, so the card stands out on GitHub light and dark.
 */

export const WEBSITE_TILE_WIDTH = 270
const MARGIN = 4
const BORDER = 1
const INNER_WIDTH = WEBSITE_TILE_WIDTH - 2 * MARGIN
// About 1.9:1, the shape of an Open Graph image (1200x630), so a thumbnail is not cropped.
const THUMB_HEIGHT = 138
const PADDING_Y = 6
const TITLE_LINE = 18
const SMALL_LINE = 14
const LINE_GAP = 2

export interface WebsiteTileOptions {
  showThumbnail: boolean
  showDescription: boolean
}

function textHeight({ showDescription }: WebsiteTileOptions): number {
  const lines = showDescription ? [TITLE_LINE, SMALL_LINE, SMALL_LINE] : [TITLE_LINE, SMALL_LINE]
  return 2 * PADDING_Y + lines.reduce((sum, line) => sum + line, 0) + (lines.length - 1) * LINE_GAP
}

/** The SVG's height. It depends only on the options, which are the same for every tile. */
export function websiteTileHeight(options: WebsiteTileOptions): number {
  const cardHeight = (options.showThumbnail ? THUMB_HEIGHT : 0) + textHeight(options) + 2 * BORDER
  return cardHeight + 2 * MARGIN
}

interface WebsiteTileProps extends WebsiteTileOptions {
  site: WebsiteEntry
  style: "default" | "terminal"
}

export function WebsiteTile({ site, style, showThumbnail, showDescription }: WebsiteTileProps): React.ReactElement {
  const terminal = style === "terminal"
  const options = { showThumbnail, showDescription }
  // Fixed and unshrinkable, with no margin: the terminal style keeps the browser's 1em
  // on <p>, which in this fixed-height column squeezed the small lines to 0px.
  const line = (height: number): React.CSSProperties => ({
    height: `${height}px`,
    lineHeight: `${height}px`,
    margin: 0,
    flexShrink: 0,
  })

  return (
    <div
      style={{
        width: `${WEBSITE_TILE_WIDTH}px`,
        height: `${websiteTileHeight(options)}px`,
        padding: `${MARGIN}px`,
        boxSizing: "border-box",
      }}
    >
      <ExternalLink
        href={site.url}
        className={
          terminal
            ? "flex flex-col overflow-hidden rounded-lg border border-solid border-terminal-muted"
            : "flex flex-col overflow-hidden rounded-lg border border-solid border-default-border bg-default-muted/10"
        }
        style={{
          height: "100%",
          boxSizing: "border-box",
          ...(terminal ? { backgroundColor: "var(--terminal-color-background)" } : {}),
        }}
      >
        {showThumbnail && (
          <div
            className={terminal ? "w-full overflow-hidden flex-shrink-0" : "w-full overflow-hidden bg-default-muted/10"}
            style={{ height: `${THUMB_HEIGHT}px`, flexShrink: 0 }}
          >
            <ImageComponent
              url64={site.thumbnail}
              alt={site.title}
              className="w-full h-full object-cover"
              width={INNER_WIDTH - 2 * BORDER}
              height={THUMB_HEIGHT}
            />
          </div>
        )}
        <div
          className="flex flex-col min-w-0"
          style={{ height: `${textHeight(options)}px`, padding: `${PADDING_Y}px 8px`, gap: `${LINE_GAP}px` }}
        >
          <div className="flex items-center gap-1.5 min-w-0" style={line(TITLE_LINE)}>
            {!showThumbnail && (
              <ImageComponent
                url64={site.favicon}
                alt={`${site.domain} favicon`}
                className="w-4 h-4 flex-shrink-0 rounded-sm"
                width={16}
                height={16}
              />
            )}
            <p
              className={
                terminal
                  ? "text-sm font-semibold text-terminal-highlight truncate"
                  : "text-sm font-semibold text-default-highlight truncate"
              }
              style={line(TITLE_LINE)}
            >
              {site.title}
            </p>
          </div>
          {showDescription && (
            <p
              className={
                terminal ? "text-[11px] text-terminal-muted-light truncate" : "text-[11px] text-default-text truncate"
              }
              style={line(SMALL_LINE)}
            >
              {site.description || " "}
            </p>
          )}
          <p
            className={
              terminal ? "text-[11px] text-terminal-muted truncate" : "text-[11px] text-default-muted truncate"
            }
            style={line(SMALL_LINE)}
          >
            {terminal ? `❯ ${site.domain}` : site.domain}
          </p>
        </div>
      </ExternalLink>
    </div>
  )
}
