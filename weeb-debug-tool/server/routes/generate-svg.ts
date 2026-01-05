/**
 * Generate SVG Route
 * 
 * POST /api/generate-svg
 * Body: { plugin: string, section: string, style?: string, size?: 'half' | 'full', html?: string, css?: string }
 * 
 * If html and css are provided, they will be used for height measurement (must already have debug IDs).
 * This ensures perfect matching between React preview and SVG output.
 */

import { Request, Response } from 'express'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { generateSvg } from '../../../svg-generator/src/generator/svg-generator.js'
import { normalizeConfig } from '../../../svg-generator/src/config/config-loader.js'
import { measureHeight } from '../../../svg-generator/src/layout/measure-height.js'
import { calculateSvgWidth } from '../../../svg-generator/src/generator/height-calculator.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// From server/routes/generate-svg.ts -> server/ -> weeb-debug-tool/ -> Repositories/WeebProfile/
const ROOT_DIR = join(__dirname, '../../..')

export async function generateSvgRoute(req: Request, res: Response) {
  try {
    const { plugin, section, style = 'default', size = 'half', sectionConfig = {}, html: providedHtml, css: providedCss } = req.body

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

    // Generate SVG
    let result
    try {
      // If html and css are provided, use them for height measurement
      // This ensures the SVG uses the same HTML that was generated with debug IDs
      if (providedHtml && providedCss) {
        console.log('📏 Using provided HTML/CSS for height measurement (with debug IDs)...')
        const width = calculateSvgWidth(size)
        
        // Measure height using provided HTML (already has debug IDs)
        const height = await measureHeight({
          html: providedHtml,
          width,
          size,
          style,
          timeoutMs: 5000,
        })
        
        console.log(`✅ Height measured: ${height}px`)
        
        // Generate SVG normally (will render React element, but height is from provided HTML)
        result = await generateSvg(normalizedConfig)
        
        // Override height with measured height from provided HTML
        result.height = height
        
        console.log('✅ SVG generated using provided HTML for measurement')
      } else {
        // Normal flow: generate SVG from scratch
        result = await generateSvg(normalizedConfig)
        console.log('✅ SVG generated successfully')
      }
    } catch (error) {
      console.error('❌ Error generating SVG:', error)
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
      throw error
    }

    res.json({
      svg: result.svg,
      height: result.height,
      width: result.width,
    })
  } catch (error) {
    console.error('❌ Error generating SVG:', error)
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to generate SVG',
      details: error instanceof Error ? error.stack : String(error),
    })
  }
}


