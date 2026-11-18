/**
 * Every size of the About plugin, in one place, so the components draw exactly what
 * calculateHeight and the tiles count.
 *
 * The heights do not depend on text: every line has a fixed height and a value too
 * long for its line ends in an ellipsis. The one width that matters is a badge's,
 * which is set on the badge itself (in the card and in its tile), so the browser
 * packs the same widths a row count here assumes.
 */

import { textWidth } from "../../utils/text-lines"

export type Style = "default" | "terminal"
export type Size = "half" | "full"

const CARD_WIDTH: Record<Size, number> = { half: 415, full: 830 }
/** `#svg-main section { padding: 0 8px }`, kept by both styles here. */
export const SECTION_PADDING_X = 8

/** TerminalCommand: a 20px line with py-0.5. */
export const COMMAND_HEIGHT = 24
/** Between the command line and what it printed, and before the last prompt. */
export const TERMINAL_GAP = 8
/** Bottom padding of a terminal section, as TerminalBody gives the other plugins. */
export const TERMINAL_PADDING_BOTTOM = 8
/** Top and bottom padding of a default section. */
export const DEFAULT_PADDING_Y = 8

export interface NeofetchMetrics {
  image: number
  imageGap: number
  titleFont: number
  titleLine: number
  /** The rule under the title: a line of dashes (terminal) or a 1px line with space around it. */
  rule: number
  fieldFont: number
  fieldLine: number
  paletteGap: number
  swatch: { width: number; height: number }
}

export function neofetchMetrics(style: Style, size: Size): NeofetchMetrics {
  const full = size === "full"
  if (style === "terminal") {
    return {
      image: full ? 174 : 104,
      imageGap: full ? 32 : 16,
      titleFont: full ? 15 : 13,
      titleLine: 20,
      rule: 20,
      fieldFont: full ? 13.5 : 12,
      fieldLine: 20,
      paletteGap: 10,
      swatch: full ? { width: 22, height: 14 } : { width: 16, height: 12 },
    }
  }
  return {
    image: full ? 168 : 100,
    imageGap: full ? 28 : 16,
    titleFont: full ? 22 : 17,
    titleLine: full ? 30 : 24,
    rule: 17,
    fieldFont: full ? 14 : 12,
    fieldLine: full ? 22 : 20,
    paletteGap: 12,
    swatch: full ? { width: 22, height: 12 } : { width: 16, height: 10 },
  }
}

export interface NeofetchLayout {
  fields: number
  hasImage: boolean
  showPalette: boolean
  showCursor: boolean
}

/** Height of the title, rule, lines and palette column. */
export function neofetchInfoHeight(style: Style, size: Size, layout: NeofetchLayout): number {
  const m = neofetchMetrics(style, size)
  const palette = layout.showPalette ? m.paletteGap + m.swatch.height : 0
  return m.titleLine + m.rule + layout.fields * m.fieldLine + palette
}

/** Height of the picture and the info side by side: the taller of the two. */
export function neofetchBodyHeight(style: Style, size: Size, layout: NeofetchLayout): number {
  const m = neofetchMetrics(style, size)
  return Math.max(layout.hasImage ? m.image : 0, neofetchInfoHeight(style, size, layout))
}

export function neofetchHeight(style: Style, size: Size, layout: NeofetchLayout): number {
  const body = neofetchBodyHeight(style, size, layout)
  if (style === "terminal") {
    const prompt = layout.showCursor ? TERMINAL_GAP + COMMAND_HEIGHT : 0
    return COMMAND_HEIGHT + TERMINAL_GAP + body + prompt + TERMINAL_PADDING_BOTTOM
  }
  return 2 * DEFAULT_PADDING_Y + body
}

/** A link badge: the shape of the README buttons it replaces (36px tall, 8px corners). */
export const BADGE = {
  height: 36,
  radius: 8,
  paddingX: 16,
  icon: 18,
  iconGap: 9,
  font: 13,
  /** Between badges in a card. In a README the space between the <a> tags is the gap. */
  gap: 8,
} as const

/**
 * Poppins 500 draws a few percent wider than the 400 widths textWidth knows. The badge
 * is sized for the wider case and centers its content, so the difference is a pixel or
 * two more padding. A badge always draws in its style's embedded font (LinkBadge), so
 * the card's global font never changes these widths.
 */
const DEFAULT_TEXT_SLACK = 1.06

/** Width of a badge with this text, in px. The same in the card and in its tile. */
export function badgeWidth(label: string, style: Style): number {
  const text =
    style === "terminal"
      ? textWidth(label, BADGE.font, "mono")
      : textWidth(label, BADGE.font, "poppins") * DEFAULT_TEXT_SLACK
  return Math.ceil(2 * BADGE.paddingX + BADGE.icon + BADGE.iconGap + text)
}

/** The terminal row starts under the command's text, which TerminalCommand's px-1 indents. */
export function badgeRowIndent(style: Style): number {
  return style === "terminal" ? 4 : 0
}

/** Widest a badge can be in the card: alone on its row, cut with an ellipsis past it. */
export function maxBadgeWidth(style: Style, size: Size): number {
  return CARD_WIDTH[size] - 2 * SECTION_PADDING_X - badgeRowIndent(style)
}

/** A badge's width in the card: its own, or the row's when it is wider. */
export function cardBadgeWidth(label: string, style: Style, size: Size): number {
  return Math.min(badgeWidth(label, style), maxBadgeWidth(style, size))
}

/** Rows a flex-wrap line of badges takes in a row `available` px wide, packed as the browser does. */
export function badgeRows(widths: number[], available: number): number {
  if (widths.length === 0) return 0
  let rows = 1
  let line = 0
  for (const width of widths) {
    const next = line === 0 ? width : line + BADGE.gap + width
    if (line > 0 && next > available) {
      rows++
      line = width
    } else {
      line = next
    }
  }
  return rows
}

export function linksHeight(style: Style, size: Size, labels: string[]): number {
  if (labels.length === 0) return 0
  const widths = labels.map((label) => cardBadgeWidth(label, style, size))
  const rows = badgeRows(widths, maxBadgeWidth(style, size))
  const body = rows * BADGE.height + (rows - 1) * BADGE.gap
  if (style === "terminal") return COMMAND_HEIGHT + TERMINAL_GAP + body + TERMINAL_PADDING_BOTTOM
  return 2 * DEFAULT_PADDING_Y + body
}
