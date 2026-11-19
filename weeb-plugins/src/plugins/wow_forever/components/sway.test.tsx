import { renderToString } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { PluginManager } from "../../manager"
import { MOCK_DATA } from "../services/mock-data"
import type { WowForeverData } from "../types"

const plugin = PluginManager.getInstance().get("wow_forever")!
const withImage = (kind: "render" | "avatar"): WowForeverData => ({
  ...MOCK_DATA,
  image: { kind, src: "data:image/png;base64," },
})
const html = (data: WowForeverData, options: Record<string, unknown> = {}) =>
  renderToString(
    plugin.render(
      { enabled: true, sections: ["character"], style: "terminal", size: "half", ...options } as never,
      data as never
    )
  )

describe("character sway", () => {
  it("wraps the full-body render in the swaying layer by default", () => {
    expect(html(withImage("render"))).toContain('class="wow-sway"')
  })

  it("leaves the render still when switched off", () => {
    expect(html(withImage("render"), { character_sway: false })).not.toContain("wow-sway")
  })

  it("never sways the portrait, a face cropped to its frame", () => {
    expect(html(withImage("avatar"))).not.toContain("wow-sway")
  })

  it("moves only with card animations on and motion allowed", () => {
    const css = plugin.styles!
    const motion = /@media \(prefers-reduced-motion: no-preference\) \{([\s\S]*?)\n\}/.exec(css)?.[1] ?? ""
    expect(motion).toContain(".weeb-anim .wow-sway")
    expect(css.replace(motion, "")).not.toMatch(/\.wow-sway\s*\{/)
  })
})
