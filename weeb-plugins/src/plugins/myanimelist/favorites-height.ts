import { favoriteFields, hasTerminalMetaRow, simpleMetaLine } from "./components/favorite-fields"
import type { BasicCharacterFavorite, BasicPeopleFavorite, FullAnimeFavorite, FullMangaFavorite } from "./types"

type FavoriteType = "anime" | "manga" | "characters" | "people"
type Favorite = FullAnimeFavorite | FullMangaFavorite | BasicCharacterFavorite | BasicPeopleFavorite

/**
 * Pixel sizes of the terminal favorites lists, measured in Chrome on the rendered
 * section (svg-generator audit:heights, plus every list style with favorites that have
 * all, some or none of their details).
 *
 * The terminal list draws only the rows a favorite has, so its height depends on the
 * data: a favorite whose page could not be fetched is a title and a year, 53px, where
 * one with everything is 104px. The old formula charged 107px for every favorite, and
 * a real card whose details were missing came out with 368px of empty terminal.
 */
const TERMINAL = {
  /** Spacing every terminal section keeps, with or without its command line. */
  section: 8,
  /** The `$ run mal view ...` line above the list. */
  command: 24,
  /** detailed / minimal: each favorite is a block with an 8px top margin. */
  itemMargin: 8,
  /**
   * Title, the row of numbers, the genre tags and the synopsis are 20px lines, fixed in
   * FavoritesList (TERMINAL_LINE). Left to the font, the row of numbers was 26px in Chrome
   * for its emoji (⭐ 🎞️ 📚 📅) and less in Firefox and WebKit.
   */
  title: 20,
  metaWithEmoji: 20,
  metaPlain: 20,
  /** 4px margin + one row of genre tags. */
  genres: 24,
  /** 8px margin + one truncated line. */
  synopsis: 28,
  /** simple: paragraphs with 14px margins: 44px for one line, 30px for each extra one. */
  simpleFirstLine: 44,
  simpleExtraLine: 30,
  /** compact: 16px rows, 4px apart. */
  compactRow: 16,
  compactGap: 4,
} as const

function terminalDetailHeight(
  favorite: FullAnimeFavorite | FullMangaFavorite,
  type: "anime" | "manga",
  isHalf: boolean,
  withSynopsis: boolean
): number {
  const fields = favoriteFields(favorite, type)
  let height = TERMINAL.itemMargin + TERMINAL.title
  if (hasTerminalMetaRow(fields, isHalf)) {
    const emoji = fields.score !== null || fields.episodes !== null || fields.chapters !== null || fields.year !== null
    height += emoji ? TERMINAL.metaWithEmoji : TERMINAL.metaPlain
  }
  if (fields.genres.length > 0) height += TERMINAL.genres
  if (withSynopsis && fields.synopsis !== null) height += TERMINAL.synopsis
  return height
}

function terminalListHeight(items: Favorite[], listStyle: string, type: FavoriteType, isHalf: boolean): number {
  const media = type === "anime" || type === "manga" ? type : null
  if (media && (listStyle === "detailed" || listStyle === "minimal")) {
    return items.reduce(
      (sum, item) => sum + terminalDetailHeight(item as FullAnimeFavorite, media, isHalf, listStyle === "detailed"),
      0
    )
  }
  if (listStyle === "simple") {
    return items.reduce((sum, item) => {
      const metaLine = media !== null && simpleMetaLine(item as FullAnimeFavorite) !== ""
      return sum + TERMINAL.simpleFirstLine + (metaLine ? TERMINAL.simpleExtraLine : 0)
    }, 0)
  }
  // compact, and the compact list characters and people fall back to.
  return items.length * TERMINAL.compactRow + (items.length - 1) * TERMINAL.compactGap
}

/** The default style's lists have fixed-height rows, so only the count matters. */
function defaultListHeight(n: number, listStyle: string, type: FavoriteType, size: "half" | "full"): number {
  const media = type === "anime" || type === "manga"
  if (listStyle === "simple") {
    const cols = size === "full" ? 10 : 5
    const rows = Math.ceil(n / cols)
    return rows * 120 + (rows - 1) * 8
  }
  if (media && listStyle === "detailed") return n * 120 + (n - 1) * 4
  if (media && listStyle === "minimal") return n * 75 + (n - 1) * 8
  if (listStyle === "compact") return n * 50 + (n - 1) * 4
  // characters/people asked for detailed or minimal: compact rows, 8px apart.
  return n * 50 + (n - 1) * 8
}

/** The default style's section title (DefaultTitle). */
const DEFAULT_TITLE = 40

/** Height of one favorites section, from the favorites it will actually draw. */
export function favoritesSectionHeight(options: {
  favorites: Favorite[] | undefined
  max: number
  listStyle: string | undefined
  hideTitle: boolean | undefined
  type: FavoriteType
  isTerminal: boolean
  size: "half" | "full"
}): number {
  const { favorites, max, type, isTerminal, size } = options
  const listStyle = options.listStyle ?? (type === "anime" || type === "manga" ? "detailed" : "compact")
  const hideTitle = options.hideTitle ?? false
  const items = (favorites ?? []).slice(0, Math.max(0, max))
  if (items.length === 0) return 0
  if (isTerminal) {
    // Only the simple list drops its command line with the title; the others always draw it.
    const command = listStyle === "simple" && hideTitle ? 0 : TERMINAL.command
    return TERMINAL.section + command + terminalListHeight(items, listStyle, type, size === "half")
  }
  return (hideTitle ? 0 : DEFAULT_TITLE) + defaultListHeight(items.length, listStyle, type, size)
}
