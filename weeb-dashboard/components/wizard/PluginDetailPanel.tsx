"use client"

import { Puzzle } from "lucide-react"
import { useTranslations } from "@/i18n/use-translations"
import { TILE } from "@/components/landing/sticker"
import { cn } from "@/lib/utils"
import { PluginCard } from "./PluginCard"
import type { PluginWorkspace } from "./usePluginWorkspace"

interface PluginDetailPanelProps {
  workspace: PluginWorkspace
}

// Coluna central - area principal de trabalho. Mostra a configuracao completa do plugin
// selecionado na lista ao lado, ou um placeholder quando nada foi selecionado ainda.
export function PluginDetailPanel({ workspace }: PluginDetailPanelProps) {
  const t = useTranslations("wizard.plugins")
  const {
    plugins,
    selectedPlugin,
    selectedPluginEntry,
    unlockedConfigs,
    savingConfigs,
    savedConfigs,
    essentialConfigs,
    secretsPresence,
    style,
    missingConfigs,
    togglePlugin,
    toggleSection,
    handleEssentialConfigChange,
    handleEssentialConfigSave,
    handleUnlockConfig,
    setPluginRequiredField,
    setSectionConfig,
    setPluginSections,
  } = workspace

  if (!selectedPlugin || !selectedPluginEntry) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
        <span className={cn(TILE, "mb-4 h-14 w-14 bg-cyan-300")}>
          <Puzzle className="h-6 w-6" />
        </span>
        <p className="text-sm font-medium text-foreground mb-1">{t("selectTitle")}</p>
        <p className="text-xs text-muted-foreground max-w-[220px]">{t("selectHint")}</p>
      </div>
    )
  }

  const state = plugins[selectedPlugin]
  if (!state) return null

  return (
    <div className="p-4 lg:p-5" key={selectedPlugin}>
      <PluginCard
        plugin={selectedPluginEntry}
        state={state}
        unlockedConfigs={unlockedConfigs}
        savingConfigs={savingConfigs}
        savedConfigs={savedConfigs}
        essentialConfigs={essentialConfigs}
        secretsPresence={secretsPresence}
        style={style}
        missingConfigs={missingConfigs}
        onTogglePlugin={togglePlugin}
        onToggleSection={toggleSection}
        onEssentialConfigChange={handleEssentialConfigChange}
        onEssentialConfigSave={handleEssentialConfigSave}
        onUnlockConfig={handleUnlockConfig}
        onSetPluginRequiredField={setPluginRequiredField}
        onSetSectionConfig={setSectionConfig}
        onSetPluginSections={setPluginSections}
      />
    </div>
  )
}
