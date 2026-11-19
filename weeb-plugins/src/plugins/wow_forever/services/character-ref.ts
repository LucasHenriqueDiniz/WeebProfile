import { WOW_REGIONS, type WowRegion } from "../types"

export interface CharacterRef {
  region: WowRegion
  /** `{name}-{surname}` in lowercase: the path segment the API and the armory use. */
  slug: string
}

/** `.../forever/{region}/armory/character/{slug}`, the armory page of a Forever character. */
const ARMORY_PATH = /\/forever\/(us|eu|kr|tw)\/armory\/character\/([^/?#]+)/i

function isRegion(value: string): value is WowRegion {
  return (WOW_REGIONS as readonly string[]).includes(value)
}

/**
 * Reads the character the user typed: "Name Surname", "name-surname" or the armory link.
 * A link carries its own region, which wins over the region field.
 *
 * Forever characters have no realm. The two parts of the name are unique per region,
 * and the API looks a character up by both, joined by a hyphen, in lowercase.
 */
export function parseCharacterRef(character: string | undefined, region: string | undefined): CharacterRef {
  const input = (character ?? "").trim()
  if (!input) throw new Error("WoW Forever character is required: type its name and surname, or its armory link.")

  const [, armoryRegion, armorySlug] = input.match(ARMORY_PATH) ?? []
  if (armoryRegion && armorySlug) {
    let slug = armorySlug
    try {
      slug = decodeURIComponent(armorySlug)
    } catch {
      // A malformed escape: keep the segment as it is.
    }
    return { region: armoryRegion.toLowerCase() as WowRegion, slug: slug.toLowerCase() }
  }

  const parts = input.split(/[\s-]+/).filter(Boolean)
  if (parts.length !== 2) {
    throw new Error(
      `Could not read a WoW Forever character from "${input.slice(0, 60)}": type the name and the surname, like "Anduin Wrynn", or paste its armory link.`
    )
  }

  const regionValue = (region ?? "").trim().toLowerCase()
  if (!isRegion(regionValue)) {
    throw new Error(`WoW Forever region must be one of ${WOW_REGIONS.join(", ")}.`)
  }

  return { region: regionValue, slug: parts.join("-").toLowerCase() }
}
