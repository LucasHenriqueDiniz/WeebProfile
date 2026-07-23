"use client"

import { useState } from "react"
import { WizardShell } from "./WizardShell"
import { StyleConfiguration } from "./StyleConfiguration"
import { RepositoryConfigPanel } from "./RepositoryConfigPanel"
import { RepositoryLivePreview } from "./RepositoryLivePreview"
import { useRepositoryWizardStore } from "@/stores/repository-wizard-store"
import { useRepositoryWizardController } from "./useRepositoryWizardController"

interface RepositoryWizardProps {
  isEditMode?: boolean
  editSvgId?: string
}

export function RepositoryWizard({ isEditMode = false, editSvgId }: RepositoryWizardProps = {}) {
  const [activeTab, setActiveTab] = useState<"plugins" | "style">("plugins")
  const ctrl = useRepositoryWizardController({ isEditMode, editSvgId })
  const {
    owner,
    repo,
    style,
    size,
    theme,
    hideTerminalEmojis,
    hideTerminalHeader,
    customCss,
    customThemeColors,
    setStyle,
    setSize,
    setTheme,
    setHideTerminalEmojis,
    setHideTerminalHeader,
    setCustomCss,
    setCustomThemeColor,
    resetCustomThemeColors,
  } = useRepositoryWizardStore()

  return (
    <WizardShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      pluginsList={
        <div className="p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">Repository Card</p>
          <p className="text-xs text-muted-foreground">
            A standalone card with stats for a single GitHub repository — separate from your Profile SVGs.
          </p>
        </div>
      }
      pluginDetail={<RepositoryConfigPanel />}
      styleConfig={
        <StyleConfiguration
          style={style}
          size={size}
          theme={theme}
          hideTerminalEmojis={hideTerminalEmojis}
          hideTerminalHeader={hideTerminalHeader}
          customCss={customCss}
          customThemeColors={customThemeColors}
          setStyle={setStyle}
          setSize={setSize}
          setTheme={setTheme}
          setHideTerminalEmojis={setHideTerminalEmojis}
          setHideTerminalHeader={setHideTerminalHeader}
          setCustomCss={setCustomCss}
          setCustomThemeColor={setCustomThemeColor}
          resetCustomThemeColors={resetCustomThemeColors}
        />
      }
      preview={<RepositoryLivePreview />}
      footerProps={{ ...ctrl.footerProps, isEditMode }}
      selectedPlugin={owner && repo ? "github_repo" : null}
      name={owner && repo ? `${owner}/${repo}` : ""}
      size={size}
      setSize={setSize}
      contentCount={owner && repo ? 1 : 0}
    />
  )
}
