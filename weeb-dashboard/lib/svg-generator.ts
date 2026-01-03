import { Svg } from "@/lib/db/schema"
import { createAdminClient } from "@/lib/supabase/admin"
import { createHash } from "crypto"
import { getUserPluginConfigs } from "./config/plugin-config"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"

/**
 * Converte a configuração do SVG do Supabase para o formato esperado pelo svg-generator
 * 
 * Faz merge de:
 * 1. plugin_config (user-level, reutilizável: username)
 * 2. svgs.plugins_config (svg-specific: enabled, sections, sectionConfigs)
 */
export async function convertSvgToPluginsConfig(svg: Svg): Promise<Record<string, any>> {
  console.log(`🔄 [CONVERT] Starting conversion for SVG ${svg.id}`)
  
  // 1. Get reusable user-level configs (e.g., username)
  const userPluginConfigs = await getUserPluginConfigs(svg.userId)
  console.log(`🔄 [CONVERT] User plugin configs:`, JSON.stringify(userPluginConfigs, null, 2))
  
  // 2. Get SVG-specific configs (enabled, sections, sectionConfigs)
  const svgPluginsConfig = (svg.pluginsConfig || {}) as Record<string, any>
  console.log(`🔄 [CONVERT] SVG plugins config:`, JSON.stringify(svgPluginsConfig, null, 2))
  
  // 3. Merge: user configs (base) + svg configs (overrides)
  // CRÍTICO: Filtrar apenas plugins válidos (usar PLUGINS_METADATA)
  // hideTerminalEmojis, hideTerminalHeader, hideTerminalCommand são flags globais, NÃO plugins
  const validPluginNames = new Set(Object.keys(PLUGINS_METADATA))
  const mergedPlugins: Record<string, any> = {}
  
  // Start with user configs (reusable: username, etc.) - apenas plugins válidos
  for (const [pluginName, userConfig] of Object.entries(userPluginConfigs)) {
    if (validPluginNames.has(pluginName)) {
      mergedPlugins[pluginName] = { ...userConfig }
    }
  }
  
  // Apply SVG-specific overrides (enabled, sections, sectionConfigs) - apenas plugins válidos
  for (const [pluginName, svgConfig] of Object.entries(svgPluginsConfig)) {
    // Ignorar flags globais (hideTerminal*, customThemeColors, etc)
    if (!validPluginNames.has(pluginName)) {
      continue
    }
    
    if (!mergedPlugins[pluginName]) {
      mergedPlugins[pluginName] = {}
    }
    // Merge: user config (base) + svg config (overrides)
    mergedPlugins[pluginName] = {
      ...mergedPlugins[pluginName],
      ...svgConfig,
    }
  }
  
  console.log(`🔄 [CONVERT] Merged plugins:`, JSON.stringify(mergedPlugins, null, 2))
  
  // 4. Filter only enabled plugins with at least one section
  const enabledPlugins: Record<string, any> = {}
  for (const [pluginName, plugin] of Object.entries(mergedPlugins)) {
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
  
  // 5. Return in format expected by svg-generator
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
