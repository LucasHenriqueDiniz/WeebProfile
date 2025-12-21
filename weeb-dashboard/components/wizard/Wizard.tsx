"use client"

import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { ApiException, svgApi } from "@/lib/api"
import { cn } from "@/lib/utils"
import { useWizardStore } from "@/stores/wizard-store"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { motion } from "framer-motion"
import { AlertTriangle, Check, Package, Palette } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { LivePreview } from "./LivePreview"
import { PluginConfiguration } from "./PluginConfiguration"
import { StyleConfiguration } from "./StyleConfiguration"

interface WizardProps {
  isEditMode?: boolean
  editSvgId?: string
}

export function Wizard({ isEditMode = false, editSvgId }: WizardProps = {}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"plugins" | "style">("plugins")
  const {
    name,
    slug,
    plugins,
    pluginsOrder,
    style,
    size,
    theme,
    hideTerminalEmojis,
    hideTerminalHeader,
    customCss,
    customThemeColors,
    setBasicInfo,
    reset,
  } = useWizardStore()

  // Verificar TODOS os plugins, não apenas os que estão no pluginsOrder
  // Porque plugins podem ser habilitados mas não estar no pluginsOrder ainda
  const enabledPlugins = Object.keys(plugins).filter((name) => {
    const plugin = plugins[name]
    const isEnabled = plugin?.enabled && plugin.sections && plugin.sections.length > 0
    
    console.log(`[Wizard] Plugin ${name}:`, {
      exists: !!plugin,
      enabled: plugin?.enabled,
      sections: plugin?.sections,
      sectionsLength: plugin?.sections?.length,
      isEnabled,
    })
    
    return isEnabled
  })
  
  console.log('[Wizard] Enabled plugins:', enabledPlugins)
  console.log('[Wizard] All plugins state:', Object.entries(plugins).map(([name, config]) => ({
    name,
    enabled: config?.enabled,
    sections: config?.sections,
    sectionsLength: config?.sections?.length,
  })))
  console.log('[Wizard] Plugins order:', pluginsOrder)
  
  const totalSections = enabledPlugins.reduce((sum, name) => {
    return sum + (plugins[name]?.sections?.length || 0)
  }, 0)

  const handleFinish = async () => {
    // Verificar se há configs faltando
    if (hasMissingEssential) {
      toast({
        title: "Configuração incompleta",
        description: "Por favor, preencha todos os campos obrigatórios dos plugins habilitados",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      // Preparar pluginsConfig no formato esperado pela API
      const pluginsConfig: Record<string, any> = {
        // Adicionar customThemeColors apenas se o tema for custom
        ...(theme === 'custom' && Object.keys(customThemeColors).length > 0 
          ? { customThemeColors } 
          : {}),
      }
      
      // Only include enabled plugins in config
      pluginsOrder.forEach((pluginName) => {
        const plugin = plugins[pluginName]
        if (plugin?.enabled && plugin.sections && plugin.sections.length > 0) {
          pluginsConfig[`PLUGIN_${pluginName.toUpperCase()}`] = true
          
          // Adicionar requiredFields dinamicamente
          const metadata = (PLUGINS_METADATA as Record<string, any>)[pluginName]
          if (metadata?.requiredFields) {
            metadata.requiredFields.forEach((field: string) => {
              const value = (plugin as any)[field]
              if (value) {
                pluginsConfig[`PLUGIN_${pluginName.toUpperCase()}_${field.toUpperCase()}`] = value
              }
            })
          }
          
          pluginsConfig[`PLUGIN_${pluginName.toUpperCase()}_SECTIONS`] = plugin.sections.join(",")
          
          // Adicionar outras configurações específicas do plugin (não requiredFields)
          Object.keys(plugin).forEach((key) => {
            if (key !== "enabled" && key !== "sections" && key !== "sectionConfigs" && key !== "fields") {
              // Pular requiredFields que já foram adicionados
              const isRequiredField = metadata?.requiredFields?.includes(key)
              if (!isRequiredField) {
                const envKey = `PLUGIN_${pluginName.toUpperCase()}_${key.toUpperCase()}`
                pluginsConfig[envKey] = (plugin as any)[key]
              }
            }
          })
        }
        // Don't include inactive plugins in config (if not in config, plugin is inactive)
      })

      // Validate that at least one plugin is enabled before creating
      if (enabledPlugins.length === 0) {
        toast({
          title: "Configuração inválida",
          description: "Pelo menos um plugin deve estar habilitado com pelo menos uma seção",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      // Gerar name e slug automaticamente baseado nos plugins habilitados
      const enabledPluginNames = enabledPlugins // Use enabledPlugins already computed above
      const autoName = enabledPluginNames.length > 0 
        ? `${enabledPluginNames.map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ')} Stats`
        : 'My Profile Stats'
      const autoSlug = autoName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
      
      // Atualizar store com name/slug gerados
      setBasicInfo(autoName, autoSlug, true)

      // Check if pluginsOrder is customized (different from alphabetical order)
      // Only consider enabled plugins in the order comparison
      const enabledPluginsOrdered = [...enabledPluginNames].sort()
      const currentOrderFiltered = pluginsOrder.filter(name => enabledPluginNames.includes(name))
      const isOrderCustomized = JSON.stringify(enabledPluginsOrdered) !== JSON.stringify(currentOrderFiltered)

      // 1. Criar/Atualizar SVG
      const svgData: any = {
        name: autoName,
        style,
        size,
        theme,
        hideTerminalEmojis,
        hideTerminalHeader,
        customCss: customCss || null,
        customThemeColors: theme === 'custom' ? customThemeColors : undefined,
        pluginsConfig,
      }

      // Only include pluginsOrder if customized (not alphabetical default)
      if (isOrderCustomized) {
        svgData.pluginsOrder = pluginsOrder.filter(name => enabledPluginNames.includes(name)).join(",")
      }

      const data = isEditMode && editSvgId
        ? await svgApi.update(editSvgId, svgData)
        : await svgApi.create(svgData)

      const svgId = data.svg.id

      // 2. Gerar SVG automaticamente após criar
      toast({
        title: "Gerando imagem...",
        description: "Aguarde enquanto geramos sua imagem SVG",
      })

      try {
        const generateData = await svgApi.generate(svgId)
        
        // Verificar se a geração foi bem-sucedida
        if (generateData.success && generateData.svg?.storageUrl) {
          const svgUrl = generateData.svg.storageUrl

          // 3. Sucesso - mostrar URL e redirecionar
          toast({
            title: "Sucesso!",
            description: `Imagem SVG ${isEditMode ? "atualizada" : "criada"} e gerada com sucesso!`,
          })

          // Reset wizard store após criar com sucesso (só em modo criação)
          if (!isEditMode) {
            reset()
          }

          // Redirecionar para página de visualização com a URL
          router.push(`/dashboard/${svgId}?url=${encodeURIComponent(svgUrl)}`)
        } else {
          // Reset wizard store após criar (só em modo criação)
          if (!isEditMode) {
            reset()
          }

          // Se não tem URL ainda, redirecionar mesmo assim (a página vai fazer polling)
          toast({
            title: "Imagem criada",
            description: "A imagem está sendo gerada. Você será redirecionado...",
          })
          router.push(`/dashboard/${svgId}`)
        }
      } catch (generateError) {
        // Reset wizard store mesmo com erro (só em modo criação)
        if (!isEditMode) {
          reset()
        }

        // Se der erro na geração, ainda redirecionar (a página vai mostrar o erro)
        console.error("Error generating SVG:", generateError)
        toast({
          title: "Imagem criada",
          description: "A imagem foi criada, mas houve um problema na geração. Verifique na página de detalhes.",
          variant: "default",
        })
        router.push(`/dashboard/${svgId}`)
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} SVG:`, error)
      const errorMessage =
        error instanceof ApiException
          ? error.data.message || error.data.error || error.message
          : error instanceof Error
          ? error.message
          : `Erro ao ${isEditMode ? "atualizar" : "criar"} imagem`
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Verificar quais configs estão faltando
  const missingConfigs = useMemo(() => {
    const missing: Array<{ plugin: string; field: string; label: string }> = []
    
    enabledPlugins.forEach((pluginName) => {
      const plugin = plugins[pluginName]
      if (!plugin?.enabled) return
      
      const metadata = PLUGINS_METADATA[pluginName as keyof typeof PLUGINS_METADATA]
      if (!metadata) return
      
      // Verificar requiredFields
      metadata.requiredFields.forEach((field) => {
        const value = (plugin as any)[field]
        const isEmpty = typeof value === 'string' ? !value.trim() : !value
        if (isEmpty) {
          missing.push({
            plugin: pluginName,
            field,
            label: field.replace(/([A-Z])/g, " $1").trim(),
          })
        }
      })
      
      // Verificar essentialConfigKeysMetadata se existir
      if (metadata.essentialConfigKeysMetadata) {
        metadata.essentialConfigKeysMetadata.forEach((configKeyMeta: any) => {
          const configKey = configKeyMeta.key
          const value = (plugin as any)[configKey]
          const isEmpty = typeof value === 'string' ? !value.trim() : !value
          if (isEmpty) {
            missing.push({
              plugin: pluginName,
              field: configKey,
              label: configKeyMeta.label || configKey.replace(/([A-Z])/g, " $1").trim(),
            })
          }
        })
      }
    })
    
    return missing
  }, [enabledPlugins, plugins])
  
  const hasMissingEssential = missingConfigs.length > 0

  return (
    <div className="flex flex-col h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: 2,
            ease: "easeInOut",
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full blur-3xl"
        />
      </div>

      {/* Top Navigation */}
      <Header
        variant="wizard"
        stats={
          enabledPlugins.length > 0
            ? {
                style,
                theme,
                plugins: enabledPlugins.length,
                sections: totalSections,
              }
            : undefined
        }
      />

      {/* Main Content - Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Configuration */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 max-w-6xl mx-auto">
            {/* Tabs */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "plugins" | "style")}>
                <div className="flex border-b border-border bg-muted/30">
                  <TabsList className="w-full h-auto p-1 bg-transparent gap-1">
                    <TabsTrigger
                      value="plugins"
                      className="flex-1 rounded-lg border-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 py-2.5 font-medium transition-all"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Plugins
                    </TabsTrigger>
                    <TabsTrigger
                      value="style"
                      className="flex-1 rounded-lg border-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 py-2.5 font-medium transition-all"
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      Style
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="plugins" className="p-4 m-0">
                  <PluginConfiguration />
                </TabsContent>

                <TabsContent value="style" className="p-4 m-0">
                  <StyleConfiguration />
                </TabsContent>
              </Tabs>
            </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Preview */}
        <div className="relative w-[450px] border-l border-border bg-card/50 backdrop-blur-sm overflow-y-auto overflow-x-hidden flex flex-col flex-shrink-0">
          <div className="scrollbar-hide pt-2 flex flex-col h-full max-h-[calc(100vh-100px)]">
            {/* SVG Preview - Exatamente 415px de largura */}
            <div className="bg-gradient-to-br from-muted/30 via-muted/20 to-muted/10 p-0 flex items-start justify-center mb-4" style={{ width: "450px" }}>
              {(() => {
                console.log('[Wizard] Render check:', {
                  enabledPluginsLength: enabledPlugins.length,
                  enabledPlugins: enabledPlugins,
                  allPluginsState: Object.entries(plugins).map(([name, config]) => ({
                    name,
                    enabled: config?.enabled,
                    sections: config?.sections,
                    sectionsLength: config?.sections?.length,
                  })),
                })
                
                if (enabledPlugins.length > 0) {
                  console.log('[Wizard] ✅ Showing LivePreview')
                  return (
                    <div className="w-full flex justify-center h-full" style={{ width: "415px" }}>
                      <LivePreview />
                    </div>
                  )
                } else {
                  console.log('[Wizard] ❌ Showing "enable plugin" message')
                  return (
                    <div className="flex items-center justify-center h-full" style={{ width: "415px" }}>
                      <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                          <Package className="h-4 w-4 mr-2" />
                          Habilite pelo menos um plugin para ver o preview
                        </p>
                      </div>
                    </div>
                  )
                }
              })()}
            </div>

            {/* Warning e Botão - Sempre no final */}
            <div className="sticky bottom-0 bg-card pt-2 border-t-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full">
                      <Button
                        onClick={handleFinish}
                        disabled={isSaving || hasMissingEssential || enabledPlugins.length === 0}
                        className={cn(
                          "w-full gap-2 shadow-lg",
                          hasMissingEssential
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                            : "bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 shadow-pink-500/20"
                        )}
                        size="lg"
                      >
                        {isSaving ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            />
                            Gerando...
                          </>
                        ) : (
                          <>
                            {hasMissingEssential ? (
                              <>
                                <AlertTriangle className="w-4 h-4" />
                                Configuração incompleta
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4" />
                                Finalize
                              </>
                            )}
                          </>
                        )}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {hasMissingEssential && missingConfigs.length > 0 && (
                    <TooltipContent side="top" className="max-w-sm">
                      <div className="space-y-2">
                        <p className="font-semibold text-sm">Configurações faltando:</p>
                        <ul className="text-xs space-y-1 list-disc list-inside">
                          {missingConfigs.map((missing, idx) => (
                            <li key={idx}>
                              <span className="font-medium capitalize">{missing.plugin}</span>: {missing.label}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

