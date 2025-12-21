"use client"

import { useState, useEffect, useMemo } from "react"
import { getPlugin } from "@/lib/plugins-registry"

interface PluginConfig {
  enabled: boolean
  sections: string[]
  username?: string
  [key: string]: any
}

interface UseMockPluginDataProps {
  plugins: Record<string, PluginConfig | undefined>
}

interface MockPluginData {
  [pluginName: string]: any
}

/**
 * Hook para buscar dados mockados dos plugins
 * Cacheia dados para evitar múltiplas chamadas
 * 
 * Usa os plugins diretamente com fetchData(..., dev=true) para obter dados mock
 * Funciona dinamicamente com qualquer plugin
 */
export function useMockPluginData({ plugins }: UseMockPluginDataProps): {
  data: MockPluginData
  loading: boolean
} {
  const [data, setData] = useState<MockPluginData>({})
  const [loading, setLoading] = useState(true)

  // Criar chave única baseada nas configurações dos plugins habilitados
  const pluginsKey = useMemo(
    () => {
      const enabledPlugins: Record<string, any> = {}
      for (const [pluginName, pluginConfig] of Object.entries(plugins)) {
        if (pluginConfig?.enabled) {
          enabledPlugins[pluginName] = pluginConfig
        }
      }
      return JSON.stringify(enabledPlugins)
    },
    [plugins]
  )

  useEffect(() => {
    setLoading(true)
    const loadPromises: Promise<void>[] = []

    // Carregar dados mockados para todos os plugins habilitados (dinâmico)
    for (const [pluginName, pluginConfig] of Object.entries(plugins)) {
      if (pluginConfig?.enabled) {
        loadPromises.push(
          getPlugin(pluginName)
            .then((plugin) => {
              if (!plugin) {
                console.warn(`Plugin "${pluginName}" not found`)
                return
              }
              return plugin.fetchData(pluginConfig as any, true) // dev=true para dados mock
            })
            .then((pluginData) => {
              if (pluginData) {
                setData((prev) => ({ ...prev, [pluginName]: pluginData }))
                console.log(`[useMockPluginData] ✅ Loaded mock data for ${pluginName}`, Object.keys(pluginData))
              } else {
                console.warn(`[useMockPluginData] ⚠️ No data returned for ${pluginName}`)
              }
            })
            .catch((error) => {
              console.error(`[useMockPluginData] ❌ Error loading ${pluginName} mock data:`, error)
              // Adicionar ao data mesmo em erro para debug
              setData((prev) => ({ ...prev, [pluginName]: { _error: String(error) } }))
            })
        )
      }
    }

    // Aguardar todos os dados carregarem
    Promise.all(loadPromises).finally(() => {
      setLoading(false)
    })
  }, [pluginsKey])

  return { data, loading }
}

