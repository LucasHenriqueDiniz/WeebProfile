/**
 * Generate Tailwind CSS using Tailwind CLI
 * 
 * This script uses the official Tailwind CSS CLI to generate CSS automatically
 * based on classes used in React components. Much better than manual generation!
 */

import { execSync } from 'child_process'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const workspaceRoot = resolve(__dirname, '..')

/**
 * Add #svg-main scope to all CSS selectors
 * Handles both minified and formatted CSS
 */
function addSvgScope(css: string): string {
  // First, handle @rules and their content
  let scoped = css
  
  // Handle @media queries - scope selectors inside them
  scoped = scoped.replace(
    /@media[^{]*\{([^}]+)\}/g,
    (match, content) => {
      const scopedContent = content.replace(
        /([^{}@]+)\{/g,
        (ruleMatch, selector) => {
          const trimmed = selector.trim()
          if (trimmed.includes('#svg-main') || trimmed.startsWith('@')) {
            return ruleMatch
          }
          return `#svg-main ${trimmed} {`
        }
      )
      return match.replace(content, scopedContent)
    }
  )
  
  // Handle regular CSS rules (not inside @media)
  // Match selector { ... } but skip @rules
  scoped = scoped.replace(
    /^([^{}@\s][^{}]*?)\{/gm,
    (match, selector) => {
      const trimmed = selector.trim()
      
      // Skip if already scoped
      if (trimmed.includes('#svg-main')) {
        return match
      }
      
      // Skip @rules
      if (trimmed.startsWith('@')) {
        return match
      }
      
      // Skip pseudo-elements and pseudo-classes at root level
      if (trimmed.startsWith('::') || trimmed.startsWith(':')) {
        return match
      }
      
      // Add scope to selector
      return `#svg-main ${trimmed} {`
    }
  )
  
  return scoped
}

/**
 * Main function
 */
async function main() {
  console.log('🎨 Generating Tailwind CSS using official CLI...\n')
  
  const inputFile = resolve(workspaceRoot, 'src/styles/tailwind-input.css')
  const outputFile = resolve(workspaceRoot, 'src/styles/tailwind-output.css')
  const finalFile = resolve(workspaceRoot, 'src/styles/shared.css')
  const configFile = resolve(workspaceRoot, 'tailwind.config.js')
  
  // Check if Tailwind is installed
  const tailwindPath = resolve(workspaceRoot, 'node_modules/.bin/tailwindcss')
  if (!existsSync(tailwindPath)) {
    console.error('❌ Tailwind CSS not found. Please install it first:')
    console.error('   pnpm add -D tailwindcss\n')
    process.exit(1)
  }
  
  // Check if input file exists
  if (!existsSync(inputFile)) {
    console.error(`❌ Input file not found: ${inputFile}`)
    process.exit(1)
  }
  
  // Check if config file exists
  if (!existsSync(configFile)) {
    console.error(`❌ Config file not found: ${configFile}`)
    process.exit(1)
  }
  
  console.log('📁 Input file:', inputFile)
  console.log('📁 Config file:', configFile)
  console.log('📁 Output file:', outputFile)
  console.log('')
  
  // Generate CSS using Tailwind CLI (without minify for easier scoping)
  try {
    console.log('🔄 Running Tailwind CLI...')
    const tailwindCmd = process.platform === 'win32' 
      ? `"${tailwindPath}"` 
      : tailwindPath
    execSync(
      `${tailwindCmd} -i "${inputFile}" -o "${outputFile}"`,
      {
        cwd: workspaceRoot,
        stdio: 'inherit',
      }
    )
    console.log('✅ Tailwind CSS generated successfully!\n')
  } catch (error) {
    console.error('❌ Error generating CSS:', error)
    process.exit(1)
  }
  
  // Read generated CSS
  if (!existsSync(outputFile)) {
    console.error(`❌ Output file not generated: ${outputFile}`)
    process.exit(1)
  }
  
  let generatedCSS = readFileSync(outputFile, 'utf8')
  
  // Remove container utility and its media queries (not used)
  console.log('🧹 Removing unused container utility...')
  generatedCSS = generatedCSS.replace(
    /#svg-main \.container\s*\{[^}]*\}/g,
    ''
  )
  generatedCSS = generatedCSS.replace(
    /@media[^{]*\{[^}]*#svg-main \.container[^}]*\}/g,
    ''
  )
  
  // Remove base CSS variables (not needed, we use custom CSS)
  console.log('🧹 Removing base CSS variables...')
  generatedCSS = generatedCSS.replace(
    /^\*, ::before, ::after\s*\{[^}]*\}/gm,
    ''
  )
  generatedCSS = generatedCSS.replace(
    /^::backdrop\s*\{[^}]*\}/gm,
    ''
  )
  
  // Clean up extra blank lines
  generatedCSS = generatedCSS.replace(/\n{3,}/g, '\n\n')
  
  // Add #svg-main scope to all selectors
  console.log('🔧 Adding #svg-main scope to all selectors...')
  const scopedCSS = addSvgScope(generatedCSS)
  
  // Write to final file with header
  const header = `/* Shared CSS - Tailwind utility classes used by all plugins */
/* ⚠️ AUTO-GENERATED - DO NOT EDIT MANUALLY ⚠️ */
/* Run: pnpm generate:tailwind-css */
/* Generated using Tailwind CSS CLI - supports all Tailwind features including arbitrary values */
/* These classes are embedded in the SVG so it works standalone */

`
  
  writeFileSync(finalFile, header + scopedCSS, 'utf8')
  
  console.log('✅ CSS scoped and saved to:', finalFile)
  console.log('📊 CSS size:', (scopedCSS.length / 1024).toFixed(2), 'KB\n')
}

main().catch(console.error)

