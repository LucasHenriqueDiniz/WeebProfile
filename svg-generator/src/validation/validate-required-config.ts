/**
 * Validation for required secrets and fields
 *
 * Validates that enabled plugins have all required secrets (from plugin_secrets)
 * and required fields (from plugin config).
 */

import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import type { EssentialConfigs } from "../db/essential-configs.js"

export interface MissingRequiredConfig {
  pluginName: string
  missingSecrets: Array<{ key: string; label: string }>
  missingFields: Array<{ field: string; label: string }>
}

export interface ValidationResult {
  isValid: boolean
  missing: MissingRequiredConfig[]
}

/**
 * Validates required secrets and fields for enabled plugins
 *
 * @param plugins - Plugin configurations (enabled plugins with sections)
 * @param essentialConfigs - Essential configs (secrets) from plugin_secrets table
 * @returns Validation result with missing configs
 */
export function validateRequiredConfig(
  plugins: Record<string, any>,
  essentialConfigs: EssentialConfigs
): ValidationResult {
  const missing: MissingRequiredConfig[] = []

  for (const [pluginName, pluginConfig] of Object.entries(plugins)) {
    // Only validate enabled plugins with sections
    if (!pluginConfig?.enabled || !Array.isArray(pluginConfig.sections) || pluginConfig.sections.length === 0) {
      continue
    }

    const metadata = PLUGINS_METADATA[pluginName as keyof typeof PLUGINS_METADATA]
    if (!metadata) {
      // Plugin not found in metadata - skip validation
      continue
    }

    const missingSecrets: Array<{ key: string; label: string }> = []
    const missingFields: Array<{ field: string; label: string }> = []

    // Check required secrets
    const metadataAny = metadata as any
    const requiredSecrets = metadataAny.requiredSecrets || metadataAny.essentialConfigKeysMetadata || []

    const pluginNameLower = pluginName.toLowerCase()
    const pluginSecrets = essentialConfigs[pluginNameLower]

    console.log(`🔍 [VALIDATE] Plugin ${pluginName}: checking ${requiredSecrets.length} required secrets`)
    console.log(
      `🔍 [VALIDATE] Plugin ${pluginName}: available secrets in DB:`,
      pluginSecrets ? Object.keys(pluginSecrets) : "none"
    )

    for (const secretMeta of requiredSecrets) {
      const key = secretMeta.key?.toLowerCase() || secretMeta.key

      if (!pluginSecrets || !pluginSecrets[key]) {
        console.log(`❌ [VALIDATE] Plugin ${pluginName}: missing secret "${key}" (looking for: ${secretMeta.key})`)
        missingSecrets.push({
          key: secretMeta.key,
          label: secretMeta.label || secretMeta.key,
        })
      } else {
        console.log(`✅ [VALIDATE] Plugin ${pluginName}: secret "${key}" found`)
      }
    }

    // Check required fields
    const requiredFields = metadata.requiredFields || []
    for (const field of requiredFields) {
      const value = pluginConfig[field]
      const isEmpty = typeof value === "string" ? !value?.trim() : !value

      if (isEmpty) {
        missingFields.push({
          field,
          label: field.replace(/([A-Z])/g, " $1").trim(),
        })
      }
    }

    if (missingSecrets.length > 0 || missingFields.length > 0) {
      missing.push({
        pluginName,
        missingSecrets,
        missingFields,
      })
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
  }
}
