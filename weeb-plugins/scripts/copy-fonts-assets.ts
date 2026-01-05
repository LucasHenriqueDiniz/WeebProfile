/**
 * Copy fonts assets to dist/fonts/assets/ after build
 * 
 * Copies all font files recursively from src/fonts/assets/ to dist/fonts/assets/
 * This ensures fonts are available at runtime when using dist/ output.
 */

import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const workspaceRoot = resolve(__dirname, '..')

const srcPath = resolve(workspaceRoot, 'src/fonts/assets')
const distPath = resolve(workspaceRoot, 'dist/fonts/assets')

function copyRecursive(src: string, dest: string) {
  mkdirSync(dest, { recursive: true })
  const entries = readdirSync(src)
  
  for (const entry of entries) {
    const srcPath = join(src, entry)
    const destPath = join(dest, entry)
    
    if (statSync(srcPath).isDirectory()) {
      copyRecursive(srcPath, destPath)
    } else {
      copyFileSync(srcPath, destPath)
    }
  }
}

try {
  copyRecursive(srcPath, distPath)
  console.log('✅ Copied fonts assets to dist/fonts/assets/')
} catch (error) {
  console.warn('⚠️  Failed to copy fonts assets:', error)
}

