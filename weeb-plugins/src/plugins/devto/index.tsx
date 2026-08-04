/**
 * Dev.to Plugin
 *
 * Perfil, artigos recentes e tags mais usadas, da API REST pública do Dev.to.
 *
 * A API não pede autenticação para esses dados — só o username, que vai na config
 * pública. Por isso o plugin não tem essentialConfigKeys.
 */

import React from "react"
import type { Plugin } from "../shared/types/plugin"
import type { PluginConfig, PluginData } from "../../types/index"
import type { DevToConfig, DevToData } from "./types"
import { RenderDevTo } from "./components/RenderDevTo"
import { PROFILE_AVATAR_SIZE } from "./components/Profile"
import { ARTICLE_ROW_GAP, ARTICLE_ROW_HEIGHT } from "./components/RecentArticles"
import { TAG_CHIPS_PER_ROW, TAG_CHIP_HEIGHT, TAG_ROW_GAP } from "./components/TopTags"
import { fetchDevToData } from "./services/fetchData"

/** Altura do DefaultTitle mais o gap até o conteúdo. */
const DEFAULT_TITLE_H = 33 + 12
/** TerminalCommand ocupa uma linha antes do conteúdo da seção. */
const TERMINAL_COMMAND_H = 24
const TERMINAL_LINE_H = 20

export const devToPlugin: Plugin<PluginConfig & DevToConfig, PluginData & DevToData> = {
  name: "devto",
  essentialConfigKeys: [],
  config: {
    enabled: false,
    sections: [],
    username: "",
  } as PluginConfig & DevToConfig,

  fetchData: async (config, dev = false, _essentialConfig?, previewMode = false) => {
    return (await fetchDevToData(config as DevToConfig, dev, previewMode)) as PluginData & DevToData
  },

  render: (config, data) => {
    const style = ((config as any).style || "default") as "default" | "terminal"
    const size = ((config as any).size || "half") as "half" | "full"
    return <RenderDevTo config={config as DevToConfig} data={data as DevToData} style={style} size={size} />
  },

  /**
   * Cada ramo espelha o componente correspondente, e as constantes de layout são
   * importadas de lá em vez de duplicadas — foi duplicando esses números que
   * codewars/leaderboard_position passou a reservar espaço para conteúdo que não
   * renderizava.
   *
   * Seções que devolvem <></> precisam somar zero aqui; calculate-height.test.ts
   * verifica os dois lados dessa equivalência.
   */
  calculateHeight: (config, data, size = "half") => {
    const cfg = { ...(config as DevToConfig), ...((config as DevToConfig).nonEssential || {}) } as DevToConfig
    const devto = data as DevToData
    const isTerminal = (config as { style?: string }).style === "terminal"

    let height = 0

    for (const section of cfg.sections || []) {
      switch (section) {
        case "profile": {
          const profile = devto.profile
          if (isTerminal) {
            // Nome e usuário sempre; localização e data só quando existem, e o
            // componente as omite pelo mesmo critério.
            const lines = 2 + (profile?.location ? 1 : 0) + (profile?.joinedAt ? 1 : 0)
            height += TERMINAL_COMMAND_H + lines * TERMINAL_LINE_H
          } else {
            // Linha do avatar; o bloco de texto ao lado é mais baixo que ele.
            height += DEFAULT_TITLE_H + PROFILE_AVATAR_SIZE
          }
          break
        }

        case "recent_articles": {
          const articles = devto.recentArticles ?? []
          if (articles.length === 0) break
          const shown = Math.min(articles.length, cfg.recent_articles_max ?? 5)
          if (isTerminal) {
            height += TERMINAL_COMMAND_H + shown * TERMINAL_LINE_H
          } else {
            height += DEFAULT_TITLE_H + shown * ARTICLE_ROW_HEIGHT + Math.max(0, shown - 1) * ARTICLE_ROW_GAP
          }
          break
        }

        case "top_tags": {
          const tags = devto.topTags ?? []
          if (tags.length === 0) break
          const shown = Math.min(tags.length, cfg.top_tags_max ?? 8)
          if (isTerminal) {
            height += TERMINAL_COMMAND_H + shown * TERMINAL_LINE_H
          } else {
            const rows = Math.ceil(shown / TAG_CHIPS_PER_ROW[size])
            height += DEFAULT_TITLE_H + rows * TAG_CHIP_HEIGHT + Math.max(0, rows - 1) * TAG_ROW_GAP
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
    /* Preto da marca Dev.to, usado nos destaques do card */
    #svg-main {
      --color-devto: #0a0a0a;
    }

    #svg-main .text-devto {
      color: #0a0a0a !important;
    }

    #svg-main .fill-devto {
      fill: #0a0a0a;
    }
  `,
}

export default devToPlugin
