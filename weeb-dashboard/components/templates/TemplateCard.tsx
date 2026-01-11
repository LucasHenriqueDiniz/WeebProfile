"use client"

import { memo, useMemo, useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Heart, Monitor, Terminal, ExternalLink } from "lucide-react"
import { FaGithub } from "react-icons/fa"
import { Link } from "@/i18n/navigation"
import { PreviewRenderer } from "@/components/preview/PreviewRenderer"
import { getPluginIcon } from "@/lib/plugin-icons"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import Image from "next/image"
import type { Template } from "@/types/template"
import { SvgStyle } from "@/types/svg"

export interface TemplateCardProps {
  template: Template
  variant?: "hero" | "grid"
  href?: string
  onLike?: (id: string) => void
  showLike?: boolean
  index?: number
}

// Map platforms to plugin IDs
const platformToPlugin: Record<string, string> = {
  GitHub: "github",
  Steam: "steam",
  LastFM: "lastfm",
  MyAnimeList: "myanimelist",
}

// Helper function to get default sections for plugins
function getDefaultSections(pluginId: string): string[] {
  const defaultSections: Record<string, string[]> = {
    github: ['profile', 'activity'],
    lastfm: ['recent_tracks', 'top_artists'],
    myanimelist: ['statistics', 'anime_favorites'],
    steam: ['profile', 'recent_games'],
    '16personalities': ['personality'],
    codeforces: ['profile', 'rating'],
    codewars: ['profile', 'honor'],
    duolingo: ['profile', 'streak'],
    stackoverflow: ['profile', 'reputation'],
    lyfta: ['profile']
  }
  
  return defaultSections[pluginId] || ['profile']
}

export function buildPluginsConfigFromPlatforms(platforms: string[]) {
  const plugins: Record<string, any> = {}
  const pluginsOrder: string[] = []

  platforms.forEach((platform) => {
    const pluginId = platformToPlugin[platform]
    if (pluginId) {
      plugins[pluginId] = {
        enabled: true,
        sections: getDefaultSections(pluginId), // Use default sections instead of empty
      }
      pluginsOrder.push(pluginId)
    }
  })

  return { plugins, pluginsOrder }
}

export function buildPluginsConfigFromTemplate(template: Template) {
  // If template has pluginsConfig, use them
  if (template.pluginsConfig && Object.keys(template.pluginsConfig).length > 0) {
    // Normalize pluginsOrder to string array
    let pluginsOrder: string[] = []
    
    if (template.pluginsOrder) {
      pluginsOrder = Array.isArray(template.pluginsOrder)
        ? template.pluginsOrder
        : typeof template.pluginsOrder === 'string'
          ? template.pluginsOrder.split(',').filter(Boolean)
          : []
    }

    // Ensure all plugins have proper sections
    const normalizedPlugins: Record<string, any> = {}
    
    for (const [pluginId, config] of Object.entries(template.pluginsConfig)) {
      if (config && typeof config === 'object') {
        normalizedPlugins[pluginId] = {
          enabled: config.enabled !== false,
          sections: config.sections || getDefaultSections(pluginId),
          ...config
        }
        
        // Add to pluginsOrder if not already there
        if (!pluginsOrder.includes(pluginId)) {
          pluginsOrder.push(pluginId)
        }
      }
    }

    // If we have plugins, return them
    if (Object.keys(normalizedPlugins).length > 0) {
      return {
        plugins: normalizedPlugins,
        pluginsOrder,
      }
    }
  }

  // Handle legacy format (PLUGIN_GITHUB: true, etc.)
  if (template.pluginsConfig && typeof template.pluginsConfig === 'object') {
    const plugins: Record<string, any> = {}
    const pluginsOrder: string[] = []
    
    // Convert legacy format to new format
    for (const [key, value] of Object.entries(template.pluginsConfig)) {
      if (key.startsWith('PLUGIN_') && value === true) {
        const pluginId = key.replace('PLUGIN_', '').toLowerCase()
        const sectionsKey = `${key}_SECTIONS`
        const sectionsValue = (template.pluginsConfig as any)[sectionsKey]
        
        plugins[pluginId] = {
          enabled: true,
          sections: sectionsValue && typeof sectionsValue === 'string' 
            ? sectionsValue.split(',').filter(Boolean) 
            : getDefaultSections(pluginId)
        }
        pluginsOrder.push(pluginId)
      }
    }
    
    if (Object.keys(plugins).length > 0) {
      return { plugins, pluginsOrder }
    }
  }

  // Otherwise, build from platforms
  return buildPluginsConfigFromPlatforms(template.platforms)
}

export const TemplateCard = memo(function TemplateCard({
  template,
  variant = "grid",
  href,
  onLike,
  showLike = false,
  index = 0,
}: TemplateCardProps) {
  const t = useTranslations('templatesPage')
  const shouldReduceMotion = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)
  const [showcaseMode, setShowcaseMode] = useState(false)

  useEffect(() => {
    if (isHovered) {
      setShowcaseMode(true)
    } else {
      setShowcaseMode(false)
    }
  }, [isHovered])

  const hasImage = template.preview && template.preview !== "/placeholder.svg"
  const pluginsConfig = useMemo(() => buildPluginsConfigFromTemplate(template), [template])

  const getTemplateAccent = (template: Template) => {
    const themeColors: Record<string, string> = {
      purple: '#a855f7',
      pink: '#ec4899',
      blue: '#3b82f6',
      green: '#22c55e',
      dracula: '#8b5cf6',
      default: '#6b7280'
    }
    return themeColors[template.theme] || themeColors.default
  }

  const accent = getTemplateAccent(template)
  const StyleIcon = template.style === "terminal" ? Terminal : Monitor
  const cardHref = href || `/templates/${template.id}`
  
  // Memoizar o PreviewRenderer para evitar re-renders desnecessários
  const memoizedPreviewRenderer = useMemo(() => (
    <PreviewRenderer
      plugins={pluginsConfig.plugins}
      pluginsOrder={pluginsConfig.pluginsOrder}
      style={template.style as SvgStyle}
      size={template.size}
      theme={template.theme}
      previewMode={true}
      disableFadeIn={true}
    />
  ), [pluginsConfig.plugins, pluginsConfig.pluginsOrder, template.style, template.size, template.theme])
  
  // Calcular altura dinâmica baseada na quantidade de plugins
  const pluginsQuantity = Object.keys(pluginsConfig.plugins).length
  const baseHeight = pluginsQuantity * 200
  

  const hoverVariants = shouldReduceMotion ? {} : {
    y: -2,
    transition: { duration: 0.2, ease: "easeOut" as const }
  }

  const overlayVariants = shouldReduceMotion ? {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  } : {
    hidden: { y: "-100%", opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" as const } }
  }

  const contentVariants = shouldReduceMotion ? {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    showcase: { opacity: 1 }
  } : {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.3, ease: "easeOut" as const, delay: 0.1 }
    },
    showcase: {
      y: [`-${baseHeight}px`, `${baseHeight}px`, `-${baseHeight}px`],
      opacity: 1,
      transition: { 
        duration: Math.max(pluginsQuantity * 2, 4),
        ease: "easeInOut" as const, 
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.3 }}
        whileHover={shouldReduceMotion ? {} : hoverVariants}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative"
      >
        <Link href={cardHref}>
          <Card className={cn(
            "h-full cursor-pointer transition-all duration-300 group",
            "border-2 bg-card/50 backdrop-blur-sm",
            variant === "grid"
              ? "hover:border-primary/60 hover:shadow-xl hover:shadow-primary/20"
              : "border-border/60 hover:border-primary/40 hover:shadow-2xl"
          )}>
            <CardContent className="p-0">
              {/* Preview Section with Expand on Hover */}
              <div className="relative aspect-video bg-muted/30 overflow-hidden">
                {/* Static preview */}
                {hasImage ? (
                  <Image
                    src={template.preview}
                    alt={template.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    {memoizedPreviewRenderer}
                  </div>
                )}

                {/* Hover overlay - always show on hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={overlayVariants}
                      className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 z-10"
                    >
                      <motion.div
                        className="w-full h-full flex items-center justify-center"
                        variants={contentVariants}
                        initial="hidden"
                        animate={showcaseMode ? "showcase" : "visible"}
                        exit="hidden"
                      >
                        {memoizedPreviewRenderer}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Content Section */}
              <div className="p-5">
                {/* Header with icon and name */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: accent,
                      boxShadow: `0 4px 16px ${accent}40`,
                    }}
                  >
                    <StyleIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                      {template.name}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {template.description}
                </p>

                {/* Plugin Icons */}
                <div className="flex items-center gap-1.5 mb-4">
                  {template.platforms.slice(0, 4).map((pluginId) => {
                    const Icon = getPluginIcon(pluginId) || FaGithub
                    return Icon ? (
                      <Tooltip key={pluginId}>
                        <TooltipTrigger asChild>
                          <div className="w-6 h-6 rounded bg-muted/50 border border-border/50 flex items-center justify-center transition-transform group-hover:scale-110">
                            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{pluginId}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : null
                  })}
                  {template.platforms.length > 4 && (
                    <div className="w-6 h-6 rounded bg-muted/50 border border-border/50 flex items-center justify-center">
                      <span className="text-[10px] text-muted-foreground font-medium">
                        +{template.platforms.length - 4}
                      </span>
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="text-xs">
                    {template.style}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs bg-purple-500/10 text-purple-700 dark:text-purple-400"
                  >
                    {template.theme}
                  </Badge>
                </div>

                {/* Actions */}
                {variant === "grid" && (
                  <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        // Navigate to template detail
                        window.location.href = cardHref
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {t('templateCard.viewDetails')}
                    </Button>
                    {showLike && onLike && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          onLike(template.id)
                        }}
                        aria-label={template.liked ? t('templateCard.unlike') : t('templateCard.like')}
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            template.liked
                              ? "fill-red-500 text-red-500"
                              : "text-muted-foreground hover:text-red-500"
                          }`}
                        />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    </TooltipProvider>
  )
})
