import { PluginDataMap, PluginName, PluginsConfig } from "source/plugins/@types/plugins"
import { PluginManager } from "source/plugins/@utils/PluginManager"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { generateStartConfig, generateStartData } from "./storeHelpers"
import { Language, Theme } from "./storeTypes"

export function getConfigValuesFromStore(): PluginsConfig {
  const store = useStore.getState()
  return store.pluginsConfig
}

interface Store {
  githubUser: string | null
  setGithubUser: (user: string) => void
  userError: string | null
  pluginsConfig: PluginsConfig
  setPluginsConfig: (config: PluginsConfig) => void
  updateConfigKey: (plugin: string, key: string, value: string | number | boolean | string[]) => void
  pluginsData: PluginDataMap | null
  setPluginsData: (data: PluginDataMap) => void
  initPluginsData: () => Promise<void>
  theme: Theme
  changeTheme: (theme: Theme) => void
  language: Language
  setLanguage: (language: Language) => void
  resetConfig: () => void
  resetData: () => void
  initializeStore: () => void
}

const useStore = create<Store>()(
  persist(
    (set, get) => {
      return {
        initializeStore: () => {
          const pluginManager = PluginManager.getInstance()
          const config = get().pluginsConfig
          pluginManager.initializeActivePlugins(config)
        },
        githubUser: null,
        setGithubUser: (user) => set({ githubUser: user }),
        userError: null,
        pluginsConfig: generateStartConfig(),
        setPluginsConfig: (config) => set({ pluginsConfig: config }),
        updateConfigKey: (plugin, key, value) => {
          set((state) => {
            const newConfig =
              plugin === "global"
                ? { ...state.pluginsConfig, [key]: value }
                : {
                    ...state.pluginsConfig,
                    [plugin]: { ...state.pluginsConfig[plugin], [key]: value },
                  }

            // Always update environment and plugin manager
            const pluginManager = PluginManager.getInstance()
            const envManager = EnvironmentManager.getInstance()

            // Special handling for plugin_enabled
            if (key === "plugin_enabled") {
              if (value === false) {
                pluginManager.deactivatePlugin(plugin as PluginName)
              } else {
                pluginManager.activatePlugin(plugin as PluginName)
                get().initPluginsData()
              }
            }

            // Force environment refresh
            pluginManager.initializeActivePlugins(newConfig)
            envManager.hardSetEnv(newConfig)

            return { pluginsConfig: newConfig }
          })
        },
        pluginsData: null,
        setPluginsData: (data) => set({ pluginsData: data }),
        initPluginsData: async () => {
          const data = await generateStartData()
          set({ pluginsData: data })
        },
        theme: "light",
        changeTheme: (theme: Theme) => {
          if (theme !== "light" && theme !== "dark") return
          set({ theme })
          document.documentElement.setAttribute("data-theme", theme)
        },
        language: "en",
        setLanguage: (language: Language) => set({ language }),
        resetConfig: () => {
          set({
            githubUser: null,
            pluginsConfig: generateStartConfig(),
          })
          PluginManager.getInstance().initializeActivePlugins({})
        },
        resetData: async () => {
          set({ pluginsData: await generateStartData() })
        },
      }
    },
    {
      name: "weeb-profile-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useStore
