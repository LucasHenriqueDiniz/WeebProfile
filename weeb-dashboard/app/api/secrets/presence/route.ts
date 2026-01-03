import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * GET /api/secrets/presence - Buscar presença de secrets (sem valores)
 * 
 * Retorna apenas se os secrets existem e quando foram atualizados,
 * nunca retorna os valores reais por segurança.
 */
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

    // Obter plugins habilitados da query string
    const { searchParams } = new URL(request.url)
    const enabledPluginsParam = searchParams.get("enabledPlugins")
    
    // Support "all" to fetch presence for all plugins
    let enabledPlugins: string[] = []
    if (enabledPluginsParam === "all") {
      enabledPlugins = Object.keys(PLUGINS_METADATA)
    } else if (enabledPluginsParam) {
      enabledPlugins = enabledPluginsParam.split(",")
    }

    if (enabledPlugins.length === 0) {
      return NextResponse.json({
        presence: {},
        missingSecrets: [],
      })
    }

    // Usar admin client para ler secrets (frontend não pode ler diretamente)
    const adminClient = createAdminClient()

    // Buscar todos os secrets do usuário para os plugins habilitados
    // Usar tabela plugin_secrets (renomeada de essential_configs)
    const { data: secrets, error: secretsError } = await adminClient
      .from("plugin_secrets")
      .select("plugin, key, updated_at")
      .eq("user_id", user.id)
      .in("plugin", enabledPlugins.map(p => p.toLowerCase()))

    if (secretsError) {
      console.error("Error fetching secrets:", secretsError)
      return NextResponse.json({ error: "Failed to fetch secrets" }, { status: 500 })
    }

    // Construir mapa de presença: { plugin: { key: { exists: true, updatedAt: "..." } } }
    const presence: Record<string, Record<string, { exists: boolean; updatedAt?: string }>> = {}
    
    // Inicializar estrutura para todos os plugins e keys
    for (const pluginName of enabledPlugins) {
      const metadata = PLUGINS_METADATA[pluginName as keyof typeof PLUGINS_METADATA]
      if (!metadata) continue

      // Type assertion needed because TypeScript doesn't know about requiredSecretsMetadata yet
      const metadataAny = metadata as any
      const secretsMetadata = metadataAny.essentialConfigKeysMetadata || metadataAny.requiredSecretsMetadata || []
      if (!presence[pluginName]) {
        presence[pluginName] = {}
      }

      for (const keyMeta of secretsMetadata) {
        presence[pluginName][keyMeta.key] = { exists: false }
      }
    }

    // Preencher com dados reais
    for (const secret of secrets || []) {
      const plugin = secret.plugin.toLowerCase()
      if (!presence[plugin]) {
        presence[plugin] = {}
      }
      presence[plugin][secret.key.toLowerCase()] = {
        exists: true,
        updatedAt: secret.updated_at,
      }
    }

    // Calcular missing secrets
    const missingSecrets: Array<{ pluginName: string; missingKeys: Array<{ key: string; label: string }> }> = []
    
    for (const pluginName of enabledPlugins) {
      const metadata = PLUGINS_METADATA[pluginName as keyof typeof PLUGINS_METADATA]
      if (!metadata) continue

      // Type assertion needed because TypeScript doesn't know about requiredSecretsMetadata yet
      const metadataAny = metadata as any
      const secretsMetadata = metadataAny.essentialConfigKeysMetadata || metadataAny.requiredSecretsMetadata || []
      const missingKeys: Array<{ key: string; label: string }> = []

      for (const keyMeta of secretsMetadata) {
        const key = keyMeta.key.toLowerCase()
        const pluginPresence = presence[pluginName]?.[key]
        if (!pluginPresence || !pluginPresence.exists) {
          missingKeys.push({
            key: keyMeta.key,
            label: keyMeta.label || keyMeta.key,
          })
        }
      }

      if (missingKeys.length > 0) {
        missingSecrets.push({
          pluginName,
          missingKeys,
        })
      }
    }

    return NextResponse.json({
      presence,
      missingSecrets,
    })
  } catch (error) {
    console.error("Error in /api/secrets/presence:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

