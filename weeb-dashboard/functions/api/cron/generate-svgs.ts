import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../_shared/auth"
import { serverError } from "../_shared/auth"
import { getDb } from "../_shared/db"
import { saveSvgToR2 } from "../_shared/storage"
import { assertGenerationSucceeded } from "../_shared/svg-generation-validation"
import { svgs } from "../../../lib/db/schema"
import { eq, or, lte, isNull, and, sql, lt } from "drizzle-orm"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"

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

function convertSvgToPluginsConfig(svg: Record<string, any>) {
  const svgPluginsConfig =
    (typeof svg.pluginsConfig === "string" ? JSON.parse(svg.pluginsConfig) : svg.pluginsConfig) ||
    ({} as Record<string, any>)

  const validPluginNames = new Set(Object.keys(PLUGINS_METADATA))
  const enabledPlugins: Record<string, any> = {}

  for (const [pluginName, pluginConfig] of Object.entries(svgPluginsConfig)) {
    if (!validPluginNames.has(pluginName)) continue
    const plugin = pluginConfig as any
    if (plugin.enabled === true && plugin.sections && Array.isArray(plugin.sections) && plugin.sections.length > 0) {
      enabledPlugins[pluginName] = pluginConfig
    }
  }

  // undefined (not []) when there's no stored order — see generate.ts for why:
  // `[] || x` is always `[]` since an empty array is truthy in JS.
  const parsedOrder = svg.pluginsOrder ? svg.pluginsOrder.split(",").filter(Boolean) : []

  return {
    plugins: enabledPlugins,
    pluginsOrder: parsedOrder.length > 0 ? parsedOrder : undefined,
  }
}

function getTerminalConfigs(uiConfig: Record<string, any> | null | undefined) {
  const config = uiConfig || {}
  return {
    hideTerminalEmojis: config.hideTerminalEmojis ?? false,
    hideTerminalHeader: config.hideTerminalHeader ?? false,
    hideTerminalCommand: config.hideTerminalCommand ?? false,
  }
}

/**
 * POST /api/cron/generate-svgs - Cron job to regenerate SVGs
 *
 * Authenticated via Bearer token in Authorization header (CRON_SECRET env var).
 */
export const onRequestPost: PagesFunction<CloudflareEnv> = async ({ request, env }) => {
  // Auth: verify cron secret
  const authHeader = request.headers.get("authorization")
  const cronSecret = env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const now = new Date()
    const db = getDb(env)
    const svgGeneratorUrl = env.SVG_GENERATOR_URL || "http://localhost:3001"

    // Reset SVGs stuck in "generating" for more than 30 minutes
    const STUCK_TIMEOUT_MINUTES = 30
    const stuckTimeout = new Date(now.getTime() - STUCK_TIMEOUT_MINUTES * 60 * 1000)

    const stuckSvgs = await db
      .select({ id: svgs.id, updatedAt: svgs.updatedAt })
      .from(svgs)
      .where(and(eq(svgs.status, "generating"), lt(svgs.updatedAt, stuckTimeout.toISOString())))

    if (stuckSvgs.length > 0) {
      console.log(`[CRON] Found ${stuckSvgs.length} SVG(s) stuck in "generating". Resetting...`)
      for (const stuckSvg of stuckSvgs) {
        const minutesStuck = stuckSvg.updatedAt
          ? Math.ceil((now.getTime() - new Date(stuckSvg.updatedAt).getTime()) / (1000 * 60))
          : 0
        await db
          .update(svgs)
          .set({
            status: "pending",
            lastError: `Generation interrupted (stuck in generating for ${minutesStuck} minutes)`,
          })
          .where(eq(svgs.id, stuckSvg.id))
      }
    }

    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const svgsToGenerate = await db
      .select()
      .from(svgs)
      .where(
        and(
          eq(svgs.isPaused, false),
          or(
            eq(svgs.status, "pending"),
            eq(svgs.status, "failed"),
            eq(svgs.forceRegenerate, true),
            and(
              or(
                eq(svgs.status, "completed"),
                eq(svgs.status, "failed"),
                eq(svgs.status, "error"),
                eq(svgs.status, "pending")
              ),
              sql`${svgs.nextRegenerationAt} IS NOT NULL`,
              lte(svgs.nextRegenerationAt, now.toISOString())
            ),
            and(
              isNull(svgs.nextRegenerationAt),
              or(isNull(svgs.lastGeneratedAt), lte(svgs.lastGeneratedAt, twentyFourHoursAgo.toISOString()))
            )
          )
        )
      )
      .limit(50)

    if (svgsToGenerate.length === 0) {
      return Response.json({ success: true, message: "No SVGs to generate", processed: 0 })
    }

    const results = { success: 0, failed: 0, errors: [] as string[] }

    for (const svg of svgsToGenerate) {
      try {
        console.log(`[CRON] Starting generation for SVG ${svg.id} (${svg.name})`)

        await db.update(svgs).set({ status: "generating" }).where(eq(svgs.id, svg.id))

        const { plugins: pluginsConfig, pluginsOrder } = convertSvgToPluginsConfig(svg as any)

        const uiConfig =
          (typeof (svg as any).uiConfig === "string" ? JSON.parse((svg as any).uiConfig) : (svg as any).uiConfig) || {}
        const terminalConfigs = getTerminalConfigs(uiConfig)

        const requestConfig = {
          style: svg.style || "default",
          size: svg.size || "half",
          plugins: pluginsConfig,
          pluginsOrder,
          customCss: svg.customCss || undefined,
          theme: svg.theme || undefined,
          hideTerminalEmojis: terminalConfigs.hideTerminalEmojis,
          hideTerminalHeader: terminalConfigs.hideTerminalHeader,
          hideTerminalCommand: terminalConfigs.hideTerminalCommand,
          customThemeColors: uiConfig.customThemeColors || undefined,
          userId: svg.userId,
          mock: false,
        }

        const result = (await generateSvgViaHttpService(requestConfig, svgGeneratorUrl)) as any
        const svgContent = result.svg

        // Same gate the manual regenerate endpoint uses -- neither trigger may publish a
        // degraded SVG over a previously-valid one. pluginErrors/hasErrors are always present
        // on the generator's response now, not gated behind a `debug` request flag.
        assertGenerationSucceeded(result)

        const { path: storagePath, url: storageUrl } = await saveSvgToR2(env, svg.id, svgContent)

        const nextRegenerationAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)

        await db
          .update(svgs)
          .set({
            status: "completed",
            storagePath: storagePath || null,
            storageUrl: storageUrl || null,
            lastGeneratedAt: now.toISOString(),
            nextRegenerationAt: nextRegenerationAt.toISOString(),
            forceRegenerate: false,
            failCount: 0,
            lastError: null,
          })
          .where(eq(svgs.id, svg.id))

        results.success++
      } catch (error) {
        let errorMessage = "Unknown error"
        let errorCode: string | undefined
        let errorDetails: any

        if (error instanceof Error) {
          errorMessage = error.message
          errorCode = (error as any).code
          errorDetails = (error as any).details || (error as any).missing
        } else if (typeof error === "string") {
          errorMessage = error
        }

        let fullErrorMessage = errorMessage
        if (errorCode) fullErrorMessage = `[${errorCode}] ${errorMessage}`
        if (errorDetails) fullErrorMessage += ` | Details: ${JSON.stringify(errorDetails)}`

        const [currentSvg] = await db.select().from(svgs).where(eq(svgs.id, svg.id)).limit(1)

        await db
          .update(svgs)
          .set({
            status: "failed",
            lastError: fullErrorMessage,
            failCount: (currentSvg?.failCount || 0) + 1,
          })
          .where(eq(svgs.id, svg.id))

        results.failed++
        results.errors.push(`${svg.id}: ${fullErrorMessage}`)
        console.error(`[CRON] Error generating SVG ${svg.id}:`, errorMessage)
      }
    }

    return Response.json({ success: true, processed: svgsToGenerate.length, results })
  } catch (e) {
    return serverError(e)
  }
}
