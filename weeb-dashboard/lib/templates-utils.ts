import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"

// Mapeamento de pluginId para nome bonito
const PLUGIN_DISPLAY_NAMES: Record<string, string> = {
  github: "GitHub",
  steam: "Steam",
  lastfm: "LastFM",
  myanimelist: "MyAnimeList",
  "16personalities": "16Personalities",
  codeforces: "Codeforces",
  codewars: "Codewars",
  duolingo: "Duolingo",
  stackoverflow: "Stack Overflow",
  lyfta: "Lyfta",
}

// Mapeamento reverso: nome bonito -> pluginId
const DISPLAY_NAME_TO_PLUGIN: Record<string, string> = Object.entries(PLUGIN_DISPLAY_NAMES).reduce(
  (acc, [pluginId, displayName]) => {
    acc[displayName.toLowerCase()] = pluginId
    return acc
  },
  {} as Record<string, string>
)

/**
 * Normaliza uma lista de plataformas para pluginIds consistentes
 */
export function normalizePlatformsToPluginIds(platforms: string[]): string[] {
  return platforms
    .map((platform) => {
      // Se já é um pluginId válido, retorna como está
      try {
        if (PLUGINS_METADATA[platform as keyof typeof PLUGINS_METADATA]) {
          return platform
        }
      } catch {
        // Ignora erro de tipo
      }

      // Tenta mapear de nome bonito para pluginId
      const pluginId = DISPLAY_NAME_TO_PLUGIN[platform.toLowerCase()]
      if (pluginId) {
        try {
          if (PLUGINS_METADATA[pluginId as keyof typeof PLUGINS_METADATA]) {
            return pluginId
          }
        } catch {
          // Ignora erro de tipo
        }
      }

      // Fallback: tenta encontrar pluginId que contenha o nome
      const found = Object.keys(PLUGINS_METADATA).find((id) => {
        try {
          const metadata = PLUGINS_METADATA[id as keyof typeof PLUGINS_METADATA]
          return (
            id.toLowerCase().includes(platform.toLowerCase()) ||
            metadata?.name?.toLowerCase().includes(platform.toLowerCase())
          )
        } catch {
          return false
        }
      })

      return found || platform
    })
    .filter((platform, index, arr) => arr.indexOf(platform) === index) // Remove duplicatas
}

/**
 * Converte pluginIds para nomes bonitos para exibição
 */
export function pluginIdsToDisplayNames(pluginIds: string[]): string[] {
  return pluginIds.map((id) => PLUGIN_DISPLAY_NAMES[id] || id)
}

/**
 * Deriva plataformas de pluginsConfig se disponível
 */
export function derivePlatformsFromPluginsConfig(pluginsConfig?: Record<string, any>): string[] {
  if (!pluginsConfig) return []

  const enabledPlugins = Object.keys(pluginsConfig).filter((key) => {
    const config = pluginsConfig[key]
    return config?.enabled === true || config?.enabled === undefined // Alguns podem não ter enabled definido
  })

  return enabledPlugins.filter((pluginId) => {
    // Verificar se o plugin existe nos metadados
    try {
      return PLUGINS_METADATA[pluginId as keyof typeof PLUGINS_METADATA] !== undefined
    } catch {
      return false
    }
  })
}

/**
 * Garante que um template tenha plataformas consistentes
 */
export function ensureConsistentPlatforms(template: any): string[] {
  // Prioriza pluginsConfig se disponível
  if (template.pluginsConfig) {
    const derived = derivePlatformsFromPluginsConfig(template.pluginsConfig)
    if (derived.length > 0) {
      return derived
    }
  }

  // Fallback para platforms existentes, normalizando
  if (template.platforms && Array.isArray(template.platforms)) {
    return normalizePlatformsToPluginIds(template.platforms)
  }

  return []
}

/**
 * Formata data respeitando locale
 */
export function formatDate(dateString: string, locale: string = "pt-BR"): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return dateString
  }
}
