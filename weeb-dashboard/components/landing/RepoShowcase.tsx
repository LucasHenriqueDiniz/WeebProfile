"use client"

import { useTranslations } from "@/i18n/use-translations"
import { SectionHeading } from "./SectionHeading"

const STAR_BARS = [14, 20, 26, 32, 38, 44, 52, 58, 66, 74, 86, 100]

function MiniPanel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-3.5 py-2.5 text-[11.5px] font-semibold text-muted-foreground">
        {label}
      </div>
      <div className="p-3.5">{children}</div>
    </div>
  )
}

export function RepoShowcase() {
  const t = useTranslations("landing.repos")
  const chips = [t("banner"), t("stats"), t("starGrowth"), t("languages"), t("topics")]

  return (
    <section id="repos" className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div>
            <SectionHeading
              align="left"
              kicker={t("kicker")}
              kickerClassName="text-cyan-500"
              title={t("title")}
              subtitle={t.rich("subtitle", { mode: (c) => <b className="text-foreground">{c}</b> })}
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Decorative repo-card mockups */}
          <div aria-hidden className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <MiniPanel label={t("banner")}>
              <div className="overflow-hidden rounded-lg border border-border">
                <div className="h-1.5 bg-gradient-to-r from-[#3178c6] to-[#f1e05a]" />
                <div className="flex items-center gap-2.5 px-3 py-3">
                  <span className="block h-[30px] w-[30px] rounded-full bg-gradient-to-br from-primary to-secondary" />
                  <div>
                    <div className="font-mono text-[10.5px] text-muted-foreground">LucasHenriqueDiniz /</div>
                    <div className="font-heading text-sm font-bold text-foreground">weebProfile</div>
                  </div>
                </div>
                <div className="px-3 pb-3 text-[11px] leading-normal text-muted-foreground">
                  SVG stat cards for your GitHub profile.
                </div>
              </div>
            </MiniPanel>

            <MiniPanel label={t("stats")}>
              <div className="flex gap-2.5">
                <div className="flex-1 rounded-lg border border-border p-3">
                  <div className="font-heading text-[22px] font-extrabold text-foreground">128</div>
                  <div className="text-[10.5px] font-medium text-amber-500">★ Stars</div>
                </div>
                <div className="flex-1 rounded-lg border border-border p-3">
                  <div className="font-heading text-[22px] font-extrabold text-foreground">24</div>
                  <div className="text-[10.5px] font-medium text-muted-foreground">⑂ Forks</div>
                </div>
              </div>
              <div className="mt-2.5 font-mono text-[10.5px] text-muted-foreground/70">{t("updated")}</div>
            </MiniPanel>

            <MiniPanel label={t("starGrowth")}>
              <div className="flex h-[66px] items-end gap-1">
                {STAR_BARS.map((h, i) => (
                  <span
                    key={i}
                    className="block flex-1 rounded-t-[3px] bg-gradient-to-b from-secondary to-primary"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground/70">
                <span>aug 2025</span>
                <span>+128 ★</span>
              </div>
            </MiniPanel>

            <MiniPanel label={t("languages")}>
              <div className="flex h-[9px] overflow-hidden rounded-full">
                <span className="block w-[62%] bg-[#3178c6]" />
                <span className="block w-[21%] bg-[#f1e05a]" />
                <span className="block w-[11%] bg-[#e34c26]" />
                <span className="block w-[6%] bg-violet-500" />
              </div>
              <div className="mt-2.5 flex flex-wrap gap-x-2 gap-y-1 text-[11px] font-medium text-muted-foreground">
                <span className="whitespace-nowrap">● TypeScript 62%</span>
                <span className="whitespace-nowrap">● JavaScript 21%</span>
                <span className="whitespace-nowrap">● HTML 11%</span>
              </div>
            </MiniPanel>
          </div>
        </div>
      </div>
    </section>
  )
}
