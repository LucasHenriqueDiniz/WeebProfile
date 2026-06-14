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
  calculateHeight: (config, data, size = 'half') => {
    const cfg = config as GithubConfig
    const gh = data as GithubData
    const isTerminal = (config as { style?: string }).style === 'terminal'

    // Height formula for repo-card-style sections: each card is h-[120px], gap-4 (16px)
    const repoCardH = (n: number, hasPager: boolean): number =>
      n > 0 ? 40 + n * 120 + Math.max(0, n - 1) * 16 + (hasPager ? 32 : 0) : 0

    // Terminal "table" sections: TerminalCommand + TerminalGrid header + n rows (+ "+N more" footer)
    const terminalGridH = (n: number, hasMore: boolean): number =>
      n > 0 ? 84 + n * 20 + (hasMore ? 28 : 0) : 0

    let h = 0
    for (const s of cfg.sections) {
      switch (s) {
        case 'profile': h += isTerminal ? 164 : (size === 'full' ? 127 : 119); break
        case 'repositories': h += isTerminal ? 244 : 132; break
        case 'activity': h += isTerminal ? 264 : 156; break
        case 'calendar': {
          const yearMode = cfg.calendar_year_mode ?? 'current_year'
          const years = gh.calendar?.years?.length ?? 1
          if (years > 1) {
            h += isTerminal ? 33 + years * 175 + 28 : 33 + years * 150 + 28
          } else if (isTerminal) {
            h += 33 + 175
          } else {
            // half mode splits the calendar into two rows of weeks
            const rows = size === 'half' && yearMode !== 'last_6_months' ? 2 : 1
            h += 33 + rows * 135 + 28
          }
          break
        }
        case 'code_habits': {
          if (isTerminal) {
            h += 1010
          } else {
            h += size === 'half' ? 590 : 563
          }
          break
        }
        case 'favorite_languages': {
          const maxLangs = cfg.favorite_languages_max_languages ?? 5
          const n = Math.min(gh.languages?.length ?? maxLangs, maxLangs)
          // ~54px per language row (preview 325px for 5 items: (325-43)/5 = 56.4, rounded up)
          h += 33 + 11 + n * 54 + Math.max(0, n - 1) * 4
          break
        }
        case 'favorite_license': h += isTerminal ? 150 : 88; break
        case 'introduction': {
          if (!gh.introduction) break
          if (isTerminal) {
            h += 210
          } else {
            h += size === 'full' ? 100 : 130
          }
          break
        }
        case 'stargazers': {
          const total = gh.stargazers?.repositories?.length ?? 0
          if (total === 0) break
          const n = Math.min(total, 10)
          const hasMore = total > 10
          if (isTerminal) {
            h += terminalGridH(n + 1, hasMore)
          } else {
            h += 109 + n * 80 + Math.max(0, n - 1) * 16 + (hasMore ? 28 : 0)
          }
          break
        }
        case 'people': {
          const max = cfg.people_max ?? 10
          const total = gh.people?.totalCount ?? 0
          const n = Math.min(gh.people?.nodes?.length ?? max, max)
          if (n === 0) break
          if (isTerminal) {
            h += terminalGridH(n, false)
          } else {
            const itemsPerRow = size === 'full' ? 17 : 8
            const rows = Math.max(1, Math.ceil(n / itemsPerRow))
            h += 33 + rows * 48 + (total > n ? 20 : 0)
          }
          break
        }
        case 'starred_repositories': {
          const max = cfg.starred_repositories_max ?? 10
          const n = Math.min(gh.starredRepositories?.nodes?.length ?? max, max)
          const hasPager = (gh.starredRepositories?.totalCount ?? 0) > n
          h += isTerminal ? terminalGridH(n, hasPager) : repoCardH(n, hasPager)
          break
        }
        case 'gists': {
          const max = cfg.gists_max ?? 5
          const n = Math.min(gh.gists?.nodes?.length ?? max, max)
          const hasPager = (gh.gists?.totalCount ?? 0) > n
          h += isTerminal ? terminalGridH(n, hasPager) : repoCardH(n, hasPager)
          break
        }
        case 'top_repositories': {
          const max = cfg.top_repositories_max ?? 5
          const total = gh.topRepositories?.length ?? 0
          const n = Math.min(total, max)
          const hasMore = total > max
          h += isTerminal ? terminalGridH(n, hasMore) : repoCardH(n, false)
          break
        }
        case 'featured_repositories': {
          // Default renders ALL items (no max applied), grid-style cards
          const n = Math.min(gh.featuredRepositories?.length ?? 0, 20)
          if (n === 0) break
          h += isTerminal ? terminalGridH(n, false) : 33 + n * 123 + Math.max(0, n - 1) * 16
          break
        }
        case 'recent_activity': {
          // Items grouped by day, each activity ~85-141px depending on type (files changed stats line)
          const max = cfg.recent_activity_max ?? 10
          const n = Math.min(gh.recentActivity?.length ?? max, max)
          if (n === 0) break
          h += isTerminal ? 20 + n * 28 : 33 + n * 124 + Math.max(0, n - 1) * 16
          break
        }
        case 'notable_contributions': {
          // h-[100px] fixed per item, gap-3 (12px); preview 1143px for 10 items
          const max = cfg.notable_contributions_max ?? 10
          const n = Math.min(gh.notableContributions?.length ?? max, max)
          if (n === 0) break
          h += isTerminal ? terminalGridH(n, false) : 40 + n * 100 + Math.max(0, n - 1) * 12
          break
        }
        case 'repository_contributors': {
          // grid-cols-2 (half) / grid-cols-3 (full), card ~97px (half) / ~120px (full), gap-3 (12px)
          const max = cfg.repository_contributors_max ?? 10
          const n = Math.min(gh.repositoryContributors?.length ?? max, max)
          if (n === 0) break
          if (isTerminal) {
            h += terminalGridH(n, false)
          } else {
            const cols = size === 'full' ? 3 : 2
            const rows = Math.ceil(n / cols)
            h += 33 + rows * 54 + Math.max(0, rows - 1) * 12
          }
          break
        }
        case 'sponsors': {
          const max = cfg.sponsors_max ?? 5
          const n = Math.min(gh.sponsors?.nodes?.length ?? max, max)
          if (isTerminal) {
            h += n === 0 ? 48 : terminalGridH(n, false)
          } else {
            h += n > 0 ? 37 + n * 65 + Math.max(0, n - 1) * 8 : 0
          }
          break
        }
        case 'sponsorships': {
          const max = cfg.sponsorships_max ?? 5
          const n = Math.min(gh.sponsorships?.nodes?.length ?? max, max)
          if (isTerminal) {
            h += n === 0 ? 48 : terminalGridH(n, false)
          } else {
            h += n > 0 ? 37 + n * 65 + Math.max(0, n - 1) * 8 : 0
          }
          break
        }
        case 'star_lists': {
          const max = cfg.star_lists_max ?? 5
          const n = Math.min(gh.starLists?.length ?? max, max)
          if (n === 0) break
          h += isTerminal ? terminalGridH(n, false) : 356
          break
        }
        default: break
      }
    }

    if (gh.warnings && gh.warnings.length > 0) h += 40

    return h
  },
}

export default githubPlugin

