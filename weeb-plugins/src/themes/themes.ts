/**
 * Theme Definitions - CSS Variables Only
 *
 * All themes are defined as CSS variable values.
 * The default theme is the base, and other themes override specific variables.
 */

export interface ThemeVariables extends Record<string, string> {
  // Default style variables
  "--default-color-surface": string
  "--default-color-background": string
  "--default-color-default": string
  "--default-color-success": string
  "--default-color-muted": string
  "--default-color-muted-light": string
  "--default-color-raw": string
  "--default-color-highlight": string
}

export interface TerminalThemeVariables extends Record<string, string> {
  // Terminal style variables
  "--terminal-color-surface": string
  "--terminal-color-background": string
  "--terminal-color-highlight": string
  "--terminal-color-default": string
  "--terminal-color-success": string
  "--terminal-color-muted": string
  "--terminal-color-muted-light": string
  "--terminal-color-raw": string
  // Keys of key/value lines (`.text-terminal-warning`)
  "--terminal-color-warning": string
}

/**
 * Default themes - only highlight color changes
 * All other variables stay the same as default
 */
export const defaultThemes: Record<string, ThemeVariables> = {
  default: {
    "--default-color-surface": "#ffffff",
    "--default-color-background": "#ffffff",
    "--default-color-default": "#9fa9b5",
    "--default-color-success": "#2da44e",
    "--default-color-muted": "#6e7781",
    "--default-color-muted-light": "#8c959f",
    "--default-color-raw": "#9fa9b5",
    "--default-color-highlight": "#FF7A3D",
  },

  purple: {
    "--default-color-surface": "#f7f2ff",
    "--default-color-background": "#f2e9ff",
    "--default-color-default": "#9fa9b5",
    "--default-color-success": "#2da44e",
    "--default-color-muted": "#6e7781",
    "--default-color-muted-light": "#8c959f",
    "--default-color-raw": "#9fa9b5",
    "--default-color-highlight": "#8957E5",
  },

  pink: {
    "--default-color-surface": "#fff0f7",
    "--default-color-background": "#ffe4f0",
    "--default-color-default": "#9fa9b5",
    "--default-color-success": "#2da44e",
    "--default-color-muted": "#6e7781",
    "--default-color-muted-light": "#8c959f",
    "--default-color-raw": "#9fa9b5",
    "--default-color-highlight": "#E5579A",
  },

  cyan: {
    "--default-color-surface": "#ecfeff",
    "--default-color-background": "#e0fbff",
    "--default-color-default": "#9fa9b5",
    "--default-color-success": "#2da44e",
    "--default-color-muted": "#6e7781",
    "--default-color-muted-light": "#8c959f",
    "--default-color-raw": "#9fa9b5",
    "--default-color-highlight": "#06b6d4",
  },

  orange: {
    "--default-color-surface": "#fff7ed",
    "--default-color-background": "#ffedd5",
    "--default-color-default": "#9fa9b5",
    "--default-color-success": "#2da44e",
    "--default-color-muted": "#6e7781",
    "--default-color-muted-light": "#8c959f",
    "--default-color-raw": "#9fa9b5",
    "--default-color-highlight": "#f97316",
  },

  blue: {
    "--default-color-surface": "#eff6ff",
    "--default-color-background": "#dbeafe",
    "--default-color-default": "#9fa9b5",
    "--default-color-success": "#2da44e",
    "--default-color-muted": "#6e7781",
    "--default-color-muted-light": "#8c959f",
    "--default-color-raw": "#9fa9b5",
    "--default-color-highlight": "#3b82f6",
  },

  green: {
    "--default-color-surface": "#ecfdf5",
    "--default-color-background": "#d1fae5",
    "--default-color-default": "#9fa9b5",
    "--default-color-success": "#2da44e",
    "--default-color-muted": "#6e7781",
    "--default-color-muted-light": "#8c959f",
    "--default-color-raw": "#9fa9b5",
    "--default-color-highlight": "#10b981",
  },

  red: {
    "--default-color-surface": "#fef2f2",
    "--default-color-background": "#fee2e2",
    "--default-color-default": "#9fa9b5",
    "--default-color-success": "#2da44e",
    "--default-color-muted": "#6e7781",
    "--default-color-muted-light": "#8c959f",
    "--default-color-raw": "#9fa9b5",
    "--default-color-highlight": "#ef4444",
  },
}

/**
 * Terminal themes
 */
export const terminalThemes: Record<string, TerminalThemeVariables> = {
  default: {
    "--terminal-color-surface": "#161b22",
    "--terminal-color-background": "#0d1117",
    "--terminal-color-highlight": "#58a6ff",
    "--terminal-color-default": "#c9d1d9",
    "--terminal-color-success": "#3fb950",
    "--terminal-color-muted": "#8b949e",
    "--terminal-color-muted-light": "#6e7681",
    "--terminal-color-raw": "#c9d1d9",
    "--terminal-color-warning": "#ffaa00",
  },
  dracula: {
    "--terminal-color-surface": "#282a36",
    "--terminal-color-background": "#1e1f29",
    "--terminal-color-highlight": "#bd93f9",
    "--terminal-color-default": "#f8f8f2",
    "--terminal-color-success": "#50fa7b",
    "--terminal-color-muted": "#6272a4",
    "--terminal-color-muted-light": "#8be9fd",
    "--terminal-color-raw": "#f8f8f2",
    "--terminal-color-warning": "#ffaa00",
  },
  monokai: {
    "--terminal-color-surface": "#272822",
    "--terminal-color-background": "#1e1e1e",
    "--terminal-color-highlight": "#a6e22e",
    "--terminal-color-default": "#f8f8f2",
    "--terminal-color-success": "#a6e22e",
    "--terminal-color-muted": "#75715e",
    "--terminal-color-muted-light": "#e6db74",
    "--terminal-color-raw": "#f8f8f2",
    "--terminal-color-warning": "#ffaa00",
  },
}

/**
 * Dark counterparts of the default themes, used by the "auto" color mode.
 *
 * The default style is light, so in auto mode these apply inside
 * `@media (prefers-color-scheme: dark)`. Surfaces are GitHub's dark canvas
 * (#0d1117 / #161b22) tinted with the theme's accent, the way the light themes tint
 * white. Accents that fell under 4.5:1 on that canvas are swapped for a lighter
 * shade of the same hue.
 */
const darkNeutrals = {
  "--default-color-default": "#9fa9b5",
  "--default-color-success": "#3fb950",
  "--default-color-muted": "#8b949e",
  "--default-color-muted-light": "#6e7681",
  "--default-color-raw": "#9fa9b5",
}

export const defaultDarkThemes: Record<string, ThemeVariables> = {
  default: {
    "--default-color-surface": "#161b22",
    "--default-color-background": "#0d1117",
    ...darkNeutrals,
    "--default-color-highlight": "#FF7A3D",
  },
  purple: {
    "--default-color-surface": "#212233",
    "--default-color-background": "#151622",
    ...darkNeutrals,
    "--default-color-highlight": "#a371f7",
  },
  pink: {
    "--default-color-surface": "#28222e",
    "--default-color-background": "#19161f",
    ...darkNeutrals,
    "--default-color-highlight": "#f778ba",
  },
  cyan: {
    "--default-color-surface": "#172a32",
    "--default-color-background": "#0e1b22",
    ...darkNeutrals,
    "--default-color-highlight": "#22d3ee",
  },
  orange: {
    "--default-color-surface": "#282524",
    "--default-color-background": "#191719",
    ...darkNeutrals,
    "--default-color-highlight": "#fb923c",
  },
  blue: {
    "--default-color-surface": "#1b2634",
    "--default-color-background": "#111823",
    ...darkNeutrals,
    "--default-color-highlight": "#58a6ff",
  },
  green: {
    "--default-color-surface": "#182a2c",
    "--default-color-background": "#0f1b1e",
    ...darkNeutrals,
    "--default-color-highlight": "#34d399",
  },
  red: {
    "--default-color-surface": "#282228",
    "--default-color-background": "#19161c",
    ...darkNeutrals,
    "--default-color-highlight": "#f87171",
  },
}

/**
 * Light counterparts of the terminal themes, used by the "auto" color mode.
 *
 * The terminal style is dark, so in auto mode these are the base palette and the
 * theme's own (dark) values apply inside `@media (prefers-color-scheme: dark)`.
 */
export const terminalLightThemes: Record<string, TerminalThemeVariables> = {
  default: {
    "--terminal-color-surface": "#f6f8fa",
    "--terminal-color-background": "#ffffff",
    "--terminal-color-highlight": "#0969da",
    "--terminal-color-default": "#1f2328",
    "--terminal-color-success": "#1a7f37",
    "--terminal-color-muted": "#59636e",
    "--terminal-color-muted-light": "#818b98",
    "--terminal-color-raw": "#1f2328",
    "--terminal-color-warning": "#9a6700",
  },
  dracula: {
    "--terminal-color-surface": "#f5f0d8",
    "--terminal-color-background": "#fffbeb",
    "--terminal-color-highlight": "#644ac9",
    "--terminal-color-default": "#1f1f1f",
    "--terminal-color-success": "#14710a",
    "--terminal-color-muted": "#635d97",
    "--terminal-color-muted-light": "#036a96",
    "--terminal-color-raw": "#1f1f1f",
    "--terminal-color-warning": "#a34d14",
  },
  monokai: {
    "--terminal-color-surface": "#efefea",
    "--terminal-color-background": "#fafafa",
    "--terminal-color-highlight": "#4d7c0f",
    "--terminal-color-default": "#272822",
    "--terminal-color-success": "#4d7c0f",
    "--terminal-color-muted": "#75715e",
    "--terminal-color-muted-light": "#8a6d00",
    "--terminal-color-raw": "#272822",
    "--terminal-color-warning": "#b45309",
  },
}
