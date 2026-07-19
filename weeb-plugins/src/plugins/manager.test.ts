import { describe, it, expect } from "vitest"
import { PluginManager } from "./manager"
import type { Plugin } from "./shared/types/plugin"
import type { PluginConfig, PluginData } from "../types/index"

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
    manager.register(fakePlugin("test-nan-height", NaN))
    const total = manager.calculateTotalHeight(
      { "test-nan-height": { enabled: true } as any },
      { "test-nan-height": {} as any },
      "half"
    )
    expect(total).toBe(0) // no valid section contributed anything -> 0, not NaN
    expect(Number.isNaN(total)).toBe(false)
  })

  it("excludes a negative calculateHeight() from the total instead of subtracting from it", () => {
    manager.register(fakePlugin("test-negative-height", -50))
    manager.register(fakePlugin("test-valid-height", 100))
    const total = manager.calculateTotalHeight(
      { "test-negative-height": { enabled: true } as any, "test-valid-height": { enabled: true } as any },
      { "test-negative-height": {} as any, "test-valid-height": {} as any },
      "half"
    )
    // 100 (valid) + 24px safety buffer; the -50 section must be excluded, not subtracted
    expect(total).toBe(124)
  })

  it("sums valid heights normally and adds the 24px safety buffer", () => {
    manager.register(fakePlugin("test-height-a", 50))
    manager.register(fakePlugin("test-height-b", 30))
    const total = manager.calculateTotalHeight(
      { "test-height-a": { enabled: true } as any, "test-height-b": { enabled: true } as any },
      { "test-height-a": {} as any, "test-height-b": {} as any },
      "half"
    )
    expect(total).toBe(50 + 30 + 24)
  })
})
