"use client"

import { useEffect, useRef } from "react"
import { AlertCircle, Check, Plus } from "lucide-react"
import { PLUGINS_METADATA, type PluginCategory } from "@weeb/weeb-plugins/plugins/metadata"
import { TILE } from "@/components/landing/sticker"
import { CATEGORY_STYLE } from "@/lib/landing/category-style"
import { LANDING_PLUGINS } from "@/lib/landing/landing-plugins"
import { getPluginIcon } from "@/lib/plugin-icons"
import { usePluginI18n } from "@/lib/plugins/i18n-helper"
import { isSuspended } from "@/lib/plugins/suspended"
import { useTranslations } from "@/i18n/use-translations"
import { cn } from "@/lib/utils"
import type { PluginWorkspace } from "./usePluginWorkspace"

type Meta = { displayName: string; category: PluginCategory; i18nKey?: { displayName?: string } }
const META = PLUGINS_METADATA as unknown as Record<string, Meta>

/** The profile plugins in the landing's order; the repository card has its own wizard. */
const STRIP_PLUGINS = LANDING_PLUGINS.filter((id) => id !== "github_repo" && META[id])

/**
 * Every plugin in one row above the card: picking one opens its settings in the drawer.
 * A plugin on the card shows how many sections it draws, or a warning when it draws none
 * or misses a setting; the others show a plus.
 *
 * It replaces the list column with search and category filters. Fourteen plugins fit a
 * row (it scrolls sideways on narrow screens), and the filters were kept in the store, so
 * a filter set once could hide plugins from a strip that has no way to clear it.
 */
export function PluginStrip({ workspace }: { workspace: PluginWorkspace }) {
  const t = useTranslations("wizard.plugins")
  const tTabs = useTranslations("wizard.tabs")
  const { tWithFallback } = usePluginI18n()
  const { plugins, selectedPlugin, missingConfigs, setSelectedPlugin } = workspace
  const stripRef = useRef<HTMLElement>(null)
  const selectedRef = useRef<HTMLButtonElement>(null)

  // Keep the chosen plugin in view, e.g. when "pending settings" picks one off-screen.
  // Scrolls the strip only: scrollIntoView also scrolled the page, pushing the bar out.
  useEffect(() => {
    const strip = stripRef.current
    const chip = selectedRef.current
    if (!strip || !chip) return
    const left = chip.offsetLeft - strip.offsetLeft
    if (left < strip.scrollLeft) strip.scrollLeft = left - 16
    else if (left + chip.offsetWidth > strip.scrollLeft + strip.clientWidth)
      strip.scrollLeft = left + chip.offsetWidth - strip.clientWidth + 16
  }, [selectedPlugin])

  return (
    <nav
      ref={stripRef}
      aria-label={tTabs("plugins")}
      className="flex flex-shrink-0 gap-2 overflow-x-auto border-b-2 border-foreground bg-background px-4 py-3 lg:px-5"
    >
      {STRIP_PLUGINS.map((id) => {
        const state = plugins[id]
        if (!state) return null
        const meta = META[id]!
        const Icon = getPluginIcon(id)
        const name = meta.i18nKey?.displayName
          ? tWithFallback(meta.i18nKey.displayName.replace(/^plugins\./, ""), meta.displayName)
          : meta.displayName
        const sections = state.sections?.length ?? 0
        const missing = state.enabled && missingConfigs.some((m) => m.plugin === id)
        const onCard = state.enabled && sections > 0
        const selected = selectedPlugin === id
        return (
          <button
            key={id}
            ref={selected ? selectedRef : undefined}
            type="button"
            aria-pressed={selected}
            onClick={() => setSelectedPlugin(id)}
            className={cn(
              "flex flex-none items-center gap-2 rounded-xl border-2 py-1 pl-1 pr-2.5 text-[13px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected
                ? "border-foreground bg-card text-foreground shadow-[3px_3px_0_0_hsl(var(--primary))]"
                : onCard
                  ? "border-foreground/60 bg-card text-foreground hover:border-foreground"
                  : "border-foreground/20 text-muted-foreground hover:border-foreground/60 hover:text-foreground",
              isSuspended(id) && "opacity-60"
            )}
          >
            <span className={cn(TILE, "h-7 w-7 rounded-lg", CATEGORY_STYLE[meta.category].sticker)}>
              {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
            </span>
            {name}
            {missing || (state.enabled && sections === 0) ? (
              <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-label={t("missing")} />
            ) : onCard ? (
              <span className="inline-flex items-center gap-0.5 rounded-md bg-foreground px-1.5 font-mono text-[11px] text-background">
                <Check className="h-3 w-3" />
                {sections}
              </span>
            ) : (
              <Plus className="h-3.5 w-3.5" aria-hidden />
            )}
          </button>
        )
      })}
    </nav>
  )
}
