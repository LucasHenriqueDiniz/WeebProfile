/**
 * Hook para validar configuração de plugins em tempo real
 */

import { useMemo } from "react"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import type { PluginConfig } from "@/stores/wizard-store"

interface ValidationResult {
  isValid: boolean
  errors: Array<{
    field: string
    message: string
  }>
  warnings: Array<{
    field: string
    message: string
  }>
}

/**
 * Hook para validar configuração de um plugin
 */
export function usePluginValidation(
  pluginName: string,
  pluginConfig: PluginConfig | undefined,
  essentialConfigs?: Record<string, string | boolean | undefined>
): ValidationResult {
  return useMemo(() => {
    const metadata = PLUGINS_METADATA[pluginName as keyof typeof PLUGINS_METADATA]
    if (!metadata) {
      return {
        isValid: false,
        errors: [{ field: "plugin", message: `Plugin "${pluginName}" not found` }],
        warnings: [],
      }
    }

    if (!pluginConfig?.enabled) {
      return {
        isValid: true, // Plugin desabilitado é válido
        errors: [],
        warnings: [],
      }
    }

    const errors: ValidationResult["errors"] = []
    const warnings: ValidationResult["warnings"] = []

    // Validar requiredFields
    for (const field of metadata.requiredFields) {
      const fieldValue = (pluginConfig as any)[field]
      if (!fieldValue || (typeof fieldValue === "string" && fieldValue.trim() === "")) {
        errors.push({
          field,
          message: `Field "${field}" is required`,
        })
      }
    }

    // Validar sections
    if (!pluginConfig.sections || pluginConfig.sections.length === 0) {
      errors.push({
        field: "sections",
        message: "Select at least one section",
      })
    } else {
      const validSectionIds = new Set(metadata.sections.map((s) => s.id))
      for (const sectionId of pluginConfig.sections) {
        if (!validSectionIds.has(sectionId as any)) {
          errors.push({
            field: "sections",
            message: `Section "${sectionId}" is not valid`,
          })
        }
      }
    }

    // Validar essentialConfigs (agora recebe boolean indicando se está configurado)
    const pluginEssentialConfigs = (essentialConfigs?.[pluginName] || {}) as Record<string, boolean | undefined>
    for (const keyMetadata of metadata.essentialConfigKeysMetadata) {
      const isConfigured = pluginEssentialConfigs[keyMetadata.key]

      if (!isConfigured) {
        if (keyMetadata.type === "password" || keyMetadata.type === "text") {
          warnings.push({
            field: keyMetadata.key,
            message: `${keyMetadata.label} is not configured`,
          })
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }, [pluginName, pluginConfig, essentialConfigs])
}

