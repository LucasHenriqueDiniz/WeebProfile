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
import { FAVORITES_COLUMNS, FAVORITES_COVER_HEIGHT } from "./components/FavoritesAnime"
import { WATCHING_ROW_GAP, WATCHING_ROW_HEIGHT } from "./components/CurrentlyWatching"
import { fetchAniListData } from "./services/fetchData"

/** Altura do DefaultTitle mais o gap até o conteúdo. */
const DEFAULT_TITLE_H = 33 + 12
/** TerminalCommand ocupa uma linha antes do conteúdo da seção. */
const TERMINAL_COMMAND_H = 24
const TERMINAL_LINE_H = 20

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
            const rows = size === "half" ? blocks * 4 : 4
            height += DEFAULT_TITLE_H + rows * 22
          }
          break
        }

        case "favorites_anime": {
          const favorites = anilist.favoritesAnime ?? []
          if (favorites.length === 0) break
          const columns = FAVORITES_COLUMNS[size]
          const shown = Math.min(favorites.length, cfg.favorites_anime_max ?? columns * 2)
          if (isTerminal) {
            height += TERMINAL_COMMAND_H + shown * TERMINAL_LINE_H
          } else {
            const rows = Math.ceil(shown / columns)
            height += DEFAULT_TITLE_H + rows * FAVORITES_COVER_HEIGHT + Math.max(0, rows - 1) * 8
          }
          break
        }

        case "currently_watching": {
          const entries = anilist.currentlyWatching ?? []
          if (entries.length === 0) break
          const shown = Math.min(entries.length, cfg.currently_watching_max ?? 5)
          if (isTerminal) {
            height += TERMINAL_COMMAND_H + shown * TERMINAL_LINE_H
          } else {
            height += DEFAULT_TITLE_H + shown * WATCHING_ROW_HEIGHT + Math.max(0, shown - 1) * WATCHING_ROW_GAP
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
