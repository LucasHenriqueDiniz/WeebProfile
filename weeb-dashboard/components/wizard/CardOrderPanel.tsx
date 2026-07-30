"use client"

/**
 * Painel "Ordem" - reordena os cards do SVG.
 *
 * A ordem final do SVG tem dois niveis, e os dois sao editaveis aqui:
 *  - plugins: `pluginsOrder` (mesma lista que o svg-generator usa em renderPlugins)
 *  - secoes de cada plugin: o array `sections`, que todo Render<Plugin> percorre na
 *    ordem em que vem (por isso reordenar o array ja muda o SVG, sem tocar nos plugins).
 *
 * Cada item pode ser arrastado pelo grip (framer-motion Reorder) ou movido pelos botoes
 * de seta - o teclado precisa de um caminho que nao dependa de drag.
 */

import { Reorder, useDragControls } from "framer-motion"
import { ArrowDown, ArrowUp, GripVertical, ListOrdered, Layers } from "lucide-react"
import { useCallback, useMemo } from "react"
import { useShallow } from "zustand/react/shallow"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { useWizardStore } from "@/stores/wizard-store"
import { selectPluginsWithSections } from "@/stores/wizard-selectors"
import { getPluginIcon } from "@/lib/plugin-icons"
import { usePluginI18n } from "@/lib/plugins/i18n-helper"
import { useTranslations } from "@/i18n/use-translations"
import { cn } from "@/lib/utils"

/** Move um item de `from` para `to` retornando um novo array (nao muta o original). */
function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length || from === to) return items
  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

interface MoveButtonsProps {
  index: number
  total: number
  onMove: (to: number) => void
  label: string
  size?: "sm" | "xs"
}

function MoveButtons({ index, total, onMove, label, size = "sm" }: MoveButtonsProps) {
  const t = useTranslations("wizard.order")
  const iconClass = size === "xs" ? "h-3 w-3" : "h-3.5 w-3.5"
  const btnClass = cn(
    "flex items-center justify-center rounded-md border border-border text-muted-foreground transition-colors",
    "hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground",
    size === "xs" ? "h-5 w-5" : "h-6 w-6"
  )

  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      <button
        type="button"
        className={btnClass}
        disabled={index === 0}
        onClick={() => onMove(index - 1)}
        aria-label={`${t("moveUp")}: ${label}`}
      >
        <ArrowUp className={iconClass} />
      </button>
      <button
        type="button"
        className={btnClass}
        disabled={index === total - 1}
        onClick={() => onMove(index + 1)}
        aria-label={`${t("moveDown")}: ${label}`}
      >
        <ArrowDown className={iconClass} />
      </button>
    </div>
  )
}

interface SectionRowProps {
  pluginName: string
  sectionId: string
  index: number
  total: number
  onMove: (to: number) => void
}

function SectionRow({ pluginName, sectionId, index, total, onMove }: SectionRowProps) {
  const t = useTranslations("wizard.order")
  const { tWithFallback } = usePluginI18n()
  const controls = useDragControls()

  const metadata = PLUGINS_METADATA[pluginName as keyof typeof PLUGINS_METADATA]
  const section = metadata?.sections.find((s) => s.id === sectionId) as any
  const name = section
    ? section.i18nKey?.name
      ? tWithFallback(section.i18nKey.name.replace(/^plugins\./, ""), section.name)
      : section.name
    : sectionId

  return (
    <Reorder.Item
      value={sectionId}
      dragListener={false}
      dragControls={controls}
      className="flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1.5"
    >
      <button
        type="button"
        onPointerDown={(event) => controls.start(event)}
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
        aria-label={`${t("dragHandle")}: ${name}`}
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <span className="flex-1 min-w-0 truncate text-xs text-foreground">{name}</span>
      <span className="flex-shrink-0 text-[10px] font-mono text-muted-foreground">{index + 1}</span>
      <MoveButtons index={index} total={total} onMove={onMove} label={name} size="xs" />
    </Reorder.Item>
  )
}

interface PluginBlockProps {
  pluginName: string
  index: number
  total: number
  sections: string[]
  onMovePlugin: (to: number) => void
  onReorderSections: (sections: string[]) => void
}

function PluginBlock({ pluginName, index, total, sections, onMovePlugin, onReorderSections }: PluginBlockProps) {
  const t = useTranslations("wizard.order")
  const { tWithFallback } = usePluginI18n()
  const controls = useDragControls()

  const metadata = PLUGINS_METADATA[pluginName as keyof typeof PLUGINS_METADATA] as any
  const PluginIcon = getPluginIcon(pluginName)
  const displayName = metadata?.i18nKey?.displayName
    ? tWithFallback(metadata.i18nKey.displayName.replace(/^plugins\./, ""), metadata.displayName)
    : metadata?.displayName || pluginName

  return (
    <Reorder.Item
      value={pluginName}
      dragListener={false}
      dragControls={controls}
      className="rounded-lg border border-border bg-card"
    >
      <div className="flex items-center gap-2 px-2.5 py-2">
        <button
          type="button"
          onPointerDown={(event) => controls.start(event)}
          className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
          aria-label={`${t("dragHandle")}: ${displayName}`}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        {PluginIcon && <PluginIcon className="h-4 w-4 flex-shrink-0 text-primary" />}
        <span className="flex-1 min-w-0 truncate text-sm font-medium text-foreground">{displayName}</span>
        <span className="flex-shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
          {sections.length} {sections.length === 1 ? t("cardSingular") : t("cardPlural")}
        </span>
        <MoveButtons index={index} total={total} onMove={onMovePlugin} label={displayName} />
      </div>

      <Reorder.Group
        axis="y"
        values={sections}
        onReorder={onReorderSections}
        className="space-y-1 border-t border-border px-2.5 py-2"
      >
        {sections.map((sectionId, sectionIndex) => (
          <SectionRow
            key={sectionId}
            pluginName={pluginName}
            sectionId={sectionId}
            index={sectionIndex}
            total={sections.length}
            onMove={(to) => onReorderSections(moveItem(sections, sectionIndex, to))}
          />
        ))}
      </Reorder.Group>
    </Reorder.Item>
  )
}

export function CardOrderPanel() {
  const t = useTranslations("wizard.order")
  const { plugins, pluginsOrder } = useWizardStore(
    useShallow((state) => ({ plugins: state.plugins, pluginsOrder: state.pluginsOrder }))
  )
  const reorderPlugins = useWizardStore((state) => state.reorderPlugins)
  const setPluginSections = useWizardStore((state) => state.setPluginSections)

  // Só entram na lista os plugins que realmente viram card no SVG (habilitado + ao menos
  // uma seção) - é o mesmo critério que o preview e o backend usam pra renderizar.
  const visiblePlugins = useMemo(() => selectPluginsWithSections({ plugins, pluginsOrder }), [plugins, pluginsOrder])

  const handleReorderPlugins = useCallback(
    (newVisibleOrder: string[]) => {
      // pluginsOrder também guarda plugins desabilitados/sem seções, que não aparecem
      // aqui. Eles não afetam o render, então são mantidos depois dos visíveis.
      const hidden = pluginsOrder.filter((name) => !newVisibleOrder.includes(name))
      reorderPlugins([...newVisibleOrder, ...hidden])
    },
    [pluginsOrder, reorderPlugins]
  )

  if (visiblePlugins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/15 to-cyan-500/10">
          <ListOrdered className="h-6 w-6 text-primary/70" />
        </span>
        <p className="mb-1 text-sm font-medium text-foreground">{t("emptyTitle")}</p>
        <p className="max-w-[260px] text-xs text-muted-foreground">{t("emptyDescription")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div>
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Layers className="h-4 w-4" />
          {t("title")}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">{t("description")}</p>
      </div>

      <Reorder.Group axis="y" values={visiblePlugins} onReorder={handleReorderPlugins} className="space-y-2">
        {visiblePlugins.map((pluginName, pluginIndex) => (
          <PluginBlock
            key={pluginName}
            pluginName={pluginName}
            index={pluginIndex}
            total={visiblePlugins.length}
            sections={plugins[pluginName]?.sections || []}
            onMovePlugin={(to) => handleReorderPlugins(moveItem(visiblePlugins, pluginIndex, to))}
            onReorderSections={(sections) => setPluginSections(pluginName, sections)}
          />
        ))}
      </Reorder.Group>
    </div>
  )
}
