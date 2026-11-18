"use client"

import { PauseCircle } from "lucide-react"
import { useTranslations } from "@/i18n/use-translations"
import { isSuspended } from "@/lib/plugins/suspended"
import { cn } from "@/lib/utils"

/** The label and the reason of a suspended plugin, or null when it is not suspended. */
export function useSuspension(pluginId: string): { label: string; reason: string } | null {
  const t = useTranslations("pluginStatus")
  if (!isSuspended(pluginId)) return null
  return { label: t("suspended"), reason: t(`reasons.${pluginId}`) }
}

/** "Suspended" pill for a plugin that cannot generate right now; the reason is its tooltip. */
export function SuspendedBadge({ pluginId, className }: { pluginId: string; className?: string }) {
  const suspension = useSuspension(pluginId)
  if (!suspension) return null
  return (
    <span
      title={suspension.reason}
      className={cn(
        "inline-flex flex-none items-center gap-1 rounded-full border border-amber-500/50 bg-amber-500/10 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400",
        className
      )}
    >
      <PauseCircle className="h-3 w-3" />
      {suspension.label}
    </span>
  )
}

/** The reason in full, for places with room for a line of text. */
export function SuspendedReason({ pluginId, className }: { pluginId: string; className?: string }) {
  const suspension = useSuspension(pluginId)
  if (!suspension) return null
  return <p className={cn("text-xs text-amber-700 dark:text-amber-400", className)}>{suspension.reason}</p>
}
