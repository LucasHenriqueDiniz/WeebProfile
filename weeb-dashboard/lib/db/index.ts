import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"
import { env } from "../config/env"

// Lazy initialization - só cria a conexão quando db é acessado
// Isso evita que a validação de DATABASE_URL aconteça durante o build
let _client: ReturnType<typeof postgres> | null = null
let _db: ReturnType<typeof drizzle> | null = null

function getClient() {
  if (!_client) {
    const connectionString = env.databaseUrl
    
    // Se a connection string estiver vazia (pode acontecer durante build),
    // lançar erro apenas em runtime, não durante build
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL não está configurada. " +
        "Configure esta variável no Vercel em Settings → Environment Variables. " +
        "Veja VERCEL_ENV_SETUP.md para mais detalhes."
      )
    }
    
    _client = postgres(connectionString, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: connectionString.includes("supabase") ? "require" : false,
    })
  }
  return _client
}

function getDb() {
  if (!_db) {
    _db = drizzle(getClient(), { schema })
  }
  return _db
}

// Exporta db como um objeto que inicializa lazy
// Usa Object.defineProperty para criar um getter que só executa quando acessado
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop, receiver) {
    const dbInstance = getDb()
    const value = Reflect.get(dbInstance, prop, receiver)
    // Se for uma função, bind para manter o contexto
    if (typeof value === "function") {
      return value.bind(dbInstance)
    }
    return value
  },
  has(_target, prop) {
    return prop in getDb()
  },
  ownKeys(_target) {
    return Reflect.ownKeys(getDb())
  },
  getOwnPropertyDescriptor(_target, prop) {
    return Reflect.getOwnPropertyDescriptor(getDb(), prop)
  },
})

export { schema }


