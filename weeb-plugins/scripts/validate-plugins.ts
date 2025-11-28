#!/usr/bin/env tsx
/**
 * Plugin validation script for build time
 * 
 * Validates:
 * - All registered plugins have an entry in PLUGINS_METADATA
 * - essentialConfigKeys from individual plugins match essentialConfigKeysMetadata
 * - Icons exist in ICON_REGISTRY
 * - Categories are valid
 * - Sections are valid
 */

import { PLUGINS_METADATA, type PluginMetadata, type PluginCategory } from '../src/plugins/metadata.js'
import { githubPlugin } from '../src/plugins/github/index.js'
import { lastFmPlugin } from '../src/plugins/lastfm/index.js'
import { myAnimeListPlugin } from '../src/plugins/myanimelist/index.js'
import { PluginManager } from '../src/plugins/manager.js'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PLUGINS_DIR = join(__dirname, '../src/plugins')

// Import ICON_REGISTRY from weeb-dashboard (or create a local one)
// For now, we'll only validate if icon is a non-empty string
// Complete icon validation will be done in the frontend

// Register all plugins
const pluginManager = PluginManager.getInstance()
pluginManager.register(githubPlugin)
pluginManager.register(lastFmPlugin)
pluginManager.register(myAnimeListPlugin)

// Valid categories
const VALID_CATEGORIES: PluginCategory[] = ['coding', 'music', 'anime', 'gaming']

interface ValidationError {
  plugin: string
  field: string
  message: string
}

const errors: ValidationError[] = []
const warnings: ValidationError[] = []

// 1. Validate that all registered plugins have metadata
const registeredPlugins = pluginManager.getActivePlugins().map(([name]) => name)
const metadataPlugins = Object.keys(PLUGINS_METADATA)

for (const pluginName of registeredPlugins) {
  if (!metadataPlugins.includes(pluginName)) {
    errors.push({
      plugin: pluginName,
      field: 'metadata',
      message: `Plugin "${pluginName}" is registered but has no entry in PLUGINS_METADATA`
    })
  }
}

// 2. Validate that all plugins in metadata are registered
for (const pluginName of metadataPlugins) {
  const plugin = pluginManager.get(pluginName)
  if (!plugin) {
    warnings.push({
      plugin: pluginName,
      field: 'registration',
      message: `Plugin "${pluginName}" has metadata but is not registered in PluginManager`
    })
  }
}

// 3. Validate essentialConfigKeys vs essentialConfigKeysMetadata
for (const [pluginName, metadata] of Object.entries(PLUGINS_METADATA)) {
  const plugin = pluginManager.get(pluginName)
  if (!plugin) continue

  const pluginKeys = plugin.essentialConfigKeys || []
  const metadataKeys = metadata.essentialConfigKeysMetadata.map(m => m.key)

  // Check if all plugin keys are in metadata
  for (const key of pluginKeys) {
    if (!metadataKeys.includes(key)) {
      warnings.push({
        plugin: pluginName,
        field: 'essentialConfigKeys',
        message: `Key "${key}" is in essentialConfigKeys but not in essentialConfigKeysMetadata`
      })
    }
  }

  // Check if all metadata keys are in plugin (optional, can have more in metadata)
  // This is just a warning, not an error
  for (const key of metadataKeys) {
    if (!pluginKeys.includes(key)) {
      warnings.push({
        plugin: pluginName,
        field: 'essentialConfigKeys',
        message: `Key "${key}" is in metadata but not in plugin essentialConfigKeys (this is expected if using only metadata)`
      })
    }
  }
}

// 4. Validate icons (check if it's a non-empty string)
for (const [pluginName, metadata] of Object.entries(PLUGINS_METADATA)) {
  if (!metadata.icon || typeof metadata.icon !== 'string' || metadata.icon.trim() === '') {
    errors.push({
      plugin: pluginName,
      field: 'icon',
      message: `Icon must be a non-empty string`
    })
  }
}

// 5. Validate categories
for (const [pluginName, metadata] of Object.entries(PLUGINS_METADATA)) {
  if (!VALID_CATEGORIES.includes(metadata.category)) {
    errors.push({
      plugin: pluginName,
      field: 'category',
      message: `Category "${metadata.category}" is not valid. Valid categories: ${VALID_CATEGORIES.join(', ')}`
    })
  }
}

// 6. Validate sections
for (const [pluginName, metadata] of Object.entries(PLUGINS_METADATA)) {
  if (!metadata.sections || metadata.sections.length === 0) {
    errors.push({
      plugin: pluginName,
      field: 'sections',
      message: `Plugin must have at least one section defined`
    })
  } else {
    // Validate that sections have unique id
    const sectionIds = metadata.sections.map(s => s.id)
    const uniqueIds = new Set(sectionIds)
    if (sectionIds.length !== uniqueIds.size) {
      errors.push({
        plugin: pluginName,
        field: 'sections',
        message: `Sections have duplicate IDs`
      })
    }

    // Validate that each section has id and name
    for (const section of metadata.sections) {
      if (!section.id || typeof section.id !== 'string' || section.id.trim() === '') {
        errors.push({
          plugin: pluginName,
          field: 'sections',
          message: `Section must have a valid id (non-empty)`
        })
      }
      if (!section.name || typeof section.name !== 'string' || section.name.trim() === '') {
        errors.push({
          plugin: pluginName,
          field: 'sections',
          message: `Section must have a valid name (non-empty)`
        })
      }
    }
  }
}

// 7. Validate basic metadata structure
for (const [pluginName, metadata] of Object.entries(PLUGINS_METADATA)) {
  if (!metadata.name || metadata.name !== pluginName) {
    errors.push({
      plugin: pluginName,
      field: 'name',
      message: `Metadata.name must be equal to the key name ("${pluginName}")`
    })
  }

  if (!metadata.displayName || typeof metadata.displayName !== 'string') {
    errors.push({
      plugin: pluginName,
      field: 'displayName',
      message: `displayName deve ser uma string não vazia`
    })
  }

  if (!metadata.description || typeof metadata.description !== 'string') {
    errors.push({
      plugin: pluginName,
      field: 'description',
      message: `description must be a non-empty string`
    })
  }

  if (!Array.isArray(metadata.requiredFields)) {
    errors.push({
      plugin: pluginName,
      field: 'requiredFields',
      message: `requiredFields must be an array`
    })
  }

  if (!Array.isArray(metadata.essentialConfigKeysMetadata)) {
    errors.push({
      plugin: pluginName,
      field: 'essentialConfigKeysMetadata',
      message: `essentialConfigKeysMetadata must be an array`
    })
  } else {
    // Validate essentialConfigKeysMetadata structure
    for (const keyMetadata of metadata.essentialConfigKeysMetadata) {
      if (!keyMetadata.key || typeof keyMetadata.key !== 'string') {
        errors.push({
          plugin: pluginName,
          field: 'essentialConfigKeysMetadata',
          message: `essentialConfigKeysMetadata[].key must be a non-empty string`
        })
      }
      if (!keyMetadata.label || typeof keyMetadata.label !== 'string') {
        errors.push({
          plugin: pluginName,
          field: 'essentialConfigKeysMetadata',
          message: `essentialConfigKeysMetadata[].label must be a non-empty string`
        })
      }
      if (!keyMetadata.type || !['text', 'password'].includes(keyMetadata.type)) {
        errors.push({
          plugin: pluginName,
          field: 'essentialConfigKeysMetadata',
          message: `essentialConfigKeysMetadata[].type must be "text" or "password"`
        })
      }
    }
  }
}

// 8. Validate that each plugin has a heights.ts file
async function validateHeightsFiles() {
  for (const [pluginName, metadata] of Object.entries(PLUGINS_METADATA)) {
    const heightsPath = join(PLUGINS_DIR, pluginName, 'heights.ts')
    if (!existsSync(heightsPath)) {
      errors.push({
        plugin: pluginName,
        field: 'heights.ts',
        message: `Plugin must have a heights.ts file for height calculation`
      })
    } else {
      // Try to validate that the file exports the correct function
      try {
        const pluginModule = await import(`../src/plugins/${pluginName}/heights.ts`)
        // Check for common function name patterns
        const hasCalculator = Object.keys(pluginModule).some(key => 
          key.includes('Height') && typeof pluginModule[key] === 'function'
        )
        
        if (!hasCalculator) {
          warnings.push({
            plugin: pluginName,
            field: 'heights.ts',
            message: `heights.ts exists but may not export a height calculator function`
          })
        }
      } catch (importError) {
        warnings.push({
          plugin: pluginName,
          field: 'heights.ts',
          message: `Could not validate heights.ts export: ${importError instanceof Error ? importError.message : String(importError)}`
        })
      }
    }
  }
}

// Run async validation
await validateHeightsFiles()

// Report warnings first
if (warnings.length > 0) {
  console.warn('\n⚠️  Validation warnings:\n')
  warnings.forEach(warning => {
    console.warn(`  Plugin: ${warning.plugin}`)
    console.warn(`  Field: ${warning.field}`)
    console.warn(`  Warning: ${warning.message}\n`)
  })
}

// Report errors
if (errors.length > 0) {
  console.error('\n❌ Validation errors found:\n')
  errors.forEach(error => {
    console.error(`  Plugin: ${error.plugin}`)
    console.error(`  Field: ${error.field}`)
    console.error(`  Error: ${error.message}\n`)
  })
  process.exit(1)
} else {
  console.log('✅ All plugins are valid!')
  if (warnings.length > 0) {
    console.log(`⚠️  ${warnings.length} warning(s) found (see above)`)
  }
  process.exit(0)
}

