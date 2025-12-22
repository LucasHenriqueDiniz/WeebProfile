/**
 * Generate React HTML Route
 * 
 * POST /api/generate-react
 * Body: { plugin: string, section: string, style?: string, size?: 'half' | 'full' }
 */

import { Router, Request, Response } from 'express'
import { renderToString } from 'react-dom/server'
import React from 'react'
import { normalizeConfig } from '@weeb/svg-generator'
import { renderPlugins } from '../utils/render-plugins.js'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  try {
    const { plugin, section, style = 'default', size = 'half', sectionConfig = {} } = req.body

    if (!plugin || !section) {
      return res.status(400).json({ error: 'plugin and section are required' })
    }

    // Prepare plugin config
    const pluginConfig: Record<string, any> = {
      [plugin]: {
        enabled: true,
        sections: [section],
        username: 'example', // Mock data
        ...sectionConfig, // Merge section-specific configs
      },
    }

    // Normalize config
    const normalizedConfig = normalizeConfig({
      style,
      size,
      plugins: pluginConfig,
      pluginsOrder: [plugin],
      dev: true, // Use mock data
    })

    // Render plugins using direct imports
    let pluginsContent
    try {
      const renderResult = await renderPlugins({
        plugins: pluginConfig,
        style,
        size,
        dev: true,
      })
      pluginsContent = renderResult.element
      console.log('✅ React render successful (using direct imports)')
    } catch (error) {
      console.error('❌ Error rendering plugins:', error)
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
      throw error
    }

    // Get CSS - import directly from weeb-plugins/src
    let stylesModule, themeUtilsModule
    try {
      stylesModule = await import('@weeb-plugins/styles/server')
      themeUtilsModule = await import('@weeb-plugins/themes/theme-utils')
      console.log('✅ CSS modules imported successfully')
    } catch (error) {
      console.error('❌ Error importing CSS modules:', error)
      throw error
    }
    
    const completeCSS = stylesModule.getCompleteCSS(style, { [plugin]: { enabled: true } })
    const theme = normalizedConfig.defaultTheme || 'default'
    const themeVariables = themeUtilsModule.getDefaultThemeVariables(theme, (normalizedConfig as any).customThemeColors)
    const themeVariablesCss = Object.entries(themeVariables)
      .map(([key, value]) => `  ${key}: ${value};`)
      .join('\n')

    const fullCSS = `
      #svg-main {
${themeVariablesCss}
      }
      ${completeCSS}
    `

    // Create React HTML with proper container
    const containerClass = style === 'terminal' ? 'terminal-container' : 'default-container'
    const reactHtml = `<div id="svg-main" class="${size}" style="font-family: Poppins, sans-serif; width: ${size === 'half' ? 415 : 830}px;">
      <div class="${containerClass}">
        ${renderToString(pluginsContent)}
      </div>
    </div>`

    res.json({
      html: reactHtml,
      css: fullCSS,
    })
  } catch (error) {
    console.error('❌ Error generating React HTML:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to generate React HTML',
      details: error instanceof Error ? error.stack : String(error),
    })
  }
})

export default router

