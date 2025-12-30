/**
 * Regeneration Worker
 * 
 * Processes SVGs for automatic regeneration with timebox and batch limits
 */

import { claimDueSvgs, updateSvgAfterGeneration, updateSvgAfterSkip, updateSvgAfterError, checkHasMoreSvgs, type SvgRow } from "../db/svgs.js"
import { getUserEssentialConfigs } from "../db/essential-configs.js"
import { generateSvg, normalizeConfig, validateConfig } from "../index.js"
import { normalizePayloadForHash, calculatePayloadHash } from "../utils/regeneration.js"
import { createClient } from "@supabase/supabase-js"

// Supabase client for storage
function createSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set")
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey)
}

/**
 * Saves SVG to Supabase Storage
 */
async function saveSvgToStorage(svgId: string, svgContent: string): Promise<{ path: string; url: string }> {
  const supabase = createSupabaseClient()
  const bucket = "svgs"

  // Verify bucket exists, create if not
  const { data: buckets } = await supabase.storage.listBuckets()
  if (!buckets?.find((b) => b.name === bucket)) {
    const { error: createError } = await supabase.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: 5242880, // 5MB
    })
    if (createError) {
      throw new Error(`Failed to create bucket: ${createError.message}`)
    }
  }

  const fileName = `${svgId}.svg`
  const { data, error } = await supabase.storage.from(bucket).upload(fileName, svgContent, {
    contentType: "image/svg+xml",
    upsert: true,
  })

  if (error) {
    throw new Error(`Failed to upload SVG: ${error.message}`)
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(fileName)

  return {
    path: data.path,
    url: publicUrl,
  }
}

/**
 * Converts SVG row to config format for svg-generator
 * Uses the same logic as convertSvgToPluginsConfig in the dashboard
 */
function convertSvgToConfig(svg: SvgRow): any {
  const plugins: Record<string, any> = {}
  const pluginsConfig = svg.plugins_config || {}

  // Convert pluginsConfig to format expected by svg-generator
  // Same logic as convertSvgToPluginsConfig in dashboard
  for (const [key, value] of Object.entries(pluginsConfig)) {
    if (key.startsWith("PLUGIN_")) {
      const pluginKey = key.replace("PLUGIN_", "").toLowerCase()
      
      // If it's a boolean (plugin enabled/disabled) - ex: PLUGIN_GITHUB = true
      if (typeof value === "boolean" && !key.includes("_", 7)) { // 7 = "PLUGIN_".length
        const pluginName = pluginKey
        if (!plugins[pluginName]) {
          plugins[pluginName] = { enabled: value }
        } else {
          plugins[pluginName].enabled = value
        }
      } else {
        // Extract plugin name and property - ex: PLUGIN_GITHUB_USERNAME
        const parts = pluginKey.split("_")
        const pluginName = parts[0]
        const property = parts.slice(1).join("_")

        if (!plugins[pluginName]) {
          plugins[pluginName] = { enabled: false } // Default to disabled if not explicitly set
        }

        if (property === "username") {
          plugins[pluginName].username = value
        } else if (property === "sections") {
          plugins[pluginName].sections = typeof value === "string" ? value.split(",").filter(Boolean) : (Array.isArray(value) ? value.filter(Boolean) : [])
        } else if (property) {
          // Other plugin properties
          plugins[pluginName][property] = value
        }
      }
    }
  }

  // Filter only enabled plugins with at least one section
  const enabledPlugins: Record<string, any> = {}
  for (const [pluginName, plugin] of Object.entries(plugins)) {
    const isEnabled = plugin.enabled === true
    const hasSections = plugin.sections && Array.isArray(plugin.sections) && plugin.sections.length > 0
    
    if (isEnabled && hasSections) {
      enabledPlugins[pluginName] = plugin
    }
  }

  // Use alphabetical order if pluginsOrder is null or empty
  let pluginsOrder: string[] = []
  if (svg.plugins_order && svg.plugins_order.trim()) {
    pluginsOrder = svg.plugins_order.split(",").filter(Boolean)
  } else {
    // Use alphabetical order of enabled plugins
    pluginsOrder = Object.keys(enabledPlugins).sort()
  }

  // Extract terminal configs from pluginsConfig
  const hideTerminalEmojis = pluginsConfig.hideTerminalEmojis || false
  const hideTerminalHeader = pluginsConfig.hideTerminalHeader || false
  const hideTerminalCommand = pluginsConfig.hideTerminalCommand || false

  return {
    style: svg.style || "default",
    size: svg.size || "half",
    plugins: enabledPlugins,
    pluginsOrder,
    customCss: svg.custom_css || undefined,
    theme: svg.theme || undefined,
    terminalTheme: svg.style === "terminal" ? (svg.theme || "default") : undefined,
    defaultTheme: svg.style === "default" ? (svg.theme || "default") : undefined,
    hideTerminalEmojis,
    hideTerminalHeader,
    hideTerminalCommand,
    customThemeColors: pluginsConfig.customThemeColors || undefined,
  }
}

/**
 * Processes regeneration batch with timebox
 */
export async function processRegenerationBatch(
  limit: number = 50,
  timeboxMs: number = 360000
): Promise<{ claimed: number; generated: number; skipped: number; failed: number; durationMs: number; hasMore: boolean }> {
  const startTime = Date.now()
  const results = {
    claimed: 0,
    generated: 0,
    skipped: 0,
    failed: 0,
  }

  try {
    // Claim batch of SVGs
    const svgs = await claimDueSvgs(limit)
    results.claimed = svgs.length

    if (svgs.length === 0) {
      const hasMore = await checkHasMoreSvgs()
      return {
        ...results,
        durationMs: Date.now() - startTime,
        hasMore,
      }
    }

    // Process each SVG until timebox
    for (const svg of svgs) {
      // Check timebox
      if (Date.now() - startTime >= timeboxMs) {
        console.log(`⏰ [REGEN] Timebox reached (${timeboxMs}ms), stopping batch`)
        break
      }

      try {
        // Load essential configs
        const essentialConfigs = await getUserEssentialConfigs(svg.user_id)

        // Convert SVG to config
        const baseConfig = convertSvgToConfig(svg)
        const config = {
          ...baseConfig,
          essentialConfigs,
          dev: false, // Always use real data
        }

        // Validate config
        if (!validateConfig(config)) {
          throw new Error("Invalid configuration")
        }

        const normalizedConfig = normalizeConfig(config)

        // Calculate payload hash
        const payload = normalizePayloadForHash(svg, normalizedConfig.plugins)
        const payloadHash = calculatePayloadHash(payload)

        // Check if hash matches (skip rendering)
        if (svg.last_payload_hash && svg.last_payload_hash === payloadHash) {
          console.log(`⏭️  [REGEN] Skipping ${svg.id} (hash unchanged)`)
          await updateSvgAfterSkip(svg.id, payloadHash)
          results.skipped++
          continue
        }

        // Generate SVG
        console.log(`🔄 [REGEN] Generating ${svg.id}...`)
        const result = await generateSvg(normalizedConfig)
        const svgContent = result.svg

        // Upload to storage
        const { path, url } = await saveSvgToStorage(svg.id, svgContent)

        // Update database
        await updateSvgAfterGeneration(svg.id, path, url, payloadHash)
        results.generated++

        console.log(`✅ [REGEN] Generated ${svg.id} successfully`)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error(`❌ [REGEN] Error generating ${svg.id}:`, errorMessage)
        await updateSvgAfterError(svg.id, errorMessage)
        results.failed++
      }
    }

    // Check if there are more SVGs
    const hasMore = await checkHasMoreSvgs()

    return {
      ...results,
      durationMs: Date.now() - startTime,
      hasMore,
    }
  } catch (error) {
    console.error("❌ [REGEN] Error in batch processing:", error)
    const hasMore = await checkHasMoreSvgs().catch(() => false)
    return {
      ...results,
      durationMs: Date.now() - startTime,
      hasMore,
    }
  }
}

