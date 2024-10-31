"use client"
import plugins from "plugins/plugins"
import React, { ReactNode, useEffect, useState } from "react"
import CheckPluginForRequiredValues from "source/plugins/@utils/checkPluginForRequiredValues"
import ErrorMessage from "source/templates/Error_Style"
import SvgContainer from "templates/Main/SvgContainer"
import TerminalHeader from "templates/Terminal/Terminal_Header"

import arrayIsEmpty from "web-client/utils/array"

import useStore from "./store"

function RenderActivePlugins(): JSX.Element {
  const [pluginsComponents, setPluginsComponents] = useState<ReactNode[]>([])
  const { activePlugins, pluginsConfig, pluginsData } = useStore()
  const svgWidth = pluginsConfig.size
  const style = pluginsConfig.style

  useEffect(() => {
    const newComponents: React.SetStateAction<ReactNode[]> | React.JSX.Element[] = []
    plugins.forEach((plugin) => {
      const pluginData = pluginsData[plugin.name]
      const specificConfigs = pluginsConfig[plugin.name]

      const activePluginKey = `plugin_${plugin.name}`
      const isPluginDisabled = !specificConfigs || !specificConfigs[activePluginKey]
      const isSectionsEmpty = arrayIsEmpty(specificConfigs.sections)

      if (isPluginDisabled) {
        return
      }

      if (isSectionsEmpty) {
        newComponents.push(<ErrorMessage message={`Plugin ${plugin.name} has no sections`} key={plugin.name} />)
        return
      }

      const error = CheckPluginForRequiredValues({
        plugin: specificConfigs,
        ENV_VARIABLES: plugin.envVariables,
        pluginName: plugin.name,
      })
      if (error) {
        newComponents.push(<ErrorMessage message={error.props.message} key={plugin.name} />)
        return
      }

      newComponents.push(<plugin.renderer data={pluginData} key={plugin.name} plugin={specificConfigs} />)
    })

    setPluginsComponents(newComponents)
  }, [pluginsConfig, pluginsData])

  return (
    <SvgContainer size={svgWidth} height={0} style={style} asDiv>
      <>
        {style === "terminal" && activePlugins.length > 0 && <TerminalHeader />}
        {pluginsComponents}
      </>
    </SvgContainer>
  )
}

export default RenderActivePlugins
