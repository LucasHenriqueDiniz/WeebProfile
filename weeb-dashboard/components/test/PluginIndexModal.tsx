"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, ChevronDown, ChevronUp, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PLUGINS_METADATA, getPluginsGroupedByCategory } from "@/lib/plugin-metadata"

// Plugin category type
type PluginCategory = "coding" | "music" | "anime" | "gaming"

// Tipo inferido do PLUGINS_METADATA
type PluginMetadata = typeof PLUGINS_METADATA[keyof typeof PLUGINS_METADATA]

interface PluginIndexModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddPlugin: (pluginName: string, config: Record<string, any>) => void
  onAddSection: (pluginName: string, sectionId: string) => void
}

export function PluginIndexModal({
  open,
  onOpenChange,
  onAddPlugin,
  onAddSection,
}: PluginIndexModalProps) {
  const [expandedPlugin, setExpandedPlugin] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<PluginCategory | "all">("all")

  function handleAddPlugin(plugin: PluginMetadata) {
    onAddPlugin(plugin.name, plugin.exampleConfig || { enabled: true, sections: [] })
  }

  function handleAddSection(pluginName: string, sectionId: string) {
    onAddSection(pluginName, sectionId)
    // Optional: close modal after adding (commented to allow adding multiple)
    // onOpenChange(false)
  }

  // Convert PLUGINS_METADATA to array with correct types
  const allPlugins: PluginMetadata[] = Object.values(PLUGINS_METADATA)

  // Get plugins grouped by category
  const pluginsByCategory = getPluginsGroupedByCategory() as Record<PluginCategory, string[]>
  const categories = Object.keys(pluginsByCategory) as PluginCategory[]

  const CATEGORY_LABELS: Record<PluginCategory, string> = {
    coding: "💻 Coding",
    music: "🎵 Music",
    anime: "📺 Anime",
    gaming: "🎮 Gaming",
  } as const

  // Filter plugins based on search and category
  const filteredPlugins = useMemo(() => {
    let plugins = allPlugins

    // Filter by category first
    if (selectedCategory !== "all") {
      const categoryPluginNames = pluginsByCategory[selectedCategory]
      plugins = plugins.filter((plugin) => categoryPluginNames.includes(plugin.name))
    }

    // Then filter by search
    if (!searchQuery.trim()) {
      return plugins
    }

    const query = searchQuery.toLowerCase().trim()
    return plugins.filter((plugin) => {
      // Search in plugin name
      if (plugin.name.toLowerCase().includes(query) || 
          plugin.displayName.toLowerCase().includes(query) ||
          plugin.description.toLowerCase().includes(query)) {
        return true
      }

      // Search in sections
      const matchingSections = plugin.sections.filter((section) => {
        return (
          section.id.toLowerCase().includes(query) ||
          section.name.toLowerCase().includes(query) ||
          (section.description && section.description.toLowerCase().includes(query))
        )
      })

      return matchingSections.length > 0
    })
  }, [searchQuery, selectedCategory, allPlugins, pluginsByCategory])

  // Filter sections within each plugin based on search
  const getFilteredSections = (plugin: PluginMetadata) => {
    if (!searchQuery.trim()) {
      return plugin.sections
    }

    const query = searchQuery.toLowerCase().trim()
    return plugin.sections.filter((section) => {
      return (
        section.id.toLowerCase().includes(query) ||
        section.name.toLowerCase().includes(query) ||
        (section.description && section.description.toLowerCase().includes(query))
      )
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col w-[90vw]">
        <DialogHeader>
          <DialogTitle>Índice de Plugins</DialogTitle>
          <DialogDescription>
            Busque e adicione plugins e seções ao seu JSON de configuração
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Barra de busca */}
          <div className="relative flex-shrink-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar plugins ou seções..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filtro por categoria */}
          <div className="flex gap-2 flex-wrap flex-shrink-0">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              Todos
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {CATEGORY_LABELS[category]}
              </Button>
            ))}
          </div>

          {/* Lista de plugins */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {filteredPlugins.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">
                  Nenhum plugin encontrado para "{searchQuery}"
                </p>
              </div>
            ) : (
              filteredPlugins.map((plugin) => {
                const filteredSections = getFilteredSections(plugin)
                const shouldShowPlugin = filteredSections.length > 0 || !searchQuery.trim()

                if (!shouldShowPlugin) {
                  return null
                }

                return (
                  <Card key={plugin.name}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">{plugin.displayName}</CardTitle>
                            <Badge variant="secondary" className="text-xs">
                              {CATEGORY_LABELS[plugin.category as PluginCategory]}
                            </Badge>
                          </div>
                          <CardDescription className="text-xs mt-1">
                            {plugin.description}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddPlugin(plugin)}
                            title={`Adicionar plugin ${plugin.displayName} ao JSON`}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Adicionar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setExpandedPlugin(
                                expandedPlugin === plugin.name ? null : plugin.name
                              )
                            }
                          >
                            {expandedPlugin === plugin.name ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {expandedPlugin === plugin.name && (
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {(plugin.requiredFields.length > 0 ||
                            plugin.essentialConfigKeys.length > 0) && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground mb-1">
                                Campos obrigatórios:
                              </p>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {plugin.requiredFields.map((field: string) => (
                                  <Badge key={field} variant="secondary" className="text-xs">
                                    {field}
                                  </Badge>
                                ))}
                              </div>
                              {plugin.essentialConfigKeys.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground mb-1">
                                    Configurações essenciais (API keys/tokens):
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {plugin.essentialConfigKeys.map((key: string) => (
                                      <Badge key={key} variant="outline" className="text-xs">
                                        {key}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-2">
                              Seções disponíveis ({filteredSections.length}):
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {filteredSections.map(
                                (section: {
                                  id: string
                                  name: string
                                  description?: string
                                  configOptions?: any[]
                                }) => (
                                  <div
                                    key={section.id}
                                    className="flex items-start justify-between p-2 border rounded-md hover:bg-muted/50 transition-colors"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium">{section.name}</p>
                                      {section.description && (
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                          {section.description}
                                        </p>
                                      )}
                                      <code className="text-xs text-muted-foreground mt-1 block">
                                        {section.id}
                                      </code>
                                      {section.configOptions &&
                                        section.configOptions.length > 0 && (
                                          <p className="text-xs text-muted-foreground mt-1">
                                            {section.configOptions.length} opções de configuração
                                          </p>
                                        )}
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="ml-2 h-7 w-7 p-0"
                                      onClick={() => handleAddSection(plugin.name, section.id)}
                                      title={`Adicionar seção ${section.name} ao plugin ${plugin.displayName}`}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

