import React from "react"
import { FaTags } from "react-icons/fa"
import { AnimatedNumber } from "../../../templates/AnimatedNumber"
import { CascadeGroup, useAnimations, useItemCascade, withCascade } from "../../../templates/animations"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import { textWidth } from "../../../utils/text-lines"
import type { DevToConfig, DevToTag } from "../types"

interface TopTagsProps {
  tags: DevToTag[]
  config: DevToConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

// Layout numbers shared with calculateHeight in index.tsx: the chips wrap by their
// width, so the height counts rows the same way the browser packs them.

export const TAG_CHIP_HEIGHT = 24
/** Gap between chips, across and down. */
export const TAG_CHIP_GAP = 6
const TAG_CHIP_PADDING_X = 8
const TAG_CHIP_BORDER = 1
/** Gap between the tag name and its count inside a chip. */
const TAG_CHIP_INNER_GAP = 5
const TAG_FONT_SIZE = 12

/**
 * Width of one chip in px: border, padding, "#name" in Poppins 500, the gap and the
 * count in Poppins 600. The chip has `white-space: nowrap`, so it never wraps inside.
 */
export function tagChipWidth(tag: DevToTag): number {
  return (
    2 * (TAG_CHIP_BORDER + TAG_CHIP_PADDING_X) +
    textWidth(`#${tag.name}`, TAG_FONT_SIZE, "poppins", 500) +
    TAG_CHIP_INNER_GAP +
    textWidth(String(tag.count), TAG_FONT_SIZE, "poppins", 600)
  )
}

/** Terminal name column, in characters: long enough for most tags, short enough to leave the bar room. */
const TERMINAL_NAME_MAX_CH = { half: 20, full: 32 } as const

export function shownTags(tags: DevToTag[] | undefined, config: DevToConfig): DevToTag[] {
  return (tags ?? []).slice(0, config.top_tags_max ?? 8)
}

export function topTagsTitleHidden(config: DevToConfig): boolean {
  return config.top_tags_hide_title === true || config.top_tags_hide_title === "true"
}

/**
 * Highlight tint of a chip, from 8% for the least used tag to 22% for the most used:
 * the ranking reads at a glance without a second colour.
 */
function chipTint(count: number, top: number): number {
  return Math.round(8 + (14 * count) / Math.max(top, 1))
}

function TagChips({ tags }: { tags: DevToTag[] }): React.ReactElement {
  const cascade = useItemCascade(tags.length)
  const top = tags[0]?.count ?? 1

  return (
    <div className={withCascade("flex flex-wrap", cascade)} style={{ gap: `${TAG_CHIP_GAP}px`, ...cascade?.style }}>
      {tags.map((tag) => {
        const tint = chipTint(tag.count, top)
        return (
          <span
            key={tag.name}
            className="flex items-center whitespace-nowrap rounded-md"
            style={{
              boxSizing: "border-box",
              height: `${TAG_CHIP_HEIGHT}px`,
              padding: `0 ${TAG_CHIP_PADDING_X}px`,
              gap: `${TAG_CHIP_INNER_GAP}px`,
              fontSize: `${TAG_FONT_SIZE}px`,
              lineHeight: "16px",
              background: `color-mix(in srgb, var(--default-color-highlight) ${tint}%, transparent)`,
              border: `${TAG_CHIP_BORDER}px solid color-mix(in srgb, var(--default-color-highlight) ${tint + 14}%, transparent)`,
            }}
          >
            <span className="font-medium" style={{ color: "var(--default-color-muted)" }}>
              <span style={{ color: "var(--default-color-highlight)" }}>#</span>
              {tag.name}
            </span>
            <span className="font-semibold" style={{ color: "var(--default-color-highlight)" }}>
              <AnimatedNumber value={tag.count} />
            </span>
          </span>
        )
      })}
    </div>
  )
}

const MONO = "monospace, 'Courier New', Courier, 'Lucida Console', Monaco, ui-monospace"

/** One line per tag: name, a bar as long as its share of the top tag, count. 20px tall. */
function TerminalTagBars({ tags, size }: { tags: DevToTag[]; size: "half" | "full" }): React.ReactElement {
  const animations = useAnimations()
  const top = tags[0]?.count ?? 1
  const nameCh = Math.min(Math.max(...tags.map((tag) => tag.name.length + 1)), TERMINAL_NAME_MAX_CH[size])
  const countCh = Math.max(...tags.map((tag) => String(tag.count).length))

  return (
    <CascadeGroup count={tags.length}>
      {tags.map((tag) => (
        <div
          key={tag.name}
          className="flex items-center gap-2 w-full px-1"
          style={{ fontFamily: MONO, fontSize: "0.875rem", lineHeight: "1.25rem", height: "20px" }}
        >
          <span
            className="font-semibold whitespace-nowrap truncate flex-shrink-0 text-terminal-warning"
            // min-width lines the bars up; a name exactly nameCh wide fills its box to the
            // subpixel and was cut with an ellipsis when this was a fixed width.
            style={{ minWidth: `${nameCh}ch`, maxWidth: `${TERMINAL_NAME_MAX_CH[size]}ch` }}
          >
            #{tag.name}
          </span>
          <span className="flex-1 h-2 rounded-sm overflow-hidden bg-terminal-stripe">
            <span
              className={`block h-full rounded-sm${animations ? " weeb-bar" : ""}`}
              style={{
                width: `${Math.max(2, (tag.count / Math.max(top, 1)) * 100)}%`,
                background: "var(--terminal-color-highlight)",
              }}
            />
          </span>
          <span
            className="text-terminal-muted whitespace-nowrap text-right flex-shrink-0"
            style={{ width: `${countCh}ch` }}
          >
            <AnimatedNumber value={tag.count} />
          </span>
        </div>
      ))}
    </CascadeGroup>
  )
}

export function TopTags({ tags, config, style = "default", size = "half" }: TopTagsProps): React.ReactElement {
  const shown = shownTags(tags, config)

  // The tags come from the article window; with no articles there are none, and the
  // section goes away instead of drawing an empty block.
  if (shown.length === 0) return <></>

  const hideTitle = topTagsTitleHidden(config)
  // "recent" on purpose: this counts the fetched window, not the whole history -- the
  // API has no totals without paging through everything.
  const title = config.top_tags_title || "Top Tags (recent posts)"

  return (
    <section id="devto-top-tags">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<FaTags />} />}
            <TagChips tags={shown} />
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "devto", section: "top_tags", size })} />
            <TerminalTagBars tags={shown} size={size} />
          </>
        }
      />
    </section>
  )
}
