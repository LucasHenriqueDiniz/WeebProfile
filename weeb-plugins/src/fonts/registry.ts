/**
 * Font Registry
 *
 * Registry of available fonts and their definitions.
 * Used to generate @font-face CSS with local WOFF2 files.
 */

export interface FontDefinition {
  id: string
  family: string
  weight: number
  style: "normal" | "italic"
  file: string // Nome do arquivo
  subfolder: string // Subpasta em assets/ (Poppins ou JetBrainsMono)
}

export const fontRegistry: FontDefinition[] = [
  // Poppins (default style)
  {
    id: "poppins-400",
    family: "Poppins",
    weight: 400,
    style: "normal",
    file: "poppins-v24-latin_latin-ext-regular.woff2",
    subfolder: "Poppins",
  },
  {
    id: "poppins-500",
    family: "Poppins",
    weight: 500,
    style: "normal",
    file: "poppins-v24-latin_latin-ext-500.woff2",
    subfolder: "Poppins",
  },
  {
    id: "poppins-600",
    family: "Poppins",
    weight: 600,
    style: "normal",
    file: "poppins-v24-latin_latin-ext-600.woff2",
    subfolder: "Poppins",
  },
  {
    id: "poppins-700",
    family: "Poppins",
    weight: 700,
    style: "normal",
    file: "poppins-v24-latin_latin-ext-700.woff2",
    subfolder: "Poppins",
  },
  // JetBrains Mono (terminal style)
  {
    id: "jetbrainsmono-400",
    family: "JetBrains Mono",
    weight: 400,
    style: "normal",
    file: "jetbrains-mono-v24-latin_latin-ext-regular.woff2",
    subfolder: "JetBrainsMono",
  },
  {
    id: "jetbrainsmono-600",
    family: "JetBrains Mono",
    weight: 600,
    style: "normal",
    file: "jetbrains-mono-v24-latin_latin-ext-600.woff2",
    subfolder: "JetBrainsMono",
  },
]

/**
 * Get font IDs required for a style
 */
export function getFontsForStyle(styleName: string): string[] {
  if (styleName === "default") {
    return ["poppins-400", "poppins-500", "poppins-600", "poppins-700"]
  }
  if (styleName === "terminal") {
    return ["jetbrainsmono-400", "jetbrainsmono-600"]
  }
  return []
}
