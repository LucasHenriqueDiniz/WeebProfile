#!/usr/bin/env tsx
/**
 * Script para adicionar extensão .js em imports relativos em arquivos compilados
 * Necessário para ES modules funcionarem corretamente
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

function addJsExtensions(filePath: string): boolean {
  const content = readFileSync(filePath, 'utf8')
  let modified = false
  let newContent = content

  // Regex para encontrar imports relativos SEM extensão .js
  // Match: import ... from "./path" ou import ... from "../path" (mas não "./path.js" ou "./path/index")
  const importRegex = /from\s+['"](\.\.?\/[^'"]+)(?<!\.js)(?<!\/index)['"]/g

  newContent = content.replace(importRegex, (match, importPath) => {
    // Não adicionar se já tiver extensão ou for /index
    if (importPath.endsWith('.js') || importPath.endsWith('/index')) {
      return match
    }
    
    // Verificar se o arquivo existe (para evitar adicionar em imports de tipos)
    const possiblePath = join(filePath, '..', importPath + '.js')
    try {
      if (statSync(possiblePath).isFile()) {
        modified = true
        return match.replace(importPath, importPath + '.js')
      }
    } catch {
      // Arquivo não existe, pode ser um import de tipo ou algo que não precisa de extensão
    }
    
    return match
  })

  if (modified) {
    writeFileSync(filePath, newContent, 'utf8')
    console.log(`✅ Corrigido: ${filePath}`)
    return true
  }

  return false
}

function processDirectory(dir: string, filesFixed: string[] = []): string[] {
  const entries = readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    // Ignorar node_modules e arquivos que não são .js
    if (
      entry.name === 'node_modules' ||
      entry.name.startsWith('.') ||
      entry.name.endsWith('.d.ts')
    ) {
      continue
    }

    if (entry.isDirectory()) {
      processDirectory(fullPath, filesFixed)
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      if (addJsExtensions(fullPath)) {
        filesFixed.push(fullPath)
      }
    }
  }

  return filesFixed
}

function main() {
  console.log('🔧 Adicionando extensões .js nos imports compilados...\n')

  const distDir = join(process.cwd(), 'dist')
  const filesFixed = processDirectory(distDir)

  console.log(`\n✅ ${filesFixed.length} arquivo(s) corrigido(s)`)
  
  if (filesFixed.length > 0) {
    console.log('\nArquivos corrigidos:')
    filesFixed.forEach(file => console.log(`  - ${file.replace(process.cwd(), '.')}`))
  }
}

main()

