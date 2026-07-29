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
    sections,
    style,
    size,
    theme,
    hideTerminalEmojis,
    hideTerminalHeader,
    fontFamily,
    terminalHeaderText,
    customCss,
    customThemeColors,
    setStyle,
    setSize,
    setTheme,
    setHideTerminalEmojis,
    setHideTerminalHeader,
    setFontFamily,
    setTerminalHeaderText,
    setCustomCss,
    setCustomThemeColor,
    resetCustomThemeColors,
  } = useRepositoryWizardStore()

  return (
    <WizardShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      pluginsList={null}
      pluginDetail={<RepositoryConfigPanel />}
      styleConfig={
        <StyleConfiguration
          style={style}
          size={size}
          theme={theme}
          hideTerminalEmojis={hideTerminalEmojis}
          hideTerminalHeader={hideTerminalHeader}
          fontFamily={fontFamily}
          terminalHeaderText={terminalHeaderText}
          customCss={customCss}
          customThemeColors={customThemeColors}
          setStyle={setStyle}
          setSize={setSize}
          setTheme={setTheme}
          setHideTerminalEmojis={setHideTerminalEmojis}
          setHideTerminalHeader={setHideTerminalHeader}
          setFontFamily={setFontFamily}
          setTerminalHeaderText={setTerminalHeaderText}
          setCustomCss={setCustomCss}
          setCustomThemeColor={setCustomThemeColor}
          resetCustomThemeColors={resetCustomThemeColors}
        />
      }
      preview={<RepositoryLivePreview />}
      footerProps={{ ...ctrl.footerProps, isEditMode }}
      selectedPlugin={owner && repo ? "github_repo" : null}
      name={owner && repo ? `${owner}/${repo}` : ""}
      kind="repository"
      size={size}
      setSize={setSize}
      // Mesma lógica do plugin habilitado em RepositoryLivePreview: o preview usa dado
      // mock (WeebProfile) mesmo sem owner/repo preenchidos, então o frame não deveria
      // ficar escondido atrás do placeholder "habilite um plugin" só por falta de owner/repo.
      contentCount={sections.length > 0 ? 1 : 0}
    />
  )
}
