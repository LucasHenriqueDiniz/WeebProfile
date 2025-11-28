#!/usr/bin/env tsx
/**
 * Script para limpar arquivos compilados (.js e .d.ts) do diretório src/
 * 
 * Esses arquivos não deveriam estar em src/, apenas em dist/
 */

import { readdir, stat, unlink } from 'fs/promises'
import { join } from 'path'

async function cleanCompiledFiles(dir: string): Promise<number> {
  let cleanedCount = 0

  try {
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)

      if (entry.isDirectory()) {
        // Ignorar node_modules e dist
        if (entry.name === 'node_modules' || entry.name === 'dist') {
          continue
        }
        cleanedCount += await cleanCompiledFiles(fullPath)
      } else if (entry.isFile()) {
        // Remover arquivos .js e .d.ts que não sejam em dist/
        if (entry.name.endsWith('.js') || entry.name.endsWith('.d.ts')) {
          // Verificar se não é um arquivo fonte (ex: arquivo .js que é realmente fonte)
          // Mas como allowJs: false, não deveria haver .js em src/
          const stats = await stat(fullPath)
          console.log(`Removendo: ${fullPath}`)
          await unlink(fullPath)
          cleanedCount++
        }
      }
    }
  } catch (error) {
    // Ignorar erros de permissão ou arquivos que não existem
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error(`Erro ao processar ${dir}:`, error)
    }
  }

  return cleanedCount
}

async function main() {
  const srcDir = join(process.cwd(), 'src')
  console.log(`Limpando arquivos compilados de ${srcDir}...`)
  
  const cleaned = await cleanCompiledFiles(srcDir)
  
  if (cleaned > 0) {
    console.log(`✅ Removidos ${cleaned} arquivo(s) compilado(s) de src/`)
  } else {
    console.log(`✅ Nenhum arquivo compilado encontrado em src/`)
  }
}

main().catch(console.error)












