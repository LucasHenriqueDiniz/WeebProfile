/**
 * React renderer
 *
 * Renders active plugins using React and svg-generator
 */

import React from "react"
import { PluginManager } from "@weeb/weeb-plugins/plugins"
import type { SvgConfig } from "../types/index.js"
import { PluginError } from "../components/PluginError.js"

/**
 * Plugin rendering result
 */
export interface RenderPluginsResult {
  element: React.ReactElement
  pluginsConfig: Record<string, any>
  pluginsData: Record<string, any>
  pluginsErrors: Record<string, Error>
}

/**
 * Renders active plugins
 *
 * Uses PluginManager from svg-generator to fetch data and render plugins
 *
 * @returns React element and plugin data for debug
 */
export async function renderPlugins(config: SvgConfig): Promise<RenderPluginsResult> {
  const pluginManager = PluginManager.getInstance()

  // Helper function to flatten sectionConfigs
  // Flattening sectionConfigs: sectionConfigs[sectionId][optionKey] -> optionKey (root level)
  // Ex: sectionConfigs.exercises.exercises_max -> exercises_max
  function flattenSectionConfigs(pluginConfig: any): any {
    if (!pluginConfig?.sectionConfigs) {
      return pluginConfig
    }

    const { sectionConfigs, fields, ...rest } = pluginConfig
    const flattened: any = { ...rest }

    // Flattening sectionConfigs: sectionConfigs[sectionId][optionKey] -> optionKey
    if (sectionConfigs && typeof sectionConfigs === "object") {
      Object.values(sectionConfigs).forEach((sectionConfig: any) => {
        if (sectionConfig && typeof sectionConfig === "object") {
          Object.assign(flattened, sectionConfig)
        }
      })
    }

    // Add fields also at root level
    if (fields && typeof fields === "object") {
      Object.assign(flattened, fields)
    }

    return flattened
  }

  // Prepare plugin configuration in format expected by PluginManager
  // Include style and size for plugins to use
  // Fully dynamic - iterates over all available plugins
  const pluginsConfig: Record<string, any> = {}

  for (const [pluginName, pluginConfig] of Object.entries(config.plugins)) {
    if (pluginConfig) {
      // CRITICAL: Flattening sectionConfigs before passing to plugins
      const flattenedConfig = flattenSectionConfigs(pluginConfig)
      pluginsConfig[pluginName] = {
        style: config.style,
        size: config.size,
        hideTerminalEmojis: config.hideTerminalEmojis,
        ...flattenedConfig,
        enabled: pluginConfig.enabled,
      }
    }
  }

  // Inicializar plugins ativos
  pluginManager.initializeActivePlugins(pluginsConfig)

  // Fetch data from all active plugins
  // Pass essentialConfigs if available
  const essentialConfigs = config.essentialConfigs || {}

  // Fetch data and capture errors
  const pluginsData: Record<string, any> = {}
  const pluginsErrors: Record<string, Error> = {}

  const activePlugins = pluginManager.getActivePlugins()
  await Promise.all(
    activePlugins.map(async ([name, plugin]) => {
      const pluginConfig = pluginsConfig[name]
      if (pluginConfig && pluginConfig.enabled) {
        try {
          // CRITICAL: essentialConfigs is normalized with lowercase (see essential-configs.ts)
          // But plugins expect camelCase (apiKey, steamId, etc)
          const pluginNameLower = name.toLowerCase()
          const essentialConfigLowercase = essentialConfigs[pluginNameLower]
          console.log(`🔍 [RENDER] Plugin ${name}: essentialConfig keys (lowercase):`, essentialConfigLowercase ? Object.keys(essentialConfigLowercase) : "none")
          
          // Normalize essentialConfig to camelCase (plugins expect camelCase)
          // Map known keys: apikey -> apiKey, steamid -> steamId, username -> username, pat -> pat
          const essentialConfig: any = {}
          if (essentialConfigLowercase) {
            Object.entries(essentialConfigLowercase).forEach(([key, value]) => {
              // Map known keys to camelCase
              const keyMap: Record<string, string> = {
                'apikey': 'apiKey',
                'steamid': 'steamId',
                'username': 'username',
                'pat': 'pat',
              }
              const camelKey = keyMap[key.toLowerCase()] || key
              essentialConfig[camelKey] = value
            })
          }
          
          // CRITICAL: Some plugins (ex: LastFM) may have username in plugin_config (reusable)
          // but they also need it in essentialConfig. If not in essentialConfig, get from pluginConfig
          if (name.toLowerCase() === 'lastfm' && !essentialConfig.username && pluginConfig.username) {
            essentialConfig.username = pluginConfig.username
            console.log(`🔍 [RENDER] Plugin ${name}: username from pluginConfig:`, pluginConfig.username)
          }
          
          console.log(`🔍 [RENDER] Plugin ${name}: essentialConfig keys (camelCase):`, essentialConfig ? Object.keys(essentialConfig) : "none")
          
          // Use config.dev explicitly (already normalized from normalizeConfig)
          const useDev = config.dev === true
          const data = await plugin.fetchData(pluginConfig, useDev, essentialConfig)
          pluginsData[name] = data
        } catch (error) {
          console.error(`Error fetching data for plugin ${name}:`, error)
          pluginsErrors[name] = error instanceof Error ? error : new Error(String(error))
        }
      }
    })
  )

  // Render plugins respecting specified order
  // If not specified, use order of available plugins
  const pluginsOrder = config.pluginsOrder || Object.keys(pluginsConfig)
  const activePluginsMap = new Map(pluginManager.getActivePlugins())
  const renderedPlugins: React.ReactElement[] = []

  // Render in specified order
  for (const pluginName of pluginsOrder) {
    const plugin = activePluginsMap.get(pluginName)
    const pluginConfig = pluginsConfig[pluginName]

    if (!plugin || !pluginConfig || !pluginConfig.enabled) {
      continue
    }

    // If there was an error fetching data, render error component
    if (pluginsErrors[pluginName]) {
      renderedPlugins.push(
        <PluginError
          key={`${pluginName}-error`}
          pluginName={pluginName}
          error={pluginsErrors[pluginName]}
          style={config.style}
          size={config.size}
        />
      )
      continue
    }

    const pluginData = pluginsData[pluginName]
    if (!pluginData) {
      // Se não há dados e não há erro, pular (pode estar carregando)
      continue
    }

    try {
      const rendered = plugin.render(pluginConfig, pluginData)
      // Ensure rendered is a valid React element
      if (React.isValidElement(rendered)) {
        renderedPlugins.push(<div key={pluginName}>{rendered}</div>)
      } else {
        console.error(`Plugin ${pluginName} returned invalid React element:`, rendered)
        renderedPlugins.push(
          <PluginError
            key={`${pluginName}-invalid-element`}
            pluginName={pluginName}
            error={new Error(`Plugin returned invalid React element`)}
            style={config.style}
            size={config.size}
          />
        )
      }
    } catch (error) {
      console.error(`Error rendering plugin ${pluginName}:`, error)
      // Renderizar erro visual ao invés de apenas logar
      renderedPlugins.push(
        <PluginError
          key={`${pluginName}-render-error`}
          pluginName={pluginName}
          error={error instanceof Error ? error : new Error(String(error))}
          style={config.style}
          size={config.size}
        />
      )
    }
  }

  // Return array wrapped in a div to ensure proper rendering
  // renderToString can handle arrays, but wrapping in a container is safer
  return {
    element: <div>{renderedPlugins}</div>,
    pluginsConfig,
    pluginsData,
    pluginsErrors,
  }
}
