/**
 * Utility functions for SVG regeneration system
 */

import { createHash } from "crypto"

/**
 * Normalizes payload for consistent hashing
 * Removes fields that shouldn't affect hash (timestamps, IDs, etc)
 */
export function normalizePayloadForHash(svg: any, pluginsConfig: any): any {
  // Create normalized payload object
  const payload: any = {
    style: svg.style,
    size: svg.size,
    theme: svg.theme,
    customCss: svg.customCss || "",
    pluginsOrder: svg.pluginsOrder ? svg.pluginsOrder.split(",") : [],
    plugins: {} as Record<string, any>,
  }

  // Normalize plugins config
  if (pluginsConfig && typeof pluginsConfig === "object") {
    for (const [pluginName, pluginConfig] of Object.entries(pluginsConfig)) {
      if (pluginConfig && typeof pluginConfig === "object") {
        const normalizedPlugin: any = {
          enabled: (pluginConfig as any).enabled || false,
          sections: Array.isArray((pluginConfig as any).sections)
            ? [...(pluginConfig as any).sections].sort()
            : [],
        }

        // Include all other config fields (username, etc) but exclude timestamps/IDs
        for (const [key, value] of Object.entries(pluginConfig as any)) {
          if (key !== "enabled" && key !== "sections" && key !== "lastGeneratedAt") {
            normalizedPlugin[key] = value
          }
        }

        // Only include if enabled
        if (normalizedPlugin.enabled) {
          payload.plugins[pluginName] = normalizedPlugin
        }
      }
    }
  }

  // Sort plugins object keys for consistency
  const sortedPlugins: Record<string, any> = {}
  for (const key of Object.keys(payload.plugins).sort()) {
    sortedPlugins[key] = payload.plugins[key]
  }
  payload.plugins = sortedPlugins

  return payload
}

/**
 * Calculates SHA-256 hash of normalized payload
 * Returns hex string
 */
export function calculatePayloadHash(payload: any): string {
  // Sort object keys recursively for consistent hashing
  const sorted = JSON.stringify(payload, Object.keys(payload).sort())
  return createHash("sha256").update(sorted).digest("hex")
}

