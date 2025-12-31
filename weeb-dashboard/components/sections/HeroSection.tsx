"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { motion } from "framer-motion"
import { Plus, Sparkles, Zap } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { HeroBackgroundPattern } from "./HeroBackgroundPattern"
import { HeroPreviewShowcase } from "./HeroPreviewShowcase"
import { HeroTemplateCard, type Template } from "./HeroTemplateCard"

interface HeroSectionProps {
  title: string
  subtitle: string
  ctaPrimary: { text: string; href: string }
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
      github: {
        sections: ["profile", "favorite_languages", "repositories"],
        sectionConfigs: { favorite_languages_max_languages: "3" },
      },
      myanimelist: { sections: ["statistics_simple", "anime_favorites", "character_favorites"] },
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
    plugins: ["github", "16personalities"],
    pluginConfigs: {
      github: { sections: ["profile", "activity", "repositories", "favorite_languages", "code_habits"] },
      "16personalities": { sections: ["personality"] },
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

const SUPPORTED_PLATFORMS = ["GitHub", "Steam", "LastFM", "MyAnimeList", "Lyfta"]

export function HeroSection({ title, ctaPrimary }: HeroSectionProps) {
  const [activeTemplate, setActiveTemplate] = useState<Template>(DEFAULT_TEMPLATES[0])
  const [isBuilding, setIsBuilding] = useState(false)
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false)
  const [configDialogOpen, setConfigDialogOpen] = useState<string | null>(null)
  const [templates] = useState<Template[]>(DEFAULT_TEMPLATES)
  const [autoPlayIndex, setAutoPlayIndex] = useState(0)
  const [isUserInteracting, setIsUserInteracting] = useState(false)

  // Estados derivados do template ativo
  const selectedSources = activeTemplate.plugins
  const selectedStyle = activeTemplate.style
  const selectedTheme = activeTemplate.theme

  // Initialize plugin configs
  const initializePluginConfigs = useCallback(() => {
    const configs: Record<string, { sections: string[]; sectionConfigs?: Record<string, any> }> = {}
    Object.keys(PLUGINS_METADATA).forEach((pluginId) => {
      const metadata = PLUGINS_METADATA[pluginId as keyof typeof PLUGINS_METADATA]
      const defaultSections = metadata?.defaultConfig?.sections || []
      configs[pluginId] = {
        sections: defaultSections.length > 0 ? defaultSections : [],
        sectionConfigs: {},
      }
    })
    return configs
  }, [])

  const [pluginConfigs, setPluginConfigs] = useState<
    Record<string, { sections: string[]; sectionConfigs?: Record<string, any> }>
  >(() => {
    const configs = initializePluginConfigs()
    // Aplicar configs do template inicial
    Object.entries(activeTemplate.pluginConfigs).forEach(([pluginId, config]) => {
      if (configs[pluginId]) {
        configs[pluginId] = { ...configs[pluginId], ...config }
      }
    })
    return configs
  })

  // Aplicar template
  const applyTemplate = useCallback(
    (template: Template) => {
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
    },
    [initializePluginConfigs]
  )

  // Handle manual template selection (pause auto-play)
  const handleTemplateClick = useCallback(
    (template: Template) => {
      setIsUserInteracting(true)
      applyTemplate(template)
      setTimeout(() => setIsUserInteracting(false), 10000)
    },
    [applyTemplate]
  )

  // Auto-play preview: cycle through templates automatically
  useEffect(() => {
    if (isUserInteracting || templatesModalOpen || templates.length === 0) return

    const interval = setInterval(() => {
      setAutoPlayIndex((prev) => {
        const nextIndex = (prev + 1) % Math.min(templates.length, 4)
        const nextTemplate = templates[nextIndex]
        if (nextTemplate && nextTemplate.id !== activeTemplate.id) {
          applyTemplate(nextTemplate)
        }
        return nextIndex
      })
    }, 4000) // Change template every 4 seconds

    return () => clearInterval(interval)
  }, [templates, isUserInteracting, templatesModalOpen, activeTemplate.id, applyTemplate])

  // Track user interaction to pause auto-play
  useEffect(() => {
    const handleInteraction = () => {
      setIsUserInteracting(true)
      setTimeout(() => setIsUserInteracting(false), 10000) // Resume after 10s of inactivity
    }

    window.addEventListener("mousemove", handleInteraction, { passive: true })
    window.addEventListener("click", handleInteraction, { passive: true })
    window.addEventListener("scroll", handleInteraction, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleInteraction)
      window.removeEventListener("click", handleInteraction)
      window.removeEventListener("scroll", handleInteraction)
    }
  }, [])

  const updatePluginSections = useCallback((pluginId: string, sections: string[]) => {
    setPluginConfigs((prev) => ({
      ...prev,
      [pluginId]: { ...prev[pluginId], sections },
    }))
  }, [])

  const updateSectionConfig = useCallback((pluginId: string, sectionId: string, config: Record<string, any>) => {
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
  }, [])

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
      const sections =
        pluginConfig.sections && pluginConfig.sections.length > 0 ? pluginConfig.sections : defaultSections

      // Separar sections e sectionConfigs para evitar duplicação
      const { sections: _, sectionConfigs, ...restPluginConfig } = pluginConfig

      config[pluginId] = {
        enabled: true,
        sections: sections,
        ...(sectionConfigs || {}),
        ...(pluginId === "lastfm" && {
          recent_tracks_max: 5,
          top_artists_max: 5,
        }),
        ...(pluginId === "myanimelist" && {
          anime_favorites_max: 5,
          manga_favorites_max: 5,
        }),
        ...restPluginConfig,
      }
      order.push(pluginId)
    })

    return { plugins: config, pluginsOrder: order }
  }, [selectedSources, pluginConfigs])

  // Templates visíveis (primeiros 4)
  const visibleTemplates = useMemo(() => templates.slice(0, 4), [templates])

  return (
    <section
      className="relative min-h-screen max-h-screen flex flex-col justify-center overflow-hidden pt-16"
      aria-label="Hero section"
    >
      {/* Grid pattern  */}
      <HeroBackgroundPattern />

      {/* Enhanced visual layers */}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
          {/* Left Column: Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-5 lg:gap-6"
          >
            {/* Hero Title & Subtitle - Enhanced */}
            <div className="space-y-4 relative">
              {/* Radial neon glow behind title */}
              <div
                className="absolute -top-8 -left-8 w-64 h-64 blur-3xl opacity-20 pointer-events-none -z-10"
                style={{
                  background:
                    "radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(236,72,153,0.2) 50%, transparent 70%)",
                }}
                aria-hidden="true"
              />

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.1] relative z-10">
                <span
                  className="block"
                  style={{
                    background:
                      "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(139,92,246,1) 0%, rgba(236,72,153,1) 40%, rgba(6,182,212,1) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {title.split("SVG").map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="inline-block relative mx-1">
                          {/* SVG text with vibrant gradient */}
                          <span
                            className="relative inline-block"
                            style={{
                              background: "linear-gradient(135deg, #a855f7 0%, #ec4899 30%, #06b6d4 60%, #a855f7 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                              fontWeight: 900,
                              letterSpacing: "-0.03em",
                              fontSize: "1.1em",
                            }}
                          >
                            SVG
                          </span>
                        </span>
                      )}
                    </span>
                  ))}
                </span>
              </h1>

              {/* Supported Platforms */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1" role="list" aria-label="Supported platforms">
                {SUPPORTED_PLATFORMS.map((name) => (
                  <motion.span
                    key={name}
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/60 backdrop-blur-sm"
                    role="listitem"
                  >
                    <span
                      className="w-1 h-1 rounded-full bg-gradient-to-r from-pink-500 to-cyan-400"
                      aria-hidden="true"
                    />
                    {name}
                  </motion.span>
                ))}
                <Link href="/plugins" className="text-[10px] text-muted-foreground/70 ml-1">+{Object.keys(PLUGINS_METADATA).length} plugins available</Link>
              </div>

              {/* CTA Buttons - Enhanced */}
              <div className="flex flex-wrap gap-3 pt-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative">
                  <Button
                    asChild
                    size="lg"
                    className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 shadow-lg shadow-pink-500/20 transition-all hover:shadow-pink-500/30 text-base font-semibold px-6 py-6"
                  >
                    <Link href={ctaPrimary.href}>
                      <Zap className="w-4 h-4 mr-2" aria-hidden="true" />
                      {ctaPrimary.text}
                    </Link>
                  </Button>
                  {/* Pulsing glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-30 blur-xl -z-10"
                    animate={{
                      opacity: [0.2, 0.35, 0.2],
                      scale: [1, 1.03, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    aria-hidden="true"
                  />
                </motion.div>
                <Button
                  variant="outline"
                  size="lg"
                  className="backdrop-blur-sm border-border/60 hover:border-primary/50 px-6 py-6 text-base"
                  asChild
                >
                  <Link href="/templates">View Examples</Link>
                </Button>
              </div>
            </div>

            {/* Templates Section */}
            <div className="space-y-3 pt-2">
              <div>
                <h3 className="text-base font-bold mb-0.5">Start with a template</h3>
                <p className="text-xs text-muted-foreground">Choose a style that matches your vibe</p>
              </div>

              {/* Templates Grid - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {visibleTemplates.map((template) => (
                  <HeroTemplateCard
                    key={template.id}
                    template={template}
                    isActive={activeTemplate.id === template.id}
                    onClick={() => handleTemplateClick(template)}
                  />
                ))}
              </div>

              {/* View More / Custom - Compact */}
              <div className="flex gap-2">
                {templates.length > 4 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs h-8 backdrop-blur-sm"
                    onClick={() => setTemplatesModalOpen(true)}
                    aria-label={`View all ${templates.length} templates`}
                  >
                    View All ({templates.length})
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="flex-1 text-xs h-8 group" asChild>
                  <Link href="/new">
                    <Plus className="w-3 h-3 mr-1.5" aria-hidden="true" />
                    Create Your Own
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Premium Showcase Preview */}
          <HeroPreviewShowcase
            isBuilding={isBuilding}
            selectedSources={selectedSources}
            pluginsConfig={pluginsConfig}
            selectedStyle={selectedStyle}
            validTheme={validTheme}
            activeTemplateId={activeTemplate.id}
          />
        </div>
      </div>

      {/* Templates Modal */}
      <Dialog open={templatesModalOpen} onOpenChange={setTemplatesModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              Choose a Template
            </DialogTitle>
            <DialogDescription>Select a template to preview or create your own custom profile</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              {templates.map((template) => (
                <HeroTemplateCard
                  key={template.id}
                  template={template}
                  isActive={activeTemplate.id === template.id}
                  onClick={() => {
                    handleTemplateClick(template)
                    setTemplatesModalOpen(false)
                  }}
                />
              ))}
            </div>

            {/* Create Your Own CTA */}
            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="flex flex-col items-center gap-3 text-center">
                <p className="text-sm text-muted-foreground">Don&apos;t see what you&apos;re looking for?</p>
                <Button asChild variant="outline" className="gap-2">
                  <Link href="/new">
                    <Plus className="w-4 h-4" />
                    Create Your Own Profile
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
