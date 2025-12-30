import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { profiles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

function getBaseUrl(request: Request): string {
  // Use NEXT_PUBLIC_SITE_URL if available (for production), otherwise use request URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (siteUrl) {
    return siteUrl
  }
  
  // Fallback to request URL origin
  const requestUrl = new URL(request.url)
  return requestUrl.origin
}

export async function GET(request: Request) {
  const baseUrl = getBaseUrl(request)
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const errorDescription = requestUrl.searchParams.get("error_description")
  const next = requestUrl.searchParams.get("next") || "/login"

  if (error) {
    console.error("OAuth error:", error, errorDescription)
    return NextResponse.redirect(
      new URL(
        `/login?error=${error}&error_description=${encodeURIComponent(errorDescription || "")}`,
        baseUrl
      )
    )
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError, data } = await supabase.auth.exchangeCodeForSession(code)

    if (!exchangeError && data.user) {
      try {
        const user = data.user
        // Extrair username baseado no provedor
        let username =
          user.user_metadata?.user_name ||
          user.user_metadata?.preferred_username ||
          user.user_metadata?.login ||
          user.user_metadata?.name ||
          null

        // Se não houver username e houver email, usar parte antes do @
        if (!username && user.email) {
          username = user.email.split("@")[0]
        }

        const [existingProfile] = await db
          .select()
          .from(profiles)
          .where(eq(profiles.userId, user.id))
          .limit(1)

        if (!existingProfile) {
          // Criar novo perfil
          await db.insert(profiles).values({
            userId: user.id,
            username,
            isActive: true,
          })
          console.log("Profile created for user:", user.id)
        } else {
          // Atualizar perfil existente apenas com username se mudou
          const updates: any = {
            updatedAt: new Date(),
          }
          
          if (username && existingProfile.username !== username) {
            updates.username = username
          }
          
          await db
            .update(profiles)
            .set(updates)
            .where(eq(profiles.userId, user.id))
          console.log("Profile updated for user:", user.id)
        }
      } catch (profileError) {
        console.error("Error creating/updating profile:", profileError)
      }

      return NextResponse.redirect(new URL("/dashboard", baseUrl))
    } else {
      console.error("Error exchanging code:", exchangeError)
      return NextResponse.redirect(
        new URL(
          `/login?error=exchange_failed&error_description=${encodeURIComponent(exchangeError?.message || "Unknown error")}`,
          baseUrl
        )
      )
    }
  }

  return NextResponse.redirect(new URL("/login?error=no_code", baseUrl))
}


