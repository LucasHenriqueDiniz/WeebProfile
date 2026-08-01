import type { CloudflareEnv } from "./auth"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"

/**
 * Shared transport + config-shaping for calling the svg-generator Worker.
 *
 * This used to be copy-pasted into every caller (cron, manual regenerate and a
 * now-deleted preview route), and the copies had already drifted -- one of them
 * had lost the DATABASE_UNREACHABLE branch. Keep it in one place.
 */

const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 4000,
  timeoutMs: 60000,
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isRetryableError(error: any): boolean {
  if (!error) return false
  const msg = error.message?.toLowerCase() || String(error).toLowerCase()
  const code = error.code?.toLowerCase() || ""
  return [
    "econnreset",
    "econnrefused",
    "etimedout",
    "timeout",
    "aborted",
    "network",
    "fetch failed",
    "socket hang up",
  ].some((p) => msg.includes(p) || code.includes(p))
}

async function retryWithBackoff<T>(fn: () => Promise<T>, attempt = 1): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (!isRetryableError(error) || attempt >= RETRY_CONFIG.maxRetries) throw error
    const delay = Math.min(RETRY_CONFIG.initialDelayMs * Math.pow(2, attempt - 1), RETRY_CONFIG.maxDelayMs)
    await sleep(delay)
    return retryWithBackoff(fn, attempt + 1)
  }
}

/**
 * Calls the generator, preferring the SVG_GENERATOR service binding over a public
 * HTTP hop. The URL fallback exists for local dev (`wrangler pages dev` against a
 * separate `wrangler dev` generator on :3001), and lets this land before the
 * binding is configured -- see the ordering notes on the "close the generator" task.
 *
 * The hostname below is ignored when the service binding is used; only the method,
 * headers and body reach the target Worker.
 */
export async function generateSvgViaService(config: Record<string, any>, env: CloudflareEnv) {
  return retryWithBackoff(async () => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), RETRY_CONFIG.timeoutMs)
    try {
      const init: RequestInit = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
        signal: controller.signal,
      }

      const response = env.SVG_GENERATOR
        ? await env.SVG_GENERATOR.fetch("https://svg-generator/", init as any)
        : await fetch(env.SVG_GENERATOR_URL || "http://localhost:3001", init)

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error = (await response.json().catch(() => ({ error: "Unknown error" }))) as any
        if (response.status === 503 && (error.code === "DATABASE_UNREACHABLE" || error.code === "D1_API_UNREACHABLE")) {
          const dbError = new Error(error.message || "Generator could not reach database")
          ;(dbError as any).code = error.code
          ;(dbError as any).details = error.details
          ;(dbError as any).retryable = false
          throw dbError
        }
        if (response.status >= 500) {
          const retryableError = new Error(error.error || error.message || `HTTP ${response.status}`)
          ;(retryableError as any).code = "HTTP_" + response.status
          throw retryableError
        }
        if (error.code || error.missing) {
          const structuredError = new Error(error.message || error.error || `HTTP ${response.status}`)
          ;(structuredError as any).code = error.code
          ;(structuredError as any).missing = error.missing
          throw structuredError
        }
        throw new Error(error.error || error.message || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === "AbortError") {
        const timeoutError = new Error("Request timeout - service may be starting up")
        ;(timeoutError as any).code = "ETIMEDOUT"
        throw timeoutError
      }
      throw error
    }
  })
}

export function convertSvgToPluginsConfig(svg: Record<string, any>) {
  const svgPluginsConfig =
    (typeof svg.pluginsConfig === "string" ? JSON.parse(svg.pluginsConfig) : svg.pluginsConfig) ||
    ({} as Record<string, any>)

  const validPluginNames = new Set(Object.keys(PLUGINS_METADATA))
  const enabledPlugins: Record<string, any> = {}

  for (const [pluginName, pluginConfig] of Object.entries(svgPluginsConfig)) {
    if (!validPluginNames.has(pluginName)) continue
    const plugin = pluginConfig as any
    const isEnabled = plugin.enabled === true
    const hasSections = plugin.sections && Array.isArray(plugin.sections) && plugin.sections.length > 0
    if (isEnabled && hasSections) {
      enabledPlugins[pluginName] = pluginConfig
    }
  }

  // undefined (not []) when there's no stored order, so the generator's
  // `config.pluginsOrder || Object.keys(pluginsConfig)` fallback actually triggers --
  // `[] || x` evaluates to `[]` since an empty array is truthy in JS.
  const parsedOrder = svg.pluginsOrder ? svg.pluginsOrder.split(",").filter(Boolean) : []

  return {
    plugins: enabledPlugins,
    pluginsOrder: parsedOrder.length > 0 ? parsedOrder : undefined,
  }
}

export function getTerminalConfigs(uiConfig: Record<string, any> | null | undefined) {
  const config = uiConfig || {}
  return {
    hideTerminalEmojis: config.hideTerminalEmojis ?? false,
    hideTerminalHeader: config.hideTerminalHeader ?? false,
    hideTerminalCommand: config.hideTerminalCommand ?? false,
    fontFamily: config.fontFamily ?? "poppins",
    terminalHeaderText: typeof config.terminalHeaderText === "string" ? config.terminalHeaderText.trim() : "",
  }
}
