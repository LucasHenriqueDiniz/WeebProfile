import type { PagesFunction } from "@cloudflare/workers-types"
import type { CloudflareEnv } from "../_shared/auth"
import { getAuthUserId, getClerkClient, unauthorized, serverError } from "../_shared/auth"
import { getDb } from "../_shared/db"
import { parseBody, profileUpdateSchema } from "../_shared/validation"
import { profiles, essentialConfigs } from "../../../lib/db/schema"
import { eq, and } from "drizzle-orm"
import { encryptSecret } from "../_shared/secret-crypto"

async function getGitHubUsername(env: CloudflareEnv, userId: string): Promise<string | null> {
  try {
    const clerk = getClerkClient(env.CLERK_SECRET_KEY)
    const user = await clerk.users.getUser(userId)
    return user.username || user.externalAccounts.find((a) => String(a.provider).includes("github"))?.username || null
  } catch {
    return null
  }
}

async function setEssentialConfigs(
  db: ReturnType<typeof getDb>,
  userId: string,
  configs: Record<string, Record<string, string> | undefined>,
  encryptionKey: string | undefined
): Promise<void> {
  // Fail closed. This used to fall through to writing the raw value with only a
  // console.warn, which meant a deploy that forgot the binding would quietly start
  // persisting API keys in plain text -- the failure nobody would notice.
  if (!encryptionKey) {
    throw new Error("SECRETS_ENCRYPTION_KEY is not configured; refusing to store plugin secrets")
  }

  for (const [plugin, pluginConfigs] of Object.entries(configs)) {
    if (!pluginConfigs || typeof pluginConfigs !== "object") continue
    for (const [key, value] of Object.entries(pluginConfigs)) {
      if (value && typeof value === "string") {
        const storedValue = await encryptSecret(value, encryptionKey)
        await db
          .insert(essentialConfigs)
          .values({
            userId,
            plugin: plugin.toLowerCase(),
            key: key.toLowerCase(),
            value: storedValue,
            updatedAt: new Date().toISOString(),
          })
          .onConflictDoUpdate({
            target: [essentialConfigs.userId, essentialConfigs.plugin, essentialConfigs.key],
            set: { value: storedValue, updatedAt: new Date().toISOString() },
          })
      }
    }
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
    const { username, essentialConfigs: essentialConfigsInput } = parsed.data

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
