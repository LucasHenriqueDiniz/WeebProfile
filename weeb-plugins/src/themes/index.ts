/**
 * Theme utilities - Simplified CSS Variables
 */

export {
  buildAutoThemeCss,
  getDefaultThemeVariables,
  getTerminalThemeVariables,
  getThemeVariantVariables,
  isAutoColorMode,
  sanitizeCustomThemeColors,
} from "./theme-utils"
export type { ColorMode, ColorVariant } from "./theme-utils"
export type { DefaultTheme, TerminalTheme } from "./types"
export { defaultDarkThemes, defaultThemes, terminalLightThemes, terminalThemes } from "./themes"
export type { ThemeVariables, TerminalThemeVariables } from "./themes"
export {
  DEFAULT_THEME_VARIABLES,
  DEFAULT_THEME_VARIABLE_LABELS,
  DEFAULT_THEME_VARIABLE_DESCRIPTIONS,
} from "./default-theme-variables"
export type { DefaultThemeVariable } from "./default-theme-variables"
