/**
 * GitHub Plugin V2
 * 
 * Plugin para exibir estatísticas do GitHub
 */

import React from 'react'
import type { Plugin } from '../../weeb-plugins/plugins/shared/types/plugin'
import type { PluginConfig, PluginData } from '../../weeb-plugins/types/index'
import type { EssentialPluginConfig } from '../../weeb-plugins/plugins/shared/types/base'
import type { GithubConfig, GithubData } from './types'
import { RenderGithub } from './components/RenderGithub'
import { fetchGithubData } from './services/fetchGithub'

export const githubPlugin: Plugin<PluginConfig & GithubConfig, PluginData & GithubData> = {
  name: 'github',
  essentialConfigKeys: ['pat'], // Uses Classic Token instead of OAuth token
  config: {
    enabled: false,
    sections: [],
    username: '',
  } as PluginConfig & GithubConfig,
  fetchData: async (config: PluginConfig & GithubConfig, dev = false, essentialConfig?: EssentialPluginConfig) => {
    // Classic Token must be configured by user
    // In dev mode, token not needed (uses mock)
    const pat = essentialConfig?.pat
    if (!dev && !pat) {
      throw new Error('GitHub Classic Token is required. Please configure it in your profile settings.')
    }
    return await fetchGithubData(config as GithubConfig, dev, pat) as PluginData & GithubData
  },
  render: (config: PluginConfig & GithubConfig, data: PluginData & GithubData) => {
    // Extrair style e size do config (vem do SvgConfig)
    const style = ((config as any).style || 'default') as 'default' | 'terminal'
    const size = ((config as any).size || 'half') as 'half' | 'full'
    return (
      <RenderGithub
        config={config as GithubConfig}
        data={data as GithubData}
        style={style}
        size={size}
      />
    )
  },
}

export default githubPlugin

