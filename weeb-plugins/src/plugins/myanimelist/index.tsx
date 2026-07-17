/**
 * MyAnimeList Plugin V2
 *
 * Plugin para exibir estatísticas do MyAnimeList
 *
 * TODO: Completar migração do source original
 */

import React from "react"
import type { Plugin } from "../shared/types/plugin"
import type { PluginConfig, PluginData } from "../../types/index"
import type { MyAnimeListConfig, MyAnimeListData } from "./types"
import { RenderMyAnimeList } from "./components/RenderMyAnimeList"
import { fetchMyAnimeListData } from "./services/fetchMyAnimeList"

export const myAnimeListPlugin: Plugin<PluginConfig & MyAnimeListConfig, PluginData & MyAnimeListData> = {
  name: "myanimelist",
  essentialConfigKeys: [],
  config: {
    enabled: false,
    sections: [],
    username: "",
  } as PluginConfig & MyAnimeListConfig,
  fetchData: async (config: PluginConfig & MyAnimeListConfig, dev = false, essentialConfig?, previewMode = false) => {
    return (await fetchMyAnimeListData(config as MyAnimeListConfig, dev, essentialConfig, previewMode)) as PluginData &
      MyAnimeListData
  },
  render: (config: PluginConfig & MyAnimeListConfig, data: PluginData & MyAnimeListData) => {
    const style = ((config as any).style || "default") as "default" | "terminal"
    const size = ((config as any).size || "half") as "half" | "full"
    const hideTerminalEmojis = (config as any).hideTerminalEmojis || false
    return (
      <RenderMyAnimeList
        config={config as MyAnimeListConfig}
        data={data as MyAnimeListData}
        style={style}
        size={size}
        hideTerminalEmojis={hideTerminalEmojis}
      />
    )
  },
  calculateHeight: (config, data, size = "half") => {
    const cfg = config as MyAnimeListConfig
    const mal = data as MyAnimeListData
    const isTerminal = (config as { style?: string }).style === "terminal"

    // TerminalGrid: TerminalCommand + grid header + n rows
    const terminalGridH = (n: number): number => (n > 0 ? 84 + n * 20 : 0)

    const favoritesH = (
      n: number,
      listStyle: string | undefined,
      defaultListStyle: "detailed" | "compact",
      type: "anime" | "manga" | "characters" | "people"
    ): number => {
      if (n === 0) return 0
      const s = listStyle ?? defaultListStyle
      if (isTerminal) {
        if (s === "simple") {
          const itemH = type === "anime" || type === "manga" ? 40 : 20
          return 24 + n * itemH
        }
        if (s === "compact") return 24 + n * 26
        if (s === "minimal") return 24 + n * 64
        // detailed
        return 24 + n * 107
      }
      if (s === "detailed") return 40 + n * 120 + Math.max(0, n - 1) * 4
      if (s === "compact") return 40 + n * 50 + Math.max(0, n - 1) * 4
      if (s === "minimal") return 40 + n * 75 + Math.max(0, n - 1) * 4
      // simple: image grid (image-portrait 120px, gap-2)
      const cols = size === "full" ? 10 : 5
      const rows = Math.ceil(n / cols)
      return 40 + rows * 120 + Math.max(0, rows - 1) * 8
    }

    let h = 0
    for (const s of cfg.sections) {
      switch (s) {
        case "statistics": {
          const statisticsMedia = cfg.statistics_media ?? "both"
          const showAnime = statisticsMedia === "both" || statisticsMedia === "anime"
          const showManga = statisticsMedia === "both" || statisticsMedia === "manga"
          const blocks = (showAnime ? 1 : 0) + (showManga ? 1 : 0)
          if (blocks === 0) break
          if (isTerminal) {
            // GridItemProps counts are static, not data-dependent
            const nAnime = 10
            const nManga = 11
            if (size === "full") {
              if (showAnime && showManga) h += 24 + 60 + Math.max(nAnime, nManga) * 20
              else h += 24 + 60 + (showAnime ? nAnime : nManga) * 20
            } else if (showAnime && showManga) {
              h += 48 + 60 + (nAnime + nManga) * 20
            } else {
              h += 24 + 60 + (showAnime ? nAnime : nManga) * 20
            }
          } else if (size === "full") {
            h += 184
          } else {
            h += blocks * 184 + Math.max(0, blocks - 1) * 8
          }
          break
        }
        case "statistics_simple": {
          if (isTerminal) {
            h += 24 + 4 * 30
          } else {
            const rows = size === "half" ? 2 : 1
            h += 48 + rows * 24 + Math.max(0, rows - 1) * 4
          }
          break
        }
        case "anime_bar":
        case "manga_bar": {
          if (isTerminal) {
            h += 24 + 44 + 5 * 24
          } else {
            const rows = size === "full" ? 1 : 3
            h += 58 + rows * 20 + Math.max(0, rows - 1) * 8
          }
          break
        }
        case "last_activity": {
          const hideAnime = cfg.last_activity_hide_anime ?? false
          const hideManga = cfg.last_activity_hide_manga ?? false
          const maxItems = cfg.last_activity_max ?? 6
          let total = 0
          if (!hideAnime && !hideManga) {
            total = (mal.last_updated?.anime?.length ?? 0) + (mal.last_updated?.manga?.length ?? 0)
          } else if (!hideAnime) {
            total = mal.last_updated?.anime?.length ?? 0
          } else if (!hideManga) {
            total = mal.last_updated?.manga?.length ?? 0
          }
          const n = Math.min(total, maxItems)
          if (n === 0) break
          h += isTerminal ? 24 + n * 74 + Math.max(0, n - 1) * 8 : 40 + n * 75 + Math.max(0, n - 1) * 4
          break
        }
        case "anime_favorites": {
          const max = cfg.anime_favorites_max ?? cfg.favorites_max ?? 20
          const n = Math.min(mal.favorites_full?.anime?.length ?? max, max)
          h += favoritesH(n, cfg.anime_favorites_list_style, "detailed", "anime")
          break
        }
        case "manga_favorites": {
          const max = cfg.manga_favorites_max ?? cfg.favorites_max ?? 20
          const n = Math.min(mal.favorites_full?.manga?.length ?? max, max)
          h += favoritesH(n, cfg.manga_favorites_list_style, "detailed", "manga")
          break
        }
        case "character_favorites": {
          const max = cfg.character_favorites_max ?? cfg.favorites_max ?? 20
          const n = Math.min(mal.favorites?.characters?.length ?? max, max)
          h += favoritesH(n, cfg.character_favorites_list_style, "compact", "characters")
          break
        }
        case "people_favorites": {
          const max = cfg.people_favorites_max ?? cfg.favorites_max ?? 20
          const n = Math.min(mal.favorites?.people?.length ?? max, max)
          h += favoritesH(n, cfg.people_favorites_list_style, "compact", "people")
          break
        }
        default:
          break
      }
    }
    return h
  },
  // MyAnimeList specific CSS
  styles: `
    /* MyAnimeList specific styles */
    #svg-main {
      --color-watching: #2196f3;
      --color-completed: #2ecc71;
      --color-onhold: #f1c40f;
      --color-dropped: #ff5252;
      --color-plan-to-watch: #95a5a6;
      --color-plan-to-read: #95a5a6;
      --color-reading: #2196f3;
    }

    /* Fill classes for icons */
    #svg-main .fill-mal-watching {
      fill: #2196f3;
    }

    #svg-main .fill-mal-completed {
      fill: #2ecc71;
    }

    #svg-main .fill-mal-on-hold {
      fill: #f1c40f;
    }

    #svg-main .fill-mal-dropped {
      fill: #ff5252;
    }

    #svg-main .fill-mal-plan-to-watch {
      fill: #95a5a6;
    }

    #svg-main .fill-mal-plan-to-read {
      fill: #95a5a6;
    }

    #svg-main .fill-mal-reading {
      fill: #2196f3;
    }

    /* Text classes for status labels */
    #svg-main .text-mal-watching {
      color: #2196f3 !important;
    }

    #svg-main .text-mal-completed {
      color: #2ecc71 !important;
    }

    #svg-main .text-mal-on-hold {
      color: #f1c40f !important;
    }

    #svg-main .text-mal-dropped {
      color: #ff5252 !important;
    }

    #svg-main .text-mal-plan-to-watch {
      color: #95a5a6 !important;
    }

    #svg-main .text-mal-plan-to-read {
      color: #95a5a6 !important;
    }

    #svg-main .text-mal-reading {
      color: #2196f3 !important;
    }

    /* Background classes for horizontal bars */
    #svg-main .bg-mal-watching {
      background-color: #2196f3 !important;
    }

    #svg-main .bg-mal-completed {
      background-color: #2ecc71 !important;
    }

    #svg-main .bg-mal-on-hold {
      background-color: #f1c40f !important;
    }

    #svg-main .bg-mal-dropped {
      background-color: #ff5252 !important;
    }

    #svg-main .bg-mal-plan-to-watch {
      background-color: #95a5a6 !important;
    }

    #svg-main .bg-mal-plan-to-read {
      background-color: #95a5a6 !important;
    }

    #svg-main .bg-mal-reading {
      background-color: #2196f3 !important;
    }
  `,
}

export default myAnimeListPlugin
