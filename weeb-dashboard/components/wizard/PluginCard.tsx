"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit2, CheckCircle2, AlertTriangle, XCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { getPluginIcon } from "@/lib/plugins-data"
import { usePluginValidationStatus } from "@/hooks/usePluginValidationStatus"
import type { PluginConfig } from "@/stores/wizard-store"

interface PluginCardProps {
  name: string
  data: {
    name: string
    icon: string
    description: string
  }
  enabled: boolean
  username: string
  sectionsCount: number
  pluginConfig?: PluginConfig
  essentialConfigs?: Record<string, string | boolean | undefined>
  onToggle: () => void
  onUsernameChange: (username: string) => void
}

export function PluginCard({
  name,
  data,
  enabled,
  username,
  sectionsCount,
  pluginConfig,
  essentialConfigs,
  onToggle,
  onUsernameChange,
}: PluginCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localUsername, setLocalUsername] = useState(username)
  const validationStatus = usePluginValidationStatus(name, pluginConfig, essentialConfigs)

  // Sincronizar localUsername quando username prop mudar (mas não quando estiver editando)
  useEffect(() => {
    if (!isEditing) {
      setLocalUsername(username)
    }
  }, [username, isEditing])

  const handleSave = () => {
    if (localUsername !== username) {
      onUsernameChange(localUsername)
    }
    setIsEditing(false)
  }

  // Status visual colors
  const statusColors = {
    ok: "border-green-500 dark:border-green-400",
    warning: "border-yellow-500 dark:border-yellow-400",
    error: "border-red-500 dark:border-red-400",
  }

  const StatusIcon = {
    ok: CheckCircle2,
    warning: AlertTriangle,
    error: XCircle,
  }[validationStatus]

  const statusIconColors = {
    ok: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    error: "text-red-600 dark:text-red-400",
  }

  return (
    <Card
      className={cn(
        "transition-all",
        enabled && "ring-2 ring-primary",
        enabled && validationStatus !== "ok" && statusColors[validationStatus]
      )}
    >
      <CardHeader className="pb-2 pt-3 px-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {(() => {
              const IconComponent = getPluginIcon(name)
              return IconComponent ? (
                <IconComponent className="w-4 h-4 shrink-0" />
              ) : (
                <span className="text-lg shrink-0">{data.icon}</span>
              )
            })()}
            <CardTitle className="text-sm font-medium truncate">{data.name}</CardTitle>
            {enabled && (
              <StatusIcon className={cn("w-3.5 h-3.5 shrink-0", statusIconColors[validationStatus])} />
            )}
          </div>
          <Switch checked={enabled} onCheckedChange={onToggle} className="shrink-0" />
        </div>
        <CardDescription className="text-xs mt-1 line-clamp-2">{data.description}</CardDescription>
      </CardHeader>
      {enabled && (
        <CardContent className="space-y-2 pt-0 px-3 pb-3">
          {isEditing ? (
            <Input
              value={localUsername}
              onChange={(e) => setLocalUsername(e.target.value)}
              placeholder={`${data.name} username`}
              className="font-mono text-xs h-7"
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave()
                }
                if (e.key === "Escape") {
                  setLocalUsername(username)
                  setIsEditing(false)
                }
              }}
              autoFocus
            />
          ) : (
            <div className="flex items-center justify-between gap-1">
              <div className="flex-1 min-w-0">
                {username ? (
                  <p className="text-xs font-mono truncate">@{username}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">Clique para editar</p>
                )}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="ml-1 p-0.5 hover:bg-muted rounded shrink-0"
                type="button"
              >
                <Edit2 className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
          )}
          <div className="flex items-center">
            <Badge variant={sectionsCount > 0 ? "default" : "secondary"} className="text-xs py-0 px-1.5">
              {sectionsCount} seções
            </Badge>
          </div>
        </CardContent>
      )}
    </Card>
  )
}


