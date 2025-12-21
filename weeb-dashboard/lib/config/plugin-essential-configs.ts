/**
 * Helper para gerenciar essentialConfigKeys dos plugins
 * 
 * Usa PLUGINS_METADATA como fonte da verdade
 * Funciona automaticamente com qualquer plugin novo adicionado
 */

import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"

/**
 * Tipo para metadata de uma essential config key
 * Definido localmente para ser genérico e funcionar com qualquer plugin
 */
export interface EssentialConfigKey {
  key: string
  label: string
  type: "text" | "password" | "oauth"
  placeholder?: string
  description?: string
  helpUrl?: string
  docKey?: string
  oauthProvider?: "spotify" // Provider OAuth quando type === "oauth"
}

export interface PluginEssentialConfig {
  pluginName: string
  keys: EssentialConfigKey[]
}

/**
 * Obtém os essentialConfigKeys de um plugin específico da metadata
 * Funciona automaticamente com qualquer plugin novo adicionado
 */
export function getPluginEssentialConfigKeys(pluginName: string): EssentialConfigKey[] {
  // Acessa o metadata de forma genérica para funcionar com qualquer plugin
  // Usa Record<string, any> para ser compatível com qualquer plugin novo
  const metadata = (PLUGINS_METADATA as Record<string, any>)[pluginName]
  if (!metadata) return []
  
  // Acessa essentialConfigKeysMetadata de forma segura
  const essentialConfigKeysMetadata = metadata.essentialConfigKeysMetadata as EssentialConfigKey[] | undefined
  return essentialConfigKeysMetadata || []
}

/**
 * @deprecated Use getPluginEssentialConfigKeys() ao invés disso
 * Mantido apenas para compatibilidade retroativa
 */
export const PLUGIN_ESSENTIAL_CONFIGS: Record<string, EssentialConfigKey[]> = new Proxy(
  {} as Record<string, EssentialConfigKey[]>,
  {
    get(_target, prop: string) {
      return getPluginEssentialConfigKeys(prop)
    },
  }
)

/**
 * Verifica quais essentialConfigKeys estão faltando para os plugins habilitados
 * 
 * @param enabledPlugins - Lista de nomes de plugins habilitados
 * @param essentialConfigs - Objeto com as configurações essenciais do perfil
 * @returns Array com informações sobre quais configs estão faltando
 */
export function getMissingEssentialConfigs(
  enabledPlugins: string[],
  essentialConfigs: Record<string, Record<string, boolean | string | undefined> | undefined> = {}
): Array<{ pluginName: string; missingKeys: EssentialConfigKey[] }> {
  const missing: Array<{ pluginName: string; missingKeys: EssentialConfigKey[] }> = []

  enabledPlugins.forEach((pluginName) => {
    const pluginConfig = getPluginEssentialConfigKeys(pluginName)
    if (pluginConfig.length === 0) {
      // Plugin não tem essentialConfigKeys definidos, pular
      return
    }

    const pluginEssentialConfigs = essentialConfigs[pluginName] || {}
    const missingKeys = pluginConfig.filter(
      (keyDef) => {
        const value = pluginEssentialConfigs[keyDef.key]
        // Se for boolean, verifica se é true. Se for string (legado), verifica se não está vazio
        if (typeof value === 'boolean') {
          return !value
        }
        return !value || (typeof value === 'string' && value.trim() === '')
      }
    )

    if (missingKeys.length > 0) {
      missing.push({
        pluginName,
        missingKeys,
      })
    }
  })

  return missing
}

/**
 * Verifica se um plugin específico tem todas as essentialConfigKeys configuradas
 */
export function hasAllEssentialConfigs(
  pluginName: string,
  essentialConfigs: Record<string, Record<string, boolean | string | undefined> | undefined> = {}
): boolean {
  const pluginConfig = getPluginEssentialConfigKeys(pluginName)
  if (pluginConfig.length === 0) {
    return true // Se não tem configs definidos, considera como OK
  }

  const pluginEssentialConfigs = essentialConfigs[pluginName] || {}
  return pluginConfig.every(
    (keyDef) => {
      const value = pluginEssentialConfigs[keyDef.key]
      // Se for boolean, verifica se é true. Se for string (legado), verifica se não está vazio
      if (typeof value === 'boolean') {
        return value === true
      }
      return value && typeof value === 'string' && value.trim() !== ''
    }
  )
}
























