/**
 * MyAnimeList Plugin V2
 * 
 * Plugin para exibir estatísticas do MyAnimeList
 * 
 * TODO: Completar migração do source original
 */

import React from 'react'
import type { Plugin } from '../shared/types/plugin'
import type { PluginConfig, PluginData } from '../../types/index'
import type { MyAnimeListConfig, MyAnimeListData } from './types'
import { RenderMyAnimeList } from './components/RenderMyAnimeList'
import { fetchMyAnimeListData } from './services/fetchMyAnimeList'

export const myAnimeListPlugin: Plugin<PluginConfig & MyAnimeListConfig, PluginData & MyAnimeListData> = {
  name: 'myanimelist',
  essentialConfigKeys: [],
  config: {
    enabled: false,
    sections: [],
    username: '',
  } as PluginConfig & MyAnimeListConfig,
  fetchData: async (config: PluginConfig & MyAnimeListConfig, dev = false, essentialConfig?, previewMode = false) => {
    return await fetchMyAnimeListData(config as MyAnimeListConfig, dev, essentialConfig, previewMode) as PluginData & MyAnimeListData
  },
  render: (config: PluginConfig & MyAnimeListConfig, data: PluginData & MyAnimeListData) => {
    const style = ((config as any).style || 'default') as 'default' | 'terminal'
    const size = ((config as any).size || 'half') as 'half' | 'full'
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
  calculateHeight: (config) => {
    const cfg = config as MyAnimeListConfig

    const favoritesH = (
      n: number,
      listStyle: string | undefined,
      defaultH: number
    ): number => {
      const s = listStyle ?? 'simple'
      if (s === 'detailed') return 33 + n * 120 + Math.max(0, n - 1) * 4
      if (s === 'compact') return 33 + n * 50 + Math.max(0, n - 1) * 4
      if (s === 'minimal') return 33 + n * 75 + Math.max(0, n - 1) * 4
      // 'simple' or default: grid layout, upper-bound from preview
      return defaultH
    }

    let h = 0
    for (const s of cfg.sections) {
      if (s === 'statistics') h += 366
      else if (s === 'statistics_simple') h += 95
      else if (s === 'anime_bar') h += 129
      else if (s === 'manga_bar') h += 129
      else if (s === 'last_activity') {
        // Each anime/manga update is ~75px, default max 5 each
        const maxAnime = cfg.last_activity_hide_anime ? 0 : (cfg.last_activity_max ?? 5)
        const maxManga = cfg.last_activity_hide_manga ? 0 : (cfg.last_activity_max ?? 5)
        const n = maxAnime + maxManga
        h += n > 0 ? 33 + n * 75 + Math.max(0, n - 1) * 4 : 0
      } else if (s === 'anime_favorites') {
        const max = cfg.anime_favorites_max ?? 5
        h += favoritesH(max, cfg.anime_favorites_list_style, 278)
      } else if (s === 'manga_favorites') {
        const max = cfg.manga_favorites_max ?? 5
        h += favoritesH(max, cfg.manga_favorites_list_style, 278)
      } else if (s === 'character_favorites') {
        const max = cfg.character_favorites_max ?? 5
        h += favoritesH(max, cfg.character_favorites_list_style, 280)
      } else if (s === 'people_favorites') {
        const max = cfg.people_favorites_max ?? 5
        h += favoritesH(max, cfg.people_favorites_list_style, 280)
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

