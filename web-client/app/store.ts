import plugins, { PluginsData } from "plugins/plugins"
import PluginsConfig from "source/plugins/@types/PluginsConfig"
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
  activePlugins: string[]
  addActivePlugin: (plugin: string) => void
  removeActivePlugin: (plugin: string) => void
  pluginsConfig: PluginsConfig
  setPluginsConfig: (config: PluginsConfig) => void
  updateConfigKey: (plugin: string, key: string, value: string | number | boolean | string[]) => void
  pluginsData: PluginsData
  setPluginsData: (data: PluginsData) => void
  initPluginsData: () => Promise<void>
  theme: Theme
  changeTheme: (theme: Theme) => void
  language: Language
  setLanguage: (language: Language) => void
  //dev tools
  resetConfig: () => void
  resetData: () => void
}

const useStore = create<Store>()(
  persist(
    (set) => ({
      githubUser: null,
      setGithubUser: (user) => set({ githubUser: user }),
      userError: null,
      activePlugins: [],
      addActivePlugin: (plugin) => {
        set((state) => {
          // Check if the plugin is already active
          if (!state.activePlugins.includes(plugin)) {
            return { activePlugins: [...state.activePlugins, plugin] }
          }
          return state
        })
        // If the plugin data is not initialized, initialize it
        if (useStore.getState().pluginsData[plugin] === null) {
          useStore.getState().initPluginsData()
        }
      },
      removeActivePlugin: (plugin) => {
        set((state) => ({
          activePlugins: state.activePlugins.filter((p) => p !== plugin),
        }))
      },
      initPluginsData: async () => {
        const data = await generateStartData()
        set({ pluginsData: data })
      },
      pluginsConfig: generateStartConfig(),
      setPluginsConfig: (config) => set({ pluginsConfig: config }),
      updateConfigKey: (plugin, key, value) => {
        set((state) => {
          if (plugin === "global") {
            return { pluginsConfig: { ...state.pluginsConfig, [key]: value } }
          }
          return {
            pluginsConfig: { ...state.pluginsConfig, [plugin]: { ...state.pluginsConfig[plugin], [key]: value } },
          }
        })

        if (key === `plugin_${plugin}`) {
          if (value === false) {
            useStore.getState().removeActivePlugin(plugin)
          } else {
            useStore.getState().addActivePlugin(plugin)
          }
        }
      },
      // initialize pluginsData with null values
      pluginsData: plugins.reduce((acc, plugin) => {
        acc[plugin.name] = null
        return acc
      }, {} as PluginsData),
      setPluginsData: (data) => set({ pluginsData: data }),
      theme: "light",
      changeTheme: (theme: Theme) => {
        if (theme !== "light" && theme !== "dark") {
          return
        }
        set({ theme })
        document.documentElement.setAttribute("data-theme", theme)
      },
      language: "en",
      setLanguage: (language: Language) => set({ language }),
      resetConfig: () => {
        set({ activePlugins: [] })
        set({ githubUser: null })
        set({ pluginsConfig: generateStartConfig() })
      },
      resetData: async () => {
        const data = await generateStartData()
        set({ pluginsData: data })
        set({ activePlugins: [] })
      },
    }),
    {
      // Options for persist middleware
      name: "weeb-profile-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useStore
