import logger from "source/helpers/logger"
import React from "react"
import { PluginDataMap } from "source/plugins/@types/plugins"
import getEnvVariables from "source/plugins/@utils/getEnvVariables"
import { PluginManager } from "source/plugins/@utils/PluginManager"
import { PluginRegistry } from "source/plugins/plugins"

interface RenderActivePluginsProps {
  pluginsData: PluginDataMap
}

const RenderActivePlugins = ({ pluginsData }: RenderActivePluginsProps): JSX.Element => {
  const pluginManager = PluginManager.getInstance()
  const activePlugins = pluginManager.getActivePlugins()
  const env = getEnvVariables()

  if (activePlugins.length === 0) {
    logger({ message: "No active plugins found", level: "error", __filename })
  }

  return (
    <>
      {activePlugins.map(([name, plugin]) => {
        const data = pluginsData[name]
        const config = env[name]

        if (!data || !config) {
          logger({
            message: `Missing ${!data ? "data" : "config"} for plugin ${name}`,
            level: "error",
            __filename,
          })
          return null
        }

        try {
          return (
            <React.Fragment key={name}>
              {plugin.renderer(
                config as PluginRegistry[typeof name]["config"],
                data as PluginRegistry[typeof name]["data"]
              )}
            </React.Fragment>
          )
        } catch (error) {
          logger({
            message: `Error rendering plugin ${name}: ${error}`,
            level: "error",
            __filename,
          })
          return null
        }
      })}
    </>
  )
}

export default RenderActivePlugins
