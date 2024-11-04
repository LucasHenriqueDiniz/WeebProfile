import { PluginDataMap, PluginName, PluginsConfig } from "source/plugins/@types/plugins"
import { PluginManager } from "source/plugins/@utils/PluginManager"
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
  pluginsData: PluginDataMap
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
    (set, get) => ({
      initializeStore: () => {
        const config = get().pluginsConfig
        const pluginManager = PluginManager.getInstance()
        pluginManager.initializeActivePlugins(config)
      },
      githubUser: null,
      setGithubUser: (user) => set({ githubUser: user }),
      userError: null,
      pluginsConfig: generateStartConfig(),
      setPluginsConfig: (config) => set({ pluginsConfig: config }),
      updateConfigKey: (plugin, key, value) => {
        set((state) => {
          if (plugin === "global") {
            return { pluginsConfig: { ...state.pluginsConfig, [key]: value } }
          }
          return {
            pluginsConfig: {
              ...state.pluginsConfig,
              [plugin]: { ...state.pluginsConfig[plugin], [key]: value },
            },
          }
        })

        if (key === "plugin_enabled") {
          const pluginManager = PluginManager.getInstance()
          if (value === false) {
            pluginManager.deactivatePlugin(plugin as PluginName)
          } else {
            pluginManager.activatePlugin(plugin as PluginName)
            useStore.getState().initPluginsData()
          }
          pluginManager.initializeActivePlugins(useStore.getState().pluginsConfig)
        }
      },
      pluginsData: PluginManager.getInstance().createEmptyDataMap(),
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
    }),
    {
      name: "weeb-profile-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useStore
