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

import type { D1Database, Fetcher, ScheduledController, ExecutionContext } from "@cloudflare/workers-types"
import { generateSvg, validateConfig, normalizeConfig } from "./index.js"
import { sanitizeConfig, sanitizeEssentialConfigs } from "./utils/sanitize.js"
import { getUserEssentialConfigs } from "./db/essential-configs.js"
import { validateRequiredConfig } from "./validation/validate-required-config.js"
import { log, hashUserId } from "./utils/log.js"
import { withAppCredentials } from "./db/app-credentials.js"

export interface Env {
  DB: D1Database
  JIKAN_EDGE: Fetcher
  CRON_SECRET?: string
  DASHBOARD_URL?: string
  JIKAN_EDGE_BASE_URL?: string
  // Required: getUserEssentialConfigs refuses to read plugin_secrets without it
  // rather than falling back to treating the stored column as plain text.
  SECRETS_ENCRYPTION_KEY: string
  // Application-owned provider credential -- see db/app-credentials.ts. Optional
  // so a deployment without it simply has no Steam data rather than failing.
  STEAM_API_KEY?: string
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
  fontFamily?: string
  terminalHeaderText?: string
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

  // The plugin package owns URL construction while the Worker owns transport.
  // In production this prevents a public workers.dev hop between Workers.
  const runtime = globalThis as typeof globalThis & {
    __weebJikanEdgeFetcher?: Fetcher
    __weebRequireJikanEdgeBinding?: boolean
  }
  runtime.__weebJikanEdgeFetcher = env.JIKAN_EDGE
  runtime.__weebRequireJikanEdgeBinding = true

  try {
    requestData = await request.json()
  } catch {
    return json({ error: "Invalid JSON body" }, 400)
  }

  const pluginsMap = requestData.plugins || {}
  const enabledPlugins = Object.keys(pluginsMap).filter((key) => pluginsMap[key]?.enabled)
  log.info("generate.request", {
    plugins: enabledPlugins,
    order: requestData.pluginsOrder,
    style: requestData.style,
    size: requestData.size,
    authenticated: !!requestData.userId,
  })

  if (!requestData.style || !requestData.size) {
    return json({ error: "style and size are required" }, 400)
  }

  // Fetch essential configs (secrets) from D1 if userId provided.
  // Username and other non-sensitive configs come directly from the request (svgs.plugins_config).
  let essentialConfigs: Record<string, any> = {}

  if (requestData.userId) {
    // The hash, never the id: this used to log the Clerk user id verbatim on every
    // authenticated generation. It is stable and joins straight into plugin_secrets.
    const user = await hashUserId(requestData.userId)
    try {
      essentialConfigs = await getUserEssentialConfigs(env.DB, requestData.userId, env.SECRETS_ENCRYPTION_KEY)
      log.info("secrets.loaded", { user, plugins: Object.keys(essentialConfigs) })
    } catch (error) {
      log.error("secrets.unavailable", { user, reason: error instanceof Error ? error.message : String(error) })
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
    log.warn("secrets.inline", { note: "essentialConfigs provided in request body (test mode)" })
    essentialConfigs = requestData.essentialConfigs
  }

  // Applied after the user's own secrets and regardless of whether a userId was
  // given: an application credential is not tied to the account being rendered.
  essentialConfigs = withAppCredentials(essentialConfigs, env)

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
    // Fonte global: apenas chaves conhecidas passam (validação final em PluginStyles).
    fontFamily: typeof requestData.fontFamily === "string" ? requestData.fontFamily.slice(0, 32) : undefined,
    // Título custom do header do terminal: texto puro, curto, sem markup.
    terminalHeaderText:
      typeof requestData.terminalHeaderText === "string"
        ? requestData.terminalHeaderText.replace(/[<>]/g, "").slice(0, 60)
        : undefined,
    primaryColor: requestData.primaryColor || "#ff7a00",
    essentialConfigs,
    dev: requestData.dev === true || requestData.mock === true,
  }

  // Validate required secrets and fields
  const requiredConfigValidation = validateRequiredConfig(config.plugins, essentialConfigs)
  if (!requiredConfigValidation.isValid) {
    log.warn("generate.missing_config", { missing: requiredConfigValidation.missing })
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
    log.error("generate.failed", { reason: error instanceof Error ? error.message : String(error) })
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
    log.error("cron.skipped", { reason: "CRON_SECRET not configured" })
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
      log.info("cron.batch", { run, processed: batch, total: totalProcessed })
    } catch (error) {
      log.error("cron.batch_failed", { run, reason: error instanceof Error ? error.message : String(error) })
      break
    }

    if (batch < 50) break
  }

  log.info("cron.complete", { totalProcessed })
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
