import { Svg } from "@/lib/db/schema"
import { createAdminClient } from "@/lib/supabase/admin"
import { createHash } from "crypto"

/**
 * Converte a configuração do SVG do Supabase para o formato esperado pelo svg-generator
 */
export function convertSvgToPluginsConfig(svg: Svg): Record<string, any> {
  console.log(`🔄 [CONVERT] Starting conversion for SVG ${svg.id}`)
  
  // Usar apenas pluginsConfig do SVG
  const mergedPluginsConfig = (svg.pluginsConfig || {}) as Record<string, any>
  console.log(`🔄 [CONVERT] Raw pluginsConfig:`, JSON.stringify(mergedPluginsConfig, null, 2))

  // Converter pluginsConfig para o formato esperado pelo svg-generator
  // Formato esperado: { plugins: { github: { enabled: true, sections: [...], username: ... }, ... } }
  const plugins: Record<string, any> = {}

  // Primeiro, coletar todos os dados dos plugins
  Object.keys(mergedPluginsConfig).forEach((key) => {
    const value = mergedPluginsConfig[key]
    if (key.startsWith("PLUGIN_")) {
      const pluginKey = key.replace("PLUGIN_", "").toLowerCase()
      console.log(`🔄 [CONVERT] Processing key: ${key} -> ${pluginKey}, value:`, value)
      
      // Se for um boolean (plugin enabled/disabled) - ex: PLUGIN_GITHUB = true
      if (typeof value === "boolean" && !key.includes("_", 7)) { // 7 = "PLUGIN_".length
        const pluginName = pluginKey
        console.log(`🔄 [CONVERT] Found boolean plugin flag: ${pluginName} = ${value}`)
        if (!plugins[pluginName]) {
          plugins[pluginName] = { enabled: value }
        } else {
          plugins[pluginName].enabled = value
        }
      } else {
        // Extrair nome do plugin e propriedade - ex: PLUGIN_GITHUB_USERNAME
        const parts = pluginKey.split("_")
        const pluginName = parts[0]
        const property = parts.slice(1).join("_")

        console.log(`🔄 [CONVERT] Found plugin property: ${pluginName}.${property} =`, value)

        if (!plugins[pluginName]) {
          plugins[pluginName] = { enabled: false } // Default to disabled if not explicitly set
        }

        if (property === "username") {
          plugins[pluginName].username = value
        } else if (property === "sections") {
          plugins[pluginName].sections = typeof value === "string" ? value.split(",").filter(Boolean) : (Array.isArray(value) ? value.filter(Boolean) : [])
        } else if (property) {
          // Outras propriedades do plugin
          plugins[pluginName][property] = value
        }
      }
    }
  })

  console.log(`🔄 [CONVERT] All plugins collected:`, JSON.stringify(plugins, null, 2))

  // Filtrar apenas plugins habilitados com pelo menos uma seção
  const enabledPlugins: Record<string, any> = {}
  Object.keys(plugins).forEach((pluginName) => {
    const plugin = plugins[pluginName]
    const isEnabled = plugin.enabled === true
    const hasSections = plugin.sections && Array.isArray(plugin.sections) && plugin.sections.length > 0
    console.log(`🔄 [CONVERT] Plugin ${pluginName}: enabled=${isEnabled}, sections=${JSON.stringify(plugin.sections)}, hasSections=${hasSections}`)
    
    if (isEnabled && hasSections) {
      enabledPlugins[pluginName] = plugin
      console.log(`🔄 [CONVERT] ✅ Plugin ${pluginName} included`)
    } else {
      console.log(`🔄 [CONVERT] ❌ Plugin ${pluginName} excluded (enabled: ${isEnabled}, hasSections: ${hasSections})`)
    }
  })

  console.log(`🔄 [CONVERT] Final enabled plugins:`, JSON.stringify(enabledPlugins, null, 2))

  // Retornar no formato esperado pelo svg-generator
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



