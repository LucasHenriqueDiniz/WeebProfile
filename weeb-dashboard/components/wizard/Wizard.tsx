"use client"

import { LivePreview } from "./LivePreview"
import { PluginListPanel } from "./PluginListPanel"
import { PluginDetailPanel } from "./PluginDetailPanel"
import { PluginWorkspaceDialogs } from "./PluginWorkspaceDialogs"
import { StyleConfiguration } from "./StyleConfiguration"
import { WizardShell } from "./WizardShell"
import { usePluginWorkspace } from "./usePluginWorkspace"
import { useWizardController } from "./useWizardController"
import { useWizardStore } from "@/stores/wizard-store"
import { selectPluginsWithSections } from "@/stores/wizard-selectors"

interface WizardProps {
  isEditMode?: boolean
  editSvgId?: string
}

export function Wizard({ isEditMode = false, editSvgId }: WizardProps = {}) {
  const ctrl = useWizardController({ isEditMode, editSvgId })
  const workspace = usePluginWorkspace()
  const {
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
    plugins,
    pluginsOrder,
    name,
  } = useWizardStore()
  const pluginsWithSections = selectPluginsWithSections({ plugins, pluginsOrder })

  return (
    <>
      <WizardShell
        activeTab={ctrl.activeTab}
        onTabChange={ctrl.setActiveTab}
        pluginsList={<PluginListPanel workspace={workspace} />}
        pluginDetail={<PluginDetailPanel workspace={workspace} />}
        styleConfig={
          <StyleConfiguration
            style={style}
            size={size}
            theme={theme ?? "default"}
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
        preview={<LivePreview />}
        footerProps={{ ...ctrl.footerProps, isEditMode }}
        selectedPlugin={workspace.selectedPlugin}
        name={name}
        kind="profile"
        size={size}
        setSize={setSize}
        contentCount={pluginsWithSections.length}
      />
      <PluginWorkspaceDialogs workspace={workspace} />
    </>
  )
}
