/**
 * Theme Utilities - Simplified
 * 
 * Returns CSS variables based on theme name.
 * All themes are just CSS variable overrides.
 */

import { defaultThemes, terminalThemes, type ThemeVariables, type TerminalThemeVariables } from './themes.js'
import type { DefaultTheme, TerminalTheme } from './types.js'

/**
 * Get terminal theme variables
 */
export const getTerminalThemeVariables = (theme: TerminalTheme | string): TerminalThemeVariables => {
  const validTheme = (theme in terminalThemes ? theme : 'default') as TerminalTheme
  const selectedTheme = terminalThemes[validTheme]

  // Always return a valid theme - default theme is guaranteed to exist in terminalThemes
  // Using non-null assertion because 'default' theme is always defined in terminalThemes
  return selectedTheme ?? (terminalThemes['default'] as TerminalThemeVariables)
}

/**
 * Get default theme variables
 * 
 * @param theme - Theme name (default, purple, pink, cyan, orange, blue, green, red, or custom)
 * @param customColors - Custom CSS variables to override (only used when theme === 'custom')
 * @param primaryColor - Legacy: primary color override (maps to --default-color-highlight)
 */
export const getDefaultThemeVariables = (
  theme: DefaultTheme | string,
  customColors?: Record<string, string>,
  primaryColor?: string
): ThemeVariables => {
  // Map theme names (purple -> purple, defaultPurple -> purple, etc)
  const themeMap: Record<string, string> = {
    default: 'default',
    defaultPurple: 'purple',
    defaultPink: 'pink',
    defaultCyan: 'cyan',
    defaultOrange: 'orange',
    defaultBlue: 'blue',
    defaultGreen: 'green',
    defaultRed: 'red',
    defaultCustom: 'custom',
    purple: 'purple',
    pink: 'pink',
    cyan: 'cyan',
    orange: 'orange',
    blue: 'blue',
    green: 'green',
    red: 'red',
    custom: 'custom',
  }
  
  const mappedTheme = themeMap[theme] || 'default'
  
  // Get base theme variables - default theme is guaranteed to exist
  // Using non-null assertion because 'default' theme is always defined in defaultThemes
  const baseTheme = defaultThemes[mappedTheme] ?? (defaultThemes['default'] as ThemeVariables)
  let themeVariables: ThemeVariables = { ...baseTheme }

  // If custom theme, apply custom colors
  if (mappedTheme === 'custom' && customColors) {
    // Filter out undefined values from customColors
    const validCustomColors: Record<string, string> = {}
    for (const [key, value] of Object.entries(customColors)) {
      if (value && typeof value === 'string') {
        validCustomColors[key] = value
      }
    }
    themeVariables = {
      ...themeVariables,
      ...validCustomColors,
    }
  }

  // Legacy: primaryColor overrides --default-color-highlight
  if (primaryColor && typeof primaryColor === 'string') {
    themeVariables['--default-color-highlight'] = primaryColor
  }

  return themeVariables
}







