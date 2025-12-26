/**
 * Wizard Validation
 * 
 * Validates the entire wizard state using Zod schemas.
 * Aggregates validation errors from all enabled plugins.
 */

import type { WizardState } from "@/stores/wizard-store"
import { selectEnabledPluginNames } from "@/stores/wizard-selectors"
import { createPluginConfigSchema } from "./plugin-schemas"

export type ValidationErrors = Record<string, Array<{ path: string; message: string }>>

/**
 * Validates the wizard state
 * Returns errors grouped by plugin name
 */
export function validateWizard(state: WizardState): ValidationErrors {
  const errors: ValidationErrors = {}
  const enabledNames = selectEnabledPluginNames(state)

  for (const name of enabledNames) {
    const plugin = state.plugins[name]
    if (!plugin) continue

    const schema = createPluginConfigSchema(name)
    const result = schema.safeParse(plugin)

    if (!result.success) {
      errors[name] = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }))
    }

    // Sections empty is a warning (plugin enabled but incomplete)
    // This is a UX validation, not a strict schema validation
    if (!plugin.sections || plugin.sections.length === 0) {
      errors[name] = errors[name] || []
      errors[name].push({
        path: "sections",
        message: "Selecione ao menos 1 seção",
      })
    }
  }

  return errors
}

/**
 * Checks if wizard state is valid (no errors)
 */
export function isWizardValid(state: WizardState): boolean {
  const errors = validateWizard(state)
  return Object.keys(errors).length === 0
}

/**
 * Gets validation errors for a specific plugin
 */
export function getPluginValidationErrors(
  state: WizardState,
  pluginName: string
): Array<{ path: string; message: string }> {
  const allErrors = validateWizard(state)
  return allErrors[pluginName] || []
}
