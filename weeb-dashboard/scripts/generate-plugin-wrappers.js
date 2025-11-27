/**
 * Script para copiar plugins do weeb-plugins para o dashboard
 * 
 * Copia apenas arquivos fonte (.tsx, .ts) do src/ do weeb-plugins
 * Arquivos compilados (.js, .d.ts) devem estar apenas em dist/ e não são copiados
 */

const fs = require('fs')
const path = require('path')

const ROOT_DIR = path.resolve(__dirname, '../..')
const WEEB_PLUGINS_SRC = path.join(ROOT_DIR, 'weeb-plugins/src')
const PLUGINS_SRC = path.join(WEEB_PLUGINS_SRC, 'plugins')
const PLUGINS_DIST = path.join(ROOT_DIR, 'weeb-plugins/dist/plugins')
const OUTPUT_DIR = path.join(ROOT_DIR, 'weeb-dashboard/lib/plugins')
const OUTPUT_ROOT = path.join(ROOT_DIR, 'weeb-dashboard/lib/weeb-plugins')
const OUTPUT_PLUGINS_DIR = path.join(OUTPUT_ROOT, 'plugins')

/**
 * Automatically discover available plugins
 * Looks for directories that contain plugin.metadata.ts
 */
function discoverPlugins() {
  const plugins = []
  
  if (!fs.existsSync(PLUGINS_SRC)) {
    console.warn(`⚠️  Plugins directory not found: ${PLUGINS_SRC}`)
    return []
  }
  
  const entries = fs.readdirSync(PLUGINS_SRC, { withFileTypes: true })
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const pluginName = entry.name
      
      // Ignore directories that start with _ (templates, etc)
      if (pluginName.startsWith('_')) {
        continue
      }
      
      const metadataPath = path.join(PLUGINS_SRC, pluginName, 'plugin.metadata.ts')
      
      if (fs.existsSync(metadataPath)) {
        plugins.push(pluginName)
      }
    }
  }
  
  return plugins.sort() // Sort for consistency
}

/**
 * Get plugin export name from plugin index file
 * Tries to find the export by reading the file
 */
function getPluginExportName(pluginName) {
  const indexPath = path.join(PLUGINS_SRC, pluginName, 'index.tsx')
  
  if (!fs.existsSync(indexPath)) {
    // Fallback: convert plugin name to camelCase
    return pluginName
      .split(/[-_]/)
      .map((word, index) => 
        index === 0 
          ? word 
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join('') + 'Plugin'
  }
  
  try {
    const content = fs.readFileSync(indexPath, 'utf-8')
    // Try to find export const ...Plugin
    const exportMatch = content.match(/export const (\w+Plugin)\s*[:=]/)
    if (exportMatch) {
      return exportMatch[1]
    }
    
    // Try to find export default
    const defaultMatch = content.match(/export default (\w+)/)
    if (defaultMatch) {
      return defaultMatch[1]
    }
  } catch (error) {
    console.warn(`⚠️  Could not read ${indexPath}: ${error.message}`)
  }
  
  // Fallback: convert plugin name to camelCase
  return pluginName
    .split(/[-_]/)
    .map((word, index) => 
      index === 0 
        ? word 
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('') + 'Plugin'
}

const PLUGINS = discoverPlugins()

// Build plugin exports map dynamically
const PLUGIN_EXPORTS = {}
for (const pluginName of PLUGINS) {
  PLUGIN_EXPORTS[pluginName] = getPluginExportName(pluginName)
}

console.log('📦 Copying plugins to weeb-dashboard...')
console.log(`📦 Discovered ${PLUGINS.length} plugin(s): ${PLUGINS.join(', ')}`)

function copyDirectory(src, dest, filter = null) {
  if (!fs.existsSync(src)) {
    return
  }
  
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true })
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    
    // Pular node_modules e arquivos desnecessários
    if (entry.name === 'node_modules' || entry.name === '.git') {
      continue
    }
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath, filter)
    } else {
      // Se tiver filtro, aplicar
      if (filter && !filter(entry.name)) {
        continue
      }
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

try {
  // Gerar metadata.ts primeiro a partir dos plugin.metadata.ts
  console.log('📝 Generating metadata.ts from plugin.metadata.ts files...')
  const { execSync } = require('child_process')
  try {
    execSync('pnpm --filter @weeb/weeb-plugins generate-metadata', {
      cwd: ROOT_DIR,
      stdio: 'inherit',
    })
    console.log('✅ Metadata generated successfully')
  } catch (error) {
    console.warn('⚠️  Could not generate metadata automatically, using existing metadata.ts')
    console.warn('   Make sure to run: pnpm --filter @weeb/weeb-plugins generate-metadata')
  }
  
  // Limpar diretórios de saída
  if (fs.existsSync(OUTPUT_ROOT)) {
    fs.rmSync(OUTPUT_ROOT, { recursive: true, force: true })
  }
  fs.mkdirSync(OUTPUT_ROOT, { recursive: true })
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  // Copiar dependências dos plugins
  console.log('📦 Copying plugin dependencies...')
  
  // Copiar templates (apenas .ts e .tsx)
  const templatesSrc = path.join(WEEB_PLUGINS_SRC, 'templates')
  const templatesDest = path.join(OUTPUT_ROOT, 'templates')
  if (fs.existsSync(templatesSrc)) {
    copyDirectory(templatesSrc, templatesDest, (filename) => {
      return filename.endsWith('.tsx') || filename.endsWith('.ts')
    })
    console.log('✅ Copied templates')
  }
  
  // Copiar utils (apenas .ts e .tsx)
  const utilsSrc = path.join(WEEB_PLUGINS_SRC, 'utils')
  const utilsDest = path.join(OUTPUT_ROOT, 'utils')
  if (fs.existsSync(utilsSrc)) {
    copyDirectory(utilsSrc, utilsDest, (filename) => {
      return filename.endsWith('.tsx') || filename.endsWith('.ts')
    })
    console.log('✅ Copied utils')
  }
  
  // Copiar types (apenas .ts)
  const typesSrc = path.join(WEEB_PLUGINS_SRC, 'types')
  const typesDest = path.join(OUTPUT_ROOT, 'types')
  if (fs.existsSync(typesSrc)) {
    copyDirectory(typesSrc, typesDest, (filename) => {
      return filename.endsWith('.ts')
    })
    console.log('✅ Copied types')
  }
  
  // Copiar styles (apenas .ts e .css)
  const stylesSrc = path.join(WEEB_PLUGINS_SRC, 'styles')
  const stylesDest = path.join(OUTPUT_ROOT, 'styles')
  if (fs.existsSync(stylesSrc)) {
    copyDirectory(stylesSrc, stylesDest, (filename) => {
      return filename.endsWith('.ts') || filename.endsWith('.css')
    })
    console.log('✅ Copied styles')
  }
  
  // Copiar themes (apenas .ts)
  const themesSrc = path.join(WEEB_PLUGINS_SRC, 'themes')
  const themesDest = path.join(OUTPUT_ROOT, 'themes')
  if (fs.existsSync(themesSrc)) {
    copyDirectory(themesSrc, themesDest, (filename) => {
      return filename.endsWith('.ts')
    })
    console.log('✅ Copied themes')
  }
  
  // Criar diretório plugins dentro de weeb-plugins
  if (!fs.existsSync(OUTPUT_PLUGINS_DIR)) {
    fs.mkdirSync(OUTPUT_PLUGINS_DIR, { recursive: true })
  }
  
  // Copiar plugins/metadata.ts para weeb-plugins/plugins/
  const metadataSrc = path.join(PLUGINS_SRC, 'metadata.ts')
  const metadataDestWeeb = path.join(OUTPUT_PLUGINS_DIR, 'metadata.ts')
  if (fs.existsSync(metadataSrc)) {
    fs.copyFileSync(metadataSrc, metadataDestWeeb)
    console.log('✅ Copied plugins/metadata.ts to weeb-plugins/plugins/')
  }
  
  // Copiar plugins/manager.ts para weeb-plugins/plugins/
  const managerSrc = path.join(PLUGINS_SRC, 'manager.ts')
  const managerDestWeeb = path.join(OUTPUT_PLUGINS_DIR, 'manager.ts')
  if (fs.existsSync(managerSrc)) {
    fs.copyFileSync(managerSrc, managerDestWeeb)
    console.log('✅ Copied plugins/manager.ts to weeb-plugins/plugins/')
  }
  
  // Copiar plugins/shared para weeb-plugins/plugins/
  const sharedSrc = path.join(PLUGINS_SRC, 'shared')
  const sharedDestWeeb = path.join(OUTPUT_PLUGINS_DIR, 'shared')
  if (fs.existsSync(sharedSrc)) {
    copyDirectory(sharedSrc, sharedDestWeeb, (filename) => {
      return filename.endsWith('.tsx') || filename.endsWith('.ts')
    })
    console.log('✅ Copied plugins/shared to weeb-plugins/plugins/')
  }
  
  // Copiar plugins/types.ts para weeb-plugins/plugins/
  const pluginsTypesSrc = path.join(PLUGINS_SRC, 'types.ts')
  const pluginsTypesDestWeeb = path.join(OUTPUT_PLUGINS_DIR, 'types.ts')
  if (fs.existsSync(pluginsTypesSrc)) {
    fs.copyFileSync(pluginsTypesSrc, pluginsTypesDestWeeb)
    console.log('✅ Copied plugins/types.ts to weeb-plugins/plugins/')
  }

  // Copiar cada plugin (fonte E compilado)
  console.log('📦 Copying plugins...')
  for (const pluginName of PLUGINS) {
    const pluginSrcPath = path.join(PLUGINS_SRC, pluginName)
    const pluginDistPath = path.join(PLUGINS_DIST, pluginName)
    const pluginOutputPath = path.join(OUTPUT_DIR, pluginName)
    
    if (!fs.existsSync(pluginSrcPath)) {
      console.warn(`⚠️  Plugin ${pluginName} source not found, skipping...`)
      continue
    }

    // Copiar apenas arquivos fonte (.tsx, .ts, .json)
    // Arquivos compilados (.js, .d.ts) devem estar apenas em dist/ e não devem ser copiados
    copyDirectory(pluginSrcPath, pluginOutputPath, (filename) => {
      return filename.endsWith('.tsx') || filename.endsWith('.ts') || filename.endsWith('.json')
    })
    
    console.log(`✅ Copied ${pluginName} plugin`)
  }

  // Create index.ts that re-exports plugins
  // Relative imports in plugins need to be adjusted to point to OUTPUT_ROOT
  const exportsLines = PLUGINS.map(pluginName => 
    `export { ${PLUGIN_EXPORTS[pluginName]} } from './${pluginName}/index'`
  ).join('\n')
  
  const switchCases = PLUGINS.map(pluginName => 
    `    case '${pluginName}':\n      const { ${PLUGIN_EXPORTS[pluginName]} } = await import('./${pluginName}/index')\n      return ${PLUGIN_EXPORTS[pluginName]}`
  ).join('\n')
  
  const indexContent = `/**
 * Plugin Exports - Generated from weeb-plugins
 * 
 * This file is auto-generated. Do not edit manually.
 * Run: pnpm generate:plugin-wrappers
 * 
 * Re-exports plugins from local copies
 */

${exportsLines}

export async function loadPlugin(name: string) {
  switch (name) {
${switchCases}
    default:
      return undefined
  }
}
`

  const indexFile = path.join(OUTPUT_DIR, 'index.ts')
  fs.writeFileSync(indexFile, indexContent, 'utf-8')
  console.log(`✅ Generated ${indexFile}`)

  console.log('✅ Plugin copying complete!')
  
  // Gerar lib/styles/default.ts a partir do CSS do weeb-plugins
  console.log('\n📝 Generating lib/styles/default.ts...')
  const stylesDefaultPath = path.join(ROOT_DIR, 'weeb-dashboard/lib/styles/default.ts')
  // Ler do arquivo fonte do weeb-plugins, não do copiado
  const stylesCssSourcePath = path.join(WEEB_PLUGINS_SRC, 'styles/default/styles.css')
  
  if (fs.existsSync(stylesCssSourcePath)) {
    const cssContent = fs.readFileSync(stylesCssSourcePath, 'utf-8')
    // Escapar o CSS para uma string template literal (escapar backticks e ${})
    const escapedCss = cssContent
      .replace(/\\/g, '\\\\')  // Escapar backslashes
      .replace(/`/g, '\\`')     // Escapar backticks
      .replace(/\${/g, '\\${')   // Escapar ${ para evitar interpolação
    const defaultTsContent = `/**
 * Default Style CSS - Browser-compatible version
 * 
 * This file re-exports CSS from weeb-plugins.
 * Do not edit manually - edit weeb-plugins/src/styles/default/ instead.
 * This file is auto-generated by generate-plugin-wrappers.js
 */

export const defaultStyleCSS = \`${escapedCss}\`
`
    fs.writeFileSync(stylesDefaultPath, defaultTsContent, 'utf-8')
    console.log('✅ Generated lib/styles/default.ts')
  } else {
    console.warn('⚠️  styles.css not found, skipping lib/styles/default.ts generation')
  }
  
  // Executar script de correção de imports
  console.log('\n🔧 Fixing plugin imports...')
  require('./fix-plugin-imports.js')
  
} catch (error) {
  console.error('❌ Error copying plugins:', error)
  process.exit(1)
}

