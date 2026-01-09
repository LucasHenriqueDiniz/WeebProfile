/**
 * Script para gerar metadata.ts centralizado a partir dos arquivos plugin.metadata.ts de cada plugin
 * 
 * Este script:
 * 1. Lê todos os arquivos plugin.metadata.ts de cada plugin
 * 2. Gera o metadata.ts centralizado automaticamente
 * 3. Mantém a estrutura e tipos corretos
 * 
 * Execute: pnpm tsx scripts/generate-metadata.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PLUGINS_DIR = path.join(__dirname, '../src/plugins')
const OUTPUT_FILE = path.join(PLUGINS_DIR, 'metadata.ts')
const DASHBOARD_MESSAGES_DIR = path.join(__dirname, '../../weeb-dashboard/messages')
const PLUGINS_I18N_DIR = path.join(DASHBOARD_MESSAGES_DIR, 'plugins')
const I18N_REQUEST_FILE = path.join(__dirname, '../../weeb-dashboard/i18n/request.ts')

/**
 * Descobre automaticamente os plugins disponíveis
 * Procura por diretórios que contêm plugin.metadata.ts
 */
function discoverPlugins(): string[] {
  const plugins: string[] = []
  
  if (!fs.existsSync(PLUGINS_DIR)) {
    console.warn(`⚠️  Plugins directory not found: ${PLUGINS_DIR}`)
    return []
  }
  
  const entries = fs.readdirSync(PLUGINS_DIR, { withFileTypes: true })
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const pluginName = entry.name
      
      // Ignorar diretórios que começam com _ (templates, etc)
      if (pluginName.startsWith('_')) {
        continue
      }
      
      const metadataPath = path.join(PLUGINS_DIR, pluginName, 'plugin.metadata.ts')
      
      if (fs.existsSync(metadataPath)) {
        plugins.push(pluginName)
      }
    }
  }
  
  return plugins.sort() // Ordenar para consistência
}

interface PluginMetadataPartial {
  displayName: string
  description: string
  category: 'coding' | 'music' | 'anime' | 'gaming'
  icon: string
  requiredFields: string[]
  essentialConfigKeys: string[]
  essentialConfigKeysMetadata: Array<{
    key: string
    label: string
    type: 'text' | 'password'
    placeholder?: string
    description?: string
    helpUrl?: string
    docKey?: string
  }>
  sections: Array<{
    id: string
    name: string
    description?: string
    configOptions?: Array<{
      key: string
      label: string
      type: 'number' | 'boolean' | 'string' | 'select' | 'array'
      defaultValue?: any
      min?: number
      max?: number
      step?: number
      description?: string
      placeholder?: string
      required?: boolean
      tooltip?: string
      options?: Array<{ value: string; label: string }>
    }>
  }>
  globalConfigOptions?: Array<{
    key: string
    label: string
    type: 'number' | 'boolean' | 'string' | 'select'
    defaultValue?: any
    min?: number
    max?: number
    step?: number
    description?: string
    tooltip?: string
    options?: Array<{ value: string; label: string }>
  }>
  exampleConfig?: Record<string, any>
}

function validateMetadata(metadata: PluginMetadataPartial, pluginName: string): string[] {
  const errors: string[] = []
  
  // Validar campos obrigatórios
  if (!metadata.displayName) {
    errors.push(`Missing displayName`)
  }
  if (!metadata.description) {
    errors.push(`Missing description`)
  }
  if (!metadata.category) {
    errors.push(`Missing category`)
  } else if (!['coding', 'music', 'anime', 'gaming'].includes(metadata.category)) {
    errors.push(`Invalid category: ${metadata.category}. Must be one of: coding, music, anime, gaming`)
  }
  if (!metadata.icon) {
    errors.push(`Missing icon`)
  }
  if (!Array.isArray(metadata.requiredFields)) {
    errors.push(`requiredFields must be an array`)
  }
  if (!Array.isArray(metadata.essentialConfigKeys)) {
    errors.push(`essentialConfigKeys must be an array`)
  }
  if (!Array.isArray(metadata.essentialConfigKeysMetadata)) {
    errors.push(`essentialConfigKeysMetadata must be an array`)
  }
  if (!Array.isArray(metadata.sections)) {
    errors.push(`sections must be an array`)
  }
  
  // Validar essentialConfigKeysMetadata
  if (metadata.essentialConfigKeysMetadata) {
    metadata.essentialConfigKeysMetadata.forEach((meta, index) => {
      if (!meta.key) {
        errors.push(`essentialConfigKeysMetadata[${index}]: missing key`)
      }
      if (!meta.label) {
        errors.push(`essentialConfigKeysMetadata[${index}]: missing label`)
      }
      if (!meta.type || !['text', 'password', 'oauth'].includes(meta.type)) {
        errors.push(`essentialConfigKeysMetadata[${index}]: invalid type. Must be 'text', 'password', or 'oauth'`)
      }
    })
  }
  
  // Validar sections
  if (metadata.sections) {
    metadata.sections.forEach((section, index) => {
      if (!section.id) {
        errors.push(`sections[${index}]: missing id`)
      }
      if (!section.name) {
        errors.push(`sections[${index}]: missing name`)
      }
      
      // Validar configOptions
      if (section.configOptions) {
        section.configOptions.forEach((opt, optIndex) => {
          if (!opt.key) {
            errors.push(`sections[${index}].configOptions[${optIndex}]: missing key`)
          }
          if (!opt.label) {
            errors.push(`sections[${index}].configOptions[${optIndex}]: missing label`)
          }
          if (!opt.type || !['number', 'boolean', 'string', 'select', 'array'].includes(opt.type)) {
            errors.push(`sections[${index}].configOptions[${optIndex}]: invalid type. Must be 'number', 'boolean', 'string', 'select', or 'array'`)
          }
          
          // Validar opções para select
          if (opt.type === 'select' && (!opt.options || !Array.isArray(opt.options))) {
            errors.push(`sections[${index}].configOptions[${optIndex}]: select type requires options array`)
          }
          
          // Validar min/max para number
          if (opt.type === 'number') {
            if (opt.min !== undefined && typeof opt.min !== 'number') {
              errors.push(`sections[${index}].configOptions[${optIndex}]: min must be a number`)
            }
            if (opt.max !== undefined && typeof opt.max !== 'number') {
              errors.push(`sections[${index}].configOptions[${optIndex}]: max must be a number`)
            }
            if (opt.min !== undefined && opt.max !== undefined && opt.min > opt.max) {
              errors.push(`sections[${index}].configOptions[${optIndex}]: min (${opt.min}) cannot be greater than max (${opt.max})`)
            }
          }
        })
      }
    })
  }
  
  return errors
}

async function loadPluginMetadata(pluginName: string): Promise<PluginMetadataPartial | null> {
  const metadataPath = path.join(PLUGINS_DIR, pluginName, 'plugin.metadata.ts')
  
  if (!fs.existsSync(metadataPath)) {
    console.warn(`⚠️  plugin.metadata.ts not found for ${pluginName}, skipping...`)
    return null
  }

  try {
    // Importar dinamicamente o módulo TypeScript
    // O tsx/ts-node já está configurado para lidar com isso
    const modulePath = `../src/plugins/${pluginName}/plugin.metadata.ts`
    const module = await import(modulePath)
    
    // Procurar pela exportação do metadata (pode ter nomes diferentes)
    const exportKey = Object.keys(module).find(key => 
      key.includes('PluginMetadata') || key.includes('metadata')
    )
    
    if (!exportKey) {
      console.error(`❌ Could not find metadata export in ${pluginName}/plugin.metadata.ts`)
      console.error(`   Expected export name like: ${pluginName}PluginMetadata or ${pluginName}PluginMetadata`)
      return null
    }
    
    const metadata = module[exportKey] as PluginMetadataPartial
    
    // Validar metadata
    const errors = validateMetadata(metadata, pluginName)
    if (errors.length > 0) {
      console.error(`❌ Validation errors in ${pluginName}/plugin.metadata.ts:`)
      errors.forEach(error => console.error(`   - ${error}`))
      return null
    }
    
    return metadata
  } catch (error: any) {
    console.error(`❌ Error loading metadata for ${pluginName}:`, error.message || error)
    if (error.stack) {
      console.error(`   Stack: ${error.stack.split('\n')[1]}`)
    }
    return null
  }
}

function stringifyValue(value: any, indent = 2): string {
  if (value === null || value === undefined) {
    return 'null'
  }
  
  if (typeof value === 'string') {
    return JSON.stringify(value)
  }
  
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const items = value.map(item => {
      const itemStr = stringifyValue(item, indent + 2)
      return ' '.repeat(indent + 2) + itemStr
    }).join(',\n')
    return `[\n${items}\n${' '.repeat(indent)}]`
  }
  
  if (typeof value === 'object') {
    const entries = Object.entries(value)
    if (entries.length === 0) return '{}'
    const props = entries.map(([key, val]) => {
      const valStr = stringifyValue(val, indent + 2)
      return `${' '.repeat(indent + 2)}${key}: ${valStr}`
    }).join(',\n')
    return `{\n${props}\n${' '.repeat(indent)}}`
  }
  
  return JSON.stringify(value)
}

/**
 * Generate deterministic i18n key based on plugin ID and path
 */
function generateI18nKey(pluginId: string, path: string[]): string {
  return `plugins.${pluginId}.${path.join('.')}`
}

/**
 * Extract all string fields from metadata for i18n
 */
interface ExtractedString {
  value: string
  key: string
  path: string[]
}

interface ExtractedStrings {
  displayName: ExtractedString
  description: ExtractedString
  essentialConfig: Record<string, Record<string, ExtractedString>>
  sections: Record<string, {
    name: ExtractedString
    description?: ExtractedString
    config: Record<string, Record<string, ExtractedString>>
  }>
}

function extractStringFields(metadata: PluginMetadataPartial, pluginId: string): ExtractedStrings {
  const extracted: ExtractedStrings = {
    displayName: {
      value: metadata.displayName,
      key: generateI18nKey(pluginId, ['displayName']),
      path: ['displayName']
    },
    description: {
      value: metadata.description,
      key: generateI18nKey(pluginId, ['description']),
      path: ['description']
    },
    essentialConfig: {},
    sections: {}
  }

  // Extract essential config keys metadata
  metadata.essentialConfigKeysMetadata.forEach((meta) => {
    extracted.essentialConfig[meta.key] = {}
    if (meta.label) {
      extracted.essentialConfig[meta.key].label = {
        value: meta.label,
        key: generateI18nKey(pluginId, ['essentialConfig', meta.key, 'label']),
        path: ['essentialConfig', meta.key, 'label']
      }
    }
    if (meta.placeholder) {
      extracted.essentialConfig[meta.key].placeholder = {
        value: meta.placeholder,
        key: generateI18nKey(pluginId, ['essentialConfig', meta.key, 'placeholder']),
        path: ['essentialConfig', meta.key, 'placeholder']
      }
    }
    if (meta.description) {
      extracted.essentialConfig[meta.key].description = {
        value: meta.description,
        key: generateI18nKey(pluginId, ['essentialConfig', meta.key, 'description']),
        path: ['essentialConfig', meta.key, 'description']
      }
    }
  })

  // Extract sections
  metadata.sections.forEach((section) => {
    extracted.sections[section.id] = {
      name: {
        value: section.name,
        key: generateI18nKey(pluginId, ['sections', section.id, 'name']),
        path: ['sections', section.id, 'name']
      },
      config: {}
    }

    if (section.description) {
      extracted.sections[section.id].description = {
        value: section.description,
        key: generateI18nKey(pluginId, ['sections', section.id, 'description']),
        path: ['sections', section.id, 'description']
      }
    }

    // Extract config options
    section.configOptions?.forEach((option) => {
      extracted.sections[section.id].config[option.key] = {}
      
      if (option.label) {
        extracted.sections[section.id].config[option.key].label = {
          value: option.label,
          key: generateI18nKey(pluginId, ['sections', section.id, 'config', option.key, 'label']),
          path: ['sections', section.id, 'config', option.key, 'label']
        }
      }
      if (option.description) {
        extracted.sections[section.id].config[option.key].description = {
          value: option.description,
          key: generateI18nKey(pluginId, ['sections', section.id, 'config', option.key, 'description']),
          path: ['sections', section.id, 'config', option.key, 'description']
        }
      }
      if (option.tooltip) {
        extracted.sections[section.id].config[option.key].tooltip = {
          value: option.tooltip,
          key: generateI18nKey(pluginId, ['sections', section.id, 'config', option.key, 'tooltip']),
          path: ['sections', section.id, 'config', option.key, 'tooltip']
        }
      }
      if (option.placeholder) {
        extracted.sections[section.id].config[option.key].placeholder = {
          value: option.placeholder,
          key: generateI18nKey(pluginId, ['sections', section.id, 'config', option.key, 'placeholder']),
          path: ['sections', section.id, 'config', option.key, 'placeholder']
        }
      }
      // For string editables, include defaultValue in i18n
      if (option.type === 'string' && option.defaultValue && typeof option.defaultValue === 'string') {
        extracted.sections[section.id].config[option.key].defaultValue = {
          value: option.defaultValue,
          key: generateI18nKey(pluginId, ['sections', section.id, 'config', option.key, 'defaultValue']),
          path: ['sections', section.id, 'config', option.key, 'defaultValue']
        }
      }
      // Extract select options
      if (option.type === 'select' && option.options) {
        option.options.forEach((opt) => {
          if (!extracted.sections[section.id].config[option.key].options) {
            extracted.sections[section.id].config[option.key].options = {} as any
          }
          (extracted.sections[section.id].config[option.key].options as any)[opt.value] = {
            value: opt.label,
            key: generateI18nKey(pluginId, ['sections', section.id, 'config', option.key, 'options', opt.value]),
            path: ['sections', section.id, 'config', option.key, 'options', opt.value]
          }
        })
      }
    })
  })

  return extracted
}

/**
 * Generate i18n JSON structure from extracted strings
 */
function generateI18nJson(extracted: ExtractedStrings, pluginId: string): any {
  const json: any = {
    displayName: extracted.displayName.value,
    description: extracted.description.value
  }

  // Essential config
  if (Object.keys(extracted.essentialConfig).length > 0) {
    json.essentialConfig = {}
    Object.entries(extracted.essentialConfig).forEach(([key, fields]) => {
      json.essentialConfig[key] = {}
      Object.entries(fields).forEach(([field, extracted]) => {
        json.essentialConfig[key][field] = extracted.value
      })
    })
  }

  // Sections
  if (Object.keys(extracted.sections).length > 0) {
    json.sections = {}
    Object.entries(extracted.sections).forEach(([sectionId, section]) => {
      json.sections[sectionId] = {
        name: section.name.value
      }
      if (section.description) {
        json.sections[sectionId].description = section.description.value
      }
      if (Object.keys(section.config).length > 0) {
        json.sections[sectionId].config = {}
        Object.entries(section.config).forEach(([optionKey, fields]) => {
          json.sections[sectionId].config[optionKey] = {}
          Object.entries(fields).forEach(([field, extracted]) => {
            if (field === 'options') {
              // Handle options separately
              json.sections[sectionId].config[optionKey].options = {}
              Object.entries(extracted as any).forEach(([value, opt]) => {
                json.sections[sectionId].config[optionKey].options[value] = (opt as ExtractedString).value
              })
            } else {
              json.sections[sectionId].config[optionKey][field] = (extracted as ExtractedString).value
            }
          })
        })
      }
    })
  }

  return json
}

/**
 * Deep merge two objects, preserving existing values in target for PT/ES
 */
function deepMerge(target: any, source: any, preserveExisting: boolean): any {
  const result = { ...target }

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!result[key] || typeof result[key] !== 'object') {
        result[key] = {}
      }
      result[key] = deepMerge(result[key], source[key], preserveExisting)
    } else {
      // Only overwrite if preserveExisting is false OR key doesn't exist in target
      if (!preserveExisting || !(key in result)) {
        result[key] = source[key]
      }
    }
  }

  return result
}

/**
 * Sort object keys recursively for stable diffs
 */
function sortKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sortKeys)
  }
  if (obj && typeof obj === 'object') {
    const sorted: any = {}
    Object.keys(obj).sort().forEach(key => {
      sorted[key] = sortKeys(obj[key])
    })
    return sorted
  }
  return obj
}

/**
 * Write plugin i18n JSON to separate file: messages/plugins/{pluginId}/{locale}.json
 */
function writePluginI18nFile(locale: string, pluginId: string, pluginJson: any, prune: boolean = false): void {
  // Create plugins directory structure if it doesn't exist
  const pluginDir = path.join(PLUGINS_I18N_DIR, pluginId)
  if (!fs.existsSync(pluginDir)) {
    fs.mkdirSync(pluginDir, { recursive: true })
  }
  
  const pluginFilePath = path.join(pluginDir, `${locale}.json`)
  
  // For EN: always update values (read existing to merge new keys)
  // For PT/ES: preserve existing translations (merge intelligently)
  const preserveExisting = locale !== 'en'
  
  let existingPlugin: any = {}
  if (fs.existsSync(pluginFilePath)) {
    try {
      const content = fs.readFileSync(pluginFilePath, 'utf-8')
      existingPlugin = JSON.parse(content)
    } catch (error) {
      console.warn(`⚠️  Error reading ${pluginFilePath}:`, error)
    }
  }
  
  let finalPluginJson: any
  if (prune && locale === 'en') {
    // For EN with prune, replace completely
    finalPluginJson = sortKeys(pluginJson)
  } else {
    // Merge preserving existing translations for PT/ES, updating EN values
    finalPluginJson = sortKeys(deepMerge(existingPlugin, pluginJson, preserveExisting))
  }
  
  // Write the plugin-specific file
  fs.writeFileSync(pluginFilePath, JSON.stringify(finalPluginJson, null, 2) + '\n', 'utf-8')
  console.log(`✅ Generated messages/plugins/${pluginId}/${locale}.json`)
}

/**
 * Enrich metadata with i18nKey objects
 */
interface EnrichedMetadata extends PluginMetadataPartial {
  i18nKey?: {
    displayName: string
    description: string
  }
  essentialConfigKeysMetadata: Array<{
    key: string
    label: string
    type: 'text' | 'password' | 'oauth'
    placeholder?: string
    description?: string
    helpUrl?: string
    docKey?: string
    oauthProvider?: string
    i18nKey?: {
      label?: string
      placeholder?: string
      description?: string
    }
  }>
  sections: Array<{
    id: string
    name: string
    description?: string
    i18nKey?: {
      name: string
      description?: string
    }
    configOptions?: Array<{
      key: string
      label: string
      type: 'number' | 'boolean' | 'string' | 'select' | 'array'
      defaultValue?: any
      min?: number
      max?: number
      step?: number
      description?: string
      placeholder?: string
      required?: boolean
      tooltip?: string
      options?: Array<{ value: string; label: string }>
      i18nKey?: {
        label?: string
        description?: string
        tooltip?: string
        placeholder?: string
        defaultValue?: string
        options?: Record<string, string>
      }
    }>
  }>
}

function enrichMetadataWithI18n(metadata: PluginMetadataPartial, pluginId: string, extracted: ExtractedStrings): EnrichedMetadata {
  const enriched: EnrichedMetadata = {
    ...metadata,
    i18nKey: {
      displayName: extracted.displayName.key,
      description: extracted.description.key
    },
    essentialConfigKeysMetadata: metadata.essentialConfigKeysMetadata.map(meta => {
      const i18nKey: any = {}
      if (extracted.essentialConfig[meta.key]?.label) {
        i18nKey.label = extracted.essentialConfig[meta.key].label.key
      }
      if (extracted.essentialConfig[meta.key]?.placeholder) {
        i18nKey.placeholder = extracted.essentialConfig[meta.key].placeholder.key
      }
      if (extracted.essentialConfig[meta.key]?.description) {
        i18nKey.description = extracted.essentialConfig[meta.key].description.key
      }
      return {
        ...meta,
        ...(Object.keys(i18nKey).length > 0 && { i18nKey })
      }
    }),
    sections: metadata.sections.map(section => {
      const sectionExtracted = extracted.sections[section.id]
      if (!sectionExtracted) return section
      
      const sectionI18nKey: any = {
        name: sectionExtracted.name.key
      }
      if (sectionExtracted.description) {
        sectionI18nKey.description = sectionExtracted.description.key
      }
      
      return {
        ...section,
        i18nKey: sectionI18nKey,
        configOptions: section.configOptions?.map(option => {
          const optionExtracted = sectionExtracted.config[option.key]
          if (!optionExtracted) return option
          
          const optionI18nKey: any = {}
          if (optionExtracted.label) {
            optionI18nKey.label = optionExtracted.label.key
          }
          if (optionExtracted.description) {
            optionI18nKey.description = optionExtracted.description.key
          }
          if (optionExtracted.tooltip) {
            optionI18nKey.tooltip = optionExtracted.tooltip.key
          }
          if (optionExtracted.placeholder) {
            optionI18nKey.placeholder = optionExtracted.placeholder.key
          }
          if (optionExtracted.defaultValue && option.type === 'string') {
            optionI18nKey.defaultValue = optionExtracted.defaultValue.key
          }
          if (optionExtracted.options && option.type === 'select') {
            optionI18nKey.options = {}
            Object.entries(optionExtracted.options as any).forEach(([value, opt]: [string, any]) => {
              optionI18nKey.options[value] = opt.key
            })
          }
          
          return {
            ...option,
            ...(Object.keys(optionI18nKey).length > 0 && { i18nKey: optionI18nKey })
          }
        })
      }
    })
  }
  
  return enriched
}

function generateMetadataFile(pluginsMetadata: Map<string, PluginMetadataPartial>, enrichedMap: Map<string, EnrichedMetadata>): string {
  const header = `/**
 * Centralized metadata for all plugins
 * 
 * This file serves as a single index of all available plugins,
 * their sections, configurations and options. When a new plugin is added,
 * it must be registered here to appear automatically everywhere.
 * 
 * ⚠️  THIS FILE IS AUTO-GENERATED - DO NOT EDIT MANUALLY ⚠️
 * 
 * To update this file:
 * 1. Edit the plugin.metadata.ts file in each plugin directory
 * 2. Run: pnpm tsx scripts/generate-metadata.ts
 */

/**
 * Plugin category
 */
export type PluginCategory = "coding" | "music" | "anime" | "gaming"

/**
 * I18n key map for translatable fields
 */
export interface I18nKeyMap {
  label?: string
  description?: string
  tooltip?: string
  placeholder?: string
  defaultValue?: string // For string editables only
  options?: Record<string, string> // For select options
}

/**
 * Metadata for an essential configuration key (API key, token, etc)
 */
export interface EssentialConfigKeyMetadata {
  key: string
  label: string
  type: "text" | "password" | "oauth"
  placeholder?: string
  description?: string
  helpUrl?: string // Direct link to create/get token (e.g., https://github.com/settings/personal-access-tokens/new)
  docKey?: string // Key for future documentation (e.g., "github.pat")
  oauthProvider?: "spotify" // OAuth provider when type === "oauth"
  i18nKey?: {
    label?: string
    placeholder?: string
    description?: string
  }
}

/**
 * Configuration option for a section
 */
export interface SectionConfigOption {
  key: string
  label: string
  type: "number" | "boolean" | "string" | "select" | "array"
  defaultValue?: any
  min?: number
  max?: number
  step?: number
  description?: string
  placeholder?: string
  required?: boolean
  tooltip?: string
  options?: { value: string; label: string }[]
  i18nKey?: I18nKeyMap
}

/**
 * Available section of a plugin
 */
export interface PluginSection {
  id: string
  name: string
  description?: string
  i18nKey?: {
    name: string
    description?: string
  }
  configOptions?: SectionConfigOption[]
}

/**
 * Complete metadata of a plugin
 */
export interface PluginMetadata {
  name: string
  displayName: string
  description: string
  category: PluginCategory
  icon: string // Name of lucide-react icon (e.g., "Github", "Music", "BookOpen")
  requiredFields: string[]
  essentialConfigKeys: string[] // Kept for compatibility, but use essentialConfigKeysMetadata
  essentialConfigKeysMetadata: EssentialConfigKeyMetadata[] // Complete metadata of essential keys
  sections: PluginSection[]
  globalConfigOptions?: SectionConfigOption[] // Global configuration options (apply to all sections)
  exampleConfig?: Record<string, any>
  i18nKey?: {
    displayName: string
    description: string
  }
}

/**
 * Metadata de todos os plugins disponíveis
 * 
 * Usa \`satisfies\` para garantir type safety completo sem perder inferência de tipos
 * 
 * ⚠️  AUTO-GENERATED - DO NOT EDIT MANUALLY ⚠️
 */
export const PLUGINS_METADATA = {
`

  /**
   * Verifica se um nome precisa usar notação de colchetes (começa com número ou contém caracteres especiais)
   */
  const needsBracketNotation = (name: string): boolean => {
    // Se começa com número ou contém caracteres que não são válidos em identificadores
    return /^[0-9]/.test(name) || !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)
  }

  const plugins = Array.from(pluginsMetadata.entries())
    .map(([name, metadata]) => {
      const enriched = enrichedMap.get(name)
      if (!enriched) {
        // Fallback to original metadata if enrichment failed
        console.warn(`⚠️  No enriched metadata for ${name}, using original`)
      }
      const meta = enriched || metadata
      
      // Gerar sections
      const sectionsStr = meta.sections.map((section, idx) => {
        const originalSection = metadata.sections[idx]
        let sectionStr = `      {\n        id: ${JSON.stringify(section.id)},\n        name: ${JSON.stringify(section.name)}`
        
        if (section.description) {
          sectionStr += `,\n        description: ${JSON.stringify(section.description)}`
        }
        
        // Add section i18nKey if available
        if (section.i18nKey) {
          sectionStr += `,\n        i18nKey: {\n          name: ${JSON.stringify(section.i18nKey.name)}`
          if (section.i18nKey.description) {
            sectionStr += `,\n          description: ${JSON.stringify(section.i18nKey.description)}`
          }
          sectionStr += '\n        }'
        }
        
        if (section.configOptions && section.configOptions.length > 0) {
          const configOptionsStr = section.configOptions.map((opt, optIdx) => {
            const originalOpt = originalSection?.configOptions?.[optIdx]
            let optStr = `        {\n          key: ${JSON.stringify(opt.key)},\n          label: ${JSON.stringify(opt.label)},\n          type: ${JSON.stringify(opt.type)}`
            
            if (opt.defaultValue !== undefined) {
              optStr += `,\n          defaultValue: ${JSON.stringify(opt.defaultValue)}`
            }
            if (opt.min !== undefined) {
              optStr += `,\n          min: ${opt.min}`
            }
            if (opt.max !== undefined) {
              optStr += `,\n          max: ${opt.max}`
            }
            if (opt.step !== undefined) {
              optStr += `,\n          step: ${opt.step}`
            }
            if (opt.description) {
              optStr += `,\n          description: ${JSON.stringify(opt.description)}`
            }
            if (opt.placeholder) {
              optStr += `,\n          placeholder: ${JSON.stringify(opt.placeholder)}`
            }
            if (opt.required !== undefined) {
              optStr += `,\n          required: ${opt.required}`
            }
            if (opt.tooltip) {
              optStr += `,\n          tooltip: ${JSON.stringify(opt.tooltip)}`
            }
            if (opt.options && Array.isArray(opt.options)) {
              const optionsStr = opt.options.map(o => 
                `            { value: ${JSON.stringify(o.value)}, label: ${JSON.stringify(o.label)} }`
              ).join(',\n')
              optStr += `,\n          options: [\n${optionsStr}\n          ]`
            }
            
            // Add i18nKey if available
            if (opt.i18nKey) {
              optStr += ',\n          i18nKey: {'
              const i18nParts: string[] = []
              if (opt.i18nKey.label) {
                i18nParts.push(`\n            label: ${JSON.stringify(opt.i18nKey.label)}`)
              }
              if (opt.i18nKey.description) {
                i18nParts.push(`\n            description: ${JSON.stringify(opt.i18nKey.description)}`)
              }
              if (opt.i18nKey.tooltip) {
                i18nParts.push(`\n            tooltip: ${JSON.stringify(opt.i18nKey.tooltip)}`)
              }
              if (opt.i18nKey.placeholder) {
                i18nParts.push(`\n            placeholder: ${JSON.stringify(opt.i18nKey.placeholder)}`)
              }
              if (opt.i18nKey.defaultValue) {
                i18nParts.push(`\n            defaultValue: ${JSON.stringify(opt.i18nKey.defaultValue)}`)
              }
              if (opt.i18nKey.options && Object.keys(opt.i18nKey.options).length > 0) {
                const optionsI18nStr = Object.entries(opt.i18nKey.options).map(([value, key]) =>
                  `              ${JSON.stringify(value)}: ${JSON.stringify(key)}`
                ).join(',\n')
                i18nParts.push(`\n            options: {\n${optionsI18nStr}\n            }`)
              }
              optStr += i18nParts.join(',')
              optStr += '\n          }'
            }
            
            optStr += '\n        }'
            return optStr
          }).join(',\n')
          
          sectionStr += `,\n        configOptions: [\n${configOptionsStr}\n        ]`
        }
        
        sectionStr += '\n      }'
        return sectionStr
      }).join(',\n')
      
      // Gerar essentialConfigKeysMetadata
      const essentialMetadataStr = meta.essentialConfigKeysMetadata.map((metaItem) => {
        let metaStr = `        {\n          key: ${JSON.stringify(metaItem.key)},\n          label: ${JSON.stringify(metaItem.label)},\n          type: ${JSON.stringify(metaItem.type)}`
        
        if (metaItem.placeholder) {
          metaStr += `,\n          placeholder: ${JSON.stringify(metaItem.placeholder)}`
        }
        if (metaItem.description) {
          metaStr += `,\n          description: ${JSON.stringify(metaItem.description)}`
        }
        if (metaItem.helpUrl) {
          metaStr += `,\n          helpUrl: ${JSON.stringify(metaItem.helpUrl)}`
        }
        if (metaItem.docKey) {
          metaStr += `,\n          docKey: ${JSON.stringify(metaItem.docKey)}`
        }
        if (metaItem.oauthProvider) {
          metaStr += `,\n          oauthProvider: ${JSON.stringify(metaItem.oauthProvider)}`
        }
        
        // Add i18nKey if available
        if (metaItem.i18nKey) {
          metaStr += ',\n          i18nKey: {'
          const i18nParts: string[] = []
          if (metaItem.i18nKey.label) {
            i18nParts.push(`\n            label: ${JSON.stringify(metaItem.i18nKey.label)}`)
          }
          if (metaItem.i18nKey.placeholder) {
            i18nParts.push(`\n            placeholder: ${JSON.stringify(metaItem.i18nKey.placeholder)}`)
          }
          if (metaItem.i18nKey.description) {
            i18nParts.push(`\n            description: ${JSON.stringify(metaItem.i18nKey.description)}`)
          }
          metaStr += i18nParts.join(',')
          metaStr += '\n          }'
        }
        
        metaStr += '\n        }'
        return metaStr
      }).join(',\n')
      
      // Gerar globalConfigOptions
      let globalConfigOptionsStr = ''
      if (metadata.globalConfigOptions && metadata.globalConfigOptions.length > 0) {
        const globalOptionsStr = metadata.globalConfigOptions.map(opt => {
          let optStr = `        {\n          key: ${JSON.stringify(opt.key)},\n          label: ${JSON.stringify(opt.label)},\n          type: ${JSON.stringify(opt.type)}`
          
          if (opt.defaultValue !== undefined) {
            optStr += `,\n          defaultValue: ${JSON.stringify(opt.defaultValue)}`
          }
          if (opt.min !== undefined) {
            optStr += `,\n          min: ${opt.min}`
          }
          if (opt.max !== undefined) {
            optStr += `,\n          max: ${opt.max}`
          }
          if (opt.step !== undefined) {
            optStr += `,\n          step: ${opt.step}`
          }
          if (opt.description) {
            optStr += `,\n          description: ${JSON.stringify(opt.description)}`
          }
          if (opt.placeholder) {
            optStr += `,\n          placeholder: ${JSON.stringify(opt.placeholder)}`
          }
          if (opt.required !== undefined) {
            optStr += `,\n          required: ${opt.required}`
          }
          if (opt.tooltip) {
            optStr += `,\n          tooltip: ${JSON.stringify(opt.tooltip)}`
          }
          if (opt.options && Array.isArray(opt.options)) {
            const optionsStr = opt.options.map(o => 
              `            { value: ${JSON.stringify(o.value)}, label: ${JSON.stringify(o.label)} }`
            ).join(',\n')
            optStr += `,\n          options: [\n${optionsStr}\n          ]`
          }
          
          optStr += '\n        }'
          return optStr
        }).join(',\n')
        
        globalConfigOptionsStr = `,\n    globalConfigOptions: [\n${globalOptionsStr}\n    ]`
      }
      
      // Formatar exampleConfig
      const formatObject = (obj: any, indent: number) => {
        if (!obj || Object.keys(obj).length === 0) return '{}'
        const lines = JSON.stringify(obj, null, 2).split('\n')
        return lines.map((line, i) => i === 0 ? line : ' '.repeat(indent) + line).join('\n')
      }
      
      // Usar notação de colchetes se o nome começar com número ou tiver caracteres inválidos
      const keyNotation = needsBracketNotation(name) ? `[${JSON.stringify(name)}]` : name
      
      // Add plugin-level i18nKey if available
      let i18nKeyStr = ''
      if (meta.i18nKey) {
        i18nKeyStr = `,\n    i18nKey: {\n      displayName: ${JSON.stringify(meta.i18nKey.displayName)},\n      description: ${JSON.stringify(meta.i18nKey.description)}\n    }`
      }
      
      return `  ${keyNotation}: {
    name: ${JSON.stringify(name)},
    displayName: ${JSON.stringify(meta.displayName)},
    description: ${JSON.stringify(meta.description)},
    category: ${JSON.stringify(meta.category)},
    icon: ${JSON.stringify(meta.icon)},
    requiredFields: ${JSON.stringify(meta.requiredFields)},
    essentialConfigKeys: ${JSON.stringify(meta.essentialConfigKeys)},
    essentialConfigKeysMetadata: [
${essentialMetadataStr}
    ],
    sections: [
${sectionsStr}
    ]${globalConfigOptionsStr}${i18nKeyStr},
    exampleConfig: ${formatObject(meta.exampleConfig, 4)},
  },`
    })
    .join('\n\n')

  const footer = `} as const satisfies Record<string, PluginMetadata>

/**
 * Helper functions para trabalhar com metadata
 */

export function getPluginMetadata(pluginName: string): PluginMetadata | undefined {
  return (PLUGINS_METADATA as Record<string, PluginMetadata>)[pluginName]
}

export function getAllPluginsMetadata(): PluginMetadata[] {
  return Object.values(PLUGINS_METADATA)
}

export function getPluginSections(pluginName: string): PluginSection[] {
  const plugin = (PLUGINS_METADATA as Record<string, PluginMetadata>)[pluginName]
  return plugin?.sections || []
}

export function getPluginCategory(pluginName: string): PluginCategory | undefined {
  return (PLUGINS_METADATA as Record<string, PluginMetadata>)[pluginName]?.category
}

export function getPluginsByCategory(category: PluginCategory): PluginMetadata[] {
  return Object.values(PLUGINS_METADATA).filter((plugin) => plugin.category === category)
}

/**
 * Retorna plugins agrupados por categoria
 */
export function getPluginsGroupedByCategory(): Record<PluginCategory, PluginMetadata[]> {
  const grouped: Record<PluginCategory, PluginMetadata[]> = {
    coding: [],
    music: [],
    anime: [],
    gaming: [],
  }
  
  Object.values(PLUGINS_METADATA).forEach((plugin) => {
    grouped[plugin.category].push(plugin)
  })
  
  return grouped
}

/**
 * Retorna as opções de configuração de uma seção específica
 */
export function getSectionConfigOptions(
  pluginName: string,
  sectionId: string
): SectionConfigOption[] {
  const plugin = (PLUGINS_METADATA as Record<string, PluginMetadata>)[pluginName]
  if (!plugin) {
    return []
  }
  
  const section = plugin.sections.find((s) => s.id === sectionId)
  return section?.configOptions || []
}

/**
 * Valida se um nome de plugin é válido
 */
export function isValidPluginName(name: string): name is keyof typeof PLUGINS_METADATA {
  return name in PLUGINS_METADATA
}

/**
 * Valida se uma categoria é válida
 */
export function isValidCategory(category: string): category is PluginCategory {
  return ['coding', 'music', 'anime', 'gaming'].includes(category)
}

/**
 * Valida se um objeto é um PluginMetadata válido
 */
export function isValidPluginMetadata(obj: any): obj is PluginMetadata {
  if (!obj || typeof obj !== 'object') {
    return false
  }
  
  return (
    typeof obj.name === 'string' &&
    typeof obj.displayName === 'string' &&
    typeof obj.description === 'string' &&
    isValidCategory(obj.category) &&
    typeof obj.icon === 'string' &&
    Array.isArray(obj.requiredFields) &&
    Array.isArray(obj.essentialConfigKeys) &&
    Array.isArray(obj.essentialConfigKeysMetadata) &&
    Array.isArray(obj.sections)
  )
}
`

  return header + plugins + '\n' + footer
}

async function main() {
  console.log('🔍 Generating metadata.ts from plugin.metadata.ts files...\n')

  // Check for --prune flag
  const prune = process.argv.includes('--prune')

  // Descobrir plugins automaticamente
  const PLUGINS = discoverPlugins()
  
  if (PLUGINS.length === 0) {
    console.error('❌ No plugins found! Make sure you have plugin.metadata.ts files in your plugin directories.')
    process.exit(1)
  }
  
  console.log(`📦 Discovered ${PLUGINS.length} plugin(s): ${PLUGINS.join(', ')}\n`)

  const pluginsMetadata = new Map<string, PluginMetadataPartial>()
  const enrichedMap = new Map<string, EnrichedMetadata>()

  for (const pluginName of PLUGINS) {
    console.log(`📦 Loading metadata for ${pluginName}...`)
    const metadata = await loadPluginMetadata(pluginName)
    if (metadata) {
      pluginsMetadata.set(pluginName, metadata)
      
      // Extract strings and enrich metadata with i18nKey
      console.log(`  📝 Extracting i18n strings for ${pluginName}...`)
      const extracted = extractStringFields(metadata, pluginName)
      const enriched = enrichMetadataWithI18n(metadata, pluginName, extracted)
      enrichedMap.set(pluginName, enriched)
      
      // Generate i18n JSON and write to separate plugin files
      console.log(`  🌐 Generating i18n JSON for ${pluginName}...`)
      const pluginJson = generateI18nJson(extracted, pluginName)
      
      // Write separate files for each locale
      for (const locale of ['en', 'pt', 'es']) {
        writePluginI18nFile(locale, pluginName, pluginJson, prune && locale === 'en')
      }
      
      console.log(`✅ Loaded ${pluginName} (${metadata.sections.length} sections)`)
    }
  }

  if (pluginsMetadata.size === 0) {
    console.error('❌ No plugin metadata found!')
    process.exit(1)
  }

  console.log(`\n📝 Generating metadata.ts with ${pluginsMetadata.size} plugins...`)
  const content = generateMetadataFile(pluginsMetadata, enrichedMap)
  
  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8')
  console.log(`✅ Generated ${OUTPUT_FILE}`)
  
  // Update i18n/request.ts with discovered plugin list
  console.log(`\n📝 Updating i18n/request.ts with plugin list...`)
  updateI18nRequestFile(Array.from(PLUGINS))
  console.log(`✅ Updated i18n/request.ts`)
  
  console.log(`\n✨ Done! Metadata generated for ${pluginsMetadata.size} plugins.`)
}

/**
 * Update i18n/request.ts to include discovered plugin list
 */
function updateI18nRequestFile(pluginList: string[]): void {
  if (!fs.existsSync(I18N_REQUEST_FILE)) {
    console.warn(`⚠️  i18n/request.ts not found at ${I18N_REQUEST_FILE}`)
    return
  }
  
  try {
    let content = fs.readFileSync(I18N_REQUEST_FILE, 'utf-8')
    
    // Sort plugin list for consistency
    const sortedPlugins = [...pluginList].sort()
    
    // Find and replace the knownPlugins array
    const pluginsArrayStr = sortedPlugins.map(p => `    '${p}'`).join(',\n')
    const newPluginsArray = `[\n${pluginsArrayStr},\n  ]`
    
    // Use regex to find and replace the knownPlugins array
    // Matches: const knownPlugins = [ ... (with newlines and spaces) ... ]
    const pluginsArrayRegex = /const knownPlugins\s*=\s*\[[\s\S]*?\]/
    if (pluginsArrayRegex.test(content)) {
      content = content.replace(pluginsArrayRegex, `const knownPlugins = ${newPluginsArray}`)
      fs.writeFileSync(I18N_REQUEST_FILE, content, 'utf-8')
    } else {
      console.warn(`⚠️  Could not find knownPlugins array in i18n/request.ts`)
    }
  } catch (error) {
    console.warn(`⚠️  Error updating i18n/request.ts:`, error)
  }
}

main().catch((error) => {
  console.error('❌ Error generating metadata:', error)
  process.exit(1)
})

