import { TerminalTheme, terminalThemes } from "./terminal-themes"
import plugin from "tailwindcss/plugin"

// Cores base dos plugins
export const pluginThemes = {
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
      surface: selectedTheme.surface,
      background: selectedTheme.background,
      default: selectedTheme.default,
      error: selectedTheme.error,
      success: selectedTheme.success,
      warning: selectedTheme.warning,
      muted: selectedTheme.muted,
      "muted-light": selectedTheme.mutedLight,
      raw: selectedTheme.raw,
      highlight: selectedTheme.highlight,
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
        ...pluginThemes,
        ...getTerminalThemeColors(),
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
