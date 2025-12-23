#!/usr/bin/env node
/**
 * Script de start que detecta automaticamente onde o server.js foi gerado
 */

import { existsSync, readdirSync } from "fs"
import { resolve } from "path"
import { spawn } from "child_process"

const cwd = resolve(process.cwd())

// Primeiro, tentar caminhos conhecidos (mais rápido)
const possiblePaths = [
  "dist/server.js", // Estrutura plana (rootDir: "./src")
  "dist/src/server.js", // Estrutura preservada
  "dist/svg-generator/src/server.js", // Estrutura do workspace (monorepo)
]

let serverPath = null

// Tentar caminhos conhecidos primeiro
for (const path of possiblePaths) {
  const fullPath = resolve(cwd, path)
  if (existsSync(fullPath)) {
    serverPath = path
    console.log(`✅ Encontrado server.js em: ${path}`)
    break
  }
}

// Se não encontrou, fazer busca recursiva em dist/
if (!serverPath) {
  const distPath = resolve(cwd, "dist")
  if (existsSync(distPath)) {
    try {
      const distFiles = readdirSync(distPath, { recursive: true })
      const serverJsFiles = distFiles.filter((f) => 
        typeof f === "string" && f.endsWith("server.js")
      )
      
      if (serverJsFiles.length > 0) {
        serverPath = `dist/${serverJsFiles[0]}`
        console.log(`✅ Encontrado server.js em: ${serverPath} (busca recursiva)`)
      }
    } catch (error) {
      console.error(`⚠️  Erro ao buscar recursivamente: ${error.message}`)
    }
  }
}

if (!serverPath) {
  console.error("❌ ERRO: server.js não encontrado em nenhum dos caminhos esperados:")
  possiblePaths.forEach((p) => console.error(`   - ${p}`))
  console.error("   Também foi feita busca recursiva em dist/ sem sucesso.")
  process.exit(1)
}

// Executar o servidor
console.log(`🚀 Iniciando servidor: node ${serverPath}`)
const server = spawn("node", [serverPath], {
  stdio: "inherit",
  cwd,
})

server.on("error", (error) => {
  console.error(`❌ Erro ao iniciar servidor: ${error.message}`)
  process.exit(1)
})

server.on("exit", (code) => {
  process.exit(code || 0)
})

