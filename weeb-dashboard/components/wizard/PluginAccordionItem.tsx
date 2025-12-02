"use client"

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePluginValidationStatus } from "@/hooks/usePluginValidationStatus"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { PLUGINS_DATA, getPluginIcon } from "@/lib/plugins-data"
import { useWizardStore } from "@/stores/wizard-store"
import { AlertCircle, AlertTriangle, CheckCircle2, List, Settings2, XCircle } from "lucide-react"
import { PluginValidation } from "./PluginValidation"
import { SectionCard } from "./SectionCard"
import { SectionConfigDialog } from "./SectionConfigDialog"
import { SectionOrderList } from "./SectionOrderList"

interface PluginAccordionItemProps {
  pluginName: string
  style: "default" | "terminal"
  essentialConfigs?: Record<string, boolean | undefined>
}

export function PluginAccordionItem({ pluginName, style, essentialConfigs = {} }: PluginAccordionItemProps) {
  const {
    plugins,
    setPluginRequiredField,
    setPluginSections,
    setSectionConfig,
  } = useWizardStore()

  const pluginData = PLUGINS_DATA[pluginName as keyof typeof PLUGINS_DATA]
  const pluginConfig = plugins[pluginName]

  if (!pluginData || !pluginConfig) return null

  const validationStatus = usePluginValidationStatus(pluginName, pluginConfig, essentialConfigs)

  // Get missing essential configs for this plugin
  const pluginMetadata = PLUGINS_METADATA[pluginName as keyof typeof PLUGINS_METADATA]
  const missingEssentialConfigs = pluginMetadata?.essentialConfigKeysMetadata?.filter(
    (keyMeta) => !essentialConfigs[keyMeta.key]
  ) || []

  return (
    <AccordionItem value={pluginName}>
      <AccordionTrigger>
        <div className="flex items-center gap-3 w-full">
          {(() => {
            const IconComponent = getPluginIcon(pluginName)
            return IconComponent ? (
              <IconComponent className="w-5 h-5" />
            ) : (
              <span className="text-2xl">{pluginData.icon}</span>
            )
          })()}
          <div className="text-left flex-1">
            <div className="font-semibold flex items-center gap-2">
              {pluginData.name}
              {validationStatus === "ok" && (
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              )}
              {validationStatus === "warning" && (
                <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              )}
              {validationStatus === "error" && (
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {pluginConfig.sections?.length || 0} {pluginConfig.sections?.length === 1 ? "section" : "sections"} selected
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-6 pt-4">
          {/* Missing Essential Configs Alert */}
          {missingEssentialConfigs.length > 0 && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                    Configuração sensível necessária
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    {missingEssentialConfigs.map((keyMeta) => keyMeta.label).join(", ")} {missingEssentialConfigs.length === 1 ? "não está" : "não estão"} configurado{missingEssentialConfigs.length > 1 ? "s" : ""}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 border-yellow-300 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-700 dark:text-yellow-200 dark:hover:bg-yellow-900/20"
                    onClick={(e) => {
                      e.stopPropagation()
                      const event = new CustomEvent("openProfileConfig")
                      window.dispatchEvent(event)
                    }}
                  >
                    <Settings2 className="w-4 h-4 mr-2" />
                    Configurar Agora
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Required Fields Section */}
          {(() => {
            const requiredFields = (pluginMetadata?.requiredFields || []) as string[]
            if (requiredFields.length === 0) return null
            
            return (
              <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                <Label className="text-base font-semibold">Campos Obrigatórios</Label>
                <div className="space-y-3">
                  {requiredFields.map((field) => {
                    const fieldValue = (pluginConfig as any)[field] || ""
                    return (
                      <div key={field} className="space-y-2">
                        <Label htmlFor={`${pluginName}-${field}`} className="text-sm">
                          {field === 'username' ? `${pluginData.name} Username` : field.charAt(0).toUpperCase() + field.slice(1)} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`${pluginName}-${field}`}
                          value={fieldValue}
                          onChange={(e) => setPluginRequiredField(pluginName as any, field, e.target.value)}
                          placeholder={`Seu ${field === 'username' ? 'username' : field} do ${pluginData.name}`}
                          className="font-mono"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}

          {/* Plugin Validation */}
          <PluginValidation
            pluginName={pluginName}
            pluginConfig={pluginConfig}
            essentialConfigs={essentialConfigs as Record<string, string | boolean | undefined>}
          />

          {/* Sections */}
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Seções Disponíveis</ Label>
                <Badge variant="secondary" className="text-xs">
                  {pluginConfig.sections?.length || 0} selecionada{pluginConfig.sections?.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pluginData.sections.map((section) => {
                  const isSelected = pluginConfig.sections?.includes(section.id) || false

                  return (
                    <SectionCard
                      key={section.id}
                      plugin={pluginName}
                      section={section}
                      selected={isSelected}
                      style={style}
                      onToggle={() => {
                        const currentSections = pluginConfig.sections || []
                        let newSections: string[]
                        if (isSelected) {
                          newSections = currentSections.filter((s) => s !== section.id)
                        } else {
                          newSections = [...currentSections, section.id]
                        }
                        setPluginSections(pluginName as any, newSections)
                      }}
                    />
                  )
                })}
              </div>
            </div>

            {/* Section Order */}
            {pluginConfig.sections && pluginConfig.sections.length > 0 && (
              <>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 mb-2">
                      <List className="w-4 h-4" />
                      <Label className="text-base font-semibold">Seções Selecionadas</Label>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {pluginConfig.sections.length > 1
                        ? "Arraste os blocos abaixo para reorganizar a ordem em que as seções aparecerão na imagem gerada"
                        : pluginConfig.sections.length === 1
                        ? "Configure sua seção selecionada abaixo"
                        : "Nenhuma seção selecionada. Selecione seções acima para configurá-las."}
                    </p>
                    {pluginConfig.sections.length > 1 ? (
                      <SectionOrderList
                        sections={pluginConfig.sections}
                        plugin={pluginName}
                        availableSections={[...pluginData.sections]}
                        pluginConfig={pluginConfig}
                        onReorder={(newOrder) => {
                          setPluginSections(pluginName as any, newOrder)
                        }}
                        onSectionConfigChange={(sectionId, config) => {
                          setSectionConfig(pluginName as any, sectionId, config)
                        }}
                      />
                    ) : (
                      <div className="space-y-3">
                        {pluginConfig.sections.map((sectionId: string) => {
                          const section = pluginData.sections.find((s) => s.id === sectionId)
                          if (!section) return null
                          
                          const sectionConfig = pluginConfig.sectionConfigs?.[sectionId] ?? {}

                          return (
                            <div
                              key={sectionId}
                              className="flex items-center justify-between p-4 border rounded-lg bg-background hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Badge variant="default" className="text-sm">{section.name}</Badge>
                                {section.description && (
                                  <p className="text-sm text-muted-foreground">{section.description}</p>
                                )}
                              </div>
                              <SectionConfigDialog
                                plugin={pluginName}
                                section={section}
                                sectionConfig={sectionConfig}
                                onConfigChange={(config) => {
                                  setSectionConfig(pluginName as any, sectionId, config)
                                }}
                              />
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

