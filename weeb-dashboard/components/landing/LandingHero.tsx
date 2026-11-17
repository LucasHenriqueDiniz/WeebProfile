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
 * One card at a time the way it lands in a README, sharp and whole, rotating through the
 * examples in public/hero: whole cards from the generator, with animations on.
 *
 * The hero used to run two columns of previews scrolling behind a gradient that was
 * solid background up to 42% of the width and still 80% at 56%, at 85% opacity: no
 * card could be read, it was cut at the edges, it competed with the title, and it was
 * hidden below the md breakpoint. Then it showed one card that never moved, under a
 * title that says the README is alive.
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

function pluginNames(card: HeroCardData, locale: string): string {
  const names = card.plugins.map(
    (plugin) => (PLUGINS_METADATA as Record<string, { displayName: string }>)[plugin]?.displayName ?? plugin
  )
  // "GitHub, MyAnimeList e LastFM" in the page's language, not a bare comma list.
  return new Intl.ListFormat(locale, { type: "conjunction" }).format(names)
}

function HeroCard() {
  const t = useTranslations("landing.hero")
  const locale = useLocale()
  const reducedMotion = usePrefersReducedMotion()
  const [showing, setShowing] = useState({ index: 0, src: heroCardUrl(HERO_CARD_LIST[0]!) })
  const [paused, setPaused] = useState(false)
  // Each card's text, fetched once; every showing makes a new blob URL over it.
  const texts = useRef(new Map<string, Promise<string>>())

  const show = useCallback(async (index: number) => {
    const card = HERO_CARD_LIST[index]!
    let text = texts.current.get(card.slug)
    if (!text) {
      text = fetch(heroCardUrl(card)).then((response) => {
        if (!response.ok) throw new Error(`${response.status}`)
        return response.text()
      })
      texts.current.set(card.slug, text)
    }
    try {
      const blob = new Blob([await text], { type: "image/svg+xml" })
      setShowing({ index, src: URL.createObjectURL(blob) })
    } catch {
      texts.current.delete(card.slug)
      setShowing({ index, src: heroCardUrl(card) })
    }
  }, [])

  // The previous blob URL is released once the next one is up.
  useEffect(() => {
    const { src } = showing
    return () => {
      if (src.startsWith("blob:")) URL.revokeObjectURL(src)
    }
  }, [showing])

  // Next card after HERO_ROTATE_MS, unless the visitor asked for less motion, is over the
  // card, or the tab is in the background.
  useEffect(() => {
    if (reducedMotion || paused) return
    const timer = window.setTimeout(() => {
      if (document.visibilityState === "visible") void show(nextHeroIndex(showing.index))
    }, HERO_ROTATE_MS)
    return () => window.clearTimeout(timer)
  }, [showing, paused, reducedMotion, show])

  const card = HERO_CARD_LIST[showing.index]!
  const caption = t("cardCaption", { plugins: pluginNames(card, locale) })

  return (
    <figure
      className="mx-auto w-full max-w-[415px] flex-none lg:mx-0 lg:w-[415px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_80px_-28px_rgba(139,92,246,0.55)]">
        <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 font-mono text-xs text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5" />
          README.md
        </div>
        <div className="p-2">
          <div className="relative w-full" style={{ aspectRatio: `${card.width} / ${HERO_FRAME_HEIGHT}` }}>
            <img
              key={showing.src}
              src={showing.src}
              alt={caption}
              width={card.width}
              height={card.height}
              className={cn(
                "absolute inset-x-0 top-0 block h-auto w-full",
                !reducedMotion && "animate-in fade-in duration-500"
              )}
            />
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground" aria-live="polite">
        {caption}
      </figcaption>
      <div className="mt-2 flex justify-center gap-1.5">
        {HERO_CARD_LIST.map((item, index) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => void show(index)}
            aria-label={t("cardShow", { plugins: pluginNames(item, locale) })}
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

        <HeroCard />
      </div>
    </section>
  )
}
