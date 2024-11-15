import { DefaultTheme, defaultThemes } from "./default-themes"
import { TerminalTheme, terminalThemes } from "./terminal-themes"
import plugin from "tailwindcss/plugin"

// Cores base dos plugins
export const pluginColors = {
  mal: {
    watching: "var(--color-watching)",
    reading: "var(--color-reading)",
    completed: "var(--color-completed)",
    "on-hold": "var(--color-onhold)",
    dropped: "var(--color-dropped)",
    "plan-to-watch": "var(--color-plan-to-watch)",
    "plan-to-read": "var(--color-plan-to-read)",
  },
  languages: {
    python: "var(--color-python)",
    javascript: "var(--color-javascript)",
    typescript: "var(--color-typescript)",
    html: "var(--color-html)",
    css: "var(--color-css)",
    bash: "var(--color-bash)",
    c: "var(--color-c)",
    cpp: "var(--color-cpp)",
    java: "var(--color-java)",
    swift: "var(--color-swift)",
    go: "var(--color-go)",
    rust: "var(--color-rust)",
    kotlin: "var(--color-kotlin)",
    php: "var(--color-php)",
    ruby: "var(--color-ruby)",
    sql: "var(--color-sql)",
  },
} as const

// Função para gerar as cores do terminal baseado no tema
export const getTerminalThemeColors = (theme: TerminalTheme = "default") => {
  const selectedTheme = terminalThemes[theme]
  return {
    terminal: {
      DEFAULT: selectedTheme.default, // Default color
      surface: selectedTheme.surface, // Front background color
      background: selectedTheme.background, // Back background color
      success: selectedTheme.success, // Text success color
      muted: selectedTheme.muted, // Text muted color
      "muted-light": selectedTheme.mutedLight, // Text muted light color
      raw: selectedTheme.raw, // Text raw color
      highlight: selectedTheme.highlight, // highlight color
    },
  }
}

const getDefaultThemeColors = (theme: DefaultTheme = "default") => {
  const selectedTheme = defaultThemes[theme]

  return {
    default: {
      DEFAULT: selectedTheme.default, // Default color
      surface: selectedTheme.surface, // Front background color
      background: selectedTheme.background, // Back background color
      success: selectedTheme.success, // Text success color
      muted: selectedTheme.muted, // Text muted color
      "muted-light": selectedTheme.mutedLight, // Text muted light color
      raw: selectedTheme.raw, // Text raw color
      highlight: selectedTheme.highlight, // Highlight color
    },
  }
}

// Plugins do Tailwind
export const sizeVariants = [
  plugin(function ({ addVariant }) {
    addVariant("half-mode", ["#svg-main.half &"])
    addVariant("full-mode", ["#svg-main.full &"])
  }),
]

// Configuração base do Tailwind
export const tailwindConfig = {
  content: ["../source/**/*.{ts,tsx,css}"],
  theme: {
    extend: {
      colors: {
        ...pluginColors,
        ...getTerminalThemeColors(),
        ...getDefaultThemeColors(),
      },
      aspectRatio: {
        "anime-cover": "70/105",
        character: "65/100",
        update: "40/56",
      },
      gridTemplateColumns: {
        5: "repeat(5, minmax(0, 1fr))",
        10: "repeat(10, minmax(0, 1fr))",
      },
    },
  },
  plugins: sizeVariants,
}

export default tailwindConfig
