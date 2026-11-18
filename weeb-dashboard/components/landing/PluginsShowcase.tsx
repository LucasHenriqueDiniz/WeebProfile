"use client"

import { useState } from "react"
import { PLUGIN_CATEGORIES, PLUGINS_METADATA, type PluginCategory } from "@weeb/weeb-plugins/plugins/metadata"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { SuspendedBadge } from "@/components/plugins/SuspendedBadge"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "@/i18n/use-translations"
import { SECTION_PREVIEWS } from "@/lib/config/section-previews"
import { CATEGORY_STYLE } from "@/lib/landing/category-style"
import { LANDING_PLUGINS } from "@/lib/landing/landing-plugins"
import { getPluginIcon } from "@/lib/plugin-icons"
import { cn } from "@/lib/utils"
import { SectionHeading } from "./SectionHeading"
import { BUTTON_SECONDARY, STICKER, STICKER_LIFT, TILE } from "./sticker"

const GITHUB_REPO_URL = "https://github.com/LucasHenriqueDiniz/WeebProfile"

/** The first section of the plugin that has a default-style preview, with its size. */
function firstPreview(plugin: string) {
  const sections = SECTION_PREVIEWS[plugin] ?? {}
  for (const [section, sizes] of Object.entries(sections)) {
    if (sizes.default) return { section, width: sizes.default[0], height: sizes.default[1] }
  }
  return null
}

/**
 * Every plugin as a sticker: its name and category, and a window onto one of its real
 * cards, so the grid shows what each one draws instead of describing it. Each links to
 * the plugin in the gallery, where the description and the options of each section are.
 *
 * Chips above the grid narrow it to one category: with ~40 plugins the full grid would be
 * ten rows of cards, and the categories are what a visitor already thinks in ("my anime
 * list", "my music"). Search lives in the gallery, where the full list is.
 */
export function PluginsShowcase() {
  const t = useTranslations("landing.plugins")
  const all = LANDING_PLUGINS.map((id) => PLUGINS_METADATA[id as keyof typeof PLUGINS_METADATA]).filter(Boolean)
  const categories = PLUGIN_CATEGORIES.filter((category) => all.some((plugin) => plugin.category === category))
  const [category, setCategory] = useState<PluginCategory | null>(null)
  const plugins = category ? all.filter((plugin) => plugin.category === category) : all

  return (
    <section id="plugins" className="border-y-2 border-foreground/10 bg-muted/40">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-7">
          <SectionHeading align="left" kicker={t("kicker")} tone="cyan" title={t("title")} subtitle={t("subtitle")} />
          <Link href="/plugins" className={BUTTON_SECONDARY}>
            {t("gallery")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {/* One row to swipe on a phone, where wrapped chips took four lines. */}
        <div
          role="group"
          aria-label={t("filter")}
          className="-mx-6 mt-10 flex gap-2 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        >
          {[null, ...categories].map((option) => {
            const isActive = option === category
            const count = option ? all.filter((plugin) => plugin.category === option).length : all.length
            return (
              <button
                type="button"
                key={option ?? "all"}
                aria-pressed={isActive}
                onClick={() => setCategory(option)}
                className={cn(
                  "inline-flex flex-none items-center gap-1.5 rounded-full border-2 px-3 py-1 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/25 bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
                )}
              >
                {option && (
                  <span
                    aria-hidden
                    className={cn("h-2.5 w-2.5 rounded-full border border-foreground", CATEGORY_STYLE[option].sticker)}
                  />
                )}
                {option ? t(`categories.${option}`) : t("all")}
                <span className="font-mono text-[11px] font-normal opacity-70">{count}</span>
              </button>
            )
          })}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-x-5 sm:gap-y-6 lg:grid-cols-4">
          {plugins.map((plugin) => {
            const Icon = getPluginIcon(plugin.name)
            const category = CATEGORY_STYLE[plugin.category]
            const preview = firstPreview(plugin.name)
            return (
              <Link
                key={plugin.name}
                href="/plugins"
                hash={plugin.name}
                title={t(`descriptions.${plugin.name}`, { defaultValue: plugin.description })}
                className={cn(STICKER, STICKER_LIFT, "group flex flex-col overflow-hidden")}
              >
                <div className="flex items-center gap-2.5 p-3 sm:gap-3 sm:p-4">
                  <span className={cn(TILE, category.sticker)}>{Icon ? <Icon className="h-5 w-5" /> : null}</span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-heading text-[14px] font-bold leading-tight text-foreground [overflow-wrap:anywhere] sm:text-[15px]">
                      {plugin.displayName}
                      <SuspendedBadge pluginId={plugin.name} className="font-sans" />
                    </div>
                    <div className="text-[11.5px] font-semibold text-muted-foreground">
                      {t(`categories.${plugin.category}`)}
                    </div>
                  </div>
                </div>
                {/* The card, from the top, in a fixed window: it slides up on hover when it is taller. */}
                <div className="relative h-[128px] flex-none overflow-hidden border-t-2 border-foreground bg-background">
                  {preview && (
                    <img
                      src={`/previews/${plugin.name}/default/${preview.section}.svg`}
                      alt=""
                      width={preview.width}
                      height={preview.height}
                      loading="lazy"
                      className="block h-auto w-full transition-transform duration-[3000ms] ease-linear group-hover:[transform:translateY(min(0px,calc(128px-100%)))]"
                    />
                  )}
                </div>
              </Link>
            )
          })}
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col justify-center gap-1.5 rounded-2xl border-2 border-dashed border-foreground/60 p-5 transition-colors hover:border-foreground hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="font-heading text-[15px] font-bold text-foreground">{t("missingTitle")}</span>
            <span className="text-[12.5px] leading-relaxed text-muted-foreground">
              {t("missingBody")}{" "}
              <span className="inline-flex items-center font-semibold text-foreground underline decoration-cyan-400 decoration-2 underline-offset-2">
                {t("missingLink")}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
