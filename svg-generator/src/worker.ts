/**
 * Cloudflare Worker entry point for the SVG Generator
 *
 * Receives a generation request, fetches the user's secrets from D1
 * (via the `DB` binding) when a `userId` is provided, renders the
 * plugins to a static SVG and returns it as JSON.
 *
 * Local dev: `pnpm dev` (wrangler dev)
 * Deploy:    `pnpm deploy` (wrangler deploy)
 */

import type { D1Database, ScheduledController, ExecutionContext } from "@cloudflare/workers-types"
import { generateSvg, validateConfig, normalizeConfig } from "./index.js"
import { sanitizeConfig, sanitizeEssentialConfigs } from "./utils/sanitize.js"
import { getUserEssentialConfigs } from "./db/essential-configs.js"
import { validateRequiredConfig } from "./validation/validate-required-config.js"

export interface Env {
  DB: D1Database
  CRON_SECRET?: string
  DASHBOARD_URL?: string
  SECRETS_ENCRYPTION_KEY?: string
}

interface GenerateRequest {
  style?: string
  size?: string
  plugins?: Record<string, { enabled?: boolean; [key: string]: any } | undefined>
  pluginsOrder?: string[]
  customCss?: string
  theme?: string
  terminalTheme?: string
  defaultTheme?: string
  hideTerminalEmojis?: boolean
  hideTerminalHeader?: boolean
  primaryColor?: string
  dev?: boolean
  mock?: boolean
  userId?: string
  essentialConfigs?: Record<string, any>
  debug?: boolean
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  })
}

async function handleGenerate(request: Request, env: Env): Promise<Response> {
  let requestData: GenerateRequest

  try {
    requestData = await request.json()
  } catch {
    return json({ error: "Invalid JSON body" }, 400)
  }

  const pluginsMap = requestData.plugins || {}
  const enabledPlugins = Object.keys(pluginsMap).filter((key) => pluginsMap[key]?.enabled)
  console.log("📥 [WORKER] Request:", {
    plugins: enabledPlugins,
    order: requestData.pluginsOrder,
    style: requestData.style,
    size: requestData.size,
    hasUserId: !!requestData.userId,
  })

  if (!requestData.style || !requestData.size) {
    return json({ error: "style and size are required" }, 400)
  }

  // Fetch essential configs (secrets) from D1 if userId provided.
  // Username and other non-sensitive configs come directly from the request (svgs.plugins_config).
  let essentialConfigs: Record<string, any> = {}

  if (requestData.userId) {
    console.log(`🔐 [WORKER] Fetching essential configs (secrets) for userId: ${requestData.userId}`)
    try {
      essentialConfigs = await getUserEssentialConfigs(env.DB, requestData.userId, env.SECRETS_ENCRYPTION_KEY)
      console.log(`✅ [WORKER] Essential configs found for plugins:`, Object.keys(essentialConfigs))
    } catch (error) {
      console.error(`❌ [WORKER] Error fetching essential configs:`, error)
      // DB unreachable ≠ missing secrets - return explicit error to avoid
      // "phantom missing secret" when it actually couldn't be verified.
      return json(
        {
          error: "DATABASE_UNREACHABLE",
          code: "D1_UNREACHABLE",
          message: "Generator couldn't access D1.",
          details: error instanceof Error ? error.message : String(error),
        },
        503
      )
    }
  } else if (requestData.essentialConfigs) {
    // Allow essentialConfigs only for tests (test page). In production, always use userId.
    console.log("🧪 [WORKER] essentialConfigs provided directly (test mode)")
    essentialConfigs = requestData.essentialConfigs
  }

  // Prepare plugins config - fully dynamic, iterates over all plugins in the request
  const plugins: Record<string, any> = {}
  for (const [pluginName, pluginConfig] of Object.entries(requestData.plugins || {})) {
    if (pluginConfig && typeof pluginConfig === "object" && "enabled" in pluginConfig) {
      plugins[pluginName] = {
        ...pluginConfig,
        enabled: pluginConfig.enabled === true,
        sections: pluginConfig.sections || [],
      }
    }
  }

  const pluginsOrder = requestData.pluginsOrder || Object.keys(plugins)

  // Map theme to defaultTheme or terminalTheme based on style
  const style = requestData.style as "default" | "terminal"
  const theme = requestData.theme || requestData.defaultTheme || requestData.terminalTheme

  const config: any = {
    style,
    size: requestData.size as "half" | "full",
    pluginsOrder,
    plugins,
    customCss: requestData.customCss || undefined,
    terminalTheme:
      style === "terminal" ? theme || requestData.terminalTheme || "default" : requestData.terminalTheme || undefined,
    defaultTheme:
      style === "default" ? theme || requestData.defaultTheme || "default" : requestData.defaultTheme || undefined,
    hideTerminalEmojis: requestData.hideTerminalEmojis || undefined,
    hideTerminalHeader: requestData.hideTerminalHeader || undefined,
    primaryColor: requestData.primaryColor || "#ff7a00",
    essentialConfigs,
    dev: requestData.dev === true || requestData.mock === true,
  }

  // Validate required secrets and fields
  const requiredConfigValidation = validateRequiredConfig(config.plugins, essentialConfigs)
  if (!requiredConfigValidation.isValid) {
    console.error("❌ [WORKER] Missing required configs:", JSON.stringify(requiredConfigValidation.missing))
    return json(
      {
        error: "MISSING_REQUIRED_CONFIG",
        code: "MISSING_REQUIRED_SECRETS",
        message: "Missing required secrets or fields for enabled plugins",
        missing: requiredConfigValidation.missing,
      },
      400
    )
  }

  if (!validateConfig(config)) {
    const hasEnabledPlugin = Object.values(config.plugins || {}).some(
      (plugin: any) => plugin?.enabled === true && Array.isArray(plugin.sections) && plugin.sections.length > 0
    )

    const errorMessage = !hasEnabledPlugin
      ? "At least one plugin must be enabled with at least one section"
      : "Invalid configuration"

    return json({ error: errorMessage }, 400)
  }

  const normalizedConfig = normalizeConfig(config)
  const includeDebug = requestData.debug === true || requestData.mock === true

  try {
    const result = await generateSvg(normalizedConfig)

    const debugInfo = (result as any)._debug as
      | { pluginsData?: unknown; pluginsErrors?: Record<string, string> }
      | undefined
    const pluginErrors = debugInfo?.pluginsErrors || {}

    const response: any = {
      success: true,
      svg: result.svg,
      width: result.width,
      height: result.height,
      // Always present, not gated behind `debug` -- callers (cron, manual regenerate) need
      // to know whether any plugin degraded without requesting the full debug payload below,
      // which also carries pluginsData/config and isn't meant for routine, non-debug traffic.
      // Only plain error messages here (see svg-generator.ts), never pluginsData or secrets.
      pluginErrors,
      hasErrors: Object.keys(pluginErrors).length > 0,
    }

    if (includeDebug && debugInfo) {
      response.debug = {
        config: sanitizeConfig({
          ...normalizedConfig,
          essentialConfigs: sanitizeEssentialConfigs(normalizedConfig.essentialConfigs || {}),
        }),
        pluginsData: debugInfo.pluginsData,
        pluginsErrors: debugInfo.pluginsErrors,
      }
    }

    return json(response)
  } catch (error) {
    console.error("Error generating SVG:", error)
    return json(
      {
        error: "Failed to generate SVG",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500
    )
  }
}

/**
 * Cron Trigger handler (see [triggers] in wrangler.toml): calls the dashboard's
 * cron endpoint (weeb-dashboard/functions/api/cron/generate-svgs.ts), which owns
 * the actual "which SVGs are due" + regenerate + save-to-R2 logic, and loops
 * until a batch comes back under the endpoint's per-call limit (50).
 */
async function runScheduledGeneration(env: Env): Promise<void> {
  if (!env.CRON_SECRET) {
    console.error("[CRON] CRON_SECRET not configured, skipping scheduled generation")
    return
  }

  const dashboardUrl = env.DASHBOARD_URL || "https://weebprofile-dashboard.pages.dev"
  let totalProcessed = 0

  for (let run = 1; run <= 20; run++) {
    let batch = 0
    try {
      const response = await fetch(`${dashboardUrl}/api/cron/generate-svgs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.CRON_SECRET}`,
          "Content-Type": "application/json",
        },
      })
      const result = (await response.json().catch(() => ({}))) as { processed?: number }
      batch = result.processed || 0
      totalProcessed += batch
      console.log(`[CRON] Run ${run}: processed ${batch} (total ${totalProcessed})`)
    } catch (error) {
      console.error(`[CRON] Run ${run} failed:`, error instanceof Error ? error.message : error)
      break
    }

    if (batch < 50) break
  }

  console.log(`[CRON] Scheduled generation complete. Total processed: ${totalProcessed}`)
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 200, headers: CORS_HEADERS })
    }

    const url = new URL(request.url)

    if (url.pathname === "/test" && request.method === "GET") {
      return new Response("SVG Generator is running!", {
        status: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "text/plain" },
      })
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405)
    }

    return handleGenerate(request, env)
  },

  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(runScheduledGeneration(env))
  },
}
