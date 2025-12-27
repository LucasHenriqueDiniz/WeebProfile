#!/usr/bin/env tsx
/**
 * Script unificado para gerar previews de seções
 * 
 * Este script:
 * 1. Verifica se o svg-generator está rodando
 * 2. Gera as imagens SVG usando o svg-generator
 * 3. Gera o arquivo de mapeamento section-previews.ts
 * 
 * Execute: pnpm generate-previews (no root)
 * 
 * Requisitos:
 * - svg-generator deve estar rodando (pnpm dev:generator)
 * - Ou configure SVG_GENERATOR_URL no .env
 */

import { execSync } from 'child_process'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ROOT_DIR = path.join(__dirname, '..')
const PLUGINS_DIR = path.join(ROOT_DIR, 'weeb-plugins')
const SVG_GENERATOR_URL = process.env.SVG_GENERATOR_URL || 'http://localhost:3001'

async function checkSvgGenerator() {
  console.log('🔍 Verificando se svg-generator está acessível...')
  try {
    const response = await fetch(SVG_GENERATOR_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        style: 'default',
        size: 'half',
        plugins: {},
        pluginsOrder: [],
        mock: true,
      }),
      signal: AbortSignal.timeout(5000),
    }).catch(() => null)

    if (!response) {
      console.error(`❌ SVG Generator não está acessível em ${SVG_GENERATOR_URL}`)
      console.error(`   Certifique-se de que o svg-generator está rodando:`)
      console.error(`   pnpm dev:generator`)
      console.error(`\n   Ou configure SVG_GENERATOR_URL no .env`)
      process.exit(1)
    }
    console.log('✅ SVG Generator está acessível\n')
  } catch (error) {
    console.error(`❌ Erro ao verificar SVG Generator:`, error)
    console.error(`   Certifique-se de que o svg-generator está rodando:`)
    console.error(`   pnpm dev:generator`)
    process.exit(1)
  }
}

async function generatePreviewImages(force: boolean) {
  console.log('📦 Gerando imagens de preview...\n')
  try {
    const command = force ? 'pnpm generate-preview-images --force' : 'pnpm generate-preview-images'
    execSync(command, {
      cwd: PLUGINS_DIR,
      stdio: 'inherit',
    })
  } catch (error) {
    console.error('❌ Erro ao gerar previews:', error)
    process.exit(1)
  }
}

async function generateSectionPreviews() {
  console.log('\n📝 Gerando arquivo de mapeamento...\n')
  try {
    execSync('pnpm generate-section-previews', {
      cwd: PLUGINS_DIR,
      stdio: 'inherit',
    })
  } catch (error) {
    console.error('❌ Erro ao gerar mapeamento:', error)
    process.exit(1)
  }
}

async function main() {
  const force = process.argv.includes('--force')
  
  console.log('🎨 Gerador de Previews Unificado\n')
  if (force) {
    console.log('⚠️  Modo --force ativado: regenerando todos os previews\n')
  }
  console.log(`📡 SVG Generator URL: ${SVG_GENERATOR_URL}\n`)

  await checkSvgGenerator()
  await generatePreviewImages(force)
  await generateSectionPreviews()

  console.log('\n✅ Processo concluído com sucesso!')
}

main().catch((error) => {
  console.error('Erro ao gerar previews:', error)
  process.exit(1)
})

