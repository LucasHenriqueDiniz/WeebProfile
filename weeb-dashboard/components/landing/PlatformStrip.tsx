"use client"

import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { useTranslations } from "@/i18n/use-translations"
import { getPluginIcon } from "@/lib/plugin-icons"
import { PLATFORM_STRIP_PLUGINS } from "@/lib/landing/landing-plugins"

/** Brand color on hover — each platform lights up with its own identity. */
const HOVER: Record<string, string> = {
  lastfm: "hover:border-red-500/50 hover:text-red-500",
  myanimelist: "hover:border-blue-500/50 hover:text-blue-400",
  anilist: "hover:border-indigo-500/50 hover:text-indigo-400",
  steam: "hover:border-sky-500/50 hover:text-sky-400",
  codeforces: "hover:border-amber-500/50 hover:text-amber-500",
  codewars: "hover:border-rose-500/50 hover:text-rose-400",
  stackoverflow: "hover:border-orange-500/50 hover:text-orange-500",
  duolingo: "hover:border-emerald-500/50 hover:text-emerald-500",
  lyfta: "hover:border-violet-500/50 hover:text-violet-400",
  "16personalities": "hover:border-teal-500/50 hover:text-teal-400",
}
const NEUTRAL_HOVER = "hover:border-foreground/40 hover:text-foreground"

export function PlatformStrip() {
  const t = useTranslations("landing.platforms")
  return (
    <section className="mx-auto max-w-6xl px-6 pt-6">
      <div className="flex flex-wrap items-center justify-center gap-2.5 border-y border-border/60 py-6">
        <span className="mr-3 whitespace-nowrap text-[11.5px] font-semibold tracking-[0.14em] text-muted-foreground/60">
          {t("label")}
        </span>
        {PLATFORM_STRIP_PLUGINS.map((id) => {
          const Icon = getPluginIcon(id)
          return (
            <span
              key={id}
              className={`flex cursor-default items-center gap-2 whitespace-nowrap rounded-full border border-border bg-card px-3.5 py-2 font-heading text-[13.5px] font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:shadow-md ${HOVER[id] ?? NEUTRAL_HOVER}`}
            >
              {Icon ? <Icon className="h-4 w-4" /> : null}
              {PLUGINS_METADATA[id as keyof typeof PLUGINS_METADATA]?.displayName ?? id}
            </span>
          )
        })}
      </div>
    </section>
  )
}
