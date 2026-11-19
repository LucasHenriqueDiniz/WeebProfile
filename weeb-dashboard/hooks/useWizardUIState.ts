/**
 * The wizard's view state kept across reloads: the drawer's tab and the selected plugin.
 *
 * It also kept the list's search, category and "only enabled" filter, which the plugin
 * strip replaced, and each field was saved on its own, so saving one wrote the others
 * back as empty: the selection was lost whenever the tab changed after it. The wizard
 * calls this hook twice (controller and plugin workspace), so each field merges into what
 * is stored instead of writing the whole state.
 */

import { useEffect, useState } from "react"

export const WIZARD_UI_STATE_KEY = "wizard-ui-state"

export type WizardTab = "plugins" | "order" | "style"

interface WizardUIState {
  activeTab: WizardTab
  selectedPlugin: string | null
}

function load(): WizardUIState {
  const fallback: WizardUIState = { activeTab: "plugins", selectedPlugin: null }
  if (typeof window === "undefined") return fallback
  try {
    const parsed = JSON.parse(localStorage.getItem(WIZARD_UI_STATE_KEY) ?? "{}")
    const activeTab = ["plugins", "order", "style"].includes(parsed.activeTab) ? parsed.activeTab : "plugins"
    const selectedPlugin = typeof parsed.selectedPlugin === "string" ? parsed.selectedPlugin : null
    return { activeTab, selectedPlugin }
  } catch {
    return fallback
  }
}

function save(patch: Partial<WizardUIState>) {
  try {
    const stored = JSON.parse(localStorage.getItem(WIZARD_UI_STATE_KEY) ?? "{}")
    localStorage.setItem(WIZARD_UI_STATE_KEY, JSON.stringify({ ...stored, ...patch }))
  } catch {
    // Storage blocked or unreadable: the view state lasts until the page reloads.
  }
}

export function useWizardUIState() {
  const [initial] = useState(load)
  const [activeTab, setActiveTab] = useState<WizardTab>(initial.activeTab)
  const [selectedPlugin, setSelectedPlugin] = useState<string | null>(initial.selectedPlugin)

  useEffect(() => save({ activeTab }), [activeTab])
  useEffect(() => save({ selectedPlugin }), [selectedPlugin])

  return { activeTab, setActiveTab, selectedPlugin, setSelectedPlugin }
}
