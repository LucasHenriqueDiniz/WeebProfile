import { createClerkClient } from "@clerk/backend"

export interface CloudflareEnv {
  DB: D1Database
  SVGS_BUCKET: R2Bucket
  CLERK_SECRET_KEY: string
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string
  R2_PUBLIC_URL: string
  SVG_GENERATOR_URL?: string
  CRON_SECRET?: string
  INTERNAL_SECRET?: string
  SECRETS_ENCRYPTION_KEY?: string
}

export async function getAuthUserId(request: Request, env: CloudflareEnv): Promise<string | null> {
  try {
    const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY })
    const requestState = await clerk.authenticateRequest(request, {
      publishableKey: env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    })
    return requestState.toAuth()?.userId ?? null
  } catch {
    return null
  }
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 })
}

export function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 })
}

export function notFound(resource = "Resource") {
  return Response.json({ error: `${resource} not found` }, { status: 404 })
}

export function serverError(error?: unknown) {
  console.error("Server error:", error)
  return Response.json({ error: "Internal server error" }, { status: 500 })
}
