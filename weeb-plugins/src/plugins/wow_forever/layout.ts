/**
 * Every size of the WoW Forever plugin, in one place, so the components draw exactly
 * what calculateHeight counts.
 *
 * No height here depends on text: each line has a fixed height and a value too long for
 * it ends in an ellipsis, as in the About plugin's neofetch. What changes a section's
 * height is how many lines or tiles it has and whether the picture is there.
 */

import type { WowCharacter, WowForeverData } from "./types"

export type Style = "default" | "terminal"
export type Size = "half" | "full"

/** `#svg-main section { padding: 0 8px }`, kept by both styles here. */
export const SECTION_PADDING_X = 8
/** DefaultTitle: a 28px row plus `my-1.5`. */
export const DEFAULT_TITLE = 40
/** Top padding of a default section with its title hidden, and bottom padding of every section. */
export const SECTION_PADDING_Y = 8
/** TerminalCommand: a 20px line with py-0.5. */
export const COMMAND_HEIGHT = 24
/** Between the command line and what it printed. */
export const TERMINAL_GAP = 8

const CARD_WIDTH: Record<Size, number> = { half: 415, full: 830 }
export const CONTENT_WIDTH: Record<Size, number> = {
  half: CARD_WIDTH.half - 2 * SECTION_PADDING_X,
  full: CARD_WIDTH.full - 2 * SECTION_PADDING_X,
}

/** Section chrome around a body: the title or the command above, the padding below. */
export function sectionHeight(style: Style, hideTitle: boolean, body: number): number {
  if (style === "terminal") return COMMAND_HEIGHT + TERMINAL_GAP + body + SECTION_PADDING_Y
  return (hideTitle ? SECTION_PADDING_Y : DEFAULT_TITLE) + body + SECTION_PADDING_Y
}

// ---------------------------------------------------------------- character

export interface CharacterMetrics {
  /** The full-body render's frame. The 1600x1200 picture is cropped to the character inside it. */
  render: { width: number; height: number }
  avatar: number
  imageGap: number
  nameFont: number
  nameLine: number
  /** "Level 60 Human Paladin" (default) or the dashes under the name (terminal). */
  subtitleFont: number
  subtitleLine: number
  /** Space between the name block and the fields (default only). */
  fieldsGap: number
  fieldFont: number
  fieldLine: number
}

export function characterMetrics(style: Style, size: Size): CharacterMetrics {
  const full = size === "full"
  if (style === "terminal") {
    return {
      render: full ? { width: 150, height: 200 } : { width: 120, height: 160 },
      avatar: full ? 96 : 84,
      imageGap: full ? 28 : 14,
      nameFont: full ? 15 : 13,
      nameLine: 20,
      subtitleFont: full ? 15 : 13,
      subtitleLine: 20,
      fieldsGap: 0,
      fieldFont: full ? 13.5 : 12,
      fieldLine: 20,
    }
  }
  return {
    render: full ? { width: 150, height: 200 } : { width: 120, height: 160 },
    avatar: full ? 96 : 84,
    imageGap: full ? 24 : 14,
    nameFont: full ? 22 : 17,
    nameLine: full ? 30 : 24,
    subtitleFont: full ? 14 : 12.5,
    subtitleLine: full ? 22 : 20,
    fieldsGap: 8,
    fieldFont: full ? 14 : 12,
    fieldLine: full ? 22 : 20,
  }
}

/**
 * Where the character stands in the 1600x1200 render, with some room around: renders put
 * the feet near y 975 and the head near y 420 for a human; taller races reach higher.
 * The frame shows this window, scaled to its width.
 */
export const RENDER_CROP = { x: 480, y: 290, width: 640, height: 720 } as const
export const RENDER_SOURCE = { width: 1600, height: 1200 } as const

export interface CharacterField {
  label: string
  value: string
}

const number = (value: number): string => value.toLocaleString("en-US")

/**
 * The "label: value" lines beside the picture. The terminal prints the level, race and
 * class as lines too; the default style puts them under the name.
 */
export function characterFields(character: WowCharacter, style: Style): CharacterField[] {
  const fields: Array<CharacterField | null> = [
    ...(style === "terminal"
      ? [
          { label: "Level", value: String(character.level) },
          character.race ? { label: "Race", value: character.race } : null,
          character.className ? { label: "Class", value: character.className } : null,
        ]
      : []),
    character.guild ? { label: "Guild", value: `<${character.guild}>` } : null,
    character.faction ? { label: "Faction", value: character.faction } : null,
    character.ruleset ? { label: "Ruleset", value: character.ruleset } : null,
    character.averageItemLevel ? { label: "Item level", value: String(character.averageItemLevel) } : null,
    character.honorableKills !== null ? { label: "Honor kills", value: number(character.honorableKills) } : null,
  ]
  return fields.filter((field): field is CharacterField => field !== null)
}

export function characterSubtitle(character: WowCharacter): string {
  return ["Level", character.level, character.race, character.className].filter(Boolean).join(" ")
}

export function characterImageSize(
  style: Style,
  size: Size,
  image: WowForeverData["image"]
): { width: number; height: number } | null {
  if (!image) return null
  const m = characterMetrics(style, size)
  return image.kind === "render" ? m.render : { width: m.avatar, height: m.avatar }
}

export function characterInfoHeight(style: Style, size: Size, fields: number): number {
  const m = characterMetrics(style, size)
  return m.nameLine + m.subtitleLine + (fields > 0 ? m.fieldsGap : 0) + fields * m.fieldLine
}

/** The picture and the info side by side: the taller of the two. */
export function characterBodyHeight(style: Style, size: Size, data: WowForeverData): number {
  const image = characterImageSize(style, size, data.image)
  const info = characterInfoHeight(style, size, characterFields(data.character, style).length)
  return Math.max(image?.height ?? 0, info)
}

// ---------------------------------------------------------------- equipment

export const EQUIPMENT = {
  columns: { half: 1, full: 2 } as Record<Size, number>,
  columnGap: 16,
  row: { default: 24, terminal: 20 } as Record<Style, number>,
  font: { default: 12.5, terminal: 12.5 } as Record<Style, number>,
  slotWidth: { default: 74, terminal: 84 } as Record<Style, number>,
  levelWidth: 30,
} as const

export function equipmentBodyHeight(style: Style, size: Size, items: number): number {
  const rows = Math.ceil(items / EQUIPMENT.columns[size])
  return rows * EQUIPMENT.row[style]
}

// ---------------------------------------------------------------- stats

export const STATS = {
  columns: { default: { half: 4, full: 8 }, terminal: { half: 2, full: 4 } } as Record<Style, Record<Size, number>>,
  gap: 8,
  tile: { paddingY: 6, label: 14, value: 22 },
  terminalLine: 20,
} as const

export const STAT_TILE_HEIGHT = 2 * STATS.tile.paddingY + STATS.tile.label + STATS.tile.value

export function statsBodyHeight(style: Style, size: Size, stats: number): number {
  const rows = Math.ceil(stats / STATS.columns[style][size])
  if (rows === 0) return 0
  if (style === "terminal") return rows * STATS.terminalLine
  return rows * STAT_TILE_HEIGHT + (rows - 1) * STATS.gap
}
