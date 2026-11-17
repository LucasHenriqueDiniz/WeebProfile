"use client"

import { ArrowRight, BookOpen, Check } from "lucide-react"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { SECTION_PREVIEWS } from "@/lib/config/section-previews"
import { MAX_SVGS_FREE_TIER } from "@/lib/config/plan"
import { Link } from "@/i18n/navigation"
import { useLocale, useTranslations } from "@/i18n/use-translations"

/**
 * One card the way it lands in a README: real section previews (the SVGs the generator
 * produces, in public/previews), stacked in a frame, sharp and whole.
 *
 * The hero used to run two columns of previews scrolling behind a gradient that was
 * solid background up to 42% of the width and still 80% at 56%, at 85% opacity: no
 * card could be read, it was cut at the edges, it competed with the title, and it was
 * hidden below the md breakpoint.
 */
const HERO_CARD = [
  { plugin: "github", section: "profile" },
  { plugin: "myanimelist", section: "anime_bar" },
  { plugin: "lastfm", section: "top_artists" },
] as const

function HeroCard({ caption }: { caption: string }) {
  return (
    <figure className="mx-auto w-full max-w-[415px] flex-none lg:mx-0 lg:w-[415px]">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_80px_-28px_rgba(139,92,246,0.55)]">
        <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 font-mono text-xs text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5" />
          README.md
        </div>
        <div className="p-2">
          {HERO_CARD.map(({ plugin, section }) => {
            const size = SECTION_PREVIEWS[plugin]?.[section]?.default
            return (
              <img
                key={`${plugin}/${section}`}
                src={`/previews/${plugin}/default/${section}.svg`}
                alt=""
                width={size?.[0]}
                height={size?.[1]}
                className="block h-auto w-full"
              />
            )
          })}
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">{caption}</figcaption>
    </figure>
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

const HERO_CARD_PLUGINS = HERO_CARD.map(
  ({ plugin }) => (PLUGINS_METADATA as Record<string, { displayName: string }>)[plugin]?.displayName ?? plugin
)

export function LandingHero() {
  const t = useTranslations("landing.hero")
  const locale = useLocale()
  // "GitHub, MyAnimeList e LastFM" in the page's language, not a bare comma list.
  const cardPlugins = new Intl.ListFormat(locale, { type: "conjunction" }).format(HERO_CARD_PLUGINS)

  return (
    <section id="top" className="relative flex min-h-[640px] items-center overflow-hidden">
      {/* Painel sutil atrás do card, no lugar da esteira: ancora o card sem cobrir nada */}
      <div
        aria-hidden
        className="absolute bottom-0 right-0 top-0 hidden w-[min(640px,48%)] rounded-l-3xl border-l border-border/40 bg-gradient-to-l from-primary/[0.07] via-muted/40 to-transparent dark:from-primary/10 dark:via-white/[0.03] lg:block"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 md:py-20 lg:flex-row lg:items-center lg:justify-between">
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
            {[t("check1", { max: MAX_SVGS_FREE_TIER }), t("check2"), t("check3")].map((c) => (
              <span key={c} className="flex items-center gap-1.5 whitespace-nowrap">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                {c}
              </span>
            ))}
          </div>
        </div>

        <HeroCard caption={t("cardCaption", { plugins: cardPlugins })} />
      </div>
    </section>
  )
}
