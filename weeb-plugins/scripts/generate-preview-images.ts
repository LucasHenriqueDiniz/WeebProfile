/**
 * Script para gerar imagens de preview (SVG) para cada seção de plugin
 *
 * Este script:
 * 1. Descobre todos os plugins e suas seções
 * 2. Para cada seção, gera um SVG usando o svg-generator
 * 3. Salva o SVG na pasta previews/ do plugin
 *
 * Execute: pnpm generate-preview-images (in weeb-plugins)
 *
 * Requisitos:
 * - svg-generator deve estar rodando (pnpm dev no svg-generator)
 * - Ou configure SVG_GENERATOR_URL no .env
 */

import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PLUGINS_DIR = path.join(__dirname, "../src/plugins")
const SVG_GENERATOR_URL = process.env.SVG_GENERATOR_URL || "http://localhost:3001"

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
      if (pluginName.startsWith("_")) {
        continue
      }

      const metadataPath = path.join(PLUGINS_DIR, pluginName, "plugin.metadata.ts")

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
  const metadataPath = path.join(PLUGINS_DIR, pluginName, "plugin.metadata.ts")

  if (!fs.existsSync(metadataPath)) {
    return []
  }

  try {
    // Importar dinamicamente o metadata
    const metadataModule = await import(`../src/plugins/${pluginName}/plugin.metadata.ts`)

    // Tentar diferentes nomes de exportação
    // 1. Nome padrão: {pluginName}PluginMetadata
    // 2. Nome com primeira letra maiúscula: {PluginName}PluginMetadata
    // 3. Nome alternativo (ex: personality16PluginMetadata para 16personalities)
    // 4. default export
    const camelCaseName = pluginName.charAt(0).toUpperCase() + pluginName.slice(1)
    const metadata =
      metadataModule[`${pluginName}PluginMetadata`] ||
      metadataModule[`${camelCaseName}PluginMetadata`] ||
      metadataModule[`personality16PluginMetadata`] || // Caso especial para 16personalities
      Object.values(metadataModule).find((exp: any) => exp?.sections) ||
      metadataModule.default

    if (!metadata || !metadata.sections) {
      console.warn(`  ⚠️  Metadata não encontrado ou sem seções para ${pluginName}`)
      return []
    }

    return metadata.sections.map((section: any) => section.id)
  } catch (error) {
    console.error(`Error reading metadata for ${pluginName}:`, error)
    return []
  }
}

/**
 * Gera SVG para uma seção usando o svg-generator
 */
async function generatePreviewSvg(pluginName: string, sectionId: string): Promise<string | null> {
  try {
    const requestBody = {
      style: "default",
      size: "half",
      plugins: {
        [pluginName]: {
          enabled: true,
          sections: [sectionId],
        },
      },
      pluginsOrder: [pluginName],
      mock: true, // Usar dados mock para previews
    }

    const response = await fetch(SVG_GENERATOR_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error(`❌ Error generating preview for ${pluginName}/${sectionId}: ${response.status} ${error}`)
      return null
    }

    const result = await response.json()
    return result.svg || null
  } catch (error) {
    console.error(`❌ Error generating preview for ${pluginName}/${sectionId}:`, error)
    return null
  }
}

/**
 * Salva SVG na pasta previews do plugin
 */
function savePreviewSvg(pluginName: string, sectionId: string, svgContent: string): void {
  const previewsDir = path.join(PLUGINS_DIR, pluginName, "previews")
  const previewFileName = `${pluginName}_${sectionId}.svg`
  const previewPath = path.join(previewsDir, previewFileName)

  // Criar diretório se não existir
  if (!fs.existsSync(previewsDir)) {
    fs.mkdirSync(previewsDir, { recursive: true })
  }

  fs.writeFileSync(previewPath, svgContent, "utf-8")
  console.log(`  ✅ ${previewFileName}`)
}

/**
 * Main
 */
async function main() {
  // Verificar flag --force
  const force = process.argv.includes("--force")

  console.log("🎨 Gerando previews de seções...\n")
  if (force) {
    console.log("⚠️  Modo --force ativado: regenerando todos os previews\n")
  }
  console.log(`📡 SVG Generator URL: ${SVG_GENERATOR_URL}\n`)

  // Verificar se o svg-generator está acessível fazendo uma requisição de teste
  console.log("🔍 Verificando se svg-generator está acessível...")
  try {
    // Tentar gerar um SVG de teste (vai falhar se o servidor não estiver rodando)
    const testResponse = await fetch(SVG_GENERATOR_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        style: "default",
        size: "half",
        plugins: {},
        pluginsOrder: [],
        mock: true,
      }),
      signal: AbortSignal.timeout(5000),
    }).catch(() => null)

    if (!testResponse) {
      console.error(`❌ SVG Generator não está acessível em ${SVG_GENERATOR_URL}`)
      console.error(`   Certifique-se de que o svg-generator está rodando:`)
      console.error(`   cd svg-generator && pnpm dev`)
      console.error(`\n   Ou configure SVG_GENERATOR_URL no .env`)
      process.exit(1)
    }
    console.log("✅ SVG Generator está acessível\n")
  } catch (error) {
    console.error(`❌ Erro ao verificar SVG Generator:`, error)
    console.error(`   Certifique-se de que o svg-generator está rodando:`)
    console.error(`   cd svg-generator && pnpm dev`)
    process.exit(1)
  }

  const plugins = discoverPlugins()
  let totalSections = 0
  let totalGenerated = 0
  let totalSkipped = 0
  let totalFailed = 0

  for (const pluginName of plugins) {
    console.log(`\n📦 Plugin: ${pluginName}`)
    const sections = await getPluginSections(pluginName)

    if (sections.length === 0) {
      console.log(`  ⚠️  Nenhuma seção encontrada`)
      continue
    }

    totalSections += sections.length

    for (const sectionId of sections) {
      const previewsDir = path.join(PLUGINS_DIR, pluginName, "previews")
      const previewFileName = `${pluginName}_${sectionId}.svg`
      const previewPath = path.join(previewsDir, previewFileName)

      // Verificar se já existe (a menos que --force esteja ativo)
      if (!force && fs.existsSync(previewPath)) {
        console.log(`  ⏭️  ${previewFileName} (já existe, pulando)`)
        totalSkipped++
        continue
      }

      if (force && fs.existsSync(previewPath)) {
        console.log(`  🔄 Regenerando ${previewFileName}...`)
      } else {
        console.log(`  🔄 Gerando ${previewFileName}...`)
      }

      const svgContent = await generatePreviewSvg(pluginName, sectionId)

      if (svgContent) {
        savePreviewSvg(pluginName, sectionId, svgContent)
        totalGenerated++
      } else {
        console.log(`  ❌ Falha ao gerar ${previewFileName}`)
        totalFailed++
      }

      // Pequeno delay para não sobrecarregar o servidor
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  console.log(`\n${"=".repeat(60)}`)
  console.log(`\n📊 Resumo:`)
  console.log(`   Total de seções: ${totalSections}`)
  console.log(`   Gerados: ${totalGenerated}`)
  console.log(`   Já existiam: ${totalSkipped}`)
  console.log(`   Falhas: ${totalFailed}`)

  if (totalGenerated > 0) {
    console.log(`\n✅ ${totalGenerated} preview(s) gerado(s) com sucesso!`)
  }

  if (totalFailed > 0) {
    console.log(`\n⚠️  ${totalFailed} preview(s) falharam ao gerar`)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error("Erro ao gerar previews:", error)
  process.exit(1)
})
