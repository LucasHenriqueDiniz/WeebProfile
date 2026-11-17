"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Svg } from "@/lib/db/schema"
import { getPluginIcon } from "@/lib/plugin-icons"
import { formatRelative } from "@/lib/utils/relative-time"
import { useLocale } from "@/i18n/use-translations"
import { usePluginI18n } from "@/lib/plugins/i18n-helper"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { Copy, Edit2, ExternalLink, Image as ImageIcon, Loader2, MoreVertical, RefreshCw, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

type SectionMeta = { id: string; name: string; i18nKey?: { name?: string } }

export const STATUS_DOT: Record<string, string> = {
  completed: "bg-emerald-400",
  generating: "bg-cyan-400 animate-pulse",
  pending: "bg-amber-400",
  failed: "bg-red-400",
}

interface SvgLibraryCardProps {
  svg: Svg
  index: number
  imageErrored: boolean
  onImageError: () => void
  onImageLoad: () => void
  onCopyUrl: () => void
  onView: () => void
  onEdit: () => void
  onForceGenerate: () => void
  onDelete: () => void
  isGenerating: boolean
  isDeleting: boolean
  t: (key: string, params?: Record<string, unknown>) => string
}

/**
 * Tallest a card's preview gets in the library. Most cards fit; a tall one (MyAnimeList
 * statistics with last activity is 415x910) is cut there with a fade, and the detail
 * page shows it whole.
 */
const PREVIEW_MAX_HEIGHT = 440

/**
 * One saved SVG in the library: the published image at its real width, then the name,
 * the sections, the status and the actions.
 *
 * It used to be a list row with a 110x62 thumbnail showing the top 7-15% of the card,
 * "default · 415px" wrapping in a 96px cell, and three quarters of the page empty under
 * a free plan of at most 3 SVGs.
 */
export function SvgLibraryCard({
  svg,
  index,
  imageErrored,
  onImageError,
  onImageLoad,
  onCopyUrl,
  onView,
  onEdit,
  onForceGenerate,
  onDelete,
  isGenerating,
  isDeleting,
  t,
}: SvgLibraryCardProps) {
  const locale = useLocale()
  const { tWithFallback } = usePluginI18n()
  const hasImage = svg.storageUrl && svg.status === "completed" && !imageErrored
  const cacheBuster = svg.lastGeneratedAt
    ? new Date(svg.lastGeneratedAt).getTime()
    : svg.updatedAt
      ? new Date(svg.updatedAt).getTime()
      : Date.now()

  const pluginsConfig = (svg.pluginsConfig ?? {}) as Record<
    string,
    { enabled?: boolean; sections?: string[] } | undefined
  >
  // pluginsOrder first, then any other plugin that draws something. SVGs saved before
  // the order was persisted have pluginsOrder null, and reading only that left their
  // rows with no plugin icons and no sections.
  const ordered = (svg.pluginsOrder || "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
  const configured = Object.keys(pluginsConfig)
    .filter((p) => pluginsConfig[p]?.enabled !== false && (pluginsConfig[p]?.sections?.length ?? 0) > 0)
    .sort()
  const plugins = [...ordered, ...configured.filter((p) => !ordered.includes(p))]
  const visiblePlugins = plugins.slice(0, 4)

  // What the card shows, in the wizard's words. The name is generated from the plugins,
  // so two cards of one plugin shared it ("Myanimelist Stats" twice) and the slug under
  // it was cut before the part that differs; the sections are what actually differs.
  const sectionGroups = plugins
    .map((plugin) => {
      const metadata = (PLUGINS_METADATA as Record<string, { displayName?: string; sections?: SectionMeta[] }>)[plugin]
      const names = (pluginsConfig[plugin]?.sections ?? []).map((id) => {
        const section = metadata?.sections?.find((s) => s.id === id)
        if (!section) return id
        const key = section.i18nKey?.name
        return key ? tWithFallback(key.replace(/^plugins\./, ""), section.name) : section.name
      })
      return { plugin: metadata?.displayName ?? plugin, names }
    })
    .filter((group) => group.names.length > 0)
  // Several plugins can each have a "Statistics": name the plugin only when it is needed.
  const sectionsSummary = sectionGroups
    .map(({ plugin, names }) => (sectionGroups.length > 1 ? `${plugin}: ${names.join(", ")}` : names.join(" · ")))
    .join(" · ")
  const slugPath = `/${svg.slug || svg.id.slice(0, 8)}`
  const statusLabel =
    svg.status === "completed"
      ? t("status.ready")
      : svg.status === "failed"
        ? t("status.failed")
        : svg.status === "generating"
          ? t("status.generating")
          : t("status.pending")

  const [cutOff, setCutOff] = useState(false)
  const width = svg.size === "full" ? 830 : 415

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className={cn(
        "group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40",
        svg.size === "full" && "lg:col-span-2"
      )}
      onClick={onView}
    >
      {/* Preview at the card's real width, up to PREVIEW_MAX_HEIGHT */}
      <div className="flex flex-1 items-start justify-center bg-muted/30 p-4">
        <div className="relative w-full overflow-hidden" style={{ maxWidth: width, maxHeight: PREVIEW_MAX_HEIGHT }}>
          {hasImage ? (
            <img
              src={`${svg.storageUrl}?v=${cacheBuster}`}
              alt={svg.name}
              className="block h-auto w-full"
              loading="lazy"
              onError={onImageError}
              onLoad={(event) => {
                const img = event.currentTarget
                setCutOff(img.getBoundingClientRect().height > PREVIEW_MAX_HEIGHT + 1)
                onImageLoad()
              }}
            />
          ) : (
            <div className="flex h-40 w-full items-center justify-center rounded-lg border border-dashed border-border">
              {svg.status === "generating" ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : imageErrored ? (
                <img src="/sora/sora-head.png" alt="" className="h-8 w-8 object-contain opacity-50" />
              ) : (
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          )}
          {cutOff && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent"
            />
          )}
        </div>
      </div>

      <div className="border-t border-border p-4">
        <div className="flex items-start gap-3">
          {/* Name + sections */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold transition-colors group-hover:text-primary" title={slugPath}>
              {svg.name}
            </h3>
            {sectionsSummary ? (
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{sectionsSummary}</p>
            ) : (
              <code className="mt-0.5 block truncate font-mono text-xs text-muted-foreground">{slugPath}</code>
            )}
          </div>

          {/* Actions — stop propagation so the card click (view) doesn't swallow them */}
          {/* Nao e um elemento interativo: existe so para impedir que cliques nos
              botoes filhos subam ate o card. Nao ha acao propria a expor ao teclado. */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div className="flex flex-shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs"
              onClick={onCopyUrl}
              aria-label={t("copyMarkdown")}
            >
              <Copy className="h-3.5 w-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">{t("copyMarkdown")}</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onView} aria-label={t("view")}>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label={t("moreActions")}>
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  {t("edit")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onForceGenerate} disabled={isGenerating || svg.status === "generating"}>
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  {t("forceGenerate")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onDelete}
                  disabled={isDeleting}
                  className="text-destructive focus:text-destructive"
                >
                  {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  {t("delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Status · style and size · last generation, each kept on one line */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <span
              className={cn("h-1.5 w-1.5 flex-shrink-0 rounded-full", STATUS_DOT[svg.status] ?? "bg-muted-foreground")}
            />
            {statusLabel}
          </span>
          <span className="whitespace-nowrap font-mono text-[11px]">
            {svg.style} · {width}px
          </span>
          <span className="whitespace-nowrap" title={svg.lastGeneratedAt ?? undefined}>
            {formatRelative(svg.lastGeneratedAt ?? null, locale)}
          </span>
          {visiblePlugins.length > 0 && (
            <span className="ml-auto flex items-center gap-1">
              {visiblePlugins.map((plugin) => {
                const Icon = getPluginIcon(plugin)
                return Icon ? (
                  <span
                    key={plugin}
                    title={plugin}
                    className="flex h-5 w-5 items-center justify-center rounded bg-muted text-muted-foreground"
                  >
                    <Icon className="h-3 w-3" />
                  </span>
                ) : null
              })}
              {plugins.length > visiblePlugins.length && (
                <span className="font-mono text-[10px] text-muted-foreground/70">
                  +{plugins.length - visiblePlugins.length}
                </span>
              )}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  )
}
