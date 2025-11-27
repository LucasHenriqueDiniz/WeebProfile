/**
 * Script to fix imports in copied plugins
 * 
 * Replaces relative imports that point to weeb-plugins
 * with imports that point to locally copied files
 */

const fs = require('fs')
const path = require('path')

const PLUGINS_DIR = path.resolve(__dirname, '../lib/plugins')
const WEEB_PLUGINS_DIR = path.resolve(__dirname, '../lib/weeb-plugins')

/**
 * Automatically discover available plugins
 */
function discoverPlugins() {
  const plugins = []
  
  if (!fs.existsSync(PLUGINS_DIR)) {
    return []
  }
  
  const entries = fs.readdirSync(PLUGINS_DIR, { withFileTypes: true })
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const pluginName = entry.name
      
      // Ignore directories that start with _ (templates, etc)
      if (pluginName.startsWith('_')) {
        continue
      }
      
      const indexPath = path.join(PLUGINS_DIR, pluginName, 'index.tsx')
      
      if (fs.existsSync(indexPath)) {
        plugins.push(pluginName)
      }
    }
  }
  
  return plugins.sort()
}

const DISCOVERED_PLUGINS = discoverPlugins()
const PLUGINS_PATTERN = DISCOVERED_PLUGINS.join('|')

function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8')
  let modified = false

  // Determinar se está em lib/plugins ou lib/weeb-plugins
  const normalizedPath = filePath.replace(/\\/g, '/')
  const normalizedPluginsDir = PLUGINS_DIR.replace(/\\/g, '/')
  const normalizedWeebPluginsDir = WEEB_PLUGINS_DIR.replace(/\\/g, '/')
  const isInPlugins = normalizedPath.includes(normalizedPluginsDir)
  const isInWeebPlugins = normalizedPath.includes(normalizedWeebPluginsDir)
  
  // Calcular profundidade do arquivo dentro do diretório base
  let relativePath, depth, upLevels
  if (isInPlugins) {
    relativePath = path.relative(PLUGINS_DIR, filePath)
    depth = relativePath.split(path.sep).length - 1
    // Para sair de lib/plugins/ e entrar em lib/weeb-plugins/, precisa subir mais um nível
    upLevels = '../'.repeat(depth + 1)
  } else if (isInWeebPlugins) {
    relativePath = path.relative(WEEB_PLUGINS_DIR, filePath)
    depth = relativePath.split(path.sep).length - 1
    // Para sair de lib/weeb-plugins/ e entrar em lib/plugins/, precisa subir mais um nível
    upLevels = '../'.repeat(depth + 1)
  } else {
    // Fallback: não processar
    return false
  }

  // Padrões de substituição
  const replacements = [
    // REMOVER .js de TODOS os imports (TypeScript resolve automaticamente)
    // IMPORTANTE: Deve ser o PRIMEIRO para remover .js antes de outras substituições
    {
      pattern: /from ['"]([^'"]+)\.js['"]/g,
      replacement: (match, path) => {
        // Preservar aspas originais
        const quote = match.includes("'") ? "'" : '"'
        return `from ${quote}${path}${quote}`
      },
    },
    // ../weeb-plugins/... -> corrigir caminho relativo baseado na profundidade
    // De lib/plugins/github/components/ para lib/weeb-plugins/utils/ precisa de ../../../weeb-plugins/utils/
    // De lib/plugins/myanimelist/components/ para lib/weeb-plugins/utils/ precisa de ../../../weeb-plugins/utils/
    {
      pattern: /from ['"]\.\.\/weeb-plugins\//g,
      replacement: `from '${upLevels}weeb-plugins/`,
    },
    // ../../../templates -> corrigir para caminho relativo correto
    {
      pattern: /from ['"]\.\.\/\.\.\/\.\.\/templates\//g,
      replacement: `from '${upLevels}weeb-plugins/templates/`,
    },
    // ../../../utils -> corrigir para caminho relativo correto
    {
      pattern: /from ['"]\.\.\/\.\.\/\.\.\/utils\//g,
      replacement: `from '${upLevels}weeb-plugins/utils/`,
    },
    // ../../types/index -> corrigir para caminho relativo correto
    {
      pattern: /from ['"]\.\.\/\.\.\/types\/index/g,
      replacement: `from '${upLevels}weeb-plugins/types/index`,
    },
    // ./types -> ../types (quando está em um subdiretório como services/)
    // Mas se estiver no index.tsx do plugin, ./types está correto
    {
      pattern: /from ['"]\.\/types['"]/g,
      replacement: (match) => {
        if (isInPlugins) {
          // Se estiver em um subdiretório (ex: lib/plugins/lastfm/services/), precisa subir um nível
          // Exemplo: lib/plugins/lastfm/services/fetchLastFm.ts -> ../types
          // Mas se estiver no index.tsx (ex: lib/plugins/myanimelist/index.tsx), ./types está correto
          const fileDepth = relativePath.split(path.sep).length - 1
          const isIndexFile = filePath.endsWith('index.tsx') || filePath.endsWith('index.ts')
          if (fileDepth > 0 && !isIndexFile) {
            return "from '../types'"
          }
        }
        return match
      },
    },
    // ../types -> ./types (quando está no index.tsx do plugin)
    {
      pattern: /from ['"]\.\.\/types['"]/g,
      replacement: (match) => {
        if (isInPlugins) {
          const isIndexFile = filePath.endsWith('index.tsx') || filePath.endsWith('index.ts')
          if (isIndexFile) {
            return "from './types'"
          }
        }
        return match
      },
    },
    // ../shared ou ../../shared -> ../weeb-plugins/plugins/shared (shared agora está em weeb-plugins/plugins/)
    {
      pattern: /from (['"])(\.\.\/)+shared\//g,
      replacement: (match, quote) => {
        if (isInPlugins) {
          // De lib/plugins/X para lib/weeb-plugins/plugins/shared
          // Exemplo: lib/plugins/lastfm/services/ -> ../../../weeb-plugins/plugins/shared/
          // depth já calcula a profundidade, então upLevels já tem os ../ necessários
          return `from ${quote}${upLevels}weeb-plugins/plugins/shared/`
        }
        return match
      },
    },
    // ./shared -> ../weeb-plugins/plugins/shared (quando está no mesmo nível do plugin)
    {
      pattern: /from ['"]\.\/shared\//g,
      replacement: (match) => {
        if (isInPlugins) {
          // De lib/plugins/X para lib/weeb-plugins/plugins/shared
          // Exemplo: lib/plugins/lastfm/types.ts -> ../../weeb-plugins/plugins/shared/
          const fileDepth = relativePath.split(path.sep).length - 1
          const neededUpLevels = '../'.repeat(fileDepth + 1)
          return `from '${neededUpLevels}weeb-plugins/plugins/shared/`
        }
        return match
      },
    },
    // ../types/index -> corrigir para caminho relativo correto
    {
      pattern: /from ['"]\.\.\/types\/index/g,
      replacement: `from '${upLevels}weeb-plugins/types/index`,
    },
    // ../plugins/manager ou ../../plugins/manager -> corrigir caminho relativo
    // De lib/weeb-plugins/styles/ para lib/weeb-plugins/plugins/manager precisa de ../plugins/manager
    {
      pattern: /from ['"]\.\.\/\.\.\/plugins\/manager(\.js)?['"]/g,
      replacement: (match) => {
        if (isInWeebPlugins) {
          // De lib/weeb-plugins/X para lib/weeb-plugins/plugins/manager
          // Exemplo: lib/weeb-plugins/styles/plugins.ts -> ../plugins/manager
          // depth = 1 (styles), então precisa subir 1 nível: ../plugins/manager
          return `from '../plugins/manager'`
        }
        return match
      },
    },
    // ./[plugin]/index -> correct to ../../plugins/...
    // In manager.ts in weeb-plugins/plugins/, plugins are in lib/plugins/
    {
      pattern: new RegExp(`from ['"]\\./(${PLUGINS_PATTERN})/index['"]`, 'g'),
      replacement: (match, pluginName) => {
        if (isInWeebPlugins && normalizedPath.includes('plugins/manager.ts')) {
          // From lib/weeb-plugins/plugins/manager.ts to lib/plugins/[plugin]/index
          return `from '../../plugins/${pluginName}/index'`
        }
        return match
      },
    },
    // ../types/index -> corrigir para ../../types/index no manager.ts
    {
      pattern: /from ['"]\.\.\/types\/index['"]/g,
      replacement: (match) => {
        if (isInWeebPlugins && normalizedPath.includes('plugins/manager.ts')) {
          // De lib/weeb-plugins/plugins/manager.ts para lib/weeb-plugins/types/index
          return `from '../../types/index'`
        }
        return match
      },
    },
    // ../../weeb-plugins/types/index -> corrigir para ../../types/index no manager.ts
    {
      pattern: /from ['"]\.\.\/\.\.\/weeb-plugins\/types\/index['"]/g,
      replacement: (match) => {
        if (isInWeebPlugins && normalizedPath.includes('plugins/manager.ts')) {
          // De lib/weeb-plugins/plugins/manager.ts para lib/weeb-plugins/types/index
          return `from '../../types/index'`
        }
        return match
      },
    },
    // ../plugins/manager (quando já está correto, mas pode estar em weeb-plugins)
    {
      pattern: /from ['"]\.\.\/plugins\/manager(\.js)?['"]/g,
      replacement: (match) => {
        if (isInWeebPlugins) {
          // Já está correto se estiver em weeb-plugins, não precisa mudar
          return match
        }
        // Se estiver em lib/plugins/, precisa apontar para weeb-plugins/plugins/manager
        if (isInPlugins) {
          const neededUpLevels = '../'.repeat(depth + 1)
          return `from '${neededUpLevels}weeb-plugins/plugins/manager'`
        }
        return match
      },
    },
  ]

  for (const { pattern, replacement } of replacements) {
    const newContent = typeof replacement === 'function' 
      ? content.replace(pattern, replacement)
      : content.replace(pattern, replacement)
    
    if (newContent !== content) {
      content = newContent
      modified = true
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8')
    return true
  }
  return false
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      processDirectory(fullPath)
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.d.ts') || entry.name.endsWith('.js')) {
      if (fixImportsInFile(fullPath)) {
        const relativePath = path.relative(dir === PLUGINS_DIR ? PLUGINS_DIR : WEEB_PLUGINS_DIR, fullPath)
        console.log(`✅ Fixed imports in ${relativePath}`)
      }
    }
  }
}

console.log('🔧 Fixing plugin imports...')
processDirectory(PLUGINS_DIR)
console.log('🔧 Fixing weeb-plugins imports...')
processDirectory(WEEB_PLUGINS_DIR)
console.log('✅ Import fixing complete!')
