import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { profiles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { getUserEssentialConfigs, setEssentialConfigs } from "@/lib/config/essential-configs"
import type { EssentialConfigs } from "@/lib/db/types"

/**
 * GET /api/profile - Buscar perfil do usuário
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Tentar buscar perfil existente
    let profile
    try {
      // Log para debug
      console.log("Attempting to query profiles table for user:", user.id)
      
      const result = await db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, user.id))
        .limit(1)
      
      console.log("Query result:", result)
      profile = result[0]
    } catch (dbError) {
      console.error("Database query error:", dbError)
      // Log detalhado do erro
      if (dbError instanceof Error) {
        console.error("Error message:", dbError.message)
        console.error("Error stack:", dbError.stack)
      }
      throw dbError
    }

    if (!profile) {
      // Criar perfil se não existir
      // Tentar obter username de múltiplas fontes
      const username =
        user.user_metadata?.user_name ||
        user.user_metadata?.preferred_username ||
        user.user_metadata?.login ||
        null

      try {
        const [newProfile] = await db
          .insert(profiles)
          .values({
            userId: user.id,
            username,
            isActive: true,
          })
          .returning()

        return NextResponse.json({ profile: newProfile })
      } catch (insertError) {
        console.error("Error creating profile:", insertError)
        throw insertError
      }
    }

    // Perfil não contém essentialConfigs (está em tabela separada)
    // Frontend não pode ler essentialConfigs diretamente
    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Error fetching profile:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    const errorDetails = error instanceof Error ? error.stack : String(error)
    console.error("Error details:", errorDetails)
    return NextResponse.json(
      { error: "Internal server error", message: errorMessage },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/profile - Atualizar perfil do usuário
 */
export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { username, essentialConfigs } = body

    // Validar que pelo menos um campo foi fornecido
    if (!username && !essentialConfigs) {
      return NextResponse.json(
        { error: "At least one field is required", message: "Pelo menos um campo é obrigatório" },
        { status: 400 }
      )
    }

    // Tentar buscar perfil existente
    let existingProfile
    try {
      const [foundProfile] = await db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, user.id))
        .limit(1)
      
      existingProfile = foundProfile
    } catch (dbError) {
      console.error("Database query error (PUT):", dbError)
      throw dbError
    }

    if (existingProfile) {
      try {
        // Atualizar username se fornecido
        if (username !== undefined) {
          await db
            .update(profiles)
            .set({
              username,
              updatedAt: new Date(),
            })
            .where(eq(profiles.userId, user.id))
        }

        // Salvar essentialConfigs na tabela separada se fornecido
        if (essentialConfigs) {
          await setEssentialConfigs(user.id, essentialConfigs as EssentialConfigs)
        }

        // Buscar perfil atualizado
        const [updatedProfile] = await db
          .select()
          .from(profiles)
          .where(eq(profiles.userId, user.id))
          .limit(1)

        return NextResponse.json({ profile: updatedProfile })
      } catch (updateError) {
        console.error("Error updating profile:", updateError)
        throw updateError
      }
    } else {
      // Tentar obter username de múltiplas fontes
      const usernameValue =
        username ||
        user.user_metadata?.user_name ||
        user.user_metadata?.preferred_username ||
        user.user_metadata?.login ||
        null

      try {
        const [newProfile] = await db
          .insert(profiles)
          .values({
            userId: user.id,
            username: usernameValue,
            isActive: true,
          })
          .returning()

        // Salvar essentialConfigs na tabela separada se fornecido
        if (essentialConfigs) {
          await setEssentialConfigs(user.id, essentialConfigs as EssentialConfigs)
        }

        return NextResponse.json({ profile: newProfile })
      } catch (insertError) {
        console.error("Error creating profile:", insertError)
        throw insertError
      }
    }
  } catch (error) {
    console.error("Error updating profile:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    const errorDetails = error instanceof Error ? error.stack : String(error)
    console.error("Error details:", errorDetails)
    return NextResponse.json(
      { error: "Internal server error", message: errorMessage },
      { status: 500 }
    )
  }
}


