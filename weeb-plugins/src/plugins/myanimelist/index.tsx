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
  fetchData: async (config: PluginConfig & MyAnimeListConfig, dev = false, essentialConfig?) => {
    return await fetchMyAnimeListData(config as MyAnimeListConfig, dev) as PluginData & MyAnimeListData
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

