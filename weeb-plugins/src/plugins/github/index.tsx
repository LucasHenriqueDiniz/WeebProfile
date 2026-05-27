/**
 * GitHub Plugin V2
 * 
 * Plugin para exibir estatísticas do GitHub
 */

import React from 'react'
import type { Plugin } from '../shared/types/plugin'
import type { PluginConfig, PluginData } from '../../types/index'
import type { EssentialPluginConfig } from '../shared/types/base'
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
  calculateHeight: (config, data) => {
    const cfg = config as GithubConfig
    const gh = data as GithubData
    // Height formula for repo-card-style sections: each card is h-[120px], gap-4 (16px)
    const repoCardH = (n: number, hasPager: boolean): number =>
      n > 0 ? 33 + n * 120 + Math.max(0, n - 1) * 16 + (hasPager ? 32 : 0) : 0

    let h = 0
    for (const s of cfg.sections) {
      switch (s) {
        case 'profile': h += 119; break
        case 'repositories': h += 127; break
        case 'activity': h += 151; break
        case 'calendar': {
          const yearMode = cfg.calendar_year_mode ?? 'current_year'
          const years = gh.calendar?.years?.length ?? 1
          h += yearMode === 'full' && years > 1 ? years * 200 : 161
          break
        }
        case 'code_habits': h += 563; break
        case 'favorite_languages': {
          const maxLangs = cfg.favorite_languages_max_languages ?? 5
          const n = Math.min(gh.languages?.length ?? maxLangs, maxLangs)
          // ~58px per language row (empirically from preview 325px / 5 items)
          h += 33 + 10 + n * 58 + Math.max(0, n - 1) * 4
          break
        }
        case 'favorite_license': h += 83; break
        case 'introduction': h += 123; break
        case 'stargazers': h += 403; break
        case 'people': h += 131; break
        case 'starred_repositories': {
          const max = cfg.starred_repositories_max ?? 10
          const n = Math.min(gh.starredRepositories?.nodes?.length ?? max, max)
          const hasPager = (gh.starredRepositories?.totalCount ?? 0) > n
          h += repoCardH(n, hasPager)
          break
        }
        case 'gists': {
          const max = cfg.gists_max ?? 5
          const n = Math.min(gh.gists?.nodes?.length ?? max, max)
          const hasPager = (gh.gists?.totalCount ?? 0) > n
          h += repoCardH(n, hasPager)
          break
        }
        case 'top_repositories': {
          const max = cfg.top_repositories_max ?? 5
          const n = Math.min(gh.topRepositories?.length ?? max, max)
          h += repoCardH(n, false)
          break
        }
        case 'featured_repositories': {
          const max = cfg.featured_repositories_max ?? 5
          const n = Math.min(gh.featuredRepositories?.length ?? max, max)
          h += repoCardH(n, false)
          break
        }
        case 'recent_activity': {
          // Items grouped by day, each activity ~85px, preview shows 883px for ~10 items
          const max = cfg.recent_activity_max ?? 10
          const n = Math.min(gh.recentActivity?.length ?? max, max)
          h += n > 0 ? 33 + n * 85 + Math.max(0, n - 1) * 4 : 0
          break
        }
        case 'notable_contributions': {
          // Each contribution item ~110px, preview 1143px for ~10 items
          const max = cfg.notable_contributions_max ?? 10
          const n = Math.min(gh.notableContributions?.length ?? max, max)
          h += n > 0 ? 33 + n * 110 + Math.max(0, n - 1) * 4 : 0
          break
        }
        case 'repository_contributors': {
          const max = cfg.repository_contributors_max ?? 5
          const n = Math.min(gh.repositoryContributors?.length ?? max, max)
          h += n > 0 ? 33 + 12 + n * 50 + Math.max(0, n - 1) * 4 : 0
          break
        }
        case 'sponsors': {
          const max = cfg.sponsors_max ?? 5
          const n = Math.min(gh.sponsors?.nodes?.length ?? max, max)
          // Each sponsor ~40px, preview 243px for ~5 items
          h += n > 0 ? 33 + n * 40 + Math.max(0, n - 1) * 8 : 0
          break
        }
        case 'sponsorships': {
          const max = cfg.sponsorships_max ?? 5
          const n = Math.min(gh.sponsorships?.nodes?.length ?? max, max)
          h += n > 0 ? 33 + n * 40 + Math.max(0, n - 1) * 8 : 0
          break
        }
        case 'star_lists': h += 351; break
        default: break
      }
    }

    if (gh.warnings && gh.warnings.length > 0) h += 40

    return h
  },
}

export default githubPlugin

