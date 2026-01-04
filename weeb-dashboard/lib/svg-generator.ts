import { Svg } from "@/lib/db/schema"
import { createAdminClient } from "@/lib/supabase/admin"
import { createHash } from "crypto"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"

/**
 * Converte a configuração do SVG do Supabase para o formato esperado pelo svg-generator
 * 
 * Username e outros configs não-sensíveis agora vêm diretamente de svgs.plugins_config.
 * Não há mais necessidade de buscar plugin_config.
 */
export async function convertSvgToPluginsConfig(svg: Svg): Promise<Record<string, any>> {
  console.log(`🔄 [CONVERT] Starting conversion for SVG ${svg.id}`)
  
  // Get plugins config - username and other non-sensitive configs are already included
  const svgPluginsConfig = (svg.pluginsConfig || {}) as Record<string, any>
  console.log(`🔄 [CONVERT] SVG plugins config:`, JSON.stringify(svgPluginsConfig, null, 2))
  
  // Filter only valid plugins (using PLUGINS_METADATA)
  const validPluginNames = new Set(Object.keys(PLUGINS_METADATA))
  const validPlugins: Record<string, any> = {}
  
  for (const [pluginName, pluginConfig] of Object.entries(svgPluginsConfig)) {
    // Skip if not a valid plugin name (could be legacy flags or invalid data)
    if (!validPluginNames.has(pluginName)) {
      continue
    }
    validPlugins[pluginName] = pluginConfig
  }
  
  console.log(`🔄 [CONVERT] Valid plugins:`, JSON.stringify(validPlugins, null, 2))
  
  // Filter only enabled plugins with at least one section
  const enabledPlugins: Record<string, any> = {}
  for (const [pluginName, plugin] of Object.entries(validPlugins)) {
    const isEnabled = plugin.enabled === true
    const hasSections = plugin.sections && Array.isArray(plugin.sections) && plugin.sections.length > 0
    
    console.log(`🔄 [CONVERT] Plugin ${pluginName}: enabled=${isEnabled}, sections=${JSON.stringify(plugin.sections)}, hasSections=${hasSections}`)
    
    if (isEnabled && hasSections) {
      enabledPlugins[pluginName] = plugin
      console.log(`🔄 [CONVERT] ✅ Plugin ${pluginName} included`)
    } else {
      console.log(`🔄 [CONVERT] ❌ Plugin ${pluginName} excluded (enabled: ${isEnabled}, hasSections: ${hasSections})`)
    }
  }
  
  console.log(`🔄 [CONVERT] Final enabled plugins:`, JSON.stringify(enabledPlugins, null, 2))
  
  // Return in format expected by svg-generator
  const result = {
    plugins: enabledPlugins,
    pluginsOrder: svg.pluginsOrder?.split(",").filter(Boolean) || [],
  }
  
  console.log(`🔄 [CONVERT] Final result:`, JSON.stringify(result, null, 2))
  return result
}

/**
 * Gera um hash dos dados do SVG para detectar mudanças
 */
export function generateDataHash(svg: Svg): string {
  const dataToHash = {
    ...svg,
    pluginsConfig: svg.pluginsConfig as Record<string, any>,
  }
  return createHash("md5").update(JSON.stringify(dataToHash)).digest("hex")
}

/**
 * Salva o SVG gerado no Supabase Storage
 */
export async function saveSvgToStorage(svgId: string, svgContent: string): Promise<{ path: string; url: string }> {
  const supabase = createAdminClient()
  const bucket = "svgs"

  // Verificar se o bucket existe, criar se não existir
  const { data: buckets } = await supabase.storage.listBuckets()
  if (!buckets?.find((b) => b.name === bucket)) {
    const { error: createError } = await supabase.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: 5242880, // 5MB
    })
    if (createError) {
      throw new Error(`Failed to create bucket: ${createError.message}`)
    }
  }

  const fileName = `${svgId}.svg`
  const { data, error } = await supabase.storage.from(bucket).upload(fileName, svgContent, {
    contentType: "image/svg+xml",
    upsert: true,
  })

  if (error) {
    throw new Error(`Failed to upload SVG: ${error.message}`)
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(fileName)

  return {
    path: data.path,
    url: publicUrl,
  }
}

/**
 * Deleta o SVG do Supabase Storage
 */
export async function deleteSvgFromStorage(svgId: string): Promise<void> {
  const supabase = createAdminClient()
  const bucket = "svgs"
  const fileName = `${svgId}.svg`

  const { error } = await supabase.storage.from(bucket).remove([fileName])

  if (error) {
    throw new Error(`Failed to delete SVG from storage: ${error.message}`)
  }
}
