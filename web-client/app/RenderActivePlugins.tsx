"use client"
import React, { ReactNode, useEffect, useState } from "react"
import { isArrayEmpty } from "source/helpers/array"
import CheckPluginForRequiredValues from "source/plugins/@utils/checkPluginForRequiredValues"
import { PluginManager } from "source/plugins/@utils/PluginManager"
import ErrorMessage from "source/templates/Error_Style"
import SvgContainer from "templates/Main/SvgContainer"
import TerminalHeader from "templates/Terminal/Terminal_Header"
import useStore from "./store"

const RenderActivePlugins = (): JSX.Element => {
  const [pluginsComponents, setPluginsComponents] = useState<ReactNode[]>([])
  const { pluginsConfig, pluginsData, initPluginsData } = useStore()
  const svgWidth = pluginsConfig.size
  const style = pluginsConfig.style
  const pluginManager = PluginManager.getInstance()

  // Initialize the plugins data when necessary
  useEffect(() => {
    const activePlugins = pluginManager.getActivePlugins()
    const hasNullData = activePlugins.some(([name]) => !pluginsData[name])

    if (hasNullData) {
      initPluginsData()
    }
  }, [pluginsConfig, initPluginsData, pluginsData, pluginManager])

  useEffect(() => {
    const newComponents = pluginManager
      .getActivePlugins()
      .map(([pluginName, plugin]) => {
        const pluginData = pluginsData[pluginName]
        const specificConfigs = pluginsConfig[pluginName]

        // Early returns for invalid plugin states
        if (!specificConfigs || !specificConfigs.plugin_enabled) {
          return null
        }

        if (isArrayEmpty(specificConfigs?.sections)) {
          return <ErrorMessage message={`Plugin ${pluginName} has no sections`} key={pluginName} />
        }

        const error = CheckPluginForRequiredValues({
          plugin: specificConfigs,
          ENV_VARIABLES: plugin.envVariables,
          pluginName: plugin.name,
        })

        if (error) {
          return <React.Fragment key={pluginName}>{error}</React.Fragment>
        }

        // If we don't have data, we show a loading message
        if (!pluginData) {
          return <div key={pluginName}>Loading {pluginName} data...</div>
        }

        return <React.Fragment key={pluginName}>{plugin.renderer(specificConfigs, pluginData)}</React.Fragment>
      })
      .filter(Boolean)

    setPluginsComponents(newComponents)
  }, [pluginsConfig, pluginsData, pluginManager])

  return (
    <SvgContainer size={svgWidth} height={0} style={style} asDiv>
      <>
        {style === "terminal" && pluginManager.getActivePlugins().length > 0 && <TerminalHeader />}
        {pluginsComponents}
      </>
    </SvgContainer>
  )
}

export default RenderActivePlugins
