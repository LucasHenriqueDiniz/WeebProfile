"use client"

import { useState } from "react"
import { BarChart3, Check, SquareTerminal, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/i18n/use-translations"
import { SectionHeading } from "./SectionHeading"

type StyleId = "default" | "terminal"

// Refactor total: em vez de tres molduras estaticas, um comparador interativo — o
// visitante alterna o estilo e ve a MESMA section (LastFM top artists) trocar de pele
// com crossfade. E a promessa do produto ("um clique, nada se perde") demonstrada.
export function StylesShowcase() {
  const t = useTranslations("landing.styles")
  const [active, setActive] = useState<StyleId>("default")

  const options: Array<{ id: StyleId; icon: typeof BarChart3; label: string; note: string }> = [
    { id: "default", icon: BarChart3, label: "default", note: t("graphic") },
    { id: "terminal", icon: SquareTerminal, label: "terminal", note: t("mono") },
  ]

  return (
    <section id="styles" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          {/* Copy + controle */}
          <div>
            <SectionHeading
              align="left"
              kicker={t("kicker")}
              kickerClassName="text-emerald-500"
              title={t("title")}
              subtitle={t("subtitle")}
            />

            <div className="mt-7 inline-flex rounded-xl border border-border bg-card p-1">
              {options.map((opt) => {
                const Icon = opt.icon
                const isActive = active === opt.id
                return (
                  <button
                    key={opt.id}
                    onClick={() => setActive(opt.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-4 py-2.5 font-mono text-sm font-semibold transition-all",
                      isActive
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_20px_rgba(139,92,246,0.35)]"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {opt.label}
                    <span
                      className={cn("text-[10px] font-normal", isActive ? "text-white/70" : "text-muted-foreground/60")}
                    >
                      {opt.note}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mt-6 flex flex-col gap-2.5 text-[13.5px] text-muted-foreground">
              {[t("check1"), t("check2"), t("check3")].map((c) => (
                <span key={c} className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
                  {c}
                </span>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-dashed border-border px-4 py-3">
              <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary/70" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">{t("soonTitle")}.</span> {t("soonBody")}
              </p>
            </div>
          </div>

          {/* Palco do preview — crossfade entre as duas peles da mesma section */}
          <div aria-hidden className="relative">
            <div
              className={cn(
                "absolute left-1/2 top-1/2 h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px] transition-colors duration-500",
                active === "default" ? "bg-primary opacity-[0.16]" : "bg-emerald-500 opacity-[0.12]"
              )}
            />
            <div className="relative mx-auto grid max-w-[440px]">
              <img
                src="/previews/lastfm/default/top_artists.svg"
                alt=""
                className={cn(
                  "col-start-1 row-start-1 w-full rounded-xl transition-all duration-500 [filter:drop-shadow(0_14px_40px_rgba(0,0,0,0.3))]",
                  active === "default" ? "opacity-100" : "pointer-events-none opacity-0 scale-[0.98]"
                )}
              />
              <img
                src="/previews/lastfm/terminal/top_artists.svg"
                alt=""
                className={cn(
                  "col-start-1 row-start-1 w-full self-start rounded-xl transition-all duration-500 [filter:drop-shadow(0_14px_40px_rgba(0,0,0,0.35))]",
                  active === "terminal" ? "opacity-100" : "pointer-events-none opacity-0 scale-[0.98]"
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
