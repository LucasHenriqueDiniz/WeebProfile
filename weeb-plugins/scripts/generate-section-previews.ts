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

import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PLUGINS_DIR = path.join(__dirname, "../src/plugins")
const DASHBOARD_DIR = path.join(__dirname, "../../weeb-dashboard")
const OUTPUT_FILE = path.join(DASHBOARD_DIR, "lib/config/section-previews.ts")
const DASHBOARD_PREVIEWS_DIR = path.join(DASHBOARD_DIR, "public/previews")
const STYLES = ["default", "terminal"] as const

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
 * Caminho do preview de uma seção (source, em weeb-plugins) para um estilo específico
 */
function previewSourcePath(pluginName: string, sectionId: string, style: (typeof STYLES)[number]): string {
  return path.join(PLUGINS_DIR, pluginName, "previews", style, `${sectionId}.svg`)
}

/**
 * Verifica quais estilos têm preview disponível para uma seção
 */
function checkAvailableStyles(pluginName: string, sectionId: string): Array<(typeof STYLES)[number]> {
  return STYLES.filter((style) => fs.existsSync(previewSourcePath(pluginName, sectionId, style)))
}

/**
 * Copia os SVGs de preview de weeb-plugins para weeb-dashboard/public/previews,
 * onde o Vite os serve como assets estáticos em /previews/**.
 */
function copyPreviewToDashboard(pluginName: string, sectionId: string, style: (typeof STYLES)[number]): void {
  const src = previewSourcePath(pluginName, sectionId, style)
  const destDir = path.join(DASHBOARD_PREVIEWS_DIR, pluginName, style)
  const dest = path.join(destDir, `${sectionId}.svg`)

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  fs.copyFileSync(src, dest)
}

/**
 * Gera o conteúdo do arquivo section-previews.ts
 */
function generateSectionPreviewsFile(
  pluginsData: Map<string, Array<{ section: string; styles: Array<(typeof STYLES)[number]> }>>
): string {
  const header = `// Mapeamento de seções para previews de imagem
// AUTO-GENERATED - DO NOT EDIT MANUALLY
// Execute: pnpm generate-section-previews (in weeb-plugins)
//
// Este arquivo é gerado automaticamente a partir dos plugins em weeb-plugins
// e verifica quais previews existem (por estilo) na pasta previews/ de cada plugin.
// Os arquivos são copiados para weeb-dashboard/public/previews/ pelo mesmo script.

export const SECTION_PREVIEWS: Record<string, Record<string, { default: boolean; terminal: boolean }>> = {
`

  const plugins = Array.from(pluginsData.entries()).sort()
  const pluginEntries: string[] = []

  for (const [pluginName, sections] of plugins) {
    const sectionEntries: string[] = []

    for (const { section, styles } of sections) {
      if (styles.length > 0) {
        sectionEntries.push(
          `    ${section}: { default: ${styles.includes("default")}, terminal: ${styles.includes("terminal")} },`
        )
      }
    }

    if (sectionEntries.length > 0) {
      const pluginKey =
        /^[0-9]/.test(pluginName) || !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(pluginName)
          ? JSON.stringify(pluginName)
          : pluginName

      pluginEntries.push(`  ${pluginKey}: {\n${sectionEntries.join("\n")}\n  },`)
    }
  }

  const footer = `}

export function getSectionPreview(plugin: string, section: string, style: "default" | "terminal" = "default"): string | null {
  const info = SECTION_PREVIEWS[plugin]?.[section]
  if (!info) return null

  // Usa o estilo pedido se existir; senão cai para "default" (melhor que nada).
  const usableStyle = info[style] ? style : info.default ? "default" : null
  if (!usableStyle) return null

  return \`/previews/\${plugin}/\${usableStyle}/\${section}.svg\`
}
`

  return header + pluginEntries.join("\n\n") + "\n" + footer
}

/**
 * Main
 */
async function main() {
  console.log("🔍 Gerando section-previews.ts...\n")

  if (!fs.existsSync(DASHBOARD_DIR)) {
    console.error(`❌ Dashboard directory not found: ${DASHBOARD_DIR}`)
    process.exit(1)
  }

  const plugins = discoverPlugins()
  const pluginsData = new Map<string, Array<{ section: string; styles: Array<(typeof STYLES)[number]> }>>()

  for (const pluginName of plugins) {
    const sections = await getPluginSections(pluginName)
    const sectionsData: Array<{ section: string; styles: Array<(typeof STYLES)[number]> }> = []

    for (const sectionId of sections) {
      const styles = checkAvailableStyles(pluginName, sectionId)
      sectionsData.push({ section: sectionId, styles })

      for (const style of styles) {
        copyPreviewToDashboard(pluginName, sectionId, style)
      }
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

  fs.writeFileSync(OUTPUT_FILE, content, "utf-8")

  // Estatísticas
  let totalSections = 0
  let totalWithDefault = 0
  let totalWithTerminal = 0

  for (const [, sections] of pluginsData) {
    totalSections += sections.length
    totalWithDefault += sections.filter((s) => s.styles.includes("default")).length
    totalWithTerminal += sections.filter((s) => s.styles.includes("terminal")).length
  }

  console.log(`\n✅ section-previews.ts gerado em: ${OUTPUT_FILE}`)
  console.log(`✅ Arquivos copiados para: ${DASHBOARD_PREVIEWS_DIR}`)
  console.log(`\n📊 Estatísticas:`)
  console.log(`   Plugins: ${pluginsData.size}`)
  console.log(`   Seções totais: ${totalSections}`)
  console.log(`   Com preview default: ${totalWithDefault} (${((totalWithDefault / totalSections) * 100).toFixed(1)}%)`)
  console.log(`   Com preview terminal: ${totalWithTerminal} (${((totalWithTerminal / totalSections) * 100).toFixed(1)}%)`)

  if (totalSections - totalWithDefault > 0) {
    console.log(`\n⚠️  Algumas seções não têm preview default. Execute "pnpm generate-preview-images" primeiro.`)
  }
}

main().catch((error) => {
  console.error("Erro ao gerar section-previews.ts:", error)
  process.exit(1)
})
