/**
 * MyAnimeList Plugin V2
 *
 * Plugin para exibir estatísticas do MyAnimeList
 *
 * Nove seções: statistics, statistics_simple, anime_bar, manga_bar,
 * last_activity e os quatro blocos de favoritos (anime, manga, personagens,
 * pessoas). Todas declaradas em plugin.metadata.ts, tratadas em
 * RenderMyAnimeList e medidas em calculateHeight.
 */

import React from "react"
import type { Plugin } from "../shared/types/plugin"
import type { PluginConfig, PluginData } from "../../types/index"
import type { MyAnimeListConfig, MyAnimeListData } from "./types"
import { DEFAULT_FAVORITES_MAX } from "./constants"
import { RenderMyAnimeList } from "./components/RenderMyAnimeList"
import { favoritesSectionHeight } from "./favorites-height"
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

    const favoritesH = (
      favorites: Parameters<typeof favoritesSectionHeight>[0]["favorites"],
      max: number,
      listStyle: string | undefined,
      hideTitle: boolean | undefined,
      type: "anime" | "manga" | "characters" | "people"
    ): number => favoritesSectionHeight({ favorites, max, listStyle, hideTitle, type, isTerminal, size })

    // DefaultTitle, 40px; until 11/2026 it was counted with the title hidden too (40px of
    // blank space, 80 for the two statistics blocks stacked in half). The terminal bars
    // counted 156px for 151, and the last activity 74px an entry for 72 while a running
    // manga's "?%" wrapped to two lines and drew 91 (53px cut). Measured 18/11/2026 in
    // Chrome 158, Firefox 150 and WebKit 26.4; `section-heights.test.ts` pins it.
    const title = (hidden: boolean | undefined): number => (hidden ? 0 : 40)

    let h = 0
    // Terminal heights are each section drawn alone, with the `.terminal-body` padding (8px)
    // under it. The body wraps all the sections once, so it is taken back off every section
    // after the first that draws something (64px of blank space under all nine until 11/2026).
    let drawn = 0
    for (const s of cfg.sections) {
      const before = h
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
              if (showAnime && showManga) h += 52 + Math.max(nAnime, nManga) * 20
              else h += 52 + (showAnime ? nAnime : nManga) * 20
            } else if (showAnime && showManga) {
              h += 76 + (nAnime + nManga) * 20
            } else {
              h += 52 + (showAnime ? nAnime : nManga) * 20
            }
          } else if (size === "full") {
            // Anime and manga side by side, each block under its own title.
            h += title(cfg.statistics_hide_title) + 144
          } else {
            h += blocks * (title(cfg.statistics_hide_title) + 144) + Math.max(0, blocks - 1) * 8
          }
          break
        }
        case "statistics_simple": {
          if (isTerminal) {
            h += 4 * 30 - 8
          } else {
            const rows = size === "half" ? 2 : 1
            h += title(cfg.statistics_simple_hide_title) + 8 + rows * 24 + Math.max(0, rows - 1) * 4
          }
          break
        }
        case "anime_bar":
        case "manga_bar": {
          if (isTerminal) {
            h += 151
          } else {
            const rows = size === "full" ? 1 : 3
            const hidden = s === "anime_bar" ? cfg.anime_bar_hide_title : cfg.manga_bar_hide_title
            h += title(hidden) + 18 + rows * 20 + Math.max(0, rows - 1) * 8
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
          // Terminal: the command, then entries of three lines (19px, 19px and the 26px status
          // line with its emoji), `gap-1`, 8px apart, and the body's padding.
          h += isTerminal
            ? 24 + n * 72 + Math.max(0, n - 1) * 8 + 8
            : title(cfg.last_activity_hide_title) + n * 75 + Math.max(0, n - 1) * 4
          break
        }
        case "anime_favorites": {
          const max = cfg.anime_favorites_max ?? cfg.favorites_max ?? DEFAULT_FAVORITES_MAX
          h += favoritesH(
            mal.favorites_full?.anime,
            max,
            cfg.anime_favorites_list_style,
            cfg.anime_favorites_hide_title,
            "anime"
          )
          break
        }
        case "manga_favorites": {
          const max = cfg.manga_favorites_max ?? cfg.favorites_max ?? DEFAULT_FAVORITES_MAX
          h += favoritesH(
            mal.favorites_full?.manga,
            max,
            cfg.manga_favorites_list_style,
            cfg.manga_favorites_hide_title,
            "manga"
          )
          break
        }
        case "character_favorites": {
          const max = cfg.character_favorites_max ?? cfg.favorites_max ?? DEFAULT_FAVORITES_MAX
          h += favoritesH(
            mal.favorites?.characters,
            max,
            cfg.character_favorites_list_style,
            cfg.character_favorites_hide_title,
            "characters"
          )
          break
        }
        case "people_favorites": {
          const max = cfg.people_favorites_max ?? cfg.favorites_max ?? DEFAULT_FAVORITES_MAX
          h += favoritesH(
            mal.favorites?.people,
            max,
            cfg.people_favorites_list_style,
            cfg.people_favorites_hide_title,
            "people"
          )
          break
        }
        default:
          break
      }
      if (h > before) drawn++
    }
    return isTerminal ? h - 8 * Math.max(0, drawn - 1) : h
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
