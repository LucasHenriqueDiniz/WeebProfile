/**
 * Height Measurer
 * 
 * Mede altura real de SVGs renderizados usando Playwright.
 * Usa browser pool para eficiência.
 * Fallback para cálculo estimado em caso de erro.
 */

import { browserPool } from './browser-pool.js'
import { calculateEstimatedHeight } from './height-calculator.js'
import type { SvgConfig } from '../types/index.js'

const MEASUREMENT_TIMEOUT = 5000 // 5 segundos

/**
 * Mede altura real de um SVG renderizado
 * 
 * @param svgString - String do SVG a ser medido
 * @param config - Configuração do SVG (para fallback)
 * @returns Altura em pixels
 */
export async function measureActualHeight(
  svgString: string,
  config?: SvgConfig
): Promise<number> {
  let context = null
  
  try {
    console.log('[Height Measurer] 📏 Measuring actual height...')
    
    // Obter contexto do browser pool
    context = await browserPool.getContext()
    const page = await context.newPage()
    
    // Renderizar SVG em HTML temporário
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              margin: 0;
              padding: 0;
              display: flex;
              align-items: flex-start;
              justify-content: flex-start;
            }
            svg {
              display: block;
            }
          </style>
        </head>
        <body>
          ${svgString}
        </body>
      </html>
    `
    
    // Configurar timeout
    page.setDefaultTimeout(MEASUREMENT_TIMEOUT)
    
    // Carregar HTML
    await page.setContent(html, { waitUntil: 'networkidle' })
    
    // Aguardar SVG renderizar
    await page.waitForSelector('svg', { timeout: MEASUREMENT_TIMEOUT })
    
    // Medir altura real
    const height = await page.evaluate(() => {
      const svg = document.querySelector('svg')
      if (!svg) return 0
      
      // Obter bounding box
      const bbox = svg.getBBox()
      const rect = svg.getBoundingClientRect()
      
      // Usar o maior valor entre bbox e boundingClientRect
      // bbox pode não incluir transformações, boundingClientRect sim
      return Math.max(bbox.height, rect.height)
    })
    
    await page.close()
    
    const finalHeight = Math.ceil(height)
    console.log(`[Height Measurer] ✅ Measured height: ${finalHeight}px`)
    
    return finalHeight
  } catch (error) {
    console.error('[Height Measurer] ❌ Error measuring height:', error)
    
    // Fallback para cálculo estimado
    if (config) {
      console.log('[Height Measurer] 🔄 Falling back to estimated height...')
      const estimatedHeight = await calculateEstimatedHeight(config)
      console.log(`[Height Measurer] 📊 Estimated height: ${estimatedHeight}px`)
      return estimatedHeight
    }
    
    // Se não tem config, retorna altura padrão
    console.warn('[Height Measurer] ⚠️ No config for fallback, using default height')
    return 800 // Altura padrão
  } finally {
    // Fechar contexto se ainda estiver aberto
    if (context) {
      try {
        await context.close()
      } catch (error) {
        console.error('[Height Measurer] ⚠️ Error closing context:', error)
      }
    }
  }
}

/**
 * Verifica se medição real está disponível
 */
export function isRealMeasurementAvailable(): boolean {
  try {
    return browserPool.isAvailable() || true // Sempre tenta, pool cria se necessário
  } catch {
    return false
  }
}

