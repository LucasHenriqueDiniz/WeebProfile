import type { FullAnimeFavorite, FullMangaFavorite } from "../types"

/**
 * What a favorite has to draw, with every unknown value already turned into null.
 *
 * MAL and jikan-edge use 0 and null for "unknown" (an unscored title, a series still
 * airing). The list used to render `{score && ...}`, and React prints a 0: a favorite
 * without details came out as its cover, its title and a stray "00". The renderers and
 * `calculateHeight` both read from here, so a field the card hides is also a field the
 * height does not count.
 */
export interface FavoriteFields {
  score: number | null
  popularity: number | null
  episodes: number | null
  chapters: number | null
  year: number | null
  status: string | null
  genres: string[]
  synopsis: string | null
}

/** A score, count or year worth drawing. */
export function positive(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null
}

export function favoriteFields(
  favorite: FullAnimeFavorite | FullMangaFavorite,
  type: "anime" | "manga"
): FavoriteFields {
  return {
    score: positive(favorite.score),
    popularity: positive(favorite.popularity),
    episodes: type === "anime" ? positive((favorite as FullAnimeFavorite).episodes) : null,
    chapters: type === "manga" ? positive((favorite as FullMangaFavorite).chapters) : null,
    // The title's own year when its page gave one, else the start year from the profile.
    year: positive(favorite.year) ?? positive(favorite.start_year),
    status: favorite.status?.trim() || null,
    genres: (favorite.genres ?? []).map((genre) => genre.name).filter(Boolean),
    synopsis: favorite.synopsis?.trim() || null,
  }
}

/**
 * Whether the terminal row of numbers draws anything. The status only shows at full
 * width, so at half width a favorite with just a status has no row at all.
 */
export function hasTerminalMetaRow(fields: FavoriteFields, isHalf: boolean): boolean {
  return (
    fields.score !== null ||
    fields.popularity !== null ||
    fields.episodes !== null ||
    fields.chapters !== null ||
    fields.year !== null ||
    (fields.status !== null && !isHalf)
  )
}

/** The "(TV, 2008)" line of the terminal simple list, without the parts that are unknown. */
export function simpleMetaLine(favorite: { type?: string | null; start_year?: number | null }): string {
  return [favorite.type?.trim() || null, positive(favorite.start_year)].filter((part) => part !== null).join(", ")
}
