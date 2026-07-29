import { create } from "zustand"

// O Repository é um item único (Banner OU Stats OU Star Graph OU Technologies OU
// Topics OU Overview) - nunca uma pilha de seções como o Profile. "sections" continua
// sendo um array só pra reaproveitar PreviewRenderer/flattenSectionConfigs sem
// adaptação, mas o wizard nunca deixa ele ter mais de 1 item.
const DEFAULT_SECTION = "banner"

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
  // Substitui a seção ativa (nunca adiciona/acumula) - o Repository é sempre um item só.
  selectSection: (sectionId: string) => void
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
  // Default largura completa - o Repository não é mais uma pilha de seções que
  // se beneficia de "meia largura"; é um item único, então full é o normal, e
  // meia largura vira a opção pra quem quiser.
  size: "full" as const,
  theme: "default",
  hideTerminalEmojis: false,
  // Header do terminal escondido por padrao (mesma decisao do wizard de perfil).
  hideTerminalHeader: true,
  hideTerminalCommand: false,
  customCss: "",
  customThemeColors: {},
  sections: [DEFAULT_SECTION],
  sectionConfigs: {},
  previewUrl: null,
}

export const useRepositoryWizardStore = create<RepositoryWizardState>()((set) => ({
  ...initialState,

  setOwnerRepo: (owner, repo) => set({ owner, repo }),

  selectSection: (sectionId) => set({ sections: [sectionId] }),

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

  reset: () => set({ ...initialState, customThemeColors: {}, sections: [DEFAULT_SECTION], sectionConfigs: {} }),

  loadFromSvg: (svg) => {
    const repoConfig = svg.pluginsConfig?.github_repo || {}
    const loadedSections = Array.isArray(repoConfig.sections) ? repoConfig.sections : []
    // Configs antigas podem ter mais de uma seção salva (de quando o Repository ainda
    // empilhava seções) - normaliza pra só a primeira, já que agora é sempre um item só.
    const section = loadedSections[0] || DEFAULT_SECTION
    set({
      name: svg.name,
      style: (svg.style as "default" | "terminal") || "default",
      size: (svg.size as "half" | "full") || "full",
      theme: svg.theme || "default",
      customCss: svg.customCss || "",
      owner: repoConfig.owner || "",
      repo: repoConfig.repo || "",
      sections: [section],
      sectionConfigs: repoConfig.sectionConfigs || {},
    })
  },
}))
