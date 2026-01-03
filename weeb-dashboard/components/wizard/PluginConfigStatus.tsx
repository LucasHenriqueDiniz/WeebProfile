"use client"

import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import type { PluginConfig } from "@/stores/wizard-store"

interface PluginConfigStatusProps {
  pluginName: string
  pluginConfig: PluginConfig
  missingConfigs: Array<{ plugin: string; field: string; label: string }>
  secretsPresence?: Record<string, { exists: boolean; updatedAt?: string }>
}

/**
 * Unified status component for plugin configuration
 * 
 * Shows status only for enabled plugins with sections (espelha backend validation).
 * Status appears in ONE place to avoid duplication.
 */
export function PluginConfigStatus({
  pluginName,
  pluginConfig,
  missingConfigs,
  secretsPresence,
}: PluginConfigStatusProps) {
  const pluginMissing = missingConfigs.filter(m => m.plugin === pluginName)
  
  // Only show status for enabled plugins with sections (espelha backend)
  if (!pluginConfig.enabled || !pluginConfig.sections?.length) {
    return null
  }
  
  const hasMissing = pluginMissing.length > 0
  
  if (hasMissing) {
    return (
      <Badge variant="destructive" className="text-[10px] font-medium">
        <AlertCircle className="w-3 h-3 mr-1" />
        Faltam {pluginMissing.length} configuração{pluginMissing.length > 1 ? "ões" : ""}
      </Badge>
    )
  }
  
  // Verificar se todos os secrets existem
  const allSecretsPresent = secretsPresence
    ? Object.values(secretsPresence).every(p => p.exists)
    : false
  
  if (allSecretsPresent) {
    return (
      <Badge variant="default" className="text-[10px] font-medium bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Configurado
      </Badge>
    )
  }
  
  return null
}

