/**
 * Wizard Bootstrap Store
 * 
 * Centralized store for wizard data that loads once on mount.
 * Prevents multiple fetches and provides single source of truth.
 * 
 * Features:
 * - Bootstrap once on mount (with double-fetch protection)
 * - Secrets presence for ALL plugins (not just enabled)
 * - Profile data (non-sensitive)
 * - No reactive fetching on plugin enable/disable
 */

import { create } from "zustand"
import { profileApi } from "@/lib/api"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"

interface ProfileData {
  username?: string
}

interface SecretsPresence {
  [pluginName: string]: {
    [key: string]: {
      exists: boolean
      updatedAt?: string
    }
  }
}

interface MissingSecret {
  pluginName: string
  missingKeys: Array<{ key: string; label: string }>
}

interface SecretsPresenceResponse {
  presence?: SecretsPresence
  missingSecrets?: MissingSecret[]
}

interface WizardBootstrapState {
  // Non-sensitive config
  profile: ProfileData | null
  
  // Secrets presence only (no values) - for ALL plugins, not just enabled
  secretsPresence: SecretsPresence
  missingSecrets: MissingSecret[]
  
  // Loading states
  loading: boolean
  error: Error | null
  
  // PROTECTION: Prevent double-fetch (React Strict Mode)
  initialized: boolean
  bootstrapPromise: Promise<void> | null
  
  // Actions
  bootstrap: () => Promise<void>
  refreshSecretsPresence: () => Promise<void>
  updateSecretsPresenceOptimistic: (plugin: string, key: string) => void
  reset: () => void
}

export const useWizardBootstrapStore = create<WizardBootstrapState>((set, get) => ({
  profile: null,
  secretsPresence: {},
  missingSecrets: [],
  loading: false,
  error: null,
  initialized: false,
  bootstrapPromise: null,

  bootstrap: async () => {
    const state = get()
    
    // PROTECTION 1: Already initialized
    if (state.initialized) {
      return
    }
    
    // PROTECTION 2: Bootstrap in progress (React Strict Mode)
    if (state.bootstrapPromise) {
      return state.bootstrapPromise
    }
    
    // Create promise and store it
    const promise = (async () => {
      set({ loading: true, error: null })
      
      try {
        // Fetch profile (non-sensitive)
        const profileData = await profileApi.get()
        
        // Get ALL plugin names from metadata
        const allPluginNames = Object.keys(PLUGINS_METADATA)
        
        // Fetch secrets presence for ALL plugins (not just enabled)
        // This allows UI to show status before enabling plugins
        const presenceResponse = await fetch(
          `/api/secrets/presence?enabledPlugins=${allPluginNames.join(",")}`
        )
        
        if (!presenceResponse.ok) {
          throw new Error(`Failed to fetch secrets presence: ${presenceResponse.statusText}`)
        }
        
        const presenceData = (await presenceResponse.json()) as SecretsPresenceResponse
        
        set({
          profile: profileData.profile || null,
          secretsPresence: presenceData.presence || {},
          missingSecrets: presenceData.missingSecrets || [],
          initialized: true,
          loading: false,
          bootstrapPromise: null, // Clear promise on success
        })
      } catch (error) {
        console.error("Bootstrap error:", error)
        set({
          error: error instanceof Error ? error : new Error("Bootstrap failed"),
          loading: false,
          bootstrapPromise: null, // Clear promise on error
        })
      }
    })()
    
    set({ bootstrapPromise: promise })
    return promise
  },

  refreshSecretsPresence: async () => {
    const state = get()
    
    try {
      // Get ALL plugin names from metadata
      const allPluginNames = Object.keys(PLUGINS_METADATA)
      
      const presenceResponse = await fetch(
        `/api/secrets/presence?enabledPlugins=${allPluginNames.join(",")}`
      )
      
      if (!presenceResponse.ok) {
        throw new Error(`Failed to refresh secrets presence: ${presenceResponse.statusText}`)
      }
      
      const presenceData = (await presenceResponse.json()) as SecretsPresenceResponse
      
      set({
        secretsPresence: presenceData.presence || {},
        missingSecrets: presenceData.missingSecrets || [],
      })
    } catch (error) {
      console.error("Error refreshing secrets presence:", error)
      // Don't set error state here - just log it
      // The UI can still use stale data
    }
  },

  updateSecretsPresenceOptimistic: (plugin: string, key: string) => {
    set((state) => {
      const newPresence = { ...state.secretsPresence }
      if (!newPresence[plugin]) {
        newPresence[plugin] = {}
      }
      newPresence[plugin][key] = {
        exists: true,
        updatedAt: new Date().toISOString(),
      }
      
      // Remover de missingSecrets
      const newMissingSecrets = state.missingSecrets.map((ms) => {
        if (ms.pluginName === plugin) {
          return {
            ...ms,
            missingKeys: ms.missingKeys.filter((k) => k.key !== key),
          }
        }
        return ms
      }).filter((ms) => ms.missingKeys.length > 0)
      
      return {
        secretsPresence: newPresence,
        missingSecrets: newMissingSecrets,
      }
    })
  },

  reset: () => {
    set({
      profile: null,
      secretsPresence: {},
      missingSecrets: [],
      loading: false,
      error: null,
      initialized: false,
      bootstrapPromise: null,
    })
  },
}))

