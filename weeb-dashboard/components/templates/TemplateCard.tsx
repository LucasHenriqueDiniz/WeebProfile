"use client"

import { PreviewRenderer } from "@/components/preview/PreviewRenderer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "@/i18n/navigation"
import { getPluginIcon } from "@/lib/plugin-icons"
import { cn } from "@/lib/utils"
import { defaultThemes, terminalThemes } from "@weeb/weeb-plugins/themes"
import type { SvgStyle } from "@/types/svg"
import type { Template } from "@/types/template"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ExternalLink, Heart, Monitor, Terminal } from "lucide-react"
import { useTranslations } from "@/i18n/use-translations"
import Image from "@/src/compat/next-image"
import { memo, useMemo, useState } from "react"
import { FaGithub } from "react-icons/fa"
import useMeasure from "react-use-measure"

const SECONDS_PER_100PX = 0.5

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export interface TemplateCardProps {
  template: Template
  variant?: "hero" | "grid"
  href?: string
  onLike?: (id: string) => void
  showLike?: boolean
  index?: number
}

// Map platforms to plugin IDs (aceita label e id)
const platformToPlugin: Record<string, string> = {
  GitHub: "github",
  Steam: "steam",
  LastFM: "lastfm",
  MyAnimeList: "myanimelist",
}

function normalizePluginId(platformOrId: string) {
  const trimmed = (platformOrId || "").trim()
  if (!trimmed) return ""
  return platformToPlugin[trimmed] ?? trimmed.toLowerCase()
}

export function buildPluginsConfigFromPlatforms(platforms: string[]) {
  const plugins: Record<string, any> = {}
  const pluginsOrder: string[] = []

  for (const p of platforms || []) {
    const pluginId = normalizePluginId(p)
    if (!pluginId) continue

    plugins[pluginId] = {
      enabled: true,
      sections: [],
    }
    pluginsOrder.push(pluginId)
  }

  return { plugins, pluginsOrder }
}

export function buildPluginsConfigFromTemplate(template: Template) {
  // 1) Formato novo: pluginsConfig + pluginsOrder
  if (template.pluginsConfig && Object.keys(template.pluginsConfig).length > 0) {
    let pluginsOrder: string[] = []

    if (template.pluginsOrder) {
      pluginsOrder = Array.isArray(template.pluginsOrder)
        ? template.pluginsOrder
        : typeof template.pluginsOrder === "string"
          ? template.pluginsOrder
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : []
    }

    const normalizedPlugins: Record<string, any> = {}

    for (const [rawPluginId, config] of Object.entries(template.pluginsConfig)) {
      const pluginId = normalizePluginId(rawPluginId)
      if (!pluginId) continue
      if (!config || typeof config !== "object") continue

      normalizedPlugins[pluginId] = {
        enabled: (config as any).enabled !== false,
        sections: (config as any).sections?.length ? (config as any).sections : [],
        ...(config as any),
      }

      if (!pluginsOrder.includes(pluginId)) pluginsOrder.push(pluginId)
    }

    if (Object.keys(normalizedPlugins).length > 0) {
      return { plugins: normalizedPlugins, pluginsOrder }
    }
  }

  // 2) Fallback: deriva dos platforms (que já podem vir como ids)
  return buildPluginsConfigFromPlatforms(template.platforms || [])
}

function getTemplateAccent(theme?: string) {
  // Try to find the theme in default themes first
  const defaultTheme = defaultThemes[theme || "default"]
  if (defaultTheme) {
    return defaultTheme["--default-color-highlight"]
  }

  // Try to find the theme in terminal themes
  const terminalTheme = terminalThemes[theme || "default"]
  if (terminalTheme) {
    return terminalTheme["--terminal-color-highlight"]
  }

  // Fallback to default theme highlight color
  return defaultThemes.default["--default-color-highlight"]
}

export const TemplateCard = memo(function TemplateCard({
  template,
  variant = "grid",
  href,
  onLike,
  showLike = false,
  index = 0,
}: TemplateCardProps) {
  const t = useTranslations("templatesPage")
  const router = useRouter()
  const reduceMotion = useReducedMotion()

  const [isHovered, setIsHovered] = useState(false)

  const cardHref = href || `/templates/${template.id}`
  const accent = getTemplateAccent(template.theme)
  const StyleIcon = template.style === "terminal" ? Terminal : Monitor

  const hasImage = Boolean(template.preview && template.preview !== "/placeholder.svg")

  const pluginsConfig = useMemo(() => buildPluginsConfigFromTemplate(template), [template])

  // Medidas para o “marquee” vertical do preview no hover
  const [viewportRef, viewportBounds] = useMeasure()
  const [contentRef, contentBounds] = useMeasure()

  const travel = Math.max(0, contentBounds.height - viewportBounds.height)
  const duration = clamp((travel / 100) * SECONDS_PER_100PX, 2.5, 14)
  const shouldScrollPreview = isHovered && !reduceMotion && travel > 8

  const overlayMotion = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      }
    : {
        initial: { y: "100%", opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: "100%", opacity: 0 },
        transition: { duration: 0.35, ease: "easeOut" as const },
      }

  const previewProps = useMemo(
    () => ({
      plugins: pluginsConfig.plugins,
      pluginsOrder: pluginsConfig.pluginsOrder,
      style: template.style as SvgStyle,
      size: template.size,
      theme: template.theme,
      previewMode: true,
      disableFadeIn: true,
    }),
    [pluginsConfig.plugins, pluginsConfig.pluginsOrder, template.style, template.size, template.theme]
  )

  const navigate = () => router.push(cardHref)

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: index * 0.06, duration: 0.25 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative"
      >
        <Card
          role="link"
          tabIndex={0}
          onClick={navigate}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              navigate()
            }
          }}
          className={cn(
            "h-full cursor-pointer transition-all duration-300 group outline-none",
            "border-2 bg-card/50 backdrop-blur-sm",
            variant === "grid"
              ? "hover:border-primary/60 hover:shadow-xl hover:shadow-primary/20"
              : "border-border/60 hover:border-primary/40 hover:shadow-2xl"
          )}
        >
          <CardContent className="p-0">
            {/* Preview */}
            <div className="relative aspect-video bg-muted/30 overflow-hidden rounded-t-lg">
              {/* Base (static) */}
              {hasImage ? (
                <Image
                  src={template.preview!}
                  alt={template.name}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <PreviewRenderer {...previewProps} />
                </div>
              )}

              {/* Overlay (hover) */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    {...overlayMotion}
                    className="absolute inset-0 bg-background/95 backdrop-blur-sm p-4 z-10"
                  >
                    {/* viewport = “janela” fixa */}
                    <div ref={viewportRef} className="w-full h-full overflow-hidden flex justify-center items-start">
                      {/* content = “folha” que move */}
                      <motion.div
                        animate={shouldScrollPreview ? { y: [0, -travel] } : { y: 0 }}
                        transition={
                          shouldScrollPreview
                            ? {
                                duration,
                                ease: "easeInOut",
                                repeat: Infinity,
                                repeatType: "mirror",
                                repeatDelay: 0.15,
                              }
                            : { duration: 0.2, ease: "easeOut" }
                        }
                        className="will-change-transform"
                      >
                        <div ref={contentRef} className="flex justify-center">
                          <PreviewRenderer {...previewProps} />
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Content */}
            <div className="p-5">
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

              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{template.description}</p>

              <div className="flex items-center gap-1.5 mb-4">
                {(template.platforms || []).slice(0, 4).map((rawId) => {
                  const pluginId = normalizePluginId(rawId)
                  const Icon = getPluginIcon(pluginId) || FaGithub
                  return (
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
                  )
                })}
                {(template.platforms || []).length > 4 && (
                  <div className="w-6 h-6 rounded bg-muted/50 border border-border/50 flex items-center justify-center">
                    <span className="text-[10px] text-muted-foreground font-medium">
                      +{(template.platforms || []).length - 4}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="text-xs">
                  {template.style}
                </Badge>
                <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-700 dark:text-purple-400">
                  {template.theme}
                </Badge>
              </div>

              {variant === "grid" && (
                <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      navigate()
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t("templateCard.viewDetails")}
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
                      aria-label={template.liked ? t("templateCard.unlike") : t("templateCard.like")}
                    >
                      <Heart
                        className={cn(
                          "w-4 h-4 transition-colors",
                          template.liked ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-500"
                        )}
                      />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  )
})
