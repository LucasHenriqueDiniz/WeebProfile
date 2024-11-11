import { terminalThemes, TerminalTheme } from "./terminal-themes"

export const getThemeVariables = (theme: TerminalTheme) => {
  const selectedTheme = terminalThemes[theme]

  return {
    "--terminal-color-surface": selectedTheme.surface,
    "--terminal-color-background": selectedTheme.background,
    "--terminal-color-highlight": selectedTheme.highlight,
    "--terminal-color-default": selectedTheme.default,
    "--terminal-color-error": selectedTheme.error,
    "--terminal-color-success": selectedTheme.success,
    "--terminal-color-warning": selectedTheme.warning,
    "--terminal-color-muted": selectedTheme.muted,
    "--terminal-color-muted-light": selectedTheme.mutedLight,
    "--terminal-color-raw": selectedTheme.raw,
  }
}
