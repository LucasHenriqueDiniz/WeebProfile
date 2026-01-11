"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowLeft, Heart, Share2, ExternalLink, Loader2, Eye, Monitor, Terminal, Copy } from "lucide-react"
import { FaGithub } from "react-icons/fa"
import Link from "next/link"
import { templateApi } from "@/lib/api"
import { ApiException } from "@/lib/api/client"
import { PreviewRenderer } from "@/components/preview/PreviewRenderer"
import { ensureConsistentPlatforms, pluginIdsToDisplayNames, formatDate } from "@/lib/templates"
import type { SvgTemplate, SvgStyle, SvgSize, SvgTheme } from "@/types/svg"
import { getPluginIcon } from "@/lib/plugin-icons"
import { cn } from "@/lib/utils"
import { useTranslations } from 'next-intl'
import { useLocaleNavigation } from '@/lib/navigation'

interface TemplateDetailClientProps {
  templateId: string
}

export function TemplateDetailClient({
  templateId,
}: TemplateDetailClientProps) {
  const t = useTranslations('templatesPage')
  const { toLocalePath } = useLocaleNavigation()
  const [template, setTemplate] = useState<SvgTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [shareCopied, setShareCopied] = useState(false)

  // Preparar plugins config para PreviewRenderer
  const pluginsConfig = useMemo(() => {
    if (!template) return { plugins: {}, pluginsOrder: [] }

    // Se o template tem pluginsConfig e pluginsOrder da API, use-os diretamente
    if (template.pluginsConfig && template.pluginsOrder) {
      const pluginsOrder = Array.isArray(template.pluginsOrder)
        ? template.pluginsOrder
        : template.pluginsOrder.split(',').filter(Boolean)

      // Converter pluginsConfig para o formato esperado pelo PreviewRenderer
      const plugins: Record<string, any> = {}
      pluginsOrder.forEach(pluginId => {
        if (template.pluginsConfig && template.pluginsConfig[pluginId]) {
          plugins[pluginId] = template.pluginsConfig[pluginId]
        }
      })

      return { plugins, pluginsOrder }
    }

    // Fallback: criar config básico das plataformas
    const platforms = ensureConsistentPlatforms(template)
    const plugins: Record<string, any> = {}
    platforms.forEach((pluginId) => {
      if (pluginId) {
        plugins[pluginId] = {
          enabled: true,
          sections: [], // Começar sem seções - o render deve lidar com isso
        }
      }
    })

    return { plugins, pluginsOrder: platforms }
  }, [template])

  useEffect(() => {
    async function fetchTemplate() {
      try {
        setLoading(true)
        // Try to fetch template directly from API (works for public templates)
        const response = await fetch(`/api/templates/${templateId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch template')
        }
        const data = await response.json()
        const processedTemplate = {
          ...data.template,
          platforms: ensureConsistentPlatforms(data.template),
          size: data.template.size || "full" // Default to "full" if not specified
        }
        setTemplate(processedTemplate)
      } catch (err) {
        console.error("Error fetching template:", err)
        setError("Failed to load template")
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [templateId])

  const handleLike = async () => {
    if (!template) return

    try {
      if (template.liked) {
        await templateApi.unlike(template.id)
        setTemplate(prev => prev ? {
          ...prev,
          liked: false,
          likes: Math.max(0, (prev.likes || 0) - 1)
        } : null)
      } else {
        await templateApi.like(template.id)
        setTemplate(prev => prev ? {
          ...prev,
          liked: true,
          likes: (prev.likes || 0) + 1
        } : null)
      }
    } catch (err) {
      console.error("Error liking template:", err)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    } catch (err) {
      console.error("Error copying link:", err)
    }
  }

  // Enhanced preview with hover effects
  const getTemplateAccent = (template: SvgTemplate) => {
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

  const accent = template ? getTemplateAccent(template) : '#6b7280'
  const StyleIcon = template?.style === "terminal" ? Terminal : Monitor


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    )
  }

  if (error || !template) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-6">
            <Eye className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{t('templateNotFound')}</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {t('templateNotFoundDescription')}
          </p>
          <Button asChild>
            <Link href="/templates">
              {t('backToGallery')}
            </Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 relative">
      {/* Back Button - Absolute Position */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-0 left-0"
      >
          <Button variant="ghost" asChild className="gap-2">
            <Link href={toLocalePath('/templates')}>
              <ArrowLeft className="w-4 h-4" />
              {t('backToTemplates')}
            </Link>
          </Button>
      </motion.div>

      <div className={`grid gap-8 ${
        template?.size === "half" 
          ? "grid-cols-1 lg:grid-cols-2" 
          : "grid-cols-1 lg:grid-cols-3"
      }`}>
        {/* Enhanced Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={template?.size === "half" ? "lg:col-span-1" : "lg:col-span-2"}
        >
          <Card className="overflow-hidden border-2 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="relative bg-gradient-to-br from-muted/20 to-muted/10 rounded-lg overflow-hidden border border-border/50 min-h-[500px]">
                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  style={{
                    background: `linear-gradient(135deg, ${accent}10 0%, ${accent}05 50%, transparent 100%)`,
                  }}
                />
                
                {/* Preview content with enhanced animation and infinite hover effect */}
                <motion.div
                  className="relative z-10 w-full h-full px-2 py-1 overflow-hidden"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 100 }}
                >
                  <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="w-full max-w-4xl flex items-center justify-center"
                  >
                    <motion.div
                      className="relative overflow-hidden rounded-lg"
                      whileHover={{
                        scale: 1.02,
                        transition: { duration: 0.3 }
                      }}
                    >
                      {/* Static preview container */}
                      <div className="relative">
                        <PreviewRenderer
                          plugins={pluginsConfig.plugins}
                          pluginsOrder={pluginsConfig.pluginsOrder}
                          style={template.style}
                          size={template.size}
                          theme={template.theme}
                          hideTerminalEmojis={template.hideTerminalEmojis}
                          hideTerminalHeader={template.hideTerminalHeader}
                          customCss={template.customCss}
                          customThemeColors={template.customThemeColors}
                        />
                      </div>

                      {/* Hover overlay effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-primary/5 pointer-events-none rounded-lg"
                        initial={{ opacity: 0 }}
                        whileHover={{
                          opacity: 1,
                          transition: { duration: 0.3 }
                        }}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`space-y-6 ${template?.size === "half" ? "lg:col-span-1" : "lg:col-span-1"}`}
        >
          {/* Title and Actions with enhanced styling */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg"
                style={{ 
                  backgroundColor: accent,
                  boxShadow: `0 4px 20px ${accent}40`,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <StyleIcon className="w-6 h-6 text-white" /> 
              </motion.div>
              <div className="flex-1">
                <motion.h1 
                  className="text-3xl font-bold mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {template.name}
                </motion.h1>
              </div>
            </div>
            
            <motion.p 
              className="text-muted-foreground text-base leading-relaxed mt-4 p-4 bg-muted/30 rounded-lg border border-border/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {template.description}
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button asChild className="gap-2 shadow-lg">
                <Link href={toLocalePath(`/dashboard/new?template=${template.id}`)}>
                  <ExternalLink className="w-4 h-4" />
                  {t('useTemplate')}
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={handleLike}
                className="gap-2"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    template.liked ? "fill-red-500 text-red-500" : "hover:text-red-500"
                  }`}
                />
                {template.liked ? t('unlikeTemplate') : t('likeTemplate')}
                {template.likes !== undefined && template.likes > 0 && (
                  <span className="text-sm">({template.likes})</span>
                )}
              </Button>
              <Button variant="outline" onClick={handleShare} className="gap-2">
                <Share2 className="w-4 h-4" />
                {shareCopied ? (
                  <span className="flex items-center gap-1">
                    <Copy className="w-4 h-4" />
                    {t('share.copied')}
                  </span>
                ) : (
                  <span>{t('shareTemplate')}</span>
                )}
              </Button>
            </motion.div>
          </div>

          <Separator />

          {/* Template Info */}
          <div className="space-y-4">
            {/* Creator */}
            {template.user && (
              <div>
                <h3 className="font-semibold mb-2">{t('createdBy')}</h3>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {template.user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm">{template.user.name}</span>
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="text-sm">
              <p className="text-muted-foreground">{t('detail.createdAt')}</p>
              <p>{template.createdAt ? formatDate(template.createdAt, 'pt-BR') : 'N/A'}</p>
            </div>
          </div>

          <Separator />

          {/* Enhanced Template Details */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {/* Platforms with enhanced display */}
            {template.platforms && template.platforms.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="font-semibold mb-3 text-lg">{t('platforms')}</h3>
                <div className="flex flex-wrap gap-2">
                  {pluginIdsToDisplayNames(template.platforms).map((platform, index) => {
                    const Icon = getPluginIcon(template.platforms[index]) || FaGithub
                    return (
                          <Badge key={template.platforms[index]} className="gap-1 px-3 py-1.5 capitalize">
                            {Icon && <Icon className="w-3 h-3" />}
                            {platform}
                          </Badge>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Style, Theme & Size with enhanced cards */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <h3 className="font-semibold mb-2">{t('style')}</h3>
                  <Badge variant="outline" className="text-sm px-3 py-1.5">
                    {template.style === "terminal" ? (
                      <>
                        <Terminal className="w-3 h-3 mr-1" />
                        Terminal
                      </>
                    ) : (
                      <>
                        <Monitor className="w-3 h-3 mr-1" />
                        Padrão
                      </>
                    )}
                  </Badge>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <h3 className="font-semibold mb-2">{t('theme')}</h3>
                  <Badge 
                    variant="outline" 
                    className="capitalize text-sm px-3 py-1.5 bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30"
                    style={{ borderColor: `${accent}30` }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full mr-1 border border-current"
                      style={{ backgroundColor: accent }}
                    />
                    {template.theme}
                  </Badge>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <h3 className="font-semibold mb-2">{t('detail.size')}</h3>
                  <Badge variant="outline" className="text-sm px-3 py-1.5">
                    <Monitor className="w-3 h-3 mr-1" />
                    {template.size === "half" ? t('sizes.half') : t('sizes.full')}
                  </Badge>
                </motion.div>

                {/* Terminal Options */}
                {template.style === "terminal" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="space-y-3"
                  >
                    <h3 className="font-semibold mb-2">{t('detail.terminalOptions')}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Ocultar Emojis</span>
                        <Badge variant={template.hideTerminalEmojis ? "default" : "secondary"} className="text-xs">
                          {template.hideTerminalEmojis ? "Sim" : "Não"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Ocultar Cabeçalho</span>
                        <Badge variant={template.hideTerminalHeader ? "default" : "secondary"} className="text-xs">
                          {template.hideTerminalHeader ? "Sim" : "Não"}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Customization Info */}
                {(template.customCss || template.customThemeColors) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    className="space-y-3"
                  >
                    <h3 className="font-semibold mb-2">{t('detail.customizations')}</h3>
                    <div className="space-y-2">
                      {template.customCss && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{t('detail.customCss')}</span>
                          <Badge variant="default" className="text-xs">
                            {t('detail.applied')}
                          </Badge>
                        </div>
                      )}
                      {template.customThemeColors && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{t('detail.customColors')}</span>
                          <Badge variant="default" className="text-xs">
                            {Object.keys(template.customThemeColors).length} cores
                          </Badge>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
