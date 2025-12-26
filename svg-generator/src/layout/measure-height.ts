/**
 * Layout Height Measurer using Playwright
 * 
 * Measures the rendered height of HTML content given a width.
 * Uses Playwright to render HTML in a real browser and measure scrollHeight.
 */

import { getBrowserContext } from './browser.js'

export interface MeasureHeightOptions {
  html: string
  width: number
  css?: string
  timeoutMs?: number
  allowNetwork?: boolean
}

const DEFAULT_TIMEOUT_MS = 2000

/**
 * Measure rendered height of HTML content
 * 
 * @param options - Measurement options
 * @returns Height in pixels (integer)
 */
export async function measureHeight(options: MeasureHeightOptions): Promise<number> {
  const {
    html,
    width,
    css,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    allowNetwork = process.env.ALLOW_NETWORK === '1',
  } = options

  const startTime = Date.now()

  try {
    const context = await getBrowserContext()
    const page = await context.newPage()

    try {
      // Block external network requests by default for predictability
      // This prevents the page from loading external resources like:
      // - Images from CDNs (ex: https://example.com/image.png)
      // - Fonts from Google Fonts (ex: https://fonts.googleapis.com/...)
      // - API calls (ex: https://api.example.com/...)
      // 
      // We only allow:
      // - data: URLs (inline images/base64)
      // - blob: URLs (generated content)
      // 
      // Set ALLOW_NETWORK=1 if you need external resources (not recommended for measurement)
      if (!allowNetwork) {
        await page.route('**/*', (route) => {
          const url = route.request().url()
          if (url.startsWith('data:') || url.startsWith('blob:')) {
            route.continue()
          } else {
            // Block external requests (images, fonts, APIs, etc)
            route.abort()
          }
        })
      }

      // Set viewport to the target width with minimal height
      // Usar altura mínima para economizar memória (só precisamos medir scrollHeight)
      await page.setViewportSize({ width, height: 10 })
      
      // Desabilitar recursos desnecessários para medição (economiza memória e tempo)
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
      })

      // IMPORTANTE: O CSS já está no HTML gerado (dentro do <style> tag)
      // Não precisamos injetar CSS adicional, apenas garantir que seja aplicado
      // Set content with timeout - usar 'load' para garantir que CSS seja aplicado
      await page.setContent(html, {
        waitUntil: 'load', // 'load' garante que CSS no <style> tag seja aplicado
        timeout: timeoutMs,
      })

      // Aguardar que a página esteja completamente carregada e estilos aplicados
      // Usar waitForLoadState para garantir que não há recursos pendentes
      await page.waitForLoadState('networkidle', { timeout: timeoutMs }).catch(() => {
        // Se networkidle falhar (pode acontecer se bloqueamos requests), continuar
      })
      
      // Aguardar um pouco mais para garantir que todos os estilos CSS sejam aplicados
      // Isso é especialmente importante para gradientes e estilos complexos
      await page.waitForTimeout(200)
      
      // Verificar se estilos foram aplicados usando waitForFunction
      // Isso garante que pelo menos um elemento com classe CSS existe e tem estilos aplicados
      await page.waitForFunction(
        () => {
          const svgMain = document.getElementById('svg-main')
          if (!svgMain) return false
          // Verificar se há elementos com classes Duolingo (indicando que CSS foi aplicado)
          const hasDuolingoElements = svgMain.querySelector('.duolingo-list-item, .duolingo-streak-card, .duolingo-xp-card')
          if (hasDuolingoElements) {
            // Verificar se o elemento tem estilos computados (não apenas classes)
            const computedStyle = window.getComputedStyle(hasDuolingoElements as Element)
            return computedStyle.display !== '' && computedStyle.display !== 'none'
          }
          return true // Se não há elementos Duolingo, assumir que está OK
        },
        { timeout: timeoutMs }
      ).catch(() => {
        // Se a verificação falhar, continuar mesmo assim (pode não haver elementos Duolingo)
      })

      // Measure height using scrollHeight (most reliable)
      // Medir o #svg-main especificamente, que é o container real do conteúdo
      const height = await page.evaluate(() => {
        const svgMain = document.getElementById('svg-main')
        if (svgMain) {
          // Usar scrollHeight do #svg-main (container real)
          return Math.max(svgMain.scrollHeight, 10) // Minimum 10px
        }
        // Fallback para documentElement/body se #svg-main não existir
        const docHeight = document.documentElement.scrollHeight
        const bodyHeight = document.body?.scrollHeight || 0
        return Math.max(docHeight, bodyHeight, 10) // Minimum 10px
      })

      const duration = Date.now() - startTime
      const roundedHeight = Math.ceil(height)

      console.log(`[MeasureHeight] ✅ Measured height: ${roundedHeight}px (took ${duration}ms)`)

      return roundedHeight
    } finally {
      await page.close().catch(console.error)
    }
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`[MeasureHeight] ❌ Measurement failed after ${duration}ms:`, error)
    
    // Sem fallback - propagar erro
    throw new Error(`Failed to measure height: ${error instanceof Error ? error.message : String(error)}`)
  }
}


