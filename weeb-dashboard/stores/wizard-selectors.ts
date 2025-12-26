/**
 * Canonical selectors for wizard state
 * 
 * These are pure functions that extract derived state from WizardState.
 * Use these selectors throughout the codebase to ensure consistency.
 */

import type { WizardState, PluginConfig } from "./wizard-store"

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
  return selectEnabledPluginNames(state).filter(
    (name) => (state.plugins[name]?.sections?.length || 0) > 0
  )
}

/**
 * Returns total count of sections across all enabled plugins
 */
export function selectTotalSections(state: SelectorState): number {
  return selectEnabledPluginNames(state).reduce(
    (sum, name) => sum + (state.plugins[name]?.sections?.length || 0),
    0
  )
}
