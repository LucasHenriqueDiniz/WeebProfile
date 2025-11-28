/**
 * Hook leve para obter apenas o status de validação de um plugin
 * Retorna "ok" | "warning" | "error" para uso em UI (ex: PluginCard)
 */

import { usePluginValidation } from "./usePluginValidation"
import type { PluginConfig } from "@/stores/wizard-store"

export type PluginValidationStatus = "ok" | "warning" | "error"

export function usePluginValidationStatus(
  pluginName: string,
  pluginConfig: PluginConfig | undefined,
  essentialConfigs?: Record<string, string | boolean | undefined>
): PluginValidationStatus {
  const validation = usePluginValidation(pluginName, pluginConfig, essentialConfigs)

  if (validation.errors.length > 0) {
    return "error"
  }

  if (validation.warnings.length > 0) {
    return "warning"
  }

  return "ok"
}

