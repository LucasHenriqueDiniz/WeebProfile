/**
 * Validação e acesso centralizado de variáveis de ambiente
 * 
 * Este arquivo centraliza o acesso às variáveis de ambiente e fornece
 * mensagens de erro claras quando variáveis estão faltando.
 */

function getEnv(key: string, required = true): string {
  const value = process.env[key]
  
  if (required && !value) {
    throw new Error(
      `❌ Variável de ambiente faltando: ${key}\n` +
      `Por favor, configure esta variável no Vercel:\n` +
      `1. Acesse Settings → Environment Variables\n` +
      `2. Adicione a variável ${key}\n` +
      `3. Faça um novo deploy\n\n` +
      `Veja VERCELL_ENV_SETUP.md para mais detalhes.`
    )
  }
  
  return value || ""
}

/**
 * Variáveis públicas (acessíveis no browser)
 * Precisam do prefixo NEXT_PUBLIC_ no Vercel
 */
export const env = {
  // Supabase (público)
  supabaseUrl: getEnv("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  
  // Supabase (privado - servidor apenas)
  supabaseServiceRoleKey: getEnv("SUPABASE_SERVICE_ROLE_KEY"),
  
  // Database
  databaseUrl: getEnv("DATABASE_URL"),
  
  // SVG Generator
  svgGeneratorUrl: getEnv("SVG_GENERATOR_URL", false) || "http://localhost:3001",
  
  // Cron Secret (opcional)
  cronSecret: getEnv("CRON_SECRET", false),
} as const

/**
 * Valida todas as variáveis de ambiente necessárias
 * Use isso em desenvolvimento para verificar se tudo está configurado
 */
export function validateEnv() {
  const errors: string[] = []
  
  if (!env.supabaseUrl) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL está faltando")
  }
  
  if (!env.supabaseAnonKey) {
    errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY está faltando")
  }
  
  if (!env.supabaseServiceRoleKey) {
    errors.push("SUPABASE_SERVICE_ROLE_KEY está faltando")
  }
  
  if (!env.databaseUrl) {
    errors.push("DATABASE_URL está faltando")
  }
  
  if (errors.length > 0) {
    console.error("❌ Variáveis de ambiente faltando:")
    errors.forEach(error => console.error(`  - ${error}`))
    console.error("\nConfigure as variáveis no Vercel ou crie um arquivo .env.local")
    console.error("Veja VERCEL_ENV_SETUP.md para mais detalhes")
    return false
  }
  
  console.log("✅ Todas as variáveis de ambiente necessárias estão configuradas")
  return true
}

