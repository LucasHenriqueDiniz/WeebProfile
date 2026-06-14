/**
 * Minimal Cloudflare D1 REST API client
 *
 * svg-generator runs as a standalone Node.js service (Railway), so it can't
 * use D1 bindings directly (those only exist inside Workers/Pages Functions).
 * Instead it talks to D1 over the Cloudflare HTTP API.
 */

import { config } from "dotenv"
import { resolve } from "path"

config({ path: resolve(process.cwd(), ".env") })

interface D1QueryResult<T> {
  results: T[]
  success: boolean
}

interface D1ApiResponse<T> {
  result: D1QueryResult<T>[]
  success: boolean
  errors: Array<{ code: number; message: string }>
}

export async function queryD1<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID
  const apiToken = process.env.CLOUDFLARE_API_TOKEN

  if (!accountId || !databaseId || !apiToken) {
    throw new Error(
      "CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID and CLOUDFLARE_API_TOKEN environment variables are required to query D1"
    )
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
    }
  )

  const data = (await response.json()) as D1ApiResponse<T>

  if (!response.ok || !data.success) {
    const message = data.errors?.map((e) => e.message).join(", ") || response.statusText
    throw new Error(`D1 query failed: ${message}`)
  }

  return data.result[0]?.results || []
}
