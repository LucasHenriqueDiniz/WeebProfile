import { create } from "zustand"

const DEFAULT_SECTIONS = ["banner", "insights"]

export interface RepositoryWizardState {
  name: string
  owner: string
  repo: string
  artifactType: "repository_card"

  // Style — mirrors wizard-store's generic style slice so StyleConfiguration can be reused as-is.
  style: "default" | "terminal"
  size: "half" | "full"
  theme: string
  hideTerminalEmojis: boolean
  hideTerminalHeader: boolean
  hideTerminalCommand: boolean
  customCss: string
  customThemeColors: Record<string, string>

  // Seções ativas (banner/insights) e as opções de cada uma - mesmo formato
  // "sections + sectionConfigs" usado pelo wizard-store genérico, pra reaproveitar
  // PreviewRenderer/flattenSectionConfigs e o SectionConfigDialog sem adaptação.
  sections: string[]
  sectionConfigs: Record<string, Record<string, any>>

  previewUrl: string | null

  setOwnerRepo: (owner: string, repo: string) => void
  toggleSection: (sectionId: string) => void
  setSectionConfig: (sectionId: string, config: Record<string, any>) => void
  setStyle: (style: "default" | "terminal") => void
  setSize: (size: "half" | "full") => void
  setTheme: (theme: string) => void
  setCustomCss: (css: string) => void
  setHideTerminalEmojis: (hide: boolean) => void
  setHideTerminalHeader: (hide: boolean) => void
  setCustomThemeColor: (variable: string, color: string) => void
  resetCustomThemeColors: () => void
  setPreviewUrl: (url: string | null) => void
  reset: () => void
  loadFromSvg: (svg: {
    name: string
    style: string
    size: string
    theme: string | null
    customCss: string | null
    pluginsConfig: Record<string, any>
  }) => void
}

const initialState = {
  name: "",
  owner: "",
  repo: "",
  artifactType: "repository_card" as const,
  style: "default" as const,
  size: "half" as const,
  theme: "default",
  hideTerminalEmojis: false,
  hideTerminalHeader: false,
  hideTerminalCommand: false,
  customCss: "",
  customThemeColors: {},
  sections: [...DEFAULT_SECTIONS],
  sectionConfigs: {},
  previewUrl: null,
}

export const useRepositoryWizardStore = create<RepositoryWizardState>()((set) => ({
  ...initialState,

  setOwnerRepo: (owner, repo) => set({ owner, repo }),

  toggleSection: (sectionId) =>
    set((state) => ({
      sections: state.sections.includes(sectionId)
        ? state.sections.filter((id) => id !== sectionId)
        : [...state.sections, sectionId],
    })),

  setSectionConfig: (sectionId, config) =>
    set((state) => ({
      sectionConfigs: { ...state.sectionConfigs, [sectionId]: config },
    })),

  setStyle: (style) => set({ style }),
  setSize: (size) => set({ size }),
  setTheme: (theme) => set({ theme }),
  setCustomCss: (css) => set({ customCss: css }),
  setHideTerminalEmojis: (hide) => set({ hideTerminalEmojis: hide }),
  setHideTerminalHeader: (hide) => set({ hideTerminalHeader: hide }),
  setCustomThemeColor: (variable, color) =>
    set((state) => ({ customThemeColors: { ...state.customThemeColors, [variable]: color } })),
  resetCustomThemeColors: () => set({ customThemeColors: {} }),
  setPreviewUrl: (url) => set({ previewUrl: url }),

  reset: () => set({ ...initialState, customThemeColors: {}, sections: [...DEFAULT_SECTIONS], sectionConfigs: {} }),

  loadFromSvg: (svg) => {
    const repoConfig = svg.pluginsConfig?.github_repo || {}
    const loadedSections = Array.isArray(repoConfig.sections) ? repoConfig.sections : []
    set({
      name: svg.name,
      style: (svg.style as "default" | "terminal") || "default",
      size: (svg.size as "half" | "full") || "half",
      theme: svg.theme || "default",
      customCss: svg.customCss || "",
      owner: repoConfig.owner || "",
      repo: repoConfig.repo || "",
      sections: loadedSections.length > 0 ? loadedSections : [...DEFAULT_SECTIONS],
      sectionConfigs: repoConfig.sectionConfigs || {},
    })
  },
}))
