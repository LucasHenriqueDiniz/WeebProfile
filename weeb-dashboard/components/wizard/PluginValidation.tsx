/**
 * Componente de validação visual para plugins
 */

import { Alert, AlertDescription } from "@/components/ui/alert"
import { usePluginValidation } from "@/hooks/usePluginValidation"
import type { PluginConfig } from "@/stores/wizard-store"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface PluginValidationProps {
  pluginName: string
  pluginConfig: PluginConfig | undefined
  essentialConfigs?: Record<string, string | boolean | undefined>
}

export function PluginValidation({
  pluginName,
  pluginConfig,
  essentialConfigs,
}: PluginValidationProps) {
  const validation = usePluginValidation(pluginName, pluginConfig, essentialConfigs)

  if (validation.isValid && validation.warnings.length === 0) {
    return (
      <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          Configuration valid
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-2">
      {validation.errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              {validation.errors.map((error, i) => (
                <div key={i}>
                  <strong>{error.field}:</strong> {error.message}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {validation.warnings.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              {validation.warnings.map((warning, i) => (
                <div key={i}>
                  <strong>{warning.field}:</strong> {warning.message}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

