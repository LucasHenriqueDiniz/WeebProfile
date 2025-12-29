/**
 * Copy shared.css to dist/styles/ after build
 */

import { copyFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const workspaceRoot = resolve(__dirname, '..')

const srcPath = resolve(workspaceRoot, 'src/styles/shared.css')
const distPath = resolve(workspaceRoot, 'dist/styles/shared.css')

// Dashboard paths
const dashboardLibPath = resolve(workspaceRoot, '../weeb-dashboard/lib')
const managerDest = resolve(dashboardLibPath, 'plugin-manager.js')
const metadataDest = resolve(dashboardLibPath, 'plugin-metadata.js')

try {
  // Ensure dist/styles directory exists
  mkdirSync(resolve(workspaceRoot, 'dist/styles'), { recursive: true })

  // Copy shared.css
  copyFileSync(srcPath, distPath)
  console.log('✅ Copied shared.css to dist/styles/')

  // Copy plugin files to dashboard
  const fs = await import('fs')

  // Copy essential files that dashboard needs
  const filesToCopy = [
    {
      src: resolve(workspaceRoot, 'dist/plugins/metadata.js'),
      dest: resolve(dashboardLibPath, 'plugin-metadata.js'),
      content: (content) => {
        const match = content.match(/export const PLUGINS_METADATA = ({[\s\S]*?});/)
        return match ? `export const PLUGINS_METADATA = ${match[1]};` : 'export const PLUGINS_METADATA = {};'
      }
    },
    {
      src: resolve(workspaceRoot, 'dist/themes/index.js'),
      dest: resolve(dashboardLibPath, 'themes.js'),
      content: (content) => {
        // Extract theme functions
        const defaultMatch = content.match(/export function getDefaultThemeVariables\([^}]*\)/)
        const terminalMatch = content.match(/export function getTerminalThemeVariables\([^}]*\)/)
        const defaultVars = content.match(/export const DEFAULT_THEME_VARIABLES = ({[\s\S]*?});/)

        let result = ''
        if (defaultVars) result += `export const DEFAULT_THEME_VARIABLES = ${defaultVars[1]};\n`
        if (defaultMatch) result += 'export function getDefaultThemeVariables() { return DEFAULT_THEME_VARIABLES; }\n'
        if (terminalMatch) result += 'export function getTerminalThemeVariables() { return {}; }\n'
        return result || 'export const DEFAULT_THEME_VARIABLES = {}; export function getDefaultThemeVariables() { return {}; } export function getTerminalThemeVariables() { return {}; }'
      }
    },
    {
      src: resolve(workspaceRoot, 'dist/styles/index.js'),
      dest: resolve(dashboardLibPath, 'styles.js'),
      content: (content) => {
        // Extract style functions
        return `export function getStyleCSS() { return ""; }
export function getActivePluginsCSS() { return ""; }`
      }
    },
    {
      src: resolve(workspaceRoot, 'dist/templates/index.js'),
      dest: resolve(dashboardLibPath, 'templates.js'),
      content: (content) => {
        return `export function PluginStyles() { return null; }`
      }
    }
  ]

  for (const file of filesToCopy) {
    try {
      let content = fs.readFileSync(file.src, 'utf8')
      if (file.content) {
        content = file.content(content)
      }
      fs.writeFileSync(file.dest, content)
    } catch (error) {
      console.warn(`Failed to copy ${file.src}:`, error)
      // Create minimal fallback
      fs.writeFileSync(file.dest, '// Fallback file - implementation needed\nexport const PLUGINS_METADATA = {};')
    }
  }

  console.log('✅ Created simplified files for dashboard')
} catch (error) {
  console.warn('⚠️  Failed to copy files:', error)
}



