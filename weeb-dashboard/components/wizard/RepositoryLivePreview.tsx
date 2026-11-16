"use client"

import React from "react"
import { useRepositoryWizardStore } from "@/stores/repository-wizard-store"
import { PreviewRenderer } from "@/components/preview/PreviewRenderer"
import { ColorVariantsPreview } from "@/components/preview/ColorVariantsPreview"
import { useShallow } from "zustand/react/shallow"

export function RepositoryLivePreview() {
  const {
    owner,
    repo,
    style,
    size,
    theme,
    hideTerminalEmojis,
    hideTerminalHeader,
    fontFamily,
    terminalHeaderText,
    customCss,
    customThemeColors,
    colorMode,
    sections,
    sectionConfigs,
  } = useRepositoryWizardStore(
    useShallow((state) => ({
      owner: state.owner,
      repo: state.repo,
      style: state.style,
      size: state.size,
      theme: state.theme,
      hideTerminalEmojis: state.hideTerminalEmojis,
      hideTerminalHeader: state.hideTerminalHeader,
      fontFamily: state.fontFamily,
      terminalHeaderText: state.terminalHeaderText,
      customCss: state.customCss,
      customThemeColors: state.customThemeColors,
      colorMode: state.colorMode,
      sections: state.sections,
      sectionConfigs: state.sectionConfigs,
    }))
  )

  const previewWidth = size === "half" ? 415 : 830

  // O preview do wizard sempre usa dados mock (ver useMockPluginData - dev=true para
  // todos os plugins), então mesmo sem owner/repo preenchidos dá pra mostrar o exemplo
  // (o próprio WeebProfile, hardcoded em mock-data.ts) em vez de ficar em branco.
  // O dado real do repositório do usuário só entra na geração de verdade (com PAT).
  const plugins = React.useMemo(
    () => ({
      github_repo: {
        enabled: sections.length > 0,
        sections,
        owner,
        repo,
        sectionConfigs,
      },
    }),
    [owner, repo, sections, sectionConfigs]
  )

  return (
    <div className="flex flex-col items-center justify-start" style={{ width: `${previewWidth}px` }}>
      <div className="flex-shrink-0 w-full" style={{ width: `${previewWidth}px` }}>
        <ColorVariantsPreview colorMode={colorMode}>
          {(variant) => (
            <PreviewRenderer
              key={variant ?? "fixed"}
              plugins={plugins}
              pluginsOrder={["github_repo"]}
              style={style}
              size={size}
              theme={theme}
              hideTerminalEmojis={hideTerminalEmojis}
              hideTerminalHeader={hideTerminalHeader}
              fontFamily={fontFamily}
              terminalHeaderText={terminalHeaderText}
              customCss={customCss}
              customThemeColors={theme === "custom" ? customThemeColors : undefined}
              colorMode={colorMode}
              colorVariant={variant}
            />
          )}
        </ColorVariantsPreview>
      </div>
    </div>
  )
}
