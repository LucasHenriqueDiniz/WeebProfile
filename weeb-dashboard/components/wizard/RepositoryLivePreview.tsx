"use client"

import React from "react"
import { useRepositoryWizardStore } from "@/stores/repository-wizard-store"
import { PreviewRenderer } from "@/components/preview/PreviewRenderer"
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
    customCss,
    customThemeColors,
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
      customCss: state.customCss,
      customThemeColors: state.customThemeColors,
      sections: state.sections,
      sectionConfigs: state.sectionConfigs,
    }))
  )

  const previewWidth = size === "half" ? 415 : 830

  const plugins = React.useMemo(
    () => ({
      github_repo: {
        enabled: !!(owner && repo),
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
        <PreviewRenderer
          plugins={plugins}
          pluginsOrder={["github_repo"]}
          style={style}
          size={size}
          theme={theme}
          hideTerminalEmojis={hideTerminalEmojis}
          hideTerminalHeader={hideTerminalHeader}
          customCss={customCss}
          customThemeColors={theme === "custom" ? customThemeColors : undefined}
        />
      </div>
    </div>
  )
}
