"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { profileApi, ApiException } from "@/lib/api"
import { getMissingEssentialConfigs, getPluginEssentialConfigKeys } from "@/lib/config/plugin-essential-configs"
import type { EssentialConfigs } from "@/lib/db/types"

interface ProfileConfigModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  enabledPlugins: string[] // Lista de plugins habilitados
  onSave: () => void
}

export function ProfileConfigModal({ open, onOpenChange, enabledPlugins, onSave }: ProfileConfigModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<{
    username?: string
    essentialConfigs?: EssentialConfigs
  }>({})
  const [configStatus, setConfigStatus] = useState<Record<string, Record<string, boolean>>>({})

  useEffect(() => {
    if (open) {
      fetchProfile()
    }
  }, [open])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      
      // Buscar perfil e essential configs separadamente
      const [profileData, essentialConfigsData] = await Promise.all([
        profileApi.get(),
        profileApi.getEssentialConfigs(enabledPlugins),
      ])
      
      setProfile({
        username: profileData.profile?.username || user?.user_metadata?.user_name || "",
        essentialConfigs: (essentialConfigsData.essentialConfigs || {}) as EssentialConfigs,
      })
      // ConfigStatus indica apenas se está configurado (sem valores)
      setConfigStatus(essentialConfigsData.essentialConfigs || {})
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar o perfil",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    // Validar campos obrigatórios
    const missingConfigs = getMissingEssentialConfigs(enabledPlugins, profile.essentialConfigs || {})
    
    if (missingConfigs.length > 0) {
      const missingFieldsList = missingConfigs
        .map(({ pluginName, missingKeys }) => 
          missingKeys.map(key => `${pluginName}.${key.key}`).join(', ')
        )
        .join(', ')
      
      toast({
        title: "Campos obrigatórios",
        description: `Por favor, preencha todos os campos obrigatórios: ${missingFieldsList}`,
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      await profileApi.update({
        username: profile.username,
        essentialConfigs: profile.essentialConfigs || {},
      })

      toast({
        title: "Perfil atualizado",
        description: "Suas configurações foram salvas com sucesso",
      })

      onSave()
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving profile:", error)
      const errorMessage =
        error instanceof ApiException
          ? error.data.message || error.data.error || error.message
          : "Não foi possível salvar o perfil"
      
      const isNetworkError = errorMessage.toLowerCase().includes("network") || 
                            errorMessage.toLowerCase().includes("fetch") ||
                            errorMessage.toLowerCase().includes("failed")
      
      toast({
        title: "Erro ao salvar",
        description: isNetworkError 
          ? `${errorMessage}. Verifique sua conexão e tente novamente.`
          : errorMessage,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Obter campos necessários baseado nos plugins habilitados
  const requiredConfigs = enabledPlugins.flatMap((pluginName) => {
    const keys = getPluginEssentialConfigKeys(pluginName)
    return keys.map((keyDef) => ({ pluginName, keyDef }))
  })

  // Função para atualizar um essentialConfig específico
  const updateEssentialConfig = (pluginName: string, key: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      essentialConfigs: {
        ...(prev.essentialConfigs || {}),
        [pluginName]: {
          ...(prev.essentialConfigs?.[pluginName] || {}),
          [key]: value,
        },
      },
    }))
  }

  // Verificar se um essentialConfig está configurado
  const isConfigSet = (pluginName: string, key: string): boolean => {
    return configStatus[pluginName]?.[key] === true
  }

  // Obter valor local (apenas o que o usuário digitou, não o valor salvo)
  const getLocalValue = (pluginName: string, key: string): string => {
    return profile.essentialConfigs?.[pluginName]?.[key] || ''
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configurar Perfil</DialogTitle>
          <DialogDescription>
            Configure as credenciais sensíveis dos plugins habilitados (API keys, tokens, etc.). Estas serão usadas em todas as suas imagens SVG.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Username (sempre visível) */}
            <div className="space-y-2">
              <Label htmlFor="username">
                Username
              </Label>
              <Input
                id="username"
                value={profile.username || ""}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                placeholder="seu-username"
                className="font-mono"
              />
            </div>

            {/* Essential Configs por Plugin */}
            {requiredConfigs.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Configurações Sensíveis dos Plugins</h3>
                  
                  {enabledPlugins.map((pluginName) => {
                    const keys = getPluginEssentialConfigKeys(pluginName)
                    if (keys.length === 0) return null

                    return (
                      <div key={pluginName} className="space-y-3 p-3 border rounded-md">
                        <h4 className="text-sm font-medium capitalize">{pluginName}</h4>
                        {keys.map((keyDef) => {
                          const isSet = isConfigSet(pluginName, keyDef.key)
                          const localValue = getLocalValue(pluginName, keyDef.key)
                          const showValue = localValue.length > 0 // Mostrar apenas se usuário digitou algo
                          
                          return (
                            <div key={keyDef.key} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Label htmlFor={`${pluginName}-${keyDef.key}`}>
                                    {keyDef.label} <span className="text-destructive">*</span>
                                  </Label>
                                  {isSet && (
                                    <Badge variant="outline" className="text-xs gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                                      Configurado
                                    </Badge>
                                  )}
                                  {!isSet && (
                                    <Badge variant="outline" className="text-xs gap-1 border-yellow-300">
                                      <XCircle className="w-3 h-3 text-yellow-600" />
                                      Não configurado
                                    </Badge>
                                  )}
                                </div>
                                {keyDef.helpUrl && (
                                  <a
                                    href={keyDef.helpUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline"
                                  >
                                    Como obter?
                                  </a>
                                )}
                              </div>
                              <Input
                                id={`${pluginName}-${keyDef.key}`}
                                type={keyDef.type}
                                value={showValue ? localValue : ''}
                                onChange={(e) => updateEssentialConfig(pluginName, keyDef.key, e.target.value)}
                                placeholder={
                                  isSet 
                                    ? "Digite para alterar (valor atual não é exibido por segurança)"
                                    : (keyDef.placeholder || `seu-${keyDef.key}`)
                                }
                                className="font-mono"
                              />
                              {isSet && !showValue && (
                                <p className="text-xs text-muted-foreground">
                                  ⚠️ Valor já configurado. Digite um novo valor para alterar.
                                </p>
                              )}
                              {keyDef.description && (
                                <p className="text-xs text-muted-foreground">{keyDef.description}</p>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {requiredConfigs.length > 0 && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-md flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Campos marcados com <span className="text-destructive">*</span> são obrigatórios para os plugins selecionados
                </p>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


