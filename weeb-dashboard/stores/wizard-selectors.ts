/**
 * Canonical selectors for wizard state
 *
 * These are pure functions that extract derived state from WizardState.
 * Use these selectors throughout the codebase to ensure consistency.
 */

import type { WizardState, PluginConfig } from "./wizard-store"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"

interface MissingSecret {
  pluginName: string
  missingKeys: Array<{ key: string; label: string }>
}

/**
 * Minimal state interface for selectors (only what they need)
 */
type SelectorState = Pick<WizardState, "plugins" | "pluginsOrder">

/**
 * Returns names of plugins that are enabled (enabled === true)
 * Uses pluginsOrder to maintain consistent ordering
 */
export function selectEnabledPluginNames(state: SelectorState): string[] {
  return state.pluginsOrder.filter((name) => !!state.plugins[name]?.enabled)
}

/**
 * Returns enabled plugins as [name, config] tuples
 * Uses pluginsOrder to maintain consistent ordering
 */
export function selectEnabledPlugins(state: SelectorState): Array<[string, PluginConfig]> {
  return selectEnabledPluginNames(state).map((name) => [name, state.plugins[name]!] as const)
}

/**
 * Returns names of enabled plugins that have at least one section selected
 * Useful for preview rendering and validation
 */
export function selectPluginsWithSections(state: SelectorState): string[] {
  return selectEnabledPluginNames(state).filter((name) => (state.plugins[name]?.sections?.length || 0) > 0)
}

/**
 * Returns total count of sections across all enabled plugins
 */
export function selectTotalSections(state: SelectorState): number {
  return selectEnabledPluginNames(state).reduce((sum, name) => sum + (state.plugins[name]?.sections?.length || 0), 0)
}

/**
 * Returns missing configs (secrets + requiredFields) for plugins that participate in render
 *
 * CRÍTICO: Espelha exatamente o critério do backend (validate-required-config.ts:37):
 * - Only validates plugins with enabled === true AND sections.length > 0
 * - This prevents "phantom warnings" for enabled plugins without sections
 *
 * @param state - Wizard state (plugins, pluginsOrder)
 * @param bootstrap - Bootstrap data (missingSecrets)
 * @returns Array of missing configs with plugin, field, and label
 */
export function selectMissingConfigs(
  state: SelectorState,
  bootstrap: { missingSecrets: MissingSecret[] }
): Array<{ plugin: string; field: string; label: string }> {
  // CRÍTICO: Usar selectPluginsWithSections (enabled && sections.length > 0)
  // para espelhar exatamente o critério do backend (validate-required-config.ts:37)
  const pluginsToValidate = selectPluginsWithSections(state)

  // Filtrar missingSecrets apenas para plugins que realmente participam do render
  const relevantMissingSecrets = bootstrap.missingSecrets.filter(({ pluginName }) =>
    pluginsToValidate.includes(pluginName)
  )

  // Calcular missing requiredFields para plugins que participam do render
  const fieldsMissing: Array<{ plugin: string; field: string; label: string }> = []

  pluginsToValidate.forEach((pluginName) => {
    const plugin = state.plugins[pluginName]
    if (!plugin?.enabled || !plugin.sections?.length) return

    const metadata = PLUGINS_METADATA[pluginName as keyof typeof PLUGINS_METADATA]
    if (!metadata) return

    metadata.requiredFields.forEach((field) => {
      const value = (plugin as any)[field]
      const isEmpty = typeof value === "string" ? !value.trim() : !value
      if (isEmpty) {
        fieldsMissing.push({
          plugin: pluginName,
          field,
          label: field.replace(/([A-Z])/g, " $1").trim(),
        })
      }
    })
  })

  // Combinar secrets e fields
  const secretsMissing = relevantMissingSecrets.flatMap(({ pluginName, missingKeys }) =>
    missingKeys.map((key) => ({
      plugin: pluginName,
      field: key.key,
      label: key.label || key.key,
    }))
  )

  // Deduplicar
  const combined = [...secretsMissing, ...fieldsMissing]
  return combined.filter(
    (item, index, self) => index === self.findIndex((t) => t.plugin === item.plugin && t.field === item.field)
  )
}
