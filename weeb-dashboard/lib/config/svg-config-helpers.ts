/**
 * Helper functions to read/write terminal configs from ui_config JSONB
 *
 * These configs are now stored in ui_config (separate from plugins_config).
 */

type UiConfig = Record<string, any>

/**
 * Get terminal configs from ui_config
 */
export function getTerminalConfigs(uiConfig: UiConfig | null | undefined): {
  hideTerminalEmojis: boolean
  hideTerminalHeader: boolean
  hideTerminalCommand: boolean
  fontFamily: string
  terminalHeaderText: string
  colorMode: "fixed" | "auto"
} {
  const config = uiConfig || {}
  return {
    hideTerminalEmojis: config.hideTerminalEmojis ?? false,
    hideTerminalHeader: config.hideTerminalHeader ?? false,
    hideTerminalCommand: config.hideTerminalCommand ?? false,
    fontFamily: config.fontFamily ?? "poppins",
    terminalHeaderText: config.terminalHeaderText ?? "",
    colorMode: config.colorMode === "auto" ? "auto" : "fixed",
  }
}

/**
 * Set terminal configs in ui_config
 */
export function setTerminalConfigs(
  uiConfig: UiConfig | null | undefined,
  configs: {
    hideTerminalEmojis?: boolean
    hideTerminalHeader?: boolean
    hideTerminalCommand?: boolean
    fontFamily?: string
    terminalHeaderText?: string
    colorMode?: "fixed" | "auto"
  }
): UiConfig {
  const current = uiConfig || {}
  return {
    ...current,
    ...(configs.hideTerminalEmojis !== undefined && { hideTerminalEmojis: configs.hideTerminalEmojis }),
    ...(configs.hideTerminalHeader !== undefined && { hideTerminalHeader: configs.hideTerminalHeader }),
    ...(configs.hideTerminalCommand !== undefined && { hideTerminalCommand: configs.hideTerminalCommand }),
    ...(configs.fontFamily !== undefined && { fontFamily: configs.fontFamily }),
    ...(configs.terminalHeaderText !== undefined && { terminalHeaderText: configs.terminalHeaderText }),
    // Stored only when on: a card without the key is a fixed one, as every card was.
    ...(configs.colorMode === "auto" && { colorMode: "auto" }),
  }
}

/**
 * Calculate next generation time (24 hours from now)
 */
export function calculateNextGenerationAt(): Date {
  return new Date(Date.now() + 24 * 60 * 60 * 1000)
}
