"use client"

import { LivePreview } from "./LivePreview"
import { PluginListPanel } from "./PluginListPanel"
import { PluginDetailPanel } from "./PluginDetailPanel"
import { PluginWorkspaceDialogs } from "./PluginWorkspaceDialogs"
import { StyleConfiguration } from "./StyleConfiguration"
import { WizardShell } from "./WizardShell"
import { usePluginWorkspace } from "./usePluginWorkspace"
import { useWizardController } from "./useWizardController"

interface WizardProps {
  isEditMode?: boolean
  editSvgId?: string
}

export function Wizard({ isEditMode = false, editSvgId }: WizardProps = {}) {
  const ctrl = useWizardController({ isEditMode, editSvgId })
  const workspace = usePluginWorkspace()

  return (
    <>
      <WizardShell
        activeTab={ctrl.activeTab}
        onTabChange={ctrl.setActiveTab}
        pluginsList={<PluginListPanel workspace={workspace} />}
        pluginDetail={<PluginDetailPanel workspace={workspace} />}
        styleConfig={<StyleConfiguration />}
        preview={<LivePreview />}
        footerProps={{ ...ctrl.footerProps, isEditMode }}
        selectedPlugin={workspace.selectedPlugin}
      />
      <PluginWorkspaceDialogs workspace={workspace} />
    </>
  )
}
