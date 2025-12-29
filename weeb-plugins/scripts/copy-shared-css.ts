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
const dashboardPluginsPath = resolve(dashboardLibPath, 'plugins')
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

  // Create plugin-registry.js in plugins directory
  try {
    mkdirSync(dashboardPluginsPath, { recursive: true })
    const pluginRegistryContent = `// Plugin registry shim for dashboard
import { PLUGINS_METADATA } from "../plugin-metadata.js";

export const pluginRegistry = {};

// Initialize registry with metadata
const pluginNames = Object.keys(PLUGINS_METADATA);
pluginNames.forEach((pluginName) => {
  pluginRegistry[pluginName] = {
    meta: PLUGINS_METADATA[pluginName],
    load: async () => {
      console.warn(\`Plugin \${pluginName} loading not implemented yet\`);
      return null;
    },
  };
});

export async function getPlugin(name) {
  const entry = pluginRegistry[name];
  if (!entry) {
    console.warn(\`Plugin not found in registry: \${name}\`);
    return null;
  }
  return entry.load();
}

export async function getPlugins(names) {
  const results = [];
  await Promise.all(
    names.map(async (name) => {
      try {
        const plugin = await getPlugin(name);
        if (plugin) {
          results.push([name, plugin]);
        }
      } catch (error) {
        console.error(\`Failed to load plugin \${name}:\`, error);
      }
    })
  );
  return results;
}

export function hasPlugin(name) {
  return name in pluginRegistry;
}

export function getAllPluginNames() {
  return Object.keys(pluginRegistry);
}
`
    fs.writeFileSync(resolve(dashboardPluginsPath, 'plugin-registry.js'), pluginRegistryContent)
    console.log('✅ Created plugin-registry.js for dashboard')
  } catch (error) {
    console.warn('⚠️  Failed to create plugin-registry.js:', error)
  }

  console.log('✅ Created simplified files for dashboard')
} catch (error) {
  console.warn('⚠️  Failed to copy files:', error)
}



