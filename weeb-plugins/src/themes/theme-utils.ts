/**
 * Theme Utilities - Simplified
 * 
 * Returns CSS variables based on theme name.
 * All themes are just CSS variable overrides.
 */

import { defaultThemes, terminalThemes, type ThemeVariables, type TerminalThemeVariables } from './themes'
import type { DefaultTheme, TerminalTheme } from './types'

/**
 * Get terminal theme variables
 */
export const getTerminalThemeVariables = (theme: TerminalTheme | string): TerminalThemeVariables => {
  const validTheme = (theme in terminalThemes ? theme : 'default') as TerminalTheme
  const selectedTheme = terminalThemes[validTheme] || terminalThemes.default

  if (!selectedTheme) {
    console.warn(`Terminal theme "${theme}" not found, using default theme`)
    return terminalThemes.default
  }

  return selectedTheme
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
  
  // Get base theme variables
  const baseTheme = defaultThemes[mappedTheme] || defaultThemes.default
  let themeVariables: ThemeVariables = { ...baseTheme }

  // If custom theme, apply custom colors
  if (mappedTheme === 'custom' && customColors) {
    themeVariables = {
      ...themeVariables,
      ...customColors,
    }
  }

  // Legacy: primaryColor overrides --default-color-highlight
  if (primaryColor) {
    themeVariables['--default-color-highlight'] = primaryColor
  }

  return themeVariables
}







