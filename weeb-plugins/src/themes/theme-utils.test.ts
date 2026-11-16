import { describe, expect, it } from "vitest"
import {
  buildAutoThemeCss,
  getDefaultThemeVariables,
  getTerminalThemeVariables,
  getThemeVariantVariables,
  sanitizeCustomThemeColors,
} from "./theme-utils"
import { defaultDarkThemes, defaultThemes, terminalLightThemes, terminalThemes } from "./themes"

/** Splits the auto CSS into the declarations outside and inside the dark media query. */
function split(css: string): { base: string; dark: string } {
  const at = css.indexOf("@media (prefers-color-scheme: dark)")
  expect(at).toBeGreaterThan(0)
  return { base: css.slice(0, at), dark: css.slice(at) }
}

describe("auto color mode CSS", () => {
  it("puts the light palette in the base rule and the dark one in the media query, default style", () => {
    const { base, dark } = split(buildAutoThemeCss(".card", "default", "purple"))

    expect(base).toContain(`--default-color-surface: ${defaultThemes.purple!["--default-color-surface"]};`)
    expect(dark).toContain(`--default-color-surface: ${defaultDarkThemes.purple!["--default-color-surface"]};`)
    expect(dark).toContain(`--default-color-highlight: ${defaultDarkThemes.purple!["--default-color-highlight"]};`)
  })

  it("puts the light palette in the base rule and the dark one in the media query, terminal style", () => {
    const { base, dark } = split(buildAutoThemeCss(".card", "terminal", "dracula"))

    expect(base).toContain(
      `--terminal-color-background: ${terminalLightThemes.dracula!["--terminal-color-background"]};`
    )
    expect(dark).toContain(`--terminal-color-background: ${terminalThemes.dracula!["--terminal-color-background"]};`)
  })

  it("draws each style's own variant exactly as fixed mode does", () => {
    expect(getThemeVariantVariables("default", "blue", "light")).toEqual(getDefaultThemeVariables("blue"))
    expect(getThemeVariantVariables("terminal", "monokai", "dark")).toEqual(getTerminalThemeVariables("monokai"))
  })

  it("maps the legacy theme names to the same dark palette", () => {
    expect(getThemeVariantVariables("default", "defaultPurple", "dark")).toEqual(
      getThemeVariantVariables("default", "purple", "dark")
    )
  })

  it("falls back to the default palettes for an unknown theme", () => {
    expect(getThemeVariantVariables("default", "nope", "dark")).toEqual(defaultDarkThemes.default)
    expect(getThemeVariantVariables("terminal", "nope", "light")).toEqual(terminalLightThemes.default)
  })

  it("gives every theme both variants with the same variables", () => {
    for (const name of Object.keys(defaultThemes)) {
      expect(Object.keys(defaultDarkThemes[name] ?? {}).sort()).toEqual(Object.keys(defaultThemes[name]!).sort())
    }
    for (const name of Object.keys(terminalThemes)) {
      expect(Object.keys(terminalLightThemes[name] ?? {}).sort()).toEqual(Object.keys(terminalThemes[name]!).sort())
    }
  })
})

describe("customThemeColors in auto mode", () => {
  const custom = { "--default-color-highlight": "#e11d48", "--default-color-surface": "#fef9c3" }

  it("applies every custom color to the light variant", () => {
    const light = getThemeVariantVariables("default", "custom", "light", custom)

    expect(light["--default-color-highlight"]).toBe("#e11d48")
    expect(light["--default-color-surface"]).toBe("#fef9c3")
  })

  it("keeps only the custom accent in the dark variant", () => {
    const dark = getThemeVariantVariables("default", "custom", "dark", custom)

    expect(dark["--default-color-highlight"]).toBe("#e11d48")
    expect(dark["--default-color-surface"]).toBe(defaultDarkThemes.default!["--default-color-surface"])
  })

  it("ignores custom colors on a theme that is not custom", () => {
    const dark = getThemeVariantVariables("default", "green", "dark", custom)

    expect(dark["--default-color-highlight"]).toBe(defaultDarkThemes.green!["--default-color-highlight"])
  })

  it("leaves a value that could close the rule out of the CSS", () => {
    const css = buildAutoThemeCss(".card", "default", "custom", {
      "--default-color-highlight": "red;} body{display:none",
    })

    expect(css).not.toContain("display:none")
    expect(css).not.toContain("red;")
  })
})

describe("sanitizeCustomThemeColors", () => {
  it("keeps plain colors on default-style variables", () => {
    expect(
      sanitizeCustomThemeColors({
        "--default-color-highlight": "#e11d48",
        "--default-color-muted": "rgb(1, 2, 3)",
      })
    ).toEqual({ "--default-color-highlight": "#e11d48", "--default-color-muted": "rgb(1, 2, 3)" })
  })

  it("drops anything that could leave the declaration or is not a default-style variable", () => {
    expect(
      sanitizeCustomThemeColors({
        "--default-color-highlight": "red; background: url(https://x)",
        "--default-color-surface": "</style><script>",
        "--terminal-color-background": "#000000",
        color: "#ffffff",
      })
    ).toBeUndefined()
  })

  it("returns undefined for anything that is not an object", () => {
    expect(sanitizeCustomThemeColors("red")).toBeUndefined()
    expect(sanitizeCustomThemeColors(["#fff"])).toBeUndefined()
    expect(sanitizeCustomThemeColors(null)).toBeUndefined()
  })
})

describe("light terminal palettes", () => {
  const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  const luminance = (rgb: number[]) => {
    const [r, g, b] = rgb.map((v) => {
      const c = v / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
  }
  const contrast = (a: number[], b: number[]) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
    return (hi! + 0.05) / (lo! + 0.05)
  }
  /** `rgba(0, 0, 0, a)` laid over an opaque background. */
  const blackOver = (background: number[], stripe: string) => {
    const alpha = Number(stripe.match(/rgba\(0, 0, 0, ([\d.]+)\)/)?.[1])
    expect(alpha).toBeGreaterThanOrEqual(0)
    return background.map((v) => v * (1 - alpha))
  }

  // TerminalGrid draws every other row on the stripe. Black at 25% turned a white row
  // #bfbfbf, and the gray text on it fell to 1.9:1.
  it.each(Object.keys(terminalLightThemes))("keeps %s's text at 4.5:1 on the background and on the stripe", (name) => {
    const theme = terminalLightThemes[name]!
    const background = channels(theme["--terminal-color-background"])
    const stripe = blackOver(background, theme["--terminal-color-stripe"])
    for (const text of [
      "--terminal-color-default",
      "--terminal-color-muted",
      "--terminal-color-muted-light",
      "--terminal-color-warning",
    ] as const) {
      const color = channels(theme[text])
      expect(contrast(color, background), `${text} on the background`).toBeGreaterThanOrEqual(4.5)
      expect(contrast(color, stripe), `${text} on the stripe`).toBeGreaterThanOrEqual(4.5)
    }
  })
})
