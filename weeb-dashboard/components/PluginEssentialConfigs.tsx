"use client"

import { useState, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, CheckCircle2, XCircle, AlertCircle, Loader2, ExternalLink } from "lucide-react"
import { profileApi, ApiException } from "@/lib/api"
import { getPluginEssentialConfigKeys, type EssentialConfigKey } from "@/lib/plugin-essential-configs"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { getPluginIcon } from "@/lib/plugins-data"

interface PluginEssentialConfigsProps {
  activePlugins?: string[] // Filtra plugins a mostrar (se não fornecido, mostra todos)
  onSave?: () => void // Callback após salvar
}

export function PluginEssentialConfigs({ activePlugins, onSave }: PluginEssentialConfigsProps) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [configStatus, setConfigStatus] = useState<Record<string, Record<string, boolean>>>({})
  const [localValues, setLocalValues] = useState<Record<string, Record<string, string>>>({})

  // Obter lista de plugins (filtrada por activePlugins se fornecido)
  const availablePlugins = useMemo(() => {
    const allPlugins = Object.keys(PLUGINS_METADATA)
    if (!activePlugins || activePlugins.length === 0) {
      return allPlugins
    }
    return allPlugins.filter((name) => activePlugins.includes(name))
  }, [activePlugins])

  // Filtrar plugins por busca
  const filteredPlugins = useMemo(() => {
    if (!searchQuery.trim()) return availablePlugins

    const query = searchQuery.toLowerCase()
    return availablePlugins.filter((pluginName) => {
      const metadata = PLUGINS_METADATA[pluginName as keyof typeof PLUGINS_METADATA]
      if (!metadata) return false

      return (
        metadata.displayName.toLowerCase().includes(query) ||
        metadata.name.toLowerCase().includes(query) ||
        metadata.description.toLowerCase().includes(query)
      )
    })
  }, [availablePlugins, searchQuery])

  // Carregar configs do servidor
  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        setLoading(true)
        const response = await profileApi.getEssentialConfigs(activePlugins)
        setConfigStatus(response.essentialConfigs || {})
      } catch (error) {
        console.error("Error fetching essential configs:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as configurações",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchConfigs()
  }, [activePlugins, toast])

  // Atualizar valor local
  const updateLocalValue = (pluginName: string, key: string, value: string) => {
    setLocalValues((prev) => ({
      ...prev,
      [pluginName]: {
        ...prev[pluginName],
        [key]: value,
      },
    }))
  }

  // Obter valor local ou vazio
  const getLocalValue = (pluginName: string, key: string): string => {
    return localValues[pluginName]?.[key] || ""
  }

  // Verificar se está configurado
  const isConfigSet = (pluginName: string, key: string): boolean => {
    return configStatus[pluginName]?.[key] === true
  }

  // Salvar todas as alterações
  const handleSave = async () => {
    try {
      setSaving(true)

      // Construir objeto de essentialConfigs apenas com valores que foram alterados
      const essentialConfigs: Record<string, Record<string, string>> = {}

      for (const [pluginName, pluginValues] of Object.entries(localValues)) {
        if (!pluginValues || Object.keys(pluginValues).length === 0) continue

        essentialConfigs[pluginName] = {}
        for (const [key, value] of Object.entries(pluginValues)) {
          if (value && value.trim().length > 0) {
            essentialConfigs[pluginName]![key] = value.trim()
          }
        }
      }

      // Se não há alterações, não fazer nada
      if (Object.keys(essentialConfigs).length === 0) {
        toast({
          title: "Nenhuma alteração",
          description: "Não há alterações para salvar",
        })
        return
      }

      // Salvar via API
      await profileApi.update({
        essentialConfigs: essentialConfigs as any,
      })

      // Atualizar status local
      for (const [pluginName, pluginConfigs] of Object.entries(essentialConfigs)) {
        setConfigStatus((prev) => ({
          ...prev,
          [pluginName]: {
            ...prev[pluginName],
            ...Object.fromEntries(
              Object.keys(pluginConfigs).map((key) => [key, true])
            ),
          },
        }))
      }

      // Limpar valores locais
      setLocalValues({})

      toast({
        title: "Configurações salvas",
        description: "Suas configurações sensíveis foram salvas com sucesso",
      })

      onSave?.()
    } catch (error) {
      console.error("Error saving essential configs:", error)
      const errorMessage =
        error instanceof ApiException
          ? error.data.message || error.data.error || error.message
          : "Não foi possível salvar as configurações"

      toast({
        title: "Erro ao salvar",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar plugins..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Lista de Plugins */}
      {filteredPlugins.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>Nenhum plugin encontrado</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPlugins.map((pluginName) => {
            const metadata = PLUGINS_METADATA[pluginName as keyof typeof PLUGINS_METADATA]
            if (!metadata) return null

            const essentialKeys = getPluginEssentialConfigKeys(pluginName)
            if (essentialKeys.length === 0) return null

            const IconComponent = getPluginIcon(pluginName)

            // Contar quantas configs estão configuradas
            const configuredCount = essentialKeys.filter((keyDef) => 
              isConfigSet(pluginName, keyDef.key)
            ).length
            const totalCount = essentialKeys.length
            const allConfigured = configuredCount === totalCount

            return (
              <div key={pluginName} className="space-y-4 p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
                {/* Header do Plugin */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    {IconComponent ? (
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-primary/10">
                        <span className="text-xl">{metadata.icon}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base">{metadata.displayName}</h3>
                        {allConfigured && (
                          <Badge variant="default" className="text-xs gap-1 bg-green-600">
                            <CheckCircle2 className="w-3 h-3" />
                            Configurado
                          </Badge>
                        )}
                        {!allConfigured && configuredCount > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {configuredCount}/{totalCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{metadata.description}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Config Keys */}
                <div className="space-y-4">
                  {essentialKeys.map((keyDef: EssentialConfigKey) => {
                    const isSet = isConfigSet(pluginName, keyDef.key)
                    const localValue = getLocalValue(pluginName, keyDef.key)
                    const showValue = localValue.length > 0

                    return (
                      <div key={keyDef.key} className="space-y-2 p-3 rounded-lg border bg-muted/30">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Label htmlFor={`${pluginName}-${keyDef.key}`} className="text-sm font-medium">
                              {keyDef.label} <span className="text-destructive">*</span>
                            </Label>
                            {isSet && !showValue && (
                              <Badge variant="outline" className="text-xs gap-1 border-green-300 bg-green-50 dark:bg-green-950/20">
                                <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
                                Configurado
                              </Badge>
                            )}
                            {!isSet && (
                              <Badge variant="outline" className="text-xs gap-1 border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20">
                                <XCircle className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                                Necessário
                              </Badge>
                            )}
                          </div>
                          {keyDef.helpUrl && (
                            <a
                              href={keyDef.helpUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-1 shrink-0"
                            >
                              Como obter?
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <Input
                          id={`${pluginName}-${keyDef.key}`}
                          type={keyDef.type}
                          value={showValue ? localValue : ""}
                          onChange={(e) => updateLocalValue(pluginName, keyDef.key, e.target.value)}
                          placeholder={
                            isSet && !showValue
                              ? "Digite um novo valor para alterar (valor atual não é exibido por segurança)"
                              : keyDef.placeholder || `seu-${keyDef.key}`
                          }
                          className={cn(
                            "font-mono text-sm",
                            isSet && !showValue && "border-green-300 bg-green-50/50 dark:bg-green-950/10",
                            !isSet && "border-yellow-300 bg-yellow-50/50 dark:bg-yellow-950/10"
                          )}
                        />
                        {isSet && !showValue && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Valor já configurado. Digite um novo valor para alterar.
                          </p>
                        )}
                        {keyDef.description && (
                          <p className="text-xs text-muted-foreground mt-1">{keyDef.description}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Botão Salvar */}
      {Object.keys(localValues).length > 0 && (
        <div className="sticky bottom-0 bg-background border-t pt-4 pb-2 -mx-6 px-6">
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setLocalValues({})}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

