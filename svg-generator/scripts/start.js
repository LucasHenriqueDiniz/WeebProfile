#!/usr/bin/env node
/**
 * Script de start que detecta automaticamente onde o server.js foi gerado
 */

import { existsSync } from "fs"
import { resolve } from "path"
import { spawn } from "child_process"

const cwd = resolve(process.cwd())

// Possíveis caminhos onde o server.js pode estar
const possiblePaths = [
  "dist/server.js", // Estrutura plana (rootDir: "./src")
  "dist/src/server.js", // Estrutura preservada
  "dist/svg-generator/src/server.js", // Estrutura do workspace (monorepo)
]

// Encontrar o caminho correto
let serverPath = null
for (const path of possiblePaths) {
  const fullPath = resolve(cwd, path)
  if (existsSync(fullPath)) {
    serverPath = path
    console.log(`✅ Encontrado server.js em: ${path}`)
    break
  }
}

if (!serverPath) {
  console.error("❌ ERRO: server.js não encontrado em nenhum dos caminhos esperados:")
  possiblePaths.forEach((p) => console.error(`   - ${p}`))
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

