"use client"

import { ArrowRight, Check } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "@/i18n/use-translations"
import {
  MockAnimeFavorites,
  MockCodeHabits,
  MockRepoCard,
  MockSteamGames,
  MockTerminalCalendar,
  MockTerminalStats,
  MockTopArtists,
} from "./hero-mock-cards"

function ColumnUp() {
  return (
    <>
      <MockTopArtists />
      <MockTerminalCalendar />
      <MockSteamGames />
      <MockTerminalStats
        command="weeb duolingo"
        rows={[
          ["Streak", "412"],
          ["Total XP", "38.2K"],
          ["Languages", "3"],
        ]}
        footer="ja · es · de"
      />
    </>
  )
}

function ColumnDown() {
  return (
    <>
      <MockRepoCard />
      <MockAnimeFavorites />
      <MockCodeHabits />
      <MockTerminalStats
        command="weeb lyfta"
        rows={[
          ["Workouts", "212"],
          ["Volume", "1.2M kg"],
          ["PRs", "18"],
        ]}
        footer="last: push day"
      />
    </>
  )
}

export function LandingHero() {
  const t = useTranslations("landing.hero")

  return (
    <section id="top" className="relative flex min-h-[640px] items-center overflow-hidden">
      {/* Marquee card columns (decorative) */}
      <div aria-hidden className="absolute bottom-0 right-0 top-0 hidden w-[min(760px,58%)] md:block">
        <div className="absolute inset-0 flex justify-end gap-[18px] pr-[60px] opacity-85">
          <div className="h-full w-[270px] overflow-hidden">
            <div className="animate-marquee-up flex flex-col">
              <ColumnUp />
              <ColumnUp />
            </div>
          </div>
          <div className="h-full w-[270px] overflow-hidden">
            <div className="animate-marquee-down flex flex-col">
              <ColumnDown />
              <ColumnDown />
            </div>
          </div>
        </div>
      </div>
      {/* Fades so the copy stays readable over the marquee */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-background from-[44%] via-background/95 via-[60%] to-background/60 md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-[76%] to-background"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-20">
        <div className="max-w-[600px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground">
            <img src="/sora/sora-head.png" alt="" className="h-4 w-4 object-contain" />
            {t("badge")}
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
