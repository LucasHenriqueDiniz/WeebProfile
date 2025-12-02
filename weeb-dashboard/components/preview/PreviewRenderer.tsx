"use client"

import React, { useMemo, useState, useEffect, useCallback } from "react"
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
  if (sectionConfigs && typeof sectionConfigs === 'object') {
    Object.values(sectionConfigs).forEach((sectionConfig: any) => {
      if (sectionConfig && typeof sectionConfig === 'object') {
        Object.assign(flattened, sectionConfig)
      }
    })
  }

  // Adicionar fields também no nível raiz
  if (fields && typeof fields === 'object') {
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
}: PreviewRendererProps) {
  const { data, loading } = useMockPluginData({ plugins })

  // Calcular largura baseada no size (430px para half, 800px para full - tamanhos do hero)
  const width = size === "half" ? 415 : 830
  
  // Estado para armazenar plugins carregados
  const [activePluginsMap, setActivePluginsMap] = useState<Map<string, any>>(new Map())

  // Memoizar preparação de configs de plugins
  const preparedPluginsConfig = useMemo(() => {
    const configs: Record<string, any> = {}
    for (const [pluginName, pluginConfig] of Object.entries(plugins)) {
      if (pluginConfig?.enabled) {
        // Achatamento de sectionConfigs para o formato esperado pelos plugins
        const flattenedConfig = flattenSectionConfigs(pluginConfig)
        configs[pluginName] = {
          style,
          size,
          theme,
          hideTerminalEmojis,
          ...flattenedConfig,
          enabled: pluginConfig.enabled,
        }
      }
    }
    return configs
  }, [plugins, style, size, theme, hideTerminalEmojis])

  // Carregar plugins ativos
  useEffect(() => {
    async function loadPlugins() {
      // Obter plugins ativos
      const activePlugins = await getActivePlugins(preparedPluginsConfig)
      const map = new Map(activePlugins)
      setActivePluginsMap(map)
    }

    loadPlugins()
  }, [preparedPluginsConfig])

  // Renderizar plugins dinamicamente
  const renderedPlugins = useMemo(() => {
    // Renderizar plugins na ordem especificada
    const components: React.ReactElement[] = []

    for (const pluginName of pluginsOrder) {
      const plugin = activePluginsMap.get(pluginName)
      const pluginConfig = preparedPluginsConfig[pluginName]
      const pluginData = (data as Record<string, any>)[pluginName]

      if (!plugin || !pluginConfig || !pluginConfig.enabled || !pluginData) {
        continue
      }

      try {
        const rendered = (plugin as any).render(pluginConfig, pluginData)
        // Usar key única baseada em pluginName + índice estável
        const stableKey = `${pluginName}-${components.length}`
        components.push(
          <React.Fragment key={stableKey}>
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
          </React.Fragment>
        )
      } catch (error) {
        console.error(`Error rendering plugin ${pluginName}:`, error)
      }
    }

    return components
  }, [pluginsOrder, data, activePluginsMap, preparedPluginsConfig])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3" style={{ width: `${width}px`, minHeight: "200px" }}>
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <div className="text-sm text-muted-foreground">Carregando preview...</div>
      </div>
    )
  }

  if (renderedPlugins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2" style={{ width: `${width}px`, minHeight: "200px" }}>
        <div className="text-sm font-medium text-muted-foreground">Nenhum plugin habilitado</div>
        <div className="text-xs text-muted-foreground/70">Habilite pelo menos um plugin para ver o preview</div>
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

