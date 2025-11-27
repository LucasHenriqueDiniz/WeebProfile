"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ChevronDown, ChevronUp } from "lucide-react"
import { PLUGINS_METADATA } from "@/lib/plugin-metadata"

// Tipo inferido do PLUGINS_METADATA
type PluginMetadata = typeof PLUGINS_METADATA[keyof typeof PLUGINS_METADATA]

interface PluginIndexProps {
  onAddPlugin: (pluginName: string, config: Record<string, any>) => void
  onAddSection: (pluginName: string, sectionId: string) => void
}

export function PluginIndex({ onAddPlugin, onAddSection }: PluginIndexProps) {
  const [expandedPlugin, setExpandedPlugin] = useState<string | null>(null)

  function handleAddPlugin(plugin: PluginMetadata) {
    onAddPlugin(plugin.name, plugin.exampleConfig || { enabled: true, sections: [] })
  }

  function handleAddSection(pluginName: string, sectionId: string) {
    onAddSection(pluginName, sectionId)
  }

  // Converter PLUGINS_METADATA para array com tipos corretos
  const plugins: PluginMetadata[] = Object.values(PLUGINS_METADATA)

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Índice de Plugins</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Clique em um plugin para ver suas seções e adicionar rapidamente ao JSON
        </p>
      </div>

      <div className="space-y-3">
        {plugins.map((plugin) => (
          <Card key={plugin.name}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base">{plugin.displayName}</CardTitle>
                  <CardDescription className="text-xs mt-1">{plugin.description}</CardDescription>
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
                      setExpandedPlugin(expandedPlugin === plugin.name ? null : plugin.name)
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
                  {(plugin.requiredFields.length > 0 || plugin.essentialConfigKeys.length > 0) && (
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
                      Seções disponíveis ({plugin.sections.length}):
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {plugin.sections.map((section: { id: string; name: string; description?: string; configOptions?: any[] }) => (
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
                            {section.configOptions && section.configOptions.length > 0 && (
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
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

