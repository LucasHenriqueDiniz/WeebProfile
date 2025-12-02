"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertTriangle, XCircle, Settings2 } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { getPluginIcon } from "@/lib/plugins-data"
import { usePluginValidationStatus } from "@/hooks/usePluginValidationStatus"
import { getPluginEssentialConfigKeys } from "@/lib/plugin-essential-configs"
import { PluginEssentialConfigsModal } from "./PluginEssentialConfigsModal"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { PluginConfig } from "@/stores/wizard-store"

interface PluginCardProps {
  name: string
  data: {
    name: string
    icon: string
    description: string
  }
  enabled: boolean
  sectionsCount: number
  pluginConfig?: PluginConfig
  essentialConfigs?: Record<string, string | boolean | undefined>
  onToggle: () => void
  onRequiredFieldChange?: (field: string, value: string) => void
}

export function PluginCard({
  name,
  data,
  enabled,
  sectionsCount,
  pluginConfig,
  essentialConfigs,
  onToggle,
  onRequiredFieldChange,
}: PluginCardProps) {
  const [showConfigModal, setShowConfigModal] = useState(false)
  const validationStatus = usePluginValidationStatus(name, pluginConfig, essentialConfigs)

  // Obter essential configs do plugin
  const essentialKeys = getPluginEssentialConfigKeys(name)
  // essentialConfigs vem como Record<string, boolean> onde true = configurado
  // Se essentialConfigs é undefined, usar objeto vazio
  const essentialConfigsForPlugin = essentialConfigs || {}
  
  // Contar quantas configs estão configuradas
  const configuredCount = essentialKeys.filter((keyDef) => {
    const value = essentialConfigsForPlugin[keyDef.key]
    // Se for boolean, verifica se é true. Se for string (legado), verifica se não está vazio
    if (typeof value === 'boolean') {
      return value === true
    }
    return value && typeof value === 'string' && value.trim().length > 0
  }).length
  
  const totalCount = essentialKeys.length
  const hasEssentialConfigs = totalCount > 0

  // Obter requiredFields do plugin
  const pluginMetadata = PLUGINS_METADATA[name as keyof typeof PLUGINS_METADATA]
  const requiredFields = (pluginMetadata?.requiredFields || []) as string[]
  const hasRequiredFields = requiredFields.length > 0

  // Status visual colors
  const statusColors = {
    ok: "border-green-500 dark:border-green-400",
    warning: "border-yellow-500 dark:border-yellow-400",
    error: "border-red-500 dark:border-red-400",
  }

  const StatusIcon = {
    ok: CheckCircle2,
    warning: AlertTriangle,
    error: XCircle,
  }[validationStatus]

  const statusIconColors = {
    ok: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    error: "text-red-600 dark:text-red-400",
  }

  return (
    <>
      <Card
        className={cn(
          "transition-all hover:shadow-md cursor-pointer",
          enabled && "ring-2 ring-primary shadow-md",
          enabled && validationStatus !== "ok" && statusColors[validationStatus]
        )}
        onClick={() => !enabled && onToggle()}
      >
        <CardHeader className="pb-3 pt-4 px-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5 flex-1 min-w-0">
              {(() => {
                const IconComponent = getPluginIcon(name)
                return IconComponent ? (
                  <div className={cn(
                    "p-2 rounded-lg shrink-0 transition-colors",
                    enabled ? "bg-primary/20" : "bg-muted"
                  )}>
                    <IconComponent className={cn(
                      "w-4 h-4",
                      enabled ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                ) : (
                  <div className={cn(
                    "p-2 rounded-lg shrink-0 transition-colors",
                    enabled ? "bg-primary/20" : "bg-muted"
                  )}>
                    <span className={cn(
                      "text-base",
                      enabled ? "text-primary" : "text-muted-foreground"
                    )}>{data.icon}</span>
                  </div>
                )
              })()}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-sm font-semibold truncate">{data.name}</CardTitle>
                  {enabled && (
                    <StatusIcon className={cn("w-4 h-4 shrink-0", statusIconColors[validationStatus])} />
                  )}
                </div>
                <CardDescription className="text-xs line-clamp-2 leading-relaxed">
                  {data.description}
                </CardDescription>
              </div>
            </div>
            <Switch 
              checked={enabled} 
              onCheckedChange={onToggle} 
              className="shrink-0"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </CardHeader>
        {enabled && (
          <CardContent className="space-y-3 pt-0 px-4 pb-4">
            {/* Required Fields */}
            {hasRequiredFields && (
              <div className="space-y-2 p-3 rounded-lg border bg-muted/30">
                <Label className="text-xs font-medium text-muted-foreground mb-2 block">Campos Obrigatórios</Label>
                <div className="space-y-2">
                  {requiredFields.map((field) => {
                    const fieldValue = (pluginConfig as any)?.[field] || ""
                    return (
                      <div key={field} className="space-y-1">
                        <Label htmlFor={`${name}-${field}-card`} className="text-xs">
                          {field === 'username' ? 'Username' : field.charAt(0).toUpperCase() + field.slice(1)} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`${name}-${field}-card`}
                          value={fieldValue}
                          onChange={(e) => {
                            e.stopPropagation()
                            onRequiredFieldChange?.(field, e.target.value)
                          }}
                          onClick={(e) => e.stopPropagation()}
                          placeholder={`Seu ${field === 'username' ? 'username' : field}`}
                          className="font-mono text-xs h-8"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Essential Configs Status */}
            {hasEssentialConfigs && (
              <div className="space-y-2 p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Configurações Sensíveis</span>
                  <Badge
                    variant={
                      configuredCount === totalCount
                        ? "default"
                        : configuredCount > 0
                        ? "secondary"
                        : "destructive"
                    }
                    className="text-xs"
                  >
                    {configuredCount}/{totalCount}
                  </Badge>
                </div>
                <Button
                  variant={configuredCount === totalCount ? "outline" : "default"}
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowConfigModal(true)
                  }}
                >
                  <Settings2 className="w-3 h-3 mr-2" />
                  {configuredCount === totalCount ? "Alterar" : "Configurar"}
                </Button>
              </div>
            )}
            
            {/* Sections Count */}
            <div className="flex items-center gap-2">
              <Badge 
                variant={sectionsCount > 0 ? "default" : "secondary"} 
                className="text-xs py-1 px-2"
              >
                {sectionsCount > 0 ? `${sectionsCount} seção${sectionsCount > 1 ? 'ões' : ''}` : "Nenhuma seção"}
              </Badge>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Config Modal */}
      <PluginEssentialConfigsModal
        open={showConfigModal}
        onOpenChange={setShowConfigModal}
        pluginName={name}
      />
    </>
  )
}


