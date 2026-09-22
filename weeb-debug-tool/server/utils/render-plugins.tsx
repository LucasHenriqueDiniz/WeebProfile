/**
 * Render Plugins using direct imports from weeb-plugins/src
 *
 * This imports plugins directly from the source, enabling hot reload via nodemon.
 */

import React from "react"
import { renderToString } from "react-dom/server"
import { PluginManager } from "../../../weeb-plugins/src/plugins/manager"
import type { Plugin } from "../../../weeb-plugins/src/plugins/shared/types/plugin"

// Initialize PluginManager to register all plugins
const pluginManager = PluginManager.getInstance()

/**
 * Render a plugin to HTML string
 */
export async function renderPluginToHtml(
  pluginName: string,
  config: any,
  dev = true
): Promise<{ html: string; data: any }> {
  const plugin = pluginManager.get(pluginName) as Plugin | undefined

  if (!plugin) {
    throw new Error(`Plugin not found: ${pluginName}`)
  }

  const data = await plugin.fetchData(config, dev, undefined)

  const element = plugin.render(config, data)
  if (!React.isValidElement(element)) {
    throw new Error(`Plugin ${pluginName} returned invalid React element`)
  }

  const html = renderToString(element)

  return { html, data }
}

/**
 * Render plugins using direct imports (for compatibility with existing code)
 */
export async function renderPlugins(config: {
  plugins: Record<string, any>
  style?: string
  theme?: string
  size?: "half" | "full"
  hideTerminalEmojis?: boolean
  dev?: boolean
}): Promise<{
  element: React.ReactElement
  pluginsData: Record<string, any>
  pluginsErrors: Record<string, Error>
}> {
  const pluginName = Object.keys(config.plugins)[0]
  if (!pluginName) {
    throw new Error("No plugin specified in config")
  }

  const plugin = pluginManager.get(pluginName) as Plugin | undefined

  if (!plugin) {
    throw new Error(`Plugin not found: ${pluginName}`)
  }

  // Prepare plugin config
  const pluginConfig = {
    size: config.size || "half",
    hideTerminalEmojis: config.hideTerminalEmojis || false,
    ...config.plugins[pluginName],
    enabled: true,
    // Adicionar style e theme globalmente para o plugin
    style: config.style || "default",
    theme: config.theme || "default",
  }

  // Fetch data
  const useDev = config.dev === true

  let pluginData: any
  let pluginError: Error | null = null

  try {
    pluginData = await plugin.fetchData(pluginConfig, useDev, undefined)
  } catch (error) {
    pluginError = error instanceof Error ? error : new Error(String(error))
    console.error(`Error fetching data for plugin ${pluginName}:`, pluginError)
  }

  // Render plugin
  let rendered: React.ReactElement

  if (pluginError) {
    const { PluginError } = await import("../../../svg-generator/src/components/PluginError.js")
    rendered = (
      <PluginError
        pluginName={pluginName}
        error={pluginError}
        style={config.style || "default"}
        size={config.size || "half"}
      />
    )
  } else {
    try {
      const pluginResult = plugin.render(pluginConfig, pluginData)
      if (!React.isValidElement(pluginResult)) {
        throw new Error(`Plugin returned invalid React element`)
      }
      rendered = pluginResult
    } catch (error) {
      const { PluginError } = await import("../../../svg-generator/src/components/PluginError.js")
      rendered = (
        <PluginError
          pluginName={pluginName}
          error={error instanceof Error ? error : new Error(String(error))}
          style={config.style || "default"}
          size={config.size || "half"}
        />
      )
    }
  }

  return {
    element: <div>{rendered}</div>,
    pluginsData: pluginData ? { [pluginName]: pluginData } : {},
    pluginsErrors: pluginError ? { [pluginName]: pluginError } : {},
  }
}
