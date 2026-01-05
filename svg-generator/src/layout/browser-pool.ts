/**
 * Browser Pool for Playwright
 * 
 * Manages a pool of browser contexts and pages for efficient height measurement.
 * Pages are pre-loaded with skeleton HTML and reused across measurements.
 */

import { type BrowserContext, type Page } from 'playwright-core'
import { getBrowser } from './browser.js'

export interface MeasureWorker {
  context: BrowserContext
  page: Page
  createdAt: number
}

interface PendingItem {
  resolve: (worker: MeasureWorker) => void
  reject: (error: Error) => void
  timeout: NodeJS.Timeout
  settled: boolean
}

const SKELETON_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script>
    // esbuild/tsup helper no-op (avoids "__name is not defined" inside page.evaluate)
    // This runs before any other script execution
    var __name = function(target, _name) { return target; };
  </script>
  <style id="weeb-css"></style>
  <style>
    html, body {
      margin: 0;
      padding: 0;
    }
    body {
      overflow: hidden;
    }
    #svg-main {
      width: var(--w, 415px);
    }
    /* Desabilitar animações/transitions para determinismo e performance */
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
    }
  </style>
</head>
<body>
  <div id="svg-main"></div>
</body>
</html>`

export class MeasurePool {
  private idle: MeasureWorker[] = []
  private pending: PendingItem[] = []
  private poolSize: number
  private acquireTimeout: number
  private initPromise: Promise<void> | null = null
  private closed = false

  constructor() {
    this.poolSize = parseInt(process.env.PLAYWRIGHT_POOL_SIZE || '3', 10)
    this.acquireTimeout = 10000 // 10s default
  }

  /**
   * Initialize pool (lazy, protected against race conditions)
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
      throw new Error('Pool is closed')
    }

    const browser = await getBrowser()

    // Create N contexts (one per worker)
    const contexts: BrowserContext[] = []
    for (let i = 0; i < this.poolSize; i++) {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        ignoreHTTPSErrors: true,
        javaScriptEnabled: true,
        bypassCSP: true,
        locale: 'en-US',
        timezoneId: 'UTC',
      })

      // Add init script to context (runs for all pages in this context)
      // This must be done BEFORE creating pages
      await context.addInitScript({
        content: `
          // esbuild/tsup helper no-op (avoids "__name is not defined" inside page.evaluate)
          var __name = function(target, _name) { return target; };
        `,
      })

      // Configure route blocking once per context (always block network, except data:/blob:)
      await context.route('**/*', (route) => {
        const url = route.request().url()
        if (url.startsWith('data:') || url.startsWith('blob:')) {
          route.continue()
        } else {
          // Block external requests (images, fonts, APIs, etc)
          route.abort()
        }
      })

      contexts.push(context)
    }

    // Create N pages (one per context) and load skeleton HTML
    for (const context of contexts) {
      const page = await context.newPage()
      
      // Load skeleton HTML once per page
      // The addInitScript from context will run automatically before this
      await page.setContent(SKELETON_HTML, {
        waitUntil: 'domcontentloaded',
      })

      const worker: MeasureWorker = {
        context,
        page,
        createdAt: Date.now(),
      }

      this.idle.push(worker)
    }

    if (process.env.DEBUG_PLAYWRIGHT === '1') {
      console.log(`[MeasurePool] ✅ Initialized with ${this.poolSize} workers`)
    }
  }

  /**
   * Acquire a worker from the pool
   */
  async acquire(timeoutMs = this.acquireTimeout): Promise<MeasureWorker> {
    await this.init() // Wait for init if necessary

    // If worker available, return immediately
    if (this.idle.length > 0) {
      return this.idle.shift()!
    }

    // If pool full, add to queue
    return new Promise((resolve, reject) => {
      const pendingItem: PendingItem = {
        resolve,
        reject,
        timeout: setTimeout(() => {
          pendingItem.settled = true
          // Remove from queue
          const index = this.pending.indexOf(pendingItem)
          if (index > -1) {
            this.pending.splice(index, 1)
          }

          const pendingCount = this.pending.length
          console.error(`[MeasurePool] ❌ Acquire timeout (${timeoutMs}ms). Pending: ${pendingCount}`)
          reject(new Error(`Acquire timeout: pool busy (${pendingCount} pending)`))
        }, timeoutMs),
        settled: false,
      }

      this.pending.push(pendingItem)
    })
  }

  /**
   * Release a worker back to the pool
   */
  async release(worker: MeasureWorker): Promise<void> {
    // Clean page before releasing
    await worker.page.evaluate(() => {
      const svgMain = document.getElementById('svg-main')
      if (svgMain) {
        svgMain.innerHTML = ''
      }

      const cssEl = document.getElementById('weeb-css')
      if (cssEl) {
        cssEl.textContent = ''
      }
    })

    // Add back to pool
    this.idle.push(worker)

    // Process queue if any (only resolve if not settled)
    this.processQueue()
  }

  /**
   * Process pending queue
   */
  private processQueue(): void {
    // Remove settled items from queue first
    this.pending = this.pending.filter((item) => !item.settled)

    // Process queue: resolve pending items while workers available
    while (this.idle.length > 0 && this.pending.length > 0) {
      const pendingItem = this.pending.shift()!
      if (!pendingItem.settled) {
        pendingItem.settled = true
        clearTimeout(pendingItem.timeout)
        pendingItem.resolve(this.idle.shift()!)
      }
    }
  }

  /**
   * Close all workers and contexts
   */
  async close(): Promise<void> {
    this.closed = true

    // Reject all pending
    for (const pendingItem of this.pending) {
      if (!pendingItem.settled) {
        pendingItem.settled = true
        clearTimeout(pendingItem.timeout)
        pendingItem.reject(new Error('Pool closed'))
      }
    }
    this.pending = []

    // Close all workers
    const closePromises = this.idle.map(async (worker) => {
      await worker.page.close().catch(console.error)
      await worker.context.close().catch(console.error)
    })

    await Promise.all(closePromises)
    this.idle = []
  }
}

// Singleton instance
let poolInstance: MeasurePool | null = null

/**
 * Get the singleton pool instance
 */
export function getMeasurePool(): MeasurePool {
  if (!poolInstance) {
    poolInstance = new MeasurePool()

    // Setup graceful shutdown
    const shutdown = async () => {
      if (process.env.DEBUG_PLAYWRIGHT === '1') {
        console.log('[MeasurePool] 🛑 Shutting down pool...')
      }
      await poolInstance?.close().catch(console.error)
      poolInstance = null
    }

    process.once('SIGINT', shutdown)
    process.once('SIGTERM', shutdown)
    process.once('exit', shutdown)
  }

  return poolInstance
}

