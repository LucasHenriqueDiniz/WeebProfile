/**
 * React renderer
 *
 * Renders active plugins using React and svg-generator
 */

import React from "react"
import { renderToString } from "react-dom/server"
import { log } from "../utils/log.js"
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
        // Permite que calculateHeight() saiba se o header global do terminal (32px)
        // está visível - sem isso a altura do estilo terminal fica superestimada.
        hideTerminalHeader: config.hideTerminalHeader,
        ...flattenedConfig,
        enabled: pluginConfig.enabled,
      }
    }
  }

  // Local to this request. The manager is shared by every request on the isolate, so
  // nothing about this request may live on it (see enabledPlugins in weeb-plugins).
  const activePlugins = pluginManager.enabledPlugins(pluginsConfig)

  // Fetch data from all active plugins
  // Pass essentialConfigs if available
  const essentialConfigs = config.essentialConfigs || {}

  // Fetch data and capture errors
  const pluginsData: Record<string, any> = {}
  const pluginsErrors: Record<string, Error> = {}

  await Promise.all(
    activePlugins.map(async ([name, plugin]) => {
      const pluginConfig = pluginsConfig[name]
      if (pluginConfig && pluginConfig.enabled) {
        try {
          // CRITICAL: essentialConfigs is normalized with lowercase (see essential-configs.ts)
          // But plugins expect camelCase (apiKey, steamId, etc)
          const pluginNameLower = name.toLowerCase()
          const essentialConfigLowercase = essentialConfigs[pluginNameLower]
          log.debug("render_essential_config_lowercase", {
            plugin: name,
            keys: essentialConfigLowercase ? Object.keys(essentialConfigLowercase) : [],
          })

          // Normalize essentialConfig to camelCase (plugins expect camelCase)
          // Map known keys: apikey -> apiKey, steamid -> steamId, username -> username, pat -> pat
          const essentialConfig: any = {}
          if (essentialConfigLowercase) {
            Object.entries(essentialConfigLowercase).forEach(([key, value]) => {
              // Map known keys to camelCase
              const keyMap: Record<string, string> = {
                apikey: "apiKey",
                steamid: "steamId",
                username: "username",
                pat: "pat",
              }
              const camelKey = keyMap[key.toLowerCase()] || key
              essentialConfig[camelKey] = value
            })
          }

          // CRITICAL: Some plugins (ex: LastFM) may have username in plugin_config (reusable)
          // but they also need it in essentialConfig. If not in essentialConfig, get from pluginConfig
          if (name.toLowerCase() === "lastfm" && !essentialConfig.username && pluginConfig.username) {
            essentialConfig.username = pluginConfig.username
            log.debug("render_username_present", { plugin: name, present: Boolean(pluginConfig.username) })
          }

          log.debug("render_essential_config_camel", {
            plugin: name,
            keys: essentialConfig ? Object.keys(essentialConfig) : [],
          })

          // Use config.dev explicitly (already normalized from normalizeConfig)
          const useDev = config.dev === true
          const data = await plugin.fetchData(pluginConfig, useDev, essentialConfig)
          // Some plugins (AniList, Dev.to) report a failure as data -- `_error`, for a
          // missing user, a rate limit, a timeout. They used to draw their own error box
          // from it, which reached here as a success: hasErrors stayed false and the
          // dashboard published the error box over the user's last good card. This is
          // now the only place `_error` turns into an error box.
          const reported = (data as { _error?: unknown } | null | undefined)?._error
          if (typeof reported === "string" && reported) throw new Error(reported)
          pluginsData[name] = data
        } catch (error) {
          log.error("plugin.fetch_failed", {
            plugin: name,
            reason: error instanceof Error ? error.message : String(error),
          })
          pluginsErrors[name] = error instanceof Error ? error : new Error(String(error))
        }
      }
    })
  )

  // Render plugins respecting specified order
  // If not specified (or empty — `[] || x` is always `[]` since [] is truthy), use order of available plugins
  const pluginsOrder =
    config.pluginsOrder && config.pluginsOrder.length > 0 ? config.pluginsOrder : Object.keys(pluginsConfig)
  const activePluginsMap = new Map(activePlugins)
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
      if (!React.isValidElement(rendered)) {
        throw new Error("Plugin returned invalid React element")
      }
      // plugin.render() only builds the element: the components run when it is turned
      // into markup. That used to happen once, for the whole card, outside this try, so
      // one component's exception (a revoked GitHub PAT leaves `user` undefined and
      // Profile reads `user.createdAt`) failed every plugin with a 500. Rendering each
      // plugin on its own keeps the failure to its section.
      //
      // Each call is its own React root, so useId() would number from scratch in every
      // plugin and two plugins could emit the same gradient id into one SVG. The prefix
      // keeps them apart.
      const html = renderToString(rendered, { identifierPrefix: `${pluginName}-` })
      renderedPlugins.push(<div key={pluginName} dangerouslySetInnerHTML={{ __html: html }} />)
    } catch (thrown) {
      const error = thrown instanceof Error ? thrown : new Error(String(thrown))
      log.error("plugin.render_failed", { plugin: pluginName, reason: error.message })
      // Counted like a failed fetch. hasErrors is what tells the dashboard not to
      // publish this card over the last good one, and with the data gone the height
      // skips the section instead of calling calculateHeight on the data that just broke.
      pluginsErrors[pluginName] = error
      delete pluginsData[pluginName]
      renderedPlugins.push(
        <PluginError
          key={`${pluginName}-render-error`}
          pluginName={pluginName}
          error={error}
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
