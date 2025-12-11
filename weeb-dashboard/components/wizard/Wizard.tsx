"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { useWizardStore } from "@/stores/wizard-store"
import { Step2Plugins } from "./steps/Step2Plugins"
import { Step3Style } from "./steps/Step3Style"
import { Header } from "@/components/layout/Header"
import { LivePreview } from "./LivePreview"
import { useToast } from "@/hooks/use-toast"
import { svgApi, ApiException } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { Badge } from "@/components/ui/badge"

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
    isValid,
    setBasicInfo,
    validateStep,
  } = useWizardStore()

  const enabledPlugins = pluginsOrder.filter((name) => plugins[name]?.enabled)
  const totalSections = enabledPlugins.reduce((sum, name) => {
    return sum + (plugins[name]?.sections?.length || 0)
  }, 0)

  const handleFinish = async () => {
    // Validate both steps
    const pluginsValid = validateStep(1)
    const styleValid = validateStep(2)
    
    if (!pluginsValid || !styleValid) {
      toast({
        title: "Validação",
        description: "Por favor, complete todos os campos obrigatórios",
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
      
      pluginsOrder.forEach((pluginName) => {
        const plugin = plugins[pluginName]
        if (plugin.enabled) {
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
        } else {
          pluginsConfig[`PLUGIN_${pluginName.toUpperCase()}`] = false
        }
      })

      // Gerar name e slug automaticamente baseado nos plugins habilitados
      const enabledPluginNames = pluginsOrder.filter((name) => plugins[name]?.enabled)
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

      // 1. Criar/Atualizar SVG
      const svgData = {
        name: autoName,
        style,
        size,
        theme,
        hideTerminalEmojis,
        hideTerminalHeader,
        customCss: customCss || null,
        customThemeColors: theme === 'custom' ? customThemeColors : undefined,
        pluginsOrder: pluginsOrder.join(","),
        pluginsConfig,
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

          // Redirecionar para página de visualização com a URL
          router.push(`/dashboard/${svgId}?url=${encodeURIComponent(svgUrl)}`)
        } else {
          // Se não tem URL ainda, redirecionar mesmo assim (a página vai fazer polling)
          toast({
            title: "Imagem criada",
            description: "A imagem está sendo gerada. Você será redirecionado...",
          })
          router.push(`/dashboard/${svgId}`)
        }
      } catch (generateError) {
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

  const hasMissingEssential = enabledPlugins.some((name) => {
    const plugin = plugins[name]
    if (!plugin?.enabled) return false
    const metadata = PLUGINS_METADATA[name as keyof typeof PLUGINS_METADATA]
    if (!metadata) return false
    return metadata.requiredFields.some((field) => {
      const value = (plugin as any)[field]
      if (typeof value === 'string') return !value.trim()
      return !value
    })
  })

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
      <div className="flex-1 flex overflow-hidden pt-[65px]">
        {/* LEFT: Configuration */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 max-w-6xl mx-auto">
            {/* Tabs */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "plugins" | "style")}>
                <div className="flex border-b border-border">
                  <TabsList className="w-full h-auto p-0 bg-transparent">
                    <TabsTrigger
                      value="plugins"
                      className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Plugins
                    </TabsTrigger>
                    <TabsTrigger
                      value="style"
                      className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Style
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="plugins" className="p-4 m-0">
                  <Step2Plugins />
                </TabsContent>

                <TabsContent value="style" className="p-4 m-0">
                  <Step3Style />
                </TabsContent>
              </Tabs>
            </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Preview (fixed width 415px) */}
        <div className="w-[415px] border-l border-border bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col flex-shrink-0">
          <div className="p-4 flex flex-col h-full">
            {/* SVG Preview - Exatamente 415px de largura */}
            <div className="flex-1 rounded-xl border-2 border-dashed border-border bg-gradient-to-br from-muted/30 via-muted/20 to-muted/10 p-0 flex items-start justify-center overflow-hidden min-h-0 mb-4" style={{ width: "415px", marginLeft: "-16px", marginRight: "-16px" }}>
              {enabledPlugins.length > 0 ? (
                <div className="w-full flex justify-center" style={{ width: "415px" }}>
                  <LivePreview compact />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full" style={{ width: "415px" }}>
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Habilite plugins para ver o preview
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Warning e Botão - Sempre no final */}
            <div className="flex-shrink-0 space-y-3 pt-3 border-t border-border">
              {/* Warning badge se necessário */}
              {hasMissingEssential && (
                <Badge variant="destructive" className="w-full justify-center text-xs">
                  Missing essential configuration
                </Badge>
              )}

              {/* Finalize Button */}
              <Button
                onClick={handleFinish}
                disabled={isSaving || !isValid.step1 || !isValid.step2 || hasMissingEssential}
                className="w-full gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 shadow-lg shadow-pink-500/20"
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
                    <Check className="w-4 h-4" />
                    Finalize
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

