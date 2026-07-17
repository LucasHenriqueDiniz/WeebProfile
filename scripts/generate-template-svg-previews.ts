#!/usr/bin/env tsx
/**
 * Gera SVGs de preview para templates públicos e atualiza o banco
 */

import { config } from "dotenv"
import { resolve } from "path"

// Carregar variáveis de ambiente
config({ path: resolve(process.cwd(), "weeb-dashboard/.env.local") })
config({ path: resolve(process.cwd(), "weeb-dashboard/.env") })
config({ path: resolve(process.cwd(), ".env") })

import { db } from "../weeb-dashboard/lib/db"
import { templates } from "../weeb-dashboard/lib/db/schema"
import { eq } from "drizzle-orm"
import * as fs from "fs"
import * as path from "path"

const SVG_GENERATOR_URL = process.env.SVG_GENERATOR_URL || "http://localhost:3001"
const PUBLIC_PREVIEWS_DIR = path.join(process.cwd(), "weeb-dashboard/public/template-previews")

async function generateTemplatePreview(template: any): Promise<string | null> {
  try {
    // Adicionar campos obrigatórios nos plugins config
    const pluginsConfig = { ...template.pluginsConfig } as Record<string, any>

    for (const [pluginName, pluginConfig] of Object.entries(pluginsConfig)) {
      if (pluginConfig && typeof pluginConfig === "object" && (pluginConfig as any).enabled) {
        const config = pluginConfig as any

        // Adicionar username para plugins que precisam
        if (["github", "lastfm", "myanimelist"].includes(pluginName)) {
          if (!config.username) {
            config.username = "mockuser"
          }
        }

        // Adicionar personality_url para 16personalities
        if (pluginName === "16personalities") {
          if (!config.personality_url) {
            config.personality_url = "https://www.16personalities.com/br/resultados/mock-t/m/1"
          }
        }

        pluginsConfig[pluginName] = config
      }
    }

    const requestBody = {
      style: template.style,
      size: template.size,
      theme: template.theme,
      plugins: pluginsConfig,
      pluginsOrder: template.pluginsOrder?.split(",").filter(Boolean) || Object.keys(pluginsConfig || {}),
      mock: true,
      essentialConfigs: {
        github: { pat: "mock_pat_token" },
        lastfm: { apikey: "mock_api_key", username: "mockuser" },
        myanimelist: {},
        steam: { apikey: "mock_api_key", steamid: "mock_steam_id" },
        "16personalities": {},
      },
    }

    console.log(`  📤 Gerando SVG para "${template.name}"...`)

    const response = await fetch(SVG_GENERATOR_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(60000),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error(`  ❌ Error: ${response.status} ${error}`)
      return null
    }

    const result = await response.json()
    return result.svg || null
  } catch (error) {
    console.error(`  ❌ Error:`, error)
    return null
  }
}

async function main() {
  console.log("🎨 Gerando previews SVG para templates públicos...\n")

  // Verificar se svg-generator está rodando
  try {
    const testResponse = await fetch(SVG_GENERATOR_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ style: "default", size: "half", plugins: {}, pluginsOrder: [], mock: true }),
      signal: AbortSignal.timeout(5000),
    }).catch(() => null)

    if (!testResponse) {
      console.error(`❌ SVG Generator não está acessível em ${SVG_GENERATOR_URL}`)
      process.exit(1)
    }
    console.log("✅ SVG Generator está acessível\n")
  } catch (error) {
    console.error(`❌ Erro ao verificar SVG Generator:`, error)
    process.exit(1)
  }

  // Criar diretório de previews
  if (!fs.existsSync(PUBLIC_PREVIEWS_DIR)) {
    fs.mkdirSync(PUBLIC_PREVIEWS_DIR, { recursive: true })
  }

  // Buscar templates públicos
  const publicTemplates = await db.select().from(templates).where(eq(templates.isPublic, true))

  console.log(`📦 Encontrados ${publicTemplates.length} templates públicos\n`)

  let generated = 0
  for (const template of publicTemplates) {
    console.log(`📄 Template: ${template.name}`)

    const svgContent = await generateTemplatePreview(template)

    if (svgContent) {
      const fileName = `${template.id}.svg`
      const filePath = path.join(PUBLIC_PREVIEWS_DIR, fileName)

      fs.writeFileSync(filePath, svgContent, "utf-8")
      console.log(`  ✅ Preview salvo: ${filePath}\n`)
      generated++
    } else {
      console.log(`  ⚠️  Falha ao gerar preview\n`)
    }
  }

  console.log(`\n✅ Processo concluído!`)
  console.log(`   Gerados: ${generated}/${publicTemplates.length} previews`)
  console.log(`   Localização: ${PUBLIC_PREVIEWS_DIR}`)
}

main().catch((error) => {
  console.error("Erro:", error)
  process.exit(1)
})
