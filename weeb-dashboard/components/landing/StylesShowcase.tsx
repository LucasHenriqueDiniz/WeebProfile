"use client"

import { useState } from "react"
import { BarChart3, BookOpen, Check, SquareTerminal, Sparkles } from "lucide-react"
import { useTranslations } from "@/i18n/use-translations"
import { cn } from "@/lib/utils"
import { SectionHeading } from "./SectionHeading"

type StyleId = "default" | "terminal"

/**
 * One section in its two skins: the visitor flips the style and the same card (LastFM
 * top artists) changes with a crossfade, in a README frame like the hero's.
 */
export function StylesShowcase() {
  const t = useTranslations("landing.styles")
  const [active, setActive] = useState<StyleId>("default")

  const options: Array<{ id: StyleId; icon: typeof BarChart3; label: string; note: string }> = [
    { id: "default", icon: BarChart3, label: "default", note: t("graphic") },
    { id: "terminal", icon: SquareTerminal, label: "terminal", note: t("mono") },
  ]

  return (
    <section id="styles">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <SectionHeading
              align="left"
              kicker={t("kicker")}
              tone="violet"
              title={t("title")}
              subtitle={t("subtitle")}
            />

            <div className="mt-7 inline-flex rounded-xl border-2 border-foreground bg-card p-1" role="group">
              {options.map((option) => {
                const Icon = option.icon
                const isActive = active === option.id
                return (
                  <button
                    type="button"
                    key={option.id}
                    aria-pressed={isActive}
                    onClick={() => setActive(option.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-4 py-2.5 font-mono text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive ? "bg-cyan-400 text-slate-950" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {option.label}
                    <span
                      className={cn(
                        "hidden text-[10px] font-normal sm:inline",
                        isActive ? "text-slate-800" : "text-muted-foreground"
                      )}
                    >
                      {option.note}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mt-6 flex flex-col gap-2.5 text-[14px] text-muted-foreground">
              {[t("check1"), t("check2"), t("check3")].map((text) => (
                <span key={text} className="flex items-center gap-2">
                  <Check className="h-4 w-4 flex-shrink-0 text-foreground" strokeWidth={3} />
                  {text}
                </span>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-2.5 rounded-xl border-2 border-dashed border-foreground/50 px-4 py-3">
              <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-foreground" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">{t("soonTitle")}.</span> {t("soonBody")}
              </p>
            </div>
          </div>

          <div
            aria-hidden
            className="mx-auto w-full max-w-[460px] -rotate-1 overflow-hidden rounded-2xl border-2 border-foreground bg-background shadow-[10px_10px_0_0_hsl(var(--primary))]"
          >
            <div className="flex items-center gap-2 border-b-2 border-foreground bg-card px-4 py-2.5 font-mono text-xs font-semibold text-foreground">
              <BookOpen className="h-3.5 w-3.5" />
              README.md
              <span className="ml-auto rounded-full border-2 border-foreground/70 px-2 py-px text-[10.5px]">
                {active}
              </span>
            </div>
            <div className="grid p-2">
              {options.map((option) => (
                <img
                  key={option.id}
                  src={`/previews/lastfm/${option.id}/top_artists.svg`}
                  alt=""
                  loading="lazy"
                  className={cn(
                    "col-start-1 row-start-1 w-full self-start transition-opacity duration-500",
                    active === option.id ? "opacity-100" : "pointer-events-none opacity-0"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
