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
import { Copy, Edit2, ExternalLink, Image as ImageIcon, Loader2, MoreVertical, RefreshCw, Trash2 } from "lucide-react"
import { motion } from "framer-motion"

export const STATUS_DOT: Record<string, string> = {
  completed: "bg-emerald-400",
  generating: "bg-cyan-400 animate-pulse",
  pending: "bg-amber-400",
  failed: "bg-red-400",
}

interface SvgLibraryRowProps {
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

// A library row, not a card grid item: this is meant to read like a file/asset list in a
// creative tool (thumbnail + metadata + actions in one line), not identical square blocks.
export function SvgLibraryRow({
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
}: SvgLibraryRowProps) {
  const locale = useLocale()
  const hasImage = svg.storageUrl && svg.status === "completed" && !imageErrored
  const cacheBuster = svg.lastGeneratedAt
    ? new Date(svg.lastGeneratedAt).getTime()
    : svg.updatedAt
      ? new Date(svg.updatedAt).getTime()
      : Date.now()

  const plugins = (svg.pluginsOrder || "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
  const visiblePlugins = plugins.slice(0, 4)
  const statusLabel =
    svg.status === "completed"
      ? t("status.ready")
      : svg.status === "failed"
        ? t("status.failed")
        : svg.status === "generating"
          ? t("status.generating")
          : t("status.pending")

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
      className="group flex cursor-pointer items-center gap-4 px-3 py-3 transition-colors hover:bg-accent/50"
      onClick={onView}
    >
      {/* Thumbnail */}
      <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-muted/40 md:w-28">
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-10 h-2.5 w-2.5 border-l-2 border-t-2 border-cyan-400/40 transition-colors group-hover:border-cyan-400"
        />
        {hasImage ? (
          <img
            src={`${svg.storageUrl}?v=${cacheBuster}`}
            alt={svg.name}
            className="h-full w-full object-cover object-top"
            loading="lazy"
            onError={onImageError}
            onLoad={onImageLoad}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            {svg.status === "generating" ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : imageErrored ? (
              <img src="/sora/sora-head.png" alt="" className="h-6 w-6 object-contain opacity-50" />
            ) : (
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        )}
      </div>

      {/* Name + slug + plugins */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold transition-colors group-hover:text-primary">{svg.name}</h3>
        <div className="mt-1 flex items-center gap-2">
          <code className="truncate font-mono text-[11px] text-muted-foreground">
            /{svg.slug || svg.id.slice(0, 8)}
          </code>
          {visiblePlugins.length > 0 && (
            <span className="hidden items-center gap-1 sm:flex">
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

      {/* Style · size */}
      <span className="hidden w-24 flex-shrink-0 text-right font-mono text-[11px] text-muted-foreground sm:block">
        {svg.style} · {svg.size === "full" ? "830px" : "415px"}
      </span>

      {/* Status — dot + label instead of a loud badge */}
      <span className="hidden w-24 flex-shrink-0 items-center gap-1.5 md:flex">
        <span
          className={cn("h-1.5 w-1.5 flex-shrink-0 rounded-full", STATUS_DOT[svg.status] ?? "bg-muted-foreground")}
        />
        <span className="truncate text-xs text-muted-foreground">{statusLabel}</span>
      </span>

      {/* Updated */}
      <span className="hidden w-24 flex-shrink-0 text-right text-xs text-muted-foreground lg:block">
        {formatRelative(svg.lastGeneratedAt ?? null, locale)}
      </span>

      {/* Actions — stop propagation so row click (view) doesn't swallow them */}
      <div className="flex flex-shrink-0 items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="sm" className="hidden h-8 px-2.5 text-xs sm:inline-flex" onClick={onCopyUrl}>
          <Copy className="mr-1.5 h-3.5 w-3.5" />
          {t("copyMarkdown")}
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onView}>
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onCopyUrl} className="sm:hidden">
              <Copy className="mr-2 h-4 w-4" />
              {t("copyMarkdown")}
            </DropdownMenuItem>
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
    </motion.div>
  )
}
