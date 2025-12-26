"use client"

import { LivePreview } from "./LivePreview"
import { PluginConfiguration } from "./PluginConfiguration"
import { StyleConfiguration } from "./StyleConfiguration"
import { WizardShell } from "./WizardShell"
import { WizardTabs } from "./WizardTabs"
import { WizardFooter } from "./WizardFooter"
import { useWizardController } from "./useWizardController"

interface WizardProps {
  isEditMode?: boolean
  editSvgId?: string
}

export function Wizard({ isEditMode = false, editSvgId }: WizardProps = {}) {
  const ctrl = useWizardController({ isEditMode, editSvgId })

  return (
    <WizardShell stats={ctrl.stats} preview={<LivePreview />} footer={<WizardFooter {...ctrl.footerProps} />}>
      <WizardTabs activeTab={ctrl.activeTab} onTabChange={ctrl.setActiveTab}>
        <WizardTabs.Plugins>
          <PluginConfiguration />
        </WizardTabs.Plugins>
        <WizardTabs.Style>
          <StyleConfiguration />
        </WizardTabs.Style>
      </WizardTabs>
    </WizardShell>
  )
}