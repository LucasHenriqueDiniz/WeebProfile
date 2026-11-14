import { useEffect, useRef, useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useParams } from "@/src/compat/next-navigation"
import { useAuth } from "@/hooks/useAuth"
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
  const { getSvg } = useSvgStore()
  const { bootstrap } = useWizardBootstrapStore()
  const svgId = params.id as string

  // Set only after the SVG is in the wizard store, and the wizard mounts only then.
  //
  // The wizard used to mount as soon as auth finished and reset the store from its
  // own mount effect, while this page loaded the SVG into the store on a 100ms timer.
  // Whenever Clerk took longer than that -- any direct open or reload of this URL --
  // the load landed first and the reset wiped it: the editor came up as an empty
  // "Novo SVG", and enabling a plugin and saving would have overwritten the SVG.
  const [entityType, setEntityType] = useState<string | null>(null)
  const requestedIdRef = useRef<string | null>(null)
  const {
    resetForEdit,
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
    if (authLoading) return
    if (!user) {
      router.push("/login")
      return
    }

    // Bootstrap secrets presence (for validation)
    bootstrap()

    // Once per SVG id: a second load would reset the store over the user's edits.
    if (!svgId || requestedIdRef.current === svgId) return
    requestedIdRef.current = svgId
    setEntityType(null)
    loadSvg()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, svgId])

  const loadSvg = async () => {
    try {
      // getSvg answers from the cache while it is fresh and fetches otherwise. There is
      // no background refresh after a cache hit any more: re-applying the SVG resets
      // the store, which would throw away whatever the user changed in the meantime.
      const svg: Svg | null = await getSvg(svgId)
      if (!svg) {
        throw new Error("SVG not found")
      }
      loadSvgData(svg)
    } catch (error) {
      console.error("Error loading SVG:", error)
      const errorMessage =
        error instanceof ApiException
          ? error.data.message || error.data.error || error.message
          : t("error.loadingImage")
      alert(errorMessage)
      router.push("/dashboard")
    }
  }

  const loadSvgData = (svg: Svg) => {
    const svgEntityType = (svg as any).entityType || "profile"

    if (svgEntityType === "repository") {
      loadRepositoryFromSvg(svg as any)
      setEntityType(svgEntityType)
      return
    }

    // Start from a clean store: no plugin enabled, nothing left from a draft or from
    // another SVG, then apply this SVG's config on top.
    resetForEdit()
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

    setEntityType(svgEntityType)
  }

  if (!authLoading && !user) {
    return null
  }

  // Until the SVG is in the store, so the wizard never mounts over an empty one.
  if (!entityType) {
    return <LoadingScreen />
  }

  if (entityType === "repository") {
    return <RepositoryWizard isEditMode={true} editSvgId={params.id as string} />
  }

  return <Wizard isEditMode={true} editSvgId={params.id as string} />
}
