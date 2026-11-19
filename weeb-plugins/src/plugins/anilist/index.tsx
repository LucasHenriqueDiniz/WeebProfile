/**
 * AniList Plugin
 *
 * Estatísticas, favoritos e lista em andamento do AniList.
 *
 * A API é GraphQL pública e não exige autenticação para perfis públicos, então o
 * plugin não pede segredo nenhum — só o username, que vai na config pública.
 */

import React from "react"
import type { Plugin } from "../shared/types/plugin"
import type { PluginConfig, PluginData } from "../../types/index"
import type { AniListConfig, AniListData } from "./types"
import { RenderAniList } from "./components/RenderAniList"
import { FAVORITES_COLUMNS, FAVORITES_COVER_HEIGHT, FAVORITES_GAP } from "./components/FavoritesAnime"
import { WATCHING_ROW_GAP, WATCHING_ROW_HEIGHT } from "./components/CurrentlyWatching"
import { fetchAniListData } from "./services/fetchData"

/**
 * Heights, measured 18/11/2026 in Chrome 158, Firefox 150 and WebKit 26.4 (`audit:heights`);
 * `section-heights.test.ts` pins them.
 *
 * Until then the sections counted a title of 45px whether it was shown or not (up to 105px
 * of blank space), statistics counted 22px a row for StatisticRow's 20px rows 4px apart and
 * no gap between the anime and manga blocks (29px cut), currently watching counted every row
 * with its 56px cover when the cover failed to embed (36px rows, 55px blank), and the terminal
 * favorites counted 20px lines for TerminalLine's 16px.
 */

/** DefaultTitle (28px plus `my-1.5`), and the `gap-2.5`/`gap-3` after it. */
const titleH = (hidden: boolean, size: "half" | "full"): number => (hidden ? 0 : 40 + (size === "half" ? 10 : 12))
/** StatisticRow: four 20px rows, `gap-1`. */
const STAT_BLOCK_H = 4 * 20 + 3 * 4
/** `gap-4` between the anime and manga blocks, stacked in half. */
const STAT_BLOCK_GAP = 16
/** A watching entry without a cover: a text-sm line and a text-xs line. */
const WATCHING_TEXT_H = 20 + 16
/** TerminalCommand ocupa uma linha antes do conteúdo da seção. */
const TERMINAL_COMMAND_H = 24
/** TerminalLineWithDots. */
const TERMINAL_LINE_H = 20
/** TerminalLine (`sm-text`). */
const TERMINAL_SHORT_LINE_H = 16

const isHidden = (value: unknown): boolean => value === true || value === "true"

export const aniListPlugin: Plugin<PluginConfig & AniListConfig, PluginData & AniListData> = {
  name: "anilist",
  essentialConfigKeys: [],
  config: {
    enabled: false,
    sections: [],
    username: "",
  } as PluginConfig & AniListConfig,

  fetchData: async (config, dev = false, _essentialConfig?, previewMode = false) => {
    return (await fetchAniListData(config as AniListConfig, dev, previewMode)) as PluginData & AniListData
  },

  render: (config, data) => {
    const style = ((config as any).style || "default") as "default" | "terminal"
    const size = ((config as any).size || "half") as "half" | "full"
    return <RenderAniList config={config as AniListConfig} data={data as AniListData} style={style} size={size} />
  },

  /**
   * Cada ramo espelha o layout do componente correspondente, e as constantes
   * compartilhadas (altura de capa, gap das linhas) são importadas de lá em vez de
   * duplicadas — foi assim que codewars/leaderboard_position acabou reservando
   * espaço para conteúdo que não renderizava.
   *
   * Seções que devolvem <></> precisam somar zero aqui; calculate-height.test.ts
   * verifica os dois lados dessa equivalência.
   */
  calculateHeight: (config, data, size = "half") => {
    const cfg = { ...(config as AniListConfig), ...((config as AniListConfig).nonEssential || {}) } as AniListConfig
    const anilist = data as AniListData
    const isTerminal = (config as { style?: string }).style === "terminal"

    let height = 0

    for (const section of cfg.sections || []) {
      switch (section) {
        case "statistics": {
          const media = cfg.statistics_media ?? "both"
          const blocks = media === "both" ? 2 : 1
          if (isTerminal) {
            // Quatro linhas por bloco, empilhadas sempre.
            height += TERMINAL_COMMAND_H + blocks * 4 * TERMINAL_LINE_H
          } else {
            // No half os blocos empilham; no full ficam lado a lado, então a altura
            // é a de um bloco só.
            const stacked = size === "half" ? blocks : 1
            height +=
              titleH(isHidden(cfg.statistics_hide_title), size) +
              stacked * STAT_BLOCK_H +
              (stacked - 1) * STAT_BLOCK_GAP
          }
          break
        }

        case "favorites_anime": {
          const favorites = anilist.favoritesAnime ?? []
          if (favorites.length === 0) break
          const columns = FAVORITES_COLUMNS[size]
          const shown = Math.min(favorites.length, cfg.favorites_anime_max ?? columns * 2)
          if (isTerminal) {
            height += TERMINAL_COMMAND_H + shown * TERMINAL_SHORT_LINE_H
          } else {
            const rows = Math.ceil(shown / columns)
            height +=
              titleH(isHidden(cfg.favorites_anime_hide_title), size) +
              rows * FAVORITES_COVER_HEIGHT +
              (rows - 1) * FAVORITES_GAP
          }
          break
        }

        case "currently_watching": {
          const entries = (anilist.currentlyWatching ?? []).slice(0, cfg.currently_watching_max ?? 5)
          if (entries.length === 0) break
          if (isTerminal) {
            height += TERMINAL_COMMAND_H + entries.length * TERMINAL_LINE_H
          } else {
            height +=
              titleH(isHidden(cfg.currently_watching_hide_title), size) +
              entries.reduce((sum, entry) => sum + (entry.cover ? WATCHING_ROW_HEIGHT : WATCHING_TEXT_H), 0) +
              (entries.length - 1) * WATCHING_ROW_GAP
          }
          break
        }

        default:
          break
      }
    }

    return height
  },

  styles: `
    /* AniList brand blue, usado nos destaques do card */
    #svg-main {
      --color-anilist: #02a9ff;
    }

    #svg-main .text-anilist {
      color: #02a9ff !important;
    }

    #svg-main .fill-anilist {
      fill: #02a9ff;
    }
  `,
}

export default aniListPlugin
