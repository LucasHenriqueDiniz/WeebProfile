/**
 * SVG Generator main types
 */

/**
 * Individual plugin configuration
 * Fully dynamic - supports any plugin
 */
export interface PluginConfig {
  enabled: boolean
  sections: string[]
  username?: string // Some plugins may have username here, others in essentialConfigs
  [key: string]: any // Allows additional plugin-specific properties
}

/**
 * Plugin configuration map
 * Fully dynamic - supports any plugin without hardcoding
 */
export interface PluginConfigMap {
  [pluginName: string]: PluginConfig | undefined
}

export interface SvgConfig {
  style: "default" | "terminal"
  size: "half" | "full"
  plugins: PluginConfigMap
  pluginsOrder?: string[] // Plugin order (dynamic)
  customCss?: string
  terminalTheme?: string
  defaultTheme?: string
  hideTerminalEmojis?: boolean
  hideTerminalHeader?: boolean
  fontFamily?: string
  terminalHeaderText?: string
  primaryColor?: string // Custom primary color
  // "auto": light and dark palettes in one SVG, picked by prefers-color-scheme.
  colorMode?: "auto"
  // Custom theme colors (theme "custom"), already sanitized by the worker.
  customThemeColors?: Record<string, string>
  // Opt-in CSS animations (typing, sections entering, bars filling, numbers counting).
  // Off unless the request says true; see weeb-plugins templates/animations.tsx.
  animations?: boolean
  dev?: boolean // Development mode (uses mock data)
  // Essential configurations (API keys, tokens) per plugin
  // Fully dynamic - supports any plugin
  essentialConfigs?: {
    [pluginName: string]:
      | {
          [key: string]: string | undefined
        }
      | undefined
  }
}

export interface SvgGenerationResult {
  svg: string
  height: number
  width: number
  debug?: {
    config: SvgConfig // Sanitized configuration (no API keys/tokens)
    pluginsData: Record<string, any> // Plugin data used in generation
    pluginsErrors?: Record<string, string> // Errors that occurred (if any)
  }
}
