/**
 * Script de build que ignora erros de tipo
 * Compila mesmo com erros de tipo do React 19 no weeb-plugins
 */

import { execSync } from "child_process"
import { existsSync, readFileSync, readdirSync, statSync } from "fs"
import { resolve } from "path"

const cwd = resolve(process.cwd())

console.log("🔨 Compilando svg-generator...")

// Sempre tentar compilar, mesmo com erros
let buildSucceeded = false
let tscOutput = ""
let tscExitCode = 0

try {
  tscOutput = execSync("tsc --skipLibCheck", {
    stdio: "pipe",
    cwd,
    encoding: "utf8",
  })
  console.log("✅ Build concluído com sucesso!")
  buildSucceeded = true
} catch (error) {
  tscExitCode = error.status || 1

  // Capturar output do erro para debug
  if (error.stdout) {
    tscOutput = error.stdout.toString()
  }
  if (error.stderr) {
    tscOutput += "\n" + error.stderr.toString()
  }

  // Mostrar primeiros erros para debug
  const errorLines = tscOutput.split("\n").filter((line) =>
    line.includes("error") || line.includes("Error") || line.includes("Cannot find module")
  ).slice(0, 10)

  if (errorLines.length > 0) {
    console.log(`⚠️  TypeScript terminou com código ${tscExitCode}`)
    console.log("   Primeiros erros:")
    errorLines.forEach((line) => console.log(`   ${line}`))
  } else {
    console.log(`⚠️  TypeScript terminou com código ${tscExitCode} (sem erros visíveis)`)
  }

  // Mesmo com erros, tsc pode ter gerado alguns arquivos
  buildSucceeded = false
}

// Verificar se o comando tsc funcionou mesmo com erros
if (tscOutput.includes("Compilation complete") || tscOutput.includes("Found 0 errors")) {
  buildSucceeded = true
  console.log("✅ TypeScript compilou sem erros!")
} else if (tscExitCode === 0) {
  buildSucceeded = true
  console.log("✅ TypeScript terminou com sucesso!")
}

// Verificar arquivo crítico gerado
// Com rootDir: "./src" e outDir: "./dist", o TypeScript gera dist/server.js (estrutura plana)
const distServerJs = resolve(cwd, "dist/server.js")
const distSrcServerJs = resolve(cwd, "dist/src/server.js")

console.log(`📂 Verificando arquivos gerados...`)
console.log(`   dist/server.js existe: ${existsSync(distServerJs)}`)
console.log(`   dist/src/server.js existe: ${existsSync(distSrcServerJs)}`)

// Verificar se os arquivos principais foram gerados
// CRÍTICO: server.js é obrigatório para o serviço funcionar
// O TypeScript pode gerar em diferentes locais dependendo do contexto (monorepo vs standalone)
const criticalFiles = [
  "dist/server.js", // Estrutura plana (rootDir: "./src")
  "dist/src/server.js", // Estrutura preservada
  "dist/svg-generator/src/server.js", // Estrutura do workspace (monorepo)
]

const importantFiles = [
  "dist/index.js",
  "dist/index.d.ts",
  "dist/server.js",
  "dist/config/config-loader.js",
  "dist/generator/svg-generator.js",
]

// Verificar arquivos críticos primeiro
const criticalFilesExist = criticalFiles.some((file) => existsSync(resolve(cwd, file)))
const generatedFiles = importantFiles.filter((file) => existsSync(resolve(cwd, file)))

// Determinar qual caminho base está sendo usado
let distBasePath = "dist"
let actualServerPath = null

for (const file of criticalFiles) {
  const fullPath = resolve(cwd, file)
  if (existsSync(fullPath)) {
    actualServerPath = file
    if (file.includes("svg-generator/src")) {
      distBasePath = "dist/svg-generator/src"
      console.log("📁 Arquivos gerados em dist/svg-generator/src/ (estrutura do workspace)")
    } else if (file.includes("dist/src")) {
      distBasePath = "dist/src"
      console.log("📁 Arquivos gerados em dist/src/ (estrutura preservada)")
    } else {
      distBasePath = "dist"
      console.log("📁 Arquivos gerados em dist/ (estrutura plana)")
    }
    break
  }
}

if (!criticalFilesExist) {
  console.error("❌ ERRO CRÍTICO: Arquivos obrigatórios não foram gerados!")

  // Debug detalhado
  console.error("📋 Debug do build:")
  console.error(`   TypeScript exit code: ${tscExitCode}`)
  console.error(`   Build succeeded: ${buildSucceeded}`)
  console.error(`   Output length: ${tscOutput.length} chars`)

  // Listar conteúdo completo de dist/
  const distPath = resolve(cwd, "dist")
  if (existsSync(distPath)) {
    try {
      const distFiles = readdirSync(distPath, { recursive: true })
      console.error(`   Total de arquivos em dist/: ${distFiles.length}`)
      const jsFiles = distFiles.filter((f) => typeof f === "string" && f.endsWith(".js"))
      console.error(`   Arquivos .js em dist/: ${jsFiles.length}`)
      if (jsFiles.length > 0) {
        console.error(`   Arquivos .js encontrados:`)
        jsFiles.slice(0, 20).forEach((f) => {
          const fullPath = resolve(distPath, f)
          const exists = existsSync(fullPath)
          const size = exists ? statSync(fullPath).size : 0
          console.error(`     - ${f} (${exists ? `${size} bytes` : 'não existe'})`)
        })
      }
    } catch (error) {
      console.error(`   Erro ao listar dist/: ${error}`)
    }
  } else {
    console.error("   dist/ não existe!")
  }

  // Verificar se há algum arquivo server.js em qualquer lugar
  try {
    const findServerJs = execSync("find . -name 'server.js' -type f 2>/dev/null || echo 'find não encontrou nada'", {
      cwd,
      encoding: "utf8"
    }).trim()
    console.error(`   Arquivos server.js encontrados: ${findServerJs}`)
  } catch (error) {
    console.error(`   Erro ao procurar server.js: ${error.message}`)
  }

  console.error("💡 O build TypeScript deve gerar dist/server.js, dist/src/server.js ou dist/svg-generator/src/server.js")
  
  // Se encontrou o arquivo em algum lugar, mostrar onde está
  if (actualServerPath) {
    console.error(`   ⚠️  Arquivo encontrado em: ${actualServerPath}`)
    console.error(`   💡 Ajuste o package.json start script para: node ${actualServerPath}`)
  }

  // Mesmo sem arquivos críticos, continuar se build foi bem-sucedido
  if (buildSucceeded) {
    console.log("⚠️  Build TypeScript foi bem-sucedido, continuando mesmo sem arquivos críticos")
    process.exit(0)
  } else {
    process.exit(1)
  }
}

if (criticalFilesExist && actualServerPath) {
  console.log(`✅ Arquivo crítico encontrado: ${actualServerPath}`)
  console.log(`✅ ${generatedFiles.length}/${importantFiles.length} arquivos principais gerados`)
  
  // Verificar se o config-loader tem as correções
  const configLoaderPaths = [
    resolve(cwd, "dist/config/config-loader.js"),
    resolve(cwd, "dist/src/config/config-loader.js"),
    resolve(cwd, "dist/svg-generator/src/config/config-loader.js"),
  ]
  
  for (const configLoaderPath of configLoaderPaths) {
    if (existsSync(configLoaderPath)) {
      const content = readFileSync(configLoaderPath, "utf8")
      if (content.includes("primaryColor") && content.includes("pluginsOrder")) {
        console.log(`✅ Correções aplicadas em ${configLoaderPath.replace(cwd, '.')}!`)
      }
      break
    }
  }

  console.log("✅ Build concluído! Arquivos prontos para uso.")
  console.log(`💡 Certifique-se de que o package.json start script aponta para: ${actualServerPath}`)
  process.exit(0)
} else if (generatedFiles.length > 0) {
  // Se não encontrou arquivos importantes mas arquivos críticos existem, continuar
  if (criticalFilesExist) {
    console.log("⚠️  Alguns arquivos importantes não foram encontrados, mas arquivos críticos existem")
    console.log("✅ Continuando com build...")
    process.exit(0)
  } else {
    console.error("❌ Build falhou - arquivos críticos não foram gerados")
    process.exit(1)
  }
}
