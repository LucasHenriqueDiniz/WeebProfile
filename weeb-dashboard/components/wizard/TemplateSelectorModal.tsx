"use client"

import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Search, Sparkles, Code2, Music, BookOpen, Brain, Loader2, CheckCircle2, Heart } from "lucide-react"
import { templateApi, ApiException } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useWizardStore } from "@/stores/wizard-store"
import { getPluginIcon } from "@/lib/plugins-data"
import { PLUGINS_METADATA, getPluginsGroupedByCategory, type PluginCategory } from "@/lib/weeb-plugins/plugins/metadata"
import { cn } from "@/lib/utils"

interface Template {
  id: string
  name: string
  description: string | null
  style: string
  size: string
  theme: string
  pluginsOrder: string
  pluginsConfig: Record<string, any>
  isPublic: boolean
  createdAt: string
  likesCount?: number
  userLiked?: boolean
  hideTerminalEmojis?: boolean
  hideTerminalHeader?: boolean
  customCss?: string
}

interface TemplateSelectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TemplateSelectorModal({ open, onOpenChange }: TemplateSelectorModalProps) {
  const { toast } = useToast()
  const {
    reset,
    setBasicInfo,
    setStyle,
    setSize,
    setTheme,
    setHideTerminalEmojis,
    setHideTerminalHeader,
    setCustomCss,
    setPluginConfig,
    reorderPlugins,
  } = useWizardStore()

  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(false)
  const [likingTemplateId, setLikingTemplateId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<PluginCategory | "all">("all")
  const [selectedStyle, setSelectedStyle] = useState<"all" | "default" | "terminal">("all")

  // Load templates
  useEffect(() => {
    if (open) {
      loadTemplates()
    }
  }, [open])

  const loadTemplates = async () => {
    setLoading(true)
    try {
      const data = await templateApi.list()
      setTemplates(data.templates || [])
    } catch (error) {
      console.error("Error loading templates:", error)
      toast({
        title: "Error",
        description: "Failed to load templates",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (template.description || "").toLowerCase().includes(searchQuery.toLowerCase())

      // Style filter
      const matchesStyle = selectedStyle === "all" || template.style === selectedStyle

      // Category filter (based on plugins in template)
      const matchesCategory = (() => {
        if (selectedCategory === "all") return true

        const pluginNames = template.pluginsOrder?.split(",").filter(Boolean) || []
        const grouped = getPluginsGroupedByCategory()

        return pluginNames.some((pluginName) => {
          const metadata = (PLUGINS_METADATA as Record<string, any>)[pluginName]
          return metadata?.category === selectedCategory
        })
      })()

      return matchesSearch && matchesStyle && matchesCategory
    })
  }, [templates, searchQuery, selectedCategory, selectedStyle])

  // Get plugins in template
  const getTemplatePlugins = (template: Template) => {
    const pluginNames = template.pluginsOrder?.split(",").filter(Boolean) || []
    return pluginNames.map((name) => {
      const metadata = (PLUGINS_METADATA as Record<string, any>)[name]
      return {
        name,
        displayName: metadata?.displayName || name,
        icon: getPluginIcon(name),
        category: metadata?.category || "coding",
      }
    })
  }

  // Apply template
  const applyTemplate = async (template: Template) => {
    try {
      // Reset wizard state
      reset()

      // Set basic info
      setBasicInfo(template.name, "", false)

      // Set style and theme
      setStyle(template.style as "default" | "terminal")
      setSize(template.size as "half" | "full")
      setTheme(template.theme || "default")
      setHideTerminalEmojis(template.hideTerminalEmojis || false)
      setHideTerminalHeader(template.hideTerminalHeader || false)
      setCustomCss(template.customCss || "")

      // Parse plugins config
      const pluginNames = template.pluginsOrder?.split(",").filter(Boolean) || []
      const plugins: Record<string, any> = {}

      for (const pluginName of pluginNames) {
        const isEnabled = template.pluginsConfig[`PLUGIN_${pluginName.toUpperCase()}`] === true
        const sections = template.pluginsConfig[`PLUGIN_${pluginName.toUpperCase()}_SECTIONS`]?.split(",") || []

        plugins[pluginName] = {
          enabled: isEnabled,
          username: template.pluginsConfig[`PLUGIN_${pluginName.toUpperCase()}_USERNAME`] || "",
          sections: sections.filter(Boolean),
          sectionConfigs: {},
          fields: {},
        }
      }

      // Set plugins
      for (const [pluginName, config] of Object.entries(plugins)) {
        setPluginConfig(pluginName, config)
      }

      // Set plugins order
      reorderPlugins(pluginNames)

      toast({
        title: "Template applied!",
        description: `Template "${template.name}" has been loaded`,
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Error applying template:", error)
      toast({
        title: "Error",
        description: "Failed to apply template",
        variant: "destructive",
      })
    }
  }

  // Handle like/unlike
  const handleLike = async (e: React.MouseEvent, templateId: string, isLiked: boolean) => {
    e.stopPropagation() // Prevent card click
    if (likingTemplateId) return // Prevent double clicks

    setLikingTemplateId(templateId)
    try {
      if (isLiked) {
        await templateApi.unlike(templateId)
      } else {
        await templateApi.like(templateId)
      }

      // Update local state
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === templateId
            ? {
                ...t,
                userLiked: !isLiked,
                likesCount: (t.likesCount || 0) + (isLiked ? -1 : 1),
              }
            : t
        )
      )
    } catch (error) {
      console.error("Error toggling like:", error)
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      })
    } finally {
      setLikingTemplateId(null)
    }
  }

  const groupedPlugins = useMemo(() => getPluginsGroupedByCategory(), [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            Select a Template
          </DialogTitle>
          <DialogDescription>
            Choose a template to quickly set up your profile image with pre-configured plugins and settings
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-4">
              {/* Style Filter */}
              <Tabs value={selectedStyle} onValueChange={(v) => setSelectedStyle(v as any)}>
                <TabsList>
                  <TabsTrigger value="all">All Styles</TabsTrigger>
                  <TabsTrigger value="default">Default</TabsTrigger>
                  <TabsTrigger value="terminal">Terminal</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Category Filter */}
              <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)}>
                <TabsList>
                  <TabsTrigger value="all">All Categories</TabsTrigger>
                  <TabsTrigger value="coding">Coding</TabsTrigger>
                  <TabsTrigger value="music">Music</TabsTrigger>
                  <TabsTrigger value="anime">Anime</TabsTrigger>
                  <TabsTrigger value="gaming">Gaming</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No templates found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchQuery || selectedCategory !== "all" || selectedStyle !== "all"
                    ? "Try adjusting your filters"
                    : "Create a template by saving an image configuration"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => {
                  const templatePlugins = getTemplatePlugins(template)

                  return (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:shadow-lg transition-all hover:border-primary"
                      onClick={() => applyTemplate(template)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{template.name}</CardTitle>
                            {template.description && (
                              <CardDescription className="mt-1">{template.description}</CardDescription>
                            )}
                          </div>
                          {template.isPublic && (
                            <Badge variant="secondary" className="ml-2">
                              Public
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Style and Theme */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="capitalize">
                            {template.style}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {template.size}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {template.theme}
                          </Badge>
                        </div>

                        {/* Plugins */}
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Plugins:</p>
                          <div className="flex flex-wrap gap-2">
                            {templatePlugins.map((plugin) => {
                              const IconComponent = plugin.icon
                              return (
                                <TooltipProvider key={plugin.name}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge variant="secondary" className="gap-1.5">
                                        {IconComponent ? (
                                          <IconComponent className="w-3 h-3" />
                                        ) : (
                                          <span className="w-3 h-3">•</span>
                                        )}
                                        {plugin.displayName}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{plugin.category} category</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )
                            })}
                          </div>
                        </div>

                        {/* Like and Apply */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={(e) => handleLike(e, template.id, template.userLiked || false)}
                            disabled={likingTemplateId === template.id}
                          >
                            <Heart
                              className={cn(
                                "w-4 h-4 mr-2",
                                template.userLiked && "fill-red-500 text-red-500"
                              )}
                            />
                            {template.likesCount || 0}
                          </Button>
                          <Button className="flex-1" size="sm">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Apply
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

