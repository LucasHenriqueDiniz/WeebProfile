import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../_shared/auth"
import { serverError } from "../_shared/auth"

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

async function generateSvgViaHttpService(config: Record<string, any>, svgGeneratorUrl: string) {
  return retryWithBackoff(async () => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), RETRY_CONFIG.timeoutMs)
    try {
      const response = await fetch(svgGeneratorUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        const error = (await response.json().catch(() => ({ error: "Unknown error" }))) as any
        if (response.status >= 500) {
          const retryableError = new Error(error.error || error.message || `HTTP ${response.status}`)
          ;(retryableError as any).code = "HTTP_" + response.status
          throw retryableError
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

/**
 * POST /api/preview/generate - Generate preview SVG via svg-generator service
 */
export const onRequestPost: PagesFunction<CloudflareEnv> = async ({ request, env }) => {
  try {
    const body = (await request.json()) as Record<string, any>

    if (!body.style || !body.size) {
      return Response.json({ error: "style and size are required" }, { status: 400 })
    }

    const svgGeneratorUrl = env.SVG_GENERATOR_URL || "http://localhost:3001"
    const result = await generateSvgViaHttpService(body, svgGeneratorUrl)
    return Response.json(result)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    const isTimeout =
      errorMessage.includes("Vercel Runtime Timeout") ||
      errorMessage.includes("Task timed out after") ||
      errorMessage.includes("Function execution exceeded")

    if (
      isTimeout ||
      (error instanceof Error &&
        (error.message.includes("ECONNREFUSED") ||
          error.message.includes("ECONNRESET") ||
          error.message.includes("timeout")))
    ) {
      return Response.json(
        {
          error: "Service starting up",
          code: isTimeout ? "TIMEOUT" : "SERVICE_UNAVAILABLE",
          message: "The generation service is waking up. Please wait a few seconds and try again.",
          details: errorMessage,
          retryable: true,
        },
        { status: 503 }
      )
    }

    return Response.json(
      {
        error: "Failed to generate preview",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
