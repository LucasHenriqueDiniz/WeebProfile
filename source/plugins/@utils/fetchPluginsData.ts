import logger from "source/helpers/logger"
import { PluginDataMap } from "../@types/plugins"
import { PluginRegistry } from "../plugins"
import { EnvironmentManager } from "./EnvManager"
import { PluginManager } from "./PluginManager"

async function fetchPluginsData(dev = false): Promise<PluginDataMap> {
  logger({ message: "Fetching plugins data...", level: "info", __filename })

  try {
    const pluginManager = PluginManager.getInstance()
    const envManager = EnvironmentManager.getInstance()

    const env = envManager.getEnv()
    pluginManager.initializeActivePlugins(env)

    const activePlugins = pluginManager.getActivePlugins()
    const pluginsData = pluginManager.createEmptyDataMap()

    const results = await Promise.all(
      activePlugins.map(([name, _]) => pluginManager.fetchPluginData(name, env[name]!, dev))
    )

    // Type-safe update of the data map
    results.forEach(({ name, data }) => {
      if (data) {
        ;(pluginsData[name] as PluginRegistry[typeof name]["data"] | null) = data
      }
    })

    logger({
      message: `Plugins data fetched for ${activePlugins.map((p) => p[0]).join(", ")}`,
      level: "success",
      __filename,
    })
    return pluginsData
  } catch (error) {
    logger({
      message: `Error fetching plugins data: ${error}`,
      level: "error",
      __filename,
      header: true,
    })
    return PluginManager.getInstance().createEmptyDataMap()
  }
}

export default fetchPluginsData
