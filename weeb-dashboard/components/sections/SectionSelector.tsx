"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { PLUGINS_METADATA } from "@/lib/weeb-plugins/plugins/metadata"
import { SectionConfigDialog } from "@/components/wizard/SectionConfigDialog"

interface SectionSelectorProps {
  pluginId: string
  selectedSections: string[]
  onSectionsChange: (sections: string[]) => void
  sectionConfigs: Record<string, Record<string, any>>
  onSectionConfigChange: (sectionId: string, config: Record<string, any>) => void
}

export function SectionSelector({
  pluginId,
  selectedSections,
  onSectionsChange,
  sectionConfigs,
  onSectionConfigChange,
}: SectionSelectorProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  
  const pluginMetadata = PLUGINS_METADATA[pluginId as keyof typeof PLUGINS_METADATA]
  if (!pluginMetadata) return null

  const allSections = pluginMetadata.sections || []
  const visibleSections = selectedSections.slice(0, 3)
  const remainingCount = Math.max(0, selectedSections.length - 3)

  const toggleSection = (sectionId: string) => {
    if (selectedSections.includes(sectionId)) {
      onSectionsChange(selectedSections.filter((id) => id !== sectionId))
    } else {
      onSectionsChange([...selectedSections, sectionId])
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Mostrar até 3 seções selecionadas */}
      {visibleSections.map((sectionId) => {
        const section = allSections.find((s) => s.id === sectionId)
        if (!section) return null

        return (
          <div
            key={sectionId}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-primary/10 border border-primary/20 text-xs font-medium"
          >
            <span className="text-foreground">{section.name}</span>
            <SectionConfigDialog
              plugin={pluginId}
              section={section}
              sectionConfig={sectionConfigs[sectionId] || {}}
              onConfigChange={(config) => onSectionConfigChange(sectionId, config)}
            />
          </div>
        )
      })}

      {/* Botão + com quantidade restante */}
      {remainingCount > 0 && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs font-medium"
            >
              <Plus className="w-3 h-3 mr-1" />
              {remainingCount} more
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Select Sections</DialogTitle>
              <DialogDescription>
                Choose which sections to display for {pluginMetadata.displayName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              {allSections.map((section) => {
                const isSelected = selectedSections.includes(section.id)
                return (
                  <div
                    key={section.id}
                    className="flex items-start justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <Checkbox
                        id={`section-${section.id}`}
                        checked={isSelected}
                        onCheckedChange={() => toggleSection(section.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={`section-${section.id}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {section.name}
                        </Label>
                        {section.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {section.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <SectionConfigDialog
                        plugin={pluginId}
                        section={section}
                        sectionConfig={sectionConfigs[section.id] || {}}
                        onConfigChange={(config) => onSectionConfigChange(section.id, config)}
                      />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Se não há seções selecionadas ou menos de 3, mostrar botão para abrir dialog */}
      {selectedSections.length < 3 && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs font-medium"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Sections
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Select Sections</DialogTitle>
              <DialogDescription>
                Choose which sections to display for {pluginMetadata.displayName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              {allSections.map((section) => {
                const isSelected = selectedSections.includes(section.id)
                return (
                  <div
                    key={section.id}
                    className="flex items-start justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <Checkbox
                        id={`section-${section.id}`}
                        checked={isSelected}
                        onCheckedChange={() => toggleSection(section.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={`section-${section.id}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {section.name}
                        </Label>
                        {section.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {section.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <SectionConfigDialog
                        plugin={pluginId}
                        section={section}
                        sectionConfig={sectionConfigs[section.id] || {}}
                        onConfigChange={(config) => onSectionConfigChange(section.id, config)}
                      />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}


