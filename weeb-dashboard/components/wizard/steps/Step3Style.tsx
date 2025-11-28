"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  DEFAULT_THEME_VARIABLES,
  DEFAULT_THEME_VARIABLE_DESCRIPTIONS,
  DEFAULT_THEME_VARIABLE_LABELS
} from "@/lib/weeb-plugins/themes"
import { defaultThemes as themesFromPlugins } from "@/lib/weeb-plugins/themes/themes"
import { useWizardStore } from "@/stores/wizard-store"
import { Code2, Maximize2, Minimize2, Monitor, Paintbrush, RotateCcw, Terminal } from "lucide-react"
import React, { useCallback, useEffect, useState } from "react"
import { StyleSelector } from "../StyleSelector"

export function Step3Style() {
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
    validateStep,
  } = useWizardStore()

  // Local state for debounce of color pickers
  const [localColors, setLocalColors] = useState<Record<string, string>>(customThemeColors)
  const debounceTimersRef = React.useRef<Record<string, NodeJS.Timeout>>({})

  // Validate step 2 when component mounts
  useEffect(() => {
    validateStep(2)
  }, [validateStep])

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

  return (
    <div className="space-y-6">
      {/* Style Selection */}
      <Card className="border-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Monitor className="w-4 h-4 text-primary" />
            </div>
            Style
          </CardTitle>
          <CardDescription>Choose the visual style for your SVG image</CardDescription>
        </CardHeader>
        <CardContent>
          <StyleSelector
            options={[
              { value: "default", label: "Default", description: "Clean and modern default style" },
              { value: "terminal", label: "Terminal", description: "Retro terminal style with command-line aesthetic" },
            ]}
            value={style}
            onChange={(value) => setStyle(value as "default" | "terminal")}
          />
        </CardContent>
      </Card>

      {/* Size Selection */}
      <Card className="border-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              {size === "half" ? (
                <Minimize2 className="w-4 h-4 text-primary" />
              ) : (
                <Maximize2 className="w-4 h-4 text-primary" />
              )}
            </div>
            Size
          </CardTitle>
          <CardDescription>Select the width of your SVG image</CardDescription>
        </CardHeader>
        <CardContent>
          <StyleSelector
            options={[
              { value: "half", label: "Half Width", description: "415px width - Recommended for GitHub profiles" },
              { value: "full", label: "Full Width", description: "830px width - For wider displays" },
            ]}
            value={size}
            onChange={(value) => setSize(value as "half" | "full")}
          />
        </CardContent>
      </Card>

      {/* Theme Selection */}
      <Card className="border-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Paintbrush className="w-4 h-4 text-primary" />
            </div>
            Theme
          </CardTitle>
          <CardDescription>
            {style === "default" 
              ? "Choose a color theme or customize your own" 
              : "Select a terminal color scheme"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {style === "default" ? (
            <>
              <StyleSelector
                options={[
                  { value: "default", label: "Default", description: "Warm orange theme" },
                  { value: "purple", label: "Purple", description: "Rich purple tones" },
                  { value: "pink", label: "Pink", description: "Soft pink palette" },
                  { value: "cyan", label: "Cyan", description: "Cool cyan shades" },
                  { value: "orange", label: "Orange", description: "Vibrant orange" },
                  { value: "blue", label: "Blue", description: "Calm blue hues" },
                  { value: "green", label: "Green", description: "Fresh green tones" },
                  { value: "red", label: "Red", description: "Bold red accents" },
                  { value: "custom", label: "Custom", description: "Create your own color palette" },
                ]}
                value={theme}
                onChange={setTheme}
              />
              
              {/* Custom Theme Colors */}
              {theme === "custom" && (
                <div className="mt-6 p-6 border-2 border-dashed rounded-xl bg-gradient-to-br from-muted/50 to-muted/30">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <Label className="text-base font-semibold">Custom Color Palette</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Customize each color to match your brand or preference
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={resetCustomThemeColors}
                      className="shrink-0"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset to Defaults
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {DEFAULT_THEME_VARIABLES.filter(v => v !== '--default-color-raw').map((variable) => {
                      const defaultValue = getDefaultColor(variable)
                      const currentValue = localColors[variable] || defaultValue
                      return (
                        <div key={variable} className="space-y-2 p-3 rounded-lg bg-background/50 border border-border/50">
                          <Label htmlFor={variable} className="text-sm font-medium">
                            {DEFAULT_THEME_VARIABLE_LABELS[variable]}
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id={variable}
                              type="color"
                              value={currentValue}
                              onChange={(e) => handleColorChange(variable, e.target.value)}
                              className="w-16 h-12 cursor-pointer border-2 border-border bg-background shrink-0 rounded-lg"
                            />
                            <Input
                              type="text"
                              value={currentValue}
                              onChange={(e) => handleColorChange(variable, e.target.value)}
                              placeholder={defaultValue}
                              className="flex-1 font-mono text-sm"
                            />
                          </div>
                          {DEFAULT_THEME_VARIABLE_DESCRIPTIONS[variable] && (
                            <p className="text-xs text-muted-foreground">
                              {DEFAULT_THEME_VARIABLE_DESCRIPTIONS[variable]}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <StyleSelector
              options={[
                { value: "default", label: "Default", description: "Classic green terminal theme" },
                { value: "dracula", label: "Dracula", description: "Dark purple Dracula theme" },
                { value: "monokai", label: "Monokai", description: "Vibrant Monokai color scheme" },
              ]}
              value={theme}
              onChange={setTheme}
            />
          )}
        </CardContent>
      </Card>

      {/* Terminal Options */}
      {style === "terminal" && (
        <Card className="border-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-primary" />
              </div>
              Terminal Options
            </CardTitle>
            <CardDescription>Customize terminal-specific display options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="hide-emojis" className="text-base font-medium cursor-pointer">
                  Hide Emojis
                </Label>
                <p className="text-sm text-muted-foreground">
                  Remove emoji icons from terminal output
                </p>
              </div>
              <Switch
                id="hide-emojis"
                checked={hideTerminalEmojis}
                onCheckedChange={setHideTerminalEmojis}
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="hide-header" className="text-base font-medium cursor-pointer">
                  Hide Header
                </Label>
                <p className="text-sm text-muted-foreground">
                  Remove the terminal header bar
                </p>
              </div>
              <Switch
                id="hide-header"
                checked={hideTerminalHeader}
                onCheckedChange={setHideTerminalHeader}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom CSS */}
      <Card className="border-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-primary" />
            </div>
            Advanced Customization
          </CardTitle>
          <CardDescription>Add custom CSS for fine-grained styling control</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="custom-css" className="border-none">
              <AccordionTrigger className="py-2 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  <Label className="text-base font-normal cursor-pointer">Custom CSS (Optional)</Label>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <Textarea
                    id="custom-css"
                    value={customCss}
                    onChange={(e) => setCustomCss(e.target.value)}
                    placeholder="/* Your custom CSS here */"
                    className="font-mono text-sm min-h-[200px] resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    Add custom CSS rules to further customize your image appearance
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
