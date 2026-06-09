import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../../_shared/auth"
import { getAuthUserId, unauthorized, notFound, serverError } from "../../_shared/auth"
import { getDb } from "../../_shared/db"
import { svgs } from "../../../../lib/db/schema"
import { eq, and } from "drizzle-orm"
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
  const msg = (error.message?.toLowerCase() || String(error).toLowerCase())
  const code = (error.code?.toLowerCase() || "")
  return ["econnreset", "econnrefused", "etimedout", "timeout", "aborted", "network", "fetch failed", "socket hang up"]
    .some((p) => msg.includes(p) || code.includes(p))
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
        const error = await response.json().catch(() => ({ error: "Unknown error" })) as any
        if (response.status === 503 && (error.code === "DATABASE_UNREACHABLE" || error.code === "SUPABASE_DB_DNS_FAILED")) {
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
  const svgPluginsConfig = (typeof svg.pluginsConfig === "string"
    ? JSON.parse(svg.pluginsConfig)
    : svg.pluginsConfig) || {} as Record<string, any>

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

  return {
    plugins: enabledPlugins,
    pluginsOrder: svg.pluginsOrder ? svg.pluginsOrder.split(",").filter(Boolean) : [],
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
 * POST /api/svgs/[id]/generate - Trigger SVG generation
 */
export const onRequestPost: PagesFunction<CloudflareEnv> = async ({ request, env, params }) => {
  try {
    const userId = await getAuthUserId(request, env)
    if (!userId) return unauthorized()

    const id = params.id as string
    const db = getDb(env)

    let force = false
    try {
      const body = await request.clone().json() as any
      force = body.force === true
    } catch {
      // ignore — force remains false
    }

    const [svg] = await db
      .select()
      .from(svgs)
      .where(and(eq(svgs.id, id), eq(svgs.userId, userId)))
      .limit(1)

    if (!svg) return notFound("SVG")

    // Reset SVGs stuck in "generating" for more than 30 minutes
    let currentSvg: typeof svg = svg
    if (svg.status === "generating" && svg.updatedAt) {
      const minutesSinceUpdate = (Date.now() - new Date(svg.updatedAt).getTime()) / (1000 * 60)
      const STUCK_TIMEOUT_MINUTES = 30
      if (minutesSinceUpdate > STUCK_TIMEOUT_MINUTES) {
        const [updatedSvg] = await db
          .update(svgs)
          .set({
            status: "pending",
            lastError: `Generation interrupted (stuck in generating for ${Math.ceil(minutesSinceUpdate)} minutes)`,
          })
          .where(eq(svgs.id, id))
          .returning()
        if (updatedSvg) currentSvg = updatedSvg
      }
    }

    // Cooldown check (20 minutes), unless forced
    const COOLDOWN_MINUTES = 20
    if (!force && currentSvg.lastGeneratedAt) {
      const minutesSinceLastGeneration =
        (Date.now() - new Date(currentSvg.lastGeneratedAt).getTime()) / (1000 * 60)
      if (minutesSinceLastGeneration < COOLDOWN_MINUTES) {
        const remainingMinutes = Math.ceil(COOLDOWN_MINUTES - minutesSinceLastGeneration)
        return Response.json(
          {
            error: "Cooldown active",
            message: `Please wait ${remainingMinutes} minute(s) before generating again. Use "Force Generate" to skip the cooldown.`,
            remainingMinutes,
            cooldownMinutes: COOLDOWN_MINUTES,
          },
          { status: 429 }
        )
      }
    }

    await db
      .update(svgs)
      .set({ status: "generating", forceRegenerate: force })
      .where(eq(svgs.id, id))

    try {
      const { plugins, pluginsOrder } = convertSvgToPluginsConfig(currentSvg as any)

      const uiConfig = (typeof (currentSvg as any).uiConfig === "string"
        ? JSON.parse((currentSvg as any).uiConfig)
        : (currentSvg as any).uiConfig) || {}
      const terminalConfigs = getTerminalConfigs(uiConfig)

      const requestConfig = {
        style: currentSvg.style || "default",
        size: currentSvg.size || "half",
        plugins,
        pluginsOrder,
        customCss: currentSvg.customCss || undefined,
        theme: currentSvg.theme || undefined,
        hideTerminalEmojis: terminalConfigs.hideTerminalEmojis,
        hideTerminalHeader: terminalConfigs.hideTerminalHeader,
        hideTerminalCommand: terminalConfigs.hideTerminalCommand,
        customThemeColors: uiConfig.customThemeColors || undefined,
        userId,
        mock: false,
      }

      const svgGeneratorUrl = env.SVG_GENERATOR_URL || "http://localhost:3001"
      const result = await generateSvgViaHttpService(requestConfig, svgGeneratorUrl) as any
      const svgContent = result.svg

      // Save to Supabase Storage
      const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
      const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY
      let storagePath = ""
      let storageUrl = ""

      if (supabaseUrl && serviceRoleKey) {
        const fileName = `${id}.svg`
        const uploadUrl = `${supabaseUrl}/storage/v1/object/svgs/${fileName}`
        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${serviceRoleKey}`,
            "Content-Type": "image/svg+xml",
            "x-upsert": "true",
          },
          body: svgContent,
        })
        if (uploadResponse.ok) {
          storagePath = `svgs/${fileName}`
          storageUrl = `${supabaseUrl}/storage/v1/object/public/svgs/${fileName}`
        } else {
          const uploadError = await uploadResponse.text()
          throw new Error(`Failed to upload SVG to storage: ${uploadError}`)
        }
      }

      const nextRegenerationAt = new Date()
      nextRegenerationAt.setHours(nextRegenerationAt.getHours() + 24)

      const [updatedSvg] = await db
        .update(svgs)
        .set({
          status: "completed",
          storagePath: storagePath || null,
          storageUrl: storageUrl || null,
          lastGeneratedAt: new Date().toISOString(),
          nextRegenerationAt: nextRegenerationAt.toISOString(),
          forceRegenerate: false,
        })
        .where(eq(svgs.id, id))
        .returning()

      return Response.json({ success: true, svg: updatedSvg })
    } catch (error: any) {
      await db
        .update(svgs)
        .set({ status: "failed", lastError: error?.message || "Unknown error" })
        .where(eq(svgs.id, id))

      const errorMessage = error instanceof Error ? error.message : String(error)
      const isTimeout =
        errorMessage.includes("Vercel Runtime Timeout") ||
        errorMessage.includes("Task timed out after") ||
        errorMessage.includes("Function execution exceeded") ||
        (error?.code === "ETIMEDOUT" && errorMessage.includes("timeout"))

      if (isTimeout) {
        return Response.json(
          {
            error: "Service starting up",
            code: "TIMEOUT",
            message: "The generation service is waking up. Please wait a few seconds and try again.",
            retryable: true,
          },
          { status: 503 }
        )
      }

      if (error?.code === "MISSING_REQUIRED_SECRETS" || error?.error === "MISSING_REQUIRED_CONFIG") {
        return Response.json(
          {
            error: "MISSING_REQUIRED_CONFIG",
            code: "MISSING_REQUIRED_SECRETS",
            message: error.message || "Missing required secrets or fields for enabled plugins",
            missing: error.missing || [],
          },
          { status: 400 }
        )
      }

      if (error?.code === "DATABASE_UNREACHABLE" || error?.code === "SUPABASE_DB_DNS_FAILED") {
        return Response.json(
          {
            error: "Database unreachable",
            code: error.code,
            message: error.message || "Generator could not reach the database.",
            details: error.details,
          },
          { status: 503 }
        )
      }

      return Response.json(
        { error: "Failed to generate SVG", message: errorMessage },
        { status: 500 }
      )
    }
  } catch (e) {
    return serverError(e)
  }
}
