/**
 * Carregador de Configuração
 *
 * Converte configuração do Supabase/weeb-dashboard para formato interno
 */

import type { SvgConfig } from "../types/index.js"

/**
 * Validates basic configuration
 */
export function validateConfig(config: Partial<SvgConfig>): config is SvgConfig {
  if (!config.style || !["default", "terminal"].includes(config.style)) {
    return false
  }

  if (!config.size || !["half", "full"].includes(config.size)) {
    return false
  }

  if (!config.plugins) {
    return false
  }

  // Check if there's at least one enabled plugin with sections
  const hasEnabledPlugin = Object.values(config.plugins).some(
    (plugin) =>
      plugin?.enabled === true && plugin.sections && Array.isArray(plugin.sections) && plugin.sections.length > 0
  )

  if (!hasEnabledPlugin) {
    return false
  }

  return true
}

/**
 * Normalizes configuration (applies defaults)
 */
export function normalizeConfig(config: Partial<SvgConfig>): SvgConfig {
  return {
    style: config.style || "default",
    size: config.size || "half",
    plugins: config.plugins || {},
    pluginsOrder: config.pluginsOrder,
    customCss: config.customCss,
    terminalTheme: config.terminalTheme || "default",
    defaultTheme: config.defaultTheme || "default",
    hideTerminalEmojis: config.hideTerminalEmojis || false,
    hideTerminalHeader: config.hideTerminalHeader || false,
    primaryColor: config.primaryColor || "#ff7a00",
    dev: config.dev ?? false,
  }
}
