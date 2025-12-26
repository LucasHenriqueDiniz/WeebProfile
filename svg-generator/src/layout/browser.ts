/**
 * Browser Singleton for Playwright
 * 
 * Manages a single browser instance that is reused across measurements.
 * Uses playwright-core to avoid automatic browser downloads.
 * 
 * Prefers system-installed browsers (msedge/chrome) via channels.
 */

import { chromium, type Browser, type BrowserContext } from 'playwright-core'

let browserInstance: Browser | null = null
let browserContext: BrowserContext | null = null

/**
 * Get the browser channel from environment or default
 * 
 * Recomendações:
 * - Windows (dev): 'msedge' (Edge geralmente já está instalado)
 * - Linux/Mac (dev): 'chrome' (Chrome geralmente já está instalado)
 * - Railway/CI (produção): 'chromium' (precisa instalar via playwright install)
 * 
 * Para Railway, use 'chromium' e instale com:
 * npx playwright install chromium --with-deps
 */
function getBrowserChannel(): 'msedge' | 'chrome' | 'chromium' | undefined {
  const envChannel = process.env.PLAYWRIGHT_CHANNEL
  if (envChannel === 'msedge' || envChannel === 'chrome' || envChannel === 'chromium') {
    return envChannel
  }
  
  // Railway/CI: usar chromium (mais leve e confiável para produção)
  if (process.env.RAILWAY_ENVIRONMENT || process.env.CI) {
    return 'chromium'
  }
  
  // Dev local: prefer msedge on Windows, chrome on others
  if (process.platform === 'win32') {
    return 'msedge'
  }
  
  return 'chrome'
}

/**
 * Initialize browser instance (lazy, singleton)
 */
export async function getBrowser(): Promise<Browser> {
  if (browserInstance) {
    return browserInstance
  }

  const channel = getBrowserChannel()
  console.log(`[Browser] 🚀 Launching browser (channel: ${channel || 'default'})...`)

  try {
    browserInstance = await chromium.launch({
      channel,
      headless: true,
      // Otimizações para Railway (economiza memória)
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-software-rasterizer',
        '--disable-extensions',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    })

    console.log(`[Browser] ✅ Browser launched successfully`)

    // Setup graceful shutdown
    const shutdown = () => {
      console.log('[Browser] 🛑 Shutting down browser...')
      browserInstance?.close().catch(console.error)
      browserInstance = null
      browserContext = null
    }

    process.once('SIGINT', shutdown)
    process.once('SIGTERM', shutdown)
    process.once('exit', shutdown)

    return browserInstance
  } catch (error) {
    console.error('[Browser] ❌ Failed to launch browser:', error)
    throw error
  }
}

/**
 * Get or create a browser context (reused across measurements)
 */
export async function getBrowserContext(): Promise<BrowserContext> {
  if (browserContext) {
    return browserContext
  }

  const browser = await getBrowser()
  browserContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    // Otimizações para medição de altura (economiza memória e recursos)
    ignoreHTTPSErrors: true,
    javaScriptEnabled: true, // Necessário para medir scrollHeight
    bypassCSP: true,
    // Desabilitar recursos desnecessários para medição
    locale: 'en-US',
    timezoneId: 'UTC',
  })

  console.log('[Browser] ✅ Browser context created')
  return browserContext
}

/**
 * Close browser instance (for cleanup/testing)
 */
export async function closeBrowser(): Promise<void> {
  if (browserContext) {
    await browserContext.close().catch(console.error)
    browserContext = null
  }
  if (browserInstance) {
    await browserInstance.close().catch(console.error)
    browserInstance = null
  }
}

