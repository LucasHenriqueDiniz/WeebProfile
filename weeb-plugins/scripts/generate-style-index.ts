/**
 * Generate style index.ts files from styles.css
 * 
 * This script reads styles.css and generates the embedded CSS in index.ts
 * This ensures we have a single source of truth (styles.css)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const workspaceRoot = resolve(__dirname, '..')

/**
 * Escape template literal string for embedding in TypeScript
 */
function escapeTemplateLiteral(str: string): string {
  return str
    .replace(/\\/g, '\\\\')  // Escape backslashes
    .replace(/`/g, '\\`')    // Escape backticks
    .replace(/\${/g, '\\${') // Escape ${ expressions
}

/**
 * Generate index.ts for a style
 */
function generateStyleIndex(styleName: 'default' | 'terminal'): void {
  const stylesDir = resolve(workspaceRoot, 'src/styles', styleName)
  const cssFile = resolve(stylesDir, 'styles.css')
  const indexPath = resolve(stylesDir, 'index.ts')
  
  if (!existsSync(cssFile)) {
    console.error(`❌ CSS file not found: ${cssFile}`)
    return
  }
  
  if (!existsSync(indexPath)) {
    console.error(`❌ Index file not found: ${indexPath}`)
    return
  }
  
  // Read CSS file and trim trailing whitespace/newlines
  const cssContent = readFileSync(cssFile, 'utf8').trimEnd()
  
  // Read current index.ts to preserve the structure (only if it exists and is valid)
  let indexContent = ''
  let beforeCSS = ''
  let afterCSS = ''
  
  if (existsSync(indexPath)) {
    indexContent = readFileSync(indexPath, 'utf8')
    
    // Find the CSS constant name
    const cssConstantName = styleName === 'default' ? 'DEFAULT_STYLE_CSS' : 'TERMINAL_STYLE_CSS'
    
    // Extract the part before the CSS constant (non-greedy to get first occurrence)
    const beforeMatch = indexContent.match(new RegExp(`^(.*?const\\s+${cssConstantName}\\s*=\\s*\`)`, 's'))
    
    if (beforeMatch) {
      // Extract before CSS
      beforeCSS = beforeMatch[1]
      
      // Find the closing backtick - look for the pattern: ` followed by newline and then /** Get CSS
      // We need to find the LAST backtick that appears before "Get CSS" comment
      const getCSSCommentPattern = /`\s*\n\s*\/\*\*\s*\n\s*\*\s*Get CSS for/
      const getCSSMatch = indexContent.match(getCSSCommentPattern)
      
      if (getCSSMatch && getCSSMatch.index !== undefined) {
        // Find the backtick just before this pattern
        const backtickPos = indexContent.lastIndexOf('`', getCSSMatch.index)
        if (backtickPos !== -1 && backtickPos > beforeMatch.index!) {
          // Include the backtick in afterCSS (it's the closing backtick of the template literal)
          afterCSS = indexContent.substring(backtickPos)
        } else {
          // Fallback: look for backtick followed by function getCSS
          const fallbackPattern = new RegExp(/`\s*(?=\/\*\*\s*\n\s*\*\s*Get CSS)/s)
          const fallbackMatch = indexContent.match(fallbackPattern)
          if (fallbackMatch && fallbackMatch.index !== undefined) {
            // Include the backtick
            afterCSS = indexContent.substring(fallbackMatch.index)
          } else {
            console.warn(`⚠️  Could not find closing backtick pattern, will rebuild from template`)
            beforeCSS = ''
            afterCSS = ''
          }
        }
      } else {
        console.warn(`⚠️  Could not find "Get CSS" comment pattern, will rebuild from template`)
        beforeCSS = ''
        afterCSS = ''
      }
    } else {
      console.warn(`⚠️  Could not find ${cssConstantName} constant, will rebuild from template`)
      beforeCSS = ''
      afterCSS = ''
    }
  }
  
  // If we couldn't extract the structure, rebuild from template
  if (!beforeCSS || !afterCSS) {
    const cssConstantName = styleName === 'default' ? 'DEFAULT_STYLE_CSS' : 'TERMINAL_STYLE_CSS'
    const themeImport = styleName === 'default' 
      ? "import { defaultThemes, type ThemeVariables } from '../../themes/themes'\nimport type { DefaultTheme } from '../../themes/types'\nimport { getDefaultThemeVariables as getDefaultThemeVariablesFromUtils } from '../../themes/theme-utils'"
      : "import { terminalThemes } from '../../themes/themes'\nimport type { TerminalTheme } from '../../themes/types'"
    
    const styleDef = styleName === 'default'
      ? "export const defaultStyle = {\n  name: 'default',\n  displayName: 'Default',\n  fontFamily: \"'Poppins', sans-serif\",\n  containerClass: 'default-container',\n  getCSS: getCSS,\n  getThemeVariables: getDefaultThemeVariables,\n  themes: defaultThemes,\n}\n\nexport default defaultStyle"
      : "export const terminalStyle = {\n  name: 'terminal',\n  displayName: 'Terminal',\n  fontFamily: 'ui-monospace, monospace',\n  containerClass: 'terminal-container',\n  getCSS: getCSS,\n  getThemeVariables: getTerminalThemeVariables,\n  themes: terminalThemes,\n}\n\nexport default terminalStyle"
    
    const getThemeVarsFunc = styleName === 'default'
      ? "export function getDefaultThemeVariables(theme: DefaultTheme | string): Record<string, string> {\n  return getDefaultThemeVariablesFromUtils(theme) as Record<string, string>\n}"
      : "export function getTerminalThemeVariables(theme: TerminalTheme | string): Record<string, string> {\n  const validTheme = (theme in terminalThemes ? theme : 'default') as TerminalTheme\n  const selectedTheme = terminalThemes[validTheme]\n\n  // Always return a valid theme - default theme is guaranteed to exist\n  // Using non-null assertion because 'default' theme is always defined in terminalThemes\n  return (selectedTheme ?? terminalThemes['default']) as Record<string, string>\n}"
    
    const styleDesc = styleName === 'default'
      ? 'Default Style Definition\n * Modern UI style with Poppins font and color theme variations'
      : 'Terminal Style Definition\n * Terminal/console style with monospace font and terminal themes'
    
    beforeCSS = `/**
 * ⚠️ FILE GENERATED AUTOMATICALLY - DO NOT EDIT MANUALLY ⚠️
 * 
 * This file is generated automatically by scripts/generate-style-index.ts
 * from weeb-plugins/src/styles/${styleName}/styles.css
 * 
 * To modify the CSS, edit styles.css and run:
 *   pnpm generate-style-index
 *   (or: tsx scripts/generate-style-index.ts)
 * 
 * ${styleDesc}
 */

${themeImport}

/**
 * ${styleName === 'default' ? 'Default' : 'Terminal'} style CSS (embedded for browser compatibility)
 */
const ${cssConstantName} = \``
    
    afterCSS = `\`

/**
 * Get CSS for ${styleName} style
 * Browser-compatible: uses embedded CSS string
 */
function getCSS(): string {
  return ${cssConstantName}
}

/**
 * Get theme variables for ${styleName} style
 * Returns Record<string, string> for compatibility with StyleDefinition
 */
${getThemeVarsFunc}

/**
 * ${styleName === 'default' ? 'Default' : 'Terminal'} style definition
 */
${styleDef}
`
  }
  
  // Generate new index.ts with CSS from file
  const escapedCSS = escapeTemplateLiteral(cssContent)
  const newIndexContent = `${beforeCSS}${escapedCSS}${afterCSS}`
  
  // Write new index.ts
  writeFileSync(indexPath, newIndexContent, 'utf8')
  
  console.log(`✅ Generated ${styleName}/index.ts from ${styleName}/styles.css`)
}

/**
 * Main function
 */
function main() {
  console.log('📝 Generating style index.ts files from styles.css...\n')
  
  generateStyleIndex('default')
  generateStyleIndex('terminal')
  
  console.log('\n✅ Done!')
}

main()

