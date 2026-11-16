import { describe, expect, it } from "vitest"
import { TERMINAL_HEADER_HEIGHT } from "@weeb/weeb-plugins/templates"
import { generateSvg } from "./svg-generator"

/**
 * The terminal header (the window bar with three dots) is drawn once per SVG, above
 * every plugin. No plugin's calculateHeight counts it; generateSvg adds it once.
 *
 * Before, most plugins had it baked into each terminal section (a three-section
 * Stack Overflow card carried 96px of blank terminal with the header off, the
 * default) and a few left it out (a Dev.to card with the header on lost its last 8px).
 */

// Sections whose content does not depend on mock images.
const PLUGINS = {
  devto: { enabled: true, sections: ["profile", "top_tags"], username: "preview" },
  stackoverflow: { enabled: true, sections: ["reputation", "badges", "answers_questions"], username: "preview" },
}

async function height(style: "default" | "terminal", hideTerminalHeader: boolean): Promise<number> {
  const result = await generateSvg({
    style,
    size: "half",
    dev: true,
    hideTerminalHeader,
    pluginsOrder: Object.keys(PLUGINS),
    plugins: PLUGINS as never,
  })
  return result.height
}

describe("generateSvg terminal header height", () => {
  it("adds the header once for a card of two plugins and five sections", async () => {
    const shown = await height("terminal", false)
    const hidden = await height("terminal", true)

    expect(shown - hidden).toBe(TERMINAL_HEADER_HEIGHT)
  })

  it("adds nothing to the default style, which has no header", async () => {
    expect(await height("default", false)).toBe(await height("default", true))
  })
})
