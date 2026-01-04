#!/usr/bin/env node

/**
 * Script para verificar se as variáveis de ambiente estão configuradas
 * Execute: node scripts/check-env.js
 */

require("dotenv").config({ path: ".env.local" })

const requiredVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "DATABASE_URL",
]

const optionalVars = [
  "SVG_GENERATOR_URL",
  "CRON_SECRET",
]

console.log("🔍 Verificando variáveis de ambiente...\n")

let hasErrors = false
const missing = []
const found = []

requiredVars.forEach((key) => {
  const value = process.env[key]
  if (value) {
    found.push(key)
    console.log(`✅ ${key}`)
  } else {
    missing.push(key)
    hasErrors = true
    console.log(`❌ ${key} - FALTANDO`)
  }
})

console.log("\n📋 Variáveis opcionais:")
optionalVars.forEach((key) => {
  const value = process.env[key]
  if (value) {
    console.log(`✅ ${key}`)
  } else {
    console.log(`⚠️  ${key} - não configurada (opcional)`)
  }
})

if (hasErrors) {
  console.log("\n❌ Erro: Algumas variáveis obrigatórias estão faltando!")
  console.log("\n📝 Configure as variáveis faltantes no arquivo .env.local:")
  console.log("   Localização: weeb-dashboard/.env.local\n")
  missing.forEach((key) => {
    console.log(`   ${key}=seu_valor_aqui`)
  })
  console.log("\n💡 Dica: Reinicie o servidor após adicionar as variáveis (pnpm dev)\n")
  process.exit(1)
} else {
  console.log("\n✅ Todas as variáveis obrigatórias estão configuradas!\n")
  process.exit(0)
}





















































