"use client"

import { useTranslations } from "@/i18n/use-translations"

const PLATFORMS = ["GitHub", "Last.fm", "MyAnimeList", "Steam", "Codeforces", "Duolingo", "Lyfta"]

export function PlatformStrip() {
  const t = useTranslations("landing.platforms")
  return (
    <section className="mx-auto max-w-6xl px-6 pt-6">
      <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 border-y border-border/60 py-5">
        <span className="whitespace-nowrap text-[11.5px] font-semibold tracking-[0.14em] text-muted-foreground/60">
          {t("label")}
        </span>
        {PLATFORMS.map((p) => (
          <span key={p} className="whitespace-nowrap font-heading text-[15px] font-semibold text-muted-foreground/80">
            {p}
          </span>
        ))}
      </div>
    </section>
  )
}
