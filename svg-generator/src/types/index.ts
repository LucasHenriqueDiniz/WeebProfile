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
  // Also draw each item of the plugins that have tiles as an SVG of its own
  // (Plugin.tiles in weeb-plugins), for a README that links every item separately.
  tiles?: boolean
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

/** One item of a card as its own SVG, with where it links. */
export interface SvgTile {
  href: string
  title: string
  svg: string
  width: number
  height: number
  /** How the README lays it out (TileLayout in weeb-plugins): "grid" for websites, "inline" for link badges. */
  layout: "grid" | "inline"
}

export interface SvgGenerationResult {
  svg: string
  height: number
  width: number
  /** Present when the config asked for tiles; empty when no plugin draws any. */
  tiles?: SvgTile[]
  debug?: {
    config: SvgConfig // Sanitized configuration (no API keys/tokens)
    pluginsData: Record<string, any> // Plugin data used in generation
    pluginsErrors?: Record<string, string> // Errors that occurred (if any)
  }
}
