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
      type: 'number' | 'boolean' | 'string' | 'select'
      defaultValue?: any
      min?: number
      max?: number
      step?: number
      description?: string
      placeholder?: string
      required?: boolean
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
    options?: Array<{ value: string; label: string }>
  }>
  exampleConfig?: Record<string, any>
  defaultConfig?: {
    enabled?: boolean
    sections?: string[]
    username?: string
    [key: string]: any
  }
  fieldDefaults?: Record<string, any>
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
      if (!meta.type || !['text', 'password'].includes(meta.type)) {
        errors.push(`essentialConfigKeysMetadata[${index}]: invalid type. Must be 'text' or 'password'`)
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
          if (!opt.type || !['number', 'boolean', 'string', 'select'].includes(opt.type)) {
            errors.push(`sections[${index}].configOptions[${optIndex}]: invalid type. Must be 'number', 'boolean', 'string', or 'select'`)
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

function generateMetadataFile(pluginsMetadata: Map<string, PluginMetadataPartial>): string {
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
 * Metadata for an essential configuration key (API key, token, etc)
 */
export interface EssentialConfigKeyMetadata {
  key: string
  label: string
  type: "text" | "password"
  placeholder?: string
  description?: string
  helpUrl?: string // Direct link to create/get token (e.g., https://github.com/settings/personal-access-tokens/new)
  docKey?: string // Key for future documentation (e.g., "github.pat")
}

/**
 * Configuration option for a section
 */
export interface SectionConfigOption {
  key: string
  label: string
  type: "number" | "boolean" | "string" | "select"
  defaultValue?: any
  min?: number
  max?: number
  step?: number
  description?: string
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
}

/**
 * Available section of a plugin
 */
export interface PluginSection {
  id: string
  name: string
  description?: string
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
  /**
   * Configuração padrão do plugin
   * Usado quando plugin é adicionado pela primeira vez
   */
  defaultConfig?: {
    enabled?: boolean
    sections?: string[]
    username?: string
    [key: string]: any
  }
  /**
   * Valores padrão para campos específicos
   */
  fieldDefaults?: Record<string, any>
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
      // Gerar sections
      const sectionsStr = metadata.sections.map(section => {
        let sectionStr = `      {\n        id: ${JSON.stringify(section.id)},\n        name: ${JSON.stringify(section.name)}`
        
        if (section.description) {
          sectionStr += `,\n        description: ${JSON.stringify(section.description)}`
        }
        
        if (section.configOptions && section.configOptions.length > 0) {
          const configOptionsStr = section.configOptions.map(opt => {
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
            if (opt.options && Array.isArray(opt.options)) {
              const optionsStr = opt.options.map(o => 
                `            { value: ${JSON.stringify(o.value)}, label: ${JSON.stringify(o.label)} }`
              ).join(',\n')
              optStr += `,\n          options: [\n${optionsStr}\n          ]`
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
      const essentialMetadataStr = metadata.essentialConfigKeysMetadata.map(meta => {
        let metaStr = `        {\n          key: ${JSON.stringify(meta.key)},\n          label: ${JSON.stringify(meta.label)},\n          type: ${JSON.stringify(meta.type)}`
        
        if (meta.placeholder) {
          metaStr += `,\n          placeholder: ${JSON.stringify(meta.placeholder)}`
        }
        if (meta.description) {
          metaStr += `,\n          description: ${JSON.stringify(meta.description)}`
        }
        if (meta.helpUrl) {
          metaStr += `,\n          helpUrl: ${JSON.stringify(meta.helpUrl)}`
        }
        if (meta.docKey) {
          metaStr += `,\n          docKey: ${JSON.stringify(meta.docKey)}`
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
      
      // Formatar exampleConfig, defaultConfig e fieldDefaults
      const formatObject = (obj: any, indent: number) => {
        if (!obj || Object.keys(obj).length === 0) return '{}'
        const lines = JSON.stringify(obj, null, 2).split('\n')
        return lines.map((line, i) => i === 0 ? line : ' '.repeat(indent) + line).join('\n')
      }
      
      // Usar notação de colchetes se o nome começar com número ou tiver caracteres inválidos
      const keyNotation = needsBracketNotation(name) ? `[${JSON.stringify(name)}]` : name
      
      return `  ${keyNotation}: {
    name: ${JSON.stringify(name)},
    displayName: ${JSON.stringify(metadata.displayName)},
    description: ${JSON.stringify(metadata.description)},
    category: ${JSON.stringify(metadata.category)},
    icon: ${JSON.stringify(metadata.icon)},
    requiredFields: ${JSON.stringify(metadata.requiredFields)},
    essentialConfigKeys: ${JSON.stringify(metadata.essentialConfigKeys)},
    essentialConfigKeysMetadata: [
${essentialMetadataStr}
    ],
    sections: [
${sectionsStr}
    ]${globalConfigOptionsStr},
    exampleConfig: ${formatObject(metadata.exampleConfig, 4)},
    defaultConfig: ${formatObject(metadata.defaultConfig, 4)},
    fieldDefaults: ${formatObject(metadata.fieldDefaults, 4)},
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

  // Descobrir plugins automaticamente
  const PLUGINS = discoverPlugins()
  
  if (PLUGINS.length === 0) {
    console.error('❌ No plugins found! Make sure you have plugin.metadata.ts files in your plugin directories.')
    process.exit(1)
  }
  
  console.log(`📦 Discovered ${PLUGINS.length} plugin(s): ${PLUGINS.join(', ')}\n`)

  const pluginsMetadata = new Map<string, PluginMetadataPartial>()

  for (const pluginName of PLUGINS) {
    console.log(`📦 Loading metadata for ${pluginName}...`)
    const metadata = await loadPluginMetadata(pluginName)
    if (metadata) {
      pluginsMetadata.set(pluginName, metadata)
      console.log(`✅ Loaded ${pluginName} (${metadata.sections.length} sections)`)
    }
  }

  if (pluginsMetadata.size === 0) {
    console.error('❌ No plugin metadata found!')
    process.exit(1)
  }

  console.log(`\n📝 Generating metadata.ts with ${pluginsMetadata.size} plugins...`)
  const content = generateMetadataFile(pluginsMetadata)
  
  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8')
  console.log(`✅ Generated ${OUTPUT_FILE}`)
  console.log(`\n✨ Done! Metadata generated for ${pluginsMetadata.size} plugins.`)
}

main().catch((error) => {
  console.error('❌ Error generating metadata:', error)
  process.exit(1)
})

