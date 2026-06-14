/**
 * Node.js HTTP service for SVG generation
 *
 * This service runs in a separate process and can import
 * the svg-generator without Turbopack static analysis issues.
 *
 * Usage:
 *   pnpm tsx src/server.ts
 *
 * Or via script:
 *   pnpm dev:server
 */

// Load environment variables from .env file
import { config } from "dotenv"
import { resolve } from "path"
config({ path: resolve(process.cwd(), ".env") })

import { createServer } from "node:http"
import type { IncomingMessage, ServerResponse } from "node:http"
import { URL } from "node:url"
import { generateSvg, validateConfig, normalizeConfig } from "./index.js"
import { sanitizeConfig, sanitizeEssentialConfigs } from "./utils/sanitize.js"
import { getUserEssentialConfigs } from "./db/essential-configs.js"
import { validateRequiredConfig } from "./validation/validate-required-config.js"

// Railway uses PORT, but also supports SVG_GENERATOR_PORT for local development
const PORT = process.env.PORT || process.env.SVG_GENERATOR_PORT || 3001

interface GenerateRequest {
  style?: string
  size?: string
  plugins?: {
    github?: { enabled?: boolean; username?: string; sections?: string[]; [key: string]: any }
    lastfm?: { enabled?: boolean; username?: string; sections?: string[]; [key: string]: any }
    myanimelist?: { enabled?: boolean; username?: string; sections?: string[]; [key: string]: any }
  }
  pluginsOrder?: string[]
  customCss?: string
  theme?: string // Generic theme (mapped to defaultTheme or terminalTheme based on style)
  terminalTheme?: string
  defaultTheme?: string
  hideTerminalEmojis?: boolean
  hideTerminalHeader?: boolean
  primaryColor?: string
  dev?: boolean
  mock?: boolean // Alias for dev
  userId?: string // User ID to fetch essential configs from Cloudflare D1 (production)
  // essentialConfigs?: Record<string, any> // Only for tests (test page) - do not use in production
  debug?: boolean // Include debug information in response
}

async function handleRequest(req: IncomingMessage, res: ServerResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

  if (req.method === "OPTIONS") {
    res.writeHead(200)
    res.end()
    return
  }

  // Parse URL
  const url = new URL(req.url || "/", `http://${req.headers.host}`)
  const pathname = url.pathname

  // Test route - allow GET
  if (pathname === "/test") {
    console.log("Test route reached!")
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end("SVG Generator is running!")
    return
  }

  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ error: "Method not allowed" }))
    return
  }

  try {
    // Parse request body
    let body = ""
    for await (const chunk of req) {
      body += chunk.toString()
    }

    const requestData: GenerateRequest = JSON.parse(body)

    // Log for debug
    const requestDataTyped = requestData as GenerateRequest & { essentialConfigs?: Record<string, any> }
    const pluginsMap = (requestDataTyped.plugins || {}) as Record<string, { enabled?: boolean } | undefined>
    const enabledPlugins = Object.keys(pluginsMap).filter((key) => pluginsMap[key]?.enabled)
    console.log("📥 [SERVER] Request:", {
      plugins: enabledPlugins,
      order: requestDataTyped.pluginsOrder,
      style: requestDataTyped.style,
      size: requestDataTyped.size,
      hasUserId: !!requestDataTyped.userId,
    })

    // Validate basic configuration
    if (!requestDataTyped.style || !requestDataTyped.size) {
      res.writeHead(400, { "Content-Type": "application/json" })
      res.end(JSON.stringify({ error: "style and size are required" }))
      return
    }

    // Fetch essential configs (secrets) from Cloudflare D1 if userId provided
    // This ensures frontend never accesses sensitive data in production
    // Username and other non-sensitive configs now come from request (svgs.plugins_config)
    let essentialConfigs: Record<string, any> = {}
    let dbConnectionError = false

    if (requestDataTyped.userId) {
      console.log(`🔐 [SERVER] Fetching essential configs (secrets) for userId: ${requestDataTyped.userId}`)
      try {
        essentialConfigs = await getUserEssentialConfigs(requestDataTyped.userId)
        console.log(`✅ [SERVER] Essential configs found for plugins:`, Object.keys(essentialConfigs))
      } catch (error: any) {
        console.error(`❌ [SERVER] Error fetching essential configs:`, error)
        dbConnectionError = true
      }

      if (dbConnectionError) {
        console.error(`❌ [SERVER] D1 connection failed. Cannot verify secrets.`)
        // Return explicit error: DB unreachable ≠ missing secrets
        // This avoids "phantom missing secret" when it actually couldn't verify
        res.writeHead(503, { "Content-Type": "application/json" })
        res.end(
          JSON.stringify({
            error: "DATABASE_UNREACHABLE",
            code: "D1_API_UNREACHABLE",
            message: "Generator couldn't access D1. Check CLOUDFLARE_API_TOKEN and connectivity.",
            details:
              "Couldn't verify secrets in D1. This might be a network or Cloudflare API token configuration issue.",
          })
        )
        return
      }
    } else if ((requestDataTyped as any).essentialConfigs) {
      // Allow essentialConfigs only for tests (test page)
      // In production, always use userId
      console.log("🧪 [SERVER] essentialConfigs provided directly (test mode)")
      essentialConfigs = (requestDataTyped as any).essentialConfigs
    }

    // Prepare configuration in svg-generator format
    // Fully dynamic - iterates over all available plugins
    const plugins: Record<string, any> = {}

    console.log("🔧 [SERVER] Processing plugins from request...")
    if (requestDataTyped.plugins) {
      for (const [pluginName, pluginConfig] of Object.entries(requestDataTyped.plugins)) {
        console.log(`🔧 [SERVER] Processing plugin: ${pluginName}`, JSON.stringify(pluginConfig, null, 2))
        if (pluginConfig && typeof pluginConfig === "object" && "enabled" in pluginConfig) {
          const typedPluginConfig = pluginConfig as any

          // Username and other non-sensitive configs now come directly from request (svgs.plugins_config)
          // No need to fetch from plugin_config table anymore
          plugins[pluginName] = {
            ...typedPluginConfig, // All configs including username, enabled, sections, sectionConfigs
            enabled: typedPluginConfig.enabled === true,
            sections: typedPluginConfig.sections || [],
          }
          console.log(
            `🔧 [SERVER] ✅ Plugin ${pluginName} added (config from request):`,
            JSON.stringify(plugins[pluginName], null, 2)
          )

          // Username can come from plugin config or be optional depending on plugin
          // Don't add hardcoded defaults - let plugin decide
        } else {
          console.log(`🔧 [SERVER] ❌ Plugin ${pluginName} skipped (invalid config)`)
        }
      }
    } else {
      console.log("🔧 [SERVER] ⚠️ No plugins in request!")
    }

    console.log("🔧 [SERVER] Final plugins object:", JSON.stringify(plugins, null, 2))

    // Generate pluginsOrder dynamically if not provided
    const pluginsOrder = requestDataTyped.pluginsOrder || Object.keys(plugins)
    console.log("🔧 [SERVER] Plugins order:", pluginsOrder)

    // Map theme to defaultTheme or terminalTheme based on style
    const style = requestDataTyped.style as "default" | "terminal"
    const theme = requestDataTyped.theme || requestDataTyped.defaultTheme || requestDataTyped.terminalTheme

    const config: any = {
      style,
      size: requestDataTyped.size as "half" | "full",
      pluginsOrder,
      plugins,
      customCss: requestDataTyped.customCss || undefined,
      terminalTheme:
        style === "terminal"
          ? theme || requestDataTyped.terminalTheme || "default"
          : requestDataTyped.terminalTheme || undefined,
      defaultTheme:
        style === "default"
          ? theme || requestDataTyped.defaultTheme || "default"
          : requestDataTyped.defaultTheme || undefined,
      hideTerminalEmojis: requestDataTyped.hideTerminalEmojis || undefined,
      hideTerminalHeader: requestDataTyped.hideTerminalHeader || undefined,
      primaryColor: requestDataTyped.primaryColor || "#ff7a00", // Use default color if not defined
      essentialConfigs, // Use configs fetched from D1 (production) or provided directly (tests)
      dev: requestDataTyped.dev === true || requestDataTyped.mock === true, // Use mock data if dev=true or mock=true
    }

    console.log("🔧 [SERVER] Theme mapping:", {
      receivedTheme: requestDataTyped.theme,
      receivedDefaultTheme: requestDataTyped.defaultTheme,
      receivedTerminalTheme: requestDataTyped.terminalTheme,
      style,
      mappedDefaultTheme: config.defaultTheme,
      mappedTerminalTheme: config.terminalTheme,
    })

    // Validate required secrets and fields
    console.log("✅ [SERVER] Validating required configs...")
    const requiredConfigValidation = validateRequiredConfig(config.plugins, essentialConfigs)

    if (!requiredConfigValidation.isValid) {
      console.error("❌ [SERVER] Missing required configs:", JSON.stringify(requiredConfigValidation.missing, null, 2))

      // Return structured error
      res.writeHead(400, { "Content-Type": "application/json" })
      res.end(
        JSON.stringify({
          error: "MISSING_REQUIRED_CONFIG",
          code: "MISSING_REQUIRED_SECRETS",
          message: "Missing required secrets or fields for enabled plugins",
          missing: requiredConfigValidation.missing,
        })
      )
      return
    }

    // Validate and normalize
    console.log("✅ [SERVER] Validating config...")
    const configPlugins = Object.keys(config.plugins || {}).filter((key) => config.plugins[key]?.enabled)
    console.log("✅ [SERVER] Config validated - plugins:", configPlugins.join(", "))

    if (!validateConfig(config)) {
      // Specifically check if there are enabled plugins
      const hasEnabledPlugin = Object.values(config.plugins || {}).some(
        (plugin: any) =>
          plugin?.enabled === true && plugin.sections && Array.isArray(plugin.sections) && plugin.sections.length > 0
      )

      console.error("❌ [SERVER] Config validation failed!")
      console.error("❌ [SERVER] Has enabled plugin:", hasEnabledPlugin)
      console.error(
        "❌ [SERVER] Plugins details:",
        Object.entries(config.plugins || {}).map(([name, plugin]: [string, any]) => ({
          name,
          enabled: plugin?.enabled,
          sections: plugin?.sections,
          sectionsCount: Array.isArray(plugin?.sections) ? plugin.sections.length : 0,
        }))
      )

      const errorMessage = !hasEnabledPlugin
        ? "At least one plugin must be enabled with at least one section"
        : "Invalid configuration"

      res.writeHead(400, { "Content-Type": "application/json" })
      res.end(JSON.stringify({ error: errorMessage }))
      return
    }

    console.log("✅ [SERVER] Config validated successfully")
    console.log(
      "🔍 [SERVER] EssentialConfigs before normalize:",
      essentialConfigs
        ? Object.keys(essentialConfigs)
            .map((plugin) => `${plugin}: [${Object.keys(essentialConfigs[plugin] || {}).join(", ")}]`)
            .join(", ")
        : "none"
    )

    const normalizedConfig = normalizeConfig(config)
    const includeDebug = requestData.debug === true || requestData.mock === true

    // Generate SVG
    const result = await generateSvg(normalizedConfig)

    // Prepare response
    const response: any = {
      success: true,
      svg: result.svg,
      width: result.width,
      height: result.height,
    }

    // Add debug information if requested
    if (includeDebug && (result as any)._debug) {
      const debugInfo = (result as any)._debug
      response.debug = {
        // Sanitized config (without API keys/tokens)
        config: sanitizeConfig({
          ...normalizedConfig,
          essentialConfigs: sanitizeEssentialConfigs(normalizedConfig.essentialConfigs || {}),
        }),
        // Plugin data used in generation
        pluginsData: debugInfo.pluginsData,
        // Errors occurred (if any)
        pluginsErrors: debugInfo.pluginsErrors,
      }
    }

    // Return result
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify(response))
  } catch (error) {
    console.error("Error generating SVG:", error)
    res.writeHead(500, { "Content-Type": "application/json" })
    res.end(
      JSON.stringify({
        error: "Failed to generate SVG",
        message: error instanceof Error ? error.message : "Unknown error",
      })
    )
  }
}

const server = createServer(handleRequest)

// Railway needs to listen on 0.0.0.0, local uses localhost
// Railway always defines PORT, so if PORT exists and is not the local default, use 0.0.0.0
const isRailway = process.env.RAILWAY_ENVIRONMENT || (process.env.PORT && process.env.PORT !== "3001")
const host = isRailway ? "0.0.0.0" : "localhost"

server.listen(PORT, host as any, () => {
  console.log(`🚀 SVG Generator service running on http://${host}:${PORT}`)
  console.log(`📦 Ready to generate SVGs`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
  if (isRailway) {
    console.log(`🚂 Running on Railway`)
  }
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully")
  server.close(() => {
    console.log("Server closed")
    process.exit(0)
  })
})
