/**
 * Layout Height Measurer using Playwright
 *
 * Measures the rendered height of HTML content given a width.
 * Uses Playwright with page pool for efficient measurement.
 */

import { type Page } from "playwright-core"
import { getMeasurePool } from "./browser-pool.js"
import type { MeasureWorker } from "./browser-pool.js"

export interface MeasureHeightOptions {
  html: string
  width: number
  css?: string
  timeoutMs?: number
  allowNetwork?: boolean
  size?: "half" | "full"
  style?: "default" | "terminal"
}

const DEFAULT_TIMEOUT_MS = parseInt(process.env.PLAYWRIGHT_TIMEOUT_MS || "2500", 10)

/**
 * Wait for stable layout (fonts, images, RAF)
 * Neutralizes bundler helpers (__name) that leak into browser context
 */
async function waitStableLayout(page: Page, timeoutMs: number): Promise<void> {
  await page.evaluate(async function (timeoutMs) {
    const deadline = Date.now() + timeoutMs
    const remaining = () => Math.max(0, deadline - Date.now())

    const withTimeout = <T>(p: Promise<T>) =>
      Promise.race([p, new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), remaining()))])

    // fonts
    // @ts-ignore
    if (document.fonts?.ready) {
      // @ts-ignore
      await withTimeout(document.fonts.ready).catch(() => {})
    }

    // images (base64 => normalmente já vem instantâneo, decode só estabiliza)
    const imgs = Array.from(document.querySelectorAll("#svg-main img")) as HTMLImageElement[]
    for (const img of imgs) {
      if (img.complete) continue
      try {
        if (typeof img.decode === "function") {
          await withTimeout(img.decode()).catch(() => {})
        }
      } catch {
        // Ignore decode error
      }
    }

    await withTimeout(new Promise<void>((r) => requestAnimationFrame(() => r())))
    await withTimeout(new Promise<void>((r) => requestAnimationFrame(() => r())))
  }, timeoutMs)
}

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
    allowNetwork = process.env.ALLOW_NETWORK === "1",
    size = "half",
    style = "default",
  } = options

  const startTime = Date.now()
  const pool = getMeasurePool()

  let worker: MeasureWorker | null = null
  try {
    // Se allowNetwork=true, falhar explícito (não suportado com pool)
    if (allowNetwork) {
      throw new Error("allowNetwork=true not supported with page pool. Use allowNetwork=false or implement fallback.")
    }

    // Acquire worker com timeout
    worker = await pool.acquire(timeoutMs + 1000) // +1s para acquire não comer timeout da medição

    // Set viewport por request (height alto para evitar wrap/media queries)
    await worker.page.setViewportSize({ width, height: 4096 })

    // Update CSS and HTML via evaluate
    await worker.page.evaluate(
      ({ css, html, width, size, style }) => {
        // IMPORTANT: neutraliza helper do esbuild/tsup dentro do browser context
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const __name = (target: any, _value: string) => target

        // Atualizar CSS
        const styleEl = document.getElementById("weeb-css")
        if (styleEl) {
          styleEl.textContent = css || ""
        }

        // Atualizar HTML e aplicar classes no #svg-main
        // As classes são necessárias para a variante Tailwind half: funcionar
        const svgMain = document.getElementById("svg-main")
        if (svgMain) {
          // Aplicar classes: half/full + style (default/terminal) + flex flex-col relative
          svgMain.className = `${size} ${style} flex flex-col relative`
          svgMain.innerHTML = html || ""
        }

        // Setar --w no documentElement (não no #svg-main)
        document.documentElement.style.setProperty("--w", `${width}px`)
      },
      { css, html, width, size, style }
    )

    // Wait for stable layout
    await waitStableLayout(worker.page, timeoutMs)

    // Measure height via getBoundingClientRect
    const height = await worker.page.evaluate(() => {
      const svgMain = document.getElementById("svg-main")
      if (!svgMain) {
        return 10
      }

      const rect = svgMain.getBoundingClientRect()
      return Math.max(rect.height, 10) // Minimum 10px
    })

    const duration = Date.now() - startTime
    const roundedHeight = Math.ceil(height)

    // Logging apenas com flag ou amostra (1% das requests)
    if (process.env.DEBUG_PLAYWRIGHT === "1" || Math.random() < 0.01) {
      console.log(`[MeasureHeight] ✅ Measured height: ${roundedHeight}px (took ${duration}ms)`)
    }

    return roundedHeight
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`[MeasureHeight] ❌ Measurement failed after ${duration}ms:`, error)

    // Se erro de acquire timeout, retornar 503
    if (error instanceof Error && error.message.includes("acquire timeout")) {
      throw new Error(`Service busy: ${error.message}`)
    }

    throw new Error(`Failed to measure height: ${error instanceof Error ? error.message : String(error)}`)
  } finally {
    if (worker) {
      await pool.release(worker)
    }
  }
}
