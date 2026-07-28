"use client"

import { Check } from "lucide-react"
import { useTranslations } from "@/i18n/use-translations"
import { SectionHeading } from "./SectionHeading"

function StyleFrame({
  name,
  badge,
  note,
  highlight = false,
  children,
}: {
  name: string
  badge?: string
  note: string
  highlight?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border bg-card ${
        highlight ? "border-primary/50 shadow-[0_0_0_3px_rgba(139,92,246,0.1)]" : "border-border"
      }`}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3.5">
        <span className="font-mono text-[13px] font-bold text-foreground">{name}</span>
        {badge ? (
          <span className="whitespace-nowrap rounded-full border border-primary/45 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-primary">
            {badge}
          </span>
        ) : null}
        <span className="ml-auto text-[11.5px] text-muted-foreground">{note}</span>
      </div>
      <div className="flex-1 p-4">{children}</div>
    </div>
  )
}

export function StylesShowcase() {
  const t = useTranslations("landing.styles")

  return (
    <section id="styles" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <SectionHeading
          kicker={t("kicker")}
          kickerClassName="text-emerald-500"
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Real previews: the SAME section (LastFM top artists) in each style */}
          <StyleFrame name="default" badge={t("defaultTag")} note={t("graphic")} highlight>
            <div className="overflow-hidden rounded-lg border border-border">
              <img
                src="/previews/lastfm/default/top_artists.svg"
                alt="LastFM top artists — default style"
                className="block w-full"
                loading="lazy"
              />
            </div>
          </StyleFrame>

          <StyleFrame name="terminal" note={t("mono")}>
            <div className="overflow-hidden rounded-lg border border-border">
              <img
                src="/previews/lastfm/terminal/top_artists.svg"
                alt="LastFM top artists — terminal style"
                className="block w-full"
                loading="lazy"
              />
            </div>
          </StyleFrame>

          {/* coming soon */}
          <StyleFrame name={t("soon")} note={t("pluggable")}>
            <div className="flex h-full min-h-[171px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 text-center">
              <span className="font-heading text-[13px] font-bold text-muted-foreground">{t("soonTitle")}</span>
              <span className="text-[11.5px] leading-normal text-muted-foreground/70">{t("soonBody")}</span>
            </div>
          </StyleFrame>
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13.5px] text-muted-foreground">
          {[t("check1"), t("check2"), t("check3")].map((c) => (
            <span key={c} className="flex items-center gap-1.5 whitespace-nowrap">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
