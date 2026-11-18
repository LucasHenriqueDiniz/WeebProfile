"use client"

import { ArrowRight, BookOpen, Check } from "lucide-react"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { SECTION_PREVIEWS } from "@/lib/config/section-previews"
import { MAX_SVGS_FREE_TIER } from "@/lib/config/plan"
import { Link } from "@/i18n/navigation"
import { useLocale, useTranslations } from "@/i18n/use-translations"

/**
 * A README the way it looks on a GitHub profile: the one line of markdown people paste,
 * and under it the real section previews (the SVGs the generator produces, in
 * public/previews), two half cards side by side, sharp and whole.
 *
 * Earlier versions: two columns of previews scrolling behind a gradient (no card could
 * be read), then a single 415px card beside the title, under purple and cyan glow orbs
 * that washed over the header. The product is the card, so it now gets the full width
 * below a centred title, on a plain background with one glow behind the frame.
 */
const HERO_COLUMNS = [
  [
    { plugin: "github", section: "profile", wideOnly: false },
    { plugin: "github", section: "calendar", wideOnly: true },
  ],
  [
    { plugin: "myanimelist", section: "anime_bar", wideOnly: false },
    { plugin: "lastfm", section: "top_artists", wideOnly: false },
  ],
] as const

const HERO_CARD = HERO_COLUMNS.flat()

function HeroReadme({ caption }: { caption: string }) {
  return (
    <figure className="relative mx-auto mt-14 w-full max-w-[880px] duration-1000 animate-in fade-in slide-in-from-bottom-6 fill-mode-both [animation-delay:150ms] md:mt-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 -top-16 h-[420px] bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.3),transparent_68%)] blur-2xl dark:bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.38),transparent_68%)]"
      />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-[0_40px_120px_-40px_hsl(var(--primary)/0.45)]">
        <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-2.5 font-mono text-xs text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5" />
          README.md
        </div>
        {/* The whole integration: one line. Decorative, so screen readers skip the markup. */}
        <div
          aria-hidden
          className="flex gap-4 overflow-hidden whitespace-nowrap border-b border-border bg-card/50 px-4 py-3 font-mono text-[12.5px] leading-none text-muted-foreground"
        >
          <span className="select-none text-muted-foreground/50">1</span>
          <span>
            {"<img "}
            <span className="text-foreground">src</span>
            {"="}
            <span className="text-primary">{'"https://weebprofile-dashboard.pages.dev/svg/a1b2c3.svg"'}</span>
            {" />"}
          </span>
        </div>
        <div className="grid gap-x-3 p-3 text-left sm:grid-cols-2 sm:p-4">
          {HERO_COLUMNS.map((column, index) => (
            <div key={index}>
              {column.map(({ plugin, section, wideOnly }) => {
                const size = SECTION_PREVIEWS[plugin]?.[section]?.default
                return (
                  <img
                    key={`${plugin}/${section}`}
                    src={`/previews/${plugin}/default/${section}.svg`}
                    alt=""
                    width={size?.[0]}
                    height={size?.[1]}
                    className={wideOnly ? "hidden h-auto w-full sm:block" : "block h-auto w-full"}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <figcaption className="mt-4 text-center text-xs text-muted-foreground">{caption}</figcaption>
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

const HERO_CARD_PLUGINS = [...new Set(HERO_CARD.map(({ plugin }) => plugin))].map(
  (plugin) => (PLUGINS_METADATA as Record<string, { displayName: string }>)[plugin]?.displayName ?? plugin
)

export function LandingHero() {
  const t = useTranslations("landing.hero")
  const locale = useLocale()
  // "GitHub, MyAnimeList e LastFM" in the page's language, not a bare comma list.
  const cardPlugins = new Intl.ListFormat(locale, { type: "conjunction" }).format(HERO_CARD_PLUGINS)

  return (
    <section id="top" className="relative">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-16 pt-16 text-center md:pb-20 md:pt-24">
        <div className="flex flex-col items-center duration-700 animate-in fade-in slide-in-from-bottom-3 fill-mode-both">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground">
            <img src="/sora/sora-head.png" alt="" className="h-4 w-4 object-contain" />
            {t("badge", { plugins: TOTAL_PLUGINS, sections: SECOES_ARREDONDADAS })}
          </div>
          <h1 className="mt-7 font-heading text-5xl font-extrabold leading-[1.02] tracking-tight text-foreground [text-wrap:balance] sm:text-6xl md:text-7xl">
            {t("title")}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h1>
          <p className="mt-6 max-w-[560px] text-lg leading-relaxed text-muted-foreground [text-wrap:pretty]">
            {t("subtitle")}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-primary px-6 py-3.5 text-[15px] font-semibold text-primary-foreground shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.7)] transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t("ctaPrimary")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#plugins"
              className="inline-block whitespace-nowrap rounded-lg border border-border bg-card/90 px-5 py-3.5 text-[15px] font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t("ctaSecondary")}
            </a>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[13px] font-medium text-muted-foreground">
            {[t("check1", { max: MAX_SVGS_FREE_TIER }), t("check2"), t("check3")].map((c) => (
              <span key={c} className="flex items-center gap-1.5 whitespace-nowrap">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                {c}
              </span>
            ))}
          </div>
        </div>

        <HeroReadme caption={t("cardCaption", { plugins: cardPlugins })} />
      </div>
    </section>
  )
}
