"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  DEFAULT_THEME_VARIABLES,
  DEFAULT_THEME_VARIABLE_DESCRIPTIONS,
  DEFAULT_THEME_VARIABLE_LABELS,
  defaultThemes as themesFromPlugins,
} from "@weeb/weeb-plugins/themes"
import { useWizardStore } from "@/stores/wizard-store"
import React, { useCallback, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import { useTranslations } from "@/i18n/use-translations"

export function StyleConfiguration() {
  const t = useTranslations("wizard.style")
  const {
    style,
    size,
    theme,
    hideTerminalEmojis,
    hideTerminalHeader,
    customCss,
    customThemeColors,
    setStyle,
    setSize,
    setTheme,
    setHideTerminalEmojis,
    setHideTerminalHeader,
    setCustomCss,
    setCustomThemeColor,
    resetCustomThemeColors,
  } = useWizardStore()

  // Local state for debounce of color pickers
  const [localColors, setLocalColors] = useState<Record<string, string>>(customThemeColors)
  const debounceTimersRef = React.useRef<Record<string, NodeJS.Timeout>>({})

  // Sync with store when changed externally
  useEffect(() => {
    setLocalColors(customThemeColors)
  }, [customThemeColors])

  // Get default value for a theme variable
  const getDefaultColor = (variable: string): string => {
    const theme = themesFromPlugins.custom || themesFromPlugins.default
    return theme[variable as keyof typeof theme] || "#000000"
  }

  // Debounce to update theme color
  const handleColorChange = useCallback(
    (variable: string, value: string) => {
      // Update visual immediately
      setLocalColors((prev) => ({ ...prev, [variable]: value }))

      // Clear previous timer
      if (debounceTimersRef.current[variable]) {
        clearTimeout(debounceTimersRef.current[variable])
      }

      // Debounce only to update store
      debounceTimersRef.current[variable] = setTimeout(() => {
        setCustomThemeColor(variable, value)
        delete debounceTimersRef.current[variable]
      }, 500)
    },
    [setCustomThemeColor]
  )

  // Cleanup
  useEffect(() => {
    return () => {
      Object.values(debounceTimersRef.current).forEach((timer) => {
        if (timer) clearTimeout(timer)
      })
    }
  }, [])

  const themes =
    style === "default"
      ? ["default", "purple", "pink", "cyan", "orange", "blue", "green", "red", "custom"]
      : ["default", "dracula", "monokai"]

  return (
    <div className="divide-y divide-border/60">
      {/* Style selector */}
      <div className="py-4 first:pt-0 space-y-2.5">
        <p className="text-sm font-semibold text-foreground">{t("title")}</p>
        <div className="flex gap-2">
          {["default", "terminal"].map((s) => (
            <label key={s} className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="style"
                className="sr-only peer"
                checked={style === s}
                onChange={() => setStyle(s as "default" | "terminal")}
              />
              <div className="rounded-md border border-border px-3 py-2 text-center peer-checked:border-primary peer-checked:bg-primary/10 transition-all">
                <span className="text-sm font-medium capitalize">{t(`options.${s}`)}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Size selector */}
      <div className="py-4 space-y-2.5">
        <p className="text-sm font-semibold text-foreground">{t("size")}</p>
        <div className="flex gap-2">
          {[
            { value: "half", label: t("options.halfWidth"), desc: "415px" },
            { value: "full", label: t("options.fullWidth"), desc: "830px" },
          ].map((s) => (
            <label key={s.value} className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="size"
                className="sr-only peer"
                checked={size === s.value}
                onChange={() => setSize(s.value as "half" | "full")}
              />
              <div className="rounded-md border border-border px-3 py-2 text-center peer-checked:border-primary peer-checked:bg-primary/10 transition-all">
                <span className="text-sm font-medium">{s.label}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Theme selector */}
      <div className="py-4 space-y-2.5">
        <p className="text-sm font-semibold text-foreground">{t("theme")}</p>
        <div className="flex flex-wrap gap-1.5">
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize",
                theme === t
                  ? "bg-gradient-to-r from-violet-500 to-cyan-500 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Theme Colors */}
      {theme === "custom" && style === "default" && (
        <div className="py-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{t("customColors")}</p>
            <Button type="button" variant="outline" size="sm" onClick={resetCustomThemeColors} className="h-7 text-xs">
              <RotateCcw className="w-3 h-3 mr-1" />
              {t("reset")}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DEFAULT_THEME_VARIABLES.filter((v) => v !== "--default-color-raw").map((variable) => {
              const defaultValue = getDefaultColor(variable)
              const currentValue = localColors[variable] || defaultValue
              return (
                <div key={variable} className="space-y-1.5">
                  <Label className="text-xs font-medium">{DEFAULT_THEME_VARIABLE_LABELS[variable]}</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={currentValue}
                      onChange={(e) => handleColorChange(variable, e.target.value)}
                      className="w-12 h-8 cursor-pointer border border-border bg-background shrink-0 rounded"
                    />
                    <Input
                      type="text"
                      value={currentValue}
                      onChange={(e) => handleColorChange(variable, e.target.value)}
                      placeholder={defaultValue}
                      className="flex-1 h-8 text-xs font-mono"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Terminal Options */}
      {style === "terminal" && (
        <div className="py-4 space-y-2">
          <p className="text-sm font-semibold text-foreground mb-1">{t("terminalOptions")}</p>
          <div className="flex items-center justify-between py-1.5">
            <div className="space-y-0.5 flex-1">
              <Label htmlFor="hide-emojis" className="text-sm font-medium cursor-pointer">
                {t("hideEmojis")}
              </Label>
              <p className="text-xs text-muted-foreground">{t("hideEmojisDescription")}</p>
            </div>
            <Switch id="hide-emojis" checked={hideTerminalEmojis} onCheckedChange={setHideTerminalEmojis} />
          </div>
          <div className="flex items-center justify-between py-1.5">
            <div className="space-y-0.5 flex-1">
              <Label htmlFor="hide-header" className="text-sm font-medium cursor-pointer">
                {t("hideHeader")}
              </Label>
              <p className="text-xs text-muted-foreground">{t("hideHeaderDescription")}</p>
            </div>
            <Switch id="hide-header" checked={hideTerminalHeader} onCheckedChange={setHideTerminalHeader} />
          </div>
        </div>
      )}

      {/* Custom CSS - area maior, aparencia de editor de codigo (sem dependencia nova) */}
      <div className="py-4 last:pb-0 space-y-2">
        <p className="text-sm font-semibold text-foreground">{t("customCss")}</p>
        <p className="text-xs text-muted-foreground">{t("customCssDescription")}</p>
        <Textarea
          value={customCss}
          onChange={(e) => setCustomCss(e.target.value)}
          placeholder={t("customCssPlaceholder")}
          spellCheck={false}
          className="w-full min-h-[220px] rounded-md border border-border bg-[#0a0f1e] text-slate-200 px-3 py-2.5 text-xs font-mono leading-relaxed focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  )
}
