/**
 * Convert React element to HTML string for browser measurement
 * 
 * This module converts the React component tree to HTML that can be
 * rendered in a browser for height measurement.
 */

import { renderToString } from 'react-dom/server'
import React from 'react'
import type { ReactElement } from 'react'
import { getCompleteCSS } from '@weeb/weeb-plugins/styles/server'
import type { SvgConfig } from '../types/index.js'

/**
 * Convert React element to HTML string with CSS
 * 
 * Creates a complete HTML document that can be rendered in a browser
 * for accurate height measurement.
 */
export async function reactToHtml(
  element: ReactElement,
  config: SvgConfig,
  width: number
): Promise<{ html: string; css: string }> {
  // Wrap element in PluginStyles for proper CSS context
  const { PluginStyles } = await import('@weeb/weeb-plugins/templates')
  
  const wrappedElement = React.createElement(
    PluginStyles,
    {
      style: config.style || 'default',
      terminalTheme: config.terminalTheme,
      defaultTheme: config.defaultTheme,
      hideTerminalHeader: config.hideTerminalHeader,
      children: element,
    }
  )
  
  // Render React element to HTML string
  const htmlContent = renderToString(wrappedElement)

  // Load CSS (includes fonts + style + plugins + shared)
  const completeCSS = await getCompleteCSS(config.style || 'default', config.plugins || {})

  // Get theme variables
  const { getDefaultThemeVariables } = await import('@weeb/weeb-plugins/themes/theme-utils')
  const { getTerminalThemeVariables } = await import('@weeb/weeb-plugins/themes/theme-utils')

  const theme = config.style === 'terminal' 
    ? (config.terminalTheme || 'default') 
    : (config.defaultTheme || 'default')

  const customColors = (config as any).customThemeColors || {}
  const primaryColor = config.primaryColor

  if (primaryColor && !customColors['--default-color-highlight']) {
    customColors['--default-color-highlight'] = primaryColor
  }

  const themeVariables = config.style === 'terminal'
    ? getTerminalThemeVariables(theme)
    : getDefaultThemeVariables(theme, customColors, primaryColor)

  const themeVariablesCss = Object.entries(themeVariables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')

  // Build HTML content for #svg-main (skeleton HTML is already loaded in pool)
  // The skeleton has #svg-main, we just need to inject the content and CSS
  // IMPORTANTE: A estrutura precisa ser igual ao SVG final para o CSS funcionar
  // O CSS usa #svg-main como seletor base, então precisamos ter #svg-main como wrapper
  // O PluginStyles já foi renderizado no htmlContent e cria <div class="default-container"> ou <div class="terminal-container">
  // Esse div precisa estar dentro de #svg-main para o CSS funcionar
  // The #svg-main in skeleton will have classes and styles applied via evaluate
  const html = htmlContent

  // Build complete CSS (will be injected into #weeb-css in skeleton)
  // Include theme variables as CSS custom properties on #svg-main
  const themeVarsCss = themeVariablesCss
    ? `#svg-main {\n${themeVariablesCss}\n}`
    : ''
  
  const css = `
    #svg-main {
      width: var(--w, ${width}px);
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
    }
    ${themeVarsCss}
    ${completeCSS}
    ${config.customCss || ''}
  `

  return { html, css }
}

