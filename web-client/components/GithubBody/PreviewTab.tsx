"use client"
import { useEffect, useState } from "react"
import { PluginManager } from "source/plugins/@utils/PluginManager"
import RenderActivePlugins from "web-client/app/RenderActivePlugins"
import useStore from "web-client/app/store"
import NoPluginsSelected from "./NoPluginsSelected"

const PreviewTab = () => {
  const [activePlugins, setActivePlugins] = useState(PluginManager.getInstance().getActivePlugins())
  const { pluginsConfig, initializeStore } = useStore()

  useEffect(() => {
    initializeStore()
    setActivePlugins(PluginManager.getInstance().getActivePlugins())
  }, [initializeStore])

  useEffect(() => {
    setActivePlugins(PluginManager.getInstance().getActivePlugins())
  }, [pluginsConfig])

  return <>{activePlugins.length === 0 ? <NoPluginsSelected /> : <RenderActivePlugins />}</>
}

export default PreviewTab
