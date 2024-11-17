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
} as const

// Função para gerar as cores do terminal baseado no tema
export const getTerminalThemeColors = () => {
  return {
    terminal: {
      DEFAULT: `var(--terminal-color-default)`,
      surface: `var(--terminal-color-surface)`,
      background: `var(--terminal-color-background)`,
      success: `var(--terminal-color-success)`,
      muted: `var(--terminal-color-muted)`,
      "muted-light": `var(--terminal-color-muted-light)`,
      raw: `var(--terminal-color-raw)`,
      highlight: `var(--terminal-color-highlight)`,
    },
  }
}

const getDefaultThemeColors = () => {
  return {
    default: {
      DEFAULT: `var(--default-color-default)`,
      surface: `var(--default-color-surface)`,
      background: `var(--default-color-background)`,
      success: `var(--default-color-success)`,
      muted: `var(--default-color-muted)`,
      "muted-light": `var(--default-color-muted-light)`,
      raw: `var(--default-color-raw)`,
      highlight: `var(--default-color-highlight)`,
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
