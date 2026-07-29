"use client"

import { Link } from "@/i18n/navigation"
import { useTranslations } from "@/i18n/use-translations"
import { TemplateCardSkeleton } from "@/components/sections/TemplateCardSkeleton"
import type { Template } from "@/types/template"
import { LandingTemplateCard } from "./LandingTemplateCard"
import { SectionHeading } from "./SectionHeading"

interface TemplatesShowcaseProps {
  templates: Template[]
  loading?: boolean
}

// A seção nunca pode aparecer vazia: se a API pública não devolver templates (ambiente
// novo, erro, sem publicados ainda), mostramos combos curados com previews locais.
const FALLBACK_TEMPLATES: Template[] = [
  {
    id: "fallback-dev",
    name: "Developer Showcase",
    description: "GitHub activity, contribution calendar and featured repositories.",
    preview: "/previews/github/default/calendar.svg",
    platforms: ["GitHub"],
    style: "default",
    theme: "purple",
    size: "half",
    pluginsOrder: "github",
  },
  {
    id: "fallback-anime",
    name: "Anime & Music",
    description: "MyAnimeList statistics with your most played Last.fm artists.",
    preview: "/previews/myanimelist/default/statistics.svg",
    platforms: ["MyAnimeList", "LastFM"],
    style: "default",
    theme: "pink",
    size: "half",
    pluginsOrder: "myanimelist,lastfm",
  },
  {
    id: "fallback-terminal",
    name: "Terminal Feed",
    description: "Recent tracks and code activity, terminal style.",
    preview: "/previews/lastfm/terminal/recent_tracks.svg",
    platforms: ["LastFM", "GitHub"],
    style: "terminal",
    theme: "default",
    size: "half",
    pluginsOrder: "lastfm,github",
  },
]

export function TemplatesShowcase({ templates, loading = false }: TemplatesShowcaseProps) {
  const t = useTranslations("landing.templates")
  const usingFallback = !loading && templates.length === 0
  const visible = usingFallback ? FALLBACK_TEMPLATES : templates.slice(0, 3)

  return (
    <section id="templates" className="mx-auto max-w-6xl px-6 py-20 md:py-24">
      <SectionHeading
        kicker={t("kicker")}
        kickerClassName="text-secondary"
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading && templates.length === 0
          ? Array.from({ length: 3 }).map((_, i) => <TemplateCardSkeleton key={i} />)
          : visible.map((template) => (
              <LandingTemplateCard
                key={template.id}
                template={template}
                href={usingFallback ? "/templates" : undefined}
              />
            ))}
      </div>
      <div className="mt-7 text-center">
        <Link
          href="/templates"
          className="inline-block rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
        >
          {t("explore")}
        </Link>
      </div>
    </section>
  )
}
