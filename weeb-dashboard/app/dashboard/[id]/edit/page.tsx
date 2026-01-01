"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"
import { Wizard } from "@/components/wizard/Wizard"
import { useWizardStore } from "@/stores/wizard-store"
import { useSvgStore } from "@/stores/svg-store"
import type { Svg } from "@/lib/db/schema"
import { ApiException } from "@/lib/api"
import LoadingScreen from "@/components/loading/LoadingScreen"
import { getTerminalConfigs } from "@/lib/config/svg-config-helpers"

export default function EditSvgPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { getSvg, getSvgSync } = useSvgStore()
  const svgId = params.id as string

  // Tentar pegar do cache imediatamente
  const cachedSvg = getSvgSync(svgId)
  const [loading, setLoading] = useState(!cachedSvg)
  const [hasLoaded, setHasLoaded] = useState(false)
  const hasResetRef = useRef(false)
  const { reset, resetForEdit, setBasicInfo, setPluginConfig, setStyle, setSize, setTheme, setHideTerminalEmojis, setHideTerminalHeader, setHideTerminalCommand, setCustomCss, reorderPlugins, plugins, pluginsOrder } = useWizardStore()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    // Só carregar uma vez
    if (user && svgId && !hasLoaded) {
      // Reset store first, then load data
      if (!hasResetRef.current) {
        resetForEdit()
        hasResetRef.current = true
      }

      // Small delay to ensure reset has completed
      setTimeout(() => {
        loadSvg()
      }, 50)
    } else if (cachedSvg && !hasLoaded) {
      // Se tem cache, reset first then load data
      if (!hasResetRef.current) {
        console.log("🔄 EDIT PAGE: Calling resetForEdit() for cached SVG")
        resetForEdit()
        console.log("🔄 EDIT PAGE: resetForEdit() completed for cached SVG")
        hasResetRef.current = true
      }

      // Small delay to ensure reset has completed
      setTimeout(() => {
        console.log("🔄 EDIT PAGE: About to call loadSvgData() with cached SVG")
        loadSvgData(cachedSvg)
        setHasLoaded(true)
        setLoading(false)
      }, 50)
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
    if (svg.pluginsConfig && typeof svg.pluginsConfig === "object") {
      const pluginsConfig = svg.pluginsConfig as Record<string, any>

      // Processar plugins dinamicamente
      // Extrair nomes de plugins do pluginsConfig (chaves que começam com PLUGIN_)
      const pluginNames = Object.keys(pluginsConfig)
        .filter(key => {
          const parts = key.split('_');
          return key.startsWith("PLUGIN_") && parts.length === 2;
        })
        .map(key => key.replace("PLUGIN_", "").toLowerCase())

      pluginNames.forEach((pluginName) => {
        const enabled = pluginsConfig[`PLUGIN_${pluginName.toUpperCase()}`] === true
        const username = pluginsConfig[`PLUGIN_${pluginName.toUpperCase()}_USERNAME`] || ""
        const sectionsStr = pluginsConfig[`PLUGIN_${pluginName.toUpperCase()}_SECTIONS`] || ""
        const sections = sectionsStr ? sectionsStr.split(",").filter(Boolean) : []

        setPluginConfig(pluginName, {
          enabled,
          username,
          sections,
        })
      })
    }

    // Carregar ordem dos plugins
    if (svg.pluginsOrder) {
      reorderPlugins(svg.pluginsOrder.split(","))
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