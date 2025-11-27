/**
 * GET /api/profile/essential-configs - Obter essential configs do usuário
 * 
 * Retorna os essential configs do usuário autenticado.
 * Valores de senha são mascarados para segurança.
 * 
 * Query params:
 * - enabledPlugins: lista de plugins habilitados (opcional, para verificar faltantes)
 */

import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { getUserEssentialConfigs } from "@/lib/essential-configs"
import { getMissingEssentialConfigs } from "@/lib/plugin-essential-configs"
import type { EssentialConfigs } from "@/lib/db/types"

/**
 * Mascara valores sensíveis (senhas/tokens)
 */
function maskSensitiveValue(value: string, type: string): string {
  if (type === 'password' && value.length > 0) {
    // Mostrar apenas últimos 4 caracteres
    return '*'.repeat(Math.max(0, value.length - 4)) + value.slice(-4)
  }
  return value
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Buscar essential configs do usuário (backend pode ler)
    const essentialConfigs = await getUserEssentialConfigs(user.id)

    // Obter query params para saber quais plugins estão habilitados
    const { searchParams } = new URL(request.url)
    const enabledPluginsParam = searchParams.get("enabledPlugins")
    const enabledPlugins = enabledPluginsParam ? enabledPluginsParam.split(",") : []

    // Verificar quais estão faltando (se enabledPlugins fornecido)
    let missingConfigs: Array<{ pluginName: string; missingKeys: any[] }> = []
    if (enabledPlugins.length > 0) {
      missingConfigs = getMissingEssentialConfigs(enabledPlugins, essentialConfigs)
    }

    // Retornar apenas indicador de "configurado" (sem valores)
    // Frontend nunca lê os valores reais, apenas sabe se está configurado
    const configStatus: Record<string, Record<string, boolean>> = {}
    for (const [plugin, pluginConfigs] of Object.entries(essentialConfigs)) {
      if (pluginConfigs && typeof pluginConfigs === 'object') {
        configStatus[plugin] = {}
        for (const [key, value] of Object.entries(pluginConfigs)) {
          // Apenas indicar se está configurado (true/false), sem mostrar o valor
          configStatus[plugin]![key] = !!(value && typeof value === 'string' && value.trim().length > 0)
        }
      }
    }

    return NextResponse.json({
      essentialConfigs: configStatus as any, // Usar any para compatibilidade com tipo esperado
      missingConfigs: missingConfigs.map(({ pluginName, missingKeys }) => ({
        pluginName,
        missingKeys: missingKeys.map((key) => ({
          key: key.key,
          label: key.label,
          type: key.type,
          placeholder: key.placeholder,
          description: key.description,
          helpUrl: key.helpUrl,
          docKey: key.docKey,
        })),
      })),
    })
  } catch (error) {
    console.error("Error fetching essential configs:", error)
    return NextResponse.json(
      { error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

