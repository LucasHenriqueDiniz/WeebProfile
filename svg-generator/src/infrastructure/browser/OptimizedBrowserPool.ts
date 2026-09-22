/**
 * Optimized Browser Pool for Playwright
 *
 * Melhorias implementadas:
 * - Pool dinâmico com auto-scaling
 * - Health checks e reciclagem automática
 * - Métricas de performance
 * - Configurações otimizadas para SVG measurement
 * - Timeout adaptativo
 * - Pre-warming de workers
 */

import { type BrowserContext, type Page } from "playwright-core"
import { LoggerFactory } from "../../infrastructure/logging/LoggerFactory"
import { getBrowser } from "./browser.js"

export interface MeasureWorker {
  context: BrowserContext
  page: Page
  createdAt: number
  lastUsed: number
  healthStatus: "healthy" | "warning" | "error"
  measurementCount: number
  errorCount: number
}

interface PendingItem {
  resolve: (worker: MeasureWorker) => void
  reject: (error: Error) => void
  timeout: NodeJS.Timeout
  settled: boolean
  startTime: number
}

interface PoolMetrics {
  totalRequests: number
  averageWaitTime: number
  successRate: number
  poolUtilization: number
  errorRate: number
  recycleCount: number
}

const OPTIMIZED_SKELETON_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script>
    // esbuild/tsup helper no-op (avoids "__name is not defined" inside page.evaluate)
    var __name = function(target, _name) { return target; };
    
    // Pre-warm performance optimizations
    if (!window.performanceObserver) {
      window.performanceObserver = new PerformanceObserver(() => {});
      performanceObserver.observe({ entryTypes: ['measure', 'navigation'] });
    }
  </script>
  <style id="weeb-css"></style>
  <style>
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      box-sizing: border-box !important;
    }
    body {
      overflow: hidden !important;
      background: white !important;
    }
    #svg-main {
      width: var(--w, 415px);
      min-height: 100px;
    }
    /* Performance optimizations */
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
      will-change: auto !important;
      contain: layout style paint !important;
    }
    /* Font loading optimization */
    @font-face {
      font-display: swap;
    }
    /* Reduce paint operations */
    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  </style>
</head>
<body>
  <div id="svg-main"></div>
</body>
</html>`

export class OptimizedMeasurePool {
  private idle: MeasureWorker[] = []
  private pending: PendingItem[] = []
  private minPoolSize: number
  private maxPoolSize: number
  private currentPoolSize: number
  private acquireTimeout: number
  private initPromise: Promise<void> | null = null
  private closed = false
  private metrics: PoolMetrics = {
    totalRequests: 0,
    averageWaitTime: 0,
    successRate: 100,
    poolUtilization: 0,
    errorRate: 0,
    recycleCount: 0,
  }
  private healthCheckInterval: NodeJS.Timeout | null = null
  private logger = LoggerFactory.getLogger("OptimizedMeasurePool")
  private lastRecycleTime = 0
  private recycleInterval = 5 * 60 * 1000 // 5 minutos

  constructor() {
    // Configurações otimizadas
    this.minPoolSize = parseInt(process.env.PLAYWRIGHT_MIN_POOL_SIZE || "2", 10)
    this.maxPoolSize = parseInt(process.env.PLAYWRIGHT_MAX_POOL_SIZE || "8", 10)
    this.currentPoolSize = this.minPoolSize
    this.acquireTimeout = 15000 // 15s timeout adaptativo

    this.logger.info(`OptimizedMeasurePool initialized: min=${this.minPoolSize}, max=${this.maxPoolSize}`)
  }

  /**
   * Initialize pool with auto-scaling
   */
  async init(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise
    }

    this.initPromise = this.initInternal()
    return this.initPromise
  }

  private async initInternal(): Promise<void> {
    if (this.closed) {
      throw new Error("Pool is closed")
    }

    const browser = await getBrowser()

    // Create initial pool
    await this.createWorkers(browser, this.currentPoolSize)

    // Iniciar health checks
    this.startHealthChecks()

    this.logger.info(`OptimizedMeasurePool initialized with ${this.currentPoolSize} workers`)
  }

  /**
   * Create workers com configurações otimizadas
   */
  private async createWorkers(browser: any, count: number): Promise<void> {
    const contexts: BrowserContext[] = []

    for (let i = 0; i < count; i++) {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        ignoreHTTPSErrors: true,
        javaScriptEnabled: true,
        bypassCSP: true,
        locale: "en-US",
        timezoneId: "UTC",
        // Otimizações de performance
        serviceWorkers: "block",
        forcedColors: "light",
        reducedMotion: "reduce",
        // Configurações de rede
        offline: true,
        httpCredentials: "include",
        // Timeout otimizado
        defaultNavigationTimeout: 15000,
        defaultTimeout: 10000,
      })

      // Add init script com otimizações
      await context.addInitScript({
        content: `
          var __name = function(target, _name) { return target; };
          
          // Pre-warm common operations
          window.measureHeight = function(element) {
            return element.getBoundingClientRect().height;
          };
          
          // Performance monitoring
          window.performance.mark('pool-ready');
        `,
      })

      // Configurar routing otimizado
      await context.route("**/*", (route: any) => {
        const url = route.request().url()
        if (url.startsWith("data:") || url.startsWith("blob:")) {
          route.continue()
        } else {
          route.abort()
        }
      })

      contexts.push(context)
    }

    // Create pages com skeleton HTML otimizado
    for (const context of contexts) {
      const page = await context.newPage({
        // Otimizações de performance para página
        screen: { width: 1920, height: 1080 },
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        ignoreHTTPSErrors: true,
        javaScriptEnabled: true,
        bypassCSP: true,
        // Otimizações de renderização
        isMobile: false,
        hasTouch: false,
        colorScheme: "light",
        reducedMotion: "reduce",
        forcedColors: "light",
        // Timeout otimizado
        defaultNavigationTimeout: 10000,
        defaultTimeout: 5000,
      })

      // Carregar HTML otimizado
      await page.setContent(OPTIMIZED_SKELETON_HTML, {
        waitUntil: "domcontentloaded",
        timeout: 5000,
      })

      // Pre-warm page
      await page.evaluate(() => {
        // Pre-warm common operations
        const main = document.getElementById("svg-main")
        if (main) {
          main.style.width = "415px"
          main.style.minHeight = "100px"
        }

        // Marcar como pronto para uso
        window.performance.mark("page-ready")
      })

      const worker: MeasureWorker = {
        context,
        page,
        createdAt: Date.now(),
        lastUsed: Date.now(),
        healthStatus: "healthy",
        measurementCount: 0,
        errorCount: 0,
      }

      this.idle.push(worker)
    }

    this.updateMetrics()
  }

  /**
   * Adquire worker com timeout adaptativo
   */
  async acquire(): Promise<MeasureWorker> {
    if (this.closed) {
      throw new Error("Pool is closed")
    }

    // Verificar se há workers disponíveis
    if (this.idle.length === 0) {
      // Tentar expandir pool se necessário
      if (this.currentPoolSize < this.maxPoolSize) {
        await this.expandPool()
      } else {
        // Esperar por worker ficar disponível
        await this.waitForAvailableWorker()
      }
    }

    const worker = this.idle.pop()!
    worker.lastUsed = Date.now()
    worker.measurementCount++

    this.updateMetrics()
    this.logger.debug("Worker acquired", {
      poolSize: this.currentPoolSize,
      idleWorkers: this.idle.length,
      pendingRequests: this.pending.length,
    })

    return worker
  }

  /**
   * Release worker de volta para o pool
   */
  release(worker: MeasureWorker): void {
    if (this.closed) {
      return
    }

    if (worker.healthStatus === "error") {
      // Worker com erro não volta para o pool
      this.recycleWorker(worker)
      return
    }

    worker.lastUsed = Date.now()
    this.idle.push(worker)

    // Verificar se pode reduzir o pool
    this.considerPoolReduction()

    this.updateMetrics()
    this.logger.debug("Worker released", {
      poolSize: this.currentPoolSize,
      idleWorkers: this.idle.length,
    })
  }

  /**
   * Expandir pool dinamicamente
   */
  private async expandPool(): Promise<void> {
    if (this.currentPoolSize >= this.maxPoolSize) {
      return
    }

    const newSize = Math.min(this.currentPoolSize + 2, this.maxPoolSize)
    const browser = await getBrowser()

    this.logger.info(`Expanding pool from ${this.currentPoolSize} to ${newSize}`)

    await this.createWorkers(browser, newSize - this.currentPoolSize)
    this.currentPoolSize = newSize
    this.updateMetrics()
  }

  /**
   * Reduzir pool se estiver subutilizado
   */
  private considerPoolReduction(): void {
    if (
      this.currentPoolSize <= this.minPoolSize ||
      this.idle.length < this.currentPoolSize * 0.5 ||
      Date.now() - this.lastRecycleTime < this.recycleInterval
    ) {
      return
    }

    const workersToRemove = Math.min(this.idle.length - this.minPoolSize, Math.floor(this.currentPoolSize * 0.25))

    if (workersToRemove > 0) {
      this.logger.info(`Reducing pool by ${workersToRemove} workers`)

      // Fechar workers de forma síncrona
      const workersToClose: MeasureWorker[] = []
      for (let i = 0; i < workersToRemove; i++) {
        const worker = this.idle.pop()
        if (worker) {
          workersToClose.push(worker)
        }
      }

      // Fechar em paralelo
      await Promise.all(workersToClose.map((worker) => this.safeCloseWorker(worker)))

      this.currentPoolSize -= workersToRemove
      this.lastRecycleTime = Date.now()
      this.metrics.recycleCount += workersToRemove
      this.updateMetrics()
    }
  }

  /**
   * Aguardar por worker disponível
   */
  private async waitForAvailableWorker(): Promise<MeasureWorker> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Acquire timeout after ${this.acquireTimeout}ms`))
      }, this.acquireTimeout)

      this.pending.push({ resolve, reject, timeout, settled: false, startTime: Date.now() })
    })
  }

  /**
   * Iniciar health checks periódicos
   */
  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck()
    }, 30000) // A cada 30 segundos
  }

  /**
   * Realizar health check nos workers
   */
  private async performHealthCheck(): Promise<void> {
    for (const worker of [
      ...this.idle,
      ...this.pending
        .map((p) => p.resolve)
        .map(() => null)
        .filter(Boolean),
    ]) {
      if (!worker) continue

      try {
        // Verificar se página está responsiva
        await worker.page.evaluate(() => {
          return document.readyState === "complete"
        })

        if (worker.healthStatus !== "healthy") {
          worker.healthStatus = "healthy"
          worker.errorCount = 0
        }
      } catch (error) {
        worker.healthStatus = "error"
        worker.errorCount++

        if (worker.errorCount > 3) {
          this.logger.warn(`Worker marked for recycling due to errors`, {
            errorCount: worker.errorCount,
          })
        }
      }
    }

    // Remover workers com erro crônico
    const workersToRecycle = this.idle.filter((w) => w.healthStatus === "error")
    for (const worker of workersToRecycle) {
      this.idle = this.idle.filter((w) => w !== worker)
      this.recycleWorker(worker)
    }
  }

  /**
   * Atualizar métricas do pool
   */
  private updateMetrics(): void {
    const totalWorkers = this.idle.length + this.pending.length
    this.metrics.poolUtilization = ((this.currentPoolSize - this.idle.length) / this.currentPoolSize) * 100

    // Calcular taxa de sucesso baseada em medições recentes
    const allWorkers = [
      ...this.idle,
      ...this.pending
        .map((p) => p.resolve)
        .map(() => null)
        .filter(Boolean),
    ]
    const recentMeasurements = allWorkers.reduce((sum: number, w) => sum + w.measurementCount, 0)

    if (recentMeasurements > 0) {
      const recentErrors = allWorkers.reduce((sum: number, w) => sum + w.errorCount, 0)
      this.metrics.errorRate = (recentErrors / recentMeasurements) * 100
      this.metrics.successRate = 100 - this.metrics.errorRate
    }
  }

  /**
   * Reciclar worker com erro
   */
  private async recycleWorker(worker: MeasureWorker): Promise<void> {
    try {
      this.logger.debug("Recycling worker", {
        measurementCount: worker.measurementCount,
        errorCount: worker.errorCount,
      })

      await this.safeCloseWorker(worker)
      this.metrics.recycleCount++
    } catch (error) {
      this.logger.error("Error recycling worker", error instanceof Error ? error : new Error(String(error)))
    }
  }

  /**
   * Fechar worker de forma segura
   */
  private async safeCloseWorker(worker: MeasureWorker): Promise<void> {
    try {
      await worker.page.close()
      await worker.context.close()
    } catch (error) {
      this.logger.warn("Error closing worker", error instanceof Error ? error : new Error(String(error)))
    }
  }

  /**
   * Obter métricas do pool
   */
  getMetrics(): PoolMetrics {
    return { ...this.metrics }
  }

  /**
   * Fechar pool completamente
   */
  async close(): Promise<void> {
    if (this.closed) {
      return
    }

    this.closed = true

    // Limpar health checks
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
    }

    // Rejeitar requisições pendentes
    for (const pending of this.pending) {
      pending.reject(new Error("Pool is closing"))
    }
    this.pending = []

    // Fechar todos os workers
    const allWorkers = [...this.idle]
    this.idle = []

    await Promise.all(allWorkers.map((worker) => this.safeCloseWorker(worker)))
    this.logger.info("OptimizedMeasurePool closed")
  }

  /**
   * Verificar se Playwright está disponível
   */
  static isPlaywrightAvailable(): boolean {
    try {
      // Verificar se Playwright está instalado
      require("playwright-core")
      return true
    } catch {
      return false
    }
  }
}
