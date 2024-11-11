import { useEffect, useState } from "react"
import { PluginName, Plugin } from "source/plugins/@types/plugins"
import { PluginManager } from "source/plugins/@utils/PluginManager"
import usePluginSectionStore from "./pluginSectionStore"
import logger from "source/helpers/logger"

export function usePluginSection(pluginName: PluginName, section: string) {
  const { config, data, isLoading, error, startPlugin } = usePluginSectionStore()
  const [currentPlugin, setCurrentPlugin] = useState<Plugin<PluginName> | undefined>()

  useEffect(() => {
    const pluginManager = PluginManager.getInstance()
    const plugin = pluginManager.getPlugin(pluginName)
    setCurrentPlugin(plugin)

    if (!plugin) {
      logger({
        message: `Plugin "${pluginName}" is not found or is undefined.`,
        level: "error",
        __filename,
      })
      return
    }

    const initPlugin = async () => {
      if (pluginManager.hasPlugin(pluginName)) {
        await startPlugin(pluginName, section)
      }
    }
    initPlugin()
  }, [section, startPlugin, pluginName])

  return {
    currentPlugin,
    config,
    data,
    isLoading,
    error,
    isValidSection: currentPlugin ? currentPlugin.sections.includes(section) : false,
  }
}
