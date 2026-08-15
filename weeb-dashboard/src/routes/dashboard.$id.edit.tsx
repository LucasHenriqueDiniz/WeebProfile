import { useEffect, useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useParams } from "@/src/compat/next-navigation"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"
import { Wizard } from "@/components/wizard/Wizard"
import { RepositoryWizard } from "@/components/wizard/RepositoryWizard"
import { useWizardStore } from "@/stores/wizard-store"
import { useRepositoryWizardStore } from "@/stores/repository-wizard-store"
import { useSvgStore } from "@/stores/svg-store"
import { useWizardBootstrapStore } from "@/stores/wizard-bootstrap-store"
import type { Svg } from "@/lib/db/schema"
import { ApiException } from "@/lib/api"
import LoadingScreen from "@/components/loading/LoadingScreen"
import { getTerminalConfigs } from "@/lib/config/svg-config-helpers"
import { useTranslations } from "@/i18n/use-translations"

export default function EditSvgPage() {
  const t = useTranslations("wizard")
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { getSvg, getSvgSync } = useSvgStore()
  const { bootstrap } = useWizardBootstrapStore()
  const svgId = params.id as string

  // Tentar pegar do cache imediatamente
  const cachedSvg = getSvgSync(svgId)
  const [loading, setLoading] = useState(!cachedSvg)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [entityType, setEntityType] = useState<string | null>((cachedSvg as any)?.entityType || null)
  const {
    reset,
    setBasicInfo,
    setPluginConfig,
    setStyle,
    setSize,
    setTheme,
    setHideTerminalEmojis,
    setHideTerminalHeader,
    setHideTerminalCommand,
    setFontFamily,
    setTerminalHeaderText,
    setCustomCss,
    reorderPlugins,
  } = useWizardStore()
  const { loadFromSvg: loadRepositoryFromSvg } = useRepositoryWizardStore()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    // Bootstrap secrets presence (for validation)
    if (user) {
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
        getSvg(svgId)
          .then((updatedSvg) => {
            if (updatedSvg) {
              // Recarregar dados se o SVG foi atualizado
              loadSvgData(updatedSvg)
            }
          })
          .catch(() => {
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
          : t("error.loadingImage")
      alert(errorMessage)
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  const loadSvgData = (svg: Svg) => {
    const svgEntityType = (svg as any).entityType || "profile"
    setEntityType(svgEntityType)

    if (svgEntityType === "repository") {
      loadRepositoryFromSvg(svg as any)
      return
    }

    // Carregar dados no wizard store
    setBasicInfo(svg.name, svg.id, false) // Usar ID como slug temporário
    setStyle(svg.style as "default" | "terminal")
    setSize(svg.size as "half" | "full")
    setTheme(svg.theme || "default")

    // Read terminal configs from ui_config (not plugins_config)
    const uiConfig = (svg as any).uiConfig || {}
    const terminalConfigs = getTerminalConfigs(uiConfig)
    setHideTerminalEmojis(terminalConfigs.hideTerminalEmojis)
    setHideTerminalHeader(terminalConfigs.hideTerminalHeader)
    setHideTerminalCommand(terminalConfigs.hideTerminalCommand)
    setFontFamily(terminalConfigs.fontFamily)
    setTerminalHeaderText(terminalConfigs.terminalHeaderText)

    setCustomCss(svg.customCss || "")

    // Carregar plugins config
    // Format: { "github": { enabled: true, sections: [...], username: "..." }, ... }
    // Username now comes directly from svgs.plugins_config (no more plugin_config dependency)
    if (svg.pluginsConfig && typeof svg.pluginsConfig === "object") {
      const pluginsConfig = svg.pluginsConfig as Record<string, any>

      // Process plugins - username is now inside pluginsConfig[pluginName]
      Object.keys(pluginsConfig).forEach((pluginName) => {
        const pluginConfig = pluginsConfig[pluginName]
        if (pluginConfig && typeof pluginConfig === "object") {
          const activeSections = Array.isArray(pluginConfig.sections) ? pluginConfig.sections : []

          // Filter sectionConfigs to only include configs for active sections
          const allSectionConfigs = pluginConfig.sectionConfigs || {}
          const activeSectionConfigs: Record<string, any> = {}
          activeSections.forEach((sectionName: string) => {
            if (allSectionConfigs[sectionName]) {
              activeSectionConfigs[sectionName] = allSectionConfigs[sectionName]
            }
          })

          setPluginConfig(pluginName, {
            enabled: pluginConfig.enabled === true,
            sections: activeSections,
            sectionConfigs: activeSectionConfigs, // Only include configs for active sections
            // Username and other requiredFields are now directly in pluginsConfig
            ...(pluginConfig.username && { username: pluginConfig.username }),
            // Include any other requiredFields that might be in the config
            ...Object.keys(pluginConfig).reduce(
              (acc, key) => {
                if (key !== "enabled" && key !== "sections" && key !== "sectionConfigs" && pluginConfig[key]) {
                  acc[key] = pluginConfig[key]
                }
                return acc
              },
              {} as Record<string, any>
            ),
          })
        }
      })

      // Carregar ordem dos plugins.
      //
      // `selectEnabledPluginNames` deriva tudo de `pluginsOrder` -- um plugin
      // habilitado que não esteja nessa lista é invisível para o preview e para a
      // validação. E `resetForEdit` zera a ordem, então quando o SVG salvo não tem
      // `plugins_order` (as linhas mais antigas do banco têm NULL) o wizard abria
      // com preview vazio: "habilite pelo menos um plugin", com o plugin habilitado
      // ali do lado. Voltava a aparecer só ao mexer numa seção, porque aí o
      // togglePlugin insere o nome na ordem.
      //
      // Por isso a ordem salva é uma preferência, não a fonte da verdade: o que
      // manda é quais plugins estão habilitados na config.
      const ordemSalva = (svg.pluginsOrder || "")
        .split(",")
        .map((nome) => nome.trim())
        .filter(Boolean)

      const habilitados = Object.keys(pluginsConfig).filter((nome) => pluginsConfig[nome]?.enabled === true)

      reorderPlugins([
        ...ordemSalva.filter((nome) => habilitados.includes(nome)),
        ...habilitados.filter((nome) => !ordemSalva.includes(nome)),
      ])
    }
  }

  // Só mostrar loading se não tiver dados e estiver carregando
  if (authLoading || (loading && !cachedSvg)) {
    return <LoadingScreen />
  }

  if (!user) {
    return null
  }

  if (entityType === "repository") {
    return <RepositoryWizard isEditMode={true} editSvgId={params.id as string} />
  }

  return <Wizard isEditMode={true} editSvgId={params.id as string} />
}
