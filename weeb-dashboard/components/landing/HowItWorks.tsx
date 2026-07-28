"use client"

import { useTranslations } from "@/i18n/use-translations"
import { SectionHeading } from "./SectionHeading"

interface Step {
  tag: string
  title: string
  body: string
}

const STEP_COLORS = ["text-violet-500", "text-violet-400", "text-pink-500", "text-cyan-500"]

export function HowItWorks() {
  const t = useTranslations("landing.how")
  const steps = (t.raw("steps") as Step[]) ?? []

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
      <SectionHeading
        kicker={t("kicker")}
        title={
          <>
            {t("title")}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </>
        }
        subtitle={t("subtitle")}
      />
      <div className="mt-11 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div key={step.title} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <span className={`font-mono text-[13px] font-extrabold ${STEP_COLORS[i % STEP_COLORS.length]}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="whitespace-nowrap rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground/80">
                {step.tag}
              </span>
            </div>
            <h3 className="mt-4 font-heading text-[17px] font-bold text-foreground">{step.title}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
