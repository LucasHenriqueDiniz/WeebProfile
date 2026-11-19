"use client"

import { Link } from "@/i18n/navigation"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "@/i18n/use-translations"
import { MAX_SVGS_FREE_TIER } from "@/lib/config/plan"
import { BUTTON_PRIMARY, CHIP, HALFTONE, STICKER, TONE } from "@/components/landing/sticker"
import { cn } from "@/lib/utils"

const STEPS = [
  { id: "signIn", tone: TONE.cyan },
  { id: "plugins", tone: TONE.pink },
  { id: "readme", tone: TONE.amber },
] as const

/** Real profile cards, the same SVGs /templates shows, fanned out like stickers on a page. */
const PREVIEWS = [
  { src: "/template-previews/4b63b29a-d0da-4363-a061-1f61f6dc9a05.svg", className: "left-0 top-6 -rotate-6" },
  { src: "/template-previews/97f42207-3990-4faa-ba99-d105b12061eb.svg", className: "right-0 top-0 rotate-3" },
  { src: "/template-previews/6bfb8f10-e367-4c8e-905c-4f209e13f303.svg", className: "left-[18%] top-24 rotate-[-1deg]" },
] as const

/**
 * The library with nothing in it yet: the three steps and the one action on the left,
 * real cards on the right. It used to be a dark banner over a tilted wall of templates,
 * fixed dark whatever the theme; this follows the theme like the rest of the app.
 */
export function DashboardEmptyState() {
  const t = useTranslations("dashboard.emptyState")

  return (
    <div className={cn(STICKER, "relative grid overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)]")}>
      <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-12">
        <span className={cn(CHIP, "uppercase tracking-[0.12em]")}>{t("badge")}</span>
        <h2 className="mt-4 font-heading text-[30px] font-extrabold leading-[1.05] tracking-tight text-foreground md:text-[40px]">
          {t("title")}
        </h2>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">{t("description")}</p>

        <ol className="mt-8 max-w-md space-y-4">
          {STEPS.map((step, i) => (
            <li key={step.id} className="flex gap-3.5">
              <span
                className={cn(
                  "flex h-8 w-8 flex-none items-center justify-center rounded-lg border-2 border-foreground font-mono text-[13px] font-bold text-slate-950",
                  step.tone
                )}
              >
                {i + 1}
              </span>
              <div className="pt-0.5">
                <h3 className="text-[15px] font-semibold text-foreground">{t(`steps.${step.id}.title`)}</h3>
                <p className="mt-0.5 text-[13.5px] leading-relaxed text-muted-foreground">
                  {t(`steps.${step.id}.description`)}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link href="/dashboard/new" className={BUTTON_PRIMARY}>
            {t("cta")}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <span className={cn(CHIP, "font-mono")}>{t("freeTier", { max: MAX_SVGS_FREE_TIER })}</span>
        </div>
      </div>

      <div aria-hidden className="relative hidden min-h-[420px] border-l-2 border-foreground bg-muted/50 lg:block">
        <div
          className={cn(HALFTONE, "inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]")}
        />
        <div className="absolute inset-8">
          {PREVIEWS.map((preview) => (
            <img
              key={preview.src}
              src={preview.src}
              alt=""
              className={cn(
                "absolute h-[300px] w-[62%] object-cover object-top rounded-xl border-2 border-foreground bg-background shadow-[5px_5px_0_0_hsl(var(--primary))]",
                preview.className
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
