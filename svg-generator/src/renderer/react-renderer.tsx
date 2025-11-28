/**
 * Renderizador React
 * 
 * Renderiza plugins ativos usando React e source-v2
 */

import React from 'react'
import { PluginManager } from '@weeb/weeb-plugins/plugins'
import type { SvgConfig } from '../types/index.js'
import { PluginError } from '../components/PluginError.js'

/**
 * Resultado da renderização de plugins
 */
export interface RenderPluginsResult {
  element: React.ReactElement
  pluginsData: Record<string, any>
  pluginsErrors: Record<string, Error>
}

/**
 * Renderiza plugins ativos
 * 
 * Usa PluginManager do source-v2 para buscar dados e renderizar plugins
 * 
 * @returns Elemento React e dados dos plugins para debug
 */
export async function renderPlugins(config: SvgConfig): Promise<RenderPluginsResult> {
  const pluginManager = PluginManager.getInstance()

  // Preparar configuração de plugins no formato esperado pelo PluginManager
  // Incluir style e size para os plugins usarem
  // Totalmente dinâmico - itera sobre todos os plugins disponíveis
  const pluginsConfig: Record<string, any> = {}
  
  for (const [pluginName, pluginConfig] of Object.entries(config.plugins)) {
    if (pluginConfig) {
      pluginsConfig[pluginName] = {
        style: config.style,
        size: config.size,
        hideTerminalEmojis: config.hideTerminalEmojis,
        ...pluginConfig,
        enabled: pluginConfig.enabled,
      }
    }
  }

  // Inicializar plugins ativos
  pluginManager.initializeActivePlugins(pluginsConfig)

  // Buscar dados de todos os plugins ativos
  // Passar essentialConfigs se disponíveis
  const essentialConfigs = config.essentialConfigs || {}
  
  // Buscar dados e capturar erros
  const pluginsData: Record<string, any> = {}
  const pluginsErrors: Record<string, Error> = {}
  
  const activePlugins = pluginManager.getActivePlugins()
  await Promise.all(
    activePlugins.map(async ([name, plugin]) => {
      const pluginConfig = pluginsConfig[name]
      if (pluginConfig && pluginConfig.enabled) {
        try {
          const essentialConfig = essentialConfigs[name]
          // Usar config.dev explicitamente (já vem normalizado do normalizeConfig)
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

  // Renderizar plugins respeitando a ordem especificada
  // Se não especificado, usar ordem dos plugins disponíveis
  const pluginsOrder = config.pluginsOrder || Object.keys(pluginsConfig)
  const activePluginsMap = new Map(pluginManager.getActivePlugins())
  const renderedPlugins: React.ReactElement[] = []

  // Renderizar na ordem especificada
  for (const pluginName of pluginsOrder) {
    const plugin = activePluginsMap.get(pluginName)
    const pluginConfig = pluginsConfig[pluginName]

    if (!plugin || !pluginConfig || !pluginConfig.enabled) {
      continue
    }

    // Se houver erro ao buscar dados, renderizar componente de erro
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
        renderedPlugins.push(
          <div key={pluginName}>
            {rendered}
          </div>
        )
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
    element: (
      <div>
        {renderedPlugins}
      </div>
    ),
    pluginsData,
    pluginsErrors,
  }
}

