import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

const connectionString = process.env.DATABASE_URL

// Configurar cliente postgres com opções adequadas para Supabase
const client = postgres(connectionString, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: connectionString.includes("supabase") ? "require" : false,
})

export const db = drizzle(client, { schema })
export { schema }


