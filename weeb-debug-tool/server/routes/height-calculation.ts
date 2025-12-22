/**
 * Height Calculation Details Route
 * 
 * POST /api/height-calculation
 * Body: { plugin: string, section: string, style?: string, size?: 'half' | 'full', sectionConfig?: object }
 * Returns: { height: number, details: HeightCalculationDetails }
 */

import { Request, Response } from 'express'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { calculateEstimatedHeight } from '@weeb/svg-generator'
import { normalizeConfig } from '@weeb/svg-generator'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Mapping of plugin names to calculator function names
const PLUGIN_CALCULATOR_FUNCTIONS: Record<string, string> = {
  myanimelist: 'calculateMyAnimeListHeight',
  github: 'calculateGitHubHeight',
  lastfm: 'calculateLastFMHeight',
  '16personalities': 'calculatePersonality16Height',
  stackoverflow: 'calculateStackOverflowHeight',
  duolingo: 'calculateDuolingoHeight',
  codewars: 'calculateCodewarsHeight',
  codeforces: 'calculateCodeforcesHeight',
}

// Try to import plugin height calculator
async function getPluginHeightCalculator(pluginName: string, section: string) {
  try {
    const calculatorFunctionName = PLUGIN_CALCULATOR_FUNCTIONS[pluginName]
    if (!calculatorFunctionName) {
      return null
    }

    // Try multiple import strategies
    let calculatorModule = null
    
    // Strategy 1: Package export
    try {
      const packagePath = `@weeb/weeb-plugins/plugins/${pluginName}/heights`
      calculatorModule = await import(packagePath)
    } catch (packageError) {
      // Strategy 2: Source path (for development)
      try {
        const sourcePath = `../../../weeb-plugins/src/plugins/${pluginName}/heights.ts`
        calculatorModule = await import(sourcePath)
      } catch (sourceError) {
        // Strategy 3: Compiled path
        try {
          const compiledPath = `../../../weeb-plugins/src/plugins/${pluginName}/heights.js`
          calculatorModule = await import(compiledPath)
        } catch (compiledError) {
          console.warn(`Plugin height calculator not available for ${pluginName}:`, compiledError)
          return null
        }
      }
    }
    
    if (calculatorModule && calculatorModule[calculatorFunctionName]) {
      return calculatorModule[calculatorFunctionName]
    }
  } catch (error) {
    console.warn(`Plugin height calculator not available for ${pluginName}:`, error)
  }
  return null
}

export async function heightCalculationRoute(req: Request, res: Response) {
  try {
    const { plugin, section, style = 'default', size = 'half', sectionConfig = {} } = req.body

    if (!plugin || !section) {
      return res.status(400).json({ error: 'plugin and section are required' })
    }

    // Try to get detailed calculation from plugin's height calculator
    const pluginCalculator = await getPluginHeightCalculator(plugin, section)
    
    if (pluginCalculator) {
      try {
        const height = pluginCalculator(section, sectionConfig, size, style)

        return res.json({
          height,
          details: null, // Details removed - function now returns only number
          source: 'plugin-calculator',
        })
      } catch (error) {
        console.warn('Error using plugin calculator, falling back to estimated:', error)
      }
    }

    // Fallback: Use the general height calculator
    const pluginConfig: Record<string, any> = {
      [plugin]: {
        enabled: true,
        sections: [section],
        username: 'example',
        ...sectionConfig,
      },
    }

    const normalizedConfig = normalizeConfig({
      style,
      size,
      plugins: pluginConfig,
      pluginsOrder: [plugin],
      dev: true,
    })

    const height = await calculateEstimatedHeight(normalizedConfig)

    res.json({
      height,
      details: null,
      source: 'estimated',
      message: 'Plugin-specific calculator not available, using estimated height',
    })
  } catch (error) {
    console.error('❌ Error calculating height:', error)
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to calculate height',
      details: error instanceof Error ? error.stack : String(error),
    })
  }
}

