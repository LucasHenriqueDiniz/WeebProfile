"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ValidationIndicatorProps {
  isValid: boolean
  isLoading?: boolean
  error?: string
  className?: string
}

export function ValidationIndicator({ isValid, isLoading, error, className }: ValidationIndicatorProps) {
  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Validando...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("flex items-center gap-1.5 text-xs text-destructive", className)}>
        <AlertCircle className="h-3 w-3" />
        <span>{error}</span>
      </div>
    )
  }

  if (isValid) {
    return (
      <div className={cn("flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400", className)}>
        <CheckCircle2 className="h-3 w-3" />
        <span>Válido</span>
      </div>
    )
  }

  return null
}

interface PluginStatusBadgeProps {
  isValid: boolean
  hasConfig: boolean
  sectionsCount: number
  totalSections: number
  className?: string
}

export function PluginStatusBadge({ isValid, hasConfig, sectionsCount, totalSections, className }: PluginStatusBadgeProps) {
  if (!hasConfig) {
    return (
      <Badge variant="destructive" className={cn("text-[10px] font-medium", className)}>
        <AlertCircle className="h-2.5 w-2.5 mr-1" />
        Config required
      </Badge>
    )
  }

  if (sectionsCount === 0) {
    return (
      <Badge variant="outline" className={cn("text-[10px] font-medium text-amber-600 dark:text-amber-400", className)}>
        <AlertCircle className="h-2.5 w-2.5 mr-1" />
        No sections
      </Badge>
    )
  }

  if (isValid && sectionsCount > 0) {
    return (
      <Badge variant="secondary" className={cn("text-[10px] font-medium bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400", className)}>
        <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
        Ready ({sectionsCount}/{totalSections})
      </Badge>
    )
  }

  return null
}


