"use client"
import logger from "source/helpers/logger"
import {
  PluginConfigMap,
  PluginDataResult,
  PluginName,
  PluginsConfig,
  PluginsRawConfig,
} from "source/plugins/@types/plugins"
import { PluginManager } from "source/plugins/@utils/PluginManager"
import MAIN_ENV_VARIABLES from "source/plugins/ENV_VARIABLES"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

function generateStartConfig(name: PluginName, section: string): PluginsConfig {
  logger({ message: `Getting config for ${name}`, level: "debug", __filename })

  const baseConfig: PluginsRawConfig = {
    gist_id: "NOT USED IN DEV",
    gh_token: "NOT USED IN DEV",
    filename: "NOT USED IN DEV",
    storage_method: "local", // @TODO: Add dev storage method  (will do nothing)
    size: (MAIN_ENV_VARIABLES.size?.defaultValue as string) || "half",
    style: (MAIN_ENV_VARIABLES.style?.defaultValue as string) || "default",
    custom_css: "NOT USED IN DEV",
    plugins_order: (MAIN_ENV_VARIABLES.plugins_order?.defaultValue as string[]) || [],
    custom_path: "NOT USED IN DEV",
    hide_terminal_emojis: (MAIN_ENV_VARIABLES.hide_terminal_emojis?.defaultValue as boolean) || false,
    hide_terminal_header: (MAIN_ENV_VARIABLES.hide_terminal_header?.defaultValue as boolean) || false,
    terminal_theme: (MAIN_ENV_VARIABLES.terminal_theme?.defaultValue as string) || "default",
    default_theme: (MAIN_ENV_VARIABLES.default_theme?.defaultValue as string) || "default",
  }

  const pluginManager = PluginManager.getInstance()
  const pluginConfig = pluginManager.createSinglePluginConfig(name, true, [section])

  return {
    ...baseConfig,
    [name]: { ...pluginConfig },
  }
}

async function generateStartData(
  name: PluginName,
  config: PluginConfigMap[PluginName]
): Promise<PluginDataResult<PluginName> | null> {
  logger({ message: `Getting data for ${name}`, level: "debug", __filename })
  const pluginManager = PluginManager.getInstance()
  if (!config) {
    logger({ message: `Config is not set`, level: "error", __filename })
    return null
  }

  const response = await pluginManager.fetchPluginData(name, config, true)
  return { name, data: response.data }
}

interface PluginSectionStore {
  pluginName: PluginName | null
  pluginSection: string | null
  config: PluginsConfig | null
  data: PluginDataResult<PluginName> | null
  isLoading: boolean
  error: string | null
  startPlugin: (name: PluginName, section: string) => Promise<void>
  getData: (name: PluginName, config: PluginConfigMap[PluginName]) => Promise<PluginDataResult<PluginName> | null>
  getConfig: (name: PluginName, section: string) => PluginConfigMap[PluginName] | null
  setConfigValue: (name: PluginName, value: PluginConfigMap[PluginName]) => void
  restartConfig: () => void
  restartData: () => void
}

const usePluginSectionStore = create<PluginSectionStore>()(
  persist(
    (set, get) => ({
      config: null,
      pluginName: null,
      pluginSection: null,
      data: null,
      isLoading: false,
      error: null,
      startPlugin: async (name: PluginName, section: string) => {
        set({ isLoading: true, error: null })
        try {
          set({ pluginName: name, pluginSection: section })
          const baseConfig = generateStartConfig(name, section)
          const pluginConfig = get().getConfig(name, section)

          if (!pluginConfig) {
            logger({ message: `Plugin config for ${name} is not found`, level: "error", __filename })
            return
          }

          get().setConfigValue(name, { sections: [section] } as PluginConfigMap[PluginName])

          const pluginData = await get().getData(name, pluginConfig)
          set({ config: { ...baseConfig, [name]: pluginConfig }, data: pluginData })
          logger({ message: `Config: ${JSON.stringify(pluginConfig)}`, level: "debug", __filename })
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "An error occurred" })
        } finally {
          set({ isLoading: false })
        }
      },
      getData: async (name: PluginName, config: PluginConfigMap[PluginName]) => {
        logger({ message: `Getting data for ${name}`, level: "debug", __filename })
        const pluginData = await generateStartData(name, config)
        set({ data: pluginData })
        return pluginData
      },
      getConfig: (name: PluginName, section: string) => {
        logger({ message: `Getting config for ${name}`, level: "debug", __filename })
        const config = generateStartConfig(name, section)
        set({ config })
        return config[name] as PluginConfigMap[PluginName]
      },
      setConfigValue: (name: PluginName, value: PluginConfigMap[PluginName]) => {
        logger({ message: `Setting config value for ${name}`, level: "debug", __filename })
        const config = get().config
        if (!config) {
          logger({ message: `Config is not set`, level: "error", __filename })
          return
        }
        set({ config: { ...config, [name]: value } })
      },
      restartConfig: () => {
        const name = get().pluginName
        const section = get().pluginSection
        if (!name || !section) {
          logger({ message: `Plugin name or section is not set`, level: "error", __filename })
          return
        }
        logger({ message: `Regenerating config for ${name}`, level: "debug", __filename })
        set((state) => ({ ...state, config: generateStartConfig(name, section) }))
      },
      restartData: async () => {
        const name = get().pluginName
        const config = get().config
        if (!name || !config) {
          logger({ message: `Plugin name or section or config is not set`, level: "error", __filename })
          return
        }
        logger({ message: `Regenerating data for ${name}`, level: "debug", __filename })
        const pluginData = await generateStartData(name, config[name])
        set({ data: pluginData })
      },
    }),
    {
      name: "plugin-section-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default usePluginSectionStore
