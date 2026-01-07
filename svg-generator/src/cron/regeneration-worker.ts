/**
 * Regeneration Worker
 *
 * Processes SVGs for automatic regeneration with timebox and batch limits
 */

import {
  claimDueSvgs,
  updateSvgAfterGeneration,
  updateSvgAfterSkip,
  updateSvgAfterError,
  checkHasMoreSvgs,
  type SvgRow,
} from "../db/svgs.js"
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
 *
 * plugins_config is now stored in direct format: { "github": { enabled: true, sections: [...], ... }, ... }
 * No longer uses PLUGIN_* prefix format
 */
function convertSvgToConfig(svg: SvgRow): any {
  const svgPluginsConfig = (svg.plugins_config || {}) as Record<string, any>
  const svgUiConfig = (svg.ui_config || {}) as Record<string, any>

  // Filter only enabled plugins with at least one section
  // Same logic as convertSvgToPluginsConfig in dashboard
  const enabledPlugins: Record<string, any> = {}
  for (const [pluginName, pluginConfig] of Object.entries(svgPluginsConfig)) {
    // Skip non-plugin keys (like hideTerminalEmojis, customThemeColors, etc)
    if (typeof pluginConfig !== "object" || pluginConfig === null || Array.isArray(pluginConfig)) {
      continue
    }

    const isEnabled = pluginConfig.enabled === true
    const hasSections =
      pluginConfig.sections && Array.isArray(pluginConfig.sections) && pluginConfig.sections.length > 0

    if (isEnabled && hasSections) {
      enabledPlugins[pluginName] = pluginConfig
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

  // Extract terminal configs from ui_config (moved from plugins_config)
  const hideTerminalEmojis = svgUiConfig.hideTerminalEmojis || false
  const hideTerminalHeader = svgUiConfig.hideTerminalHeader || false
  const hideTerminalCommand = svgUiConfig.hideTerminalCommand || false
  const customThemeColors = svgUiConfig.customThemeColors || undefined

  return {
    style: svg.style || "default",
    size: svg.size || "half",
    plugins: enabledPlugins,
    pluginsOrder,
    customCss: svg.custom_css || undefined,
    theme: svg.theme || undefined,
    terminalTheme: svg.style === "terminal" ? svg.theme || "default" : undefined,
    defaultTheme: svg.style === "default" ? svg.theme || "default" : undefined,
    hideTerminalEmojis,
    hideTerminalHeader,
    hideTerminalCommand,
    customThemeColors,
  }
}

/**
 * Processes regeneration batch with timebox
 */
export async function processRegenerationBatch(
  limit: number = 50,
  timeboxMs: number = 360000
): Promise<{
  claimed: number
  generated: number
  skipped: number
  failed: number
  durationMs: number
  hasMore: boolean
}> {
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
        console.log(`🔄 [REGEN] Converting SVG ${svg.id} to config...`)

        const baseConfig = convertSvgToConfig(svg)
        const enabledPlugins = Object.keys(baseConfig.plugins).filter((key) => baseConfig.plugins[key]?.enabled)
        console.log(
          `🔄 [REGEN] Enabled plugins: ${enabledPlugins.join(", ")} | Order: ${baseConfig.pluginsOrder.join(", ")}`
        )

        const config = {
          ...baseConfig,
          essentialConfigs,
          dev: false, // Always use real data
        }

        // Validate config
        console.log(`🔄 [REGEN] Validating config for SVG ${svg.id}...`)
        if (!validateConfig(config)) {
          // Log detailed validation failure
          const hasEnabledPlugin = Object.values(config.plugins || {}).some(
            (plugin: any) =>
              plugin?.enabled === true &&
              plugin.sections &&
              Array.isArray(plugin.sections) &&
              plugin.sections.length > 0
          )
          console.error(`❌ [REGEN] Config validation failed for SVG ${svg.id}`)
          console.error(`❌ [REGEN] Has enabled plugin:`, hasEnabledPlugin)
          console.error(
            `❌ [REGEN] Plugins details:`,
            Object.entries(config.plugins || {}).map(([name, plugin]: [string, any]) => ({
              name,
              enabled: plugin?.enabled,
              sections: plugin?.sections,
              sectionsCount: Array.isArray(plugin?.sections) ? plugin.sections.length : 0,
            }))
          )
          throw new Error("Invalid configuration")
        }

        console.log(`✅ [REGEN] Config validated successfully for SVG ${svg.id}`)

        const normalizedConfig = normalizeConfig(config)

        // Calculate payload hash
        const payload = normalizePayloadForHash(svg, normalizedConfig.plugins)
        const payloadHash = calculatePayloadHash(payload)

        // Check if hash matches (skip rendering) - unless force_regenerate is true
        if (!svg.force_regenerate && svg.last_payload_hash && svg.last_payload_hash === payloadHash) {
          console.log(`⏭️  [REGEN] Skipping ${svg.id} (hash unchanged)`)
          await updateSvgAfterSkip(svg.id, payloadHash)
          results.skipped++
          continue
        }

        // If force_regenerate was true, log it
        if (svg.force_regenerate) {
          console.log(`🔄 [REGEN] Force regenerating ${svg.id} (force_regenerate=true)`)
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
