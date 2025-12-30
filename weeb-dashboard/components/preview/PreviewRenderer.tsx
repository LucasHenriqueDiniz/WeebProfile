"use client"

import { useMockPluginData } from "@/hooks/useMockPluginData"
import { PluginManager } from "@weeb/weeb-plugins/plugins/manager"
import { motion } from "framer-motion"
import React, { useEffect, useMemo, useState } from "react"
import { PreviewSvgContainer } from "./PreviewSvgContainer"
import { PluginErrorBoundary } from "./PluginErrorBoundary"

interface PluginConfig {
  enabled: boolean
  sections: string[]
  username?: string
  [key: string]: any
}

interface PreviewRendererProps {
  plugins: Record<string, PluginConfig | undefined> // Totalmente dinâmico
  pluginsOrder: string[]
  style: "default" | "terminal"
  size: "half" | "full"
  theme?: string
  hideTerminalEmojis?: boolean
  hideTerminalHeader?: boolean
  customCss?: string
  customThemeColors?: Record<string, string>
  width?: number // Largura fixa opcional (sobrescreve size)
  height?: number // Altura fixa opcional
}

/**
 * Achatamento de sectionConfigs para o formato esperado pelos plugins
 * Transforma sectionConfigs[sectionId][optionKey] em optionKey no nível raiz
 */
function flattenSectionConfigs(pluginConfig: any): any {
  if (!pluginConfig?.sectionConfigs) {
    return pluginConfig
  }

  const { sectionConfigs, fields, ...rest } = pluginConfig
  const flattened: any = { ...rest }

  // Achatamento de sectionConfigs: sectionConfigs[sectionId][optionKey] -> optionKey
  if (sectionConfigs && typeof sectionConfigs === "object") {
    Object.values(sectionConfigs).forEach((sectionConfig: any) => {
      if (sectionConfig && typeof sectionConfig === "object") {
        Object.assign(flattened, sectionConfig)
      }
    })
  }

  // Adicionar fields também no nível raiz
  if (fields && typeof fields === "object") {
    Object.assign(flattened, fields)
  }

  return flattened
}

/**
 * Componente que renderiza plugins usando componentes React locais
 */
export function PreviewRenderer({
  plugins,
  pluginsOrder,
  style,
  size,
  theme,
  hideTerminalEmojis,
  hideTerminalHeader,
  customCss,
  customThemeColors,
  width: propWidth,
  height: propHeight,
}: PreviewRendererProps) {
  const { data, loading } = useMockPluginData({ plugins })

  // Calcular largura: usar propWidth se fornecido, senão baseado no size
  const width = propWidth ?? (size === "half" ? 415 : 830)

  // Estado para armazenar plugins carregados
  const [activePluginsMap, setActivePluginsMap] = useState<Map<string, any>>(new Map())

  // Memoizar preparação de configs de plugins
  const preparedPluginsConfig = useMemo(() => {
    const configs: Record<string, any> = {}
    // Preparar configs para TODOS os plugins habilitados, não apenas os que estão em pluginsOrder
    for (const [pluginName, pluginConfig] of Object.entries(plugins)) {
      if (pluginConfig?.enabled && pluginConfig.sections && pluginConfig.sections.length > 0) {
        // Achatamento de sectionConfigs para o formato esperado pelos plugins
        const flattenedConfig = flattenSectionConfigs(pluginConfig)
        configs[pluginName] = {
          style,
          size,
          theme,
          hideTerminalEmojis,
          ...flattenedConfig,
          enabled: pluginConfig.enabled,
          sections: pluginConfig.sections,
        }
      }
    }
    
    return configs
  }, [plugins, style, size, theme, hideTerminalEmojis])

  // Carregar plugins ativos
  useEffect(() => {
    async function loadPlugins() {
      const manager = PluginManager.getInstance()
      // Filtrar plugins habilitados com seções
      const activePluginNames = Object.keys(preparedPluginsConfig).filter(
        name => preparedPluginsConfig[name]?.enabled && preparedPluginsConfig[name]?.sections?.length > 0
      )

      const map = new Map()
      for (const name of activePluginNames) {
        try {
          const plugin = manager.get(name)
          if (plugin) {
            map.set(name, plugin)
          }
        } catch (error) {
          console.error(`Failed to load plugin ${name}:`, error)
        }
      }
      setActivePluginsMap(map)
    }

    loadPlugins()
  }, [preparedPluginsConfig])

  // Renderizar plugins dinamicamente
  const renderedPlugins = useMemo(() => {
    // Pegar TODOS os plugins habilitados (não apenas os que estão em pluginsOrder)
    const allEnabledPlugins = Object.keys(preparedPluginsConfig).filter(
      name => preparedPluginsConfig[name]?.enabled && preparedPluginsConfig[name]?.sections?.length > 0
    )
    
    // Ordenar: plugins que estão em pluginsOrder primeiro (mantendo a ordem deles),
    // depois os outros em ordem alfabética
    const orderedPlugins = [
      ...pluginsOrder.filter(name => allEnabledPlugins.includes(name)),
      ...allEnabledPlugins.filter(name => !pluginsOrder.includes(name)).sort()
    ]
    
    const components: React.ReactElement[] = []

    for (const pluginName of orderedPlugins) {
      const plugin = activePluginsMap.get(pluginName)
      const pluginConfig = preparedPluginsConfig[pluginName]
      const pluginData = (data as Record<string, any>)[pluginName]

      if (!plugin || !pluginConfig || !pluginConfig.enabled || !pluginData) {
        continue
      }

      try {
        const rendered = (plugin as any).render(pluginConfig, pluginData)
        
        // Sempre adicionar ao array - deixar o React decidir se é vazio
        // Componentes que retornam <></> ainda são válidos
        if (rendered === null || rendered === undefined) {
          continue
        }
        
        // Usar key única baseada em pluginName + índice estável
        const stableKey = `${pluginName}-${components.length}`
        components.push(
          <PluginErrorBoundary key={stableKey} pluginName={pluginName}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: components.length * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {rendered}
            </motion.div>
          </PluginErrorBoundary>
        )
      } catch (error) {
        console.error(`Error rendering plugin ${pluginName}:`, error)
      }
    }

    return components
  }, [pluginsOrder, data, activePluginsMap, preparedPluginsConfig])

  if (loading) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3"
        style={{ width: `${width}px`, minHeight: "200px" }}
      >
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <div className="text-sm text-muted-foreground">Carregando preview...</div>
      </div>
    )
  }

  if (renderedPlugins.length === 0 && !loading) {
    // Se não está carregando e não renderizou nada, pode ser que:
    // 1. Plugins não têm dados mock carregados
    // 2. Plugins não foram encontrados
    // 3. Plugins não têm seções ativas
    const enabledCount = Object.values(plugins).filter(p => p?.enabled).length
    const withSections = Object.values(plugins).filter(p => p?.enabled && p.sections?.length > 0).length
    
    return (
      <div
        className="flex flex-col items-center justify-center gap-2 p-4"
        style={{ width: `${width}px`, minHeight: "200px" }}
      >
        <div className="text-sm font-medium text-muted-foreground">Nenhum plugin renderizado</div>
        <div className="text-xs text-muted-foreground/70 text-center">
          Debug: {enabledCount} plugins habilitados, {withSections} com seções
          <br />
          Verifique o console para mais detalhes
        </div>
      </div>
    )
  }

  // Calcular altura: usar propHeight se fornecido, senão estimar
  const height = propHeight ?? Math.max(400, renderedPlugins.length * 200)

  return (
    <div className="w-full" style={{ width: `${width}px` }}>
      <PreviewSvgContainer
        width={width}
        height={height}
        size={size}
        style={style}
        theme={theme}
        hideTerminalEmojis={hideTerminalEmojis}
        hideTerminalHeader={hideTerminalHeader}
        customCss={customCss}
        customThemeColors={customThemeColors}
        plugins={plugins}
      >
        {renderedPlugins}
      </PreviewSvgContainer>
    </div>
  )
}
