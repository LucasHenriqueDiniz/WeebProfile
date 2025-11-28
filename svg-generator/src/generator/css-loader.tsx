/**
 * Carregador de CSS
 * 
 * Carrega e prepara todos os estilos CSS necessários usando weeb-plugins
 */

import React from 'react'
import type { SvgConfig } from '../types/index.js'
import { getCompleteCSS } from '@weeb/weeb-plugins/styles'

/**
 * Carrega todos os arquivos CSS e retorna como JSX
 */
export async function loadCss(config: SvgConfig): Promise<React.ReactElement> {
  // Load complete CSS from weeb-plugins (includes style + plugins + shared CSS)
  // This is the only source of CSS - all styles come from weeb-plugins
  const completeCSS = getCompleteCSS(config.style, config.plugins)
  
  if (process.env.DEBUG_CSS) {
    console.log('[CSS Loader] ✅ CSS loaded successfully!')
    console.log(`[CSS Loader] Complete CSS length: ${completeCSS.length}`)
  }
  
  // Get theme variables to inject into CSS
  // Import theme utils to get variables
  const { getDefaultThemeVariables } = await import('@weeb/weeb-plugins/themes/theme-utils')
  const { getTerminalThemeVariables } = await import('@weeb/weeb-plugins/themes/theme-utils')
  
  const theme = config.style === 'terminal' ? (config.terminalTheme || 'default') : (config.defaultTheme || 'default')
  
  // Get custom colors (if any) and merge with primaryColor
  const customColors = (config as any).customThemeColors || {}
  const primaryColor = config.primaryColor
  
  // If primaryColor is provided, add it to customColors as --default-color-highlight
  // This allows primaryColor to work alongside customThemeColors
  if (primaryColor && !customColors['--default-color-highlight']) {
    customColors['--default-color-highlight'] = primaryColor
  }
  
  // Get theme variables - primaryColor is now integrated as part of customColors
  const themeVariables = config.style === 'terminal'
    ? getTerminalThemeVariables(theme)
    : getDefaultThemeVariables(theme, customColors, primaryColor)
  
  // Convert theme variables to CSS string
  const themeVariablesCss = Object.entries(themeVariables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')

  // CSS to define theme variables on #svg-main so they're available everywhere
  const themeVariablesCssBlock = `
    #svg-main {
${themeVariablesCss}
    }
  `

  return (
    <>
      <style>{themeVariablesCssBlock}</style>
      <style>{completeCSS}</style>
      {config.customCss && <style>{config.customCss}</style>}
    </>
  )
}
