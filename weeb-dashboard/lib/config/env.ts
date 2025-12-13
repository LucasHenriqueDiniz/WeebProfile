function clean(value: string) {
  let v = value.trim()
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1)
  }
  return v
}

function isServer() {
  return typeof window === "undefined"
}

/**
 * getEnv:
 * - key: nome da variável
 * - required: se true e variável ausente -> comportamento:
 *     - server: lança
 *     - client: retorna "" para evitar crash (client não tem acesso a process.env dinâmico)
 * - serverOnly: se true e chamando do client -> lança (pois é variável que não deve vazar)
 */
function getEnv(key: string, required = true, serverOnly = false): string {
  // Proteção: se é serverOnly e estamos no client, falha rápido
  if (serverOnly && !isServer()) {
    if (required) {
      throw new Error(`Attempt to read server-only env var "${key}" from client`)
    }
    return ""
  }

  const raw = process.env[key]
  if (raw && typeof raw === "string" && raw.length > 0) {
    return clean(raw)
  }

  if (!required) {
    // não obrigatório: não crashar
    return ""
  }

  // required && missing
  if (!isServer()) {
    // estamos no browser — evitar crashing stack irrelevante, retornar vazio (evita quebrar app em runtime)
    // Mas logar para devtools
    console.error(`❌ Missing client env var: ${key} (running in client). Returning empty string to avoid crash.`)
    return ""
  }

  // estamos no servidor e a variável obrigatória faltou => lançar para alertar durante build/healthy checks
  console.error(`❌ Missing server env var: ${key} (server).`)
  throw new Error(`Missing required environment variable: ${key}`)
}

export const env = {
  // client-safe public variables (do not crash client; return "" if missing)
  get supabaseUrl() {
    return getEnv("NEXT_PUBLIC_SUPABASE_URL", false)
  },
  get supabaseAnonKey() {
    return getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", false)
  },

  // server-only secrets: call only from server code (API routes, getServerSideProps, node scripts)
  get supabaseServiceRoleKey() {
    return getEnv("SUPABASE_SERVICE_ROLE_KEY", true, true)
  },
  get databaseUrl() {
    return getEnv("DATABASE_URL", true, true)
  },

  // opcionais
  get svgGeneratorUrl() {
    return getEnv("SVG_GENERATOR_URL", false) || "http://localhost:3001"
  },
  get cronSecret() {
    return getEnv("CRON_SECRET", false) || undefined
  },
}















