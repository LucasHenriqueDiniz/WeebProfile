"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowRight, BookOpen, Check } from "lucide-react"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { MAX_SVGS_FREE_TIER } from "@/lib/config/plan"
import {
  HERO_CARD_LIST,
  HERO_FRAME_HEIGHT,
  HERO_ROTATE_MS,
  heroCardUrl,
  nextHeroIndex,
  type HeroCard as HeroCardData,
} from "@/lib/landing/hero-rotation"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/navigation"
import { useLocale, useTranslations } from "@/i18n/use-translations"

/**
 * A README the way it looks on a GitHub profile: the one line of markup people paste,
 * and under it two half cards side by side, sharp and whole, rotating through the
 * examples in public/hero: whole cards from the generator, with animations on.
 *
 * Earlier versions: two columns of previews scrolling behind a gradient (no card could
 * be read); one 415px card that never moved, under a title that says the README is
 * alive; then that card rotating, still squeezed beside the title under purple and cyan
 * glow orbs that washed over the header. The card is the product, so it now gets the
 * full width below a centred title, on a plain background with one glow behind the frame.
 *
 * A card's animations play once, when the browser decodes the image, and an image it
 * already has stays at rest: switching back to a card's URL showed it finished. Each
 * showing is a new image, a blob URL over the card's text, which replays in Chromium,
 * Firefox and WebKit (changing only the URL's fragment did not, in WebKit).
 */

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(query.matches)
    const onChange = () => setReduced(query.matches)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])
  return reduced
}

function pluginNames(cards: readonly HeroCardData[], locale: string): string {
  const names = [...new Set(cards.flatMap((card) => card.plugins))].map(
    (plugin) => (PLUGINS_METADATA as Record<string, { displayName: string }>)[plugin]?.displayName ?? plugin
  )
  // "GitHub, MyAnimeList e LastFM" in the page's language, not a bare comma list.
  return new Intl.ListFormat(locale, { type: "conjunction" }).format(names)
}

/**
 * The second column shows the next card in the list, so a card comes up on the right and
 * moves to the left on the following turn, like a carousel. Half the list away, the pair
 * was the README card beside the calendar card: the same GitHub profile header twice.
 */
const PAIR_OFFSET = 1

const pairAt = (index: number): readonly [HeroCardData, HeroCardData] => [
  HERO_CARD_LIST[index]!,
  HERO_CARD_LIST[(index + PAIR_OFFSET) % HERO_CARD_LIST.length]!,
]

function HeroReadme() {
  const t = useTranslations("landing.hero")
  const locale = useLocale()
  const reducedMotion = usePrefersReducedMotion()
  const [showing, setShowing] = useState({ index: 0, srcs: pairAt(0).map(heroCardUrl) })
  const [paused, setPaused] = useState(false)
  // Each card's text, fetched once; every showing makes a new blob URL over it.
  const texts = useRef(new Map<string, Promise<string>>())

  const freshUrl = useCallback(async (card: HeroCardData) => {
    let text = texts.current.get(card.slug)
    if (!text) {
      text = fetch(heroCardUrl(card)).then((response) => {
        if (!response.ok) throw new Error(`${response.status}`)
        return response.text()
      })
      texts.current.set(card.slug, text)
    }
    try {
      return URL.createObjectURL(new Blob([await text], { type: "image/svg+xml" }))
    } catch {
      texts.current.delete(card.slug)
      return heroCardUrl(card)
    }
  }, [])

  const show = useCallback(
    async (index: number) => {
      const srcs = await Promise.all(pairAt(index).map(freshUrl))
      setShowing({ index, srcs })
    },
    [freshUrl]
  )

  // The previous blob URLs are released once the next ones are up.
  useEffect(() => {
    const { srcs } = showing
    return () => {
      for (const src of srcs) if (src.startsWith("blob:")) URL.revokeObjectURL(src)
    }
  }, [showing])

  // Next pair after HERO_ROTATE_MS, unless the visitor asked for less motion, is over the
  // cards, or the tab is in the background.
  useEffect(() => {
    if (reducedMotion || paused) return
    const timer = window.setTimeout(() => {
      if (document.visibilityState === "visible") void show(nextHeroIndex(showing.index))
    }, HERO_ROTATE_MS)
    return () => window.clearTimeout(timer)
  }, [showing, paused, reducedMotion, show])

  const pair = pairAt(showing.index)
  const caption = (cards: readonly HeroCardData[]) => t("cardCaption", { plugins: pluginNames(cards, locale) })

  return (
    <figure
      className="relative mx-auto mt-14 w-full max-w-[880px] duration-1000 animate-in fade-in slide-in-from-bottom-6 fill-mode-both [animation-delay:150ms] md:mt-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
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
        {/* Two half cards side by side from sm up; below it, the first one alone. */}
        <div className="grid gap-x-3 p-3 text-left sm:grid-cols-2 sm:p-4">
          {pair.map((card, column) => (
            <div
              key={column}
              className={cn("relative w-full", column === 1 && "hidden sm:block")}
              style={{ aspectRatio: `${card.width} / ${HERO_FRAME_HEIGHT}` }}
            >
              <img
                key={showing.srcs[column]}
                src={showing.srcs[column]}
                alt={caption([card])}
                width={card.width}
                height={card.height}
                className={cn(
                  "absolute inset-x-0 top-0 block h-auto w-full",
                  !reducedMotion && "duration-500 animate-in fade-in"
                )}
              />
            </div>
          ))}
        </div>
      </div>
      <figcaption className="mt-4 text-center text-xs text-muted-foreground" aria-live="polite">
        <span className="sm:hidden">{caption([pair[0]])}</span>
        <span className="hidden sm:inline">{caption(pair)}</span>
      </figcaption>
      <div className="mt-2 flex justify-center gap-1.5">
        {HERO_CARD_LIST.map((item, index) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => void show(index)}
            aria-label={t("cardShow", { plugins: pluginNames([item], locale) })}
            aria-current={index === showing.index}
            className={cn(
              "h-1.5 rounded-full transition-all",
              index === showing.index ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
            )}
          />
        ))}
      </div>
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

export function LandingHero() {
  const t = useTranslations("landing.hero")

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

        <HeroReadme />
      </div>
    </section>
  )
}
