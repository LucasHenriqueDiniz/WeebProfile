#!/usr/bin/env node
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

function checkFile(filePath) {
  const content = readFileSync(filePath, 'utf8')
  // Find relative imports WITHOUT .js extension (these will fail in Node.js ESM)
  // Allow relative imports WITH .js extension (these are valid)
  const relativeImports = content.match(/from\s+['"]\.\.?\/[^'"]+['"]/g)
  if (relativeImports && relativeImports.length > 0) {
    const importsWithoutExt = relativeImports.filter(imp => {
      // Extract the import path (between quotes)
      const match = imp.match(/from\s+['"]([^'"]+)['"]/)
      if (!match) return false
      const importPath = match[1]
      // Check if it doesn't end with .js and is not a directory import (ending with /)
      return !importPath.endsWith('.js') && !importPath.endsWith('/')
    })
    
    if (importsWithoutExt.length > 0) {
      console.error(`❌ Found relative imports WITHOUT .js extension in ${filePath}:`)
      importsWithoutExt.forEach(imp => console.error(`   ${imp}`))
      return true
    }
  }
  return false
}

function processDirectory(dir) {
  let hasErrors = false
  const entries = readdirSync(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      hasErrors = processDirectory(fullPath) || hasErrors
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      hasErrors = checkFile(fullPath) || hasErrors
    }
  }
  
  return hasErrors
}

const distDir = join(process.cwd(), 'dist')
const hasErrors = processDirectory(distDir)

if (hasErrors) {
  console.error('\n❌ Build failed: Relative imports found in dist/')
  console.error('tsup should bundle all entrypoints without internal relative imports.')
  process.exit(1)
} else {
  console.log('✅ No relative imports found in dist/')
}

