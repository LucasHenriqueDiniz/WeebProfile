/**
 * Hook to auto-save plugin configs (username, etc.) to plugin_config table
 * 
 * When user edits username in PluginCard, it should be saved to plugin_config
 * immediately (debounced) so it's reusable across all SVGs.
 */

import { useEffect, useRef } from "react"
import { useWizardStore } from "@/stores/wizard-store"
import { useWizardBootstrapStore } from "@/stores/wizard-bootstrap-store"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"

const DEBOUNCE_MS = 2000 // 2 seconds

export function usePluginConfigAutoSave() {
  const plugins = useWizardStore((state) => state.plugins)
  const { refreshPluginConfigs } = useWizardBootstrapStore()
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({})

  useEffect(() => {
    // Save usernames and other requiredFields to plugin_config when they change
    Object.keys(plugins).forEach((pluginName) => {
      const plugin = plugins[pluginName]
      if (!plugin) return

      const metadata = PLUGINS_METADATA[pluginName as keyof typeof PLUGINS_METADATA]
      if (!metadata) return

      // Check requiredFields (username, etc.)
      const requiredFields = metadata.requiredFields || []
      requiredFields.forEach((field) => {
        const value = (plugin as any)[field]
        const key = `${pluginName}.${field}`

        // Clear existing timeout
        if (timeoutRefs.current[key]) {
          clearTimeout(timeoutRefs.current[key])
        }

        // Only save if value exists and is non-empty
        if (value && typeof value === "string" && value.trim()) {
          // Debounce save
          timeoutRefs.current[key] = setTimeout(async () => {
            try {
              const configToSave: Record<string, any> = {}
              configToSave[field] = value.trim()

              await fetch("/api/plugin-config", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  configs: {
                    [pluginName]: configToSave,
                  },
                }),
              })

              // Refresh plugin configs in bootstrap store
              await refreshPluginConfigs()
            } catch (error) {
              console.error(`Error auto-saving ${field} for ${pluginName}:`, error)
              // Don't show error to user - silent fail
            }
          }, DEBOUNCE_MS)
        }
      })
    })

    // Cleanup timeouts on unmount
    return () => {
      Object.values(timeoutRefs.current).forEach((timeout) => {
        clearTimeout(timeout)
      })
      timeoutRefs.current = {}
    }
  }, [plugins, refreshPluginConfigs])
}

