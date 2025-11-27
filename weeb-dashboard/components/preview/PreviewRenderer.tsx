"use client"

import React, { useMemo, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useMockPluginData } from "@/hooks/useMockPluginData"
import { PreviewSvgContainer } from "./PreviewSvgContainer"
import { getActivePlugins } from "@/lib/plugins-registry"

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
}: PreviewRendererProps) {
  const { data, loading } = useMockPluginData({ plugins })

  // Calcular largura baseada no size (430px para half, 800px para full - tamanhos do hero)
  const width = size === "half" ? 415 : 830
  
  // Estado para armazenar plugins carregados
  const [activePluginsMap, setActivePluginsMap] = useState<Map<string, any>>(new Map())

  // Carregar plugins ativos
  useEffect(() => {
    async function loadPlugins() {
      // Preparar configuração de plugins
      const pluginsConfig: Record<string, any> = {}
      for (const [pluginName, pluginConfig] of Object.entries(plugins)) {
        if (pluginConfig?.enabled) {
          pluginsConfig[pluginName] = {
            style,
            size,
            theme,
            hideTerminalEmojis,
            ...pluginConfig,
            enabled: pluginConfig.enabled,
          }
        }
      }

      // Obter plugins ativos
      const activePlugins = await getActivePlugins(pluginsConfig)
      const map = new Map(activePlugins)
      setActivePluginsMap(map)
    }

    loadPlugins()
  }, [plugins, style, size, theme, hideTerminalEmojis])

  // Renderizar plugins dinamicamente
  const renderedPlugins = useMemo(() => {
    // Preparar configuração de plugins
    const pluginsConfig: Record<string, any> = {}
    for (const [pluginName, pluginConfig] of Object.entries(plugins)) {
      if (pluginConfig?.enabled) {
        pluginsConfig[pluginName] = {
          style,
          size,
          theme,
          hideTerminalEmojis,
          ...pluginConfig,
          enabled: pluginConfig.enabled,
        }
      }
    }

    // Renderizar plugins na ordem especificada
    const components: React.ReactElement[] = []

    for (const pluginName of pluginsOrder) {
      const plugin = activePluginsMap.get(pluginName)
      const pluginConfig = pluginsConfig[pluginName]
      const pluginData = (data as Record<string, any>)[pluginName]

      if (!plugin || !pluginConfig || !pluginConfig.enabled || !pluginData) {
        continue
      }

      try {
        const rendered = (plugin as any).render(pluginConfig, pluginData)
        const index = components.length
        components.push(
          <React.Fragment key={pluginName}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {rendered}
            </motion.div>
          </React.Fragment>
        )
      } catch (error) {
        console.error(`Error rendering plugin ${pluginName}:`, error)
      }
    }

    return components
  }, [
    plugins,
    pluginsOrder,
    data,
    style,
    size,
    theme,
    hideTerminalEmojis,
    activePluginsMap,
  ])

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ width: `${width}px`, minHeight: "200px" }}>
        <div className="text-sm text-muted-foreground">Carregando preview...</div>
      </div>
    )
  }

  if (renderedPlugins.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: `${width}px`, minHeight: "200px" }}>
        <div className="text-sm text-muted-foreground">Nenhum plugin habilitado</div>
      </div>
    )
  }

  // Calcular altura estimada (pode ser melhorado depois)
  const estimatedHeight = Math.max(400, renderedPlugins.length * 200)

  return (
    <div className="w-full" style={{ width: `${width}px` }}>
      <PreviewSvgContainer
        width={width}
        height={estimatedHeight}
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

