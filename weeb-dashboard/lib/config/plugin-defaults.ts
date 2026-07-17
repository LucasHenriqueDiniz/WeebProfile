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
  // Hardcoded defaults: all plugins start disabled with no sections
  const enabled = config.enabled ?? userDefaults?.enabled ?? false

  return {
    ...userDefaults,
    ...config,
    // All plugins start disabled by default
    enabled,
    // If disabled, no sections. If enabled, use provided sections or empty array
    sections: enabled ? (config.sections ?? userDefaults?.sections ?? []) : [],
    // Ensure sectionConfigs and fields exist
    sectionConfigs: config.sectionConfigs ?? userDefaults?.sectionConfigs ?? {},
    fields: config.fields ?? userDefaults?.fields ?? {},
  } as PluginConfig
}

/**
 * Obtém default para um campo específico
 * Returns undefined since fieldDefaults/defaultConfig were removed
 * This function is kept for backwards compatibility but always returns undefined
 */
export function getPluginFieldDefault(pluginName: string, fieldName: string): any {
  // fieldDefaults and defaultConfig were removed from metadata
  // This function is kept for backwards compatibility
  return undefined
}
