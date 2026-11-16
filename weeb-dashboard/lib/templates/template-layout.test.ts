import { describe, expect, it } from "vitest"
import { templateForViewer, templateLayout, templateUiLayout } from "./template-layout"

describe("templateLayout", () => {
  it("keeps sections and closed-choice options, drops identity and typed content", () => {
    const layout = templateLayout({
      myanimelist: {
        enabled: true,
        username: "author",
        sections: ["statistics", "anime_favorites"],
        sectionConfigs: {
          anime_favorites: {
            anime_favorites_hide_title: true,
            anime_favorites_title: "Author's picks",
            favorites_max: 8,
          },
          statistics: { statistics_anime_title: "Mine" },
        },
      },
      websites: {
        enabled: true,
        sections: ["websites"],
        sectionConfigs: { websites: { websites_items: [{ url: "https://author.dev" }] } },
      },
    })

    expect(layout).toEqual({
      myanimelist: {
        enabled: true,
        sections: ["statistics", "anime_favorites"],
        sectionConfigs: { anime_favorites: { anime_favorites_hide_title: true, favorites_max: 8 } },
      },
      websites: { enabled: true, sections: ["websites"], sectionConfigs: {} },
    })
  })

  it("drops a value that does not fit its option's type, so a layout key cannot carry text", () => {
    const layout = templateLayout({
      github_repo: {
        enabled: true,
        sections: ["banner"],
        sectionConfigs: {
          banner: { banner_variant: "author-gh/secret-project", content_size: "xl" },
        },
      },
      myanimelist: {
        enabled: true,
        sections: ["anime_favorites"],
        sectionConfigs: { anime_favorites: { anime_favorites_hide_title: "author", favorites_max: Infinity } },
      },
    })

    expect(layout.github_repo.sectionConfigs).toEqual({ banner: { content_size: "xl" } })
    expect(layout.myanimelist.sectionConfigs).toEqual({})
  })

  it("never carries Include private repositories, though it is a boolean", () => {
    const layout = templateLayout({
      github: {
        enabled: true,
        sections: ["repositories"],
        sectionConfigs: { repositories: { repositories_use_private: true, repositories_hide_title: true } },
      },
    })

    expect(layout.github.sectionConfigs).toEqual({ repositories: { repositories_hide_title: true } })
  })

  it("drops plugins and sections the metadata does not know, and options of sections not enabled", () => {
    const layout = templateLayout({
      not_a_plugin: { enabled: true, sections: ["x"] },
      github: {
        sections: ["profile", "nope", 42],
        sectionConfigs: { introduction: { introduction_hide_title: true } },
      },
    })

    expect(layout).toEqual({ github: { enabled: true, sections: ["profile"], sectionConfigs: {} } })
  })

  it("reads a config stored as a JSON string and ignores one that is not an object", () => {
    expect(templateLayout(JSON.stringify({ github: { enabled: false, sections: ["profile"] } }))).toEqual({
      github: { enabled: false, sections: ["profile"], sectionConfigs: {} },
    })
    expect(templateLayout("not json")).toEqual({})
    expect(templateLayout(null)).toEqual({})
    expect(templateLayout(["github"])).toEqual({})
  })
})

describe("templateUiLayout", () => {
  it("keeps presentation flags and drops the free-text terminal header", () => {
    expect(
      templateUiLayout({
        hideTerminalEmojis: true,
        hideTerminalHeader: "yes",
        animations: true,
        fontFamily: "inter",
        terminalHeaderText: "author@home:~",
        customThemeColors: { "--default-color-highlight": "#ff00aa", bad: 3 },
        somethingElse: "x",
      })
    ).toEqual({
      hideTerminalEmojis: true,
      animations: true,
      fontFamily: "inter",
      customThemeColors: { "--default-color-highlight": "#ff00aa" },
    })
  })
})

describe("templateForViewer", () => {
  const row = {
    id: "t1",
    userId: "user_author",
    svgId: "svg-1",
    name: "Mine",
    pluginsConfig: { github: { enabled: true, username: "author", sections: ["profile"] } },
    uiConfig: { terminalHeaderText: "author@home:~" },
  }

  it("returns the row whole to its owner", () => {
    expect(templateForViewer(row, "user_author")).toBe(row)
  })

  it("returns only the layout to anyone else, signed in or not", () => {
    for (const viewer of [null, "user_other"]) {
      expect(templateForViewer(row, viewer)).toEqual({
        id: "t1",
        name: "Mine",
        pluginsConfig: { github: { enabled: true, sections: ["profile"], sectionConfigs: {} } },
        uiConfig: {},
      })
    }
  })
})
