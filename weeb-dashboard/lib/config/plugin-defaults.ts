/**
 * Helper functions para aplicar defaults de plugins
 */

import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import type { PluginConfig } from "@/stores/wizard-store"

/**
 * Aplica defaults de um plugin na configuração
 * Funciona automaticamente com qualquer plugin novo adicionado
 */
export function applyPluginDefaults(
  pluginName: string,
  config: Partial<PluginConfig> = {},
  userDefaults?: Record<string, any>
): PluginConfig {
  // Acessa o metadata de forma genérica para funcionar com qualquer plugin
  // Usa Record<string, any> para ser compatível com qualquer plugin novo
  const metadata = (PLUGINS_METADATA as Record<string, any>)[pluginName]
  if (!metadata) {
    return {
      enabled: false,
      sections: [],
      ...config,
    } as PluginConfig
  }

  const defaultConfig = metadata.defaultConfig || {}

  // Mesclar defaults na ordem: metadata defaults -> user defaults -> config fornecido
  const enabled = config.enabled ?? userDefaults?.enabled ?? defaultConfig.enabled ?? false
  
  return {
    ...defaultConfig,
    ...userDefaults,
    ...config,
    // Garantir que enabled e sections tenham valores padrão se não foram fornecidos
    // Se plugin está desligado, não deve ter sections
    enabled,
    sections: enabled 
      ? (config.sections ?? userDefaults?.sections ?? defaultConfig.sections ?? [])
      : [],
    // Garantir que sectionConfigs e fields existam
    sectionConfigs: config.sectionConfigs ?? userDefaults?.sectionConfigs ?? defaultConfig.sectionConfigs ?? {},
    fields: config.fields ?? userDefaults?.fields ?? defaultConfig.fields ?? {},
  } as PluginConfig
}

/**
 * Obtém default para um campo específico
 * Funciona automaticamente com qualquer plugin novo adicionado
 */
export function getPluginFieldDefault(pluginName: string, fieldName: string): any {
  // Acessa o metadata de forma genérica para funcionar com qualquer plugin
  // Usa Record<string, any> para ser compatível com qualquer plugin novo
  const metadata = (PLUGINS_METADATA as Record<string, any>)[pluginName]
  if (!metadata) return undefined

  // Acessa fieldDefaults e defaultConfig de forma segura
  // fieldDefaults é opcional e pode não existir em todos os plugins
  const fieldDefaults = metadata.fieldDefaults as Record<string, any> | undefined
  const defaultConfig = metadata.defaultConfig as Record<string, any> | undefined
  
  return fieldDefaults?.[fieldName] || defaultConfig?.[fieldName]
}








































