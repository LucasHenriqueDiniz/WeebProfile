"use client"

import { useTranslations } from "@/i18n/use-translations"
import { SectionHeading } from "./SectionHeading"

export function RepoShowcase() {
  const t = useTranslations("landing.repos")
  const chips = [t("banner"), t("stats"), t("starGrowth"), t("languages"), t("topics")]

  // Real github_repo section previews from the generator.
  const previews = [
    { label: t("banner"), src: "/previews/github_repo/default/banner.svg" },
    { label: t("stats"), src: "/previews/github_repo/default/stats.svg" },
    { label: t("starGrowth"), src: "/previews/github_repo/default/star_graph.svg" },
    { label: t("languages"), src: "/previews/github_repo/default/languages.svg" },
  ]

  return (
    <section id="repos" className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div>
            <SectionHeading
              align="left"
              kicker={t("kicker")}
              kickerClassName="text-cyan-500"
              title={t("title")}
              subtitle={t.rich("subtitle", { mode: (c) => <b className="text-foreground">{c}</b> })}
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {previews.map((p) => (
              <div key={p.label} className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="border-b border-border px-3.5 py-2.5 text-[11.5px] font-semibold text-muted-foreground">
                  {p.label}
                </div>
                <img src={p.src} alt={p.label} className="block w-full" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
