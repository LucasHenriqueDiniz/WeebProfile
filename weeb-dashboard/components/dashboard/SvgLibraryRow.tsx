"use client"

import { Badge } from "@/components/ui/badge"
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
import {
  Copy,
  Edit2,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  MoreVertical,
  RefreshCw,
  Trash2,
} from "lucide-react"
import { motion } from "framer-motion"

const styleColors: Record<string, string> = {
  default: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  terminal: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
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
  const hasImage = svg.storageUrl && svg.status === "completed" && !imageErrored
  const cacheBuster = svg.lastGeneratedAt
    ? new Date(svg.lastGeneratedAt).getTime()
    : svg.updatedAt
      ? new Date(svg.updatedAt).getTime()
      : Date.now()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
      className="group flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-white/[0.03] transition-colors"
    >
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 w-20 h-14 md:w-24 md:h-16 rounded-md overflow-hidden border border-white/[0.06] bg-white/[0.02]">
        <div
          aria-hidden
          className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400/40 group-hover:border-cyan-400 transition-colors z-10 pointer-events-none"
        />
        {hasImage ? (
          <img
            src={`${svg.storageUrl}?v=${cacheBuster}`}
            alt={svg.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={onImageError}
            onLoad={onImageLoad}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {svg.status === "generating" ? (
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            ) : imageErrored ? (
              <img src="/sora/sora-head.png" alt="" className="w-6 h-6 object-contain opacity-50" />
            ) : (
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        )}
      </div>

      {/* Name + slug */}
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">{svg.name}</h3>
        <code className="text-[11px] text-muted-foreground font-mono truncate block">
          /{svg.slug || svg.id.slice(0, 8)}
        </code>
      </div>

      {/* Type */}
      <Badge variant="outline" className={cn("hidden sm:inline-flex flex-shrink-0", styleColors[svg.style] || styleColors.default, "border-0")}>
        {svg.style}
      </Badge>

      {/* Status */}
      <Badge
        variant={
          svg.status === "completed"
            ? "default"
            : svg.status === "generating"
              ? "secondary"
              : svg.status === "failed"
                ? "destructive"
                : "outline"
        }
        className="hidden md:inline-flex flex-shrink-0 gap-1"
      >
        {svg.status === "generating" && <Loader2 className="w-3 h-3 animate-spin" />}
        {svg.status === "completed"
          ? t("status.ready")
          : svg.status === "failed"
            ? t("status.failed")
            : svg.status === "generating"
              ? t("status.generating")
              : t("status.pending")}
      </Badge>

      {/* Updated */}
      <span className="hidden lg:block flex-shrink-0 text-xs text-muted-foreground w-24 text-right">
        {svg.lastGeneratedAt ? new Date(svg.lastGeneratedAt).toLocaleDateString() : "—"}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs hidden sm:inline-flex" onClick={onCopyUrl}>
          <Copy className="w-3.5 h-3.5 mr-1.5" />
          {t("copyMarkdown")}
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onView}>
          <ExternalLink className="w-3.5 h-3.5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="w-3.5 h-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onCopyUrl} className="sm:hidden">
              <Copy className="w-4 h-4 mr-2" />
              {t("copyMarkdown")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit}>
              <Edit2 className="w-4 h-4 mr-2" />
              {t("edit")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onForceGenerate} disabled={isGenerating || svg.status === "generating"}>
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {t("forceGenerate")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} disabled={isDeleting} className="text-destructive focus:text-destructive">
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              {t("delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  )
}
