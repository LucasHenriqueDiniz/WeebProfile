export const defaultThemes = {
  default: {
    surface: "#ffffff",
    background: "#ffffff",
    default: "#a2a2a2",
    success: "#2da44e",
    muted: "#6e7781",
    mutedLight: "#8c959f",
    raw: "#24292f",
    highlight: "#FF7A3D",
  },
  defaultPurple: {
    surface: "#ffffff",
    background: "#ffffff",
    default: "#24292f",
    success: "#2da44e",
    muted: "#6e7781",
    mutedLight: "#8c959f",
    raw: "#24292f",
    highlight: "#8957E5",
  },
  defaultPink: {
    surface: "#ffffff",
    background: "#ffffff",
    default: "#24292f",
    success: "#2da44e",
    muted: "#6e7781",
    mutedLight: "#8c959f",
    raw: "#24292f",
    highlight: "#E5579A",
  },
}

export type DefaultTheme = keyof typeof defaultThemes
