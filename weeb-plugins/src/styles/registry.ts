/**
 * Style Registry
 * 
 * Central registry for all available styles
 * New styles are automatically available once registered here
 */

import defaultStyle from './default/index'
import terminalStyle from './terminal/index'

export interface StyleDefinition {
  name: string
  displayName: string
  fontFamily: string
  containerClass: string
  getCSS: () => string
  getThemeVariables: (theme: string) => Record<string, string>
  themes: Record<string, any>
}

/**
 * Style registry - add new styles here
 */
export const styleRegistry: Record<string, StyleDefinition> = {
  default: defaultStyle,
  terminal: terminalStyle,
}

export type StyleName = keyof typeof styleRegistry

/**
 * Get style definition by name
 */
export function getStyle(name: string): StyleDefinition | undefined {
  return styleRegistry[name]
}

/**
 * Get CSS for a style
 */
export function getStyleCSS(styleName: string): string {
  const style = styleRegistry[styleName]
  if (!style) {
    console.warn(`Style "${styleName}" not found, using default`)
    const defaultStyle = styleRegistry.default
    if (!defaultStyle) {
      console.error('Default style not found in registry!')
      return ''
    }
    return defaultStyle.getCSS()
  }
  return style.getCSS()
}

/**
 * Get all available style names
 */
export function getAvailableStyles(): string[] {
  return Object.keys(styleRegistry)
}

/**
 * Check if style exists
 */
export function styleExists(styleName: string): boolean {
  return styleName in styleRegistry
}

