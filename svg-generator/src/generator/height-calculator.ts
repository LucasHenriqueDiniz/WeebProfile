/**
 * Height Calculator Aggregator
 * 
 * Agrega os heights calculados pelos plugins individuais.
 * Cada plugin tem seu próprio heights.ts que calcula a altura de suas seções.
 * Este arquivo apenas:
 * 1. Importa e chama os calculators dos plugins
 * 2. Adiciona espaçamentos (BASE_HEIGHT, pluginSpacing, sectionGap, extraSpacing)
 * 3. Calcula a largura do SVG
 */

import type { SvgConfig } from '../types/index.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

/**
 * Calcula a largura do SVG baseado no tamanho
 */
export function calculateSvgWidth(size: 'half' | 'full'): number {
  return size === 'half' ? 415 : 830
}

/**
 * Altura base para cada estilo (padding do container SVG)
 */
const BASE_HEIGHT = {
  default: 40, // Padding do container
  terminal: 60, // Terminal tem header, então precisa de mais espaço
}

/**
 * Altura do título de seção (deve corresponder ao valor em weeb-plugins/src/plugins/shared/types/heights.ts)
 */
const SECTION_TITLE_HEIGHT = {
  default: 35, // DefaultTitle: 23px element + 6px margin-top + 6px margin-bottom
  terminal: 30, // TerminalCommand é mais compacto
}

/**
 * Tenta importar o height calculator de um plugin
 */
async function importPluginHeightCalculator(pluginName: string): Promise<any> {
  try {
    // Try multiple import strategies
    let calculatorModule = null
    
    // Strategy 1: Try using package export path
    try {
      const packagePath = `@weeb/weeb-plugins/plugins/${pluginName}/heights`
      calculatorModule = await import(packagePath)
      if (calculatorModule) {
        console.log(`[Height Calculator] ✅ Successfully imported ${pluginName} via package export`)
        return calculatorModule
      }
    } catch (packageError) {
      // Strategy 2: Try absolute path
      try {
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = dirname(__filename)
        const calculatorPath = join(__dirname, '../../..', `weeb-plugins/src/plugins/${pluginName}/heights.ts`)
        calculatorModule = await import(`file://${calculatorPath}`)
        if (calculatorModule) {
          console.log(`[Height Calculator] ✅ Successfully imported ${pluginName} via absolute path`)
          return calculatorModule
        }
      } catch (absError) {
        // Strategy 3: Try relative path
        try {
          const relativePath = `../../../weeb-plugins/src/plugins/${pluginName}/heights.js`
          calculatorModule = await import(relativePath)
          if (calculatorModule) {
            console.log(`[Height Calculator] ✅ Successfully imported ${pluginName} via relative path`)
            return calculatorModule
          }
        } catch (relError) {
          // All strategies failed, return null
          return null
        }
      }
    }
    
    return calculatorModule
  } catch (error) {
    console.warn(`[Height Calculator] ⚠️ Failed to import ${pluginName} height calculator:`, error instanceof Error ? error.message : String(error))
    return null
  }
}


/**
 * Mapeamento de nomes de plugins para nomes de funções de cálculo
 */
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

/**
 * Calcula altura de uma seção específica
 */
async function calculateSectionHeight(
  pluginName: string,
  section: string,
  pluginConfig: any,
  size: 'half' | 'full',
  style: 'default' | 'terminal'
): Promise<number> {
  // Tentar importar o height calculator do plugin
  const calculatorModule = await importPluginHeightCalculator(pluginName)
  
  if (calculatorModule) {
    const calculatorFunctionName = PLUGIN_CALCULATOR_FUNCTIONS[pluginName]
    if (calculatorFunctionName) {
      const calculatorFunction = calculatorModule[calculatorFunctionName]
      
      if (calculatorFunction && typeof calculatorFunction === 'function') {
        try {
          const height = calculatorFunction(section, pluginConfig, size, style)
          
          if (typeof height === 'number') {
            console.log(`[Height Calculator] ✅ Using ${pluginName} plugin calculator for section: ${section} (${height}px)`)
            return height
          }
        } catch (error) {
          console.warn(`[Height Calculator] ⚠️ Error calling ${pluginName} calculator:`, error instanceof Error ? error.message : String(error))
        }
      }
    }
  }

  // Fallback - altura estimada baseada no tamanho
  const titleHeight = SECTION_TITLE_HEIGHT[style]
  const hideTitle = (pluginConfig as any)[`${section}_hide_title`] ?? false
  const titleSpace = hideTitle ? 0 : titleHeight
  const defaultHeight = size === 'half' ? 150 : 200
  return titleSpace + defaultHeight
}

/**
 * Calcula altura estimada baseada na configuração
 * 
 * @param config - Configuração do SVG
 * @returns Altura estimada em pixels
 */
export async function calculateEstimatedHeight(config: SvgConfig): Promise<number> {
  const style = config.style || 'default'
  const size = config.size || 'half'
  const baseHeight = BASE_HEIGHT[style]

  // Calcular altura total das seções
  let sectionsHeight = 0
  let pluginSpacing = 0
  let sectionCount = 0

  for (const [pluginName, plugin] of Object.entries(config.plugins || {})) {
    if (!plugin?.enabled || !plugin.sections || plugin.sections.length === 0) {
      continue
    }

    // Adicionar espaçamento entre plugins (reduzido baseado em medições reais)
    if (sectionsHeight > 0) {
      pluginSpacing += 20 // Reduzido de 30px
    }

    // Calcular altura de cada seção
    for (const section of plugin.sections) {
      sectionCount++
      const sectionHeight = await calculateSectionHeight(
        pluginName,
        section,
        plugin,
        size,
        style
      )
      sectionsHeight += sectionHeight
      
      // Adicionar espaçamento entre seções (reduzido baseado em medições reais)
      const sectionGap = 10 // Reduzido de 20px
      sectionsHeight += sectionGap
    }
  }

  // Calcular altura total
  const totalHeight = baseHeight + sectionsHeight + pluginSpacing

  // Adicionar espaçamento extra para segurança (reduzido baseado em medições reais)
  const extraSpacing = 20 // Reduzido de 40px
  const finalHeight = Math.ceil(totalHeight + extraSpacing)

  console.log(`[Height Calculator] 📊 Total height calculation:`, {
    baseHeight,
    sectionsHeight,
    pluginSpacing,
    extraSpacing,
    finalHeight,
    sectionCount,
  })

  return finalHeight
}

