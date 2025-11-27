"use client"

import { PreviewRenderer } from "@/components/preview/PreviewRenderer"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PLUGINS_METADATA } from "@/lib/plugin-metadata"
import { getPluginIcon } from "@/lib/plugins-data"
import { templateApi } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  Check,
  Github,
  Sparkles,
  Settings,
  Loader2,
  Terminal,
  Monitor,
} from "lucide-react"
import Link from "next/link"
import { useMemo, useState, useEffect } from "react"
import { SectionSelector } from "./SectionSelector"

interface HeroSectionProps {
  title: string
  subtitle: string
  ctaPrimary: { text: string; href: string }
}

interface Template {
  id: string
  name: string
  description: string
  accent: string
  style: "default" | "terminal"
  theme: string
  plugins: string[]
  pluginConfigs: Record<string, { sections: string[]; sectionConfigs?: Record<string, any> }>
}

// Templates padrão hardcoded
const DEFAULT_TEMPLATES: Template[] = [
  {
    id: "dev-anime",
    name: "Dev + Anime",
    description: "GitHub contributions + anime favorites",
    accent: "#8957E5",
    style: "default",
    theme: "purple",
    plugins: ["github", "myanimelist"],
    pluginConfigs: {
      github: { sections: ["profile", "activity", "repositories"] },
      myanimelist: { sections: ["statistics", "favorites_anime"] },
    },
  },
  {
    id: "music-weeb",
    name: "Music Otaku",
    description: "LastFM scrobbles + anime stats",
    accent: "#06b6d4",
    style: "default",
    theme: "cyan",
    plugins: ["lastfm", "myanimelist"],
    pluginConfigs: {
      lastfm: { sections: ["recent_tracks", "statistics", "top_artists"] },
      myanimelist: { sections: ["favorites_anime", "statistics"] },
    },
  },
  {
    id: "terminal-minimal",
    name: "Terminal Minimal",
    description: "Clean terminal with GitHub activity",
    accent: "#10b981",
    style: "terminal",
    theme: "green",
    plugins: ["github"],
    pluginConfigs: {
      github: { sections: ["profile", "activity", "repositories"] },
    },
  },
  {
    id: "full-weeb",
    name: "Full Weeb Profile",
    description: "Complete profile with all plugins",
    accent: "#E5579A",
    style: "default",
    theme: "pink",
    plugins: ["github", "lastfm", "myanimelist"],
    pluginConfigs: {
      github: { sections: ["profile", "activity", "repositories"] },
      lastfm: { sections: ["recent_tracks", "statistics", "top_artists"] },
      myanimelist: { sections: ["statistics", "favorites_anime", "favorites_manga"] },
    },
  },
  {
    id: "terminal-full",
    name: "Terminal Full",
    description: "Terminal style with all plugins",
    accent: "#f97316",
    style: "terminal",
    theme: "orange",
    plugins: ["github", "lastfm", "myanimelist"],
    pluginConfigs: {
      github: { sections: ["profile", "activity"] },
      lastfm: { sections: ["recent_tracks", "statistics"] },
      myanimelist: { sections: ["statistics", "favorites_anime"] },
    },
  },
  {
    id: "github-focused",
    name: "GitHub Focused",
    description: "Deep dive into your code",
    accent: "#3b82f6",
    style: "default",
    theme: "blue",
    plugins: ["github"],
    pluginConfigs: {
      github: { sections: ["profile", "activity", "repositories", "favorite_languages", "code_habits"] },
    },
  },
]

export function HeroSection({
  title,
  subtitle,
  ctaPrimary,
}: HeroSectionProps) {
  const [activeTemplate, setActiveTemplate] = useState<Template>(DEFAULT_TEMPLATES[0])
  const [isBuilding, setIsBuilding] = useState(false)
  const [pluginsModalOpen, setPluginsModalOpen] = useState(false)
  const [advancedWizardOpen, setAdvancedWizardOpen] = useState(false)
  const [configDialogOpen, setConfigDialogOpen] = useState<string | null>(null)
  const [templates, setTemplates] = useState<Template[]>(DEFAULT_TEMPLATES)
  const [loadingTemplates, setLoadingTemplates] = useState(false)

  // Estados derivados do template ativo
  const selectedSources = activeTemplate.plugins
  const selectedStyle = activeTemplate.style
  const selectedTheme = activeTemplate.theme

  // Initialize plugin configs
  const initializePluginConfigs = () => {
    const configs: Record<string, any> = {}
    Object.keys(PLUGINS_METADATA).forEach((pluginId) => {
      const metadata = PLUGINS_METADATA[pluginId as keyof typeof PLUGINS_METADATA]
      const defaultSections = metadata?.defaultConfig?.sections || []
      configs[pluginId] = {
        sections: defaultSections.length > 0 ? defaultSections : [],
        sectionConfigs: {},
      }
    })
    return configs
  }

  const [pluginConfigs, setPluginConfigs] = useState<Record<string, any>>(() => {
    const configs = initializePluginConfigs()
    // Aplicar configs do template inicial
    Object.entries(activeTemplate.pluginConfigs).forEach(([pluginId, config]) => {
      if (configs[pluginId]) {
        configs[pluginId] = { ...configs[pluginId], ...config }
      }
    })
    return configs
  })

  // Carregar templates da API (opcional)
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoadingTemplates(true)
        const data = await templateApi.list()
        if (data.templates && data.templates.length > 0) {
          // Converter templates da API para o formato local
          const apiTemplates: Template[] = data.templates
            .filter((t: any) => t.isPublic)
            .slice(0, 4) // Limitar a 4 templates públicos
            .map((t: any) => {
              const pluginNames = t.pluginsOrder?.split(",").filter(Boolean) || []
              const pluginConfigs: Record<string, any> = {}
              
              pluginNames.forEach((pluginName: string) => {
                const sections = t.pluginsConfig[`PLUGIN_${pluginName.toUpperCase()}_SECTIONS`]?.split(",").filter(Boolean) || []
                pluginConfigs[pluginName] = { sections }
              })

              return {
                id: t.id,
                name: t.name,
                description: t.description || "",
                accent: "#8957E5", // Default accent
                style: t.style as "default" | "terminal",
                theme: t.theme || "purple",
                plugins: pluginNames,
                pluginConfigs,
              }
            })
          
          // Combinar templates padrão com templates da API
          setTemplates([...DEFAULT_TEMPLATES, ...apiTemplates])
        }
      } catch (error) {
        console.error("Error loading templates:", error)
        // Se der erro, usa apenas os templates padrão
      } finally {
        setLoadingTemplates(false)
      }
    }

    loadTemplates()
  }, [])

  // Aplicar template
  const applyTemplate = (template: Template) => {
    setIsBuilding(true)
    setActiveTemplate(template)

    // Atualizar plugin configs
    const newConfigs = initializePluginConfigs()
    Object.entries(template.pluginConfigs).forEach(([pluginId, config]) => {
      if (newConfigs[pluginId]) {
        newConfigs[pluginId] = { ...newConfigs[pluginId], ...config }
      }
    })
    setPluginConfigs(newConfigs)

    // Animação de "montagem"
    setTimeout(() => setIsBuilding(false), 400)
  }

  const toggleSource = (id: string) => {
    // Não usado mais, mas mantido para compatibilidade
  }

  const updatePluginSections = (pluginId: string, sections: string[]) => {
    setPluginConfigs((prev) => ({
      ...prev,
      [pluginId]: { ...prev[pluginId], sections },
    }))
  }

  const updateSectionConfig = (pluginId: string, sectionId: string, config: Record<string, any>) => {
    setPluginConfigs((prev) => ({
      ...prev,
      [pluginId]: {
        ...prev[pluginId],
        sectionConfigs: {
          ...(prev[pluginId]?.sectionConfigs || {}),
          [sectionId]: config,
        },
      },
    }))
  }

  const validTheme = useMemo(() => {
    return selectedTheme || "default"
  }, [selectedTheme])

  // Preparar plugins config para o PreviewRenderer
  const pluginsConfig = useMemo(() => {
    const config: Record<string, any> = {}
    const order: string[] = []

    selectedSources.forEach((pluginId) => {
      const pluginConfig = pluginConfigs[pluginId] || {}
      const pluginMetadata = PLUGINS_METADATA[pluginId as keyof typeof PLUGINS_METADATA]
      const defaultSections = pluginMetadata?.defaultConfig?.sections || []
      const sections = pluginConfig.sections && pluginConfig.sections.length > 0 
        ? pluginConfig.sections 
        : defaultSections

      config[pluginId] = {
        enabled: true,
        sections: sections,
        ...(pluginConfig.sectionConfigs || {}),
        ...(pluginId === "lastfm" && {
          recent_tracks_max: 5,
          top_artists_max: 5,
        }),
        ...(pluginId === "myanimelist" && {
          anime_favorites_max: 5,
          manga_favorites_max: 5,
        }),
        ...pluginConfig,
      }
      order.push(pluginId)
    })

    return { plugins: config, pluginsOrder: order }
  }, [selectedSources, pluginConfigs])

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Content + Templates */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8"
          >
            {/* Badge / pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary w-fit">
              <Sparkles className="w-3 h-3" />
              <span>Create your nerd card in minutes</span>
            </div>

            {/* Header Text */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
                  {title}
                </span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
                {subtitle}
              </p>

              {/* Platform chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {["GitHub", "Steam", "LastFM", "MyAnimeList", "Goodreads"].map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground border border-border/60"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-cyan-400" />
                    {name}
                  </span>
                ))}
                <span className="text-xs text-muted-foreground ml-1">+ more coming soon</span>
              </div>

              {/* CTA principal */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 shadow-lg shadow-pink-500/30">
                  <Link href={ctaPrimary.href}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {ctaPrimary.text}
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  View examples
                </Button>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Choose a template</h3>
                <p className="text-sm text-muted-foreground">Pick a style that matches your vibe</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.slice(0, 6).map((template) => {
                  const StyleIcon = template.style === "terminal" ? Terminal : Monitor
                  
                  return (
                    <motion.button
                      key={template.id}
                      onClick={() => applyTemplate(template)}
                      className={cn(
                        "group relative text-left rounded-2xl border bg-card/90 backdrop-blur-sm transition-all overflow-hidden",
                        activeTemplate.id === template.id
                          ? "border-primary shadow-xl shadow-primary/25 bg-primary/10 ring-2 ring-primary/30"
                          : "border-border/60 hover:border-primary/50 hover:bg-card hover:shadow-xl"
                      )}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Header com ícone e cor */}
                      <div className="relative px-5 pt-5 pb-4">
                        <div className="flex items-center gap-3 mb-4">
                          {/* Ícone do estilo atrás da cor */}
                          <div className="relative shrink-0">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                              style={{ backgroundColor: template.accent }}
                            >
                              <StyleIcon className="w-6 h-6 text-white/95" />
                            </div>
                            <div
                              className="absolute -inset-1 rounded-xl opacity-30 blur-md -z-10"
                              style={{ backgroundColor: template.accent }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-base font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                              {template.name}
                            </div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                              {template.plugins.length} {template.plugins.length === 1 ? "plugin" : "plugins"}
                            </div>
                          </div>
                        </div>
                        
                        {/* Plugins - apenas ícones, texto aparece no hover */}
                        <div className="flex items-center gap-2">
                          {template.plugins.map((pluginId) => {
                            const Icon = getPluginIcon(pluginId) || Github
                            return (
                              <motion.div
                                key={pluginId}
                                className="relative group/pluginicon"
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                              >
                                <div className="w-8 h-8 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center group-hover:bg-muted/70 group-hover:border-primary/30 transition-all cursor-pointer relative z-10">
                                  <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                {/* Tooltip que aparece no hover do ícone */}
                                <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs text-foreground font-medium px-2 py-1 rounded-md bg-card border border-border/50 shadow-lg z-50 pointer-events-none opacity-0 group-hover/pluginicon:opacity-100 transition-opacity duration-150">
                                  {pluginId}
                                  {/* Seta do tooltip */}
                                  <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-border/50" />
                                </span>
                              </motion.div>
                            )
                          })}
                        </div>
                        
                        {/* Descrição - aparece só no hover */}
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="overflow-hidden"
                          animate={{
                            opacity: 0,
                            height: 0,
                            marginTop: 0,
                          }}
                          whileHover={{
                            opacity: 1,
                            height: "auto",
                            marginTop: 12,
                          }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {template.description}
                          </p>
                        </motion.div>
                      </div>
                      
                      {/* Hover glow effect */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(circle at center, ${template.accent}08 0%, transparent 70%)`,
                        }}
                      />
                    </motion.button>
                  )
                })}
              </div>

              {/* Botão para ver mais templates */}
              {templates.length > 6 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs border-dashed hover:border-solid hover:bg-muted/50 transition-all"
                  onClick={() => {
                    // TODO: Navegar para página de templates
                    window.location.href = "/templates"
                  }}
                >
                  <Sparkles className="w-3 h-3 mr-2" />
                  View {templates.length - 6} more templates
                </Button>
              )}

              {/* Botão para wizard avançado */}
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-muted-foreground hover:text-foreground hover:bg-primary/5 border border-transparent hover:border-primary/20 rounded-lg transition-all group"
                  onClick={() => setAdvancedWizardOpen(true)}
                >
                  <Settings className="w-3.5 h-3.5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="group-hover:font-medium transition-all">Or customize everything manually</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform inline-block">→</span>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Sticker Card Preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Glow de fundo */}
              <div className="absolute -inset-10 bg-gradient-to-br from-cyan-500/30 via-pink-500/25 to-purple-500/30 blur-3xl opacity-70" />

              {/* Sticker card */}
              <motion.div
                initial={{ rotate: 2, y: 10 }}
                animate={{ rotate: 0, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative bg-card/95 backdrop-blur-xl rounded-3xl border-4 border-white/80 shadow-[0_25px_70px_rgba(15,23,42,0.9)] overflow-hidden max-w-xl"
              >
                <div className="relative bg-muted/10 px-4 pb-4 pt-2">
                  <div className="flex justify-center items-start" style={{ minHeight: "400px" }}>
                    <AnimatePresence mode="wait">
                      {isBuilding ? (
                        <motion.div
                          key="building"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-full flex flex-col items-center justify-center py-10"
                        >
                          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                          <p className="text-sm text-muted-foreground">Building your card...</p>
                        </motion.div>
                      ) : selectedSources.length > 0 && pluginsConfig.pluginsOrder.length > 0 ? (
                        <motion.div
                          key={`${activeTemplate.id}-${selectedStyle}-${validTheme}`}
                          initial={{ opacity: 0, y: 10, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.97 }}
                          transition={{ duration: 0.3 }}
                          className="w-full flex justify-center relative"
                        >
                          <PreviewRenderer
                            plugins={pluginsConfig.plugins}
                            pluginsOrder={pluginsConfig.pluginsOrder}
                            style={selectedStyle}
                            size="half"
                            theme={validTheme}
                          />
                          {/* Scan animation */}
                          <motion.div
                            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent mix-blend-screen"
                            initial={{ x: "-100%" }}
                              animate={{ x: "100%" }}
                              
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col items-center justify-center py-10 text-center w-full"
                        >
                          <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mb-3 border border-primary/30">
                            <Sparkles className="w-8 h-8 text-primary" />
                          </div>
                          <p className="text-sm font-medium text-foreground mb-1">
                            Select a template to see your card
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-muted/40 px-5 py-3 border-t border-border/70 text-[11px] flex items-center justify-center">
                  <span className="text-muted-foreground text-center">
                    Demo preview · using mock data
                  </span>
                </div>
              </motion.div>

              {/* Mini etiqueta embaixo */}
              <p className="mt-4 text-[11px] text-center text-muted-foreground">
                Free for up to <span className="font-semibold text-foreground">3 active cards</span> per account
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Advanced Wizard Modal */}
      <Dialog open={advancedWizardOpen} onOpenChange={setAdvancedWizardOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customize Everything</DialogTitle>
            <DialogDescription>
              Configure plugins, sections, style, and theme manually
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Select Plugins */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Select Plugins</h3>
              <Dialog open={pluginsModalOpen} onOpenChange={setPluginsModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Sparkles className="w-4 h-4 mr-2" />
                    {selectedSources.length > 0 
                      ? `${selectedSources.length} plugin${selectedSources.length > 1 ? 's' : ''} selected`
                      : 'Select plugins'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Select Plugins</DialogTitle>
                    <DialogDescription>
                      Choose which plugins to include in your card
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 py-4">
                    {Object.entries(PLUGINS_METADATA).map(([pluginId, metadata]) => {
                      const Icon = getPluginIcon(pluginId) || Github
                      const isSelected = selectedSources.includes(pluginId)
                      
                      return (
                        <div
                          key={pluginId}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-primary/10 border-primary"
                              : "bg-muted/50 border-transparent hover:border-border"
                          }`}
                          onClick={() => {
                            const newSources = isSelected
                              ? selectedSources.filter((id) => id !== pluginId)
                              : [...selectedSources, pluginId]
                            setActiveTemplate({
                              ...activeTemplate,
                              plugins: newSources,
                            })
                          }}
                        >
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                              isSelected
                                ? "bg-primary border-primary"
                                : "border-muted-foreground/30"
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <Icon className={`w-5 h-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                          <div className="flex-1">
                            <div className={`text-sm font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                              {metadata.displayName || pluginId}
                            </div>
                            {metadata.description && (
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {metadata.description}
                              </div>
                            )}
                          </div>
                          {isSelected && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 flex-shrink-0 hover:bg-primary/20"
                              onClick={(e) => {
                                e.stopPropagation()
                                setConfigDialogOpen(pluginId)
                              }}
                            >
                              <Sparkles className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={() => setPluginsModalOpen(false)}>
                      Done
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Style Selection */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Style</h3>
              <div className="grid grid-cols-2 gap-2">
                {["default", "terminal"].map((style) => (
                  <button
                    key={style}
                    onClick={() => {
                      setActiveTemplate({
                        ...activeTemplate,
                        style: style as "default" | "terminal",
                      })
                    }}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      selectedStyle === style
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                    )}
                  >
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selection */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Theme</h3>
              <div className="flex gap-3 flex-wrap">
                {["purple", "pink", "cyan", "orange", "blue", "green", "red"].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => {
                      setActiveTemplate({
                        ...activeTemplate,
                        theme,
                      })
                    }}
                    className={cn(
                      "w-10 h-10 rounded-full transition-all",
                      selectedTheme === theme
                        ? "ring-2 ring-offset-2 ring-offset-background ring-primary"
                        : "hover:opacity-80"
                    )}
                    style={{
                      backgroundColor: {
                        purple: "#8957E5",
                        pink: "#E5579A",
                        cyan: "#06b6d4",
                        orange: "#f97316",
                        blue: "#3b82f6",
                        green: "#10b981",
                        red: "#ef4444",
                      }[theme],
                    }}
                    aria-label={`Select ${theme} theme`}
                  />
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Config dialogs for each plugin */}
      {selectedSources.map((pluginId) => {
        const metadata = PLUGINS_METADATA[pluginId as keyof typeof PLUGINS_METADATA]
        
        return (
          <Dialog key={pluginId} open={configDialogOpen === pluginId} onOpenChange={(open) => setConfigDialogOpen(open ? pluginId : null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configure {metadata?.displayName || pluginId}</DialogTitle>
                <DialogDescription>
                  Choose which sections to display (using demo data)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <SectionSelector
                    pluginId={pluginId}
                    selectedSections={pluginConfigs[pluginId]?.sections || []}
                    onSectionsChange={(sections) => updatePluginSections(pluginId, sections)}
                    sectionConfigs={pluginConfigs[pluginId]?.sectionConfigs || {}}
                    onSectionConfigChange={(sectionId, config) => updateSectionConfig(pluginId, sectionId, config)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setConfigDialogOpen(null)}>
                  Done
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )
      })}
    </section>
  )
}
