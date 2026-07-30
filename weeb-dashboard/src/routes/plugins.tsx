import { useState } from "react"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { ArrowLeft, ArrowRight, BarChart3, SquareTerminal } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { SECTION_PREVIEWS } from "@/lib/config/section-previews"
import { getPluginIcon } from "@/lib/plugin-icons"
import { usePluginI18n } from "@/lib/plugins/i18n-helper"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "@/i18n/use-translations"

type StyleId = "default" | "terminal"

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
  "websites",
  "github_repo",
]

const CATEGORY_LABEL_COLOR: Record<string, string> = {
  coding: "text-violet-500 dark:text-violet-400",
  music: "text-pink-500",
  anime: "text-cyan-500",
  gaming: "text-emerald-500",
  repository: "text-amber-500",
}

// Galeria pública de plugins/seções — todas as previews são os SVGs reais que o
// gerador produz (as mesmas usadas na landing), organizadas por plugin.
export default function PluginsGalleryPage() {
  const t = useTranslations("landing.pluginsPage")
  const tCat = useTranslations("landing.plugins.categories")
  const { tWithFallback } = usePluginI18n()
  const [style, setStyle] = useState<StyleId>("default")

  const plugins = PLUGIN_ORDER.map((id) => PLUGINS_METADATA[id as keyof typeof PLUGINS_METADATA]).filter(Boolean)

  return (
    <div className="relative overflow-hidden bg-background">
      <Header variant="home" />
      <main className="relative mx-auto max-w-6xl px-6 pb-24 pt-28">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backHome")}
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[620px]">
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t("subtitle")}</p>
          </div>
          {/* Toggle global de estilo — a galeria inteira troca de pele */}
          <div className="inline-flex rounded-xl border border-border bg-card p-1">
            {(
              [
                { id: "default", icon: BarChart3, label: t("viewDefault") },
                { id: "terminal", icon: SquareTerminal, label: t("viewTerminal") },
              ] as const
            ).map((opt) => {
              const Icon = opt.icon
              const isActive = style === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => setStyle(opt.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-sm font-semibold transition-all",
                    isActive
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_18px_rgba(139,92,246,0.3)]"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-12 space-y-16">
          {plugins.map((plugin) => {
            const Icon = getPluginIcon(plugin.name)
            const sections = SECTION_PREVIEWS[plugin.name] ?? {}
            const sectionIds = Object.keys(sections).filter((id) => sections[id][style])
            const meta = plugin as any
            const displayName = meta.i18nKey?.displayName
              ? tWithFallback(meta.i18nKey.displayName.replace(/^plugins\./, ""), plugin.displayName)
              : plugin.displayName
            const description = meta.i18nKey?.description
              ? tWithFallback(meta.i18nKey.description.replace(/^plugins\./, ""), plugin.description)
              : plugin.description

            return (
              <section key={plugin.name} id={plugin.name}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-cyan-500/10 text-primary">
                    {Icon ? <Icon className="h-5 w-5" /> : null}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <h2 className="font-heading text-xl font-bold text-foreground">{displayName}</h2>
                      <span
                        className={cn(
                          "text-[11px] font-medium",
                          CATEGORY_LABEL_COLOR[plugin.category] ?? "text-violet-400"
                        )}
                      >
                        {tCat(plugin.category)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                  <span className="ml-auto whitespace-nowrap rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                    {sectionIds.length} {t("sections")}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {sectionIds.map((sectionId) => {
                    const sectionMeta = (plugin.sections as any[])?.find((s) => s.id === sectionId)
                    const sectionName = sectionMeta?.i18nKey?.name
                      ? tWithFallback(sectionMeta.i18nKey.name.replace(/^plugins\./, ""), sectionMeta.name)
                      : (sectionMeta?.name ?? sectionId)
                    return (
                      <figure key={sectionId} className="group">
                        <div className="overflow-hidden rounded-lg border border-border/60 bg-card/50 transition-colors group-hover:border-primary/40">
                          <img
                            src={`/previews/${plugin.name}/${style}/${sectionId}.svg`}
                            alt={`${displayName} — ${sectionName}`}
                            loading="lazy"
                            className="block w-full"
                          />
                        </div>
                        <figcaption className="mt-2 flex items-center gap-2 px-0.5">
                          <span className="text-[13px] font-medium text-foreground">{sectionName}</span>
                          <code className="ml-auto font-mono text-[10.5px] text-muted-foreground/60">{sectionId}</code>
                        </figcaption>
                      </figure>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>

        <div className="mt-20 text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_0_34px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.02]"
          >
            {t("cta")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
