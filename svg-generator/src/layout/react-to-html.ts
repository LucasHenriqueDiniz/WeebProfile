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

  // Load CSS
  const completeCSS = getCompleteCSS(config.style || 'default', config.plugins || {})

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

  // Build complete HTML document
  // IMPORTANTE: A estrutura precisa ser igual ao SVG final para o CSS funcionar
  // O CSS usa #svg-main como seletor base, então precisamos ter #svg-main como wrapper
  // O PluginStyles já foi renderizado no htmlContent e cria <div class="default-container"> ou <div class="terminal-container">
  // Esse div precisa estar dentro de #svg-main para o CSS funcionar
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html, body {
      width: ${width}px;
      margin: 0;
      padding: 0;
      font-family: Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    #measure-root {
      width: ${width}px;
      margin: 0;
      padding: 0;
    }
    #svg-main {
      width: ${width}px;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
${themeVariablesCss}
    }
    ${completeCSS}
    ${config.customCss || ''}
  </style>
</head>
<body style="margin: 0; padding: 0;">
  <div id="measure-root" style="width: ${width}px; margin: 0; padding: 0;">
    <div id="svg-main" class="${config.size || 'half'} ${config.style || 'default'} flex flex-col relative" style="width: ${width}px; margin: 0; padding: 0;">
      ${htmlContent}
    </div>
  </div>
</body>
</html>`

  const css = `
    #measure-root {
      width: ${width}px;
    }
    ${completeCSS}
  `

  return { html, css }
}

