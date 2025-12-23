/**
 * Script para gerar section-previews.ts automaticamente
 * 
 * Este script:
 * 1. Descobre todos os plugins disponíveis
 * 2. Para cada plugin, lê as seções do metadata
 * 3. Verifica quais previews existem na pasta previews/
 * 4. Gera o arquivo section-previews.ts no dashboard
 * 
 * Execute: pnpm tsx scripts/generate-section-previews.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PLUGINS_DIR = path.join(__dirname, '../src/plugins')
const DASHBOARD_DIR = path.join(__dirname, '../../weeb-dashboard')
const OUTPUT_FILE = path.join(DASHBOARD_DIR, 'lib/config/section-previews.ts')

/**
 * Descobre todos os plugins disponíveis
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
  
  return plugins.sort()
}

/**
 * Lê o metadata de um plugin e extrai as seções
 */
async function getPluginSections(pluginName: string): Promise<string[]> {
  const metadataPath = path.join(PLUGINS_DIR, pluginName, 'plugin.metadata.ts')
  
  if (!fs.existsSync(metadataPath)) {
    return []
  }
  
  try {
    // Importar dinamicamente o metadata
    const metadataModule = await import(`../src/plugins/${pluginName}/plugin.metadata.ts`)
    const metadata = metadataModule[`${pluginName}PluginMetadata`] || metadataModule.default
    
    if (!metadata || !metadata.sections) {
      return []
    }
    
    return metadata.sections.map((section: any) => section.id)
  } catch (error) {
    console.error(`Error reading metadata for ${pluginName}:`, error)
    return []
  }
}

/**
 * Verifica se um preview existe
 */
function checkPreviewExists(pluginName: string, sectionId: string): boolean {
  const previewsDir = path.join(PLUGINS_DIR, pluginName, 'previews')
  const previewFileName = `${pluginName}_${sectionId}.svg`
  const previewPath = path.join(previewsDir, previewFileName)
  
  return fs.existsSync(previewPath)
}

/**
 * Gera o conteúdo do arquivo section-previews.ts
 */
function generateSectionPreviewsFile(pluginsData: Map<string, Array<{ section: string; hasPreview: boolean }>>): string {
  const header = `// Mapeamento de seções para previews de imagem
// AUTO-GENERATED - DO NOT EDIT MANUALLY
// Execute: pnpm generate-section-previews (in weeb-plugins)
// 
// Este arquivo é gerado automaticamente a partir dos plugins em weeb-plugins
// e verifica quais previews existem na pasta previews/ de cada plugin

export const SECTION_PREVIEWS: Record<string, Record<string, string>> = {
`

  const plugins = Array.from(pluginsData.entries()).sort()
  const pluginEntries: string[] = []

  for (const [pluginName, sections] of plugins) {
    const sectionEntries: string[] = []
    
    for (const { section, hasPreview } of sections) {
      if (hasPreview) {
        // Usar o formato: plugin/default/section.svg
        sectionEntries.push(`    ${section}: "${pluginName}/default/${section}.svg",`)
      }
    }
    
    if (sectionEntries.length > 0) {
      const pluginKey = /^[0-9]/.test(pluginName) || !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(pluginName)
        ? JSON.stringify(pluginName)
        : pluginName
      
      pluginEntries.push(`  ${pluginKey}: {\n${sectionEntries.join('\n')}\n  },`)
    }
  }

  const footer = `}

export function getSectionPreview(plugin: string, section: string, style: "default" | "terminal" = "default"): string | null {
  const pluginPreviews = SECTION_PREVIEWS[plugin]
  if (!pluginPreviews) return null

  // Sempre usar default, não importa o style
  const previewPath = pluginPreviews[section]
  if (!previewPath) return null

  // Usar rota API para servir as imagens
  return \`/api/section-preview/\${previewPath}\`
}
`

  return header + pluginEntries.join('\n\n') + '\n' + footer
}

/**
 * Main
 */
async function main() {
  console.log('🔍 Gerando section-previews.ts...\n')
  
  if (!fs.existsSync(DASHBOARD_DIR)) {
    console.error(`❌ Dashboard directory not found: ${DASHBOARD_DIR}`)
    process.exit(1)
  }
  
  const plugins = discoverPlugins()
  const pluginsData = new Map<string, Array<{ section: string; hasPreview: boolean }>>()
  
  for (const pluginName of plugins) {
    const sections = await getPluginSections(pluginName)
    const sectionsData: Array<{ section: string; hasPreview: boolean }> = []
    
    for (const sectionId of sections) {
      const hasPreview = checkPreviewExists(pluginName, sectionId)
      sectionsData.push({ section: sectionId, hasPreview })
    }
    
    if (sectionsData.length > 0) {
      pluginsData.set(pluginName, sectionsData)
    }
  }
  
  const content = generateSectionPreviewsFile(pluginsData)
  
  // Garantir que o diretório existe
  const outputDir = path.dirname(OUTPUT_FILE)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8')
  
  // Estatísticas
  let totalSections = 0
  let totalWithPreview = 0
  
  for (const [, sections] of pluginsData) {
    totalSections += sections.length
    totalWithPreview += sections.filter(s => s.hasPreview).length
  }
  
  console.log(`✅ section-previews.ts gerado em: ${OUTPUT_FILE}`)
  console.log(`\n📊 Estatísticas:`)
  console.log(`   Plugins: ${pluginsData.size}`)
  console.log(`   Seções totais: ${totalSections}`)
  console.log(`   Seções com preview: ${totalWithPreview} (${((totalWithPreview / totalSections) * 100).toFixed(1)}%)`)
  console.log(`   Seções sem preview: ${totalSections - totalWithPreview}`)
  
  if (totalSections - totalWithPreview > 0) {
    console.log(`\n⚠️  Algumas seções não têm preview. Execute pnpm validate-previews para ver detalhes.`)
  }
}

main().catch((error) => {
  console.error('Erro ao gerar section-previews.ts:', error)
  process.exit(1)
})





















