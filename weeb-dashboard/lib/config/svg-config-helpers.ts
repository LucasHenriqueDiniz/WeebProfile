/**
 * Helper functions to read/write terminal configs from pluginsConfig JSONB
 * 
 * These configs were moved from individual columns to pluginsConfig for better DB efficiency.
 */

type PluginsConfig = Record<string, any>

/**
 * Get terminal configs from pluginsConfig
 */
export function getTerminalConfigs(pluginsConfig: PluginsConfig | null | undefined): {
  hideTerminalEmojis: boolean
  hideTerminalHeader: boolean
  hideTerminalCommand: boolean
} {
  const config = pluginsConfig || {}
  return {
    hideTerminalEmojis: config.hideTerminalEmojis ?? false,
    hideTerminalHeader: config.hideTerminalHeader ?? false,
    hideTerminalCommand: config.hideTerminalCommand ?? false,
  }
}

/**
 * Set terminal configs in pluginsConfig
 */
export function setTerminalConfigs(
  pluginsConfig: PluginsConfig | null | undefined,
  configs: {
    hideTerminalEmojis?: boolean
    hideTerminalHeader?: boolean
    hideTerminalCommand?: boolean
  }
): PluginsConfig {
  const current = pluginsConfig || {}
  return {
    ...current,
    ...(configs.hideTerminalEmojis !== undefined && { hideTerminalEmojis: configs.hideTerminalEmojis }),
    ...(configs.hideTerminalHeader !== undefined && { hideTerminalHeader: configs.hideTerminalHeader }),
    ...(configs.hideTerminalCommand !== undefined && { hideTerminalCommand: configs.hideTerminalCommand }),
  }
}

/**
 * Calculate next generation time (24 hours from now)
 */
export function calculateNextGenerationAt(): Date {
  return new Date(Date.now() + 24 * 60 * 60 * 1000)
}
