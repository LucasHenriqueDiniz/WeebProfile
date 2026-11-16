"use client"

import React from "react"
import { Moon, Sun } from "lucide-react"
import type { ColorVariant } from "@weeb/weeb-plugins/themes"
import { useTranslations } from "@/i18n/use-translations"

// The page colors of GitHub's light and dark themes, behind each variant: an auto card
// in the default style is transparent, so what it looks like depends on what is under it.
const PAGE_BACKGROUND: Record<ColorVariant, string> = { light: "#ffffff", dark: "#0d1117" }
const LABEL_COLOR: Record<ColorVariant, string> = { light: "#59636e", dark: "#9198a1" }

interface ColorVariantsPreviewProps {
  colorMode: "fixed" | "auto"
  // Renders the card; `variant` is undefined in fixed mode.
  children: (variant: ColorVariant | undefined) => React.ReactNode
}

/**
 * Fixed mode renders the card once. Auto mode renders it twice, light over dark, each
 * on the page color it will meet on GitHub -- the one SVG carries both, and which one
 * shows is up to the viewer's theme, so the preview shows both.
 */
export function ColorVariantsPreview({ colorMode, children }: ColorVariantsPreviewProps) {
  const t = useTranslations("wizard.style")
  if (colorMode !== "auto") return <>{children(undefined)}</>

  return (
    <div className="flex flex-col">
      {(["light", "dark"] as const).map((variant) => {
        const Icon = variant === "dark" ? Moon : Sun
        return (
          <div key={variant} data-color-variant={variant} style={{ background: PAGE_BACKGROUND[variant] }}>
            <div
              className="flex items-center gap-1.5 px-3 pt-2 text-[11px] font-medium"
              style={{ color: LABEL_COLOR[variant] }}
            >
              <Icon className="h-3 w-3" aria-hidden />
              {variant === "dark" ? t("previewDark") : t("previewLight")}
            </div>
            {children(variant)}
          </div>
        )
      })}
    </div>
  )
}
