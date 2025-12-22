import { create } from "zustand"
import { persist } from "zustand/middleware"
import { profileApi } from "@/lib/api"

interface ProfileData {
  username?: string
}

interface EssentialConfigs {
  [pluginName: string]: {
    [key: string]: boolean
  }
}

interface MissingConfig {
  pluginName: string
  missingKeys: Array<{ key: string; label: string }>
}

interface ProfileStore {
  // Profile data
  profile: ProfileData | null
  profileLoading: boolean
  profileError: Error | null
  profileLastFetch: number | null

  // Essential configs (cache por combinação de plugins)
  essentialConfigsCache: Record<string, {
    configs: EssentialConfigs
    missingConfigs: MissingConfig[]
    timestamp: number
  }>
  
  cacheMaxAge: number // 5 minutos

  // Actions
  fetchProfile: (force?: boolean) => Promise<void>
  getEssentialConfigs: (enabledPlugins: string[], force?: boolean) => Promise<{
    essentialConfigs: EssentialConfigs
    missingConfigs: MissingConfig[]
  }>
  clearCache: () => void
}

const CACHE_MAX_AGE = 5 * 60 * 1000 // 5 minutos

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profile: null,
      profileLoading: false,
      profileError: null,
      profileLastFetch: null,
      essentialConfigsCache: {},
      cacheMaxAge: CACHE_MAX_AGE,

      fetchProfile: async (force = false) => {
        const state = get()
        
        // Se não for forçado e já temos dados recentes, não buscar
        if (!force && state.profile && state.profileLastFetch) {
          const timeSinceLastFetch = Date.now() - state.profileLastFetch
          if (timeSinceLastFetch < 60000) { // 1 minuto
            return
          }
        }

        // Só mostrar loading se não tiver dados em cache
        const hasCachedData = !!state.profile
        if (!hasCachedData) {
          set({ profileLoading: true, profileError: null })
        }

        try {
          const data = await profileApi.get()
          set({
            profile: data.profile || null,
            profileLoading: false,
            profileLastFetch: Date.now(),
          })
        } catch (error) {
          console.error("Error fetching profile:", error)
          set({
            profileError: error instanceof Error ? error : new Error("Unknown error"),
            profileLoading: false,
          })
        }
      },

      getEssentialConfigs: async (enabledPlugins: string[], force = false) => {
        // Criar chave estável baseada nos plugins habilitados
        const cacheKey = enabledPlugins.sort().join(",")
        const state = get()

        // Verificar cache primeiro
        if (!force && state.essentialConfigsCache[cacheKey]) {
          const cached = state.essentialConfigsCache[cacheKey]
          const age = Date.now() - cached.timestamp
          
          // Se o cache ainda é válido, retornar
          if (age < state.cacheMaxAge) {
            return {
              essentialConfigs: cached.configs,
              missingConfigs: cached.missingConfigs,
            }
          }
        }

        // Buscar do servidor
        try {
          const data = await profileApi.getEssentialConfigs(enabledPlugins)
          
          const essentialConfigs = data.essentialConfigs || {}
          const missingConfigs = data.missingConfigs || []

          // Atualizar cache
          set({
            essentialConfigsCache: {
              ...state.essentialConfigsCache,
              [cacheKey]: {
                configs: essentialConfigs,
                missingConfigs,
                timestamp: Date.now(),
              },
            },
          })

          return { essentialConfigs, missingConfigs }
        } catch (error) {
          console.error("Error fetching essential configs:", error)
          // Retornar cache antigo se disponível, ou vazio
          if (state.essentialConfigsCache[cacheKey]) {
            const cached = state.essentialConfigsCache[cacheKey]
            return {
              essentialConfigs: cached.configs,
              missingConfigs: cached.missingConfigs,
            }
          }
          return {
            essentialConfigs: {},
            missingConfigs: enabledPlugins.map(name => ({ pluginName: name, missingKeys: [] })),
          }
        }
      },

      clearCache: () => {
        set({
          essentialConfigsCache: {},
          profileLastFetch: null,
        })
      },
    }),
    {
      name: "profile-storage",
      partialize: (state) => ({
        profile: state.profile,
        essentialConfigsCache: state.essentialConfigsCache,
        profileLastFetch: state.profileLastFetch,
      }),
      // Limpar cache antigo na rehydratação
      onRehydrateStorage: () => (state) => {
        if (state) {
          const now = Date.now()
          const validCache: Record<string, {
            configs: EssentialConfigs
            missingConfigs: MissingConfig[]
            timestamp: number
          }> = {}
          
          // Manter apenas cache válido
          Object.entries(state.essentialConfigsCache).forEach(([key, cached]) => {
            const age = now - cached.timestamp
            if (age < state.cacheMaxAge) {
              validCache[key] = cached
            }
          })

          state.essentialConfigsCache = validCache
        }
      },
    }
  )
)


