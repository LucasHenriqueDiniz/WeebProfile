"use client"

import { useTranslations } from "@/i18n/use-translations"
import { cn } from "@/lib/utils"
import { SectionHeading } from "./SectionHeading"
import { CHIP } from "./sticker"

/** The repository visuals, pinned like stickers: tilt and hard shadow, straight on hover. */
const VISUALS = [
  { file: "banner", className: "-rotate-[1.5deg] shadow-[6px_6px_0_0_hsl(var(--primary))]" },
  { file: "banner_split", className: "rotate-1 shadow-[6px_6px_0_0_#22d3ee]" },
  { file: "banner_centered_gradient", className: "rotate-[1.5deg] shadow-[6px_6px_0_0_hsl(var(--secondary))]" },
  { file: "languages", className: "-rotate-1 shadow-[6px_6px_0_0_hsl(var(--primary))]" },
] as const

export function RepoShowcase() {
  const t = useTranslations("landing.repos")
  const chips = [t("banner"), t("stats"), t("starGrowth"), t("languages"), t("topics")]

  return (
    <section id="repos" className="border-y-2 border-foreground/10 bg-muted/40">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <SectionHeading
              align="left"
              kicker={t("kicker")}
              tone="sky"
              title={t("title")}
              subtitle={t.rich("subtitle", { mode: (c) => <b className="text-foreground">{c}</b> })}
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span key={chip} className={cn(CHIP, "px-3 py-1 text-xs")}>
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Three of the banner's thirteen styles and the languages badges: the real range
              of Repository mode. Two staggered columns, so it is a collage and not a grid. */}
          <div aria-hidden className="grid grid-cols-2 items-start gap-6">
            {[VISUALS.slice(0, 2), VISUALS.slice(2)].map((column, index) => (
              <div key={index} className={cn("flex flex-col gap-6", index === 1 && "mt-10")}>
                {column.map((visual) => (
                  <img
                    key={visual.file}
                    src={`/previews/github_repo/default/${visual.file}.svg`}
                    alt=""
                    loading="lazy"
                    className={cn(
                      "rounded-lg border-2 border-foreground bg-background transition-transform duration-300 hover:rotate-0 hover:scale-[1.03]",
                      visual.className
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
