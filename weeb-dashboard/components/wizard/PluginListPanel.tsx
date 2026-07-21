"use client"

import { Input } from "@/components/ui/input"
import { Search, X, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAllTags, type PluginTag } from "@/lib/config/plugin-tags"
import type { PluginCategory } from "@weeb/weeb-plugins/plugins/metadata"
import { useTranslations } from "@/i18n/use-translations"
import { EmptyState } from "./EmptyState"
import { PluginRow } from "./PluginRow"
import type { PluginWorkspace } from "./usePluginWorkspace"

interface PluginListPanelProps {
  workspace: PluginWorkspace
}

// Coluna "Plugins" - lista compacta com busca e filtros. Nunca renderiza campos ou
// thumbnails de um plugin especifico; isso vive no PluginDetailPanel ao lado.
export function PluginListPanel({ workspace }: PluginListPanelProps) {
  const t = useTranslations("wizard.plugins")
  const {
    plugins,
    filteredPlugins,
    missingConfigs,
    category,
    query,
    onlyEnabled,
    selectedPlugin,
    setCategory,
    setQuery,
    setOnlyEnabled,
    setSelectedPlugin,
  } = workspace

  const categoryLabels: Record<string, string> = {
    all: t("categories.all"),
    coding: t("categories.coding"),
    music: t("categories.music"),
    anime: t("categories.anime"),
    gaming: t("categories.gaming"),
    health: t("categories.health"),
    productivity: t("categories.productivity"),
    social: t("categories.social"),
    entertainment: t("categories.entertainment"),
  }
  const categories: Array<PluginCategory | "all" | PluginTag> = [
    "all",
    "coding",
    "music",
    "anime",
    "gaming",
    ...getAllTags(),
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Busca e filtros fixos no topo */}
      <div className="flex-shrink-0 p-3 space-y-2.5 border-b border-white/[0.06]">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 pr-8 h-8 text-sm"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "px-2 py-1 rounded-full text-[11px] font-medium transition-all capitalize",
                category === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={onlyEnabled}
            onChange={(e) => setOnlyEnabled(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-input text-primary focus:ring-primary"
          />
          <span className="text-muted-foreground">{t("onlyEnabled")}</span>
        </label>
      </div>

      {/* Resumo compacto de validacao - o texto completo e a acao de salvar ficam no
          header/tooltip; aqui e so um atalho para ir ate os plugins com pendencia. */}
      {missingConfigs.length > 0 && (
        <button
          onClick={() => {
            const first = missingConfigs[0]
            if (first) setSelectedPlugin(first.plugin)
          }}
          className="flex-shrink-0 flex items-center gap-2 px-3 py-2 border-b border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 text-left hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-colors"
        >
          <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500 flex-shrink-0" />
          <span className="text-xs text-amber-800 dark:text-amber-300">
            {missingConfigs.length === 1
              ? "1 configuração pendente"
              : `${missingConfigs.length} configurações pendentes`}
          </span>
        </button>
      )}

      {/* Lista com scroll proprio */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredPlugins.length > 0 ? (
          <div className="space-y-0.5">
            {filteredPlugins.map((plugin) => {
              const state = plugins[plugin.name]
              if (!state) return null
              return (
                <PluginRow
                  key={plugin.name}
                  plugin={plugin}
                  state={state}
                  isSelected={selectedPlugin === plugin.name}
                  missingConfigs={missingConfigs}
                  onSelect={setSelectedPlugin}
                />
              )
            })}
          </div>
        ) : (
          <EmptyState
            query={query}
            category={category}
            onlyEnabled={onlyEnabled}
            onClearFilters={() => {
              setQuery("")
              setCategory("all")
              setOnlyEnabled(false)
            }}
          />
        )}
      </div>
    </div>
  )
}
