import { DefaultTheme, defaultThemes } from "./default-themes"
import { terminalThemes, TerminalTheme } from "./terminal-themes"

export const getTerminalThemeVariables = (theme: TerminalTheme) => {
  const selectedTheme = terminalThemes[theme]

  return {
    "--terminal-color-surface": selectedTheme.surface,
    "--terminal-color-background": selectedTheme.background,
    "--terminal-color-highlight": selectedTheme.highlight,
    "--terminal-color-default": selectedTheme.default,
    "--terminal-color-success": selectedTheme.success,
    "--terminal-color-muted": selectedTheme.muted,
    "--terminal-color-muted-light": selectedTheme.mutedLight,
    "--terminal-color-raw": selectedTheme.raw,
  }
}

export const getDefaultThemeVariables = (theme: DefaultTheme) => {
  const selectedTheme = defaultThemes[theme]

  return {
    "--default-color-default": selectedTheme.default,
    "--default-color-surface": selectedTheme.surface,
    "--default-color-background": selectedTheme.background,
    "--default-color-success": selectedTheme.success,
    "--default-color-muted": selectedTheme.muted,
    "--default-color-muted-light": selectedTheme.mutedLight,
    "--default-color-raw": selectedTheme.raw,
    "--default-color-highlight": selectedTheme.highlight,
  }
}
