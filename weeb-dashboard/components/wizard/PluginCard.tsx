"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getPluginIcon } from "@/lib/plugins-data"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import type { PluginConfig } from "@/stores/wizard-store"

interface PluginCardProps {
  name: string
  data: {
    name: string
    icon: string
    description: string
    sections: Array<{ id: string; name: string; description?: string }>
  }
  enabled: boolean
  sectionsCount: number
  pluginConfig?: PluginConfig
  essentialConfigs?: Record<string, string | boolean | undefined>
  onToggle: () => void
  onRequiredFieldChange: (field: string, value: any) => void
}

export function PluginCard({
  name,
  data,
  enabled,
  sectionsCount,
  pluginConfig,
  essentialConfigs,
  onToggle,
  onRequiredFieldChange,
}: PluginCardProps) {
  const Icon = getPluginIcon(name)
  const metadata = PLUGINS_METADATA[name as keyof typeof PLUGINS_METADATA]
  const hasEssentialConfigs = essentialConfigs && Object.keys(essentialConfigs).length > 0
  const allEssentialConfigsSet = hasEssentialConfigs && Object.values(essentialConfigs).every((v) => v !== undefined && v !== "")

  return (
    <Card className={`transition-all ${enabled ? "border-primary/50 bg-primary/5" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {Icon && (
              <div className="flex-shrink-0">
                <Icon className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold truncate">{data.name}</CardTitle>
              <CardDescription className="text-xs line-clamp-2 mt-1">
                {data.description}
              </CardDescription>
            </div>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={onToggle}
            aria-label={`Toggle ${data.name} plugin`}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {enabled && (
          <>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Sections</span>
              <Badge variant={sectionsCount > 0 ? "default" : "secondary"}>
                {sectionsCount} selected
              </Badge>
            </div>

            {metadata?.requiredFields && metadata.requiredFields.length > 0 && (
              <div className="space-y-2">
                {metadata.requiredFields.map((field) => {
                  const value = pluginConfig?.[field as keyof PluginConfig] as string | undefined
                  const hasValue = value !== undefined && value !== ""

                  return (
                    <div key={field} className="space-y-1">
                      <Label className="text-xs font-medium capitalize">
                        {field.replace(/_/g, " ")}
                      </Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={value || ""}
                          onChange={(e) => onRequiredFieldChange(field, e.target.value)}
                          placeholder={`Enter ${field.replace(/_/g, " ")}`}
                          className="flex-1 h-8 px-2 text-xs rounded-md border border-input bg-background"
                        />
                        {hasValue ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {hasEssentialConfigs && !allEssentialConfigsSet && (
              <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 shrink-0" />
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  Essential configs needed
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

