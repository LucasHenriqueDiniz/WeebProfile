"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"
import { Wizard } from "@/components/wizard/Wizard"
import { useWizardStore } from "@/stores/wizard-store"
import { useSvgStore } from "@/stores/svg-store"
import { useWizardBootstrapStore } from "@/stores/wizard-bootstrap-store"
import type { Svg } from "@/lib/db/schema"
import { ApiException } from "@/lib/api"
import LoadingScreen from "@/components/loading/LoadingScreen"
import { getTerminalConfigs } from "@/lib/config/svg-config-helpers"

export default function EditSvgPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { getSvg, getSvgSync } = useSvgStore()
  const { pluginConfigs, bootstrap } = useWizardBootstrapStore()
  const svgId = params.id as string
  
  // Tentar pegar do cache imediatamente
  const cachedSvg = getSvgSync(svgId)
  const [loading, setLoading] = useState(!cachedSvg)
  const [hasLoaded, setHasLoaded] = useState(false)
  const { reset, setBasicInfo, setPluginConfig, setStyle, setSize, setTheme, setHideTerminalEmojis, setHideTerminalHeader, setHideTerminalCommand, setCustomCss, reorderPlugins } = useWizardStore()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    // Bootstrap plugin configs if not already loaded
    if (user && !pluginConfigs || Object.keys(pluginConfigs).length === 0) {
      bootstrap()
    }

    // Só carregar uma vez
    if (user && svgId && !hasLoaded) {
      // Small delay to ensure wizard store reset has completed
      setTimeout(() => {
        loadSvg()
      }, 100)
    } else if (cachedSvg && !hasLoaded) {
      // Se tem cache, carregar dados imediatamente (with small delay for reset)
      setTimeout(() => {
        loadSvgData(cachedSvg)
        setHasLoaded(true)
        setLoading(false)
      }, 100)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, svgId])

  const loadSvg = async () => {
    // Verificar cache novamente (pode ter mudado)
    let svg: Svg | null = getSvgSync(svgId)
    
    try {
      // Se não tem cache, buscar
      if (!svg) {
        setLoading(true)
        svg = await getSvg(svgId)
      } else {
        // Se tem cache, fazer refresh em background (sem mostrar loading)
        getSvg(svgId).then((updatedSvg) => {
          if (updatedSvg) {
            // Recarregar dados se o SVG foi atualizado
            loadSvgData(updatedSvg)
          }
        }).catch(() => {
          // Ignorar erros no background refresh
        })
      }

      if (!svg) {
        throw new Error("SVG not found")
      }

      // Carregar dados do SVG no wizard store
      loadSvgData(svg)
      setHasLoaded(true)
    } catch (error) {
      console.error("Error loading SVG:", error)
      const errorMessage =
        error instanceof ApiException
          ? error.data.message || error.data.error || error.message
          : "Erro ao carregar imagem"
      alert(errorMessage)
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  const loadSvgData = (svg: Svg) => {
    // Carregar dados no wizard store
    setBasicInfo(svg.name, svg.id, false) // Usar ID como slug temporário
    setStyle(svg.style as "default" | "terminal")
    setSize(svg.size as "half" | "full")
    setTheme(svg.theme || "default")
    
    // Read terminal configs from pluginsConfig
    const terminalConfigs = getTerminalConfigs(svg.pluginsConfig as Record<string, any>)
    setHideTerminalEmojis(terminalConfigs.hideTerminalEmojis)
    setHideTerminalHeader(terminalConfigs.hideTerminalHeader)
    setHideTerminalCommand(terminalConfigs.hideTerminalCommand)
    
    setCustomCss(svg.customCss || "")

    // Carregar plugins config
    // New format: { "github": { enabled: true, sections: [...] }, ... }
    // Username comes from plugin_config (loaded separately via bootstrap store)
    if (svg.pluginsConfig && typeof svg.pluginsConfig === "object") {
      const pluginsConfig = svg.pluginsConfig as Record<string, any>
      
      // Get plugin configs from bootstrap store (reusable: username, etc.)
      const { pluginConfigs: userPluginConfigs } = useWizardBootstrapStore.getState()
      
      // Process plugins in new format (no PLUGIN_ prefix)
      Object.keys(pluginsConfig).forEach((pluginName) => {
        const pluginConfig = pluginsConfig[pluginName]
        if (pluginConfig && typeof pluginConfig === "object") {
          // Merge user config (username) with SVG config (enabled, sections)
          const userConfig = userPluginConfigs[pluginName] || {}
          
          setPluginConfig(pluginName, {
            enabled: pluginConfig.enabled === true,
            sections: Array.isArray(pluginConfig.sections) ? pluginConfig.sections : [],
            sectionConfigs: pluginConfig.sectionConfigs || {},
            // Apply username from plugin_config (reusable)
            ...(userConfig.username ? { username: userConfig.username } : {}),
          })
        }
      })

      // Carregar ordem dos plugins
      if (svg.pluginsOrder) {
        reorderPlugins(svg.pluginsOrder.split(","))
      }
    }
  }

  // Só mostrar loading se não tiver dados e estiver carregando
  if (authLoading || (loading && !cachedSvg)) {
    return <LoadingScreen />
  }

  if (!user) {
    return null
  }

  return <Wizard isEditMode={true} editSvgId={params.id as string} />
}
