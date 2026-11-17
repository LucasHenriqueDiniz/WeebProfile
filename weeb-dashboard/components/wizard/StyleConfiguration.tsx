"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  DEFAULT_THEME_VARIABLES,
  DEFAULT_THEME_VARIABLE_LABELS,
  defaultThemes as themesFromPlugins,
  terminalThemes,
} from "@weeb/weeb-plugins/themes"
import React, { useCallback, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronDown, Play, RotateCcw } from "lucide-react"
import { useTranslations } from "@/i18n/use-translations"

export interface StyleConfigurationProps {
  style: "default" | "terminal"
  theme: string
  hideTerminalEmojis: boolean
  hideTerminalHeader: boolean
  fontFamily: string
  terminalHeaderText: string
  customCss: string
  customThemeColors: Record<string, string>
  colorMode: "fixed" | "auto"
  setStyle: (style: "default" | "terminal") => void
  setTheme: (theme: string) => void
  setHideTerminalEmojis: (value: boolean) => void
  setHideTerminalHeader: (value: boolean) => void
  setFontFamily: (value: string) => void
  setColorMode: (value: "fixed" | "auto") => void
  setTerminalHeaderText: (value: string) => void
  setCustomCss: (css: string) => void
  setCustomThemeColor: (variable: string, value: string) => void
  resetCustomThemeColors: () => void
  // Opt-in card animations. The toggle shows only when the wizard passes a setter.
  animations?: boolean
  setAnimations?: (value: boolean) => void
  onReplayAnimations?: () => void
}

// Store-agnostic: reused by both the Profile wizard (useWizardStore) and the
// Repository wizard (useRepositoryWizardStore) — each passes its own slice down.
export function StyleConfiguration({
  style,
  theme,
  hideTerminalEmojis,
  hideTerminalHeader,
  fontFamily,
  terminalHeaderText,
  customCss,
  customThemeColors,
  colorMode,
  setStyle,
  setTheme,
  setHideTerminalEmojis,
  setHideTerminalHeader,
  setFontFamily,
  setColorMode,
  setTerminalHeaderText,
  setCustomCss,
  setCustomThemeColor,
  resetCustomThemeColors,
  animations = false,
  setAnimations,
  onReplayAnimations,
}: StyleConfigurationProps) {
  const t = useTranslations("wizard.style")
  const [showCustomCss, setShowCustomCss] = useState(() => customCss.trim().length > 0)
  // Saved CSS that arrives after mount (an editor still loading) opens the section too.
  useEffect(() => {
    if (customCss.trim()) setShowCustomCss(true)
  }, [customCss])

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

  // The swatch is the highlight color the theme applies to the card (titles, icons),
  // read from the theme itself. It used to be a hand-kept list that drifted: Default
  // showed the brand's violet-to-cyan gradient while its cards came out orange
  // (#FF7A3D), and the terminal Default showed the same gradient for a blue card.
  // "custom" keeps the rainbow: it stands for "pick your own".
  const CUSTOM_SWATCH = "conic-gradient(#ef4444,#f97316,#10b981,#06b6d4,#8b5cf6,#ec4899,#ef4444)"
  const themeSwatch = (name: string): string | undefined =>
    name === "custom"
      ? CUSTOM_SWATCH
      : style === "terminal"
        ? terminalThemes[name]?.["--terminal-color-highlight"]
        : themesFromPlugins[name]?.["--default-color-highlight"]

  return (
    <div className="divide-y divide-border/60">
      {/* Style selector */}
      <div className="py-4 first:pt-0 space-y-2.5">
        <p className="text-sm font-semibold text-foreground">{t("title")}</p>
        <div className="flex gap-2">
          {["default", "terminal"].map((s) => (
            // O input e filho direto deste label, e o texto visivel vem de t(...) —
            // uma chamada de funcao que a regra nao consegue resolver estaticamente.
            // eslint-disable-next-line jsx-a11y/label-has-associated-control
            <label key={s} className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="style"
                className="sr-only peer"
                checked={style === s}
                onChange={() => setStyle(s as "default" | "terminal")}
              />
              <div className="rounded-md border border-border px-3 py-2 text-center peer-checked:border-primary peer-checked:bg-primary/10 peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background transition-all">
                <span className="text-sm font-medium capitalize">{t(`options.${s}`)}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* No size selector here: the toggle above the preview sets it, next to the card
          it resizes and on every tab. Two controls for one setting was one too many. */}
      {/* Theme selector */}
      <div className="py-4 space-y-2.5">
        <p className="text-sm font-semibold text-foreground">{t("theme")}</p>
        <div className="flex flex-wrap gap-1.5">
          {themes.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setTheme(t)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-all",
                theme === t
                  ? "border-primary/60 bg-primary/10 text-foreground ring-1 ring-primary/30"
                  : "border-transparent bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <span
                aria-hidden
                className="h-2.5 w-2.5 flex-shrink-0 rounded-full ring-1 ring-black/10 dark:ring-white/20"
                style={{ background: themeSwatch(t) }}
              />
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Color mode: "auto" ships a light and a dark palette in one SVG */}
      <div className="py-4 space-y-2.5">
        <p className="text-sm font-semibold text-foreground">{t("colorMode")}</p>
        <p className="text-xs text-muted-foreground">{t("colorModeDescription")}</p>
        <div className="flex gap-2">
          {(["fixed", "auto"] as const).map((mode) => (
            // eslint-disable-next-line jsx-a11y/label-has-associated-control
            <label key={mode} className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="color-mode"
                className="sr-only peer"
                checked={colorMode === mode}
                onChange={() => setColorMode(mode)}
              />
              <div className="rounded-md border border-border px-3 py-2 text-center peer-checked:border-primary peer-checked:bg-primary/10 peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background transition-all">
                <span className="text-sm font-medium">
                  {mode === "auto" ? t("colorModeAuto") : t("colorModeFixed")}
                </span>
              </div>
            </label>
          ))}
        </div>
        {colorMode === "auto" && theme === "custom" && style === "default" && (
          <p className="text-xs text-muted-foreground">{t("colorModeCustomNote")}</p>
        )}
      </div>

      {/* Font selector */}
      <div className="py-4 space-y-2.5">
        <p className="text-sm font-semibold text-foreground">{t("font")}</p>
        <p className="text-xs text-muted-foreground">{t("fontDescription")}</p>
        <Select value={fontFamily} onValueChange={setFontFamily}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="poppins">Poppins</SelectItem>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="serif">Serif</SelectItem>
            <SelectItem value="mono">Mono</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Animations: both styles */}
      {setAnimations && (
        <div className="py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-0.5 flex-1">
              <Label htmlFor="card-animations" className="text-sm font-semibold cursor-pointer">
                {t("animations")}
              </Label>
              <p className="text-xs text-muted-foreground">{t("animationsDescription")}</p>
            </div>
            {animations && onReplayAnimations && (
              <Button type="button" variant="outline" size="sm" onClick={onReplayAnimations} className="h-7 text-xs">
                <Play className="w-3 h-3 mr-1" />
                {t("animationsReplay")}
              </Button>
            )}
            <Switch id="card-animations" checked={animations} onCheckedChange={setAnimations} />
          </div>
        </div>
      )}

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
          <div className="space-y-1.5 py-1.5">
            <Label htmlFor="terminal-header-text" className="text-sm font-medium cursor-pointer">
              {t("terminalHeaderText")}
            </Label>
            <p className="text-xs text-muted-foreground">{t("terminalHeaderTextDescription")}</p>
            <Input
              id="terminal-header-text"
              type="text"
              value={terminalHeaderText}
              onChange={(e) => setTerminalHeaderText(e.target.value)}
              placeholder="weeb@profile:~"
            />
          </div>
        </div>
      )}

      {/* Custom CSS - recolhido por padrão: era a maior área da aba (220px de editor)
          para um recurso avançado. Abre sozinho quando já há CSS salvo. */}
      <div className="py-4 last:pb-0 space-y-2">
        <button
          type="button"
          onClick={() => setShowCustomCss((open) => !open)}
          aria-expanded={showCustomCss}
          className="flex w-full items-center justify-between gap-2 text-left"
        >
          <span className="text-sm font-semibold text-foreground">{t("customCss")}</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            {showCustomCss ? t("customCssHide") : t("customCssShow")}
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showCustomCss && "rotate-180")} />
          </span>
        </button>
        <p className="text-xs text-muted-foreground">{t("customCssDescription")}</p>
        {showCustomCss && (
          <Textarea
            value={customCss}
            onChange={(e) => setCustomCss(e.target.value)}
            placeholder={t("customCssPlaceholder")}
            spellCheck={false}
            className="w-full min-h-[220px] rounded-md border border-border bg-muted text-foreground px-3 py-2.5 text-xs font-mono leading-relaxed focus:border-primary focus:ring-1 focus:ring-primary"
          />
        )}
      </div>
    </div>
  )
}
