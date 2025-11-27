/**
 * PluginStyles - Applies style and theme to plugin container
 * 
 * Browser-compatible version that doesn't depend on Node.js modules
 */

import React from 'react'
import { TerminalHeader } from './Terminal/TerminalHeader'
import { getDefaultThemeVariables } from '../themes/theme-utils'
import { getTerminalThemeVariables } from '../themes/theme-utils'
import type { DefaultTheme, TerminalTheme } from '../themes/types'

interface PluginStylesProps {
  style: 'default' | 'terminal'
  children: React.ReactNode
  terminalTheme?: string
  defaultTheme?: string
  hideTerminalHeader?: boolean
  customThemeColors?: Record<string, string> // Custom colors for custom theme
}

// Style definitions (browser-compatible, no Node.js dependencies)
const STYLE_DEFINITIONS = {
  default: {
    name: 'default',
    fontFamily: "'Poppins', sans-serif",
    containerClass: 'default-container',
  },
  terminal: {
    name: 'terminal',
    fontFamily: "'Courier New', Courier, 'Lucida Console', Monaco, monospace",
    containerClass: 'terminal-container',
  },
} as const

export function PluginStyles({
  style,
  children,
  terminalTheme = 'default',
  defaultTheme = 'default',
  hideTerminalHeader = false,
  customThemeColors,
}: PluginStylesProps): React.ReactElement {
  const styleDef = STYLE_DEFINITIONS[style] || STYLE_DEFINITIONS.default
  
  // Get theme based on style
  const theme = style === 'terminal' ? terminalTheme : defaultTheme
  
  // Get theme variables (these functions don't depend on Node.js)
  // customThemeColors can override any CSS variable
  const themeVariables = style === 'terminal'
    ? getTerminalThemeVariables(theme as TerminalTheme)
    : getDefaultThemeVariables(defaultTheme as DefaultTheme, customThemeColors)
  
  // Get background color for terminal style
  const terminalBackground = style === 'terminal' 
    ? (themeVariables as Record<string, string>)['--terminal-color-background']
    : undefined
  
  // Build style object
  const themeStyles = {
    fontFamily: styleDef.fontFamily,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    // Apply background color for terminal style
    ...(terminalBackground ? { backgroundColor: terminalBackground } : {}),
    ...themeVariables,
  } as React.CSSProperties & Record<string, string>

  // Terminal-specific: show header
  const showTerminalHeader = style === 'terminal' && !hideTerminalHeader

  return (
    <div 
      className={styleDef.containerClass}
      data-style={styleDef.name}
      data-theme={theme}
      style={themeStyles}
    >
      {showTerminalHeader && <TerminalHeader />}
      {children}
    </div>
  )
}
