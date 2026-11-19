/**
 * Height of the personality section, in px, as the browser lays it out.
 *
 * Until 11/2026 `calculateHeight` was the ENFJ card measured once plus a 10px "buffer",
 * whatever the options: 10px of blank space under every card, 50 with the title hidden and
 * up to 80 with the description off. The description is the only text that wraps; it is
 * counted by `wrappedLineCount`, so every type gets its own height.
 *
 * Measured 18/11/2026 in Chrome 158, Firefox 150 and WebKit 26.4 (`audit:heights`);
 * `height.test.ts` pins the measurements.
 */

import { textWidth, wrappedLineCount } from "../../utils/text-lines"
import type { Personality16Config, Personality16Data } from "./types"

type Size = "half" | "full"

/** The card minus the section's 8px side padding. */
const CONTENT_WIDTH: Record<Size, number> = { half: 415 - 16, full: 830 - 16 }

/** DefaultTitle: 28px row plus `my-1.5`. */
const DEFAULT_TITLE = 40
/** Icon box beside the type and its traits (text-2xl and text-sm lines): the box is taller. */
const DEFAULT_HEADER = 55
/** `gap-4` between the header, the description and the link. */
const DEFAULT_GAP = 16
/** `text-sm leading-relaxed`. */
const DEFAULT_DESCRIPTION_LINE = 22.75
/** The "Learn more" link, a text-sm line. */
const DEFAULT_LINK = 20

/** A `text-sm` monospace line. */
const LINE = 20
/** TerminalCommand: a 20px line plus `py-0.5`. */
const TERMINAL_COMMAND = 24
/** `gap-1` between the terminal blocks. */
const TERMINAL_GAP = 4
/** `py-0.5` around a block. */
const TERMINAL_BLOCK_PADDING = 4
/** "📝 Description" and its `mb-0.5`. */
const TERMINAL_DESCRIPTION_HEADER = LINE + 2
/** `.terminal-body` `padding-bottom`, once per card. */
const TERMINAL_BODY_PADDING = 8

/**
 * Lines a text takes. With normal wrapping the width loses a space, as WebKit moves a word
 * down when the space after it does not fit; `pre-wrap` hangs that space, so it keeps the
 * whole width (95 monospace characters fill the 806px line of a full card in all three).
 */
function lines(text: string, maxWidth: number, fontSize: number, font: "poppins" | "mono", preWrap = false): number {
  const width = preWrap ? maxWidth : maxWidth - textWidth(" ", fontSize, font)
  return Math.max(1, wrappedLineCount(text, { fontSize, maxWidth: width, font }))
}

/** "Extroverted • Intuitive • Feeling • Perceiving": 46 characters, two lines in a half terminal. */
const traitsText = (data: Personality16Data): string =>
  [data.traits.E, data.traits.N, data.traits.F, data.traits.J].join(" • ")

export function personalityHeight(
  config: Personality16Config & { style?: string },
  data: Personality16Data,
  size: Size
): number {
  const showDescription = config.personality_show_description !== false
  const showLink = config.personality_show_link !== false

  if (config.style === "terminal") {
    // The description block is `px-1`: 4px off each side.
    const descriptionLines = lines(data.description, CONTENT_WIDTH[size] - 8, 14, "mono", true)
    const typeLines =
      lines(`${data.emoji} ${data.type} - ${data.name}`, CONTENT_WIDTH[size] - 8, 14, "mono") +
      lines(traitsText(data), CONTENT_WIDTH[size] - 8, 14, "mono")
    const blocks = [
      TERMINAL_COMMAND,
      TERMINAL_BLOCK_PADDING + typeLines * LINE,
      ...(showDescription ? [TERMINAL_BLOCK_PADDING + TERMINAL_DESCRIPTION_HEADER + descriptionLines * LINE] : []),
      ...(showLink ? [LINE] : []),
    ]
    return blocks.reduce((sum, h) => sum + h, 0) + TERMINAL_GAP * (blocks.length - 1) + TERMINAL_BODY_PADDING
  }

  const descriptionLines = lines(data.description, CONTENT_WIDTH[size], 14, "poppins")
  // The traits line beside the icon fits on one line for all 16 types, in both sizes
  // (measured); the text-width tables have no "•" to count it by.
  const blocks = [
    DEFAULT_HEADER,
    ...(showDescription ? [descriptionLines * DEFAULT_DESCRIPTION_LINE] : []),
    ...(showLink ? [DEFAULT_LINK] : []),
  ]
  const title = config.personality_hide_title ? 0 : DEFAULT_TITLE
  return Math.ceil(title + blocks.reduce((sum, h) => sum + h, 0) + DEFAULT_GAP * (blocks.length - 1))
}
