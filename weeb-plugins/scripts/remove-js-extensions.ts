#!/usr/bin/env tsx
/**
 * Script para remover extensão .js de imports relativos
 * Necessário ao voltar de Node16 para bundler moduleResolution
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

function removeJsExtensions(filePath: string): boolean {
  const content = readFileSync(filePath, 'utf8')
  let modified = false
  let newContent = content

  // Regex para encontrar imports relativos com extensão .js
  // Match: import ... from "./path.js" ou import ... from "../path.js" ou "./path/index.js"
  const importRegex = /from\s+['"](\.\.?\/[^'"]+)\.js['"]/g

  newContent = content.replace(importRegex, (match, importPath) => {
    modified = true
    // Remover .js, mas manter /index se for /index.js
    if (importPath.endsWith('/index')) {
      return match.replace('/index.js', '/index')
    }
    return match.replace('.js', '')
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
      entry.name.endsWith('.d.ts') ||
      entry.name.endsWith('.js')
    ) {
      continue
    }

    if (entry.isDirectory()) {
      processDirectory(fullPath, filesFixed)
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      if (removeJsExtensions(fullPath)) {
        filesFixed.push(fullPath)
      }
    }
  }

  return filesFixed
}

function main() {
  console.log('🔧 Removendo extensões .js dos imports no weeb-plugins...\n')

  const srcDir = join(process.cwd(), 'src')
  const filesFixed = processDirectory(srcDir)

  console.log(`\n✅ ${filesFixed.length} arquivo(s) corrigido(s)`)
  
  if (filesFixed.length > 0) {
    console.log('\nArquivos corrigidos:')
    filesFixed.forEach(file => console.log(`  - ${file.replace(process.cwd(), '.')}`))
  }
}

main()

