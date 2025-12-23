#!/usr/bin/env tsx
/**
 * Script para adicionar extensão .js em todos os imports relativos
 * Necessário para ESM no Node.js
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs'
import { join, extname, dirname } from 'path'

function fixImportsInFile(filePath: string): boolean {
  const content = readFileSync(filePath, 'utf8')
  let modified = false
  let newContent = content
  const fileDir = dirname(filePath)

  // Regex para encontrar imports relativos sem extensão .js
  // Match: import ... from "./path" ou import ... from "../path"
  // Mas não match: import ... from "./path.js" (já tem extensão)
  const importRegex = /from\s+['"](\.\.?\/[^'"]+)(?<!\.js)['"]/g

  newContent = content.replace(importRegex, (match, importPath) => {
    // Não adicionar .js se já tiver extensão ou for um arquivo de tipo
    if (importPath.endsWith('.js') || importPath.endsWith('.d.ts')) {
      return match
    }
    
    // Não adicionar se for um diretório (termina com /)
    if (importPath.endsWith('/')) {
      return match
    }

    // Verificar se é um diretório com index.ts
    const resolvedPath = join(fileDir, importPath)
    const indexPath = join(resolvedPath, 'index.ts')
    const indexJsPath = join(resolvedPath, 'index.js')
    
    if (existsSync(resolvedPath) && (existsSync(indexPath) || existsSync(indexJsPath))) {
      // É um diretório com index, adicionar /index.js
      modified = true
      return match.replace(importPath, `${importPath}/index.js`)
    }

    // Verificar se o arquivo .ts existe
    const tsPath = `${resolvedPath}.ts`
    const tsxPath = `${resolvedPath}.tsx`
    
    if (existsSync(tsPath) || existsSync(tsxPath)) {
      // É um arquivo, adicionar .js
      modified = true
      return match.replace(importPath, `${importPath}.js`)
    }

    // Se não encontrou, assumir que é arquivo e adicionar .js
    modified = true
    return match.replace(importPath, `${importPath}.js`)
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

    // Ignorar node_modules, dist, e arquivos gerados
    if (
      entry.name === 'node_modules' ||
      entry.name === 'dist' ||
      entry.name.startsWith('.') ||
      entry.name === 'generated.ts' ||
      entry.name.endsWith('.d.ts')
    ) {
      continue
    }

    if (entry.isDirectory()) {
      processDirectory(fullPath, filesFixed)
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      if (fixImportsInFile(fullPath)) {
        filesFixed.push(fullPath)
      }
    }
  }

  return filesFixed
}

function main() {
  console.log('🔧 Corrigindo imports ESM no weeb-plugins...\n')

  const srcDir = join(process.cwd(), 'src')
  const filesFixed = processDirectory(srcDir)

  console.log(`\n✅ ${filesFixed.length} arquivo(s) corrigido(s)`)
  
  if (filesFixed.length > 0) {
    console.log('\nArquivos corrigidos:')
    filesFixed.forEach(file => console.log(`  - ${file.replace(process.cwd(), '.')}`))
  }
}

main()

