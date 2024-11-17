"use client"
import React, { ReactNode, useEffect, useState } from "react"
import { isArrayEmpty } from "source/helpers/array"
import CheckPluginForRequiredValues from "source/plugins/@utils/checkPluginForRequiredValues"
import { PluginManager } from "source/plugins/@utils/PluginManager"
import ErrorMessage from "source/templates/Error_Style"
import SvgContainer from "templates/Main/SvgContainer"
import useStore from "./store"
import "./globals.css"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"

const RenderActivePlugins = (): JSX.Element => {
  // const [envVersion, setEnvVersion] = useState(0)
  const [pluginsComponents, setPluginsComponents] = useState<ReactNode[]>([])
  const { pluginsConfig, pluginsData, initPluginsData } = useStore()
  const svgWidth = pluginsConfig.size
  const style = pluginsConfig.style

  const defaultTheme = pluginsConfig.defaultTheme
  const terminalTheme = pluginsConfig.terminalTheme

  const pluginManager = PluginManager.getInstance()
  const envManager = EnvironmentManager.getInstance()

  // useEffect(() => {
  //   setEnvVersion((v) => v + 1)
  //   envManager.refreshEnv()
  // }, [pluginsConfig, envManager])

  // useEffect(() => {
  //   const unsubscribe = envManager.subscribe((newVersion) => {
  //     setEnvVersion(newVersion)
  //   })
  //   return () => unsubscribe()
  // }, [envManager])

  useEffect(() => {
    const env = envManager.getEnv()
    const activePlugins = pluginManager.getActivePlugins()
    const hasNullData = activePlugins.some(([name]) => !pluginsData?.[name])

    if (hasNullData || !pluginsData) {
      initPluginsData()
    }

    pluginManager.initializeActivePlugins({
      ...env,
    })
  }, [pluginsConfig, initPluginsData, pluginsData, pluginManager, envManager])

  useEffect(() => {
    const newComponents = pluginManager
      .getActivePlugins()
      .map(([pluginName, plugin]) => {
        const pluginData = pluginsData?.[pluginName]
        const specificConfigs = pluginsConfig[pluginName]

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

        if (!pluginData) {
          return <div key={pluginName}>Loading {pluginName} data...</div>
        }

        return <React.Fragment key={pluginName}>{plugin.renderer(specificConfigs, pluginData)}</React.Fragment>
      })
      .filter(Boolean)

    setPluginsComponents(newComponents)
  }, [pluginsConfig, pluginsData, pluginManager])

  return (
    <SvgContainer
      size={svgWidth}
      height={0}
      style={style}
      asDiv
      data-terminal-theme={terminalTheme}
      data-default-theme={defaultTheme}
    >
      {pluginsComponents}
    </SvgContainer>
  )
}

export default RenderActivePlugins
