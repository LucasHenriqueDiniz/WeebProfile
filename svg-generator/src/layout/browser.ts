/**
 * Browser Singleton for Playwright
 * 
 * Manages a single browser instance that is reused across measurements.
 * Uses playwright-core to avoid automatic browser downloads.
 * 
 * Prefers system-installed browsers (msedge/chrome) via channels.
 */

import { chromium, type Browser } from 'playwright-core'

let browserInstance: Browser | null = null

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
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
        '--disable-default-apps',
        '--disable-sync',
        '--no-first-run',
        '--no-default-browser-check',
        '--metrics-recording-only',
        '--mute-audio',
      ],
    })

    console.log(`[Browser] ✅ Browser launched successfully`)

    // Setup graceful shutdown
    const shutdown = () => {
      console.log('[Browser] 🛑 Shutting down browser...')
      browserInstance?.close().catch(console.error)
      browserInstance = null
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
 * Close browser instance (for cleanup/testing)
 */
export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close().catch(console.error)
    browserInstance = null
  }
}

