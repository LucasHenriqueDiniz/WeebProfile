import { describe, it, expect } from "vitest"
import { convertSvgToPluginsConfig, getTerminalConfigs } from "./svg-generation"

describe("convertSvgToPluginsConfig", () => {
  it("keeps only plugins that are enabled and have sections", () => {
    const { plugins } = convertSvgToPluginsConfig({
      pluginsConfig: {
        github: { enabled: true, sections: ["profile"] },
        lastfm: { enabled: false, sections: ["top_artists"] },
        steam: { enabled: true, sections: [] },
      },
    })
    expect(Object.keys(plugins)).toEqual(["github"])
  })

  it("drops plugin names that are not registered", () => {
    const { plugins } = convertSvgToPluginsConfig({
      pluginsConfig: { not_a_real_plugin: { enabled: true, sections: ["x"] } },
    })
    expect(plugins).toEqual({})
  })

  it("parses pluginsConfig when it arrives as a JSON string", () => {
    const { plugins } = convertSvgToPluginsConfig({
      pluginsConfig: JSON.stringify({ github: { enabled: true, sections: ["profile"] } }),
    })
    expect(Object.keys(plugins)).toEqual(["github"])
  })

  it("tolerates a missing pluginsConfig", () => {
    expect(convertSvgToPluginsConfig({}).plugins).toEqual({})
  })

  // undefined rather than [], because the generator falls back with
  // `config.pluginsOrder || Object.keys(...)` and an empty array is truthy --
  // returning [] there would pin the order to nothing at all.
  it("returns undefined for an absent order, never an empty array", () => {
    expect(convertSvgToPluginsConfig({}).pluginsOrder).toBeUndefined()
    expect(convertSvgToPluginsConfig({ pluginsOrder: "" }).pluginsOrder).toBeUndefined()
    expect(convertSvgToPluginsConfig({ pluginsOrder: ",," }).pluginsOrder).toBeUndefined()
  })

  it("splits a stored order and drops empty entries", () => {
    expect(convertSvgToPluginsConfig({ pluginsOrder: "github,,lastfm" }).pluginsOrder).toEqual(["github", "lastfm"])
  })
})

describe("getTerminalConfigs", () => {
  it("defaults every flag when uiConfig is absent", () => {
    expect(getTerminalConfigs(null)).toEqual({
      hideTerminalEmojis: false,
      hideTerminalHeader: false,
      hideTerminalCommand: false,
      fontFamily: "poppins",
      terminalHeaderText: "",
    })
  })

  it("passes through explicit values", () => {
    expect(getTerminalConfigs({ hideTerminalHeader: true, fontFamily: "jetbrains" })).toMatchObject({
      hideTerminalHeader: true,
      fontFamily: "jetbrains",
    })
  })

  it("keeps false distinct from unset", () => {
    expect(getTerminalConfigs({ hideTerminalEmojis: false }).hideTerminalEmojis).toBe(false)
  })

  it("trims the header text and ignores a non-string", () => {
    expect(getTerminalConfigs({ terminalHeaderText: "  hello  " }).terminalHeaderText).toBe("hello")
    expect(getTerminalConfigs({ terminalHeaderText: 42 }).terminalHeaderText).toBe("")
  })
})
