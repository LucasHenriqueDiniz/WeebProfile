/**
 * Copy shared.css to dist/styles/ after build
 */

import { copyFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const workspaceRoot = resolve(__dirname, '..')

const srcPath = resolve(workspaceRoot, 'src/styles/shared.css')
const distPath = resolve(workspaceRoot, 'dist/styles/shared.css')

try {
  // Ensure dist/styles directory exists
  mkdirSync(resolve(workspaceRoot, 'dist/styles'), { recursive: true })
  
  // Copy shared.css
  copyFileSync(srcPath, distPath)
  console.log('✅ Copied shared.css to dist/styles/')
} catch (error) {
  console.warn('⚠️  Failed to copy shared.css:', error)
}



