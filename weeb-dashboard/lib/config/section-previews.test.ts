import { describe, expect, it } from "vitest"
// The generated metadata from source, not the package build: the test must see the
// plugins as they are in this checkout.
import { PLUGINS_METADATA } from "../../../weeb-plugins/src/plugins/metadata"
import { SECTION_PREVIEWS } from "./section-previews"

describe("section previews", () => {
  // The plugins gallery shows one card per section and style. Codewars'
  // leaderboard_position preview was a 415x0 SVG for months, an empty card on the
  // page, because its mock had no leaderboard position.
  it("has a preview with a visible size for every section, in both styles", () => {
    const missing: string[] = []
    for (const [plugin, metadata] of Object.entries(PLUGINS_METADATA)) {
      for (const section of metadata.sections) {
        for (const style of ["default", "terminal"] as const) {
          const size = SECTION_PREVIEWS[plugin]?.[section.id]?.[style]
          if (!size || !(size[0] > 0) || !(size[1] > 0)) missing.push(`${plugin}/${style}/${section.id}`)
        }
      }
    }
    expect(missing).toEqual([])
  })
})
