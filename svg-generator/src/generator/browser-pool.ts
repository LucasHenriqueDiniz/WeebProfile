/**
 * Browser Pool Manager
 * 
 * Gerencia um pool de browsers Playwright reutilizáveis.
 * Otimizado para Railway FREE tier (0.5GB RAM):
 * - Pool limitado a 1 browser
 * - Timeout para fechar após inatividade
 * - Restart automático em caso de erro
 */

import { chromium, type Browser, type BrowserContext } from 'playwright'

class BrowserPool {
  private static instance: BrowserPool
  private browser: Browser | null = null
  private lastUsed: number = 0
  private readonly INACTIVITY_TIMEOUT = 5 * 60 * 1000 // 5 minutos
  private readonly MAX_RETRIES = 3
  private isInitializing = false
  private initPromise: Promise<Browser> | null = null

  private constructor() {
    // Cleanup periódico
    setInterval(() => this.checkInactivity(), 60000) // Verifica a cada 1 minuto
    
    // Cleanup no shutdown
    process.on('SIGTERM', () => this.close())
    process.on('SIGINT', () => this.close())
  }

  public static getInstance(): BrowserPool {
    if (!BrowserPool.instance) {
      BrowserPool.instance = new BrowserPool()
    }
    return BrowserPool.instance
  }

  /**
   * Obtém ou cria um browser
   * Reutiliza browser existente se disponível
   */
  public async getBrowser(): Promise<Browser> {
    // Se já está inicializando, aguarda
    if (this.isInitializing && this.initPromise) {
      return await this.initPromise
    }

    // Se browser existe e está conectado, reutiliza
    if (this.browser && this.browser.isConnected()) {
      this.lastUsed = Date.now()
      return this.browser
    }

    // Cria novo browser
    this.isInitializing = true
    this.initPromise = this.createBrowser()
    
    try {
      this.browser = await this.initPromise
      this.lastUsed = Date.now()
      return this.browser
    } finally {
      this.isInitializing = false
      this.initPromise = null
    }
  }

  /**
   * Cria um novo browser com otimizações para Railway
   */
  private async createBrowser(): Promise<Browser> {
    let retries = 0
    
    while (retries < this.MAX_RETRIES) {
      try {
        console.log('[Browser Pool] 🚀 Launching browser...')
        
        const browser = await chromium.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-software-rasterizer',
            '--disable-extensions',
            '--disable-background-networking',
            '--disable-background-timer-throttling',
            '--disable-renderer-backgrounding',
            '--disable-backgrounding-occluded-windows',
            '--disable-ipc-flooding-protection',
            '--memory-pressure-off',
            '--max-old-space-size=256', // Limitar memória para Railway FREE tier
          ],
        })

        console.log('[Browser Pool] ✅ Browser launched successfully')
        return browser
      } catch (error) {
        retries++
        console.error(`[Browser Pool] ❌ Failed to launch browser (attempt ${retries}/${this.MAX_RETRIES}):`, error)
        
        if (retries >= this.MAX_RETRIES) {
          throw new Error(`Failed to launch browser after ${this.MAX_RETRIES} attempts: ${error instanceof Error ? error.message : String(error)}`)
        }
        
        // Aguarda antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, 1000 * retries))
      }
    }
    
    throw new Error('Failed to create browser')
  }

  /**
   * Cria um novo contexto (página) do browser
   */
  public async getContext(): Promise<BrowserContext> {
    const browser = await this.getBrowser()
    return await browser.newContext({
      viewport: { width: 1920, height: 1080 },
    })
  }

  /**
   * Verifica inatividade e fecha browser se necessário
   */
  private checkInactivity(): void {
    if (!this.browser) return
    
    const now = Date.now()
    const inactiveTime = now - this.lastUsed
    
    if (inactiveTime > this.INACTIVITY_TIMEOUT) {
      console.log('[Browser Pool] ⏰ Browser inactive for too long, closing...')
      this.close()
    }
  }

  /**
   * Fecha o browser e limpa recursos
   */
  public async close(): Promise<void> {
    if (this.browser) {
      try {
        console.log('[Browser Pool] 🔒 Closing browser...')
        await this.browser.close()
        console.log('[Browser Pool] ✅ Browser closed')
      } catch (error) {
        console.error('[Browser Pool] ⚠️ Error closing browser:', error)
      } finally {
        this.browser = null
        this.lastUsed = 0
      }
    }
  }

  /**
   * Força restart do browser (útil em caso de erro)
   */
  public async restart(): Promise<Browser> {
    console.log('[Browser Pool] 🔄 Restarting browser...')
    await this.close()
    return await this.getBrowser()
  }

  /**
   * Verifica se browser está disponível
   */
  public isAvailable(): boolean {
    return this.browser !== null && this.browser.isConnected()
  }
}

// Export singleton
export const browserPool = BrowserPool.getInstance()

