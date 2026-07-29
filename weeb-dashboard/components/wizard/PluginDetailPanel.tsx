"use client"

import { Puzzle } from "lucide-react"
import { PluginCard } from "./PluginCard"
import type { PluginWorkspace } from "./usePluginWorkspace"

interface PluginDetailPanelProps {
  workspace: PluginWorkspace
}

// Coluna central - area principal de trabalho. Mostra a configuracao completa do plugin
// selecionado na lista ao lado, ou um placeholder quando nada foi selecionado ainda.
export function PluginDetailPanel({ workspace }: PluginDetailPanelProps) {
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
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/15 to-cyan-500/10">
          <Puzzle className="w-6 h-6 text-primary/70" />
        </span>
        <p className="text-sm font-medium text-foreground mb-1">Selecione um plugin</p>
        <p className="text-xs text-muted-foreground max-w-[220px]">
          Escolha um plugin na lista ao lado para configurar seus campos e seções.
        </p>
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
