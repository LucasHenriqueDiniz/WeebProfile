/**
 * Plugin Schema Generation from Metadata
 * 
 * Generates Zod schemas dynamically from plugin metadata.
 * This ensures validation stays in sync with plugin definitions.
 */

import { z } from "zod"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import type { PluginConfig } from "@/stores/wizard-store"

/**
 * Creates a Zod schema for essential config keys of a plugin
 * Essential keys are things like API keys, tokens, OAuth connections
 */
export function createPluginEssentialSchema(pluginName: string): z.ZodObject<any> {
  const meta = (PLUGINS_METADATA as Record<string, any>)[pluginName]
  if (!meta) return z.object({})

  const shape: Record<string, z.ZodTypeAny> = {}

  // Process essentialConfigKeysMetadata
  if (meta.essentialConfigKeysMetadata && Array.isArray(meta.essentialConfigKeysMetadata)) {
    meta.essentialConfigKeysMetadata.forEach((keyMeta: any) => {
      if (keyMeta.type === "oauth") {
        // OAuth returns boolean (connected)
        shape[keyMeta.key] = z.boolean().optional()
      } else {
        // Text/password fields - required if specified
        shape[keyMeta.key] = z.string().min(1, {
          message: `${keyMeta.label || keyMeta.key} é obrigatório`,
        })
      }
    })
  }

  return z.object(shape)
}

/**
 * Creates a complete Zod schema for a plugin's configuration
 * Includes enabled, sections, essential configs, and required fields
 */
export function createPluginConfigSchema(pluginName: string): z.ZodObject<any> {
  const meta = (PLUGINS_METADATA as Record<string, any>)[pluginName]
  if (!meta) {
    // Fallback schema for unknown plugins
    return z.object({
      enabled: z.boolean(),
      sections: z.array(z.string()).min(0),
    })
  }

  const essentialSchema = createPluginEssentialSchema(pluginName)
  const shape: Record<string, z.ZodTypeAny> = {
    enabled: z.boolean(),
    sections: z.array(z.string()).min(0),
    sectionConfigs: z.record(z.string(), z.record(z.string(), z.unknown())).optional(),
    fields: z.record(z.string(), z.unknown()).optional(),
    // Include essential schema shape
    ...essentialSchema.shape,
  }

  // Add requiredFields (non-essential but required fields like username)
  if (meta.requiredFields && Array.isArray(meta.requiredFields)) {
    meta.requiredFields.forEach((field: string) => {
      // Don't override if already defined in essential schema
      if (!shape[field]) {
        shape[field] = z.string().min(1, {
          message: `${field} é obrigatório`,
        })
      }
    })
  }

  return z.object(shape)
}

/**
 * Validates a plugin config against its schema
 * Returns validation result with errors if any
 */
export function validatePluginConfig(
  pluginName: string,
  config: Partial<PluginConfig>
): { success: boolean; errors?: Array<{ path: string; message: string }> } {
  const schema = createPluginConfigSchema(pluginName)
  const result = schema.safeParse(config)

  if (result.success) {
    return { success: true }
  }

  return {
    success: false,
    errors: result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    })),
  }
}
