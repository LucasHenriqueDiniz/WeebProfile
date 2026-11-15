/**
 * Theme Utilities - Simplified
 *
 * Returns CSS variables based on theme name.
 * All themes are just CSS variable overrides.
 */

import {
  defaultDarkThemes,
  defaultThemes,
  terminalLightThemes,
  terminalThemes,
  type ThemeVariables,
  type TerminalThemeVariables,
} from "./themes"
import type { DefaultTheme, TerminalTheme } from "./types"

/**
 * Get terminal theme variables
 */
export const getTerminalThemeVariables = (theme: TerminalTheme | string): TerminalThemeVariables => {
  const validTheme = (theme in terminalThemes ? theme : "default") as TerminalTheme
  const selectedTheme = terminalThemes[validTheme]

  // Always return a valid theme - default theme is guaranteed to exist in terminalThemes
  // Using non-null assertion because 'default' theme is always defined in terminalThemes
  return selectedTheme ?? (terminalThemes["default"] as TerminalThemeVariables)
}

// Map theme names (purple -> purple, defaultPurple -> purple, etc)
const DEFAULT_THEME_NAMES: Record<string, string> = {
  default: "default",
  defaultPurple: "purple",
  defaultPink: "pink",
  defaultCyan: "cyan",
  defaultOrange: "orange",
  defaultBlue: "blue",
  defaultGreen: "green",
  defaultRed: "red",
  defaultCustom: "custom",
  purple: "purple",
  pink: "pink",
  cyan: "cyan",
  orange: "orange",
  blue: "blue",
  green: "green",
  red: "red",
  custom: "custom",
}

const resolveDefaultThemeName = (theme: string): string => DEFAULT_THEME_NAMES[theme] || "default"

/**
 * Get default theme variables
 *
 * @param theme - Theme name (default, purple, pink, cyan, orange, blue, green, red, or custom)
 * @param customColors - Custom CSS variables to override (only used when theme === 'custom')
 * @param primaryColor - Legacy: primary color override (maps to --default-color-highlight)
 */
export const getDefaultThemeVariables = (
  theme: DefaultTheme | string,
  customColors?: Record<string, string>,
  primaryColor?: string
): ThemeVariables => {
  const mappedTheme = resolveDefaultThemeName(theme)

  // Get base theme variables - default theme is guaranteed to exist
  // Using non-null assertion because 'default' theme is always defined in defaultThemes
  const baseTheme = defaultThemes[mappedTheme] ?? (defaultThemes["default"] as ThemeVariables)
  let themeVariables: ThemeVariables = { ...baseTheme }

  // If custom theme, apply custom colors
  if (mappedTheme === "custom" && customColors) {
    // Filter out undefined values from customColors
    const validCustomColors: Record<string, string> = {}
    for (const [key, value] of Object.entries(customColors)) {
      if (value && typeof value === "string") {
        validCustomColors[key] = value
      }
    }
    themeVariables = {
      ...themeVariables,
      ...validCustomColors,
    }
  }

  // Legacy: primaryColor overrides --default-color-highlight
  if (primaryColor && typeof primaryColor === "string") {
    themeVariables["--default-color-highlight"] = primaryColor
  }

  return themeVariables
}

/**
 * Color mode of a card. "fixed" is the theme as it always was: the default style is
 * light and the terminal style is dark. "auto" ships both palettes in one SVG and lets
 * `prefers-color-scheme` pick, which inside an <img> follows the color-scheme of the
 * page that embeds it (GitHub sets `color-scheme: dark` on its dark themes).
 */
export type ColorMode = "fixed" | "auto"
export type ColorVariant = "light" | "dark"

export const isAutoColorMode = (value: unknown): boolean => value === "auto"

/** The variant a style draws in fixed mode. */
const nativeVariant = (style: "default" | "terminal"): ColorVariant => (style === "terminal" ? "dark" : "light")

/**
 * Theme variables for one variant of a theme.
 *
 * The native variant (light for default, dark for terminal) is exactly what fixed
 * mode draws. The other one is the theme's counterpart palette.
 *
 * customThemeColors rule: custom colors are the light variant of the custom theme.
 * The dark variant keeps only the custom accent (`--default-color-highlight`), on top
 * of the dark palette -- a custom white surface or dark text would undo the dark mode.
 */
export const getThemeVariantVariables = (
  style: "default" | "terminal",
  theme: string,
  variant: ColorVariant,
  customColors?: Record<string, string>
): Record<string, string> => {
  if (style === "terminal") {
    if (variant === nativeVariant(style)) return getTerminalThemeVariables(theme)
    const name = theme in terminalLightThemes ? theme : "default"
    return { ...(terminalLightThemes[name] ?? (terminalLightThemes["default"] as TerminalThemeVariables)) }
  }

  if (variant === nativeVariant(style)) return getDefaultThemeVariables(theme, customColors)

  const name = resolveDefaultThemeName(theme)
  const dark: Record<string, string> = {
    ...(defaultDarkThemes[name] ?? (defaultDarkThemes["default"] as ThemeVariables)),
  }
  const customAccent = customColors?.["--default-color-highlight"]
  if (name === "custom" && customAccent) dark["--default-color-highlight"] = customAccent
  return dark
}

// A theme value lands inside a <style> element of an SVG parsed as XML. Colors are
// all it may hold: no "<" or "&" that could open markup, no ";" "{" "}" that could
// close the declaration and start a rule of its own.
const SAFE_CSS_VALUE = /^[#a-zA-Z0-9\s(),.%+-]{1,64}$/

const SAFE_CSS_VARIABLE = /^--[a-z-]{1,40}$/

const isSafeDeclaration = (name: string, value: unknown): value is string =>
  SAFE_CSS_VARIABLE.test(name) && typeof value === "string" && SAFE_CSS_VALUE.test(value)

const declarations = (variables: Record<string, string>): string =>
  Object.entries(variables)
    .filter(([name, value]) => isSafeDeclaration(name, value))
    .map(([name, value]) => `${name}: ${value};`)
    .join(" ")

/**
 * customThemeColors as they arrive in a request: only `--default-color-*` variables
 * with a plain color value survive. Anything else could break out of the declaration.
 */
export const sanitizeCustomThemeColors = (input: unknown): Record<string, string> | undefined => {
  if (!input || typeof input !== "object" || Array.isArray(input)) return undefined
  const colors: Record<string, string> = {}
  for (const [name, value] of Object.entries(input as Record<string, unknown>)) {
    if (name.startsWith("--default-color-") && isSafeDeclaration(name, value)) colors[name] = value.trim()
  }
  return Object.keys(colors).length > 0 ? colors : undefined
}

/**
 * CSS for an auto color mode card: the light palette as the base, the dark one inside
 * `@media (prefers-color-scheme: dark)`, for both styles. A viewer that ignores the
 * media query gets a light card.
 *
 * The variables have to live in a stylesheet rather than in the container's inline
 * style: an inline declaration beats any rule, media query included.
 */
export const buildAutoThemeCss = (
  selector: string,
  style: "default" | "terminal",
  theme: string,
  customColors?: Record<string, string>
): string => {
  const light = getThemeVariantVariables(style, theme, "light", customColors)
  const dark = getThemeVariantVariables(style, theme, "dark", customColors)
  return (
    `${selector} { ${declarations(light)} }\n` +
    `@media (prefers-color-scheme: dark) { ${selector} { ${declarations(dark)} } }`
  )
}
