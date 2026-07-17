#!/usr/bin/env tsx
/**
 * Script para verificar se as traduções dos plugins existem e estão traduzidas
 *
 * Verifica:
 * - Se todos os plugins têm arquivos de tradução para os idiomas suportados
 * - Se as traduções foram realmente traduzidas (não apenas cópia do inglês)
 * - Avisa quando uma tradução está igual ao inglês (não traduzida)
 *
 * Execute: pnpm check-translations
 */

import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PLUGINS_DIR = path.join(__dirname, "../src/plugins")
const DASHBOARD_MESSAGES_DIR = path.join(__dirname, "../../weeb-dashboard/messages/plugins")

// Idiomas suportados (por enquanto apenas PT e ES)
const SUPPORTED_LANGUAGES = ["pt", "es"] as const
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

interface TranslationStatus {
  plugin: string
  locale: SupportedLanguage
  exists: boolean
  hasTranslation: boolean
  untranslatedKeys: string[]
}

interface PluginTranslationCheck {
  plugin: string
  enExists: boolean
  locales: TranslationStatus[]
  allTranslated: boolean
}

/**
 * Descobre todos os plugins disponíveis
 */
function discoverPlugins(): string[] {
  const plugins: string[] = []

  if (!fs.existsSync(PLUGINS_DIR)) {
    console.warn(`⚠️  Plugins directory not found: ${PLUGINS_DIR}`)
    return []
  }

  const entries = fs.readdirSync(PLUGINS_DIR, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const pluginName = entry.name

      // Ignorar diretórios que começam com _ (templates, etc)
      if (pluginName.startsWith("_")) {
        continue
      }

      const metadataPath = path.join(PLUGINS_DIR, pluginName, "plugin.metadata.ts")

      if (fs.existsSync(metadataPath)) {
        plugins.push(pluginName)
      }
    }
  }

  return plugins.sort()
}

/**
 * Carrega um arquivo JSON de tradução
 */
function loadTranslationFile(pluginId: string, locale: string): any | null {
  const filePath = path.join(DASHBOARD_MESSAGES_DIR, pluginId, `${locale}.json`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  try {
    const content = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(content)
  } catch (error) {
    console.error(`❌ Error loading ${filePath}:`, error)
    return null
  }
}

/**
 * Compara recursivamente dois objetos para encontrar valores iguais (não traduzidos)
 * Retorna array de paths das keys não traduzidas
 */
function findUntranslatedKeys(enObj: any, translatedObj: any, currentPath: string[] = []): string[] {
  const untranslated: string[] = []

  // Keys que geralmente não precisam ser traduzidas (nomes próprios, marcas, etc)
  const skipKeys = ["displayName"] // Nomes de plugins/marcas geralmente não são traduzidos

  // Termos técnicos que geralmente são mantidos em inglês (nomes próprios, marcas, termos do GitHub, etc)
  const technicalTerms = [
    "Stargazers",
    "Gists",
    "Steam ID64",
    "Steam ID",
    "ID64",
    "ghp_",
    "API",
    "URL",
    "PAT",
    "token",
    "key",
    "GitHub",
    "16Personalities",
    "LastFM",
    "MyAnimeList",
    "Stack Overflow",
    "Codeforces",
    "Codewars",
    "Duolingo",
    "Lyfta",
    "Steam",
  ]

  // Se não são objetos, compara diretamente
  if (typeof enObj !== "object" || typeof translatedObj !== "object" || enObj === null || translatedObj === null) {
    // Se são strings iguais (e não são vazias ou apenas números), provavelmente não traduzido
    if (typeof enObj === "string" && typeof translatedObj === "string") {
      // Normaliza espaços e compara
      const enNormalized = enObj.trim()
      const translatedNormalized = translatedObj.trim()

      // Verifica se é um termo técnico que geralmente não é traduzido
      const isTechnicalTerm = technicalTerms.some(
        (term) =>
          enNormalized.toLowerCase().includes(term.toLowerCase()) ||
          translatedNormalized.toLowerCase().includes(term.toLowerCase())
      )

      // Ignora strings vazias, muito curtas, ou que são apenas números/IDs/templates/URLs
      // Também ignora se está em uma key que geralmente não é traduzida
      const lastKey = currentPath[currentPath.length - 1]
      const shouldSkip = lastKey && skipKeys.includes(lastKey)

      if (
        !shouldSkip &&
        !isTechnicalTerm &&
        enNormalized.length > 3 &&
        enNormalized === translatedNormalized &&
        !/^\d+$/.test(enNormalized) &&
        !enNormalized.includes("{") && // Ignora templates
        !enNormalized.includes("${") &&
        !enNormalized.startsWith("http") && // Ignora URLs
        !enNormalized.match(/^[a-z_]+$/)
      ) {
        // Ignora placeholders como "your-api-key"
        untranslated.push(currentPath.join("."))
      }
    }
    return untranslated
  }

  // Compara todas as keys
  const allKeys = new Set([...Object.keys(enObj), ...Object.keys(translatedObj)])

  for (const key of allKeys) {
    const enValue = enObj[key]
    const translatedValue = translatedObj[key]

    if (enValue === undefined || translatedValue === undefined) {
      continue
    }

    const newPath = [...currentPath, key]

    // Skip keys que geralmente não são traduzidas
    if (skipKeys.includes(key)) {
      continue
    }

    if (typeof enValue === "object" && typeof translatedValue === "object") {
      // Recursão para objetos aninhados
      untranslated.push(...findUntranslatedKeys(enValue, translatedValue, newPath))
    } else if (typeof enValue === "string" && typeof translatedValue === "string") {
      // Compara strings
      const enNormalized = enValue.trim()
      const translatedNormalized = translatedValue.trim()

      // Verifica se é um termo técnico que geralmente não é traduzido
      const isTechnicalTerm = technicalTerms.some(
        (term) =>
          enNormalized.toLowerCase().includes(term.toLowerCase()) ||
          translatedNormalized.toLowerCase().includes(term.toLowerCase())
      )

      // Ignora strings vazias, muito curtas, ou que são apenas números/IDs/templates/URLs
      // Também ignora termos técnicos e placeholders
      if (
        !isTechnicalTerm &&
        enNormalized.length > 3 &&
        enNormalized === translatedNormalized &&
        !/^\d+$/.test(enNormalized) &&
        !enNormalized.includes("{") &&
        !enNormalized.includes("${") &&
        !enNormalized.startsWith("http") &&
        !enNormalized.match(/^[a-z_]+$/)
      ) {
        // Ignora placeholders como "your-api-key"
        untranslated.push(newPath.join("."))
      }
    }
  }

  return untranslated
}

/**
 * Verifica as traduções de um plugin
 */
function checkPluginTranslations(pluginId: string): PluginTranslationCheck {
  const enTranslation = loadTranslationFile(pluginId, "en")
  const enExists = enTranslation !== null

  const locales: TranslationStatus[] = []

  if (!enExists) {
    console.warn(`⚠️  Plugin ${pluginId}: Missing English translation file (en.json)`)
    for (const locale of SUPPORTED_LANGUAGES) {
      locales.push({
        plugin: pluginId,
        locale,
        exists: false,
        hasTranslation: false,
        untranslatedKeys: [],
      })
    }
    return {
      plugin: pluginId,
      enExists: false,
      locales,
      allTranslated: false,
    }
  }

  // Verifica cada idioma suportado
  for (const locale of SUPPORTED_LANGUAGES) {
    const translation = loadTranslationFile(pluginId, locale)

    if (!translation) {
      locales.push({
        plugin: pluginId,
        locale,
        exists: false,
        hasTranslation: false,
        untranslatedKeys: [],
      })
      continue
    }

    // Compara com inglês para encontrar keys não traduzidas
    const untranslatedKeys = findUntranslatedKeys(enTranslation, translation)
    const hasTranslation = untranslatedKeys.length === 0

    locales.push({
      plugin: pluginId,
      locale,
      exists: true,
      hasTranslation,
      untranslatedKeys,
    })
  }

  const allTranslated = locales.every((l) => l.exists && l.hasTranslation)

  return {
    plugin: pluginId,
    enExists: true,
    locales,
    allTranslated,
  }
}

/**
 * Função principal
 */
async function main() {
  console.log("🔍 Checking plugin translations...\n")

  const plugins = discoverPlugins()

  if (plugins.length === 0) {
    console.error("❌ No plugins found!")
    process.exit(1)
  }

  console.log(`📦 Found ${plugins.length} plugin(s): ${plugins.join(", ")}\n`)

  const results: PluginTranslationCheck[] = []
  let totalWarnings = 0

  for (const pluginId of plugins) {
    const check = checkPluginTranslations(pluginId)
    results.push(check)

    // Reporta status
    if (!check.enExists) {
      console.log(`❌ ${pluginId}: Missing English translation`)
      totalWarnings++
      continue
    }

    // Verifica cada locale
    for (const locale of check.locales) {
      if (!locale.exists) {
        console.log(`⚠️  ${pluginId}/${locale.locale}: Translation file missing`)
        totalWarnings++
      } else if (!locale.hasTranslation) {
        console.log(`⚠️  ${pluginId}/${locale.locale}: ${locale.untranslatedKeys.length} untranslated key(s)`)
        if (locale.untranslatedKeys.length > 0 && locale.untranslatedKeys.length <= 5) {
          // Mostra apenas as primeiras 5 keys não traduzidas
          locale.untranslatedKeys.slice(0, 5).forEach((key) => {
            console.log(`   - ${key}`)
          })
          if (locale.untranslatedKeys.length > 5) {
            console.log(`   ... and ${locale.untranslatedKeys.length - 5} more`)
          }
        }
        totalWarnings++
      }
    }
  }

  // Resumo
  console.log("\n" + "=".repeat(60))
  console.log("📊 Summary:")
  console.log("=".repeat(60))

  const fullyTranslated = results.filter((r) => r.allTranslated && r.enExists).length
  const missingFiles = results.filter((r) => !r.enExists || r.locales.some((l) => !l.exists)).length
  const partiallyTranslated = results.filter(
    (r) => r.enExists && r.locales.some((l) => l.exists && !l.hasTranslation)
  ).length

  console.log(`✅ Fully translated: ${fullyTranslated}/${plugins.length} plugins`)
  console.log(`⚠️  Missing translation files: ${missingFiles} plugin(s)`)
  console.log(`⚠️  Partially translated: ${partiallyTranslated} plugin(s)`)
  console.log(`⚠️  Total warnings: ${totalWarnings}`)
  console.log("=".repeat(60))

  // Detalhes por plugin
  console.log("\n📋 Details by plugin:")
  console.log("-".repeat(60))

  for (const result of results) {
    if (!result.enExists) {
      console.log(`❌ ${result.plugin}: No English file`)
      continue
    }

    const localeStatus = result.locales
      .map((l) => {
        if (!l.exists) return `${l.locale}: ❌ missing`
        if (!l.hasTranslation) return `${l.locale}: ⚠️  ${l.untranslatedKeys.length} untranslated`
        return `${l.locale}: ✅ translated`
      })
      .join(" | ")

    const status = result.allTranslated ? "✅" : "⚠️"
    console.log(`${status} ${result.plugin}: ${localeStatus}`)
  }

  console.log("-".repeat(60))
  console.log("\n✨ Check complete!")

  // Exit code baseado em warnings (0 = sucesso, 1 = avisos)
  if (totalWarnings > 0) {
    console.log(`\n⚠️  Found ${totalWarnings} warning(s). Some translations may be incomplete.`)
    process.exit(0) // Não falha o build, apenas avisa
  } else {
    console.log("\n✅ All translations are complete!")
    process.exit(0)
  }
}

main().catch((error) => {
  console.error("❌ Error checking translations:", error)
  process.exit(1)
})
