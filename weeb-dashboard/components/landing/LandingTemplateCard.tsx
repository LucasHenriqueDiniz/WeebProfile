"use client"

import { Link } from "@/i18n/navigation"
import { getPluginIcon } from "@/lib/plugin-icons"
import type { Template } from "@/types/template"

/**
 * Template card in the landing's visual language (border/card/chips), replacing the
 * app-side TemplateCard here — its entrance scale + hover overlay marquee clashed with
 * the rest of the page. Hover = a plain CSS "elevator" scroll of the tall preview
 * inside a fixed window (duration scales with nothing — slow and constant reads best).
 */
export function LandingTemplateCard({ template, href }: { template: Template; href?: string }) {
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
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_8px_40px_-12px_rgba(139,92,246,0.3)]"
    >
      <div className="relative h-[196px] overflow-hidden border-b border-border bg-background">
        {template.preview ? (
          <img
            src={template.preview}
            alt=""
            loading="lazy"
            className="w-full min-h-full object-cover object-top transition-transform duration-[4000ms] ease-linear group-hover:[transform:translateY(min(0px,calc(196px-100%)))]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <img src="/sora/sora-head.png" alt="" className="h-10 w-10 object-contain opacity-30" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="font-heading text-base font-bold text-foreground">{template.name}</div>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">{template.description}</p>
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
          {chipPlugins.map((plugin) => {
            const Icon = getPluginIcon(plugin.toLowerCase())
            return (
              <span
                key={plugin}
                className="flex items-center gap-1 whitespace-nowrap rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
              >
                {Icon ? <Icon className="h-3 w-3" /> : null}
                {plugin}
              </span>
            )
          })}
          <span className="whitespace-nowrap rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
            {template.style}
          </span>
        </div>
      </div>
    </Link>
  )
}
