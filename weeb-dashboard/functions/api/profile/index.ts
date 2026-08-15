import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../_shared/auth"
import { getAuthUserId, getClerkClient, unauthorized, serverError, badRequest } from "../_shared/auth"
import { getDb } from "../_shared/db"
import { parseBody, profileUpdateSchema } from "../_shared/validation"
import { profiles } from "../../../lib/db/schema"
import { eq } from "drizzle-orm"
import { setEssentialConfigs } from "../_shared/secrets"
import { normalizeSteamSecret } from "../_shared/steam-vanity"

async function getGitHubUsername(env: CloudflareEnv, userId: string): Promise<string | null> {
  try {
    const clerk = getClerkClient(env.CLERK_SECRET_KEY)
    const user = await clerk.users.getUser(userId)
    return user.username || user.externalAccounts.find((a) => String(a.provider).includes("github"))?.username || null
  } catch {
    return null
  }
}

/**
 * GET /api/profile - Get or create user profile
 */
export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ request, env }) => {
  try {
    const userId = await getAuthUserId(request, env)
    if (!userId) return unauthorized()

    const db = getDb(env)
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1)

    if (!profile) {
      const username = await getGitHubUsername(env, userId)
      const [newProfile] = await db.insert(profiles).values({ userId, username, isActive: true }).returning()
      return Response.json({ profile: newProfile })
    }

    return Response.json({ profile })
  } catch (e) {
    return serverError(e)
  }
}

/**
 * PUT /api/profile - Update user profile + essentialConfigs
 */
export const onRequestPut: PagesFunction<CloudflareEnv> = async ({ request, env }) => {
  try {
    const userId = await getAuthUserId(request, env)
    if (!userId) return unauthorized()

    const parsed = await parseBody(request, profileUpdateSchema)
    if (!parsed.ok) return parsed.response
    const { username, essentialConfigs: rawEssentialConfigs } = parsed.data

    // Resolve antes de qualquer escrita: o usuário cola a URL do perfil e a gente
    // grava o SteamID64. Falha aqui vira 400 com mensagem, em vez de um valor
    // inútil no banco que só quebra na próxima geração.
    let essentialConfigsInput = rawEssentialConfigs
    if (essentialConfigsInput) {
      const normalizado = await normalizeSteamSecret(essentialConfigsInput, env)
      if ("error" in normalizado) return badRequest(normalizado.error)
      essentialConfigsInput = normalizado.configs
    }

    const db = getDb(env)
    const [existingProfile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1)

    if (existingProfile) {
      if (username !== undefined) {
        await db
          .update(profiles)
          .set({ username, updatedAt: new Date().toISOString() })
          .where(eq(profiles.userId, userId))
      }

      if (essentialConfigsInput) {
        await setEssentialConfigs(db, userId, essentialConfigsInput, env.SECRETS_ENCRYPTION_KEY)
      }

      const [updatedProfile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1)

      return Response.json({ profile: updatedProfile })
    } else {
      const clerkUsername = await getGitHubUsername(env, userId)
      const usernameValue = username || clerkUsername || null

      const [newProfile] = await db
        .insert(profiles)
        .values({ userId, username: usernameValue, isActive: true })
        .returning()

      if (essentialConfigsInput) {
        await setEssentialConfigs(db, userId, essentialConfigsInput, env.SECRETS_ENCRYPTION_KEY)
      }

      return Response.json({ profile: newProfile })
    }
  } catch (e) {
    return serverError(e)
  }
}
