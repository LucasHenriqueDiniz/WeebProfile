#!/usr/bin/env tsx
/**
 * Script pós-build: Adiciona extensão .js em imports relativos nos arquivos compilados
 * 
 * Isso mantém o código fonte limpo (sem .js) e funciona tanto no Vercel (transpila TS)
 * quanto no Railway (usa arquivos compilados que precisam de .js para ES modules)
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

function fixJsExtensions(filePath: string): boolean {
  const content = readFileSync(filePath, 'utf8')
  
  // Regex: encontra imports/exports relativos
  // Match: from "./path" ou from "../path"
  const newContent = content.replace(/(from\s+['"])(\.\.?\/[^'"]+)(['"])/g, (match, prefix, importPath, quote) => {
    // Não modificar se já tiver extensão .js
    if (importPath.endsWith('.js')) {
      return match
    }
    
    // Se terminar com /index, adicionar .js para ficar /index.js
    if (importPath.endsWith('/index')) {
      return `${prefix}${importPath}.js${quote}`
    }
    
    // Adicionar .js em outros casos
    return `${prefix}${importPath}.js${quote}`
  })

  if (newContent !== content) {
    writeFileSync(filePath, newContent, 'utf8')
    return true
  }

  return false
}

function processDirectory(dir: string): number {
  let filesFixed = 0
  const entries = readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    // Ignorar node_modules e arquivos que não são .js
    if (
      entry.name === 'node_modules' ||
      entry.name.startsWith('.') ||
      entry.name.endsWith('.d.ts') ||
      !entry.name.endsWith('.js')
    ) {
      continue
    }

    if (entry.isDirectory()) {
      filesFixed += processDirectory(fullPath)
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      if (fixJsExtensions(fullPath)) {
        filesFixed++
        // Log apenas para arquivos importantes
        if (fullPath.includes('index.js') || fullPath.includes('plugins.js') || fullPath.includes('server.js')) {
          console.log(`  ✅ ${fullPath.replace(process.cwd(), '.')}`)
        }
      }
    }
  }

  return filesFixed
}

function main() {
  const distDir = join(process.cwd(), 'dist')
  
  // Verificar se dist existe
  try {
    statSync(distDir)
  } catch {
    console.error('❌ Pasta dist não encontrada. Execute pnpm build primeiro.')
    process.exit(1)
  }
  
  const filesFixed = processDirectory(distDir)

  if (filesFixed > 0) {
    console.log(`✅ Adicionado .js em ${filesFixed} arquivo(s) compilado(s)`)
  }
}

main()
