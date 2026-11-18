"use client"

import { ArrowRight, ClipboardCopy, LogIn, Palette, Puzzle } from "lucide-react"
import { useTranslations } from "@/i18n/use-translations"
import { cn } from "@/lib/utils"
import { Marker, SectionHeading } from "./SectionHeading"
import { CHIP, HALFTONE, TILE, TONE, type Tone } from "./sticker"

interface Step {
  tag: string
  title: string
  body: string
}

const STEP_STYLE: Array<{ icon: typeof LogIn; tone: Tone; tilt: string }> = [
  { icon: LogIn, tone: "violet", tilt: "lg:-rotate-[0.6deg]" },
  { icon: Puzzle, tone: "pink", tilt: "lg:rotate-[0.5deg]" },
  { icon: Palette, tone: "amber", tilt: "lg:-rotate-[0.4deg]" },
  { icon: ClipboardCopy, tone: "cyan", tilt: "lg:rotate-[0.6deg]" },
]

/** The steps as a comic strip: four inked panels read left to right, an arrow between each. */
export function HowItWorks() {
  const t = useTranslations("landing.how")
  const steps = (t.raw("steps") as Step[]) ?? []

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
      <SectionHeading
        kicker={t("kicker")}
        tone="amber"
        title={
          <>
            {t("title")} <Marker>{t("titleHighlight")}</Marker>
          </>
        }
        subtitle={t("subtitle")}
      />
      <ol className="mt-12 grid grid-cols-1 gap-x-7 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => {
          const style = STEP_STYLE[index % STEP_STYLE.length]!
          const Icon = style.icon
          return (
            <li key={step.title} className="relative">
              <div
                className={cn(
                  "relative h-full overflow-hidden rounded-xl border-[3px] border-foreground bg-card p-5",
                  style.tilt
                )}
              >
                <div
                  aria-hidden
                  className={`${HALFTONE} -right-8 -top-8 h-28 w-28 rounded-full [mask-image:radial-gradient(circle,black,transparent_70%)]`}
                />
                <div className="relative flex items-center justify-between">
                  <span className={cn(TILE, TONE[style.tone])}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span
                    aria-hidden
                    className="font-heading text-5xl font-black leading-none text-transparent [-webkit-text-stroke:2px_hsl(var(--foreground))]"
                  >
                    {index + 1}
                  </span>
                </div>
                <h3 className="relative mt-4 font-heading text-lg font-bold leading-snug text-foreground">
                  {step.title}
                </h3>
                <p className="relative mt-2 text-[14px] leading-relaxed text-muted-foreground">{step.body}</p>
                <span className={cn(CHIP, "relative mt-4")}>{step.tag}</span>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight
                  aria-hidden
                  strokeWidth={3}
                  className="absolute -right-[23px] top-1/2 hidden h-5 w-5 -translate-y-1/2 text-foreground lg:block"
                />
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
