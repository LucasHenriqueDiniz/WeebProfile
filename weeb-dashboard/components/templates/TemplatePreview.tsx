"use client"

import { memo, useMemo } from "react"
import { FitWidth } from "@/components/preview/FitWidth"
import { PreviewRenderer } from "@/components/preview/PreviewRenderer"
import type { StyleUiConfig } from "@/lib/config/svg-config-helpers"
import { effectiveTheme, templatePreviewConfig } from "@/lib/templates/template-view"
import type { Template } from "@/types/template"

interface TemplatePreviewProps {
  template: Pick<Template, "pluginsConfig" | "pluginsOrder" | "platforms" | "style" | "size" | "theme">
  /** The template's ui_config, read with readStyleUiConfig. A thumbnail leaves it out. */
  ui?: StyleUiConfig
  /** Passed to the FitWidth box, which is what a thumbnail scrolls on hover. */
  className?: string
}

/**
 * A template drawn by the real renderer, with mock data, scaled to the width it is
 * given. The templates in production have no stored preview (previewUrl is null for
 * all three), and the static image the cards fell back to was one per style: "Gamer
 * Stats" (Steam and Codewars) showed a GitHub calendar.
 */
export const TemplatePreview = memo(function TemplatePreview({ template, ui, className }: TemplatePreviewProps) {
  const { plugins, pluginsOrder } = useMemo(() => templatePreviewConfig(template), [template])
  const theme = effectiveTheme(template.style, template.theme)

  return (
    <FitWidth width={template.size === "full" ? 830 : 415} className={className}>
      <PreviewRenderer
        plugins={plugins}
        pluginsOrder={pluginsOrder}
        style={template.style}
        size={template.size}
        theme={theme}
        hideTerminalEmojis={ui?.hideTerminalEmojis}
        hideTerminalHeader={ui?.hideTerminalHeader}
        fontFamily={ui?.fontFamily}
        customThemeColors={theme === "custom" ? ui?.customThemeColors : undefined}
        colorMode={ui?.colorMode}
        previewMode
        disableFadeIn={!ui}
      />
    </FitWidth>
  )
})
