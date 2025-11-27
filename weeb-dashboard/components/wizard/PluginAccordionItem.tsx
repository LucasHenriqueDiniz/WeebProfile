"use client"

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePluginValidationStatus } from "@/hooks/usePluginValidationStatus"
import { PLUGINS_METADATA } from "@/lib/plugin-metadata"
import { PLUGINS_DATA, getPluginIcon } from "@/lib/plugins-data"
import { useWizardStore } from "@/stores/wizard-store"
import { AlertCircle, AlertTriangle, CheckCircle2, List, Settings2, XCircle } from "lucide-react"
import { PluginValidation } from "./PluginValidation"
import { SectionCard } from "./SectionCard"
import { SectionConfigDialog } from "./SectionConfigDialog"
import { SectionOrderList } from "./SectionOrderList"

interface PluginAccordionItemProps {
  pluginName: string
  style: string
  essentialConfigs?: Record<string, boolean | undefined>
}

export function PluginAccordionItem({ pluginName, style, essentialConfigs = {} }: PluginAccordionItemProps) {
  const {
    plugins,
    setPluginUsername,
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
        <div className="space-y-4 pt-4">
          {/* Missing Essential Configs Alert */}
          {missingEssentialConfigs.length > 0 && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Essential configuration required
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    {missingEssentialConfigs.map((keyMeta) => keyMeta.label).join(", ")} {missingEssentialConfigs.length === 1 ? "is" : "are"} not configured
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Open profile config modal - this will be handled by parent
                      const event = new CustomEvent("openProfileConfig")
                      window.dispatchEvent(event)
                    }}
                  >
                    <Settings2 className="w-3 h-3 mr-2" />
                    Configure Now
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Username - Only show if plugin requires it */}
          {(() => {
            const requiredFields = pluginMetadata?.requiredFields || []
            const requiresUsername = Array.isArray(requiredFields) && requiredFields.includes('username')
            
            if (!requiresUsername) return null
            
            return (
              <div className="space-y-2">
                <Label htmlFor={`${pluginName}-username`}>
                  {pluginData.name} Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`${pluginName}-username`}
                  value={pluginConfig.username || ""}
                  onChange={(e) => setPluginUsername(pluginName as any, e.target.value)}
                  placeholder={`Your ${pluginData.name} username`}
                  className="font-mono"
                />
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
              <Label>Available Sections</Label>
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
                <Separator className="my-4" />
                <div className="space-y-3">
                  <div>
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <List className="w-4 h-4" />
                      Selected Sections
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                      {pluginConfig.sections.length > 1
                        ? "Drag the blocks below to reorganize the order in which sections will appear in the generated image"
                        : "Configure your selected sections"}
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
                      <div className="space-y-2">
                        {pluginConfig.sections.map((sectionId: string) => {
                          const section = pluginData.sections.find((s) => s.id === sectionId)
                          if (!section) return null
                          
                          const sectionConfig = pluginConfig.sectionConfigs?.[sectionId] ?? {}

                          return (
                            <div
                              key={sectionId}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{section.name}</Badge>
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

