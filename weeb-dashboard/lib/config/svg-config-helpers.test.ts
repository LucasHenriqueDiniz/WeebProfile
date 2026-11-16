import { describe, expect, it } from "vitest"
import { buildStyleUiConfig, readStyleUiConfig, type StyleUiConfig } from "./svg-config-helpers"

/** A style the wizard holds: every field away from its default. */
const style: StyleUiConfig = {
  hideTerminalEmojis: true,
  hideTerminalHeader: true,
  hideTerminalCommand: true,
  fontFamily: "mono",
  terminalHeaderText: "me@host:~",
  colorMode: "auto",
  animations: true,
  customThemeColors: { "--default-color-highlight": "#e11d48", "--default-color-surface": "#fef9c3" },
}

describe("style ui_config, saved and loaded back by the editor", () => {
  // The save replaces ui_config whole: a field the editor does not load comes back
  // empty and the next save erases it from D1. That is how turning Auto on in the
  // editor wiped a custom card's colors.
  it("loads back every field the wizard saves", () => {
    expect(readStyleUiConfig(buildStyleUiConfig("custom", style))).toEqual(style)
  })

  it("survives a second edit unchanged", () => {
    const once = buildStyleUiConfig("custom", style)
    const twice = buildStyleUiConfig("custom", readStyleUiConfig(once))
    expect(twice).toEqual(once)
  })

  it("saves custom colors only for the custom theme", () => {
    expect(buildStyleUiConfig("purple", style).customThemeColors).toBeUndefined()
  })

  it("loads a card saved before colorMode existed as fixed, with no custom colors", () => {
    expect(readStyleUiConfig({ fontFamily: "serif" })).toMatchObject({
      colorMode: "fixed",
      customThemeColors: {},
      fontFamily: "serif",
    })
  })

  it("skips stored custom colors that are not strings", () => {
    expect(
      readStyleUiConfig({ customThemeColors: { "--default-color-highlight": "#e11d48", "--x": 3 } }).customThemeColors
    ).toEqual({ "--default-color-highlight": "#e11d48" })
  })
})
