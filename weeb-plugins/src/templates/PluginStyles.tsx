/**
 * PluginStyles - Applies style and theme to plugin container
 *
 * Browser-compatible version that doesn't depend on Node.js modules
 */

import React from "react"
import { TerminalHeader } from "./Terminal/TerminalHeader"
import { getDefaultThemeVariables } from "../themes/theme-utils"
import { getTerminalThemeVariables } from "../themes/theme-utils"
import type { DefaultTheme, TerminalTheme } from "../themes/types"

interface PluginStylesProps {
  style: "default" | "terminal"
  children: React.ReactNode
  terminalTheme?: string
  defaultTheme?: string
  hideTerminalHeader?: boolean
  customThemeColors?: Record<string, string> // Custom colors for custom theme
  // Fonte global do SVG - chaves de FONT_FAMILIES; valores desconhecidos caem no
  // padrão do estilo. Apenas 'poppins' é embutida; as demais são stacks de sistema
  // (renderizam offline em SVG-as-image sem embutir novos woff2).
  fontFamily?: string
  // Texto custom do título do header do terminal (janela com os três botões).
  terminalHeaderText?: string
}

export const FONT_FAMILIES: Record<string, string> = {
  poppins: "'Poppins', sans-serif",
  system: "system-ui, -apple-system, 'Segoe UI', sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  mono: "ui-monospace, 'JetBrains Mono', 'Cascadia Code', Menlo, Consolas, monospace",
}

// Style definitions (browser-compatible, no Node.js dependencies)
const STYLE_DEFINITIONS = {
  default: {
    name: "default",
    fontFamily: "'Poppins', sans-serif",
    containerClass: "default-container",
  },
  terminal: {
    name: "terminal",
    fontFamily: "'Courier New', Courier, 'Lucida Console', Monaco, monospace",
    containerClass: "terminal-container",
  },
} as const

export function PluginStyles({
  style,
  children,
  terminalTheme = "default",
  defaultTheme = "default",
  hideTerminalHeader = false,
  customThemeColors,
  fontFamily,
  terminalHeaderText,
}: PluginStylesProps): React.ReactElement {
  const styleDef = STYLE_DEFINITIONS[style] || STYLE_DEFINITIONS.default

  // Get theme based on style
  const theme = style === "terminal" ? terminalTheme : defaultTheme

  // Get theme variables (these functions don't depend on Node.js)
  // customThemeColors can override any CSS variable
  const themeVariables =
    style === "terminal"
      ? getTerminalThemeVariables(theme as TerminalTheme)
      : getDefaultThemeVariables(defaultTheme as DefaultTheme, customThemeColors)

  // Get background color for terminal style
  const terminalBackground = style === "terminal" ? themeVariables["--terminal-color-background"] : undefined

  const resolvedFontFamily = (fontFamily && FONT_FAMILIES[fontFamily]) || styleDef.fontFamily

  // Build style object
  const themeStyles = {
    fontFamily: resolvedFontFamily,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    // Apply background color for terminal style
    ...(terminalBackground ? { backgroundColor: terminalBackground } : {}),
    ...themeVariables,
  } as React.CSSProperties & Record<string, string>

  // Terminal-specific: show header
  const showTerminalHeader = style === "terminal" && !hideTerminalHeader

  return (
    <div className={styleDef.containerClass} data-style={styleDef.name} data-theme={theme} style={themeStyles}>
      {showTerminalHeader && <TerminalHeader title={terminalHeaderText?.trim() || undefined} />}
      {children}
    </div>
  )
}
