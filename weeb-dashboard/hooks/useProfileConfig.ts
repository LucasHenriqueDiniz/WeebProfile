/**
 * Hook para gerenciar profile e essential configs
 * 
 * REFACTORED: Now uses wizard-bootstrap-store instead of fetching.
 * Data is bootstrapped once on mount, this hook just reads from store.
 * 
 * Maintains backward compatibility with existing components.
 */

import { useMemo } from "react"
import { useWizardBootstrapStore } from "@/stores/wizard-bootstrap-store"

interface ProfileConfigData {
  profile: {
    username?: string
  } | null
  essentialConfigs: Record<string, Record<string, boolean>> // Apenas status (true/false), não valores
  missingConfigs: Array<{ pluginName: string; missingKeys: Array<{ key: string; label: string }> }>
  loading: boolean
  error: Error | null
}

export function useProfileConfig(enabledPlugins: string[]): ProfileConfigData {
  const { profile, secretsPresence, missingSecrets, loading, error } = useWizardBootstrapStore()
  
  // Transform secretsPresence to essentialConfigs format (backward compatibility)
  const essentialConfigs = useMemo(() => {
    const result: Record<string, Record<string, boolean>> = {}
    
    // Filter to only enabled plugins
    for (const pluginName of enabledPlugins) {
      const pluginPresence = secretsPresence[pluginName]
      if (pluginPresence) {
        result[pluginName] = {}
        for (const [key, presence] of Object.entries(pluginPresence)) {
          result[pluginName]![key] = presence.exists
        }
      }
    }
    
    return result
  }, [secretsPresence, enabledPlugins])
  
  // Filter missingSecrets to only enabled plugins
  const filteredMissingConfigs = useMemo(() => {
    return missingSecrets.filter(({ pluginName }) => enabledPlugins.includes(pluginName))
  }, [missingSecrets, enabledPlugins])

  return {
    profile,
    essentialConfigs,
    missingConfigs: filteredMissingConfigs,
    loading,
    error,
  }
}

