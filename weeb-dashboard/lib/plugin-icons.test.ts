import { describe, expect, it } from "vitest"
// The generated metadata from source, not the package build: the test must see the
// plugins as they are in this checkout.
import { PLUGINS_METADATA } from "../../weeb-plugins/src/plugins/metadata"
import { getPluginIcon } from "./plugin-icons"

describe("plugin icons", () => {
  it("has an icon for every registered plugin", () => {
    const withoutIcon = Object.keys(PLUGINS_METADATA).filter((id) => !getPluginIcon(id))
    expect(withoutIcon).toEqual([])
  })
})
