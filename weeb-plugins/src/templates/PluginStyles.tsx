/**
 * PluginStyles - Applies style and theme to plugin container
 *
 * Browser-compatible version that doesn't depend on Node.js modules
 */

import React from "react"
import { TerminalHeader } from "./Terminal/TerminalHeader"
import {
  buildAutoThemeCss,
  getDefaultThemeVariables,
  getTerminalThemeVariables,
  getThemeVariantVariables,
  isAutoColorMode,
  type ColorVariant,
} from "../themes/theme-utils"
import { AnimationsProvider, animationStepStyle } from "./animations"
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
  // "auto" ships the light and the dark palette and lets prefers-color-scheme pick;
  // anything else is the theme as it always was. See buildAutoThemeCss.
  colorMode?: string
  // Draws one variant of an auto card without the media query, so a preview can show
  // the light and the dark card whatever the viewer's own scheme is.
  colorVariant?: ColorVariant
  // Opt-in card animations (templates/animations.tsx). The gap between sections comes
  // from animationTimeline(); the stylesheet itself is ANIMATIONS_CSS, added by the caller.
  animations?: { step: number }
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
  colorMode,
  colorVariant,
  animations,
}: PluginStylesProps): React.ReactElement {
  const styleDef = STYLE_DEFINITIONS[style] || STYLE_DEFINITIONS.default
  const scopeId = React.useId()

  // Get theme based on style
  const theme = style === "terminal" ? terminalTheme : defaultTheme

  const auto = isAutoColorMode(colorMode)
  const forcedVariant = auto ? colorVariant : undefined

  // Get theme variables (these functions don't depend on Node.js)
  // customThemeColors can override any CSS variable
  const themeVariables = forcedVariant
    ? getThemeVariantVariables(style, theme, forcedVariant, customThemeColors)
    : style === "terminal"
      ? getTerminalThemeVariables(theme as TerminalTheme)
      : getDefaultThemeVariables(defaultTheme as DefaultTheme, customThemeColors)

  // Auto mode with no forced variant: the variables go in a stylesheet, where the
  // media query can switch them. Inline, they would win over it.
  const autoCss = auto && !forcedVariant
  const scopeSelector = `[data-theme-scope="${scopeId}"]`

  // Get background color for terminal style
  const terminalBackground =
    style !== "terminal"
      ? undefined
      : autoCss
        ? "var(--terminal-color-background)"
        : themeVariables["--terminal-color-background"]

  const resolvedFontFamily = (fontFamily && FONT_FAMILIES[fontFamily]) || styleDef.fontFamily

  // Build style object
  const themeStyles = {
    fontFamily: resolvedFontFamily,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    // Apply background color for terminal style
    ...(terminalBackground ? { backgroundColor: terminalBackground } : {}),
    ...(autoCss ? {} : themeVariables),
    ...(animations ? animationStepStyle(animations.step) : {}),
  } as React.CSSProperties & Record<string, string>

  // Terminal-specific: show header
  const showTerminalHeader = style === "terminal" && !hideTerminalHeader

  const container = (
    <div
      className={animations ? `${styleDef.containerClass} weeb-anim` : styleDef.containerClass}
      data-style={styleDef.name}
      data-theme={theme}
      data-color-mode={auto ? "auto" : undefined}
      data-theme-scope={autoCss ? scopeId : undefined}
      style={themeStyles}
    >
      {showTerminalHeader && <TerminalHeader title={terminalHeaderText?.trim() || undefined} />}
      <AnimationsProvider enabled={Boolean(animations)}>{children}</AnimationsProvider>
    </div>
  )

  if (!autoCss) return container

  // The <style> sits next to the container, not inside it, so it never counts as the
  // container's first child for a plugin's selectors.
  return (
    <>
      <style>{buildAutoThemeCss(scopeSelector, style, theme, customThemeColors)}</style>
      {container}
    </>
  )
}
