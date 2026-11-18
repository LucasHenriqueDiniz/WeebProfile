"use client"

import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { useTranslations } from "@/i18n/use-translations"
import { PLATFORM_STRIP_PLUGINS } from "@/lib/landing/landing-plugins"
import { getPluginIcon } from "@/lib/plugin-icons"
import { isSuspended } from "@/lib/plugins/suspended"
import { cn } from "@/lib/utils"

/** Each chip leans a little, alternately, like stickers put down by hand. */
const TILT = ["-rotate-1", "rotate-1", "rotate-0", "-rotate-[0.5deg]", "rotate-[1.5deg]"]

/** The platforms the cards read from, right under the hero. */
export function PlatformStrip() {
  const t = useTranslations("landing.platforms")
  const tStatus = useTranslations("pluginStatus")
  return (
    <section className="border-b-2 border-foreground/10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2.5 gap-y-3 px-6 py-9">
        <span className="mr-2 whitespace-nowrap text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
          {t("label")}
        </span>
        {PLATFORM_STRIP_PLUGINS.map((id, index) => {
          const Icon = getPluginIcon(id)
          const suspended = isSuspended(id)
          return (
            <span
              key={id}
              title={suspended ? tStatus(`reasons.${id}`) : undefined}
              className={cn(
                "flex cursor-default items-center gap-2 whitespace-nowrap rounded-full border-2 bg-card px-3.5 py-1.5 font-heading text-[13.5px] font-semibold transition-transform hover:-translate-y-0.5 hover:rotate-0",
                TILT[index % TILT.length],
                suspended
                  ? "border-dashed border-foreground/40 text-muted-foreground line-through"
                  : "border-foreground text-foreground shadow-[3px_3px_0_0_hsl(var(--foreground)/0.25)]"
              )}
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
