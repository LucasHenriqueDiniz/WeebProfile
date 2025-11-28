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
  
  // Read CSS file
  const cssContent = readFileSync(cssFile, 'utf8')
  
  // Read current index.ts to preserve the structure
  const indexContent = readFileSync(indexPath, 'utf8')
  
  // Find the CSS constant name
  const cssConstantName = styleName === 'default' ? 'DEFAULT_STYLE_CSS' : 'TERMINAL_STYLE_CSS'
  
  // Extract the part before the CSS constant
  const beforeMatch = indexContent.match(new RegExp(`^(.*?const\\s+${cssConstantName}\\s*=\\s*\`)`, 's'))
  if (!beforeMatch) {
    console.error(`❌ Could not find ${cssConstantName} constant in ${indexPath}`)
    return
  }
  
  // Extract the part after the closing backtick
  const afterMatch = indexContent.match(/`\s*(.*)$/s)
  if (!afterMatch) {
    console.error(`❌ Could not find closing backtick in ${indexPath}`)
    return
  }
  
  const beforeCSS = beforeMatch[1]
  const afterCSS = afterMatch[1]
  
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

