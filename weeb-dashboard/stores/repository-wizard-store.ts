import { create } from "zustand"

export interface RepositoryContentConfig {
  repository_card_hide_title?: boolean
  repository_card_title?: string
  show_description?: boolean
  show_language?: boolean
  show_stats?: boolean
  show_license?: boolean
  show_topics?: boolean
  max_topics?: number
}

const DEFAULT_CONTENT_CONFIG: RepositoryContentConfig = {
  show_description: true,
  show_language: true,
  show_stats: true,
  show_license: true,
  show_topics: true,
  max_topics: 6,
}

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

  contentConfig: RepositoryContentConfig

  previewUrl: string | null

  setOwnerRepo: (owner: string, repo: string) => void
  setContentOption: <K extends keyof RepositoryContentConfig>(key: K, value: RepositoryContentConfig[K]) => void
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
  contentConfig: DEFAULT_CONTENT_CONFIG,
  previewUrl: null,
}

export const useRepositoryWizardStore = create<RepositoryWizardState>()((set) => ({
  ...initialState,

  setOwnerRepo: (owner, repo) => set({ owner, repo }),

  setContentOption: (key, value) =>
    set((state) => ({
      contentConfig: { ...state.contentConfig, [key]: value },
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

  reset: () => set({ ...initialState, contentConfig: { ...DEFAULT_CONTENT_CONFIG } }),

  loadFromSvg: (svg) => {
    const repoConfig = svg.pluginsConfig?.github_repo || {}
    set({
      name: svg.name,
      style: (svg.style as "default" | "terminal") || "default",
      size: (svg.size as "half" | "full") || "half",
      theme: svg.theme || "default",
      customCss: svg.customCss || "",
      owner: repoConfig.owner || "",
      repo: repoConfig.repo || "",
      contentConfig: {
        ...DEFAULT_CONTENT_CONFIG,
        ...Object.fromEntries(
          Object.entries(repoConfig).filter(([key]) => key in DEFAULT_CONTENT_CONFIG)
        ),
      },
    })
  },
}))
