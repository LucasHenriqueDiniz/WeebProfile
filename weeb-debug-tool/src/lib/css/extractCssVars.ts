/**
 * Extract CSS Variable Names from CSS string
 */

export function extractCssVarNames(css: string): string[] {
  // Regex to match CSS custom properties: --var-name
  const regex = /\b--[\w-]+/g
  const matches = css.match(regex) || []

  // Remove duplicates and sort
  const unique = Array.from(new Set(matches))
  return unique.sort()
}

/**
 * Filter CSS variable names by prefix
 */
export function filterCssVarNames(varNames: string[], prefixes: string[]): string[] {
  return varNames.filter((name) => prefixes.some((prefix) => name.startsWith(prefix)))
}
