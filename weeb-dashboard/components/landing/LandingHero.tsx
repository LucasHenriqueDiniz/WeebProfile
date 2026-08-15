"use client"

import { ArrowRight, Check } from "lucide-react"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "@/i18n/use-translations"

// Real section previews (the same SVGs the generator produces), straight from
// public/previews — the hero shows the actual product, not mockups. Curated to the
// tightly-sized, data-rich ones: several previews declare more height than they paint
// (static calculateHeight overshoot), which reads as ugly empty padding in a frame.
const COLUMN_UP = [
  "/previews/lastfm/default/top_artists.svg",
  "/previews/duolingo/terminal/total_xp.svg",
  "/previews/myanimelist/default/statistics.svg",
  "/previews/codewars/terminal/completed_kata.svg",
  "/previews/codeforces/default/rating_rank.svg",
]

const COLUMN_DOWN = [
  "/previews/github/default/calendar.svg",
  "/previews/lastfm/terminal/recent_tracks.svg",
  "/previews/github/default/activity.svg",
  "/previews/myanimelist/terminal/manga_bar.svg",
  "/previews/github_repo/terminal/languages.svg",
]

function PreviewColumn({ sources }: { sources: string[] }) {
  // Sem moldura por card (border/bg): overshoot de altura do SVG viraria faixa vazia.
  // Radius bem leve + drop-shadow que segue o alpha do proprio SVG; o fundo fica no
  // painel da esteira inteira, la no container.
  return (
    <>
      {sources.map((src) => (
        <img
          key={src}
          src={src}
          alt=""
          className="mb-3.5 block w-full overflow-hidden rounded [filter:drop-shadow(0_4px_14px_rgba(0,0,0,0.25))]"
        />
      ))}
    </>
  )
}

// Derivado de PLUGINS_METADATA, que é auto-gerado a cada plugin novo. O badge dizia
// "11 plugins · 60+ seções" cravado na tradução, e ficou desatualizado sem ninguém
// notar: já eram 14. Número em texto de marketing envelhece calado.
const TOTAL_PLUGINS = Object.keys(PLUGINS_METADATA).length
const TOTAL_SECOES = Object.values(PLUGINS_METADATA as Record<string, { sections?: unknown[] }>).reduce(
  (soma, meta) => soma + (meta.sections?.length ?? 0),
  0
)
// Arredonda para baixo na dezena: o "+" promete um piso, não uma contagem exata,
// e assim o texto não muda a cada seção adicionada.
const SECOES_ARREDONDADAS = Math.floor(TOTAL_SECOES / 10) * 10

export function LandingHero() {
  const t = useTranslations("landing.hero")

  return (
    <section id="top" className="relative flex min-h-[640px] items-center overflow-hidden">
      {/* Marquee card columns (decorative) */}
      <div aria-hidden className="absolute bottom-0 right-0 top-0 hidden w-[min(760px,58%)] md:block">
        {/* Fundo da esteira: painel sutil que ancora as colunas em vez de cards soltos */}
        <div className="absolute inset-y-0 left-6 right-0 rounded-l-3xl border-l border-border/40 bg-gradient-to-l from-primary/[0.07] via-muted/40 to-transparent dark:from-primary/10 dark:via-white/[0.03]" />
        <div className="absolute inset-0 flex justify-end gap-[18px] pr-[60px] opacity-85">
          <div className="h-full w-[300px] overflow-hidden">
            <div className="animate-marquee-up flex flex-col">
              <PreviewColumn sources={COLUMN_UP} />
              <PreviewColumn sources={COLUMN_UP} />
            </div>
          </div>
          <div className="h-full w-[300px] overflow-hidden">
            <div className="animate-marquee-down flex flex-col">
              <PreviewColumn sources={COLUMN_DOWN} />
              <PreviewColumn sources={COLUMN_DOWN} />
            </div>
          </div>
        </div>
      </div>
      {/* Fades so the copy stays readable over the marquee */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-background from-[42%] via-background/80 via-[56%] to-background/25 md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-[76%] to-background"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-20">
        <div className="max-w-[600px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground">
            <img src="/sora/sora-head.png" alt="" className="h-4 w-4 object-contain" />
            {t("badge", { plugins: TOTAL_PLUGINS, sections: SECOES_ARREDONDADAS })}
          </div>
          <h1 className="mt-6 font-heading text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground [text-wrap:balance] md:text-6xl">
            {t("title")}{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-cyan-500 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h1>
          <p className="mt-5 max-w-[440px] text-lg leading-relaxed text-muted-foreground">{t("subtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_0_34px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.02]"
            >
              {t("ctaPrimary")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#plugins"
              className="inline-block whitespace-nowrap rounded-lg border border-border bg-card/90 px-5 py-3.5 text-[15px] font-semibold text-foreground transition-colors hover:bg-accent"
            >
              {t("ctaSecondary")}
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[13px] font-medium text-muted-foreground/80">
            {[t("check1"), t("check2"), t("check3")].map((c) => (
              <span key={c} className="flex items-center gap-1.5 whitespace-nowrap">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
