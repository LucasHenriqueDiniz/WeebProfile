/**
 * Script de build que ignora erros de tipo
 * Compila mesmo com erros de tipo do React 19 no weeb-plugins
 */

import { execSync } from "child_process"
import { existsSync, readFileSync, readdirSync } from "fs"
import { resolve } from "path"

const cwd = resolve(process.cwd())

console.log("🔨 Compilando svg-generator...")

// Sempre tentar compilar, mesmo com erros
let buildSucceeded = false
let tscOutput = ""
try {
  tscOutput = execSync("tsc --skipLibCheck", {
    stdio: "pipe",
    cwd,
    encoding: "utf8",
  })
  console.log("✅ Build concluído com sucesso!")
  buildSucceeded = true
} catch (error) {
  // Capturar output do erro para debug
  if (error.stdout) {
    tscOutput = error.stdout.toString()
  }
  if (error.stderr) {
    tscOutput += "\n" + error.stderr.toString()
  }
  
  // Mostrar primeiros erros para debug
  const errorLines = tscOutput.split("\n").filter((line) => 
    line.includes("error") || line.includes("Error")
  ).slice(0, 5)
  
  if (errorLines.length > 0) {
    console.log("⚠️  Build concluído com erros de tipo (não bloqueantes)")
    console.log("   Primeiros erros:")
    errorLines.forEach((line) => console.log(`   ${line}`))
  } else {
    console.log("⚠️  Build concluído com erros de tipo (não bloqueantes)")
  }
  
  // Mesmo com erros, tsc pode ter gerado alguns arquivos
  buildSucceeded = false
}

// Verificar se os arquivos principais foram gerados
// CRÍTICO: server.js é obrigatório para o serviço funcionar
const criticalFiles = [
  "dist/server.js", // OBRIGATÓRIO
]

const importantFiles = [
  "dist/index.js",
  "dist/index.d.ts",
  "dist/server.js",
  "dist/config/config-loader.js",
  "dist/generator/svg-generator.js",
]

// Verificar arquivos críticos primeiro
const criticalFilesExist = criticalFiles.every((file) => existsSync(resolve(cwd, file)))
const generatedFiles = importantFiles.filter((file) => existsSync(resolve(cwd, file)))

if (!criticalFilesExist) {
  console.error("❌ ERRO CRÍTICO: Arquivos obrigatórios não foram gerados!")
  console.error(`   Arquivos críticos faltando: ${criticalFiles.filter((f) => !existsSync(resolve(cwd, f))).join(", ")}`)
  
  // Debug: listar o que existe em dist/
  const distPath = resolve(cwd, "dist")
  if (existsSync(distPath)) {
    try {
      const distFiles = readdirSync(distPath, { recursive: true })
      const jsFiles = distFiles.filter((f) => typeof f === "string" && f.endsWith(".js"))
      console.error(`   Arquivos .js encontrados em dist/: ${jsFiles.length}`)
      if (jsFiles.length > 0) {
        console.error(`   Primeiros arquivos: ${jsFiles.slice(0, 10).join(", ")}`)
      }
    } catch (error) {
      console.error(`   Erro ao listar dist/: ${error}`)
    }
  } else {
    console.error("   dist/ não existe!")
  }
  
  console.error("💡 O build TypeScript deve gerar dist/server.js")
  process.exit(1)
}

if (generatedFiles.length > 0) {
  console.log(`✅ ${generatedFiles.length}/${importantFiles.length} arquivos principais gerados`)
  console.log(`✅ Arquivos críticos verificados: ${criticalFiles.length}/${criticalFiles.length}`)

  // Verificar se o config-loader tem as correções
  const configLoaderPath = resolve(cwd, "dist/config/config-loader.js")

  if (existsSync(configLoaderPath)) {
    const content = readFileSync(configLoaderPath, "utf8")
    if (content.includes("primaryColor") && content.includes("pluginsOrder")) {
      console.log(`✅ Correções aplicadas em dist/config/config-loader.js!`)
    }
  }

  console.log("✅ Build concluído! Arquivos prontos para uso.")
  process.exit(0)
} else {
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
