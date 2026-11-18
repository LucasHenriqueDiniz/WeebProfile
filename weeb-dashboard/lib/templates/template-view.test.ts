import { describe, expect, it } from "vitest"
import { effectiveTheme, templatePlugins, templatePreviewConfig, themeSwatch } from "./template-view"

// The three public templates in production, as /api/templates?public=true returns them.
const developerShowcase = {
  platforms: ["github"],
  pluginsOrder: "github",
  pluginsConfig: {
    github: { enabled: true, sections: ["profile", "top_repositories", "calendar"], sectionConfigs: {} },
  },
}
const animeAndMusic = {
  platforms: ["myanimelist", "lastfm"],
  pluginsOrder: "myanimelist,lastfm",
  pluginsConfig: {
    myanimelist: { enabled: true, sections: ["statistics"], sectionConfigs: {} },
    lastfm: { enabled: true, sections: ["top_tracks"], sectionConfigs: {} },
  },
}
const gamerStats = {
  platforms: ["steam", "codewars"],
  pluginsOrder: "steam,codewars",
  pluginsConfig: {
    steam: { enabled: true, sections: ["statistics"], sectionConfigs: {} },
    codewars: { enabled: true, sections: ["completed_kata"], sectionConfigs: {} },
  },
}

describe("templatePlugins", () => {
  it("lists the production templates' plugins in order, with their sections", () => {
    expect(templatePlugins(developerShowcase)).toEqual([
      { id: "github", sections: ["profile", "top_repositories", "calendar"] },
    ])
    expect(templatePlugins(animeAndMusic)).toEqual([
      { id: "myanimelist", sections: ["statistics"] },
      { id: "lastfm", sections: ["top_tracks"] },
    ])
    expect(templatePlugins(gamerStats).map((p) => p.id)).toEqual(["steam", "codewars"])
  })

  it("follows pluginsOrder, sends unordered plugins last and skips disabled ones", () => {
    const template = {
      platforms: [],
      pluginsOrder: ["lastfm", "github"],
      pluginsConfig: {
        github: { enabled: true, sections: ["profile"] },
        steam: { enabled: false, sections: ["statistics"] },
        codewars: { sections: ["completed_kata"] },
        lastfm: { enabled: true, sections: ["top_tracks"] },
      },
    }
    expect(templatePlugins(template).map((p) => p.id)).toEqual(["lastfm", "github", "codewars"])
  })

  it("falls back to the platforms when there is no config", () => {
    expect(templatePlugins({ platforms: ["GitHub"], pluginsConfig: undefined })).toEqual([
      { id: "github", sections: [] },
    ])
  })
})

describe("templatePreviewConfig", () => {
  it("keeps each plugin's own options next to its sections", () => {
    const config = templatePreviewConfig({
      platforms: [],
      pluginsOrder: "github",
      pluginsConfig: { github: { enabled: true, sections: ["profile"], sectionConfigs: { profile: { a: 1 } } } },
    })
    expect(config).toEqual({
      plugins: { github: { enabled: true, sections: ["profile"], sectionConfigs: { profile: { a: 1 } } } },
      pluginsOrder: ["github"],
    })
  })
})

describe("effectiveTheme", () => {
  it("draws a terminal template with a default-style theme in the default terminal palette", () => {
    // Anime & Music: terminal + pink.
    expect(effectiveTheme("terminal", "pink")).toBe("default")
    expect(effectiveTheme("terminal", "dracula")).toBe("dracula")
  })

  it("keeps the default style's themes, custom included", () => {
    expect(effectiveTheme("default", "purple")).toBe("purple")
    expect(effectiveTheme("default", "cyan")).toBe("cyan")
    expect(effectiveTheme("default", "custom")).toBe("custom")
    expect(effectiveTheme("default", "monokai")).toBe("default")
    expect(effectiveTheme("default", undefined)).toBe("default")
  })
})

describe("themeSwatch", () => {
  it("is the theme's highlight, or the custom one", () => {
    expect(themeSwatch("default", "purple")).toBe("#8957E5")
    expect(themeSwatch("default", "custom", { "--default-color-highlight": "#123456" })).toBe("#123456")
    expect(themeSwatch("terminal", "default")).toMatch(/^#/)
  })
})
