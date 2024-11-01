import logger from "core/utils/logger"
import React from "react"
import PluginsConfig from "source/plugins/@types/PluginsConfig"
import plugins, { PluginsData } from "source/plugins/plugins"
import TerminalHeader from "templates/Terminal/Terminal_Header"

const RenderActivePlugins = async (env: PluginsConfig, data: PluginsData): Promise<React.ReactNode> => {
  logger({ message: "Starting...", level: "info", __filename })
  const pluginComponents: Record<string, JSX.Element | null> = {}
  const pluginsOrder = env.plugins_order

  plugins.forEach((plugin) => {
    if (env[plugin.name]) {
      logger({ message: `Rendering ${plugin.name}...`, level: "info", __filename })

      if (!data[plugin.name]) {
        return null
      }

      pluginComponents[plugin.name] = (
        <plugin.renderer data={data[plugin.name]} key={plugin.name} plugin={env[plugin.name]} />
      )
    }
  })

  const orderedPlugins = pluginsOrder.map((plugin) => pluginComponents[plugin])

  return (
    <>
      {env.style === "terminal" && <TerminalHeader />}
      {orderedPlugins}
    </>
  )
}

export default RenderActivePlugins
