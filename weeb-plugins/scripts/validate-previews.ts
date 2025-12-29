/**
 * Script para validar e listar previews de seções
 * 
 * Este script:
 * 1. Verifica quais seções têm previews disponíveis
 * 2. Lista seções que estão faltando previews
 * 3. Pode ser usado para gerar previews automaticamente no futuro
 * 
 * Execute: pnpm tsx scripts/validate-previews.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PLUGINS_DIR = path.join(__dirname, '../src/plugins')

interface PreviewStatus {
  plugin: string
  section: string
  exists: boolean
  path: string
}

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
function getPluginSections(pluginName: string): string[] {
  const metadataPath = path.join(PLUGINS_DIR, pluginName, 'plugin.metadata.ts')

  if (!fs.existsSync(metadataPath)) {
    return []
  }

  try {
    // Ler o arquivo diretamente e extrair informações básicas
    const content = fs.readFileSync(metadataPath, 'utf8')

    // Procurar por seções definidas no arquivo
    const sectionMatches = content.match(/id:\s*['"`]([^'"`]+)['"`]/g)
    if (sectionMatches) {
      return sectionMatches.map(match => {
        const idMatch = match.match(/id:\s*['"`]([^'"`]+)['"`]/)
        return idMatch ? idMatch[1] : ''
      }).filter(Boolean)
    }

    return []
  } catch (error) {
    console.error(`Error reading metadata for ${pluginName}:`, error)
    return []
  }
}

/**
 * Verifica se um preview existe
 */
function checkPreviewExists(pluginName: string, sectionId: string): { exists: boolean; path: string } {
  const previewsDir = path.join(PLUGINS_DIR, pluginName, 'previews')
  const previewFileName = `${pluginName}_${sectionId}.svg`
  const previewPath = path.join(previewsDir, previewFileName)
  
  return {
    exists: fs.existsSync(previewPath),
    path: previewPath,
  }
}

/**
 * Valida todos os previews
 */
function validatePreviews(): PreviewStatus[] {
  const plugins = discoverPlugins()
  const results: PreviewStatus[] = []

  for (const pluginName of plugins) {
    const sections = getPluginSections(pluginName)

    for (const sectionId of sections) {
      const { exists, path: previewPath } = checkPreviewExists(pluginName, sectionId)

      results.push({
        plugin: pluginName,
        section: sectionId,
        exists,
        path: previewPath,
      })
    }
  }

  return results
}

/**
 * Gera relatório de previews
 */
function generateReport(results: PreviewStatus[]): void {
  const byPlugin = new Map<string, PreviewStatus[]>()
  
  for (const result of results) {
    if (!byPlugin.has(result.plugin)) {
      byPlugin.set(result.plugin, [])
    }
    byPlugin.get(result.plugin)!.push(result)
  }
  
  console.log('\n📊 Relatório de Previews\n')
  console.log('='.repeat(60))
  
  let totalSections = 0
  let totalWithPreview = 0
  let totalMissing = 0
  
  for (const [plugin, pluginResults] of Array.from(byPlugin.entries()).sort()) {
    const withPreview = pluginResults.filter(r => r.exists).length
    const missing = pluginResults.filter(r => !r.exists).length
    
    totalSections += pluginResults.length
    totalWithPreview += withPreview
    totalMissing += missing
    
    const status = missing === 0 ? '✅' : '⚠️'
    console.log(`\n${status} ${plugin}`)
    console.log(`   Total: ${pluginResults.length} | Com preview: ${withPreview} | Faltando: ${missing}`)
    
    if (missing > 0) {
      const missingSections = pluginResults.filter(r => !r.exists)
      console.log(`   Faltando previews:`)
      for (const missing of missingSections) {
        const expectedPath = path.relative(process.cwd(), missing.path)
        console.log(`     - ${missing.section} (esperado: ${expectedPath})`)
      }
    }
  }
  
  console.log('\n' + '='.repeat(60))
  console.log(`\n📈 Resumo Geral:`)
  console.log(`   Total de seções: ${totalSections}`)
  console.log(`   Com preview: ${totalWithPreview} (${((totalWithPreview / totalSections) * 100).toFixed(1)}%)`)
  console.log(`   Faltando: ${totalMissing} (${((totalMissing / totalSections) * 100).toFixed(1)}%)`)
  
  if (totalMissing > 0) {
    console.log(`\n⚠️  ${totalMissing} preview(s) faltando.`)
    console.log(`\n💡 Para gerar os previews faltantes, execute:`)
    console.log(`   pnpm generate-preview-images`)
    console.log(`\n   Certifique-se de que o svg-generator está rodando:`)
    console.log(`   cd svg-generator && pnpm dev`)
  } else {
    console.log(`\n✅ Todos os previews estão disponíveis!`)
  }
}

/**
 * Main
 */
async function main() {
  const args = process.argv.slice(2)
  const warnOnly = args.includes('--warn-only') || args.includes('-w')
  
  console.log('🔍 Validando previews de seções...\n')

  const results = validatePreviews()
  generateReport(results)
  
  const missingCount = results.filter(r => !r.exists).length
  
  if (missingCount > 0) {
    if (warnOnly) {
      console.log(`\n⚠️  ${missingCount} preview(s) faltando (modo warning - não falha o build)`)
      console.log(`\n💡 Para gerar os previews faltantes, execute:`)
      console.log(`   pnpm generate-preview-images`)
      console.log(`\n   Certifique-se de que o svg-generator está rodando:`)
      console.log(`   cd svg-generator && pnpm dev`)
      process.exit(0) // Exit com sucesso mesmo com warnings
    } else {
      console.log(`\n❌ ${missingCount} preview(s) faltando`)
      console.log(`\n💡 Para gerar os previews faltantes, execute:`)
      console.log(`   pnpm generate-preview-images`)
      console.log(`\n   Certifique-se de que o svg-generator está rodando:`)
      console.log(`   cd svg-generator && pnpm dev`)
      process.exit(1) // Falha o build
    }
  } else {
    console.log(`\n✅ Todos os previews estão disponíveis!`)
    process.exit(0)
  }
}

main().catch((error) => {
  console.error('Erro ao validar previews:', error)
  process.exit(1)
})

