"use client"

import { ClipboardCopy, LogIn, Palette, Puzzle } from "lucide-react"
import { useTranslations } from "@/i18n/use-translations"
import { SectionHeading } from "./SectionHeading"

interface Step {
  tag: string
  title: string
  body: string
}

const STEP_STYLE = [
  {
    icon: LogIn,
    accent: "text-violet-500",
    tile: "from-violet-500/20 to-violet-500/5 text-violet-500",
    hover: "hover:border-violet-500/50 hover:shadow-[0_10px_40px_-12px_rgba(139,92,246,0.4)]",
  },
  {
    icon: Puzzle,
    accent: "text-fuchsia-500",
    tile: "from-fuchsia-500/20 to-fuchsia-500/5 text-fuchsia-500",
    hover: "hover:border-fuchsia-500/50 hover:shadow-[0_10px_40px_-12px_rgba(217,70,239,0.4)]",
  },
  {
    icon: Palette,
    accent: "text-pink-500",
    tile: "from-pink-500/20 to-pink-500/5 text-pink-500",
    hover: "hover:border-pink-500/50 hover:shadow-[0_10px_40px_-12px_rgba(236,72,153,0.4)]",
  },
  {
    icon: ClipboardCopy,
    accent: "text-cyan-500",
    tile: "from-cyan-500/20 to-cyan-500/5 text-cyan-500",
    hover: "hover:border-cyan-500/50 hover:shadow-[0_10px_40px_-12px_rgba(6,182,212,0.4)]",
  },
]

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
        {steps.map((step, i) => {
          const s = STEP_STYLE[i % STEP_STYLE.length]
          const Icon = s.icon
          return (
            <div
              key={step.title}
              className={`group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 ${s.hover}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br transition-transform group-hover:scale-110 ${s.tile}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className={`font-mono text-sm font-extrabold tracking-wider ${s.accent}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 font-heading text-[17px] font-bold text-foreground">{step.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{step.body}</p>
              <span className="mt-3.5 inline-block whitespace-nowrap rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground/80">
                {step.tag}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
