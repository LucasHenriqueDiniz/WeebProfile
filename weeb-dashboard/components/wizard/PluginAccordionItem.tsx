"use client"

import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { getPluginIcon } from "@/lib/plugins-data"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { useWizardStore } from "@/stores/wizard-store"
import { SectionSelector } from "@/components/sections/SectionSelector"

interface PluginAccordionItemProps {
  pluginName: string
  style: string
  essentialConfigs?: Record<string, boolean | undefined>
}

export function PluginAccordionItem({
  pluginName,
  style,
  essentialConfigs,
}: PluginAccordionItemProps) {
  const { plugins, setPluginSections, setSectionConfig } = useWizardStore()
  const pluginConfig = plugins[pluginName]
  const metadata = PLUGINS_METADATA[pluginName as keyof typeof PLUGINS_METADATA]
  const Icon = getPluginIcon(pluginName)

  if (!metadata || !pluginConfig) {
    return null
  }

  const selectedSections = pluginConfig.sections || []
  const sectionConfigs = pluginConfig.sectionConfigs || {}

  const handleSectionsChange = (sections: string[]) => {
    setPluginSections(pluginName, sections)
  }

  const handleSectionConfigChange = (sectionId: string, config: Record<string, any>) => {
    setSectionConfig(pluginName, sectionId, config)
  }

  return (
    <AccordionItem value={pluginName} className="border rounded-lg px-4 mb-2">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3 flex-1 text-left">
          {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{metadata.displayName}</span>
              {selectedSections.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {selectedSections.length} section{selectedSections.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{metadata.description}</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4 pb-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-3">Select Sections</h4>
            <SectionSelector
              pluginId={pluginName}
              selectedSections={selectedSections}
              onSectionsChange={handleSectionsChange}
              sectionConfigs={sectionConfigs}
              onSectionConfigChange={handleSectionConfigChange}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

