import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { TONE, type Tone } from "./sticker"

interface SectionHeadingProps {
  kicker: string
  /** The kicker label's colour. */
  tone?: Tone
  title: ReactNode
  subtitle?: ReactNode
  align?: "center" | "left"
}

export function SectionHeading({ kicker, tone = "cyan", title, subtitle, align = "center" }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-[680px]", align === "center" ? "mx-auto text-center" : "")}>
      <div
        className={cn(
          "inline-block -rotate-1 rounded-md border-2 border-foreground px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-950",
          TONE[tone]
        )}
      >
        {kicker}
      </div>
      <h2 className="mt-4 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground [text-wrap:balance] md:text-5xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground [text-wrap:pretty]">{subtitle}</p>
      ) : null}
    </div>
  )
}

/** A word of a section title over a marker stroke, as in the hero's prototypes. */
export function Marker({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span
        aria-hidden
        className="absolute inset-x-[-3%] bottom-[8%] -z-10 h-[36%] -rotate-1 rounded-sm bg-cyan-400/70 dark:bg-cyan-400/40"
      />
      {children}
    </span>
  )
}
