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
  animations: boolean
} {
  const config = uiConfig || {}
  return {
    hideTerminalEmojis: config.hideTerminalEmojis ?? false,
    hideTerminalHeader: config.hideTerminalHeader ?? false,
    hideTerminalCommand: config.hideTerminalCommand ?? false,
    fontFamily: config.fontFamily ?? "poppins",
    terminalHeaderText: config.terminalHeaderText ?? "",
    colorMode: config.colorMode === "auto" ? "auto" : "fixed",
    animations: config.animations === true,
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
    animations?: boolean
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
    ...(configs.animations !== undefined && { animations: configs.animations }),
  }
}

/** The style settings both wizards keep in ui_config (theme and style are columns). */
export interface StyleUiConfig {
  hideTerminalEmojis: boolean
  hideTerminalHeader: boolean
  hideTerminalCommand: boolean
  fontFamily: string
  terminalHeaderText: string
  colorMode: "fixed" | "auto"
  animations: boolean
  customThemeColors: Record<string, string>
}

/**
 * The ui_config a wizard saves. The save replaces the stored ui_config whole, so
 * anything the editor did not load first is gone after it saves.
 */
export function buildStyleUiConfig(theme: string, style: StyleUiConfig): UiConfig {
  const uiConfig = setTerminalConfigs(
    {},
    {
      hideTerminalEmojis: style.hideTerminalEmojis,
      hideTerminalHeader: style.hideTerminalHeader,
      hideTerminalCommand: style.hideTerminalCommand,
      fontFamily: style.fontFamily,
      terminalHeaderText: style.terminalHeaderText.trim() || undefined,
      colorMode: style.colorMode,
      animations: style.animations,
    }
  )
  if (theme === "custom" && Object.keys(style.customThemeColors).length > 0) {
    uiConfig.customThemeColors = style.customThemeColors
  }
  return uiConfig
}

/**
 * What an editor loads back from a saved ui_config: everything buildStyleUiConfig
 * writes. The profile editor used to skip customThemeColors and the repository editor
 * read none of it, so saving an edit wiped them from D1.
 */
export function readStyleUiConfig(uiConfig: UiConfig | null | undefined): StyleUiConfig {
  const stored = uiConfig?.customThemeColors
  const customThemeColors: Record<string, string> = {}
  if (stored && typeof stored === "object" && !Array.isArray(stored)) {
    for (const [variable, color] of Object.entries(stored)) {
      if (typeof color === "string") customThemeColors[variable] = color
    }
  }
  return { ...getTerminalConfigs(uiConfig), customThemeColors }
}

/**
 * Calculate next generation time (24 hours from now)
 */
export function calculateNextGenerationAt(): Date {
  return new Date(Date.now() + 24 * 60 * 60 * 1000)
}
