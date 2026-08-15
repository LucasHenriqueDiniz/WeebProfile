"use client"

import { Badge } from "@/components/ui/badge"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { getPluginIcon } from "@/lib/plugin-icons"
import { AlertCircle, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePluginI18n } from "@/lib/plugins/i18n-helper"
import { useTranslations } from "@/i18n/use-translations"
import type { PluginConfig } from "@/stores/wizard-store"

interface PluginRowProps {
  plugin: { name: string; categoryId?: string }
  state: PluginConfig
  isSelected: boolean
  missingConfigs: Array<{ plugin: string; field: string; label: string }>
  onSelect: (pluginName: string) => void
}

// Linha compacta da lista - so identidade e status, nunca campos/thumbnails. A
// configuracao completa vive no painel central quando este item e selecionado.
export function PluginRow({ plugin, state, isSelected, missingConfigs, onSelect }: PluginRowProps) {
  const metadata = PLUGINS_METADATA[plugin.name as keyof typeof PLUGINS_METADATA]
  const { tWithFallback } = usePluginI18n()
  const t = useTranslations("wizard.plugins")
  if (!metadata) return null

  const PluginIcon = getPluginIcon(plugin.name)
  const activeSectionCount = state.sections?.length || 0
  const pluginMissingConfigs = missingConfigs.filter((m) => m.plugin === plugin.name)
  const hasMissingRequired = pluginMissingConfigs.length > 0 && state.enabled

  // "KEY" e "LOGIN" dizem coisas diferentes ao usuário: um pede uma credencial que
  // ele precisa ir buscar em outro site e colar; o outro é um botão de entrar.
  // Antes os dois tipos caíam em "KEY", e o Steam -- que só faz login e usa chave da
  // aplicação -- aparecia pedindo uma chave que ninguém precisa fornecer.
  const keyTypes = metadata.essentialConfigKeysMetadata?.map((k: { type: string }) => k.type) ?? []
  const credentialBadge = keyTypes.includes("password") ? "KEY" : keyTypes.includes("oauth") ? "LOGIN" : null

  const displayName = (() => {
    const meta = metadata as any
    if (meta.i18nKey?.displayName) {
      return tWithFallback(meta.i18nKey.displayName.replace(/^plugins\./, ""), metadata.displayName)
    }
    return metadata.displayName
  })()

  const description = (() => {
    const meta = metadata as any
    if (meta.i18nKey?.description) {
      return tWithFallback(meta.i18nKey.description.replace(/^plugins\./, ""), metadata.description)
    }
    return metadata.description
  })()

  return (
    <button
      onClick={() => onSelect(plugin.name)}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors relative",
        isSelected ? "bg-primary/10" : "hover:bg-muted/60",
        hasMissingRequired && "border-l-2 border-l-amber-400 dark:border-l-amber-500"
      )}
    >
      {isSelected && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary" />
      )}
      <span
        className={cn(
          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors",
          isSelected ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
        )}
      >
        {PluginIcon ? <PluginIcon className="h-4 w-4" /> : null}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={cn("text-sm font-medium truncate", isSelected && "text-primary")}>{displayName}</span>
          {credentialBadge && (
            <span className="flex-shrink-0 rounded border border-border px-1 py-px font-mono text-[9px] leading-none text-muted-foreground">
              {credentialBadge}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        {state.enabled ? (
          activeSectionCount > 0 ? (
            <Badge variant="secondary" className="text-[10px] gap-1">
              <Check className="h-2.5 w-2.5" />
              {activeSectionCount}
            </Badge>
          ) : (
            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
          )
        ) : (
          <span className="w-2 h-2 rounded-full bg-border flex-shrink-0" aria-label={t("inactive")} />
        )}
      </div>
    </button>
  )
}
