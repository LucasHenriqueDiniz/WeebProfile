/**
 * Height Calculator for GitHub Plugin
 * 
 * Calculates the estimated height of GitHub sections based on configuration.
 * Returns the height in pixels.
 */

import type { GithubConfig } from './types'
import { SECTION_TITLE_HEIGHT } from '../shared/types/heights'

/**
 * Layout heights for GitHub sections
 */
const LAYOUT_HEIGHTS = {
  language_bar: {
    barHeight: 30, // Barra horizontal
    itemHeight: 25, // Linha de linguagem individual
  },
  repository_item: {
    itemHeight: 80,
    gapBetweenItems: 4, // gap-1 (4px)
  },
}

/**
 * Get max items for a section
 */
function getMaxItems(section: string, config: GithubConfig): number {
  if (section === 'favorite_languages' || section === 'languages') {
    return config.favorite_languages_max_languages ?? 10
  }
  // Repositories não tem max configurável, usa valor fixo
  // Activity não tem max configurável, usa valor fixo
  if (section === 'starred_repositories') {
    return config.starred_repositories_max ?? 10
  }
  if (section === 'gists') {
    return config.gists_max ?? 10
  }
  if (section === 'top_repositories') {
    return config.top_repositories_max ?? 10
  }
  if (section === 'notable_contributions') {
    return config.notable_contributions_max ?? 10
  }
  if (section === 'recent_activity') {
    return config.recent_activity_max ?? 10
  }
  if (section === 'repository_contributors') {
    return config.repository_contributors_max ?? 10
  }
  return 10
}

/**
 * Calculates height for GitHub sections
 */
export function calculateGitHubHeight(
  section: string,
  config: GithubConfig,
  size: 'half' | 'full',
  style: 'default' | 'terminal'
): number {
  const titleHeight = SECTION_TITLE_HEIGHT[style]
  // Verificar se o título está oculto baseado na seção
  const hideTitleKey = `${section}_hide_title` as keyof GithubConfig
  const hideTitle = (config[hideTitleKey] as boolean | undefined) ?? false
  const titleSpace = hideTitle ? 0 : titleHeight

  // Languages (language_bar layout)
  if (section === 'favorite_languages' || section === 'languages') {
    const maxItems = getMaxItems(section, config)
    const layout = LAYOUT_HEIGHTS.language_bar
    const itemsHeight = maxItems * layout.itemHeight
    return titleSpace + layout.barHeight + itemsHeight + 10
  }

  // Repositories (repository_item layout)
  if (section === 'repositories') {
    const maxItems = getMaxItems(section, config)
    const layout = LAYOUT_HEIGHTS.repository_item
    const itemsHeight = maxItems * layout.itemHeight
    const gapHeight = Math.max(0, maxItems - 1) * layout.gapBetweenItems
    return titleSpace + itemsHeight + gapHeight
  }

  // Activity (grid com estatísticas, não lista)
  // Grid 2x2 com estatísticas: ~120px de altura fixa
  if (section === 'activity') {
    const contentHeight = 120 // Grid com estatísticas de atividade
    return titleSpace + contentHeight
  }

  // Profile (altura baseada no componente real)
  // Avatar (50px) + grid com informações (~60px) = ~110px
  // Nota: Profile não tem título DefaultTitle separado, usa header customizado (avatar + nome)
  // O header já está incluído no conteúdo, então não adiciona titleSpace
  if (section === 'profile') {
    const contentHeight = 110 // Avatar + grid de informações (header já incluído)
    return contentHeight // Sem título separado
  }

  // Calendar (altura fixa)
  if (section === 'calendar') {
    const contentHeight = 180
    return titleSpace + contentHeight
  }

  // Starred Repositories (lista de repositórios)
  // Cada item tem 120px de altura + gap-4 (16px) entre itens
  if (section === 'starred_repositories') {
    const maxItems = getMaxItems(section, config)
    const itemHeight = 120 // Altura fixa de cada item
    const gapBetweenItems = 16 // gap-4 (16px)
    const itemsHeight = maxItems * itemHeight
    const gapHeight = Math.max(0, maxItems - 1) * gapBetweenItems
    return titleSpace + itemsHeight + gapHeight
  }

  // Gists (lista de gists)
  // Cada item tem 120px de altura + gap-4 (16px) entre itens
  if (section === 'gists') {
    const maxItems = getMaxItems(section, config)
    const itemHeight = 120 // Altura fixa de cada item
    const gapBetweenItems = 16 // gap-4 (16px)
    const itemsHeight = maxItems * itemHeight
    const gapHeight = Math.max(0, maxItems - 1) * gapBetweenItems
    return titleSpace + itemsHeight + gapHeight
  }

  // Stargazers (card de total + lista de repositórios)
  // Card de total (~80px) + lista de repositórios (~60px cada + gap-3 (12px))
  if (section === 'stargazers') {
    const maxRepos = 10 // Valor fixo (não tem config)
    const cardHeight = 80 // Card com total de stars
    const itemHeight = 60 // Altura de cada repositório
    const gapBetweenItems = 12 // gap-3 (12px)
    const itemsHeight = maxRepos * itemHeight
    const gapHeight = Math.max(0, maxRepos - 1) * gapBetweenItems
    const moreMessageHeight = 20 // Mensagem "+X more"
    return titleSpace + cardHeight + itemsHeight + gapHeight + moreMessageHeight
  }

  // Top Repositories (lista de repositórios)
  // Cada item tem 120px de altura + gap-4 (16px) entre itens
  if (section === 'top_repositories') {
    const maxItems = getMaxItems(section, config)
    const itemHeight = 120 // Altura fixa de cada item
    const gapBetweenItems = 16 // gap-4 (16px)
    const itemsHeight = maxItems * itemHeight
    const gapHeight = Math.max(0, maxItems - 1) * gapBetweenItems
    return titleSpace + itemsHeight + gapHeight
  }

  // Star Lists (listas de repositórios organizados)
  // Cada lista tem: título (~28px) + descrição (~40px se houver, line-clamp-2) + repositórios (~24px cada, até 5) + gaps
  if (section === 'star_lists') {
    const maxLists = config.star_lists_max ?? 5
    const listHeaderHeight = 28 // Título da lista (text-base + mb-2)
    const listDescriptionHeight = 40 // Descrição (line-clamp-2, ~20px por linha)
    const repoItemHeight = 24 // Cada repositório na lista
    const maxReposPerList = 5 // Máximo de repositórios mostrados por lista
    const gapBetweenLists = 16 // gap-4 (16px) entre listas
    const gapBetweenRepos = 8 // gap-2 (8px) entre repositórios
    const listPadding = 24 // padding interno (p-3 = 12px * 2)
    const moreMessageHeight = 16 // Mensagem "+X more"
    
    // Altura de uma lista: padding + título + descrição + repositórios + gaps + mensagem "more"
    const singleListHeight = listPadding + listHeaderHeight + listDescriptionHeight + (maxReposPerList * repoItemHeight) + ((maxReposPerList - 1) * gapBetweenRepos) + moreMessageHeight
    
    const listsHeight = maxLists * singleListHeight
    const gapsHeight = Math.max(0, maxLists - 1) * gapBetweenLists
    
    return titleSpace + listsHeight + gapsHeight
  }

  // Notable Contributions (lista de contribuições)
  // Cada item tem 100px de altura + gap-3 (12px) entre itens
  if (section === 'notable_contributions') {
    const maxItems = getMaxItems(section, config)
    const itemHeight = 100 // Altura fixa de cada item
    const gapBetweenItems = 12 // gap-3 (12px)
    const itemsHeight = maxItems * itemHeight
    const gapHeight = Math.max(0, maxItems - 1) * gapBetweenItems
    return titleSpace + itemsHeight + gapHeight
  }

  // Recent Activity (lista de atividades)
  // Cada item tem ~80px de altura (pode variar com filesChanged) + gap-3 (12px) entre itens
  if (section === 'recent_activity') {
    const maxItems = getMaxItems(section, config)
    const itemHeight = 80 // Altura aproximada de cada item
    const gapBetweenItems = 12 // gap-3 (12px)
    const itemsHeight = maxItems * itemHeight
    const gapHeight = Math.max(0, maxItems - 1) * gapBetweenItems
    return titleSpace + itemsHeight + gapHeight
  }

  // Featured Repositories (lista de repositórios em destaque)
  // Cada item tem ~120px de altura (título + descrição line-clamp-2 + stats) + gap-4 (16px) entre itens
  // A quantidade é baseada nas URLs fornecidas em featured_repositories_urls (separadas por vírgula)
  // Limite máximo de 20 URLs (limitado no fetchGithub)
  // URLs quebradas/inválidas são ignoradas, então a quantidade real pode ser menor
  if (section === 'featured_repositories') {
    // Usar limite de 20 como máximo (baseado no limite de URLs permitidas)
    // A quantidade real será baseada nas URLs fornecidas e repositórios encontrados com sucesso
    const maxItems = 20
    const itemHeight = 120 // Altura fixa de cada item
    const gapBetweenItems = 16 // gap-4 (16px)
    const itemsHeight = maxItems * itemHeight
    const gapHeight = Math.max(0, maxItems - 1) * gapBetweenItems
    return titleSpace + itemsHeight + gapHeight
  }

  // Repository Contributors (grid de contribuidores)
  // Grid 2-3 colunas, cada item tem ~60px de altura + gap-3 (12px)
  if (section === 'repository_contributors') {
    const maxItems = getMaxItems(section, config)
    const itemHeight = 60 // Altura de cada contribuidor (avatar + nome + contribuições)
    const gapBetweenItems = 12 // gap-3 (12px)
    // Grid 2-3 colunas, então altura = ceil(maxItems / 3) * itemHeight
    const rows = Math.ceil(maxItems / 3)
    const itemsHeight = rows * itemHeight
    const gapHeight = Math.max(0, rows - 1) * gapBetweenItems
    return titleSpace + itemsHeight + gapHeight
  }

  // Default fallback
  const defaultHeight = size === 'half' ? 150 : 200
  return titleSpace + defaultHeight
}

