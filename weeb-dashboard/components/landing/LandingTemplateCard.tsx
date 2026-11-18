"use client"

import { useState } from "react"
import { TemplatePreview } from "@/components/templates/TemplatePreview"
import { Link } from "@/i18n/navigation"
import { getPluginIcon } from "@/lib/plugin-icons"
import type { Template } from "@/types/template"
import { useTemplateDescription } from "@/lib/templates/template-description"
import { templatePlugins } from "@/lib/templates/template-view"
import { cn } from "@/lib/utils"
import { CHIP, STICKER, STICKER_LIFT } from "./sticker"

// Hover: a slow, constant "elevator" scroll of the tall preview inside the fixed
// window, from the top to its bottom edge. 100% is the moving element's own height.
const ELEVATOR =
  "transition-transform duration-[4000ms] ease-linear motion-reduce:transition-none motion-reduce:group-hover:transform-none"
// The image fills the 196px window; the live preview sits 12px in from each edge.
const ELEVATOR_IMAGE = `${ELEVATOR} group-hover:[transform:translateY(min(0px,calc(196px-100%)))]`
const ELEVATOR_LIVE = `${ELEVATOR} group-hover:[transform:translateY(min(0px,calc(172px-100%)))]`

/**
 * Template card in the landing's sticker look, on the home and in the gallery. The
 * preview is the stored SVG when the template has one, and otherwise the template
 * drawn live with mock data, never a stand-in image of some other card.
 */
export function LandingTemplateCard({ template, href }: { template: Template; href?: string }) {
  const templateDescription = useTemplateDescription()
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(template.preview) && !imageFailed
  const plugins = templatePlugins(template).slice(0, 4)

  return (
    <Link
      href={href ?? `/templates/${template.id}`}
      className={cn(STICKER, STICKER_LIFT, "group flex flex-col overflow-hidden")}
    >
      <div className="relative h-[196px] overflow-hidden border-b-2 border-foreground bg-background" aria-hidden>
        {showImage ? (
          <img
            src={template.preview}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
            // Full width at its own aspect ratio, from the top. object-cover filled the
            // 196px height instead and cut the sides off a wide card.
            className={cn("block h-auto w-full", ELEVATOR_IMAGE)}
          />
        ) : (
          <div className="pointer-events-none p-3">
            <TemplatePreview template={template} className={ELEVATOR_LIVE} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="font-heading text-base font-bold text-foreground">{template.name}</div>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
          {templateDescription(template)}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3.5">
          {plugins.map(({ id }) => {
            const Icon = getPluginIcon(id)
            return (
              <span key={id} className={CHIP}>
                {Icon ? <Icon className="h-3 w-3" /> : null}
                {id}
              </span>
            )
          })}
          <span className={cn(CHIP, "font-mono")}>{template.style}</span>
        </div>
      </div>
    </Link>
  )
}

/** The card's shape while the list loads. */
export function LandingTemplateCardSkeleton() {
  return (
    <div className={cn(STICKER, "flex flex-col overflow-hidden")} aria-hidden>
      <div className="h-[196px] animate-pulse border-b-2 border-foreground bg-muted/60" />
      <div className="space-y-2.5 p-5">
        <div className="h-4 w-2/5 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted/70" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-muted/70" />
        <div className="flex gap-1.5 pt-2">
          <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
          <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </div>
  )
}
