"use client"

import { useState } from "react"
import { Link } from "@/i18n/navigation"
import { getPluginIcon } from "@/lib/plugin-icons"
import type { Template } from "@/types/template"
import { useTemplateDescription } from "@/lib/templates/template-description"
import { cn } from "@/lib/utils"
import { CHIP, STICKER, STICKER_LIFT } from "./sticker"

// Preview local usada quando o template da API vem sem previewUrl ou com URL quebrada —
// o card nunca renderiza uma area vazia/imagem quebrada.
const PREVIEW_FALLBACK: Record<string, string> = {
  default: "/previews/github/default/calendar.svg",
  terminal: "/previews/lastfm/terminal/recent_tracks.svg",
}

/**
 * Template card in the landing's visual language (border/card/chips), replacing the
 * app-side TemplateCard here — its entrance scale + hover overlay marquee clashed with
 * the rest of the page. Hover = a plain CSS "elevator" scroll of the tall preview
 * inside a fixed window (duration scales with nothing — slow and constant reads best).
 */
export function LandingTemplateCard({ template, href }: { template: Template; href?: string }) {
  const templateDescription = useTemplateDescription()
  const fallbackSrc = PREVIEW_FALLBACK[template.style] ?? PREVIEW_FALLBACK.default
  const [previewSrc, setPreviewSrc] = useState(template.preview || fallbackSrc)
  const plugins = (
    Array.isArray(template.pluginsOrder)
      ? template.pluginsOrder
      : (template.pluginsOrder || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
  ).slice(0, 4)
  const chipPlugins = plugins.length > 0 ? plugins : (template.platforms || []).slice(0, 4)

  return (
    <Link
      href={href ?? `/templates/${template.id}`}
      className={cn(STICKER, STICKER_LIFT, "group flex flex-col overflow-hidden")}
    >
      <div className="relative h-[196px] overflow-hidden border-b-2 border-foreground bg-background">
        <img
          src={previewSrc}
          alt=""
          loading="lazy"
          onError={() => {
            if (previewSrc !== fallbackSrc) setPreviewSrc(fallbackSrc)
          }}
          // Full width at its own aspect ratio, from the top. object-cover filled the
          // 196px height instead and cut the sides off a wide card ("…feat. Hatsune
          // Miku" started mid-word).
          className="block w-full h-auto transition-transform duration-[4000ms] ease-linear group-hover:[transform:translateY(min(0px,calc(196px-100%)))]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="font-heading text-base font-bold text-foreground">{template.name}</div>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
          {templateDescription(template)}
        </p>
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
          {chipPlugins.map((plugin) => {
            const Icon = getPluginIcon(plugin.toLowerCase())
            return (
              <span key={plugin} className={CHIP}>
                {Icon ? <Icon className="h-3 w-3" /> : null}
                {plugin}
              </span>
            )
          })}
          <span className={cn(CHIP, "font-mono")}>{template.style}</span>
        </div>
      </div>
    </Link>
  )
}
