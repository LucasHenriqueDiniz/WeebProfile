#!/usr/bin/env tsx
/**
 * Script to create a new plugin from template
 * 
 * Usage: pnpm create-plugin plugin-name
 */

import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Get plugin name from argument
const pluginName = process.argv[2]

if (!pluginName) {
  console.error('❌ Error: Plugin name is required')
  console.log('Usage: pnpm create-plugin plugin-name')
  process.exit(1)
}

// Validate plugin name (kebab-case, cannot start with number)
if (!/^[a-z][a-z0-9-]*$/.test(pluginName)) {
  console.error('❌ Error: Plugin name must be in kebab-case (e.g., my-plugin)')
  console.log('Only lowercase letters, numbers and hyphens are allowed')
  console.log('⚠️  Name CANNOT start with a number (e.g., use "personality16" instead of "16personalities")')
  process.exit(1)
}

// Check if plugin already exists
const pluginPath = join(__dirname, '../src/plugins', pluginName)
if (existsSync(pluginPath)) {
  console.error(`❌ Error: Plugin "${pluginName}" already exists at ${pluginPath}`)
  process.exit(1)
}

// Transformation functions
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

function toUpperCase(str: string): string {
  return str.toUpperCase().replace(/-/g, '_')
}

const PluginName = toPascalCase(pluginName)
const PLUGIN_NAME_UPPER = toUpperCase(pluginName)

console.log(`🚀 Creating plugin "${pluginName}"...`)

// Copy template
const templatePath = join(__dirname, '../src/plugins/_template')
if (!existsSync(templatePath)) {
  console.error(`❌ Error: Template not found at ${templatePath}`)
  process.exit(1)
}

// Create plugin directory
mkdirSync(pluginPath, { recursive: true })
mkdirSync(join(pluginPath, 'services'), { recursive: true })
mkdirSync(join(pluginPath, 'components'), { recursive: true })

// Function to process file
function processFile(sourcePath: string, targetPath: string): void {
  let content = readFileSync(sourcePath, 'utf-8')
  
  // Replace placeholders
  content = content.replace(/PLUGIN_NAME/g, pluginName)
  content = content.replace(/PluginName/g, PluginName)
  content = content.replace(/PLUGIN_NAME_UPPER/g, PLUGIN_NAME_UPPER)
  
  // Replace filename if necessary
  const fileName = targetPath.split('/').pop() || ''
  if (fileName.includes('PLUGIN_NAME')) {
    const newFileName = fileName.replace(/PLUGIN_NAME/g, PluginName)
    targetPath = join(dirname(targetPath), newFileName)
  }
  
  writeFileSync(targetPath, content, 'utf-8')
}

// Copy and process files
// NOTE: heights.ts is no longer required - height is calculated dynamically using Playwright
const filesToCopy = [
  { from: 'index.tsx', to: 'index.tsx' },
  { from: 'types.ts', to: 'types.ts' },
  { from: 'plugin.metadata.ts', to: 'plugin.metadata.ts' },
  { from: 'services/fetchData.ts', to: 'services/fetchData.ts' },
  { from: 'services/mock-data.ts', to: 'services/mock-data.ts' },
  { from: 'components/RenderPLUGIN_NAME.tsx', to: `components/Render${PluginName}.tsx` },
  { from: 'README.md', to: 'README.md' },
]

for (const file of filesToCopy) {
  const sourceFile = join(templatePath, file.from)
  const targetFile = join(pluginPath, file.to)
  
  if (existsSync(sourceFile)) {
    processFile(sourceFile, targetFile)
    console.log(`  ✓ Created ${file.to}`)
  } else {
    console.warn(`  ⚠ File not found: ${file.from}`)
  }
}

// Update PluginManager
const managerPath = join(__dirname, '../src/plugins/manager.ts')
if (existsSync(managerPath)) {
  let managerContent = readFileSync(managerPath, 'utf-8')
  
  // Add import
  const importLine = `import { ${pluginName}Plugin } from './${pluginName}/index'`
  if (!managerContent.includes(importLine)) {
    // Find last import line
    const lastImportMatch = managerContent.match(/import.*from.*['"]\.\/.*['"]/g)
    if (lastImportMatch) {
      const lastImport = lastImportMatch[lastImportMatch.length - 1]
      const insertIndex = managerContent.indexOf(lastImport) + lastImport.length
      managerContent = 
        managerContent.slice(0, insertIndex) + 
        '\n' + importLine + 
        managerContent.slice(insertIndex)
    }
  }
  
  // Add registration in constructor
  const registerLine = `    this.register(${pluginName}Plugin)`
  if (!managerContent.includes(registerLine)) {
    // Find last register
    const registerMatch = managerContent.match(/this\.register\(.*\)/g)
    if (registerMatch) {
      const lastRegister = registerMatch[registerMatch.length - 1]
      const insertIndex = managerContent.indexOf(lastRegister) + lastRegister.length
      managerContent = 
        managerContent.slice(0, insertIndex) + 
        '\n' + registerLine + 
        managerContent.slice(insertIndex)
    }
  }
  
  writeFileSync(managerPath, managerContent, 'utf-8')
  console.log(`  ✓ Updated PluginManager`)
}

// Update index.ts
const indexPath = join(__dirname, '../src/plugins/index.ts')
if (existsSync(indexPath)) {
  let indexContent = readFileSync(indexPath, 'utf-8')
  
  // Add export
  const exportLine = `export { ${pluginName}Plugin } from './${pluginName}/index'`
  if (!indexContent.includes(exportLine)) {
    // Find last export line
    const lastExportMatch = indexContent.match(/export.*from.*['"]\.\/.*['"]/g)
    if (lastExportMatch) {
      const lastExport = lastExportMatch[lastExportMatch.length - 1]
      const insertIndex = indexContent.indexOf(lastExport) + lastExport.length
      indexContent = 
        indexContent.slice(0, insertIndex) + 
        '\n' + exportLine + 
        indexContent.slice(insertIndex)
    }
  }
  
  writeFileSync(indexPath, indexContent, 'utf-8')
  console.log(`  ✓ Updated index.ts`)
}

// Validate if plugin.metadata.ts was created correctly
const metadataFile = join(pluginPath, 'plugin.metadata.ts')
if (existsSync(metadataFile)) {
  console.log(`  ✓ Validating plugin.metadata.ts...`)
  try {
    const metadataContent = readFileSync(metadataFile, 'utf-8')
    
    // Check if it has the correct export
    const expectedExport = `${pluginName}PluginMetadata`
    if (!metadataContent.includes(expectedExport)) {
      console.warn(`  ⚠ Warning: plugin.metadata.ts does not contain expected export: ${expectedExport}`)
    }
    
    // Check basic required fields
    const requiredFields = ['displayName', 'description', 'category', 'icon', 'sections']
    const missingFields = requiredFields.filter(field => !metadataContent.includes(field))
    if (missingFields.length > 0) {
      console.warn(`  ⚠ Warning: plugin.metadata.ts may be missing fields: ${missingFields.join(', ')}`)
    }
  } catch (error) {
    console.warn(`  ⚠ Could not validate plugin.metadata.ts: ${error}`)
  }
}

// Generate metadata automatically
console.log(`\n📝 Generating metadata...`)
try {
  const { execSync } = require('child_process')
  execSync('pnpm generate-metadata', {
    cwd: join(__dirname, '..'),
    stdio: 'inherit',
  })
  console.log(`  ✓ Metadata generated automatically`)
} catch (error: any) {
  console.warn(`  ⚠ Could not generate metadata automatically`)
  console.warn(`     Error: ${error.message || error}`)
  console.warn(`     Run manually: pnpm generate-metadata`)
}

console.log(`\n✅ Plugin "${pluginName}" created successfully!`)
console.log(`\n📝 Next steps:`)
console.log(`   1. Edit src/plugins/${pluginName}/plugin.metadata.ts to configure sections and options`)
console.log(`   2. Edit src/plugins/${pluginName}/types.ts to define your types`)
console.log(`   3. Implement src/plugins/${pluginName}/services/fetchData.ts`)
console.log(`   4. Implement src/plugins/${pluginName}/components/Render${PluginName}.tsx`)
console.log(`   5. Run pnpm generate-metadata to update centralized metadata`)
console.log(`   6. Test with pnpm dev`)
