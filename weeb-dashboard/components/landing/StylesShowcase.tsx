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
      className={`overflow-hidden rounded-2xl border bg-card ${
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
      <div className="p-4">{children}</div>
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
        <div aria-hidden className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* default style */}
          <StyleFrame name="default" badge={t("defaultTag")} note={t("graphic")} highlight>
            <div className="overflow-hidden rounded-lg border border-border bg-background">
              <div className="flex items-center gap-2 bg-gradient-to-r from-primary/20 to-cyan-500/10 px-3 py-2.5">
                <span className="block h-[26px] w-[26px] rounded-full bg-gradient-to-br from-primary to-secondary" />
                <div className="font-heading text-[12.5px] font-bold text-foreground">Top Artists</div>
              </div>
              <div className="flex flex-col gap-2 px-3 py-3">
                {[
                  ["Seycara Orchestral", "208 plays"],
                  ["Peppsen", "75 plays"],
                ].map(([name, plays]) => (
                  <div key={name} className="flex items-center gap-2">
                    <span className="block h-[30px] w-[30px] rounded bg-muted" />
                    <div className="flex-1">
                      <div className="text-[11.5px] font-semibold text-foreground">{name}</div>
                      <div className="text-[10px] text-muted-foreground">{plays}</div>
                    </div>
                  </div>
                ))}
                <div className="h-[5px] overflow-hidden rounded-full bg-muted">
                  <span className="block h-full w-[72%] bg-gradient-to-r from-primary to-secondary" />
                </div>
              </div>
            </div>
          </StyleFrame>

          {/* terminal style */}
          <StyleFrame name="terminal" note={t("mono")}>
            <div className="rounded-lg border border-border bg-[#010409] px-3 py-3">
              <div className="font-mono text-[11px] leading-relaxed text-muted-foreground/80">
                <span className="text-emerald-400">❯</span> weeb top-artists
              </div>
              <div className="mt-2 flex justify-between bg-[#1f6feb] px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                <span>Artist</span>
                <span>Plays</span>
              </div>
              <div className="mt-1 flex flex-col gap-0.5 font-mono text-[11px] leading-relaxed text-[#c9d1d9]">
                {[
                  ["Seycara", "208"],
                  ["Peppsen", "75"],
                  ["Sabaton", "41"],
                ].map(([artist, plays]) => (
                  <div key={artist} className="flex justify-between">
                    <span>{artist}</span>
                    <span className="text-white">{plays}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 font-mono text-[11px] text-emerald-400">████████░░ 72%</div>
            </div>
          </StyleFrame>

          {/* coming soon */}
          <StyleFrame name={t("soon")} note={t("pluggable")}>
            <div className="flex h-[171px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 text-center">
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
