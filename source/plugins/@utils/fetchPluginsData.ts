import toBoolean from "core/utils/toBoolean"
import plugins, { PluginsData, pluginsDataStructure } from "source/plugins/plugins"
import getEnvVariables from "./getEnvVariables"
import logger from "core/utils/logger"

async function fetchPluginsData(dev = false): Promise<PluginsData> {
  logger({ message: "Fetching plugins data...", level: "info", __filename })
  const newPluginsDataStructure = { ...pluginsDataStructure }
  const env = getEnvVariables()

  await Promise.all(
    plugins.map(async (plugin) => {
      const pluginKey = plugin.name
      const pluginConfig = env[pluginKey]
      const pluginActiveKey = `plugin_${pluginKey}`
      const isPluginActive = pluginConfig ? toBoolean(pluginConfig[pluginActiveKey]) : false

      if (isPluginActive) {
        logger({
          message: `Fetching data for ${pluginKey}...`,
          level: "info",
          __filename,
        })
        const data = await plugin.fetchData(pluginConfig, dev)
        newPluginsDataStructure[pluginKey] = data
      }
    })
  )
    .then(() => {
      logger({ message: "Plugins data fetched", level: "info", __filename })
    })
    .catch((error) => {
      logger({
        message: `Error fetching plugins data: ${error}`,
        level: "error",
        __filename,
        header: true,
      })
    })

  logger({ message: "Plugins data fetched", level: "info", __filename })
  return newPluginsDataStructure
}

export default fetchPluginsData
