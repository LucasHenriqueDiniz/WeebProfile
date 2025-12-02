"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useWizardStore } from "@/stores/wizard-store"
import { Step2Plugins } from "./steps/Step2Plugins"
import { Step3Style } from "./steps/Step3Style"
import { Step4Preview } from "./steps/Step4Preview"
import { TopNavBar } from "./TopNavBar"
import { PreviewPanel } from "./PreviewPanel"
import { NavigationFooter } from "./NavigationFooter"
import { TemplateSelectorModal } from "./TemplateSelectorModal"
import { useToast } from "@/hooks/use-toast"
import { svgApi, ApiException } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"

interface WizardProps {
  isEditMode?: boolean
  editSvgId?: string
}

export function Wizard({ isEditMode = false, editSvgId }: WizardProps = {}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const {
    currentStep,
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
    setStep,
    setBasicInfo,
    validateStep,
  } = useWizardStore()

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setStep(currentStep + 1)
      }
    } else {
      toast({
        title: "Validação",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      })
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1)
    } else {
      router.push("/dashboard")
    }
  }

  const handleFinish = async () => {
    if (!validateStep(3)) {
      toast({
        title: "Validação",
        description: "Por favor, complete todos os passos",
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

  const steps = [
    { number: 1, title: "Estilo" },
    { number: 2, title: "Plugins" },
    { number: 3, title: "Preview" },
  ]

  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <Step3Style />
      case 2:
        return <Step2Plugins />
      case 3:
        return <Step4Preview />
      default:
        return <Step3Style />
    }
  }

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
      <TopNavBar 
        showPreview={showPreview} 
        onTogglePreview={() => setShowPreview(!showPreview)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8 flex items-start justify-between"
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
                  <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
                    Criar Nova Imagem
                  </span>
                </h1>
                <p className="text-muted-foreground text-lg">
                  Configure sua imagem SVG para o perfil do GitHub
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTemplateModal(true)}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Templates</span>
              </Button>
            </motion.div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {renderStepComponent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Preview Panel - Hidden on final preview step */}
        {currentStep > 1 && currentStep < 3 && (
          <PreviewPanel isVisible={showPreview} />
        )}
      </div>

      {/* Navigation Footer */}
      <NavigationFooter
        currentStep={currentStep}
        totalSteps={3}
        onPrevious={handleBack}
        onNext={handleNext}
        onSave={handleFinish}
        isSaving={isSaving}
      />

      {/* Template Selector Modal */}
      <TemplateSelectorModal open={showTemplateModal} onOpenChange={setShowTemplateModal} />
    </div>
  )
}

