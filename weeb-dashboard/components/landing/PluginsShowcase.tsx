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

const CATEGORY_COLORS: Record<string, string> = {
  coding: "text-violet-400",
  music: "text-pink-500",
  anime: "text-cyan-500",
  gaming: "text-emerald-500",
  repository: "text-violet-400",
}

export function PluginsShowcase() {
  const t = useTranslations("landing.plugins")

  const plugins = PLUGIN_ORDER.map((id) => PLUGINS_METADATA[id as keyof typeof PLUGINS_METADATA]).filter(Boolean)

  return (
    <section id="plugins" className="border-t border-border/60 bg-muted/30">
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
            return (
              <div key={plugin.name} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-muted text-foreground">
                    {Icon ? <Icon className="h-5 w-5" /> : null}
                  </span>
                  <div>
                    <div className="font-heading text-[15px] font-bold text-foreground">{plugin.displayName}</div>
                    <div className={`text-[11px] font-medium ${CATEGORY_COLORS[plugin.category] ?? "text-violet-400"}`}>
                      {t(`categories.${plugin.category}`)}
                    </div>
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
