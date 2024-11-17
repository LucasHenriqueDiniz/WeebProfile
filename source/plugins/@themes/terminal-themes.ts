export const terminalThemes = {
  default: {
    surface: "#343434",
    background: "#1c1c1c",
    success: "#c3e88d",
    default: "#ffcb6b",
    muted: "#888",
    mutedLight: "#ccc",
    raw: "#f8f8f2",
    highlight: "#2443ff",
  },
  monokai: {
    surface: "#272822",
    background: "#1d1e19",
    default: "#f8f8f2",
    success: "#a6e22e",
    muted: "#75715e",
    mutedLight: "#a59f85",
    raw: "#f8f8f2",
    highlight: "#66d9ef",
  },
  dracula: {
    surface: "#44475a",
    background: "#282a36",
    default: "#f8f8f2",
    success: "#50fa7b",
    muted: "#6272a4",
    mutedLight: "#bd93f9",
    raw: "#f8f8f2",
    highlight: "#ff79c6",
  },
}

export type TerminalTheme = keyof typeof terminalThemes
