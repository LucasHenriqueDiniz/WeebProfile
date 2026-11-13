import { describe, it, expect } from "vitest"
import { PluginManager } from "./manager"
import { isValidPluginName } from "./generated-types"
import type { Plugin } from "./shared/types/plugin"
import type { PluginConfig, PluginData } from "../types/index"

// Under real names: register() refuses a plugin with no metadata entry. Each test
// registers its own, so they only ever replace each other here.
function fakePlugin(name: string, height: number): Plugin<PluginConfig, PluginData> {
  return {
    name,
    essentialConfigKeys: [],
    config: { enabled: true, sections: [] } as any,
    fetchData: async () => ({}) as any,
    render: () => null as any,
    calculateHeight: () => height,
  } as unknown as Plugin<PluginConfig, PluginData>
}

describe("PluginManager.calculateTotalHeight", () => {
  const manager = PluginManager.getInstance()

  it("never lets a NaN calculateHeight() corrupt the total (a malformed section must not zero out or blow up the whole SVG's height)", () => {
    manager.register(fakePlugin("16personalities", NaN))
    const total = manager.calculateTotalHeight(
      { "16personalities": { enabled: true } as any },
      { "16personalities": {} as any },
      "half"
    )
    expect(total).toBe(0) // no valid section contributed anything -> 0, not NaN
    expect(Number.isNaN(total)).toBe(false)
  })

  it("excludes a negative calculateHeight() from the total instead of subtracting from it", () => {
    manager.register(fakePlugin("anilist", -50))
    manager.register(fakePlugin("lastfm", 100))
    const total = manager.calculateTotalHeight(
      { anilist: { enabled: true } as any, lastfm: { enabled: true } as any },
      { anilist: {} as any, lastfm: {} as any },
      "half"
    )
    // 100 (valid) + 24px safety buffer; the -50 section must be excluded, not subtracted
    expect(total).toBe(124)
  })

  it("sums valid heights normally and adds the 24px safety buffer", () => {
    manager.register(fakePlugin("codeforces", 50))
    manager.register(fakePlugin("codewars", 30))
    const total = manager.calculateTotalHeight(
      { codeforces: { enabled: true } as any, codewars: { enabled: true } as any },
      { codeforces: {} as any, codewars: {} as any },
      "half"
    )
    expect(total).toBe(50 + 30 + 24)
  })
})

describe("PluginManager.register", () => {
  // AGENTS.md promised this check at start-up; it lived in a PluginRegistry that
  // nothing called, so a plugin with no metadata was accepted.
  it("refuses a plugin with no entry in PLUGINS_METADATA", () => {
    const plugin = { ...PluginManager.getInstance().get("devto")!, name: "not_in_metadata" }

    expect(() => PluginManager.getInstance().register(plugin as never)).toThrow(/no entry in PLUGINS_METADATA/)
  })
})

describe("isValidPluginName (generated-types)", () => {
  // It was `name in [array]`, which tests array indices: true for "0", false for "github".
  it("accepts plugin names and nothing else", () => {
    expect(isValidPluginName("github")).toBe(true)
    expect(isValidPluginName("0")).toBe(false)
    expect(isValidPluginName("not_a_plugin")).toBe(false)
  })
})
