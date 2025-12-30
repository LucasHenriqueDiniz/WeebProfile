/**
 * Cliente para o svg-generator HTTP service
 *
 * Este arquivo faz requisições HTTP para o serviço svg-generator,
 * que é responsável por buscar essential configs e gerar SVGs.
 */

interface GenerateSvgRequest {
  style: string
  size: string
  plugins?: Record<string, any>
  pluginsOrder?: string[]
  customCss?: string
  theme?: string // Generic theme (mapped by server based on style)
  terminalTheme?: string
  defaultTheme?: string
  hideTerminalEmojis?: boolean
  hideTerminalHeader?: boolean
  customThemeColors?: Record<string, string>
  userId?: string // userId para buscar essential configs no Supabase
  mock?: boolean
  debug?: boolean
}

interface GenerateSvgResponse {
  success: boolean
  svg: string
  width: number
  height: number
  debug?: {
    config: any
    pluginsData: any
    pluginsErrors: any
  }
}

import { env } from "./config/env"

/**
 * Retry configuration for handling cold starts
 */
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 1000, // 1 second
  maxDelayMs: 4000, // 4 seconds
  timeoutMs: 60000, // 60 seconds (give Railway time to wake up)
}

/**
 * Check if an error is retryable (connection errors, timeouts, etc.)
 */
function isRetryableError(error: any): boolean {
  if (!error) return false

  const errorMessage = error.message?.toLowerCase() || String(error).toLowerCase()
  const errorCode = error.code?.toLowerCase() || ""

  // Connection errors that indicate cold start
  const retryablePatterns = [
    "econnreset",
    "econnrefused",
    "etimedout",
    "timeout",
    "aborted",
    "network",
    "fetch failed",
    "socket hang up",
  ]

  return retryablePatterns.some((pattern) => errorMessage.includes(pattern) || errorCode.includes(pattern))
}

/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Retry a function with exponential backoff
 */
async function retryWithBackoff<T>(fn: () => Promise<T>, attempt: number = 1): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    // If not retryable or max retries reached, throw
    if (!isRetryableError(error) || attempt >= RETRY_CONFIG.maxRetries) {
      throw error
    }

    // Calculate delay with exponential backoff
    const delay = Math.min(RETRY_CONFIG.initialDelayMs * Math.pow(2, attempt - 1), RETRY_CONFIG.maxDelayMs)

    console.log(
      `🔄 [CLIENT] Retry attempt ${attempt}/${RETRY_CONFIG.maxRetries} after ${delay}ms (error: ${error instanceof Error ? error.message : String(error)})`
    )

    await sleep(delay)
    return retryWithBackoff(fn, attempt + 1)
  }
}

/**
 * Gera SVG usando o svg-generator HTTP service
 *
 * Inclui retry automático com backoff exponencial para lidar com cold starts do Railway.
 *
 * @param config - Configuração do SVG
 * @returns Resultado da geração
 */
export async function generateSvgViaHttpService(config: GenerateSvgRequest): Promise<GenerateSvgResponse> {
  const svgGeneratorUrl = env.svgGeneratorUrl

  console.log(`📤 [CLIENT] Sending request to ${svgGeneratorUrl}`)
  console.log(`📤 [CLIENT] Request config:`, JSON.stringify(config, null, 2))

  return retryWithBackoff(async () => {
    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), RETRY_CONFIG.timeoutMs)

    try {
      const response = await fetch(svgGeneratorUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }))
        console.error(`📤 [CLIENT] Error response:`, error)

        // Treat 5xx errors as potentially retryable (server might be starting)
        if (response.status >= 500 && response.status < 600) {
          const retryableError = new Error(error.error || error.message || `HTTP ${response.status}`)
          ;(retryableError as any).code = "HTTP_" + response.status
          throw retryableError
        }

        throw new Error(error.error || error.message || `HTTP ${response.status}`)
      }

      const result = await response.json()
      console.log(`📤 [CLIENT] Success response received, SVG size: ${result.width}x${result.height}`)
      return result
    } catch (error) {
      clearTimeout(timeoutId)

      // Handle AbortError (timeout)
      if (error instanceof Error && error.name === "AbortError") {
        const timeoutError = new Error("Request timeout - service may be starting up")
        ;(timeoutError as any).code = "ETIMEDOUT"
        throw timeoutError
      }

      throw error
    }
  })
}
