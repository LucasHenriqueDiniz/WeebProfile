import { WOW_REGIONS, type WowRegion } from "../types"

export interface CharacterRef {
  /** Where to look, in order: one region, or all four when the user did not say. */
  regions: WowRegion[]
  /** `{name}-{surname}` in lowercase: the path segment the API and the armory use. */
  slug: string
}

/** `.../forever/{region}/armory/character/{slug}`: Blizzard's armory page of a Forever character. */
const BLIZZARD_ARMORY = /\/forever\/(us|eu|kr|tw)\/armory\/character\/([^/?#]+)/i
/** `.../armory/{slug}`: other armories (wowforeverdata.com) name the character without a region. */
const OTHER_ARMORY = /\/armory\/([^/?#]+)/i

function isRegion(value: string): value is WowRegion {
  return (WOW_REGIONS as readonly string[]).includes(value)
}

function decode(segment: string): string {
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment // A malformed escape: keep the segment as it is.
  }
}

/** The region field: one region, or every region when it is empty or "auto". */
function regionsFrom(region: string | undefined): WowRegion[] {
  const value = (region ?? "").trim().toLowerCase()
  if (!value || value === "auto") return [...WOW_REGIONS]
  if (!isRegion(value)) throw new Error(`WoW Forever region must be one of ${WOW_REGIONS.join(", ")}, or auto.`)
  return [value]
}

/**
 * Reads the character the user typed: "Name Surname", "name-surname" or an armory link.
 * Blizzard's link carries the region, which wins over the region field.
 *
 * Forever characters have no realm. The two parts of the name are unique per region,
 * and the API looks a character up by both, joined by a hyphen, in lowercase. Without a
 * region the regions are tried in order, as armories that take only the name do.
 */
export function parseCharacterRef(character: string | undefined, region: string | undefined): CharacterRef {
  const input = (character ?? "").trim()
  if (!input) throw new Error("WoW Forever character is required: type its name and surname, or its armory link.")

  const [, blizzardRegion, blizzardSlug] = input.match(BLIZZARD_ARMORY) ?? []
  if (blizzardRegion && blizzardSlug) {
    return { regions: [blizzardRegion.toLowerCase() as WowRegion], slug: decode(blizzardSlug).toLowerCase() }
  }

  const [, otherSlug] = input.match(OTHER_ARMORY) ?? []
  const name = otherSlug ? decode(otherSlug) : input
  const parts = name.split(/[\s-]+/).filter(Boolean)
  if (parts.length !== 2) {
    throw new Error(
      `Could not read a WoW Forever character from "${input.slice(0, 60)}": type the name and the surname, like "Anduin Wrynn", or paste its armory link.`
    )
  }
  return { regions: regionsFrom(region), slug: parts.join("-").toLowerCase() }
}
