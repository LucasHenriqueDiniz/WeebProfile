"use client"

import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { ArrowUpRight } from "lucide-react"
import { getPluginIcon } from "@/lib/plugin-icons"
import { useTranslations } from "@/i18n/use-translations"
import { SectionHeading } from "./SectionHeading"

const GITHUB_REPO_URL = "https://github.com/LucasHenriqueDiniz/WeebProfile"

/** Display order on the landing grid — profile plugins first, repository mode last. */
const PLUGIN_ORDER = [
  "github",
  "lastfm",
  "myanimelist",
  "steam",
  "codeforces",
  "codewars",
  "stackoverflow",
  "duolingo",
  "lyfta",
  "16personalities",
  "github_repo",
]

// Identidade por categoria: rótulo, tile do ícone e o glow do hover.
const CATEGORY_STYLE: Record<string, { label: string; tile: string; hover: string }> = {
  coding: {
    label: "text-violet-500 dark:text-violet-400",
    tile: "from-violet-500/20 to-violet-500/5 text-violet-500 dark:text-violet-400",
    hover: "hover:border-violet-500/50 hover:shadow-[0_10px_36px_-14px_rgba(139,92,246,0.5)]",
  },
  music: {
    label: "text-pink-500",
    tile: "from-pink-500/20 to-pink-500/5 text-pink-500",
    hover: "hover:border-pink-500/50 hover:shadow-[0_10px_36px_-14px_rgba(236,72,153,0.5)]",
  },
  anime: {
    label: "text-cyan-500",
    tile: "from-cyan-500/20 to-cyan-500/5 text-cyan-500",
    hover: "hover:border-cyan-500/50 hover:shadow-[0_10px_36px_-14px_rgba(6,182,212,0.5)]",
  },
  gaming: {
    label: "text-emerald-500",
    tile: "from-emerald-500/20 to-emerald-500/5 text-emerald-500",
    hover: "hover:border-emerald-500/50 hover:shadow-[0_10px_36px_-14px_rgba(16,185,129,0.5)]",
  },
  repository: {
    label: "text-amber-500",
    tile: "from-amber-500/20 to-amber-500/5 text-amber-500",
    hover: "hover:border-amber-500/50 hover:shadow-[0_10px_36px_-14px_rgba(245,158,11,0.5)]",
  },
}

export function PluginsShowcase() {
  const t = useTranslations("landing.plugins")

  const plugins = PLUGIN_ORDER.map((id) => PLUGINS_METADATA[id as keyof typeof PLUGINS_METADATA]).filter(Boolean)

  return (
    <section id="plugins" className="border-t border-border/60 bg-muted/50 dark:bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-7">
          <div className="max-w-[560px]">
            <SectionHeading
              align="left"
              kicker={t("kicker")}
              kickerClassName="text-cyan-500"
              title={t("title")}
              subtitle={t("subtitle")}
            />
          </div>
          <a
            href={`${GITHUB_REPO_URL}/blob/main/docs/plugins.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap text-sm font-semibold text-cyan-500 hover:text-cyan-400"
          >
            {t("gallery")} →
          </a>
        </div>
        <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {plugins.map((plugin) => {
            const Icon = getPluginIcon(plugin.name)
            const cat = CATEGORY_STYLE[plugin.category] ?? CATEGORY_STYLE.coding
            return (
              <div
                key={plugin.name}
                className={`group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-1 ${cat.hover}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gradient-to-br transition-transform group-hover:scale-110 ${cat.tile}`}
                  >
                    {Icon ? <Icon className="h-5 w-5" /> : null}
                  </span>
                  <div>
                    <div className="font-heading text-[15px] font-bold text-foreground">{plugin.displayName}</div>
                    <div className={`text-[11px] font-medium ${cat.label}`}>{t(`categories.${plugin.category}`)}</div>
                  </div>
                </div>
                <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
                  {t(`descriptions.${plugin.name}`)}
                </p>
              </div>
            )
          })}
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col justify-center gap-1.5 rounded-xl border border-dashed border-border p-5 transition-colors hover:border-muted-foreground/50"
          >
            <div className="font-heading text-[15px] font-bold text-foreground">{t("missingTitle")}</div>
            <div className="text-[12.5px] leading-relaxed text-muted-foreground">
              {t("missingBody")}{" "}
              <span className="inline-flex items-center text-cyan-500">
                {t("missingLink")}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
