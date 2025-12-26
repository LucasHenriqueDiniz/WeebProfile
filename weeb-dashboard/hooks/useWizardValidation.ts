/**
 * Wizard Validation Hook
 * 
 * Provides validation state and errors for the wizard.
 * Uses memoization to avoid recalculating on every render.
 */

import { useMemo } from "react"
import { useWizardStore } from "@/stores/wizard-store"
import { validateWizard, isWizardValid, type ValidationErrors } from "@/lib/validation/wizard-validation"

/**
 * Hook that provides validation state for the wizard
 * 
 * @returns Object with validation errors and isValid flag
 */
export function useWizardValidation(): {
  errors: ValidationErrors
  isValid: boolean
  hasErrors: boolean
} {
  const state = useWizardStore()

  const errors = useMemo(() => validateWizard(state), [
    state.plugins,
    state.pluginsOrder,
  ])

  const isValid = useMemo(() => isWizardValid(state), [state.plugins, state.pluginsOrder])
  const hasErrors = Object.keys(errors).length > 0

  return {
    errors,
    isValid,
    hasErrors,
  }
}
