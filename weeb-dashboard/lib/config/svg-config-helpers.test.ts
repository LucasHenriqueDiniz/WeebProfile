import { describe, expect, it } from "vitest"
import { buildStyleUiConfig, readSectionConfigs, readStyleUiConfig, type StyleUiConfig } from "./svg-config-helpers"

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

describe("readSectionConfigs", () => {
  // A websites card as the API wrote it to D1 (11/2026): the options at the root of the
  // plugin's config, no sectionConfigs. The editor opened it with no sites at all.
  const sites = [
    { url: "https://weebprofile-dashboard.pages.dev/", title: "WeebProfile", image: "https://example.com/a.jpg" },
    { url: "https://jikan.lucashdo.com/", title: "jikan-edge", description: "MyAnimeList API at the edge" },
  ]
  const rootOnly = {
    enabled: true,
    sections: ["websites"],
    websites_variant: "grid",
    websites_max: 6,
    websites_autofill: true,
    websites_hide_title: true,
    websites_items: sites,
  }

  it("loads options saved at the root, so the save writes them back", () => {
    expect(readSectionConfigs("websites", rootOnly, ["websites"])).toEqual({
      websites: {
        websites_variant: "grid",
        websites_max: 6,
        websites_autofill: true,
        websites_hide_title: true,
        websites_items: sites,
      },
    })
  })

  it("keeps what sectionConfigs has over the root", () => {
    const both = { ...rootOnly, sectionConfigs: { websites: { websites_max: 7 } } }
    expect(readSectionConfigs("websites", both, ["websites"]).websites).toMatchObject({
      websites_max: 7,
      websites_items: sites,
    })
  })

  it("gives each active section only the options it declares", () => {
    const steam = {
      enabled: true,
      sections: ["statistics", "top_games"],
      steamId: "765",
      top_games_max: 4,
      statistics_hide_title: true,
      recent_games_max: 3,
    }
    expect(readSectionConfigs("steam", steam, ["statistics", "top_games"])).toEqual({
      statistics: { statistics_hide_title: true },
      top_games: { top_games_max: 4 },
    })
  })

  it("reads a card saved by the wizard as it was", () => {
    const nested = { enabled: true, sections: ["websites"], sectionConfigs: { websites: { websites_max: 3 } } }
    expect(readSectionConfigs("websites", nested, ["websites"])).toEqual({ websites: { websites_max: 3 } })
  })
})
