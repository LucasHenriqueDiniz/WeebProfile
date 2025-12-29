"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
// Temporary simplified imports
const DEFAULT_THEME_VARIABLES = {}
const DEFAULT_THEME_VARIABLE_DESCRIPTIONS = {}
const DEFAULT_THEME_VARIABLE_LABELS = {}
const themesFromPlugins = []
import { useWizardStore } from "@/stores/wizard-store"
import React, { useCallback, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

export function StyleConfiguration() {
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
    return theme[variable as keyof typeof theme] || '#000000'
  }

  // Debounce to update theme color
  const handleColorChange = useCallback((variable: string, value: string) => {
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
  }, [setCustomThemeColor])

  // Cleanup
  useEffect(() => {
    return () => {
      Object.values(debounceTimersRef.current).forEach((timer) => {
        if (timer) clearTimeout(timer)
      })
    }
  }, [])

  const themes = style === "default" 
    ? ["default", "purple", "pink", "cyan", "orange", "blue", "green", "red", "custom"]
    : ["default", "dracula", "monokai"]

  return (
    <div className="space-y-3">
      {/* Style selector */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <p className="text-sm font-semibold text-foreground">Style</p>
        <div className="flex gap-3">
          {["default", "terminal"].map((s) => (
            <label key={s} className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="style"
                className="sr-only peer"
                checked={style === s}
                onChange={() => setStyle(s as "default" | "terminal")}
              />
              <div className="rounded-lg border-2 border-border bg-muted/50 px-4 py-3 text-center peer-checked:border-primary peer-checked:bg-primary/10 transition-all">
                <span className="text-sm font-medium capitalize">{s}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Size selector */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <p className="text-sm font-semibold text-foreground">Size</p>
        <div className="flex gap-3">
          {[
            { value: "half", label: "Half Width", desc: "415px" },
            { value: "full", label: "Full Width", desc: "830px" },
          ].map((s) => (
            <label key={s.value} className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="size"
                className="sr-only peer"
                checked={size === s.value}
                onChange={() => setSize(s.value as "half" | "full")}
              />
              <div className="rounded-lg border-2 border-border bg-muted/50 px-4 py-3 text-center peer-checked:border-primary peer-checked:bg-primary/10 transition-all">
                <span className="text-sm font-medium">{s.label}</span>
                <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Theme selector */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <p className="text-sm font-semibold text-foreground">Theme</p>
        <div className="flex flex-wrap gap-2">
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize",
                theme === t
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30"
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
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Custom Colors</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetCustomThemeColors}
              className="h-7 text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DEFAULT_THEME_VARIABLES.filter(v => v !== '--default-color-raw').map((variable) => {
              const defaultValue = getDefaultColor(variable)
              const currentValue = localColors[variable] || defaultValue
              return (
                <div key={variable} className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    {DEFAULT_THEME_VARIABLE_LABELS[variable]}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={currentValue}
                      onChange={(e) => handleColorChange(variable, e.target.value)}
                      className="w-12 h-8 cursor-pointer border-2 border-border bg-background shrink-0 rounded"
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
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <p className="text-sm font-semibold text-foreground">Terminal Options</p>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
            <div className="space-y-0.5 flex-1">
              <Label htmlFor="hide-emojis" className="text-sm font-medium cursor-pointer">
                Hide Emojis
              </Label>
              <p className="text-xs text-muted-foreground">
                Remove emoji icons from terminal output
              </p>
            </div>
            <Switch
              id="hide-emojis"
              checked={hideTerminalEmojis}
              onCheckedChange={setHideTerminalEmojis}
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
            <div className="space-y-0.5 flex-1">
              <Label htmlFor="hide-header" className="text-sm font-medium cursor-pointer">
                Hide Header
              </Label>
              <p className="text-xs text-muted-foreground">
                Remove the terminal header bar
              </p>
            </div>
            <Switch
              id="hide-header"
              checked={hideTerminalHeader}
              onCheckedChange={setHideTerminalHeader}
            />
          </div>
        </div>
      )}

      {/* Custom CSS */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-2">
        <p className="text-sm font-semibold text-foreground">Custom CSS</p>
        <p className="text-xs text-muted-foreground">
          Additional CSS applied on top of the selected theme.
        </p>
        <Textarea
          value={customCss}
          onChange={(e) => setCustomCss(e.target.value)}
          placeholder="/* custom CSS here */"
          className="w-full min-h-[160px] rounded-md border border-border bg-muted/50 px-3 py-2 text-xs font-mono focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  )
}


